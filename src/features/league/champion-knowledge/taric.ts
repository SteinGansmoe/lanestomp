import type { LeagueChampionKnowledgeProfile } from "./types";

export const taricCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: { Q: "Starlight's Touch", W: "Bastion", E: "Dazzle", R: "Cosmic Radiance" },
  archetype: ["support", "warden", "peel", "anti-engage"],
  primaryWinCondition: [
    "Protect all-in or scaling carries with linked stuns, sustain, and Cosmic Radiance during committed fights.",
  ],
  dangerAbilities: ["(E) linked stun", "(Q) sustain", "(R) invulnerability"],
  dangerProfile: {
    dangerousWhen: [
      "His ADC can fight inside Bastion range.",
      "Enemy commits into his delayed (R).",
      "He can aim (E) from himself or linked ally.",
    ],
    mustRespect: [
      "Taric is strongest in committed fights, not poke wars.",
      "Cosmic Radiance forces enemies to disengage or lose the all-in.",
      "Linked stun angles can surprise from ADC movement.",
    ],
  },
  commonWeaknesses: [
    "Weak into poke before he reaches melee.",
    "Low engage range without ally setup.",
    "(R) delay can be baited.",
  ],
  damageType: "magic",
  hardCrowdControl: ["(E) stun"],
  id: "Taric",
  importantAbilityNotes: [
    "Taric is strongest in committed fights, not poke wars.",
    "Cosmic Radiance forces enemies to disengage or lose the all-in.",
    "Linked stun angles can surprise from ADC movement.",
  ],
  lanePlan: {
    avoids: [
      "Poke lanes that never commit.",
      "Using (R) too late.",
      "Fighting outside Bastion range.",
    ],
    idealLaneState:
      "A defensive or all-in lane where Taric links to his ADC, threatens stun through their movement, and sustains extended fights.",
    wants: ["ADC that commits forward.", "Enemy dive into his team.", "Extended trades."],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "low",
    preferredGameState: [
      "Anti-dive lanes.",
      "Extended all-ins.",
      "Grouped invulnerability fights.",
    ],
    scalingPriority: "high",
    winLaneBy: ["Landing linked stun.", "Sustaining with (Q).", "Timing (R) before lethal burst."],
  },
  majorPowerSpikes: [
    "Level 2 heal plus stun.",
    "Level 3 Bastion linked angles.",
    "Level 6 Cosmic Radiance.",
  ],
  matchupPreferences: {
    strongInto: ["Dive comps.", "Melee supports.", "ADCs that want committed fights."],
    weakInto: ["Long-range poke.", "Disengage that waits out (R).", "Lanes that kite his stun."],
  },
  mobilityLevel: "low",
  name: "Taric",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 2",
        reason: "Level 2 heal plus stun.",
        changesGameplay:
          "The first real bot-lane interaction changes once this support can pair two early abilities.",
        playerAction:
          "Track the level 2 race and only contest the wave if the ADC can follow the support's threat.",
        enemyResponse:
          "Respect the level 2 timer and back up before the support reaches the wave first.",
      },
      {
        timing: "Level 3",
        reason: "Level 3 Bastion linked angles.",
        changesGameplay:
          "The full basic kit unlocks the support's main trade, peel, or poke pattern.",
        playerAction:
          "Use the complete kit around brush control, ADC follow-up, and the enemy support's key cooldown.",
        enemyResponse:
          "Punish the support after their main cooldown is spent or when the wave blocks their angle.",
      },
      {
        timing: "Level 6",
        reason: "Level 6 Cosmic Radiance.",
        changesGameplay:
          "The ultimate changes all-in, peel, roam, or objective threat for the bot lane.",
        playerAction:
          "Use level 6 around confirmed ADC follow-up, river setup, or defensive reset value.",
        enemyResponse:
          "Track the ultimate cooldown and avoid giving a clean engage or counter-engage angle.",
      },
    ],
  },
  primaryRoles: ["support"],
  secondaryRoles: [],
  primaryTradingPattern:
    "Link with (W), threaten (E) from both positions, and use (R) before the enemy burst lands.",
  punishProfile: {
    canPunish: [
      "Divers entering linked stun range.",
      "All-ins that cannot disengage from (R).",
      "Extended 2v2 fights.",
    ],
    strugglesToPunish: ["Artillery poke.", "Enemies who bait (R).", "Targets outside stun line."],
  },
  shields: ["(W) shield"],
  softCrowdControl: [],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "survive",
    preferredGameLength: "long",
    scalingProfile: "late",
    winMethod: ["Landing linked stun.", "Sustaining with (Q).", "Timing (R) before lethal burst."],
  },
  supportSynergy: {
    excellentWith: ["Nilah", "Samira", "Kalista"],
    goodWith: ["Vayne", "KogMaw", "Tristana"],
    strugglesWith: ["Ezreal", "Caitlyn", "Ziggs"],
    notes: [
      "Nilah, Samira, Kalista convert Taric's strongest lane pattern especially well.",
      "Vayne, KogMaw, Tristana fit Taric when the lane can play around the same tempo window.",
      "Ezreal, Caitlyn, Ziggs can struggle with Taric when they need a different lane pace or protection pattern.",
    ],
  },
  sustain: ["(Q) healing."],
  trading: {
    badTradeConditions: ["(E) misses.", "(R) is baited.", "ADC fights outside Bastion range."],
    goodTradeConditions: [
      "Enemy must commit.",
      "ADC can move stun angle.",
      "Fight will last through (R) delay.",
    ],
    primaryPattern:
      "Link with (W), threaten (E) from both positions, and use (R) before the enemy burst lands.",
  },
  punishWindows: [
    "Poke him before engage.",
    "Disengage when (R) starts.",
    "Fight outside linked stun angles.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
