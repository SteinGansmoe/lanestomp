import type { LeagueChampionKnowledgeProfile } from "./types";

export const karmaCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: { Q: "Inner Flame", W: "Focused Resolve", E: "Inspire", R: "Mantra" },
  archetype: ["support", "poke", "enchanter", "lane pressure"],
  primaryWinCondition: [
    "Use Mantra (Q) and shielded trades to win push, pressure plates, and protect ADC tempo through speed and shielding.",
  ],
  dangerAbilities: ["Mantra (Q)", "(E) shield speed", "Empowered (W) root"],
  dangerProfile: {
    dangerousWhen: [
      "Level 1 Mantra (Q) controls the wave.",
      "Her ADC can trade under (E).",
      "She can root after enemies overcommit.",
  ],
    mustRespect: [
      "Karma often owns early wave tempo.",
      "(E) changes both damage taken and spacing.",
      "Mantra choice decides poke, peel, or survival.",
  ],
  },
  commonWeaknesses: [
    "Lower hard engage threat.",
    "Can fall off if early pressure does not convert.",
    "Root requires staying tethered.",
  ],
  damageType: "magic",
  hardCrowdControl: ["Empowered (W) root"],
  id: "Karma",
  importantAbilityNotes: [
    "Karma often owns early wave tempo.",
    "(E) changes both damage taken and spacing.",
    "Mantra choice decides poke, peel, or survival.",
  ],
  lanePlan: {
    avoids: [
      "Letting hard engage reach her after (E).",
      "Wasting Mantra on low-value poke.",
      "Overpushing without river vision.",
  ],
    idealLaneState: "A pushing lane where Karma lands Mantra (Q), shields ADC trades, and uses wave control to secure plates or river vision.",
    wants: [
      "Wave push.",
      "Poke angles through brush.",
      "ADC ready to trade when shielded.",
  ],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    lanePressure: "high",
    preferredGameState: [
      "Poke lanes.",
      "Push-and-plate lanes.",
      "Objective setups where shields help rotate first.",
  ],
    scalingPriority: "medium",
    winLaneBy: [
      "Landing Mantra (Q).",
      "Shielding ADC trades.",
      "Controlling wave before enemy support can engage.",
  ],
  },
  majorPowerSpikes: ["Level 1 Mantra poke.", "Level 3 poke plus root plus shield.", "First support item upgrade improves tempo."],
  matchupPreferences: {
    strongInto: [
      "Scaling enchanters.",
      "Short-range lanes.",
      "ADCs that struggle under turret.",
  ],
    weakInto: [
      "Hard engage after shield is spent.",
      "Sustain lanes that erase poke.",
      "Long-range mages matching her pressure.",
  ],
  },
  mobilityLevel: "low",
  name: "Karma",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 2",
        reason: "Level 1 Mantra poke.",
        changesGameplay: "The first real bot-lane interaction changes once this support can pair two early abilities.",
        playerAction: "Track the level 2 race and only contest the wave if the ADC can follow the support's threat.",
        enemyResponse: "Respect the level 2 timer and back up before the support reaches the wave first.",
      },
      {
        timing: "Level 3",
        reason: "Level 3 poke plus root plus shield.",
        changesGameplay: "The full basic kit unlocks the support's main trade, peel, or poke pattern.",
        playerAction: "Use the complete kit around brush control, ADC follow-up, and the enemy support's key cooldown.",
        enemyResponse: "Punish the support after their main cooldown is spent or when the wave blocks their angle.",
      },
      {
        timing: "Level 6",
        reason: "First support item upgrade improves tempo.",
        changesGameplay: "The ultimate changes all-in, peel, roam, or objective threat for the bot lane.",
        playerAction: "Use level 6 around confirmed ADC follow-up, river setup, or defensive reset value.",
        enemyResponse: "Track the ultimate cooldown and avoid giving a clean engage or counter-engage angle.",
      },
    ],
  },
  primaryRoles: ["support"],
  secondaryRoles: [],
  primaryTradingPattern: "Push with Mantra (Q), shield the ADC's forward trade, and use (W) only when the enemy cannot break tether safely.",
  punishProfile: {
    canPunish: [
      "ADCs last-hitting under poke.",
      "Supports walking into Mantra (Q) splash.",
      "Engage supports who spend cooldowns on shielded targets.",
  ],
    strugglesToPunish: [
      "High sustain.",
      "Long range artillery.",
      "Clean all-ins after her shield is down.",
  ],
  },
  shields: ["(E) shield", "Mantra (E) team shield"],
  softCrowdControl: ["(Q) slow zone"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "survive",
    preferredGameLength: "medium",
    scalingProfile: "mid",
    winMethod: ["Landing Mantra (Q).", "Shielding ADC trades.", "Controlling wave before enemy support can engage."],
  },
  supportSynergy: {
    excellentWith: ["Caitlyn", "Ezreal", "Sivir"],
    goodWith: ["Varus", "Ashe", "Ziggs"],
    strugglesWith: ["Samira", "Nilah", "KogMaw"],
    notes: [
      "Waveclear and poke ADCs multiply Karma's early push.",
      "Shielded trades help lane bullies take plates safely.",
      "Short-range all-in ADCs may want harder crowd control than Karma provides.",
  ],
  },
  sustain: ["Mantra (W) self-heal."],
  trading: {
    badTradeConditions: [
      "Mantra is down.",
      "(E) is unavailable.",
      "The enemy can hard engage through her poke.",
  ],
    goodTradeConditions: [
      "The wave is pushing.",
      "Mantra (Q) can hit champion and minions.",
      "ADC can trade during (E).",
  ],
    primaryPattern: "Push with Mantra (Q), shield the ADC's forward trade, and use (W) only when the enemy cannot break tether safely.",
  },
  punishWindows: [
    "Engage after Mantra is spent.",
    "Force her to shield poke before all-in.",
    "Punish overpush with jungle pressure.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
