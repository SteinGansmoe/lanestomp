import assert from "node:assert/strict";

import {
  getEffectiveRiotRateLimits,
  parseRiotLimitCountHeader,
  parseRiotLimitHeader,
  RiotRateLimiter,
} from "./lib/riot-rate-limiter.mjs";

testEffectiveLimits();
await testCapacityChecksDoNotConsumeBudget();
await testShortWindow();
await testLongWindow();
await testHeaderTighteningExpires();
await testRetryAfterWait();
await testControlInterruptsWaitWithoutPhantomUsage();
await testIdleWindowResetRegression();

console.log("Riot rate limiter regression tests passed.");

function createFakeClock() {
  return {
    sleptMs: 0,
    time: 0,
    now() {
      return this.time;
    },
    async sleep(ms) {
      this.sleptMs += ms;
      this.time += ms;
    },
    advance(ms) {
      this.time += ms;
    },
  };
}

function createSilentLogger() {
  return {
    info() {},
    warn() {},
  };
}

function createHeaders(values) {
  return {
    get(name) {
      return values[String(name).toLowerCase()] ?? null;
    },
  };
}

async function dispatch(limiter, context = {}) {
  await limiter.acquire(context);
  limiter.recordDispatchedRequest(context);
}

function testEffectiveLimits() {
  const limits = getEffectiveRiotRateLimits();

  assert.equal(limits.find((limit) => limit.kind === "short").maxRequests, 17);
  assert.equal(limits.find((limit) => limit.kind === "long").maxRequests, 85);
  assert.deepEqual(parseRiotLimitHeader("20:1,100:120"), [
    {
      maxRequests: 20,
      windowMs: 1_000,
    },
    {
      maxRequests: 100,
      windowMs: 120_000,
    },
  ]);
  assert.deepEqual(parseRiotLimitCountHeader("3:1,20:120"), [
    {
      count: 3,
      windowMs: 1_000,
    },
    {
      count: 20,
      windowMs: 120_000,
    },
  ]);
  assert.deepEqual(parseRiotLimitHeader("bad,nope"), []);
}

async function testCapacityChecksDoNotConsumeBudget() {
  const clock = createFakeClock();
  const limiter = new RiotRateLimiter({ clock, logger: createSilentLogger() });

  for (let index = 0; index < 100; index += 1) {
    await limiter.acquire({ endpointGroup: "test" });
  }

  assert.equal(limiter.getSnapshot().shortWindowUsage, 0);
  assert.equal(limiter.getSnapshot().longWindowUsage, 0);
}

async function testShortWindow() {
  const clock = createFakeClock();
  const limiter = new RiotRateLimiter({ clock, logger: createSilentLogger() });

  for (let index = 0; index < 17; index += 1) {
    await dispatch(limiter, { endpointGroup: "test" });
  }

  assert.equal(clock.sleptMs, 0);
  await dispatch(limiter, { endpointGroup: "test" });
  assert.equal(clock.sleptMs, 1_000);
  assert.equal(limiter.getSnapshot().shortWindowUsage, 1);
}

async function testLongWindow() {
  const clock = createFakeClock();
  const limiter = new RiotRateLimiter({
    clock,
    limits: {
      longWindow: {
        maxRequests: 100,
        windowMs: 120_000,
      },
      shortWindow: {
        maxRequests: 1_000,
        windowMs: 1_000,
      },
    },
    logger: createSilentLogger(),
  });

  for (let index = 0; index < 85; index += 1) {
    await dispatch(limiter, { endpointGroup: "test" });
  }

  await dispatch(limiter, { endpointGroup: "test" });
  assert.equal(clock.time, 120_000);
}

async function testHeaderTighteningExpires() {
  const clock = createFakeClock();
  const limiter = new RiotRateLimiter({ clock, logger: createSilentLogger() });

  limiter.observeResponse({
    headers: createHeaders({
      "x-method-rate-limit": "20:120",
      "x-method-rate-limit-count": "20:120",
    }),
    status: 200,
  });

  assert.equal(limiter.getSnapshot().longWindowLimit, 85);
  assert.equal(limiter.getSnapshot().activeHeaderWindows[0].limit, 20);
  assert.equal(limiter.getSnapshot().activeHeaderWindows[0].scope, "method");

  await limiter.acquire({ endpointGroup: "test" });
  assert.equal(clock.sleptMs, 120_000);
  clock.advance(1);
  assert.equal(limiter.getSnapshot().activeHeaderWindows.length, 0);
}

async function testRetryAfterWait() {
  const clock = createFakeClock();
  const limiter = new RiotRateLimiter({ clock, logger: createSilentLogger() });

  limiter.observeResponse({
    headers: createHeaders({
      "retry-after": "3",
    }),
    status: 429,
  });
  await dispatch(limiter, { endpointGroup: "test" });

  assert.equal(clock.sleptMs, 3_000);
}

async function testControlInterruptsWaitWithoutPhantomUsage() {
  const clock = createFakeClock();
  const limiter = new RiotRateLimiter({ clock, logger: createSilentLogger() });

  limiter.observeResponse({
    headers: createHeaders({
      "retry-after": "3",
    }),
    status: 429,
  });

  await assert.rejects(
    () =>
      limiter.acquire({
        endpointGroup: "test",
        shouldContinue: () => false,
      }),
    /cancelled by control state/,
  );
  assert.equal(limiter.getSnapshot().shortWindowUsage, 0);
  assert.equal(limiter.getSnapshot().longWindowUsage, 0);
}

async function testIdleWindowResetRegression() {
  const clock = createFakeClock();
  const limiter = new RiotRateLimiter({
    clock,
    limits: {
      longWindow: {
        maxRequests: 100,
        windowMs: 120_000,
      },
      shortWindow: {
        maxRequests: 1_000,
        windowMs: 1_000,
      },
    },
    logger: createSilentLogger(),
  });

  for (let index = 0; index < 85; index += 1) {
    await dispatch(limiter, { endpointGroup: "test" });
  }

  clock.advance(120_001);
  assert.equal(limiter.getSnapshot().longWindowUsage, 0);

  const sleptBeforeRequest = clock.sleptMs;
  await dispatch(limiter, { endpointGroup: "new-collection-first-request" });
  assert.equal(clock.sleptMs, sleptBeforeRequest);
}
