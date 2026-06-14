// Script-only Riot client. Do not import this from public UI code.
export class RiotApiError extends Error {
  constructor(message, { status, url }) {
    super(message);
    this.name = "RiotApiError";
    this.status = status;
    this.url = url;
  }
}

export class RiotApiClient {
  constructor({
    apiKey,
    regionalRoute = "europe",
    requestDelayMs = 1200,
  }) {
    if (!apiKey) {
      throw new Error("Missing Riot API key.");
    }

    this.apiKey = apiKey;
    this.regionalRoute = regionalRoute;
    this.requestDelayMs = requestDelayMs;
    this.nextRequestAt = 0;
  }

  async fetchRecentRankedMatchIdsByPuuid({
    count,
    puuid,
    queue = 420,
    start = 0,
  }) {
    const searchParams = new URLSearchParams({
      count: String(count),
      queue: String(queue),
      start: String(start),
    });

    return this.fetchJson(
      `https://${this.regionalRoute}.api.riotgames.com/lol/match/v5/matches/by-puuid/${encodeURIComponent(
        puuid,
      )}/ids?${searchParams.toString()}`,
    );
  }

  async fetchMatch(matchId) {
    return this.fetchJson(
      `https://${this.regionalRoute}.api.riotgames.com/lol/match/v5/matches/${encodeURIComponent(
        matchId,
      )}`,
    );
  }

  async fetchAccountByRiotId({ gameName, tagLine }) {
    return this.fetchJson(
      `https://${this.regionalRoute}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
        gameName,
      )}/${encodeURIComponent(tagLine)}`,
    );
  }

  async fetchJson(url) {
    await this.waitForRateLimitSlot();

    const response = await fetch(url, {
      headers: {
        "X-Riot-Token": this.apiKey,
      },
    });

    if (response.status === 429) {
      const retryAfterSeconds = Number(response.headers.get("retry-after") ?? 2);
      const retryAfterMs = Math.max(retryAfterSeconds * 1000, this.requestDelayMs);

      console.log(`Riot rate limit hit. Waiting ${retryAfterMs}ms before retrying.`);
      await wait(retryAfterMs);

      return this.fetchJson(url);
    }

    if (!response.ok) {
      throw new RiotApiError(
        `Riot API request failed (${response.status}) for ${redactUrl(url)}`,
        {
          status: response.status,
          url: redactUrl(url),
        },
      );
    }

    return response.json();
  }

  async waitForRateLimitSlot() {
    const now = Date.now();
    const waitMs = Math.max(this.nextRequestAt - now, 0);

    if (waitMs > 0) {
      await wait(waitMs);
    }

    this.nextRequestAt = Date.now() + this.requestDelayMs;
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
