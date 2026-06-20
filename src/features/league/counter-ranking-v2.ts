import { calculateCounterPickConfidence } from "./counter-pick-confidence.ts";
import type { CounterPickStatistics } from "./counter-pick-statistics.ts";
import type { LeagueRole } from "./roles.ts";

export type CounterRankingV2TraitCategory =
  | "damage_pattern"
  | "defensive_shape"
  | "range_shape"
  | "target_access"
  | "utility"
  | "vulnerability";

export type CounterRankingV2TraitId =
  | "anti_dash"
  | "anti_magic"
  | "burst_damage"
  | "cooldown_reliant"
  | "dash_reliant"
  | "early_weakness"
  | "fragile"
  | "immobile"
  | "late_scaling"
  | "melee_commit"
  | "mobility"
  | "mobility_reliant"
  | "point_and_click_cc"
  | "poke"
  | "reliable_cc"
  | "short_range"
  | "suppression"
  | "sustained_damage"
  | "waveclear"
  | "waveclear_weak";

export type CounterRankingV2ProfileStatus = "draft" | "needs_review" | "reviewed";

export type CounterRankingV2TraitDefinition = {
  category: CounterRankingV2TraitCategory;
  description: string;
  id: CounterRankingV2TraitId;
  label: string;
};

export type CounterRankingV2ProfileTrait = {
  traitId: CounterRankingV2TraitId;
  weight: number;
};

export type CounterRankingV2ChampionProfile = {
  championId: string;
  notes?: string;
  reviewStatus: CounterRankingV2ProfileStatus;
  strengths: CounterRankingV2ProfileTrait[];
  vulnerabilities: CounterRankingV2ProfileTrait[];
  version: number;
};

export type CounterRankingV2Factor = {
  candidateStrength: CounterRankingV2TraitId;
  contribution: number;
  enemyVulnerability: CounterRankingV2TraitId;
  interactionWeight: number;
  reason: string;
};

export type CounterRankingV2FitStatus =
  | "calculated"
  | "incomplete_profile"
  | "missing_candidate_profile"
  | "missing_enemy_profile";

export type CounterRankingV2MechanicalFitResult = {
  candidateChampionId: string;
  enemyChampionId: string;
  factors: CounterRankingV2Factor[];
  maxRawScore: number;
  rawScore: number;
  role: LeagueRole | null;
  score: number;
  status: CounterRankingV2FitStatus;
};

export type CounterRankingV2ObservedRankSnapshot = {
  confidence: CounterPickStatistics["confidence"];
  games: number | null;
  rank: number | null;
  winRate: number | null;
};

export type CounterRankingV2ComparisonRow = {
  candidateChampionId: string;
  mechanicalRank: number | null;
  mechanicalResult: CounterRankingV2MechanicalFitResult;
  rankDelta: number | null;
  observed: CounterRankingV2ObservedRankSnapshot | null;
};

type CounterRankingV2TraitInteraction = {
  candidateStrength: CounterRankingV2TraitId;
  enemyVulnerability: CounterRankingV2TraitId;
  reason: string;
  weight: number;
};

const maxTraitWeight = 5;

export const counterRankingV2SupportedChampionIds = [
  "vex",
  "yone",
  "yasuo",
  "akali",
  "annie",
  "malzahar",
  "lissandra",
  "kassadin",
] as const;

export const counterRankingV2TraitVocabulary = [
  {
    category: "utility",
    description: "Punishes repeated dashes, blinks, or committed movement patterns.",
    id: "anti_dash",
    label: "Anti-dash",
  },
  {
    category: "defensive_shape",
    description: "Naturally reduces or absorbs magic-heavy pressure.",
    id: "anti_magic",
    label: "Anti-magic",
  },
  {
    category: "damage_pattern",
    description: "Can threaten decisive health swings during short windows.",
    id: "burst_damage",
    label: "Burst damage",
  },
  {
    category: "vulnerability",
    description: "Has meaningful downtime after key spells are used.",
    id: "cooldown_reliant",
    label: "Cooldown-reliant",
  },
  {
    category: "vulnerability",
    description: "Needs dash access to trade, escape, or finish fights.",
    id: "dash_reliant",
    label: "Dash-reliant",
  },
  {
    category: "vulnerability",
    description: "Can be punished before levels, items, or core scaling breakpoints.",
    id: "early_weakness",
    label: "Early weakness",
  },
  {
    category: "vulnerability",
    description: "Low tolerance for burst or locked-down all-ins.",
    id: "fragile",
    label: "Fragile",
  },
  {
    category: "vulnerability",
    description: "Limited ability to reposition once threatened.",
    id: "immobile",
    label: "Immobile",
  },
  {
    category: "damage_pattern",
    description: "Gains large relative value after levels or items.",
    id: "late_scaling",
    label: "Late scaling",
  },
  {
    category: "vulnerability",
    description: "Must enter committed melee range to access normal trading patterns.",
    id: "melee_commit",
    label: "Melee commit",
  },
  {
    category: "target_access",
    description: "Can reposition or threaten backline access in fights.",
    id: "mobility",
    label: "Mobility",
  },
  {
    category: "vulnerability",
    description: "Loses much of its plan if movement is interrupted or constrained.",
    id: "mobility_reliant",
    label: "Mobility-reliant",
  },
  {
    category: "utility",
    description: "Can lock a specific target without relying on dodgeable skillshots.",
    id: "point_and_click_cc",
    label: "Point-and-click CC",
  },
  {
    category: "range_shape",
    description: "Can chip or control space before a committed fight starts.",
    id: "poke",
    label: "Poke",
  },
  {
    category: "utility",
    description: "Has dependable crowd control that can interrupt or punish entry.",
    id: "reliable_cc",
    label: "Reliable CC",
  },
  {
    category: "vulnerability",
    description: "Needs to stand close enough to be threatened during normal trades.",
    id: "short_range",
    label: "Short range",
  },
  {
    category: "utility",
    description: "Can force a high-value target to stop acting for a decisive window.",
    id: "suppression",
    label: "Suppression",
  },
  {
    category: "damage_pattern",
    description: "Wins through repeated DPS rather than one burst window.",
    id: "sustained_damage",
    label: "Sustained damage",
  },
  {
    category: "utility",
    description: "Can control minion waves to shape recall, roam, or punish timings.",
    id: "waveclear",
    label: "Waveclear",
  },
  {
    category: "vulnerability",
    description: "Can be trapped under wave pressure or delayed on roam timings.",
    id: "waveclear_weak",
    label: "Weak waveclear",
  },
] as const satisfies readonly CounterRankingV2TraitDefinition[];

export const counterRankingV2TraitDefinitionsById = new Map(
  counterRankingV2TraitVocabulary.map((trait) => [trait.id, trait] as const),
);

const counterRankingV2TraitInteractions = [
  {
    candidateStrength: "anti_dash",
    enemyVulnerability: "dash_reliant",
    reason: "Anti-dash tools directly punish champions whose trades depend on repeated dashes.",
    weight: 1,
  },
  {
    candidateStrength: "anti_dash",
    enemyVulnerability: "mobility_reliant",
    reason: "Anti-dash control removes safety from mobility-reliant engage or escape patterns.",
    weight: 0.9,
  },
  {
    candidateStrength: "anti_dash",
    enemyVulnerability: "melee_commit",
    reason: "Committed melee entries are easier to interrupt when anti-dash tools are available.",
    weight: 0.8,
  },
  {
    candidateStrength: "point_and_click_cc",
    enemyVulnerability: "mobility_reliant",
    reason: "Point-and-click crowd control reliably tags slippery champions.",
    weight: 0.95,
  },
  {
    candidateStrength: "point_and_click_cc",
    enemyVulnerability: "dash_reliant",
    reason: "Targeted lockdown punishes dash-reliant champions before they can reset spacing.",
    weight: 0.85,
  },
  {
    candidateStrength: "reliable_cc",
    enemyVulnerability: "melee_commit",
    reason: "Reliable crowd control punishes committed melee entries.",
    weight: 0.8,
  },
  {
    candidateStrength: "reliable_cc",
    enemyVulnerability: "mobility_reliant",
    reason: "Dependable control makes mobility windows riskier to use.",
    weight: 0.75,
  },
  {
    candidateStrength: "suppression",
    enemyVulnerability: "mobility_reliant",
    reason: "Suppression denies mobility-reliant champions their escape and outplay windows.",
    weight: 1,
  },
  {
    candidateStrength: "suppression",
    enemyVulnerability: "fragile",
    reason: "Suppression turns fragile targets into reliable focus-fire windows.",
    weight: 0.8,
  },
  {
    candidateStrength: "poke",
    enemyVulnerability: "short_range",
    reason: "Poke can tax short-range champions before they reach their preferred trade range.",
    weight: 0.7,
  },
  {
    candidateStrength: "poke",
    enemyVulnerability: "waveclear_weak",
    reason: "Poke plus wave pressure exploits weak waveclear and delayed resets.",
    weight: 0.65,
  },
  {
    candidateStrength: "burst_damage",
    enemyVulnerability: "fragile",
    reason: "Burst damage threatens fragile champions before extended patterns develop.",
    weight: 0.8,
  },
  {
    candidateStrength: "burst_damage",
    enemyVulnerability: "cooldown_reliant",
    reason: "Burst can punish cooldown windows after key defensive spells are spent.",
    weight: 0.65,
  },
  {
    candidateStrength: "waveclear",
    enemyVulnerability: "waveclear_weak",
    reason: "Waveclear can trap weak-waveclear champions in poor tempo states.",
    weight: 0.75,
  },
  {
    candidateStrength: "late_scaling",
    enemyVulnerability: "early_weakness",
    reason: "Scaling value is safer when the enemy also has limited early punishment.",
    weight: 0.45,
  },
  {
    candidateStrength: "sustained_damage",
    enemyVulnerability: "cooldown_reliant",
    reason: "Sustained damage keeps pressure high through the enemy's cooldown downtime.",
    weight: 0.55,
  },
  {
    candidateStrength: "anti_magic",
    enemyVulnerability: "burst_damage",
    reason: "Anti-magic durability reduces the impact of magic burst windows.",
    weight: 0.5,
  },
] as const satisfies readonly CounterRankingV2TraitInteraction[];

export const counterRankingV2ChampionProfiles = [
  profile("vex", "reviewed", 1, {
    strengths: [
      trait("anti_dash", 5),
      trait("reliable_cc", 4),
      trait("burst_damage", 4),
      trait("poke", 3),
    ],
    vulnerabilities: [trait("immobile", 3), trait("cooldown_reliant", 3), trait("short_range", 2)],
  }),
  profile("yone", "reviewed", 1, {
    strengths: [trait("mobility", 5), trait("sustained_damage", 4), trait("late_scaling", 4)],
    vulnerabilities: [
      trait("dash_reliant", 5),
      trait("melee_commit", 4),
      trait("mobility_reliant", 4),
      trait("early_weakness", 2),
    ],
  }),
  profile("yasuo", "reviewed", 1, {
    strengths: [trait("mobility", 5), trait("sustained_damage", 4), trait("waveclear", 3)],
    vulnerabilities: [
      trait("dash_reliant", 5),
      trait("melee_commit", 4),
      trait("mobility_reliant", 4),
      trait("fragile", 2),
    ],
  }),
  profile("akali", "needs_review", 1, {
    strengths: [trait("mobility", 5), trait("burst_damage", 4), trait("anti_magic", 2)],
    vulnerabilities: [
      trait("mobility_reliant", 5),
      trait("cooldown_reliant", 3),
      trait("waveclear_weak", 3),
    ],
  }),
  profile("annie", "needs_review", 1, {
    strengths: [trait("point_and_click_cc", 5), trait("burst_damage", 4), trait("reliable_cc", 3)],
    vulnerabilities: [trait("short_range", 4), trait("immobile", 4), trait("cooldown_reliant", 3)],
  }),
  profile("malzahar", "needs_review", 1, {
    strengths: [trait("suppression", 5), trait("waveclear", 4), trait("reliable_cc", 3)],
    vulnerabilities: [trait("immobile", 4), trait("early_weakness", 3), trait("cooldown_reliant", 3)],
  }),
  profile("lissandra", "needs_review", 1, {
    strengths: [trait("reliable_cc", 5), trait("point_and_click_cc", 3), trait("burst_damage", 3)],
    vulnerabilities: [trait("short_range", 3), trait("cooldown_reliant", 4), trait("early_weakness", 2)],
  }),
  profile("kassadin", "needs_review", 1, {
    strengths: [trait("late_scaling", 5), trait("anti_magic", 4), trait("mobility", 4)],
    vulnerabilities: [
      trait("early_weakness", 5),
      trait("waveclear_weak", 4),
      trait("melee_commit", 2),
    ],
  }),
] as const satisfies readonly CounterRankingV2ChampionProfile[];

export const counterRankingV2ChampionProfilesById = new Map(
  counterRankingV2ChampionProfiles.map((championProfile) => [
    championProfile.championId,
    championProfile,
  ] as const),
);

export function getCounterRankingV2ChampionProfile(championId: string) {
  return counterRankingV2ChampionProfilesById.get(normalizeChampionId(championId)) ?? null;
}

export function isCounterRankingV2SupportedChampion(championId: string) {
  return counterRankingV2ChampionProfilesById.has(normalizeChampionId(championId));
}

export function calculateMechanicalMatchupFit({
  candidateChampionId,
  enemyChampionId,
  role = null,
}: {
  candidateChampionId: string;
  enemyChampionId: string;
  role?: LeagueRole | null;
}): CounterRankingV2MechanicalFitResult {
  const normalizedCandidateId = normalizeChampionId(candidateChampionId);
  const normalizedEnemyId = normalizeChampionId(enemyChampionId);
  const candidateProfile = getCounterRankingV2ChampionProfile(normalizedCandidateId);
  const enemyProfile = getCounterRankingV2ChampionProfile(normalizedEnemyId);

  if (!candidateProfile) {
    return emptyMechanicalFitResult({
      candidateChampionId: normalizedCandidateId,
      enemyChampionId: normalizedEnemyId,
      role,
      status: "missing_candidate_profile",
    });
  }

  if (!enemyProfile) {
    return emptyMechanicalFitResult({
      candidateChampionId: normalizedCandidateId,
      enemyChampionId: normalizedEnemyId,
      role,
      status: "missing_enemy_profile",
    });
  }

  if (
    candidateProfile.strengths.length === 0 ||
    candidateProfile.vulnerabilities.length === 0 ||
    enemyProfile.strengths.length === 0 ||
    enemyProfile.vulnerabilities.length === 0
  ) {
    return emptyMechanicalFitResult({
      candidateChampionId: normalizedCandidateId,
      enemyChampionId: normalizedEnemyId,
      role,
      status: "incomplete_profile",
    });
  }

  const factors = getMechanicalFitFactors(candidateProfile, enemyProfile);
  const rawScore = Number(
    factors.reduce((total, factor) => total + factor.contribution, 0).toFixed(4),
  );
  const maxRawScore = getMechanicalFitMaxRawScore(candidateProfile);
  const score =
    maxRawScore > 0
      ? Math.min(100, Math.round(Math.sqrt(rawScore / maxRawScore) * 100))
      : 0;

  return {
    candidateChampionId: normalizedCandidateId,
    enemyChampionId: normalizedEnemyId,
    factors: factors.sort((left, right) => right.contribution - left.contribution),
    maxRawScore,
    rawScore,
    role,
    score,
    status: "calculated",
  };
}

export function getCounterRankingV2ComparisonRows({
  candidateChampionIds,
  enemyChampionId,
  observedByChampionId,
  role,
}: {
  candidateChampionIds: string[];
  enemyChampionId: string;
  observedByChampionId: Map<string, CounterRankingV2ObservedRankSnapshot>;
  role: LeagueRole;
}): CounterRankingV2ComparisonRow[] {
  const mechanicalRows = candidateChampionIds
    .map((candidateChampionId) => ({
      candidateChampionId: normalizeChampionId(candidateChampionId),
      mechanicalResult: calculateMechanicalMatchupFit({
        candidateChampionId,
        enemyChampionId,
        role,
      }),
    }))
    .filter((row) => row.candidateChampionId !== normalizeChampionId(enemyChampionId));
  const rankedMechanicalRows = [...mechanicalRows]
    .filter((row) => row.mechanicalResult.status === "calculated")
    .sort((left, right) => {
      if (left.mechanicalResult.score !== right.mechanicalResult.score) {
        return right.mechanicalResult.score - left.mechanicalResult.score;
      }

      return left.candidateChampionId.localeCompare(right.candidateChampionId);
    });
  const mechanicalRankByChampionId = new Map(
    rankedMechanicalRows.map((row, index) => [row.candidateChampionId, index + 1] as const),
  );

  return mechanicalRows
    .map((row) => {
      const mechanicalRank = mechanicalRankByChampionId.get(row.candidateChampionId) ?? null;
      const observed = observedByChampionId.get(row.candidateChampionId) ?? null;
      const rankDelta =
        observed?.rank && mechanicalRank ? observed.rank - mechanicalRank : null;

      return {
        candidateChampionId: row.candidateChampionId,
        mechanicalRank,
        mechanicalResult: row.mechanicalResult,
        observed,
        rankDelta,
      };
    })
    .sort((left, right) => {
      const leftRank = left.mechanicalRank ?? Number.POSITIVE_INFINITY;
      const rightRank = right.mechanicalRank ?? Number.POSITIVE_INFINITY;

      if (leftRank !== rightRank) {
        return leftRank - rightRank;
      }

      return left.candidateChampionId.localeCompare(right.candidateChampionId);
    });
}

export function createObservedCounterRankingV2Snapshot({
  games,
  rank,
  winRate,
}: {
  games: number | null;
  rank: number | null;
  winRate: number | null;
}): CounterRankingV2ObservedRankSnapshot {
  return {
    confidence: calculateCounterPickConfidence(games ?? 0),
    games,
    rank,
    winRate,
  };
}

function getMechanicalFitFactors(
  candidateProfile: CounterRankingV2ChampionProfile,
  enemyProfile: CounterRankingV2ChampionProfile,
) {
  const enemyVulnerabilityWeightById = new Map(
    enemyProfile.vulnerabilities.map((vulnerability) => [
      vulnerability.traitId,
      clampTraitWeight(vulnerability.weight),
    ] as const),
  );
  const factors: CounterRankingV2Factor[] = [];

  for (const strength of candidateProfile.strengths) {
    const strengthWeight = clampTraitWeight(strength.weight);
    const interactions = counterRankingV2TraitInteractions.filter(
      (interaction) => interaction.candidateStrength === strength.traitId,
    );

    for (const interaction of interactions) {
      const vulnerabilityWeight = enemyVulnerabilityWeightById.get(
        interaction.enemyVulnerability,
      );

      if (!vulnerabilityWeight) {
        continue;
      }

      const contribution = Number(
        (strengthWeight * vulnerabilityWeight * interaction.weight).toFixed(4),
      );

      if (contribution <= 0) {
        continue;
      }

      factors.push({
        candidateStrength: interaction.candidateStrength,
        contribution,
        enemyVulnerability: interaction.enemyVulnerability,
        interactionWeight: interaction.weight,
        reason: interaction.reason,
      });
    }
  }

  return factors;
}

function getMechanicalFitMaxRawScore(candidateProfile: CounterRankingV2ChampionProfile) {
  const maxRawScore = candidateProfile.strengths.reduce((total, strength) => {
    const maxContributionForStrength = counterRankingV2TraitInteractions
      .filter((interaction) => interaction.candidateStrength === strength.traitId)
      .reduce(
        (strengthTotal, interaction) =>
          strengthTotal + clampTraitWeight(strength.weight) * maxTraitWeight * interaction.weight,
        0,
      );

    return total + maxContributionForStrength;
  }, 0);

  return Number(maxRawScore.toFixed(4));
}

function emptyMechanicalFitResult({
  candidateChampionId,
  enemyChampionId,
  role,
  status,
}: {
  candidateChampionId: string;
  enemyChampionId: string;
  role: LeagueRole | null;
  status: CounterRankingV2FitStatus;
}): CounterRankingV2MechanicalFitResult {
  return {
    candidateChampionId,
    enemyChampionId,
    factors: [],
    maxRawScore: 0,
    rawScore: 0,
    role,
    score: 0,
    status,
  };
}

function profile(
  championId: string,
  reviewStatus: CounterRankingV2ProfileStatus,
  version: number,
  traits: Pick<CounterRankingV2ChampionProfile, "strengths" | "vulnerabilities">,
): CounterRankingV2ChampionProfile {
  return {
    championId,
    reviewStatus,
    version,
    ...traits,
  };
}

function trait(
  traitId: CounterRankingV2TraitId,
  weight: number,
): CounterRankingV2ProfileTrait {
  return {
    traitId,
    weight: clampTraitWeight(weight),
  };
}

function clampTraitWeight(weight: number) {
  return Math.min(maxTraitWeight, Math.max(0, Number.isFinite(weight) ? weight : 0));
}

function normalizeChampionId(championId: string) {
  return championId.trim().toLowerCase();
}
