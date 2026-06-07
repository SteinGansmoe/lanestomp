import type { LeagueChampionKnowledgeProfile } from "./types";

export const sorakaCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: { Q: "Starcall", W: "Astral Infusion", E: "Equinox", R: "Wish" },
  archetype: ["support", "enchanter", "sustain", "anti-burst"],
  primaryWinCondition: [
    "Out-sustain poke and protect carries by landing (Q), healing at the right time, and silencing enemy engage or burst zones.",
  ],
  dangerAbilities: ["(Q) rejuvenation", "(E) silence", "(R) Wish"],
  dangerProfile: {
    dangerousWhen: [
      "She lands (Q) before healing.",
      "Enemy engage relies on channeled or combo spells.",
      "Global (R) can flip fights.",
  ],
    mustRespect: [
      "Soraka changes health bars across the map.",
      "Silence can stop all-in combos.",
      "Her own health is the resource enemies must pressure.",
  ],
  },
  commonWeaknesses: [
    "Very vulnerable to direct engage.",
    "Healing is weaker if she misses (Q).",
    "Can be zoned if enemies threaten her first.",
  ],
  damageType: "magic",
  hardCrowdControl: ["(E) root if enemies remain inside"],
  id: "Soraka",
  importantAbilityNotes: [
    "Soraka changes health bars across the map.",
    "Silence can stop all-in combos.",
    "Her own health is the resource enemies must pressure.",
  ],
  lanePlan: {
    avoids: [
      "Healing without landing (Q).",
      "Standing where engage can reach her.",
      "Using (E) only for poke.",
  ],
    idealLaneState: "A sustain lane where Soraka lands (Q), keeps ADC healthy, and uses silence to stop engage paths or burst combos.",
    wants: [
      "Poke lanes to out-sustain.",
      "ADC who can trade while healed.",
      "Enemy combo paths for (E).",
  ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "low",
    preferredGameState: [
      "Sustain lanes.",
      "Anti-burst fights.",
      "Scaling carry protection.",
  ],
    scalingPriority: "high",
    winLaneBy: [
      "Landing (Q).",
      "Keeping ADC healthy.",
      "Silencing enemy engage.",
  ],
  },
  majorPowerSpikes: ["Level 2 heal plus poke.", "Level 3 silence control.", "Level 6 global Wish."],
  matchupPreferences: {
    strongInto: [
      "Poke lanes.",
      "Burst lanes that need one combo.",
      "Scaling ADCs.",
  ],
    weakInto: [
      "Hard engage.",
      "Hook supports.",
      "Assassins that target her first.",
  ],
  },
  mobilityLevel: "none",
  name: "Soraka",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 2",
        reason: "Level 2 heal plus poke.",
        changesGameplay: "The first real bot-lane interaction changes once this support can pair two early abilities.",
        playerAction: "Track the level 2 race and only contest the wave if the ADC can follow the support's threat.",
        enemyResponse: "Respect the level 2 timer and back up before the support reaches the wave first.",
      },
      {
        timing: "Level 3",
        reason: "Level 3 silence control.",
        changesGameplay: "The full basic kit unlocks the support's main trade, peel, or poke pattern.",
        playerAction: "Use the complete kit around brush control, ADC follow-up, and the enemy support's key cooldown.",
        enemyResponse: "Punish the support after their main cooldown is spent or when the wave blocks their angle.",
      },
      {
        timing: "Level 6",
        reason: "Level 6 global Wish.",
        changesGameplay: "The ultimate changes all-in, peel, roam, or objective threat for the bot lane.",
        playerAction: "Use level 6 around confirmed ADC follow-up, river setup, or defensive reset value.",
        enemyResponse: "Track the ultimate cooldown and avoid giving a clean engage or counter-engage angle.",
      },
    ],
  },
  primaryRoles: ["support"],
  secondaryRoles: [],
  primaryTradingPattern: "Land (Q) for rejuvenation, heal the ADC after favorable trades, and save (E) to interrupt engage or trap exits.",
  punishProfile: {
    canPunish: [
      "Enemies who fail to finish all-ins.",
      "Poke lanes running out of mana.",
      "Channeled abilities or dash endpoints.",
  ],
    strugglesToPunish: [
      "Direct engage onto her.",
      "Long fights when she is low.",
      "Anti-heal rushes.",
  ],
  },
  shields: [],
  softCrowdControl: ["(Q) slow", "(E) silence"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "survive",
    preferredGameLength: "long",
    scalingProfile: "late",
    winMethod: ["Landing (Q).", "Keeping ADC healthy.", "Silencing enemy engage."],
  },
  supportSynergy: {
    excellentWith: ["KogMaw", "Vayne", "Jinx"],
    goodWith: ["Nilah", "Ashe", "Smolder"],
    strugglesWith: ["Draven", "Samira", "Kalista"],
    notes: [
      "KogMaw, Vayne, Jinx convert Soraka's strongest lane pattern especially well.",
      "Nilah, Ashe, Smolder fit Soraka when the lane can play around the same tempo window.",
      "Draven, Samira, Kalista can struggle with Soraka when they need a different lane pace or protection pattern.",
  ],
  },
  sustain: ["(Q) self-heal.", "(W) ally heal.", "(R) global heal."],
  trading: {
    badTradeConditions: [
      "(Q) misses.",
      "Her health is low.",
      "(E) is used before engage.",
  ],
    goodTradeConditions: [
      "Enemy poke is cooldown based.",
      "ADC can trade then be healed.",
      "Global fight needs (R).",
  ],
    primaryPattern: "Land (Q) for rejuvenation, heal the ADC after favorable trades, and save (E) to interrupt engage or trap exits.",
  },
  punishWindows: [
    "Focus Soraka before the ADC.",
    "Engage after (E).",
    "Apply anti-heal and force repeated trades.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
