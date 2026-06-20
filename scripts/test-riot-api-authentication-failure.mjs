import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  classifyRiotApiResponse,
  isRiotApiAuthenticationError,
  RiotApiClient,
  RiotApiError,
} from "./lib/riot-api-client.mjs";
import { RiotRateLimitError } from "./lib/riot-rate-limiter.mjs";

await testAuthenticationClassification();
await testAccessDeniedClassification();
await testRateLimitStillUsesRateLimitError();
testScanAndCollectionWiringGuards();

console.log("Riot API authentication failure regression tests passed.");

async function testAuthenticationClassification() {
  const error = await fetchFailure({ status: 401 });

  assert.equal(error instanceof RiotApiError, true);
  assert.equal(error.code, "riot-authentication-failed");
  assert.equal(error.status, 401);
  assert.equal(error.endpointGroup, "match-v5-match-ids");
  assert.equal(error.retryable, false);
  assert.equal(isRiotApiAuthenticationError(error), true);
  assert.match(error.message, /authentication failed/i);
  assert.doesNotMatch(error.message, /RGAPI-secret/i);
  assert.doesNotMatch(String(error.responseSummary), /RGAPI-secret/i);
}

async function testAccessDeniedClassification() {
  const error = await fetchFailure({ status: 403 });

  assert.equal(error.code, "riot-access-denied");
  assert.equal(error.status, 403);
  assert.equal(error.retryable, false);
  assert.equal(isRiotApiAuthenticationError(error), true);
  assert.match(error.message, /access was denied/i);
  assert.deepEqual(classifyRiotApiResponse({ endpointGroup: "match-v5", status: 403 }), {
    code: "riot-access-denied",
    endpointGroup: "match-v5",
    message:
      "Riot API access was denied. Check whether the API key has expired or lacks access to this endpoint.",
    retryable: false,
  });
}

async function testRateLimitStillUsesRateLimitError() {
  const originalFetch = globalThis.fetch;
  const rateLimiter = createTestRateLimiter();

  globalThis.fetch = async () =>
    createResponse({
      body: { status: { message: "Rate limited", status_code: 429 } },
      status: 429,
    });

  try {
    const client = new RiotApiClient({
      apiKey: "RGAPI-secret",
      rateLimiter,
      regionalRoute: "europe",
    });

    await assert.rejects(
      () => client.fetchRecentRankedMatchIdsByPuuid({ count: 1, puuid: "puuid", queue: 420 }),
      (error) => {
        assert.equal(error instanceof RiotRateLimitError, true);
        assert.equal(error.status, 429);
        assert.equal(error.endpointGroup, "match-v5-match-ids");
        return true;
      },
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
}

function testScanAndCollectionWiringGuards() {
  const actionsSource = readFileSync(
    new URL("../src/app/admin/league/counter-picks/actions.ts", import.meta.url),
    "utf8",
  );
  const collectionSource = readFileSync(
    new URL("../src/features/league/riot-collection-jobs.ts", import.meta.url),
    "utf8",
  );
  const panelSource = readFileSync(
    new URL("../src/components/admin/league/riot-match-scanner-panel.tsx", import.meta.url),
    "utf8",
  );

  assert.equal(actionsSource.includes("isRiotApiAuthenticationError(error)"), true);
  assert.equal(actionsSource.includes('stopReason: "riot-api-authentication-failed"'), true);
  assert.equal(actionsSource.includes('aggregationSkippedReason: "upstream-riot-authentication-failure"'), true);
  assert.equal(collectionSource.includes('"riot-api-authentication-failed"'), true);
  assert.equal(panelSource.includes("Riot API Authentication Failed"), true);
}

async function fetchFailure({ status }) {
  const originalFetch = globalThis.fetch;
  const rateLimiter = createTestRateLimiter();

  globalThis.fetch = async () =>
    createResponse({
      body: {
        status: {
          message: "Rejected RGAPI-secret token",
          status_code: status,
        },
      },
      status,
    });

  try {
    const client = new RiotApiClient({
      apiKey: "RGAPI-secret",
      rateLimiter,
      regionalRoute: "europe",
    });

    await client.fetchRecentRankedMatchIdsByPuuid({ count: 1, puuid: "puuid", queue: 420 });
    throw new Error("Expected Riot request to fail.");
  } catch (error) {
    return error;
  } finally {
    globalThis.fetch = originalFetch;
  }
}

function createTestRateLimiter() {
  return {
    async acquire() {},
    observeResponse() {
      return {
        retryAfterMs: 50,
      };
    },
    recordDispatchedRequest() {},
    recordRetry() {},
  };
}

function createResponse({ body, status }) {
  return {
    headers: {
      get(name) {
        return String(name).toLowerCase() === "content-type" ? "application/json" : null;
      },
    },
    ok: status >= 200 && status < 300,
    async json() {
      return body;
    },
    status,
  };
}
