export const RIOT_RATE_LIMITS = {
  shortWindow: {
    maxRequests: 20,
    windowMs: 1_000,
  },
  longWindow: {
    maxRequests: 100,
    windowMs: 120_000,
  },
};

export const DEFAULT_RIOT_RATE_LIMIT_SAFETY_FACTOR = 0.85;
export const MAX_RATE_LIMIT_RETRIES_PER_REQUEST = 3;
export const RIOT_REQUEST_RESERVATION_TIMEOUT_MS = 10_000;
const defaultWaitChunkMs = 500;

export class RiotRateLimitError extends Error {
  constructor(message, { endpointGroup, retryAfterMs = null, rateLimitType = "unknown" } = {}) {
    super(message);
    this.name = "RiotRateLimitError";
    this.endpointGroup = endpointGroup;
    this.rateLimitType = rateLimitType;
    this.retryAfterMs = retryAfterMs;
    this.status = 429;
  }
}

export class RiotRateLimiter {
  constructor({
    clock = {
      now: () => Date.now(),
      sleep: (ms) => wait(ms),
    },
    limits = RIOT_RATE_LIMITS,
    logger = console,
    safetyFactor = getConfiguredRiotRateLimitSafetyFactor(),
    waitChunkMs = defaultWaitChunkMs,
  } = {}) {
    this.clock = clock;
    this.configuredLimits = normalizeLimitWindows(limits, safetyFactor);
    this.headerWindows = [];
    this.logger = logger;
    this.requestTimestamps = [];
    this.retryAfterUntil = 0;
    this.queue = Promise.resolve();
    this.waitChunkMs = waitChunkMs;
    this.stats = {
      lastRiotRequestAt: null,
      retries: 0,
      riot429Responses: 0,
    };
  }

  getSnapshot(now = this.clock.now()) {
    this.prune(now);
    const shortLimit = this.getConfiguredWindow("short");
    const longLimit = this.getConfiguredWindow("long");
    const nextAvailableAt = this.getNextAvailableAt(now);

    return {
      activeHeaderWindows: this.getActiveHeaderWindowSnapshots(now),
      activeRequestTimestamps: [...this.requestTimestamps],
      lastRiotRequestAt: this.stats.lastRiotRequestAt,
      longWindowLimit: longLimit.maxRequests,
      longWindowUsage: this.getWindowUsageForLimit(longLimit, now),
      nextAvailableAt:
        nextAvailableAt > now
          ? new Date(nextAvailableAt).toISOString()
          : new Date(now).toISOString(),
      reservations: [],
      retries: this.stats.retries,
      retryAfterUntil:
        this.retryAfterUntil > now ? new Date(this.retryAfterUntil).toISOString() : null,
      riot429Responses: this.stats.riot429Responses,
      shortWindowLimit: shortLimit.maxRequests,
      shortWindowUsage: this.getWindowUsageForLimit(shortLimit, now),
      waitUntil: nextAvailableAt > now ? new Date(nextAvailableAt).toISOString() : null,
    };
  }

  async acquire(context = {}) {
    const run = async () => this.waitForCapacity(context);
    const result = this.queue.then(run, run);
    this.queue = result.catch(() => {});

    return result;
  }

  recordDispatchedRequest() {
    const now = this.clock.now();

    this.prune(now);
    this.requestTimestamps.push(now);
    this.stats.lastRiotRequestAt = new Date(now).toISOString();

    return this.getSnapshot(now);
  }

  observeResponse(response, context = {}) {
    this.applyLimitHeaders(response?.headers);

    if (response?.status === 429) {
      const retryAfterMs = parseRetryAfterMs(response.headers, this.clock.now());
      this.observeRateLimit({ retryAfterMs, response, context });
      return {
        retryAfterMs,
        snapshot: this.getSnapshot(),
      };
    }

    return {
      retryAfterMs: null,
      snapshot: this.getSnapshot(),
    };
  }

  observeRateLimit({ context = {}, response = null, retryAfterMs = null } = {}) {
    this.applyLimitHeaders(response?.headers);
    const waitMs = Math.max(Number(retryAfterMs ?? 0), 1_000);

    this.retryAfterUntil = Math.max(this.retryAfterUntil, this.clock.now() + waitMs);
    this.stats.riot429Responses += 1;

    this.logger.warn?.("Riot API returned 429", {
      endpointGroup: context.endpointGroup ?? "unknown",
      rateLimitType: getRiotRateLimitType(response),
      retryAfterMs: waitMs,
      retryAttempt: context.retryAttempt ?? 0,
    });

    return waitMs;
  }

  recordRetry() {
    this.stats.retries += 1;
  }

  async waitForCapacity(context) {
    let waitEpisodeStarted = false;
    let waitUpdateSent = false;
    let waitStartedAt = 0;
    let totalWaitMs = 0;

    while (true) {
      await assertRequestStillAllowed(context);

      const now = this.clock.now();
      this.prune(now);
      const waitMs = this.getWaitMs(now);

      if (waitMs <= 0) {
        if (waitEpisodeStarted) {
          this.logger.info?.("Riot rate-limit wait ended", {
            collectionJobId: context.collectionJobId ?? null,
            scanJobId: context.scanJobId ?? null,
            waitedMs: this.clock.now() - waitStartedAt,
          });
        }

        return this.getSnapshot(now);
      }

      const waitUntil = new Date(now + waitMs).toISOString();

      if (!waitEpisodeStarted) {
        waitEpisodeStarted = true;
        waitStartedAt = now;
        this.logger.info?.("Riot rate-limit wait started", {
          collectionJobId: context.collectionJobId ?? null,
          limitingWindow: this.getLimitingWindow(now),
          nextAvailableAt: waitUntil,
          scanJobId: context.scanJobId ?? null,
        });
      }

      totalWaitMs += waitMs;
      await context.onWait?.({
        ...this.getSnapshot(now),
        endpointGroup: context.endpointGroup ?? "unknown",
        requestDelayed: !waitUpdateSent,
        totalWaitMs,
        waitEpisodeStarted: !waitUpdateSent,
        waitMs,
        waitUntil,
      });
      waitUpdateSent = true;

      await this.sleepInterruptibly(waitMs, context);
    }
  }

  async sleepInterruptibly(waitMs, context) {
    const deadline = this.clock.now() + waitMs;

    while (this.clock.now() < deadline) {
      await assertRequestStillAllowed(context);
      await this.clock.sleep(Math.min(this.waitChunkMs, Math.max(deadline - this.clock.now(), 0)));
    }
  }

  getWaitMs(now) {
    const retryAfterWaitMs = Math.max(this.retryAfterUntil - now, 0);
    const windowWaitMs = this.getActiveWindows(now).reduce((waitMs, limit) => {
      const usage = this.getWindowUsageForLimit(limit, now);

      if (usage < limit.maxRequests) {
        return waitMs;
      }

      const oldestLocalRequest = this.requestTimestamps.find(
        (timestamp) => now - timestamp < limit.windowMs,
      );
      const localWaitMs =
        typeof oldestLocalRequest === "number" ? oldestLocalRequest + limit.windowMs - now : 0;
      const headerWaitMs =
        limit.source === "header" && limit.expiresAt > now ? limit.expiresAt - now : 0;

      return Math.max(waitMs, localWaitMs, headerWaitMs);
    }, 0);

    return Math.max(retryAfterWaitMs, windowWaitMs);
  }

  getNextAvailableAt(now) {
    return now + this.getWaitMs(now);
  }

  getLimitingWindow(now) {
    const windows = this.getActiveWindows(now)
      .map((limit) => ({
        scope: limit.scope,
        usage: this.getWindowUsageForLimit(limit, now),
        windowMs: limit.windowMs,
        limit: limit.maxRequests,
      }))
      .filter((window) => window.usage >= window.limit)
      .sort((left, right) => right.windowMs - left.windowMs);

    return windows[0] ?? null;
  }

  getConfiguredWindow(kind) {
    return this.configuredLimits.find((limit) => limit.kind === kind);
  }

  getActiveWindows(now) {
    this.prune(now);

    return [...this.configuredLimits, ...this.headerWindows];
  }

  getWindowUsageForLimit(limit, now) {
    const localUsage = this.requestTimestamps.filter(
      (timestamp) => now - timestamp < limit.windowMs,
    ).length;
    const observedUsage =
      limit.source === "header" && limit.expiresAt > now ? (limit.observedCount ?? 0) : 0;

    return Math.max(localUsage, observedUsage);
  }

  getActiveHeaderWindowSnapshots(now) {
    return this.headerWindows.map((window) => ({
      count: this.getWindowUsageForLimit(window, now),
      expiresAt: new Date(window.expiresAt).toISOString(),
      limit: window.maxRequests,
      observedAt: new Date(window.observedAt).toISOString(),
      scope: window.scope,
      windowMs: window.windowMs,
    }));
  }

  prune(now) {
    const longestWindowMs = Math.max(...this.getAllKnownWindows().map((limit) => limit.windowMs));
    const previousRequestCount = this.requestTimestamps.length;
    const previousHeaderWindowCount = this.headerWindows.length;

    this.requestTimestamps = this.requestTimestamps.filter(
      (timestamp) => now - timestamp < longestWindowMs,
    );
    this.headerWindows = this.headerWindows.filter((window) => window.expiresAt > now);

    const expiredRequestEntries = previousRequestCount - this.requestTimestamps.length;
    const expiredHeaderWindows = previousHeaderWindowCount - this.headerWindows.length;

    if (expiredRequestEntries > 0 || expiredHeaderWindows > 0) {
      this.logger.warn?.("Pruned stale Riot limiter state", {
        expiredHeaderWindows,
        expiredRequestEntries,
        expiredReservations: 0,
      });
    }

    if (this.retryAfterUntil <= now) {
      this.retryAfterUntil = 0;
    }
  }

  getAllKnownWindows() {
    return [...this.configuredLimits, ...this.headerWindows];
  }

  applyLimitHeaders(headers) {
    const now = this.clock.now();
    const headerWindows = [
      ...createHeaderWindows({
        countHeader: headers?.get?.("x-app-rate-limit-count"),
        limitHeader: headers?.get?.("x-app-rate-limit"),
        now,
        scope: "application",
      }),
      ...createHeaderWindows({
        countHeader: headers?.get?.("x-method-rate-limit-count"),
        limitHeader: headers?.get?.("x-method-rate-limit"),
        now,
        scope: "method",
      }),
    ];

    if (headerWindows.length === 0) {
      return;
    }

    this.headerWindows = [...this.headerWindows, ...headerWindows]
      .filter((window) => window.expiresAt > now)
      .sort((left, right) => left.expiresAt - right.expiresAt);
  }
}

export const sharedRiotRateLimiter = new RiotRateLimiter();

export function getConfiguredRiotRateLimitSafetyFactor() {
  const configured = Number(process.env.RIOT_RATE_LIMIT_SAFETY_FACTOR);

  if (!Number.isFinite(configured) || configured <= 0 || configured > 1) {
    return DEFAULT_RIOT_RATE_LIMIT_SAFETY_FACTOR;
  }

  return configured;
}

export function getEffectiveRiotRateLimits({
  limits = RIOT_RATE_LIMITS,
  safetyFactor = getConfiguredRiotRateLimitSafetyFactor(),
} = {}) {
  return normalizeLimitWindows(limits, safetyFactor);
}

export function parseRiotLimitHeader(value) {
  if (!value || typeof value !== "string") {
    return [];
  }

  return value
    .split(",")
    .map((entry) => {
      const [maxRequests, windowSeconds] = entry.split(":").map((part) => Number(part.trim()));

      if (!Number.isFinite(maxRequests) || !Number.isFinite(windowSeconds)) {
        return null;
      }

      return {
        maxRequests: Math.max(Math.floor(maxRequests), 1),
        windowMs: Math.max(Math.floor(windowSeconds * 1000), 1),
      };
    })
    .filter(Boolean);
}

export function parseRiotLimitCountHeader(value) {
  if (!value || typeof value !== "string") {
    return [];
  }

  return value
    .split(",")
    .map((entry) => {
      const [count, windowSeconds] = entry.split(":").map((part) => Number(part.trim()));

      if (!Number.isFinite(count) || !Number.isFinite(windowSeconds)) {
        return null;
      }

      return {
        count: Math.max(Math.floor(count), 0),
        windowMs: Math.max(Math.floor(windowSeconds * 1000), 1),
      };
    })
    .filter(Boolean);
}

export function parseRetryAfterMs(headers, now = Date.now()) {
  const retryAfterValue = headers?.get?.("retry-after");
  const retryAfterSeconds = Number(retryAfterValue);

  if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds >= 0) {
    return Math.ceil(retryAfterSeconds * 1000);
  }

  const retryAfterDate = Date.parse(String(retryAfterValue ?? ""));

  if (Number.isFinite(retryAfterDate)) {
    return Math.max(retryAfterDate - now, 0);
  }

  return 1_000;
}

function createHeaderWindows({ countHeader, limitHeader, now, scope }) {
  const limits = parseRiotLimitHeader(limitHeader);
  const counts = parseRiotLimitCountHeader(countHeader);

  return limits.map((limit) => {
    const matchingCount = counts.find((count) => count.windowMs === limit.windowMs);

    return {
      ...limit,
      expiresAt: now + limit.windowMs,
      kind: limit.windowMs <= RIOT_RATE_LIMITS.shortWindow.windowMs ? "short" : "long",
      observedAt: now,
      observedCount: matchingCount?.count ?? 0,
      scope,
      source: "header",
    };
  });
}

function normalizeLimitWindows(limits, safetyFactor) {
  return [
    {
      kind: "short",
      maxRequests: applySafetyFactor(limits.shortWindow.maxRequests, safetyFactor),
      scope: "application",
      source: "configured",
      windowMs: limits.shortWindow.windowMs,
    },
    {
      kind: "long",
      maxRequests: applySafetyFactor(limits.longWindow.maxRequests, safetyFactor),
      scope: "application",
      source: "configured",
      windowMs: limits.longWindow.windowMs,
    },
  ];
}

function applySafetyFactor(maxRequests, safetyFactor) {
  return Math.max(Math.floor(maxRequests * safetyFactor), 1);
}

async function assertRequestStillAllowed(context) {
  if (typeof context.shouldContinue !== "function") {
    return;
  }

  const allowed = await context.shouldContinue();

  if (allowed === false) {
    throw new Error("Riot request cancelled by control state.");
  }
}

function getRiotRateLimitType(response) {
  const type = response?.headers?.get?.("x-rate-limit-type");

  return type || "unknown";
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
