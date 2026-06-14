export const defaultInitialBatchSize = 250;
export const minimumIsolationBatchSize = 1;
export const maxBatchIsolationDepth = 12;
export const maxBatchWriteAttempts = 2048;
export const maxTransientRetries = 3;
export const maxIsolatedFailureSamples = 20;
export const systemicErrorRowThreshold = 50;
export const systemicErrorRateThreshold = 0.1;

const rowOrConstraintErrorCodes = new Set(["23502", "23503", "23505", "23514", "22P02"]);
const schemaErrorCodes = new Set(["42P01", "42703", "42883", "PGRST200", "PGRST204", "PGRST205"]);
const transientStatuses = new Set([408, 429, 500, 502, 503, 504]);
const payloadStatuses = new Set([413, 414]);
const nonIsolatableClasses = new Set([
  "authentication_error",
  "authorization_error",
  "configuration_error",
]);

export function classifyBatchWriteError(error) {
  const code = getErrorCode(error);
  const status = getErrorStatus(error);
  const message = getErrorMessage(error).toLowerCase();

  if (status === 401 || message.includes("invalid service role")) {
    return "authentication_error";
  }

  if (status === 403 || message.includes("row-level security") || message.includes("rls")) {
    return "authorization_error";
  }

  if (
    schemaErrorCodes.has(code) ||
    message.includes("schema cache") ||
    message.includes("does not exist") ||
    message.includes("could not find") ||
    message.includes("missing column") ||
    (message.includes("column") && message.includes("not found"))
  ) {
    return "configuration_error";
  }

  if (
    payloadStatuses.has(status) ||
    message.includes("payload too large") ||
    message.includes("request entity too large") ||
    message.includes("maximum request") ||
    message.includes("too large")
  ) {
    return "payload_or_batch_size_error";
  }

  if (
    transientStatuses.has(status) ||
    message.includes("timeout") ||
    message.includes("connection reset") ||
    message.includes("econnreset") ||
    message.includes("temporarily unavailable") ||
    message.includes("temporary") ||
    message.includes("network") ||
    message.includes("fetch failed")
  ) {
    return "transient_error";
  }

  if (rowOrConstraintErrorCodes.has(code)) {
    return "row_or_constraint_error";
  }

  return "unknown_error";
}

export async function writeResilientBatches({
  classifyError = classifyBatchWriteError,
  createRowIdentity,
  createSafeFailureFields = () => ({}),
  getJitterMs = () => Math.floor(Math.random() * 125),
  initialBatchSize = defaultInitialBatchSize,
  logger = console,
  maxAttempts = maxBatchWriteAttempts,
  maxDepth = maxBatchIsolationDepth,
  maximumTransientRetries = maxTransientRetries,
  minimumBatchSize = minimumIsolationBatchSize,
  rows,
  sampleLimit = maxIsolatedFailureSamples,
  sleep = defaultSleep,
  stage = "batch_write",
  systemicRowThreshold = systemicErrorRowThreshold,
  systemicRateThreshold = systemicErrorRateThreshold,
  table,
  transientBackoffMs = [500, 1000, 2000],
  writeBatch,
}) {
  const uniqueRows = dedupeRowsByIdentity(rows ?? [], createRowIdentity);
  const queue = chunkArray(uniqueRows, initialBatchSize).map((chunk) => ({
    depth: 0,
    rows: chunk,
  }));
  const errorGroupsByFingerprint = new Map();
  const isolatedFailures = [];
  const successfulRows = [];
  const insertedRows = [];
  let attemptedBatches = 0;
  let duplicates = 0;
  let failedBatchAttempts = 0;
  let inserted = 0;
  let isolatedFailureCount = 0;
  let splitOperations = 0;
  let successfulBatches = 0;
  let transientRetries = 0;
  let unresolvedBatchFailures = 0;

  while (queue.length > 0) {
    const item = queue.shift();

    if (!item || item.rows.length === 0) {
      continue;
    }

    if (attemptedBatches >= maxAttempts) {
      const syntheticError = new Error("Maximum batch write attempts reached.");
      unresolvedBatchFailures += item.rows.length;
      addErrorGroup({
        count: item.rows.length,
        error: syntheticError,
        errorClass: "unknown_error",
        groups: errorGroupsByFingerprint,
      });
      logBatchAttempt(logger, {
        attemptNumber: attemptedBatches,
        batchSize: item.rows.length,
        depth: item.depth,
        error: syntheticError,
        errorClass: "unknown_error",
        stage,
        table,
        willRetry: false,
        willSplit: false,
      });
      continue;
    }

    const attemptResult = await attemptBatchWithTransientRetries({
      classifyError,
      getJitterMs,
      item,
      logger,
      maxAttempts,
      maximumTransientRetries,
      sleep,
      stage,
      table,
      transientBackoffMs,
      writeBatch,
      writeState: {
        attemptedBatches,
        failedBatchAttempts,
        transientRetries,
      },
    });

    attemptedBatches = attemptResult.attemptedBatches;
    failedBatchAttempts = attemptResult.failedBatchAttempts;
    transientRetries = attemptResult.transientRetries;

    if (attemptResult.ok) {
      const insertedCount = Math.max(Number(attemptResult.result.inserted ?? 0), 0);

      inserted += insertedCount;
      duplicates += Math.max(item.rows.length - insertedCount, 0);
      successfulBatches += 1;
      successfulRows.push(...item.rows);
      insertedRows.push(...(attemptResult.result.insertedRows ?? []));
      continue;
    }

    const error = attemptResult.error;
    const errorClass = attemptResult.errorClass;
    const fingerprint = getErrorFingerprint(error, errorClass);
    const currentGroup = errorGroupsByFingerprint.get(fingerprint);
    const knownSystemicCount = currentGroup?.failureCount ?? 0;
    const knownSystemicRate = uniqueRows.length > 0 ? knownSystemicCount / uniqueRows.length : 0;
    const shouldFailFast =
      nonIsolatableClasses.has(errorClass) ||
      (knownSystemicCount >= systemicRowThreshold && knownSystemicRate >= systemicRateThreshold);
    const canSplit =
      !shouldFailFast &&
      item.rows.length > minimumBatchSize &&
      item.depth < maxDepth &&
      attemptedBatches < maxAttempts;

    if (canSplit) {
      const [left, right] = splitRows(item.rows);
      splitOperations += 1;
      queue.unshift({ depth: item.depth + 1, rows: right }, { depth: item.depth + 1, rows: left });
      logBatchAttempt(logger, {
        attemptNumber: attemptedBatches,
        batchSize: item.rows.length,
        depth: item.depth,
        error,
        errorClass,
        stage,
        table,
        willRetry: false,
        willSplit: true,
      });
      continue;
    }

    if (item.rows.length === 1 && !shouldFailFast) {
      isolatedFailureCount += 1;
      addErrorGroup({
        count: 1,
        error,
        errorClass,
        groups: errorGroupsByFingerprint,
      });

      if (isolatedFailures.length < sampleLimit) {
        isolatedFailures.push(
          createFailureSample({
            createRowIdentity,
            createSafeFailureFields,
            error,
            errorClass,
            row: item.rows[0],
            table,
          }),
        );
      }

      logIsolatedFailure(logger, {
        createSafeFailureFields,
        error,
        errorClass,
        row: item.rows[0],
        rowIdentity: createRowIdentity(item.rows[0]),
        stage,
        table,
      });
      continue;
    }

    unresolvedBatchFailures += item.rows.length;
    addErrorGroup({
      count: item.rows.length,
      error,
      errorClass,
      groups: errorGroupsByFingerprint,
    });
    logBatchAttempt(logger, {
      attemptNumber: attemptedBatches,
      batchSize: item.rows.length,
      depth: item.depth,
      error,
      errorClass,
      stage,
      table,
      willRetry: false,
      willSplit: false,
    });
  }

  return {
    attempted: uniqueRows.length,
    batchAttempts: attemptedBatches,
    duplicateInputRows: Math.max((rows?.length ?? 0) - uniqueRows.length, 0),
    duplicates,
    errorGroups: Array.from(errorGroupsByFingerprint.values()),
    failed: isolatedFailureCount + unresolvedBatchFailures,
    failedBatchAttempts,
    inserted,
    insertedRows,
    isolatedFailureCount,
    isolatedFailures,
    splitOperations,
    successfulBatches,
    successfulRows,
    transientRetries,
    unresolvedBatchFailures,
  };
}

async function attemptBatchWithTransientRetries({
  classifyError,
  getJitterMs,
  item,
  logger,
  maxAttempts,
  maximumTransientRetries,
  sleep,
  stage,
  table,
  transientBackoffMs,
  writeBatch,
  writeState,
}) {
  let attemptedBatches = writeState.attemptedBatches;
  let failedBatchAttempts = writeState.failedBatchAttempts;
  let transientRetries = writeState.transientRetries;
  let lastError = null;
  let lastErrorClass = "unknown_error";

  for (let retryIndex = 0; retryIndex <= maximumTransientRetries; retryIndex += 1) {
    if (attemptedBatches >= maxAttempts) {
      break;
    }

    attemptedBatches += 1;

    try {
      const result = await writeBatch(item.rows);

      if (result?.ok) {
        return {
          attemptedBatches,
          failedBatchAttempts,
          ok: true,
          result,
          transientRetries,
        };
      }

      lastError = result?.error ?? new Error("Batch write failed.");
    } catch (error) {
      lastError = error;
    }

    lastErrorClass = classifyError(lastError);
    failedBatchAttempts += 1;
    const willRetry =
      lastErrorClass === "transient_error" &&
      retryIndex < maximumTransientRetries &&
      attemptedBatches < maxAttempts;

    logBatchAttempt(logger, {
      attemptNumber: attemptedBatches,
      batchSize: item.rows.length,
      depth: item.depth,
      error: lastError,
      errorClass: lastErrorClass,
      stage,
      table,
      willRetry,
      willSplit: false,
    });

    if (!willRetry) {
      break;
    }

    transientRetries += 1;
    await sleep(getTransientBackoffMs({ getJitterMs, retryIndex, transientBackoffMs }));
  }

  return {
    attemptedBatches,
    error: lastError ?? new Error("Batch write failed."),
    errorClass: lastErrorClass,
    failedBatchAttempts,
    ok: false,
    transientRetries,
  };
}

function dedupeRowsByIdentity(rows, createRowIdentity) {
  const rowsByIdentity = new Map();

  for (const row of rows) {
    const identity = createRowIdentity(row);

    if (!rowsByIdentity.has(identity)) {
      rowsByIdentity.set(identity, row);
    }
  }

  return Array.from(rowsByIdentity.values());
}

function splitRows(rows) {
  const splitIndex = Math.ceil(rows.length / 2);

  return [rows.slice(0, splitIndex), rows.slice(splitIndex)];
}

function addErrorGroup({ count, error, errorClass, groups }) {
  const fingerprint = getErrorFingerprint(error, errorClass);
  const current = groups.get(fingerprint) ?? {
    errorClass,
    errorCode: getErrorCode(error) || null,
    failureCount: 0,
    httpStatus: getErrorStatus(error) || null,
    messageFingerprint: fingerprint,
  };

  current.failureCount += count;
  groups.set(fingerprint, current);
}

function createFailureSample({
  createRowIdentity,
  createSafeFailureFields,
  error,
  errorClass,
  row,
  table,
}) {
  return {
    errorClass,
    errorCode: getErrorCode(error) || null,
    message: getSafeErrorMessage(error),
    rowIdentity: shortenSafeValue(createRowIdentity(row), 96),
    safeFields: createSafeFailureFields(row),
    table,
  };
}

function logBatchAttempt(
  logger,
  { attemptNumber, batchSize, depth, error, errorClass, stage, table, willRetry, willSplit },
) {
  logger.warn?.("Riot resilient batch write attempt failed", {
    attemptNumber,
    batchSize,
    depth,
    errorClass,
    errorCode: getErrorCode(error) || null,
    errorMessage: error?.message ?? null,
    errorDetails: error?.details ?? null,
    errorHint: error?.hint ?? null,
    httpStatus: getErrorStatus(error) || null,
    stage,
    table,
    willRetry,
    willSplit,
  });
}

function logIsolatedFailure(
  logger,
  { createSafeFailureFields, error, errorClass, row, rowIdentity, stage, table },
) {
  logger.warn?.("Riot resilient batch write isolated row failure", {
    errorClass,
    errorCode: getErrorCode(error) || null,
    rowIdentity: shortenSafeValue(rowIdentity, 96),
    safeFields: createSafeFailureFields(row),
    stage,
    table,
  });
}

function getTransientBackoffMs({ getJitterMs, retryIndex, transientBackoffMs }) {
  const baseDelay = transientBackoffMs[Math.min(retryIndex, transientBackoffMs.length - 1)] ?? 0;

  return baseDelay + getJitterMs(retryIndex);
}

function getErrorFingerprint(error, errorClass) {
  return [
    errorClass,
    getErrorCode(error) || "no_code",
    getErrorStatus(error) || "no_status",
    getSafeErrorMessage(error)
      .toLowerCase()
      .replace(/[0-9a-f]{8}-[0-9a-f-]{27,}/gi, "{uuid}")
      .replace(/\b\d{5,}\b/g, "{number}")
      .slice(0, 120),
  ].join(":");
}

function getErrorCode(error) {
  return String(error?.code ?? error?.error?.code ?? "").trim();
}

function getErrorStatus(error) {
  const rawStatus = error?.status ?? error?.statusCode ?? error?.error?.status;
  const status = Number(rawStatus);

  return Number.isInteger(status) ? status : null;
}

function getErrorMessage(error) {
  return String(error?.message ?? error?.error_description ?? error ?? "").trim();
}

function getSafeErrorMessage(error) {
  return shortenSafeValue(getErrorMessage(error) || "Batch write failed.", 180);
}

function shortenSafeValue(value, limit) {
  const text = String(value ?? "");

  if (text.length <= limit) {
    return text;
  }

  return `${text.slice(0, Math.max(limit - 3, 0))}...`;
}

function chunkArray(values, size) {
  const chunks = [];
  const normalizedSize = Math.max(Number(size) || defaultInitialBatchSize, 1);

  for (let index = 0; index < values.length; index += normalizedSize) {
    chunks.push(values.slice(index, index + normalizedSize));
  }

  return chunks;
}

function defaultSleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
