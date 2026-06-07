import type { LeagueChampionKnowledgeProfile } from "./types";

export const velkozCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: { Q: "Plasma Fission", W: "Void Rift", E: "Tectonic Disruption", R: "Life Form Disintegration Ray" },
  archetype: ["support", "artillery mage", "poke", "burst"],
  primaryWinCondition: [
    "Win lane with long-range poke angles, force enemies off CS, and convert knockup or slows into laser burst.",
  ],
  dangerAbilities: ["Split (Q) poke", "(E) knockup", "(R) channel"],
  dangerProfile: {
    dangerousWhen: [
      "He can angle (Q) around minions.",
      "Enemy engage cooldowns are down.",
      "Level 6 laser can finish rooted or slowed targets.",
  ],
    mustRespect: [
      "His poke angles are not linear once (Q) splits.",
      "(E) is his only real self-peel.",
      "(R) is powerful but punishable while channeling.",
  ],
  },
  commonWeaknesses: [
    "Immobile.",
    "Weak after (E) misses.",
    "Vulnerable to hard engage and flank angles.",
  ],
  damageType: "magic",
  hardCrowdControl: ["(E) knockup"],
  id: "Velkoz",
  importantAbilityNotes: [
    "His poke angles are not linear once (Q) splits.",
    "(E) is his only real self-peel.",
    "(R) is powerful but punishable while channeling.",
  ],
  lanePlan: {
    avoids: [
      "Channeling (R) into available CC.",
      "Using (E) for poke when engage is up.",
      "Standing near brush without vision.",
  ],
    idealLaneState: "A long-range poke lane where Vel'Koz uses split (Q) angles and wave pressure while saving (E) for disengage or guaranteed burst.",
    wants: [
      "Open poke angles.",
      "ADC that adds long-range damage.",
      "Enemy without hard engage.",
  ],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    lanePressure: "high",
    preferredGameState: [
      "Poke lanes.",
      "Siege setups.",
      "Objective chokes where enemies walk through skillshots.",
  ],
    scalingPriority: "medium",
    winLaneBy: [
      "Landing repeated (Q).",
      "Saving (E).",
      "Finishing with (R).",
  ],
  },
  majorPowerSpikes: ["Level 2 poke plus knockup.", "Level 3 full poke pattern.", "Level 6 laser burst."],
  matchupPreferences: {
    strongInto: [
      "Short-range lanes.",
      "Low-sustain ADCs.",
      "Immobile carries.",
  ],
    weakInto: [
      "Hard engage.",
      "Hook supports.",
      "Mobile ADCs that dodge skillshots.",
  ],
  },
  mobilityLevel: "none",
  name: "Vel'Koz",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 2",
        reason: "Level 2 poke plus knockup.",
        changesGameplay: "The first real bot-lane interaction changes once this support can pair two early abilities.",
        playerAction: "Track the level 2 race and only contest the wave if the ADC can follow the support's threat.",
        enemyResponse: "Respect the level 2 timer and back up before the support reaches the wave first.",
      },
      {
        timing: "Level 3",
        reason: "Level 3 full poke pattern.",
        changesGameplay: "The full basic kit unlocks the support's main trade, peel, or poke pattern.",
        playerAction: "Use the complete kit around brush control, ADC follow-up, and the enemy support's key cooldown.",
        enemyResponse: "Punish the support after their main cooldown is spent or when the wave blocks their angle.",
      },
      {
        timing: "Level 6",
        reason: "Level 6 laser burst.",
        changesGameplay: "The ultimate changes all-in, peel, roam, or objective threat for the bot lane.",
        playerAction: "Use level 6 around confirmed ADC follow-up, river setup, or defensive reset value.",
        enemyResponse: "Track the ultimate cooldown and avoid giving a clean engage or counter-engage angle.",
      },
    ],
  },
  primaryRoles: ["support"],
  secondaryRoles: [],
  primaryTradingPattern: "Use split (Q) angles to avoid minion cover, layer (W), and hold (E) unless the hit is guaranteed or needed for peel.",
  punishProfile: {
    canPunish: [
      "ADCs last-hitting in predictable lines.",
      "Supports with engage cooldown down.",
      "Grouped enemies in choke points.",
  ],
    strugglesToPunish: [
      "Fast engage.",
      "High sustain.",
      "Targets who can interrupt (R).",
  ],
  },
  shields: [],
  softCrowdControl: ["(Q) slow"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "control",
    preferredGameLength: "medium",
    scalingProfile: "mid",
    winMethod: ["Landing repeated (Q).", "Saving (E).", "Finishing with (R)."],
  },
  supportSynergy: {
    excellentWith: ["Jhin", "Caitlyn", "Varus"],
    goodWith: ["Ashe", "Ezreal", "MissFortune"],
    strugglesWith: ["Samira", "Nilah", "Kalista"],
    notes: [
      "Jhin, Caitlyn, Varus convert Vel'Koz's strongest lane pattern especially well.",
      "Ashe, Ezreal, MissFortune fit Vel'Koz when the lane can play around the same tempo window.",
      "Samira, Nilah, Kalista can struggle with Vel'Koz when they need a different lane pace or protection pattern.",
  ],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "(E) misses.",
      "He channels (R) without peel.",
      "Brush control is lost.",
  ],
    goodTradeConditions: [
      "Enemy is slowed.",
      "ADC adds poke.",
      "Engage cooldowns are down.",
  ],
    primaryPattern: "Use split (Q) angles to avoid minion cover, layer (W), and hold (E) unless the hit is guaranteed or needed for peel.",
  },
  punishWindows: [
    "Engage after (E) misses.",
    "Approach through side brush.",
    "Interrupt (R).",
  ],
} satisfies LeagueChampionKnowledgeProfile;
