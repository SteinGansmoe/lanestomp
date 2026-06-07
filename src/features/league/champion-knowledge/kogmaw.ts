import type { LeagueChampionKnowledgeProfile } from "./types";

export const kogMawCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: {
    Q: "Caustic Spittle",
    W: "Bio-Arcane Barrage",
    E: "Void Ooze",
    R: "Living Artillery",
  },
  archetype: ["marksman", "hypercarry", "on-hit", "protect-the-carry"],
  primaryWinCondition: [
    "Survive lane with enough CS to reach on-hit spikes, then use (W) range and enchanter or peel support to shred front-to-back fights.",
  ],
  dangerAbilities: ["(W) extended range", "(Q) resistance shred", "(R) execute poke"],
  dangerProfile: {
    dangerousWhen: [
      "(W) is active and he has peel to free-hit.",
      "He reaches on-hit item spikes that let him shred tanks and short-range ADCs.",
      "The wave is stable enough that he can farm without being forced into early all-ins.",
      "His support protects him through engage instead of roaming away.",
    ],
    mustRespect: [
      "(W) changes his range and DPS window; fighting into it is very different from fighting while it is down.",
      "He scales harder than most ADCs if lane stays calm.",
      "(E) slow and (Q) shred help him punish targets that cannot reach him quickly.",
    ],
  },
  commonWeaknesses: [
    "No mobility and highly vulnerable to hard engage.",
    "Weak if forced to fight while (W) is down.",
    "Needs support peel and time to scale.",
  ],
  damageType: "mixed",
  hardCrowdControl: [],
  id: "KogMaw",
  importantAbilityNotes: [
    "(W) is the main trade and DPS window; track its uptime before fighting.",
    "(Q) reduces resistances and can help win extended trades.",
    "(E) slows approach paths and helps him kite but does not replace real peel.",
    "(R) punishes low-health enemies after trades and can check long-range poke angles.",
  ],
  lanePlan: {
    avoids: [
      "Trading heavily while (W) is unavailable.",
      "Pushing without peel or river vision.",
      "Letting engage supports start fights before he can scale.",
      "Taking early short trades where burst ADCs hit first and leave.",
    ],
    idealLaneState:
      "A protected bot lane where Kog'Maw farms safely, trades during (W), and lets support peel create room for scaling DPS.",
    wants: [
      "Enchanter or peel support that keeps engage away.",
      "Stable wave states near his side of lane.",
      "Enemy ADCs forced to farm during his (W) window.",
      "Front-to-back fights after one or two on-hit items.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "low",
    lanePressure: "medium",
    preferredGameState: [
      "Calm lanes where he can farm toward on-hit items.",
      "Extended fights only when (W) is active and peel exists.",
      "Late front-to-back teamfights with protection.",
    ],
    scalingPriority: "very_high",
    winLaneBy: [
      "Preserving health through early engage windows.",
      "Trading only around (W) range advantage.",
      "Punishing enemy CS attempts during (W) uptime.",
      "Reaching item spikes without losing tower or dragon control.",
    ],
  },
  majorPowerSpikes: ["(W) uptime windows", "First on-hit item", "Two-item hypercarry spike"],
  matchupPreferences: {
    strongInto: [
      "Low engage lanes that allow scaling.",
      "Frontlines he can shred with protection.",
      "Short-range ADCs that must walk into (W) range.",
    ],
    weakInto: [
      "Hard engage supports.",
      "Burst ADCs that punish him before items.",
      "Dive comps that ignore his frontline.",
    ],
  },
  mobilityLevel: "none",
  name: "Kog'Maw",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "(W) active",
        reason: "(W) gives his real lane range and DPS window",
        changesGameplay:
          "Kog'Maw can contest CS and trades during (W), but becomes much easier to pressure after it ends.",
        playerAction:
          "Trade and contest last hits while (W) is active, then reset spacing when it is down.",
        enemyResponse:
          "Wait out (W) or force engage before he can free-hit with peel.",
      },
      {
        timing: "Two on-hit items",
        reason: "On-hit scaling turns protected fights into tank-shred windows",
        changesGameplay:
          "If he is protected, front-to-back fights become heavily Kog'Maw favored.",
        playerAction:
          "Group with peel and force objectives where enemies must walk into (W).",
        enemyResponse:
          "Reach him directly or force his support cooldowns before starting front-to-back.",
      },
    ],
  },
  primaryRoles: ["adc"],
  secondaryRoles: [],
  primaryTradingPattern:
    "Farm safely, trade during (W) range windows, and avoid fights when peel or (W) uptime is missing.",
  punishProfile: {
    canPunish: [
      "ADC last hits during (W) range uptime.",
      "Frontline champions that cannot reach him through peel.",
      "Enemies slowed by (E) while he has room to kite.",
    ],
    strugglesToPunish: [
      "Fast all-ins before (W) value matters.",
      "Dive that bypasses his support.",
    ],
  },
  shields: [],
  softCrowdControl: ["(E) slow"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "scale",
    preferredGameLength: "long",
    scalingProfile: "late",
    winMethod: ["on-hit scaling", "protected DPS", "front-to-back fights"],
  },
  supportSynergy: {
    excellentWith: ["Lulu", "Milio", "Janna"],
    goodWith: ["Braum", "Nami", "TahmKench"],
    strugglesWith: ["Pyke", "Leona", "supports that roam or overforce early"],
    notes: [
      "Lulu and Milio give Kog'Maw the protection and range extension he needs to free-hit.",
      "Janna and Braum peel divers during the immobile windows after Kog'Maw commits to (W).",
      "Tahm Kench can reset bad all-ins and protect Kog'Maw from burst engage.",
      "Roaming or hard-forcing supports often leave Kog'Maw exposed before his DPS is online.",
    ],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "(W) is down.",
      "Support cannot peel the enemy engage.",
      "He is forced to stand forward in a large enemy wave.",
    ],
    goodTradeConditions: [
      "(W) is active and the enemy ADC must last-hit.",
      "Support peel is ready.",
      "The fight is front-to-back and enemies cannot reach him quickly.",
    ],
    primaryPattern:
      "Use (W) windows to punish CS and extended fights; avoid pretending he is strong when the range steroid is down.",
  },
  punishWindows: [
    "After (W), his lane threat drops sharply.",
    "No dash makes him punishable if support loses position.",
    "Early forced fights delay his item-scaling plan.",
  ],
} satisfies LeagueChampionKnowledgeProfile;

