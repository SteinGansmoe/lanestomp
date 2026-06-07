import type { LeagueChampionKnowledgeProfile } from "./types";

export const rumbleCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "high",
  abilities: { Q: "Flamespitter", W: "Scrap Shield", E: "Electro Harpoon", R: "The Equalizer" },
  archetype: ["AP lane bully", "heat management", "teamfight zone", "early skirmisher"],
  primaryWinCondition: [
    "Manage Heat to win short-range trades with empowered abilities, then use (R) to control chokes, dives, and objective fights.",
  ],
  dangerAbilities: ["Overheated (Q)", "(E) slow", "(R) zone damage"],
  dangerProfile: {
    dangerousWhen: [
      "Heat is in danger zone for empowered spells.",
      "(E) lands and lets (Q) stay in range.",
      "(R) cuts off escape or traps enemies in a choke.",
    ],
    mustRespect: [
      "Heat management defines his trade quality.",
      "His early lane damage is high.",
      "(R) can win fights even if he is not the direct target.",
    ],
  },
  commonWeaknesses: [
    "No hard crowd control.",
    "Short range.",
    "Can overheat at bad timings and lose spell access.",
  ],
  damageType: "magic",
  hardCrowdControl: [],
  id: "Rumble",
  importantAbilityNotes: [
    "Danger zone empowers basic abilities.",
    "Overheating locks spells but empowers autos.",
    "(E) has two charges and slows.",
    "(R) is a long area damage and slow zone.",
  ],
  lanePlan: {
    avoids: [
      "Overheating before the trade starts.",
      "Fighting outside (Q) range.",
      "Using (R) with no path to keep enemies inside it.",
    ],
    idealLaneState:
      "A pressured top lane where Rumble controls short-range space with danger-zone (Q) and threatens all-ins after (E) slow.",
    wants: ["Danger-zone trades.", "Enemies stuck in (Q) range.", "Objective corridors for (R)."],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    lanePressure: "high",
    preferredGameState: [
      "Short-range lane bullying.",
      "River and objective choke fights.",
      "Mid-game teamfights around (R).",
    ],
    scalingPriority: "medium",
    winLaneBy: [
      "Managing Heat better than the enemy tracks it.",
      "Landing (E) to keep targets in (Q).",
      "Using (R) to trap retreats.",
    ],
  },
  majorPowerSpikes: ["Level 3 danger-zone pattern.", "Level 6 (R).", "First AP item."],
  matchupPreferences: {
    strongInto: [
      "Melee champions who must stay in (Q).",
      "Teams forced through chokes.",
      "Lanes without sustain.",
    ],
    weakInto: ["Long-range poke.", "Hard disengage.", "Champions that punish overheat timing."],
  },
  mobilityLevel: "low",
  name: "Rumble",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "(R) unlocks major zone control",
        changesGameplay: "Rumble can win all-ins, dives, and objective fights through area denial.",
        playerAction: "Use (R) to cut escape paths or trap enemies in corridors.",
        enemyResponse: "Spread and leave the zone immediately.",
      },
      {
        timing: "First AP item",
        reason: "Damage makes danger-zone trades and (R) more punishing",
        changesGameplay: "Short trades can become lethal if enemies stay in range.",
        playerAction: "Pressure waves and fight around heat advantage.",
        enemyResponse: "Disengage when heat is favorable for Rumble.",
      },
    ],
  },
  primaryRoles: ["top"],
  primaryTradingPattern:
    "Enter trades with danger-zone Heat, land (E) to keep enemies in (Q), and use (R) to cut escape paths rather than as random poke.",
  punishProfile: {
    canPunish: [
      "Melee champions in (Q) range.",
      "Enemies slowed by (E).",
      "Grouped targets in chokes.",
    ],
    strugglesToPunish: ["Long-range champions.", "Enemies who disengage during overheat."],
  },
  secondaryRoles: [],
  shields: ["(W) shield"],
  softCrowdControl: ["(E) slow", "(R) slow"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "snowball",
    preferredGameLength: "medium",
    scalingProfile: "early",
    winMethod: ["heat-managed trades", "AP lane pressure", "teamfight zone control"],
  },
  sustain: [],
  trading: {
    badTradeConditions: ["Heat is mistimed.", "(E) misses.", "The enemy can outrange (Q)."],
    goodTradeConditions: ["Danger zone is active.", "(E) lands.", "(R) can trap the enemy path."],
    primaryPattern:
      "Control heat first, then force short but high-damage trades before converting level 6 into zone pressure.",
  },
  punishWindows: [
    "After overheat, he cannot cast briefly.",
    "When (E) charges are down, his chase drops.",
    "Without (R), teamfight zone control is lower.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
