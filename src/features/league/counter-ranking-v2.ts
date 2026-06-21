import { calculateCounterPickConfidence } from "./counter-pick-confidence.ts";
import type { CounterPickStatistics } from "./counter-pick-statistics.ts";
import { getChampionMasteryRequirementLevel } from "./champion-mastery-requirements.ts";
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
  supportedRoles: LeagueRole[];
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

export type CounterRankingV2FactorImpactLevel = "high" | "low" | "medium";

export type CounterRankingV2MechanicalReason = {
  explanation: string;
  factor: CounterRankingV2Factor;
  impactLevel: CounterRankingV2FactorImpactLevel;
  title: string;
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

export type CounterRankingV2AdjustmentReason =
  | "auto_generated"
  | "data_disagreement"
  | "manual_review"
  | "meta_shift"
  | "other"
  | "patch_buff"
  | "patch_nerf"
  | "practical_difficulty";

export type CounterRankingV2ReviewStatus =
  | "high_mastery_required"
  | "incorrect_suggestion"
  | "needs_more_data"
  | "unreviewed"
  | "verified_soft_counter"
  | "verified_strong_counter";

export type CounterRankingV2ReviewFilter =
  | "all"
  | "auto_approval_candidate"
  | "auto_approved"
  | "auto_suggested"
  | "incorrect_suggestion"
  | "low_sample"
  | "manual_approved"
  | "manual_rejected"
  | "needs_more_data"
  | "needs_review"
  | "public_eligible"
  | "unreviewed"
  | "verified_soft_counter"
  | "verified_strong_counter";

export type CounterRankingV2SuggestedStrength =
  | "hard_counter"
  | "neutral"
  | "poor_fit"
  | "soft_counter"
  | "strong_counter";

export type CounterRankingV2AutomationStatus =
  | "auto_approval_candidate"
  | "auto_approved"
  | "auto_suggested"
  | "manual_approved"
  | "manual_rejected"
  | "needs_review";

export type CounterRankingV2AutomationConfidence = "high" | "low" | "medium";

export type CounterRankingV2MechanicalReview = {
  adjustmentReason: CounterRankingV2AdjustmentReason;
  adminReviewNote: string | null;
  calculatedMechanicalScore: number;
  counterChampionId: string;
  createdAt: string | null;
  enemyChampionId: string;
  finalMechanicalScore: number;
  generatedAt: string | null;
  generatedBy: string | null;
  manualAdjustment: number;
  publicEligible: boolean;
  reviewStatus: CounterRankingV2ReviewStatus;
  reviewedAt: string | null;
  reviewedBy: string | null;
  role: LeagueRole;
  updatedAt: string | null;
};

export type CounterRankingV2ComparisonRow = {
  automationSuggestion: CounterRankingV2MechanicalSuggestion | null;
  candidateChampionId: string;
  mechanicalRank: number | null;
  mechanicalResult: CounterRankingV2MechanicalFitResult;
  review: CounterRankingV2MechanicalReview | null;
  rankDelta: number | null;
  observed: CounterRankingV2ObservedRankSnapshot | null;
};

export type CounterRankingV2MechanicalSuggestion = {
  automationStatus: CounterRankingV2AutomationStatus;
  confidence: CounterRankingV2AutomationConfidence;
  factors: CounterRankingV2Factor[];
  reasons: string[];
  score: number;
  suggestedStrength: CounterRankingV2SuggestedStrength;
};

export type CounterRankingV2AutomationSummary = {
  autoApprovalCandidates: number;
  autoApproved: number;
  autoSuggested: number;
  generatedSuggestions: number;
  manualApproved: number;
  manualRejected: number;
  needsReview: number;
};

export type CounterRankingV2ReviewProgressSummary = {
  incorrectSuggestions: number;
  needsMoreData: number;
  publicEligible: number;
  reviewed: number;
  total: number;
  unreviewed: number;
  verifiedSoftCounters: number;
  verifiedStrongCounters: number;
};

export type CounterRankingV2PublicPreviewRow = {
  candidateChampionId: string;
  confidenceLabel: string;
  currentPublicRank: number | null;
  finalReviewedScore: number;
  isLowSampleDesignCounter: boolean;
  observedGames: number | null;
  reviewStatus: CounterRankingV2ReviewStatus;
};

type CounterRankingV2TraitInteraction = {
  candidateStrength: CounterRankingV2TraitId;
  enemyVulnerability: CounterRankingV2TraitId;
  reason: string;
  weight: number;
};

const maxTraitWeight = 5;
export const counterRankingV2ManualAdjustmentMin = -30;
export const counterRankingV2ManualAdjustmentMax = 30;
export const counterRankingV2DefaultAdjustmentReason = "manual_review";
export const counterRankingV2DefaultReviewStatus = "unreviewed";
export const useReviewedMechanicalCountersPublicly =
  process.env.NEXT_PUBLIC_USE_REVIEWED_MECHANICAL_COUNTERS_PUBLICLY === "true";

export const counterRankingV2AdjustmentReasons = [
  "auto_generated",
  "patch_buff",
  "patch_nerf",
  "meta_shift",
  "practical_difficulty",
  "data_disagreement",
  "manual_review",
  "other",
] as const satisfies readonly CounterRankingV2AdjustmentReason[];

export const counterRankingV2ReviewStatuses = [
  "unreviewed",
  "verified_strong_counter",
  "verified_soft_counter",
  "incorrect_suggestion",
  "high_mastery_required",
  "needs_more_data",
] as const satisfies readonly CounterRankingV2ReviewStatus[];
export const counterRankingV2PublicApprovedReviewStatuses = [
  "verified_strong_counter",
  "verified_soft_counter",
] as const;

export const counterRankingV2SupportedChampionIds = [
  "vex",
  "yone",
  "yasuo",
  "akali",
  "annie",
  "malzahar",
  "lissandra",
  "kassadin",
  "ahri",
  "syndra",
  "orianna",
  "zed",
  "katarina",
  "leblanc",
  "viktor",
  "sylas",
  "fizz",
  "hwei",
  "malphite",
  "veigar",
  "akshan",
  "anivia",
  "aurelionsol",
  "aurora",
  "azir",
  "cassiopeia",
  "corki",
  "diana",
  "ekko",
  "galio",
  "irelia",
  "lux",
  "mel",
  "naafiri",
  "neeko",
  "qiyana",
  "ryze",
  "taliyah",
  "talon",
  "twistedfate",
  "vladimir",
  "xerath",
  "ziggs",
  "zoe",
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
    notes: "Anti-dash mage baseline for testing mobile melee mid counters.",
    strengths: [
      trait("anti_dash", 5),
      trait("reliable_cc", 4),
      trait("burst_damage", 4),
      trait("poke", 3),
    ],
    vulnerabilities: [trait("immobile", 3), trait("cooldown_reliant", 3), trait("short_range", 2)],
  }),
  profile("yone", "reviewed", 1, {
    notes: "Mobile melee carry profile used as the primary dash-reliant enemy fixture.",
    strengths: [trait("mobility", 5), trait("sustained_damage", 4), trait("late_scaling", 4)],
    vulnerabilities: [
      trait("dash_reliant", 5),
      trait("melee_commit", 4),
      trait("mobility_reliant", 4),
      trait("early_weakness", 2),
    ],
  }),
  profile("yasuo", "reviewed", 1, {
    notes: "Dash-reliant melee skirmisher profile for anti-dash and lockdown tests.",
    strengths: [trait("mobility", 5), trait("sustained_damage", 4), trait("waveclear", 3)],
    vulnerabilities: [
      trait("dash_reliant", 5),
      trait("melee_commit", 4),
      trait("mobility_reliant", 4),
      trait("fragile", 2),
    ],
  }),
  profile("akali", "needs_review", 1, {
    notes: "Mobile assassin profile with weak wave control and cooldown windows.",
    strengths: [trait("mobility", 5), trait("burst_damage", 4), trait("anti_magic", 2)],
    vulnerabilities: [
      trait("mobility_reliant", 5),
      trait("cooldown_reliant", 3),
      trait("waveclear_weak", 3),
    ],
  }),
  profile("annie", "needs_review", 1, {
    notes: "Short-range burst mage profile with reliable targeted lockdown.",
    strengths: [trait("point_and_click_cc", 5), trait("burst_damage", 4), trait("reliable_cc", 3)],
    vulnerabilities: [trait("short_range", 4), trait("immobile", 4), trait("cooldown_reliant", 3)],
  }),
  profile("malzahar", "needs_review", 1, {
    notes: "Suppression and waveclear profile for testing mobile-fragile counter pressure.",
    strengths: [trait("suppression", 5), trait("waveclear", 4), trait("reliable_cc", 3)],
    vulnerabilities: [trait("immobile", 4), trait("early_weakness", 3), trait("cooldown_reliant", 3)],
  }),
  profile("lissandra", "needs_review", 1, {
    notes: "Reliable crowd-control mage profile for punishing committed melee entries.",
    strengths: [trait("reliable_cc", 5), trait("point_and_click_cc", 3), trait("burst_damage", 3)],
    vulnerabilities: [trait("short_range", 3), trait("cooldown_reliant", 4), trait("early_weakness", 2)],
  }),
  profile("kassadin", "needs_review", 1, {
    notes: "Late-scaling anti-magic assassin profile with exploitable early wave states.",
    strengths: [trait("late_scaling", 5), trait("anti_magic", 4), trait("mobility", 4)],
    vulnerabilities: [
      trait("early_weakness", 5),
      trait("waveclear_weak", 4),
      trait("melee_commit", 2),
    ],
  }),
  profile("ahri", "draft", 1, {
    notes: "Mobile pick mage profile with charm setup, poke, and cooldown-dependent threat.",
    strengths: [trait("mobility", 4), trait("reliable_cc", 3), trait("poke", 3), trait("burst_damage", 3)],
    vulnerabilities: [trait("cooldown_reliant", 4), trait("fragile", 3), trait("waveclear_weak", 2)],
  }),
  profile("syndra", "draft", 1, {
    notes: "Longer-range burst control mage profile with strong punish windows but low mobility.",
    strengths: [trait("burst_damage", 5), trait("poke", 4), trait("reliable_cc", 3), trait("waveclear", 3)],
    vulnerabilities: [trait("immobile", 4), trait("cooldown_reliant", 3), trait("fragile", 3)],
  }),
  profile("orianna", "draft", 1, {
    notes: "Control mage profile with wave control and reliable zone setup, offset by immobility.",
    strengths: [trait("waveclear", 5), trait("poke", 3), trait("reliable_cc", 3), trait("late_scaling", 3)],
    vulnerabilities: [trait("immobile", 4), trait("fragile", 3), trait("cooldown_reliant", 2)],
  }),
  profile("zed", "draft", 1, {
    notes: "Mobile AD assassin profile that depends on shadow windows and committed burst access.",
    strengths: [trait("mobility", 5), trait("burst_damage", 5), trait("poke", 2)],
    vulnerabilities: [
      trait("cooldown_reliant", 4),
      trait("mobility_reliant", 4),
      trait("melee_commit", 3),
      trait("fragile", 2),
    ],
  }),
  profile("katarina", "draft", 1, {
    notes: "Reset assassin profile with high mobility but heavy dependence on entry timing.",
    strengths: [trait("mobility", 5), trait("burst_damage", 4), trait("sustained_damage", 3)],
    vulnerabilities: [
      trait("mobility_reliant", 5),
      trait("melee_commit", 4),
      trait("fragile", 3),
      trait("waveclear_weak", 3),
    ],
  }),
  profile("leblanc", "draft", 1, {
    notes: "Mobile burst mage profile with distortion windows and chain follow-up pressure.",
    strengths: [trait("mobility", 5), trait("burst_damage", 4), trait("reliable_cc", 2), trait("poke", 2)],
    vulnerabilities: [
      trait("mobility_reliant", 4),
      trait("cooldown_reliant", 4),
      trait("waveclear_weak", 3),
      trait("fragile", 2),
    ],
  }),
  profile("viktor", "draft", 1, {
    notes: "Scaling control mage profile with wave control and zone pressure but low repositioning.",
    strengths: [trait("waveclear", 5), trait("poke", 4), trait("late_scaling", 4), trait("sustained_damage", 3)],
    vulnerabilities: [trait("immobile", 4), trait("early_weakness", 3), trait("cooldown_reliant", 2)],
  }),
  profile("sylas", "draft", 1, {
    notes: "Melee AP skirmisher profile with mobility and sustain-oriented extended trades.",
    strengths: [trait("mobility", 4), trait("sustained_damage", 4), trait("burst_damage", 3)],
    vulnerabilities: [
      trait("melee_commit", 4),
      trait("cooldown_reliant", 4),
      trait("waveclear_weak", 3),
      trait("early_weakness", 2),
    ],
  }),
  profile("fizz", "draft", 1, {
    notes: "Mobile melee burst profile with evasive cooldown windows and committed all-ins.",
    strengths: [trait("mobility", 5), trait("burst_damage", 5), trait("anti_magic", 2)],
    vulnerabilities: [
      trait("melee_commit", 4),
      trait("cooldown_reliant", 4),
      trait("waveclear_weak", 3),
      trait("fragile", 2),
    ],
  }),
  profile("hwei", "draft", 1, {
    notes: "Artillery control mage profile with broad poke, waveclear, and utility but low mobility.",
    strengths: [trait("poke", 5), trait("waveclear", 4), trait("reliable_cc", 3), trait("burst_damage", 3)],
    vulnerabilities: [trait("immobile", 5), trait("fragile", 3), trait("cooldown_reliant", 3)],
  }),
  profile("malphite", "draft", 1, {
    notes: "Mid flex engage profile with reliable initiation and anti-physical trading, but low wave agency.",
    strengths: [trait("reliable_cc", 5), trait("anti_dash", 3), trait("burst_damage", 3)],
    vulnerabilities: [
      trait("cooldown_reliant", 4),
      trait("waveclear_weak", 3),
      trait("short_range", 3),
      trait("early_weakness", 2),
    ],
  }),
  profile("veigar", "draft", 1, {
    notes: "Scaling cage mage profile with burst and zone control but punishable early tempo.",
    strengths: [trait("late_scaling", 5), trait("burst_damage", 4), trait("reliable_cc", 4), trait("waveclear", 3)],
    vulnerabilities: [trait("immobile", 4), trait("early_weakness", 4), trait("cooldown_reliant", 3)],
  }),
  profile("akshan", "draft", 1, {
    notes: "Ranged roaming marksman profile with lane poke, swing mobility, and reset pressure.",
    strengths: [trait("poke", 4), trait("mobility", 4), trait("sustained_damage", 3), trait("waveclear", 2)],
    vulnerabilities: [trait("mobility_reliant", 4), trait("cooldown_reliant", 3), trait("fragile", 3)],
  }),
  profile("anivia", "draft", 1, {
    notes: "Immobile control mage profile with strong waveclear, scaling, and reliable zone control.",
    strengths: [trait("waveclear", 5), trait("reliable_cc", 4), trait("late_scaling", 4), trait("burst_damage", 3)],
    vulnerabilities: [trait("immobile", 5), trait("early_weakness", 3), trait("cooldown_reliant", 3)],
  }),
  profile("aurelionsol", "draft", 1, {
    notes: "Late-scaling battlemage profile with strong wave control but punishable early lane states.",
    strengths: [trait("late_scaling", 5), trait("waveclear", 4), trait("sustained_damage", 4), trait("poke", 2)],
    vulnerabilities: [trait("early_weakness", 5), trait("immobile", 3), trait("cooldown_reliant", 3)],
  }),
  profile("aurora", "draft", 1, {
    notes: "Mobile short-range mage profile with burst windows and repositioning dependence.",
    strengths: [trait("mobility", 4), trait("burst_damage", 4), trait("sustained_damage", 3), trait("poke", 2)],
    vulnerabilities: [trait("short_range", 4), trait("mobility_reliant", 3), trait("cooldown_reliant", 3)],
  }),
  profile("azir", "draft", 1, {
    notes: "Scaling control mage profile with sustained soldier damage and wave control.",
    strengths: [trait("late_scaling", 5), trait("sustained_damage", 5), trait("waveclear", 4), trait("mobility", 2)],
    vulnerabilities: [trait("early_weakness", 4), trait("cooldown_reliant", 3), trait("fragile", 3)],
  }),
  profile("cassiopeia", "draft", 1, {
    notes: "Short-range sustained DPS mage profile with anti-dash threat and low repositioning.",
    strengths: [trait("sustained_damage", 5), trait("anti_dash", 4), trait("late_scaling", 4), trait("reliable_cc", 2)],
    vulnerabilities: [trait("short_range", 4), trait("immobile", 4), trait("cooldown_reliant", 2)],
  }),
  profile("corki", "draft", 1, {
    notes: "Scaling poke marksman profile with package-era burst windows and cooldown dependence.",
    strengths: [trait("poke", 4), trait("late_scaling", 4), trait("burst_damage", 3), trait("mobility", 2)],
    vulnerabilities: [trait("cooldown_reliant", 3), trait("early_weakness", 3), trait("fragile", 3)],
  }),
  profile("diana", "draft", 1, {
    notes: "Melee AP diver profile with burst engage and committed dash access.",
    strengths: [trait("burst_damage", 4), trait("mobility", 4), trait("sustained_damage", 3), trait("waveclear", 3)],
    vulnerabilities: [trait("dash_reliant", 4), trait("melee_commit", 4), trait("cooldown_reliant", 3)],
  }),
  profile("ekko", "draft", 1, {
    notes: "Mobile AP skirmisher profile with burst trades, late scaling, and cooldown windows.",
    strengths: [trait("mobility", 5), trait("burst_damage", 4), trait("late_scaling", 3), trait("waveclear", 3)],
    vulnerabilities: [trait("mobility_reliant", 4), trait("cooldown_reliant", 4), trait("melee_commit", 3)],
  }),
  profile("galio", "draft", 1, {
    notes: "Anti-magic control tank profile with reliable crowd control and roam support.",
    strengths: [trait("anti_magic", 5), trait("reliable_cc", 4), trait("waveclear", 3), trait("burst_damage", 2)],
    vulnerabilities: [trait("short_range", 3), trait("cooldown_reliant", 3), trait("early_weakness", 2)],
  }),
  profile("irelia", "draft", 1, {
    notes: "Dash-reliant melee skirmisher profile with sustained damage and wave-dependent access.",
    strengths: [trait("mobility", 5), trait("sustained_damage", 5), trait("burst_damage", 3)],
    vulnerabilities: [
      trait("dash_reliant", 5),
      trait("melee_commit", 4),
      trait("mobility_reliant", 4),
      trait("cooldown_reliant", 2),
    ],
  }),
  profile("lux", "draft", 1, {
    notes: "Long-range pick mage profile with poke, waveclear, and fragile immobile spacing.",
    strengths: [trait("poke", 5), trait("burst_damage", 4), trait("reliable_cc", 3), trait("waveclear", 3)],
    vulnerabilities: [trait("immobile", 5), trait("fragile", 4), trait("cooldown_reliant", 3)],
  }),
  profile("mel", "draft", 1, {
    notes: "Ranged mage profile with poke pressure, projectile defense, and cooldown-reliant trades.",
    strengths: [trait("poke", 4), trait("burst_damage", 4), trait("waveclear", 3), trait("reliable_cc", 2)],
    vulnerabilities: [trait("cooldown_reliant", 4), trait("fragile", 3), trait("immobile", 3)],
  }),
  profile("naafiri", "draft", 1, {
    notes: "Melee AD assassin profile with pack poke and highly committed dash engage.",
    strengths: [trait("burst_damage", 4), trait("mobility", 4), trait("poke", 2), trait("sustained_damage", 2)],
    vulnerabilities: [
      trait("dash_reliant", 4),
      trait("melee_commit", 5),
      trait("mobility_reliant", 3),
      trait("fragile", 3),
    ],
  }),
  profile("neeko", "draft", 1, {
    notes: "Pick mage profile with reliable crowd control, burst setup, and moderate wave control.",
    strengths: [trait("reliable_cc", 4), trait("burst_damage", 4), trait("waveclear", 3), trait("poke", 3)],
    vulnerabilities: [trait("cooldown_reliant", 3), trait("short_range", 3), trait("fragile", 3)],
  }),
  profile("qiyana", "draft", 1, {
    notes: "Mobile terrain assassin profile with burst windows and committed melee entries.",
    strengths: [trait("mobility", 5), trait("burst_damage", 5), trait("reliable_cc", 2)],
    vulnerabilities: [
      trait("melee_commit", 4),
      trait("cooldown_reliant", 4),
      trait("mobility_reliant", 4),
      trait("waveclear_weak", 3),
    ],
  }),
  profile("ryze", "draft", 1, {
    notes: "Shorter-range scaling battlemage profile with wave control and sustained spell damage.",
    strengths: [trait("late_scaling", 5), trait("sustained_damage", 4), trait("waveclear", 4), trait("point_and_click_cc", 2)],
    vulnerabilities: [trait("short_range", 4), trait("early_weakness", 3), trait("cooldown_reliant", 2)],
  }),
  profile("taliyah", "draft", 1, {
    notes: "Roaming control mage profile with anti-dash tools, poke, and waveclear.",
    strengths: [trait("anti_dash", 4), trait("poke", 4), trait("waveclear", 4), trait("reliable_cc", 3)],
    vulnerabilities: [trait("immobile", 4), trait("cooldown_reliant", 3), trait("fragile", 3)],
  }),
  profile("talon", "draft", 1, {
    notes: "Roaming AD assassin profile with burst access and weak sustained wave states.",
    strengths: [trait("mobility", 4), trait("burst_damage", 5), trait("waveclear", 3)],
    vulnerabilities: [trait("melee_commit", 4), trait("cooldown_reliant", 4), trait("waveclear_weak", 3)],
  }),
  profile("twistedfate", "draft", 1, {
    notes: "Roaming utility mage profile with point-and-click pick tools and low combat mobility.",
    strengths: [trait("point_and_click_cc", 5), trait("waveclear", 4), trait("reliable_cc", 3), trait("poke", 2)],
    vulnerabilities: [trait("immobile", 4), trait("fragile", 3), trait("cooldown_reliant", 3)],
  }),
  profile("vladimir", "draft", 1, {
    notes: "Late-scaling short-range battlemage profile with sustained damage and weak early pressure.",
    strengths: [trait("late_scaling", 5), trait("sustained_damage", 4), trait("anti_magic", 2), trait("burst_damage", 2)],
    vulnerabilities: [trait("early_weakness", 4), trait("short_range", 4), trait("cooldown_reliant", 3)],
  }),
  profile("xerath", "draft", 1, {
    notes: "Artillery mage profile with extreme poke and waveclear but very low mobility.",
    strengths: [trait("poke", 5), trait("waveclear", 4), trait("burst_damage", 3), trait("late_scaling", 2)],
    vulnerabilities: [trait("immobile", 5), trait("fragile", 4), trait("cooldown_reliant", 3)],
  }),
  profile("ziggs", "draft", 1, {
    notes: "Artillery waveclear mage profile with poke siege pressure and fragile immobile spacing.",
    strengths: [trait("waveclear", 5), trait("poke", 5), trait("burst_damage", 3), trait("late_scaling", 2)],
    vulnerabilities: [trait("immobile", 5), trait("fragile", 3), trait("cooldown_reliant", 3)],
  }),
  profile("zoe", "draft", 1, {
    notes: "Long-range pick mage profile with burst poke and cooldown-dependent bubble setups.",
    strengths: [trait("poke", 5), trait("burst_damage", 5), trait("reliable_cc", 3)],
    vulnerabilities: [trait("fragile", 4), trait("cooldown_reliant", 4), trait("waveclear_weak", 3)],
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
  reviewsByCandidateId = new Map(),
  role,
}: {
  candidateChampionIds: string[];
  enemyChampionId: string;
  observedByChampionId: Map<string, CounterRankingV2ObservedRankSnapshot>;
  reviewsByCandidateId?: Map<string, CounterRankingV2MechanicalReview>;
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
      const review = reviewsByCandidateId.get(row.candidateChampionId) ?? null;

      return {
        automationSuggestion: generateCounterRankingV2MechanicalSuggestion({
          mechanicalResult: row.mechanicalResult,
          observed,
          review,
        }),
        candidateChampionId: row.candidateChampionId,
        mechanicalRank,
        mechanicalResult: row.mechanicalResult,
        observed,
        review,
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

export function generateCounterRankingV2MechanicalSuggestionsForRole({
  enemyChampionId,
  observedByChampionId,
  reviewsByCandidateId = new Map(),
  role,
}: {
  enemyChampionId: string;
  observedByChampionId: Map<string, CounterRankingV2ObservedRankSnapshot>;
  reviewsByCandidateId?: Map<string, CounterRankingV2MechanicalReview>;
  role: LeagueRole;
}): CounterRankingV2ComparisonRow[] {
  const normalizedEnemyChampionId = normalizeChampionId(enemyChampionId);
  const candidateChampionIds = counterRankingV2ChampionProfiles
    .filter((profile) => profile.championId !== normalizedEnemyChampionId)
    .filter((profile) => profile.supportedRoles.includes(role))
    .map((profile) => profile.championId);

  return getCounterRankingV2ComparisonRows({
    candidateChampionIds,
    enemyChampionId,
    observedByChampionId,
    reviewsByCandidateId,
    role,
  });
}

export function sortCounterRankingV2RowsByReviewPriority(
  rows: CounterRankingV2ComparisonRow[],
): CounterRankingV2ComparisonRow[] {
  return [...rows].sort((left, right) => {
    const leftReviewedPriority = getCounterRankingV2ReviewPriority(left);
    const rightReviewedPriority = getCounterRankingV2ReviewPriority(right);

    if (leftReviewedPriority !== rightReviewedPriority) {
      return leftReviewedPriority - rightReviewedPriority;
    }

    const leftScore = getCounterRankingV2ReviewPriorityScore(left);
    const rightScore = getCounterRankingV2ReviewPriorityScore(right);

    if (leftScore !== rightScore) {
      return rightScore - leftScore;
    }

    const leftRankDelta = Math.max(0, left.rankDelta ?? 0);
    const rightRankDelta = Math.max(0, right.rankDelta ?? 0);

    if (leftRankDelta !== rightRankDelta) {
      return rightRankDelta - leftRankDelta;
    }

    const leftMechanicalRank = left.mechanicalRank ?? Number.POSITIVE_INFINITY;
    const rightMechanicalRank = right.mechanicalRank ?? Number.POSITIVE_INFINITY;

    if (leftMechanicalRank !== rightMechanicalRank) {
      return leftMechanicalRank - rightMechanicalRank;
    }

    return left.candidateChampionId.localeCompare(right.candidateChampionId);
  });
}

function getCounterRankingV2ReviewPriority(row: CounterRankingV2ComparisonRow) {
  return row.review?.reviewStatus === undefined || row.review.reviewStatus === "unreviewed" ? 0 : 1;
}

function getCounterRankingV2ReviewPriorityScore(row: CounterRankingV2ComparisonRow) {
  if (row.review) {
    return row.review.finalMechanicalScore;
  }

  return row.mechanicalResult.status === "calculated" ? row.mechanicalResult.score : -1;
}

export function filterCounterRankingV2RowsByReviewFilter({
  filter,
  minimumGames,
  rows,
}: {
  filter: CounterRankingV2ReviewFilter;
  minimumGames: number;
  rows: CounterRankingV2ComparisonRow[];
}) {
  if (filter === "all") {
    return rows;
  }

  return rows.filter((row) =>
    isCounterRankingV2RowMatchingReviewFilter({
      filter,
      minimumGames,
      row,
    }),
  );
}

export function isCounterRankingV2RowMatchingReviewFilter({
  filter,
  minimumGames,
  row,
}: {
  filter: CounterRankingV2ReviewFilter;
  minimumGames: number;
  row: CounterRankingV2ComparisonRow;
}) {
  if (filter === "unreviewed") {
    return row.review === null || row.review.reviewStatus === "unreviewed";
  }

  if (filter === "public_eligible") {
    return isCounterRankingV2ReviewPublicEligible(row.review);
  }

  if (filter === "low_sample") {
    const observedGames = row.observed?.games ?? 0;

    return observedGames > 0 && observedGames < minimumGames;
  }

  if (isCounterRankingV2AutomationStatus(filter)) {
    return row.automationSuggestion?.automationStatus === filter;
  }

  return row.review?.reviewStatus === filter;
}

export function getCounterRankingV2FactorImpactLevel(
  factor: Pick<CounterRankingV2Factor, "contribution">,
): CounterRankingV2FactorImpactLevel {
  if (factor.contribution >= 12) {
    return "high";
  }

  if (factor.contribution >= 6) {
    return "medium";
  }

  return "low";
}

export function getCounterRankingV2MechanicalReasons(
  factors: CounterRankingV2Factor[],
  limit = 3,
): CounterRankingV2MechanicalReason[] {
  return factors.slice(0, limit).map((factor) => ({
    explanation: getCounterRankingV2FactorExplanation(factor),
    factor,
    impactLevel: getCounterRankingV2FactorImpactLevel(factor),
    title: getCounterRankingV2FactorTitle(factor),
  }));
}

export function hasCounterRankingV2WeakMechanicalSignal(
  factors: CounterRankingV2Factor[],
) {
  const topReasons = getCounterRankingV2MechanicalReasons(factors);

  return topReasons.length >= 3 && topReasons.every((reason) => reason.impactLevel === "low");
}

function getCounterRankingV2SuggestedStrength(
  score: number,
): CounterRankingV2SuggestedStrength {
  if (score >= 90) {
    return "hard_counter";
  }

  if (score >= 80) {
    return "strong_counter";
  }

  if (score >= 65) {
    return "soft_counter";
  }

  if (score >= 45) {
    return "neutral";
  }

  return "poor_fit";
}

function getCounterRankingV2ManualAutomationStatus(
  review: CounterRankingV2MechanicalReview | null | undefined,
): CounterRankingV2AutomationStatus | null {
  if (!review) {
    return null;
  }

  if (
    review.reviewStatus === "verified_strong_counter" ||
    review.reviewStatus === "verified_soft_counter"
  ) {
    return "manual_approved";
  }

  if (review.reviewStatus === "incorrect_suggestion") {
    return "manual_rejected";
  }

  return "needs_review";
}

function isCounterRankingV2AutoApprovalBlockedByReview(
  review: CounterRankingV2MechanicalReview | null | undefined,
) {
  return (
    review?.reviewStatus === "incorrect_suggestion" ||
    review?.reviewStatus === "needs_more_data"
  );
}

function isCounterRankingV2HighMasteryCandidate(candidateChampionId: string) {
  const masteryLevel = getChampionMasteryRequirementLevel(candidateChampionId);

  return masteryLevel === "high" || masteryLevel === "very_high";
}

function isCounterRankingV2ObservedContradiction({
  mechanicalResult,
  observed,
}: {
  mechanicalResult: CounterRankingV2MechanicalFitResult;
  observed: CounterRankingV2ObservedRankSnapshot | null;
}) {
  return (
    mechanicalResult.score >= 65 &&
    (observed?.games ?? 0) >= 20 &&
    observed?.winRate !== null &&
    observed?.winRate !== undefined &&
    observed.winRate < 48
  );
}

function isCounterRankingV2OneWeakFactorSignal(factors: CounterRankingV2Factor[]) {
  return (
    factors.length === 1 &&
    getCounterRankingV2FactorImpactLevel(factors[0]) === "low"
  );
}

function getCounterRankingV2AutomationConfidence({
  automationStatus,
  score,
}: {
  automationStatus: CounterRankingV2AutomationStatus;
  score: number;
}): CounterRankingV2AutomationConfidence {
  if (
    automationStatus === "auto_approval_candidate" ||
    automationStatus === "auto_suggested" ||
    automationStatus === "manual_approved"
  ) {
    return "high";
  }

  if (score >= 65) {
    return "medium";
  }

  return "low";
}

function isCounterRankingV2AutomationStatus(
  value: CounterRankingV2ReviewFilter,
): value is CounterRankingV2AutomationStatus {
  return (
    value === "auto_approval_candidate" ||
    value === "auto_approved" ||
    value === "auto_suggested" ||
    value === "manual_approved" ||
    value === "manual_rejected" ||
    value === "needs_review"
  );
}

function getCounterRankingV2FactorTitle(factor: CounterRankingV2Factor) {
  const interactionKey = `${factor.candidateStrength}:${factor.enemyVulnerability}`;

  switch (interactionKey) {
    case "anti_dash:dash_reliant":
      return "Punishes dash commits";
    case "anti_dash:mobility_reliant":
      return "Removes mobility safety";
    case "anti_dash:melee_commit":
      return "Interrupts committed entries";
    case "point_and_click_cc:mobility_reliant":
      return "Locks down slippery targets";
    case "point_and_click_cc:dash_reliant":
      return "Stops dash resets";
    case "reliable_cc:melee_commit":
      return "Controls melee engages";
    case "reliable_cc:mobility_reliant":
      return "Makes mobility risky";
    case "suppression:mobility_reliant":
      return "Denies escape windows";
    case "suppression:fragile":
      return "Creates focus-fire windows";
    case "poke:short_range":
      return "Taxes short range";
    case "poke:waveclear_weak":
      return "Pressures weak waveclear";
    case "burst_damage:fragile":
      return "Threatens fragile targets";
    case "burst_damage:cooldown_reliant":
      return "Punishes cooldown windows";
    case "waveclear:waveclear_weak":
      return "Controls lane tempo";
    case "late_scaling:early_weakness":
      return "Scales through weak early pressure";
    case "sustained_damage:cooldown_reliant":
      return "Punishes cooldown downtime";
    case "anti_magic:burst_damage":
      return "Reduces burst threat";
    default:
      return `${getCounterRankingV2TraitLabel(
        factor.candidateStrength,
      )} targets ${getCounterRankingV2TraitLabel(factor.enemyVulnerability).toLowerCase()}`;
  }
}

function getCounterRankingV2FactorExplanation(factor: CounterRankingV2Factor) {
  return factor.reason;
}

function getCounterRankingV2TraitLabel(traitId: CounterRankingV2TraitId) {
  return counterRankingV2TraitDefinitionsById.get(traitId)?.label ?? traitId;
}

export function generateCounterRankingV2MechanicalSuggestion({
  mechanicalResult,
  observed,
  review,
}: {
  mechanicalResult: CounterRankingV2MechanicalFitResult;
  observed: CounterRankingV2ObservedRankSnapshot | null;
  review?: CounterRankingV2MechanicalReview | null;
}): CounterRankingV2MechanicalSuggestion | null {
  if (mechanicalResult.status !== "calculated") {
    return null;
  }

  const candidateProfile = getCounterRankingV2ChampionProfile(mechanicalResult.candidateChampionId);
  const enemyProfile = getCounterRankingV2ChampionProfile(mechanicalResult.enemyChampionId);

  if (!candidateProfile || !enemyProfile) {
    return null;
  }

  const suggestedStrength = getCounterRankingV2SuggestedStrength(mechanicalResult.score);
  const manualAutomationStatus = getCounterRankingV2ManualAutomationStatus(review);
  const hasHighMasteryBlocker = isCounterRankingV2HighMasteryCandidate(
    mechanicalResult.candidateChampionId,
  );
  const hasObservedContradiction = isCounterRankingV2ObservedContradiction({
    mechanicalResult,
    observed,
  });
  const hasOneWeakFactorSignal = isCounterRankingV2OneWeakFactorSignal(mechanicalResult.factors);
  const reasons: string[] = [];
  let automationStatus: CounterRankingV2AutomationStatus =
    mechanicalResult.score >= 80 ? "auto_suggested" : "needs_review";

  if (manualAutomationStatus) {
    automationStatus = manualAutomationStatus;
    reasons.push("Existing manual review row takes priority over generated suggestions.");
  } else {
    if (mechanicalResult.score < 65) {
      reasons.push("Mechanical score is below the default suggestion threshold.");
    }

    if (
      mechanicalResult.score >= 85 &&
      candidateProfile.reviewStatus === "reviewed" &&
      enemyProfile.reviewStatus === "reviewed" &&
      !hasHighMasteryBlocker &&
      !isCounterRankingV2AutoApprovalBlockedByReview(review) &&
      !hasObservedContradiction &&
      !hasOneWeakFactorSignal
    ) {
      automationStatus = "auto_approval_candidate";
      reasons.push("Safe high-score suggestion is eligible for batch auto-approval review.");
    }

    if (candidateProfile.reviewStatus !== "reviewed" || enemyProfile.reviewStatus !== "reviewed") {
      automationStatus = "needs_review";
      reasons.push("Draft or needs-review profile requires admin review.");
    }

    if (hasHighMasteryBlocker) {
      automationStatus = "needs_review";
      reasons.push("High mastery candidate requires manual review.");
    }

    if (hasObservedContradiction) {
      automationStatus = "needs_review";
      reasons.push("Observed stats strongly contradict the mechanical suggestion.");
    }

    if (hasOneWeakFactorSignal) {
      automationStatus = "needs_review";
      reasons.push("Single weak factor signal requires manual review.");
    }

    if (mechanicalResult.score >= 65 && mechanicalResult.score < 80) {
      automationStatus = "needs_review";
      reasons.push("Medium mechanical score requires manual review.");
    }
  }

  if (reasons.length === 0) {
    reasons.push("High mechanical score from reviewed profiles is auto-suggested for admin review.");
  }

  return {
    automationStatus,
    confidence: getCounterRankingV2AutomationConfidence({
      automationStatus,
      score: mechanicalResult.score,
    }),
    factors: mechanicalResult.factors,
    reasons,
    score: mechanicalResult.score,
    suggestedStrength,
  };
}

export function getCounterRankingV2AutomationSummary(
  rows: CounterRankingV2ComparisonRow[],
): CounterRankingV2AutomationSummary {
  return rows.reduce<CounterRankingV2AutomationSummary>(
    (summary, row) => {
      const automationStatus = row.automationSuggestion?.automationStatus;

      if (!automationStatus) {
        return summary;
      }

      return {
        autoApprovalCandidates:
          summary.autoApprovalCandidates +
          (automationStatus === "auto_approval_candidate" ? 1 : 0),
        autoApproved: summary.autoApproved + (automationStatus === "auto_approved" ? 1 : 0),
        autoSuggested: summary.autoSuggested + (automationStatus === "auto_suggested" ? 1 : 0),
        generatedSuggestions: summary.generatedSuggestions + 1,
        manualApproved: summary.manualApproved + (automationStatus === "manual_approved" ? 1 : 0),
        manualRejected: summary.manualRejected + (automationStatus === "manual_rejected" ? 1 : 0),
        needsReview: summary.needsReview + (automationStatus === "needs_review" ? 1 : 0),
      };
    },
    {
      autoApprovalCandidates: 0,
      autoApproved: 0,
      autoSuggested: 0,
      generatedSuggestions: 0,
      manualApproved: 0,
      manualRejected: 0,
      needsReview: 0,
    },
  );
}

export function getCounterRankingV2ReviewProgressSummary(
  rows: CounterRankingV2ComparisonRow[],
): CounterRankingV2ReviewProgressSummary {
  return rows.reduce<CounterRankingV2ReviewProgressSummary>(
    (summary, row) => {
      const reviewStatus = row.review?.reviewStatus ?? "unreviewed";
      const isUnreviewed = row.review === null || reviewStatus === "unreviewed";

      return {
        incorrectSuggestions:
          summary.incorrectSuggestions + (reviewStatus === "incorrect_suggestion" ? 1 : 0),
        needsMoreData: summary.needsMoreData + (reviewStatus === "needs_more_data" ? 1 : 0),
        publicEligible:
          summary.publicEligible + (isCounterRankingV2ReviewPublicEligible(row.review) ? 1 : 0),
        reviewed: summary.reviewed + (isUnreviewed ? 0 : 1),
        total: summary.total + 1,
        unreviewed: summary.unreviewed + (isUnreviewed ? 1 : 0),
        verifiedSoftCounters:
          summary.verifiedSoftCounters + (reviewStatus === "verified_soft_counter" ? 1 : 0),
        verifiedStrongCounters:
          summary.verifiedStrongCounters + (reviewStatus === "verified_strong_counter" ? 1 : 0),
      };
    },
    {
      incorrectSuggestions: 0,
      needsMoreData: 0,
      publicEligible: 0,
      reviewed: 0,
      total: 0,
      unreviewed: 0,
      verifiedSoftCounters: 0,
      verifiedStrongCounters: 0,
    },
  );
}

export function getCounterRankingV2PublicPreviewRows({
  minimumGames,
  rows,
}: {
  minimumGames: number;
  rows: CounterRankingV2ComparisonRow[];
}): CounterRankingV2PublicPreviewRow[] {
  return rows
    .filter((row) => isCounterRankingV2ApprovedReviewPublicEligible(row.review))
    .map((row) => ({
      candidateChampionId: row.candidateChampionId,
      confidenceLabel: row.observed?.confidence.shortLabel ?? "No data",
      currentPublicRank: row.observed?.rank ?? null,
      finalReviewedScore: row.review?.finalMechanicalScore ?? 0,
      isLowSampleDesignCounter: (row.observed?.games ?? 0) < minimumGames,
      observedGames: row.observed?.games ?? null,
      reviewStatus: row.review?.reviewStatus ?? "unreviewed",
    }))
    .sort((left, right) => {
      if (left.finalReviewedScore !== right.finalReviewedScore) {
        return right.finalReviewedScore - left.finalReviewedScore;
      }

      const leftRank = left.currentPublicRank ?? Number.POSITIVE_INFINITY;
      const rightRank = right.currentPublicRank ?? Number.POSITIVE_INFINITY;

      if (leftRank !== rightRank) {
        return leftRank - rightRank;
      }

      return left.candidateChampionId.localeCompare(right.candidateChampionId);
    });
}

export function clampCounterRankingV2ManualAdjustment(adjustment: number) {
  const finiteAdjustment = Number.isFinite(adjustment) ? adjustment : 0;

  return Math.min(
    counterRankingV2ManualAdjustmentMax,
    Math.max(counterRankingV2ManualAdjustmentMin, finiteAdjustment),
  );
}

export function isCounterRankingV2ManualAdjustmentInBounds(adjustment: number) {
  return (
    Number.isFinite(adjustment) &&
    adjustment >= counterRankingV2ManualAdjustmentMin &&
    adjustment <= counterRankingV2ManualAdjustmentMax
  );
}

export function calculateCounterRankingV2FinalMechanicalScore({
  calculatedMechanicalScore,
  manualAdjustment,
}: {
  calculatedMechanicalScore: number;
  manualAdjustment: number;
}) {
  const finiteCalculatedScore = Number.isFinite(calculatedMechanicalScore)
    ? calculatedMechanicalScore
    : 0;
  const boundedAdjustment = clampCounterRankingV2ManualAdjustment(manualAdjustment);

  return Math.min(100, Math.max(0, finiteCalculatedScore + boundedAdjustment));
}

export function createCounterRankingV2MechanicalReview({
  adjustmentReason = counterRankingV2DefaultAdjustmentReason,
  adminReviewNote = null,
  calculatedMechanicalScore,
  counterChampionId,
  createdAt = null,
  enemyChampionId,
  generatedAt = null,
  generatedBy = null,
  manualAdjustment = 0,
  publicEligible = false,
  reviewStatus = counterRankingV2DefaultReviewStatus,
  reviewedAt = null,
  reviewedBy = null,
  role,
  updatedAt = null,
}: Pick<
  CounterRankingV2MechanicalReview,
  "calculatedMechanicalScore" | "counterChampionId" | "enemyChampionId" | "role"
> &
  Partial<
    Pick<
      CounterRankingV2MechanicalReview,
      | "adjustmentReason"
      | "adminReviewNote"
      | "createdAt"
      | "generatedAt"
      | "generatedBy"
      | "manualAdjustment"
      | "publicEligible"
      | "reviewStatus"
      | "reviewedAt"
      | "reviewedBy"
      | "updatedAt"
    >
  >): CounterRankingV2MechanicalReview {
  const boundedAdjustment = clampCounterRankingV2ManualAdjustment(manualAdjustment);

  return {
    adjustmentReason,
    adminReviewNote,
    calculatedMechanicalScore,
    counterChampionId: normalizeChampionId(counterChampionId),
    createdAt,
    enemyChampionId: normalizeChampionId(enemyChampionId),
    finalMechanicalScore: calculateCounterRankingV2FinalMechanicalScore({
      calculatedMechanicalScore,
      manualAdjustment: boundedAdjustment,
    }),
    generatedAt,
    generatedBy,
    manualAdjustment: boundedAdjustment,
    publicEligible: normalizeCounterRankingV2PublicEligible({
      publicEligible,
      reviewStatus,
    }),
    reviewStatus,
    reviewedAt,
    reviewedBy,
    role,
    updatedAt,
  };
}

export function isCounterRankingV2AdjustmentReason(value: string): value is CounterRankingV2AdjustmentReason {
  return counterRankingV2AdjustmentReasons.includes(value as CounterRankingV2AdjustmentReason);
}

export function isCounterRankingV2ReviewStatus(value: string): value is CounterRankingV2ReviewStatus {
  return counterRankingV2ReviewStatuses.includes(value as CounterRankingV2ReviewStatus);
}

export function isCounterRankingV2ReviewStatusPublicEligible(
  reviewStatus: CounterRankingV2ReviewStatus,
) {
  return reviewStatus !== "incorrect_suggestion" && reviewStatus !== "unreviewed";
}

export function normalizeCounterRankingV2PublicEligible({
  publicEligible,
  reviewStatus,
}: {
  publicEligible: boolean;
  reviewStatus: CounterRankingV2ReviewStatus;
}) {
  return publicEligible && isCounterRankingV2ReviewStatusPublicEligible(reviewStatus);
}

export function isCounterRankingV2ReviewPublicEligible(
  review: Pick<CounterRankingV2MechanicalReview, "publicEligible" | "reviewStatus"> | null,
) {
  return Boolean(
    review?.publicEligible && isCounterRankingV2ReviewStatusPublicEligible(review.reviewStatus),
  );
}

export function isCounterRankingV2ApprovedReviewPublicEligible(
  review: Pick<CounterRankingV2MechanicalReview, "publicEligible" | "reviewStatus"> | null,
) {
  return Boolean(
    review?.publicEligible &&
      (counterRankingV2PublicApprovedReviewStatuses as readonly CounterRankingV2ReviewStatus[]).includes(
        review.reviewStatus,
      ),
  );
}

export function isCounterRankingV2ShadowCandidateEligible({
  minimumGames,
  observedGames,
  review,
}: {
  minimumGames: number;
  observedGames: number | null;
  review: Pick<CounterRankingV2MechanicalReview, "publicEligible" | "reviewStatus"> | null;
}) {
  return (observedGames ?? 0) >= minimumGames || isCounterRankingV2ReviewPublicEligible(review);
}

export function isCounterRankingV2PublicCandidateEligible({
  minimumGames,
  observedGames,
  review,
  useReviewedMechanicalCounters = useReviewedMechanicalCountersPublicly,
}: {
  minimumGames: number;
  observedGames: number | null;
  review: Pick<CounterRankingV2MechanicalReview, "publicEligible" | "reviewStatus"> | null;
  useReviewedMechanicalCounters?: boolean;
}) {
  return (
    (observedGames ?? 0) >= minimumGames ||
    (useReviewedMechanicalCounters && isCounterRankingV2ApprovedReviewPublicEligible(review))
  );
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
  traits: Pick<CounterRankingV2ChampionProfile, "notes" | "strengths" | "vulnerabilities">,
): CounterRankingV2ChampionProfile {
  return {
    championId,
    reviewStatus,
    supportedRoles: ["mid"],
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
