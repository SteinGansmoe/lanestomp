import assert from "node:assert/strict";

import { writeResilientBatches } from "./lib/riot-batch-isolation.mjs";

const quietLogger = {
  warn() {},
};
const noSleep = async () => {};
const noJitter = () => 0;

export async function runBatchIsolationScenarios() {
  const results = [];

  results.push(await testAllRowsSucceed());
  results.push(await testOneRowFails());
  results.push(await testSeveralRowsFail());
  results.push(await testPayloadBatchSplit());
  results.push(await testTransientRecovery());
  results.push(await testAuthenticationFailFast());
  results.push(await testSchemaFailFast());
  results.push(await testMaximumDepthReached());
  results.push(await testDuplicateRows());
  results.push(await testStableIdentities());
  results.push(await testSystemicThreshold());
  results.push(await testRecoveryFixture());

  return summarizeScenarioResults(results);
}

if (isDirectExecution()) {
  const result = await runBatchIsolationScenarios();

  if (!result.ok) {
    console.error("Riot batch isolation regression tests failed.", result);
    process.exit(1);
  }

  console.log("Riot batch isolation regression tests passed.");
}

async function testAllRowsSucceed() {
  const rows = makeRows(250);
  const result = await runWriter({
    rows,
    writeBatch: createStoredSetWriter(),
  });

  assert.equal(result.batchAttempts, 1);
  assert.equal(result.inserted, 250);
  assert.equal(result.splitOperations, 0);
  assertAccounting(result);

  return pass("all rows succeed", result);
}

async function testOneRowFails() {
  const rows = makeRows(250);
  const result = await runWriter({
    rows,
    writeBatch: createFailingRowWriter(new Set(["row-124"])),
  });

  assert.equal(result.inserted, 249);
  assert.equal(result.isolatedFailureCount, 1);
  assert.equal(result.isolatedFailures[0].rowIdentity, "row-124");
  assert.ok(result.splitOperations > 0);
  assertAccounting(result);

  return pass("one row fails", result);
}

async function testSeveralRowsFail() {
  const failingIds = new Set(["row-005", "row-017", "row-099", "row-160", "row-249"]);
  const rows = makeRows(250);
  const result = await runWriter({
    rows,
    writeBatch: createFailingRowWriter(failingIds),
  });

  assert.equal(result.inserted, 245);
  assert.equal(result.isolatedFailureCount, 5);
  assert.equal(new Set(result.isolatedFailures.map((failure) => failure.rowIdentity)).size, 5);
  assertAccounting(result);

  return pass("several rows fail", result);
}

async function testPayloadBatchSplit() {
  const rows = makeRows(250);
  const result = await runWriter({
    rows,
    writeBatch: async (batch) => {
      if (batch.length > 100) {
        return {
          error: { message: "Payload too large", status: 413 },
          ok: false,
        };
      }

      return {
        inserted: batch.length,
        insertedRows: batch,
        ok: true,
      };
    },
  });

  assert.equal(result.inserted, 250);
  assert.equal(result.isolatedFailureCount, 0);
  assert.ok(result.splitOperations > 0);
  assertAccounting(result);

  return pass("payload split", result);
}

async function testTransientRecovery() {
  const rows = makeRows(25);
  let attempts = 0;
  const result = await runWriter({
    rows,
    writeBatch: async (batch) => {
      attempts += 1;

      if (attempts <= 2) {
        return {
          error: { message: "Temporary database unavailable", status: 503 },
          ok: false,
        };
      }

      return {
        inserted: batch.length,
        insertedRows: batch,
        ok: true,
      };
    },
  });

  assert.equal(result.batchAttempts, 3);
  assert.equal(result.transientRetries, 2);
  assert.equal(result.splitOperations, 0);
  assert.equal(result.inserted, 25);
  assertAccounting(result);

  return pass("transient recovery", result);
}

async function testAuthenticationFailFast() {
  const rows = makeRows(250);
  const result = await runWriter({
    rows,
    writeBatch: async () => ({
      error: { message: "Invalid service role", status: 401 },
      ok: false,
    }),
  });

  assert.equal(result.batchAttempts, 1);
  assert.equal(result.splitOperations, 0);
  assert.equal(result.unresolvedBatchFailures, 250);
  assertAccounting(result);

  return pass("authentication fail fast", result);
}

async function testSchemaFailFast() {
  const rows = makeRows(250);
  const result = await runWriter({
    rows,
    writeBatch: async () => ({
      error: { code: "42703", message: "Column missing_column does not exist" },
      ok: false,
    }),
  });

  assert.equal(result.batchAttempts, 1);
  assert.equal(result.splitOperations, 0);
  assert.equal(result.unresolvedBatchFailures, 250);
  assertAccounting(result);

  return pass("schema fail fast", result);
}

async function testMaximumDepthReached() {
  const rows = makeRows(16);
  const result = await runWriter({
    maxDepth: 1,
    rows,
    writeBatch: async () => ({
      error: { code: "23514", message: "Check constraint failed" },
      ok: false,
    }),
  });

  assert.equal(result.isolatedFailureCount, 0);
  assert.equal(result.unresolvedBatchFailures, 16);
  assert.ok(result.batchAttempts <= 3);
  assertAccounting(result);

  return pass("maximum depth reached", result);
}

async function testDuplicateRows() {
  const existingIds = new Set(["row-001", "row-005", "row-010"]);
  const rows = makeRows(20);
  const result = await runWriter({
    rows,
    writeBatch: createStoredSetWriter(existingIds),
  });

  assert.equal(result.inserted, 17);
  assert.equal(result.duplicates, 3);
  assertAccounting(result);

  return pass("duplicate rows", result);
}

async function testStableIdentities() {
  const rows = [row("stable-1"), row("stable-1"), row("stable-2")];
  const result = await runWriter({
    rows,
    writeBatch: createStoredSetWriter(),
  });

  assert.equal(result.attempted, 2);
  assert.equal(result.duplicateInputRows, 1);
  assert.equal(result.inserted, 2);
  assertAccounting(result);

  return pass("stable identities", result);
}

async function testSystemicThreshold() {
  const rows = makeRows(100);
  const result = await runWriter({
    rows,
    systemicRowThreshold: 5,
    systemicRateThreshold: 0.05,
    writeBatch: async () => ({
      error: { code: "23514", message: "Same constraint failed for many rows" },
      ok: false,
    }),
  });

  assert.ok(result.isolatedFailureCount >= 5);
  assert.ok(result.unresolvedBatchFailures > 0);
  assertAccounting(result);

  return pass("systemic threshold", result);
}

async function testRecoveryFixture() {
  const existingRows = makeRows(405);
  const missingRows = makeRows(500, 405);
  const duplicateInputs = missingRows.slice(0, 5);
  const rows = [...existingRows, ...missingRows, ...duplicateInputs];
  const existingIds = new Set(existingRows.map((candidate) => candidate.id));
  const result = await runWriter({
    rows,
    writeBatch: createStoredSetWriter(existingIds),
  });

  assert.equal(result.attempted, 905);
  assert.equal(result.duplicateInputRows, 5);
  assert.equal(result.duplicates, 405);
  assert.equal(result.inserted, 500);
  assert.equal(result.failed, 0);
  assertAccounting(result);

  return pass("recovery fixture", result);
}

async function runWriter(options) {
  return writeResilientBatches({
    createRowIdentity: (candidate) => candidate.id,
    createSafeFailureFields: (candidate) => ({
      id: candidate.id,
      role: candidate.role,
    }),
    getJitterMs: noJitter,
    initialBatchSize: 250,
    logger: quietLogger,
    rows: options.rows,
    sleep: noSleep,
    stage: "test",
    table: "test_table",
    ...options,
  });
}

function createFailingRowWriter(failingIds) {
  const storedIds = new Set();

  return async (batch) => {
    if (batch.some((candidate) => failingIds.has(candidate.id))) {
      return {
        error: { code: "23514", message: "Check constraint failed" },
        ok: false,
      };
    }

    const insertedRows = batch.filter((candidate) => !storedIds.has(candidate.id));

    for (const candidate of insertedRows) {
      storedIds.add(candidate.id);
    }

    return {
      inserted: insertedRows.length,
      insertedRows,
      ok: true,
    };
  };
}

function createStoredSetWriter(existingIds = new Set()) {
  const storedIds = new Set(existingIds);

  return async (batch) => {
    const insertedRows = batch.filter((candidate) => !storedIds.has(candidate.id));

    for (const candidate of insertedRows) {
      storedIds.add(candidate.id);
    }

    return {
      inserted: insertedRows.length,
      insertedRows,
      ok: true,
    };
  };
}

function assertAccounting(result) {
  assert.equal(result.attempted, result.inserted + result.duplicates + result.failed);
}

function summarizeScenarioResults(results) {
  return {
    duplicateFinalAccounting: results.filter((result) => !result.accountingOk).length,
    ok: results.every((result) => result.ok && result.accountingOk),
    rowsLost: results.reduce((total, result) => total + result.rowsLost, 0),
    scenariosTested: results.length,
    unexpectedFailures: results.filter((result) => !result.ok).length,
  };
}

function pass(name, result) {
  const accounted = result.inserted + result.duplicates + result.failed;

  return {
    accountingOk: accounted === result.attempted,
    name,
    ok: true,
    rowsLost: Math.max(result.attempted - accounted, 0),
  };
}

function makeRows(count, offset = 0) {
  return Array.from({ length: count }, (_, index) =>
    row(`row-${String(index + offset).padStart(3, "0")}`),
  );
}

function row(id) {
  return {
    id,
    role: "mid",
  };
}

function isDirectExecution() {
  return process.argv[1] && import.meta.url.endsWith(process.argv[1].replaceAll("\\", "/"));
}
