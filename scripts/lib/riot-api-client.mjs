import {
  MAX_RATE_LIMIT_RETRIES_PER_REQUEST,
  RiotRateLimitError,
  sharedRiotRateLimiter,
} from "./riot-rate-limiter.mjs";

// Script-only Riot client. Do not import this from public UI code.
export class RiotApiError extends Error {
  constructor(message, { retryAfterMs = null, status, url }) {
    super(message);
    this.name = "RiotApiError";
    this.retryAfterMs = retryAfterMs;
    this.status = status;
    this.url = url;
  }
}

export class RiotApiClient {
  constructor({
    apiKey,
    rateLimitContext = {},
    rateLimiter = sharedRiotRateLimiter,
    regionalRoute = "europe",
    retryOnRateLimit = true,
    requestDelayMs = 1200,
  }) {
    if (!apiKey) {
      throw new Error("Missing Riot API key.");
    }

    this.apiKey = apiKey;
    this.rateLimitContext = rateLimitContext;
    this.rateLimiter = rateLimiter;
    this.regionalRoute = regionalRoute;
    this.retryOnRateLimit = retryOnRateLimit;
    this.requestDelayMs = requestDelayMs;
  }

  async fetchRecentRankedMatchIdsByPuuid({ count, puuid, queue = 420, start = 0 }) {
    const searchParams = new URLSearchParams({
      count: String(count),
      queue: String(queue),
      start: String(start),
    });

    return this.fetchJson(
      `https://${this.regionalRoute}.api.riotgames.com/lol/match/v5/matches/by-puuid/${encodeURIComponent(
        puuid,
      )}/ids?${searchParams.toString()}`,
      {
        endpointGroup: "match-v5-match-ids",
      },
    );
  }

  async fetchMatch(matchId) {
    return this.fetchJson(
      `https://${this.regionalRoute}.api.riotgames.com/lol/match/v5/matches/${encodeURIComponent(
        matchId,
      )}`,
      {
        endpointGroup: "match-v5-match-detail",
      },
    );
  }

  async fetchAccountByRiotId({ gameName, tagLine }) {
    return this.fetchJson(
      `https://${this.regionalRoute}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
        gameName,
      )}/${encodeURIComponent(tagLine)}`,
      {
        endpointGroup: "account-v1-riot-id",
      },
    );
  }

  async fetchLeagueEntriesByPuuid({ platformRegion, puuid }) {
    return this.fetchJson(
      `https://${String(platformRegion).toLowerCase()}.api.riotgames.com/lol/league/v4/entries/by-puuid/${encodeURIComponent(
        puuid,
      )}`,
      {
        endpointGroup: "league-v4-entries-by-puuid",
        retryOnRateLimit: false,
      },
    );
  }

  async fetchLeagueEntriesByTierDivision({
    division,
    page = 1,
    platformRegion,
    queue = "RANKED_SOLO_5x5",
    tier,
  }) {
    const searchParams = new URLSearchParams({
      page: String(page),
    });

    return this.fetchJson(
      `https://${String(platformRegion).toLowerCase()}.api.riotgames.com/lol/league/v4/entries/${encodeURIComponent(
        queue,
      )}/${encodeURIComponent(tier)}/${encodeURIComponent(division)}?${searchParams.toString()}`,
      {
        endpointGroup: "league-v4-ladder",
        retryOnRateLimit: false,
      },
    );
  }

  async fetchHighTierLeagueEntries({ platformRegion, queue = "RANKED_SOLO_5x5", tier }) {
    const normalizedTier = String(tier ?? "")
      .trim()
      .toLowerCase();

    return this.fetchJson(
      `https://${String(platformRegion).toLowerCase()}.api.riotgames.com/lol/league/v4/${encodeURIComponent(
        normalizedTier,
      )}leagues/by-queue/${encodeURIComponent(queue)}`,
      {
        endpointGroup: "league-v4-high-tier-ladder",
        retryOnRateLimit: false,
      },
    );
  }

  async fetchSummonerByEncryptedId({ encryptedSummonerId, platformRegion }) {
    return this.fetchJson(
      `https://${String(platformRegion).toLowerCase()}.api.riotgames.com/lol/summoner/v4/summoners/${encodeURIComponent(
        encryptedSummonerId,
      )}`,
      {
        endpointGroup: "summoner-v4-encrypted-id",
        retryOnRateLimit: false,
      },
    );
  }

  async fetchJson(
    url,
    { endpointGroup = "unknown", retryOnRateLimit = this.retryOnRateLimit } = {},
  ) {
    for (
      let retryAttempt = 0;
      retryAttempt <= MAX_RATE_LIMIT_RETRIES_PER_REQUEST;
      retryAttempt += 1
    ) {
      await this.rateLimiter.acquire({
        ...this.rateLimitContext,
        endpointGroup,
        retryAttempt,
      });
      this.rateLimiter.recordDispatchedRequest({
        ...this.rateLimitContext,
        endpointGroup,
        retryAttempt,
      });

      const response = await fetch(url, {
        headers: {
          "X-Riot-Token": this.apiKey,
        },
      });
      const rateLimitResult = this.rateLimiter.observeResponse(response, {
        ...this.rateLimitContext,
        endpointGroup,
        retryAttempt,
      });

      if (response.status === 429 && retryOnRateLimit) {
        if (retryAttempt >= MAX_RATE_LIMIT_RETRIES_PER_REQUEST) {
          throw new RiotRateLimitError(
            `Riot API rate limit persisted after ${MAX_RATE_LIMIT_RETRIES_PER_REQUEST} retries for ${redactUrl(
              url,
            )}`,
            {
              endpointGroup,
              rateLimitType: "unknown",
              retryAfterMs: rateLimitResult.retryAfterMs,
            },
          );
        }

        this.rateLimiter.recordRetry();
        continue;
      }

      if (!response.ok) {
        throw new RiotApiError(
          `Riot API request failed (${response.status}) for ${redactUrl(url)}`,
          {
            retryAfterMs: rateLimitResult.retryAfterMs,
            status: response.status,
            url: redactUrl(url),
          },
        );
      }

      return response.json();
    }

    throw new RiotRateLimitError(`Riot API rate limit persisted for ${redactUrl(url)}`, {
      endpointGroup,
    });
  }
}

export function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function redactUrl(url) {
  return url.replace(/api_key=[^&]+/gi, "api_key=<redacted>");
}
