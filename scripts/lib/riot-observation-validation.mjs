import {
  counterPickRankBrackets,
  isCounterPickRankBracket,
  isMatchupRankAttributionMethod,
} from "./riot-rank-brackets.mjs";

export const allowedLeagueRoles = ["top", "jungle", "mid", "adc", "support"];
export const supportedQueueIds = [420];
export const validationFailureRateThreshold = 0.05;

export const observationValidityRules = {
  required: [
    "valid match id",
    "valid patch",
    "supported queue",
    "supported role",
    "active canonical champions",
    "winner and loser can be determined",
    "valid rank bracket metadata",
  ],
  intentionallyNotRequired: [
    "seed candidate minimum games",
    "seed candidate main role",
    "primary role share",
    "primary champion share",
    "multiple historical matchup games",
  ],
};

export const platformRegionalRouting = {
  BR1: "AMERICAS",
  EUN1: "EUROPE",
  EUW1: "EUROPE",
  JP1: "ASIA",
  KR: "ASIA",
  LA1: "AMERICAS",
  LA2: "AMERICAS",
  ME1: "EUROPE",
  NA1: "AMERICAS",
  OC1: "SEA",
  PH2: "SEA",
  RU: "EUROPE",
  SG2: "SEA",
  TH2: "SEA",
  TR1: "EUROPE",
  TW2: "SEA",
  VN2: "SEA",
};

const maxMatchIdLength = 96;
const maxPatchLength = 24;
const maxPuuidLength = 128;
const maxValidationSamples = 10;
const maxGameDurationSeconds = 14_400;
const validTiers = new Set(["S+", "S", "A", "B", "C"]);
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const matchIdPattern = /^[A-Za-z0-9_-]+$/;
const patchPattern = /^\d{1,2}\.\d{1,2}(?:\.\d{1,2})?$/;

export function createObservationValidationContext({
  championRegistry = null,
  activeChampionIds = null,
  candidateIds = null,
  platformRouting = platformRegionalRouting,
  queues = supportedQueueIds,
} = {}) {
  return {
    activeChampionIds: new Set(
      activeChampionIds ??
        Array.from(
          championRegistry?.byCanonicalKey?.keys?.() ??
            championRegistry?.entries?.map((entry) => entry.canonicalKey) ??
            [],
        ),
    ),
    allowedRoles: new Set(allowedLeagueRoles),
    candidateIds: candidateIds ? new Set(Array.from(candidateIds).map(String)) : null,
    platformRouting,
    supportedPlatformRegions: new Set(Object.keys(platformRouting)),
    supportedQueues: new Set(queues.map(Number)),
  };
}

export function withCandidateIds(context, candidateIds) {
  return {
    ...context,
    candidateIds: new Set(Array.from(candidateIds ?? []).map(String)),
  };
}

export function validateSeedCandidateObservation(input, context) {
  const issues = [];
  const value = {
    candidate_id: stringValue(input?.candidate_id),
    champion: stringValue(input?.champion),
    game_duration_seconds: nullableInteger(input?.game_duration_seconds),
    game_start_at: nullableTimestamp(input?.game_start_at),
    match_id: stringValue(input?.match_id),
    patch: stringValue(input?.patch),
    platform_region: stringValue(input?.platform_region).toUpperCase(),
    queue_id: integerValue(input?.queue_id),
    regional_routing: stringValue(input?.regional_routing).toUpperCase(),
    role: stringValue(input?.role).toLowerCase(),
    scan_job_id: nullableInteger(input?.scan_job_id),
    won: input?.won,
  };

  validateCandidateId(value.candidate_id, context, issues);
  validateMatchId(value.match_id, issues);
  validatePlatformRouting(value.platform_region, value.regional_routing, context, issues);
  validatePatch(value.patch, issues);
  validateQueueId(value.queue_id, context, issues);
  validateRole(value.role, context, issues);
  validateChampion(value.champion, context, issues);
  validateBoolean(value.won, "won", issues);
  validateTimestamp(value.game_start_at, "game_start_at", false, issues);
  validateDuration(value.game_duration_seconds, issues);
  validateScanJobId(value.scan_job_id, issues);

  return issues.length === 0
    ? {
        valid: true,
        value,
      }
    : {
        issues,
        valid: false,
      };
}

export function validateMatchupObservation(input, context) {
  // Matchup observations are intentionally broader than seed candidate qualification.
  // A one-off valid ranked game should aggregate even if the player is not a known main.
  const issues = [];
  const value = {
    champion_a: stringValue(input?.champion_a),
    champion_a_puuid: nullableString(input?.champion_a_puuid),
    champion_a_tier: nullableString(input?.champion_a_tier),
    champion_a_won: input?.champion_a_won,
    champion_b: stringValue(input?.champion_b),
    champion_b_puuid: nullableString(input?.champion_b_puuid),
    champion_b_tier: nullableString(input?.champion_b_tier),
    game_duration_seconds: nullableInteger(input?.game_duration_seconds),
    game_start_at: nullableTimestamp(input?.game_start_at),
    match_id: stringValue(input?.match_id),
    patch: stringValue(input?.patch),
    queue_id: integerValue(input?.queue_id),
    rank_attribution_method: nullableString(input?.rank_attribution_method ?? "unknown"),
    rank_bracket: nullableString(input?.rank_bracket ?? "unknown"),
    role: stringValue(input?.role).toLowerCase(),
    scan_job_id: nullableInteger(input?.scan_job_id),
    seen_count: integerValue(input?.seen_count ?? 1),
    winner_champion: stringValue(input?.winner_champion),
  };

  validateMatchId(value.match_id, issues);
  validatePatch(value.patch, issues);
  validateQueueId(value.queue_id, context, issues);
  validateRole(value.role, context, issues);
  validateChampion(value.champion_a, context, issues, "champion_a");
  validateChampion(value.champion_b, context, issues, "champion_b");
  validateChampion(value.winner_champion, context, issues, "winner_champion");
  validateBoolean(value.champion_a_won, "champion_a_won", issues);
  validateTimestamp(value.game_start_at, "game_start_at", false, issues);
  validateDuration(value.game_duration_seconds, issues);
  validateScanJobId(value.scan_job_id, issues);
  validateNullablePuuid(value.champion_a_puuid, "champion_a_puuid", issues);
  validateNullablePuuid(value.champion_b_puuid, "champion_b_puuid", issues);
  validateObservationRankBracket(value.rank_bracket, issues);
  validateRankAttributionMethod(value.rank_attribution_method, issues);

  if (value.champion_a && value.champion_b && value.champion_a === value.champion_b) {
    issues.push(
      issue(
        "champion_b",
        "SAME_CHAMPION_MATCHUP",
        "Matchup champions must differ.",
        value.champion_b,
      ),
    );
  }

  if (
    value.champion_a &&
    value.champion_b &&
    value.champion_a.localeCompare(value.champion_b) > 0
  ) {
    issues.push(
      issue(
        "champion_a",
        "INVALID_MATCHUP_ORDER",
        "Matchup champions must be stored in canonical sorted order.",
        value.champion_a,
      ),
    );
  }

  if (
    value.winner_champion &&
    value.champion_a &&
    value.champion_b &&
    value.winner_champion !== value.champion_a &&
    value.winner_champion !== value.champion_b
  ) {
    issues.push(
      issue(
        "winner_champion",
        "INVALID_WINNER",
        "Winner champion must match one matchup champion.",
        value.winner_champion,
      ),
    );
  }

  if (
    typeof value.champion_a_won === "boolean" &&
    value.winner_champion &&
    value.champion_a &&
    value.champion_b
  ) {
    const expectedWinner = value.champion_a_won ? value.champion_a : value.champion_b;

    if (value.winner_champion !== expectedWinner) {
      issues.push(
        issue(
          "champion_a_won",
          "WINNER_BOOLEAN_CONFLICT",
          "Winner champion does not agree with champion_a_won.",
          value.champion_a_won,
        ),
      );
    }
  }

  if (!Number.isInteger(value.seen_count) || value.seen_count < 1) {
    issues.push(
      issue(
        "seen_count",
        "MISSING_REQUIRED_FIELD",
        "Seen count must be a positive integer.",
        value.seen_count,
      ),
    );
  }

  return issues.length === 0
    ? {
        valid: true,
        value,
      }
    : {
        issues,
        valid: false,
      };
}

export function validateCounterPickAggregate(input, context) {
  const issues = [];
  const value = {
    counter_champion_id: stringValue(input?.counter_champion_id),
    enemy_champion_id: stringValue(input?.enemy_champion_id),
    games: integerValue(input?.games),
    losses: integerValue(input?.losses),
    patch: stringValue(input?.patch),
    rank_bracket: stringValue(input?.rank_bracket ?? "all"),
    role: stringValue(input?.role).toLowerCase(),
    tier: stringValue(input?.tier),
    win_rate: numberValue(input?.win_rate),
    wins: integerValue(input?.wins),
  };

  validateChampion(value.enemy_champion_id, context, issues, "enemy_champion_id");
  validateChampion(value.counter_champion_id, context, issues, "counter_champion_id");
  validateRole(value.role, context, issues);
  validatePatch(value.patch, issues);
  validateRankBracket(value.rank_bracket, issues);

  if (value.enemy_champion_id && value.enemy_champion_id === value.counter_champion_id) {
    issues.push(
      issue(
        "counter_champion_id",
        "SAME_CHAMPION_MATCHUP",
        "Enemy and counter champions must differ.",
        value.counter_champion_id,
      ),
    );
  }

  validateNonNegativeInteger(value.games, "games", issues);
  validateNonNegativeInteger(value.wins, "wins", issues);
  validateNonNegativeInteger(value.losses, "losses", issues);

  if (
    Number.isInteger(value.games) &&
    Number.isInteger(value.wins) &&
    Number.isInteger(value.losses) &&
    value.wins + value.losses !== value.games
  ) {
    issues.push(
      issue("games", "INVALID_GAME_TOTAL", "Wins plus losses must equal games.", value.games),
    );
  }

  if (!Number.isFinite(value.win_rate) || value.win_rate < 0 || value.win_rate > 100) {
    issues.push(
      issue("win_rate", "INVALID_WIN_RATE", "Win rate must be between 0 and 100.", value.win_rate),
    );
  }

  if (!validTiers.has(value.tier)) {
    issues.push(issue("tier", "INVALID_TIER", "Tier is not supported.", value.tier));
  }

  return issues.length === 0
    ? {
        valid: true,
        value: {
          ...input,
          ...value,
        },
      }
    : {
        issues,
        valid: false,
      };
}

export function validateRoutingConfiguration({ context, platformRegion, regionalRouting }) {
  const issues = [];

  validatePlatformRouting(
    stringValue(platformRegion).toUpperCase(),
    stringValue(regionalRouting).toUpperCase(),
    context,
    issues,
  );

  return {
    issues,
    ok: issues.length === 0,
  };
}

export function partitionValidatedRows(rows, validator, context) {
  const invalid = [];
  const valid = [];

  for (const row of rows ?? []) {
    const result = validator(row, context);

    if (result.valid) {
      valid.push(result.value);
      continue;
    }

    invalid.push({
      issues: result.issues,
      row,
    });
  }

  return {
    invalid,
    valid,
    validated: rows?.length ?? 0,
  };
}

export function summarizeValidationFailures(
  invalidRows,
  { sampleLimit = maxValidationSamples } = {},
) {
  const issuesByCode = {};
  const samples = [];

  for (const invalidRow of invalidRows ?? []) {
    for (const validationIssue of invalidRow.issues) {
      issuesByCode[validationIssue.code] = (issuesByCode[validationIssue.code] ?? 0) + 1;

      if (samples.length < sampleLimit) {
        samples.push({
          code: validationIssue.code,
          field: validationIssue.field,
          matchId: invalidRow.row?.match_id
            ? String(invalidRow.row.match_id).slice(0, maxMatchIdLength)
            : null,
          safeValue: getSafeIssueValue(validationIssue),
        });
      }
    }
  }

  return {
    issuesByCode,
    samples,
    totalRejected: invalidRows?.length ?? 0,
  };
}

export function getValidationMetrics(prefix, partition) {
  return {
    [`${prefix}_validated`]: partition.validated,
    [`${prefix}_validation_failures`]: partition.invalid.length,
    [`${prefix}_rejected`]: partition.invalid.length,
  };
}

export function exceedsValidationFailureRate({ rejected, validated }) {
  return validated > 0 && rejected / validated > validationFailureRateThreshold;
}

export function logValidationFailures(label, invalidRows) {
  if (!invalidRows || invalidRows.length === 0) {
    return;
  }

  console.warn(label, summarizeValidationFailures(invalidRows));
}

function validateCandidateId(value, context, issues) {
  if (!value) {
    issues.push(
      issue("candidate_id", "MISSING_REQUIRED_FIELD", "Candidate ID is required.", value),
    );
    return;
  }

  if (!uuidPattern.test(value)) {
    issues.push(issue("candidate_id", "INVALID_UUID", "Candidate ID must be a UUID.", value));
    return;
  }

  if (context.candidateIds && !context.candidateIds.has(value)) {
    issues.push(
      issue(
        "candidate_id",
        "UNKNOWN_CANDIDATE",
        "Candidate ID was not resolved in this batch.",
        value,
      ),
    );
  }
}

function validateMatchId(value, issues) {
  if (!value) {
    issues.push(issue("match_id", "MISSING_REQUIRED_FIELD", "Match ID is required.", value));
    return;
  }

  if (value.length > maxMatchIdLength || !matchIdPattern.test(value)) {
    issues.push(issue("match_id", "INVALID_MATCH_ID", "Match ID format is invalid.", value));
  }
}

function validatePlatformRouting(platformRegion, regionalRouting, context, issues) {
  if (!platformRegion) {
    issues.push(
      issue(
        "platform_region",
        "MISSING_REQUIRED_FIELD",
        "Platform region is required.",
        platformRegion,
      ),
    );
    return;
  }

  if (!context.supportedPlatformRegions.has(platformRegion)) {
    issues.push(
      issue(
        "platform_region",
        "UNSUPPORTED_PLATFORM_REGION",
        "Platform region is not supported.",
        platformRegion,
      ),
    );
    return;
  }

  if (!regionalRouting) {
    issues.push(
      issue(
        "regional_routing",
        "MISSING_REQUIRED_FIELD",
        "Regional routing is required.",
        regionalRouting,
      ),
    );
    return;
  }

  const expectedRouting = context.platformRouting[platformRegion];

  if (!expectedRouting) {
    issues.push(
      issue(
        "regional_routing",
        "UNSUPPORTED_REGIONAL_ROUTING",
        "Regional routing is not supported.",
        regionalRouting,
      ),
    );
    return;
  }

  if (regionalRouting !== expectedRouting) {
    issues.push(
      issue(
        "regional_routing",
        "ROUTING_REGION_MISMATCH",
        "Platform region does not match regional routing.",
        regionalRouting,
      ),
    );
  }
}

function validatePatch(value, issues) {
  if (!value) {
    issues.push(issue("patch", "MISSING_REQUIRED_FIELD", "Patch is required.", value));
    return;
  }

  if (value.length > maxPatchLength || !patchPattern.test(value)) {
    issues.push(issue("patch", "INVALID_PATCH", "Patch format is invalid.", value));
  }
}

function validateQueueId(value, context, issues) {
  if (!Number.isInteger(value) || !context.supportedQueues.has(value)) {
    issues.push(issue("queue_id", "UNSUPPORTED_QUEUE_ID", "Queue ID is not supported.", value));
  }
}

function validateRole(value, context, issues) {
  if (!context.allowedRoles.has(value)) {
    issues.push(issue("role", "INVALID_ROLE", "Role is not supported.", value));
  }
}

function validateChampion(value, context, issues, field = "champion") {
  if (!value) {
    issues.push(issue(field, "MISSING_REQUIRED_FIELD", "Champion is required.", value));
    return;
  }

  if (!context.activeChampionIds.has(value)) {
    issues.push(
      issue(field, "UNKNOWN_CHAMPION", "Champion is not an active canonical champion.", value),
    );
  }
}

function validateBoolean(value, field, issues) {
  if (typeof value !== "boolean") {
    issues.push(issue(field, "INVALID_BOOLEAN", "Value must be a strict boolean.", value));
  }
}

function validateTimestamp(value, field, nullable, issues) {
  if (value === null && nullable) {
    return;
  }

  if (value === null) {
    return;
  }

  const timestamp = new Date(value).getTime();
  const maxFutureTimestamp = Date.now() + 24 * 60 * 60 * 1000;

  if (!Number.isFinite(timestamp) || timestamp > maxFutureTimestamp) {
    issues.push(issue(field, "INVALID_TIMESTAMP", "Timestamp is invalid.", value));
  }
}

function validateDuration(value, issues) {
  if (value === null) {
    return;
  }

  if (!Number.isInteger(value) || value < 0 || value > maxGameDurationSeconds) {
    issues.push(
      issue(
        "game_duration_seconds",
        "INVALID_DURATION",
        "Game duration must be a realistic non-negative integer.",
        value,
      ),
    );
  }
}

function validateScanJobId(value, issues) {
  if (value === null) {
    return;
  }

  if (!Number.isInteger(value) || value <= 0) {
    issues.push(
      issue("scan_job_id", "INVALID_SCAN_JOB_ID", "Scan job ID must be a positive integer.", value),
    );
  }
}

function validateNullablePuuid(value, field, issues) {
  if (value === null) {
    return;
  }

  if (value.length > maxPuuidLength) {
    issues.push(issue(field, "INVALID_PUUID", "PUUID is too long.", shortenSensitiveValue(value)));
  }
}

function validateRankBracket(value, issues) {
  if (!isCounterPickRankBracket(value)) {
    issues.push(issue("rank_bracket", "INVALID_RANK_BRACKET", "Rank bracket is invalid.", value));
  }
}

function validateObservationRankBracket(value, issues) {
  if (!value || value === "all" || !counterPickRankBrackets.includes(value)) {
    issues.push(issue("rank_bracket", "INVALID_RANK_BRACKET", "Rank bracket is invalid.", value));
  }
}

function validateRankAttributionMethod(value, issues) {
  if (!isMatchupRankAttributionMethod(value)) {
    issues.push(
      issue(
        "rank_attribution_method",
        "INVALID_RANK_ATTRIBUTION_METHOD",
        "Rank attribution method is invalid.",
        value,
      ),
    );
  }
}

function validateNonNegativeInteger(value, field, issues) {
  if (!Number.isInteger(value) || value < 0) {
    issues.push(
      issue(field, "MISSING_REQUIRED_FIELD", `${field} must be a non-negative integer.`, value),
    );
  }
}

function issue(field, code, message, value) {
  return {
    code,
    field,
    message,
    value,
  };
}

function stringValue(value) {
  return String(value ?? "").trim();
}

function nullableString(value) {
  const text = String(value ?? "").trim();

  return text ? text : null;
}

function integerValue(value) {
  if (typeof value === "number" && Number.isInteger(value)) {
    return value;
  }

  if (typeof value === "string" && /^-?\d+$/.test(value.trim())) {
    return Number(value.trim());
  }

  return Number.NaN;
}

function nullableInteger(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return integerValue(value);
}

function numberValue(value) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    return Number(value);
  }

  return Number.NaN;
}

function nullableTimestamp(value) {
  const text = String(value ?? "").trim();

  return text ? text : null;
}

function getSafeIssueValue(validationIssue) {
  if (validationIssue.value === null || validationIssue.value === undefined) {
    return null;
  }

  const value = String(validationIssue.value);

  if (validationIssue.field.toLowerCase().includes("puuid")) {
    return shortenSensitiveValue(value);
  }

  return value.slice(0, 80);
}

function shortenSensitiveValue(value) {
  if (value.length <= 18) {
    return value;
  }

  return `${value.slice(0, 8)}...${value.slice(-8)}`;
}
