import type { LeagueChampionKnowledgeProfile } from "./types";

export const renataCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: { Q: "Handshake", W: "Bailout", E: "Loyalty Program", R: "Hostile Takeover" },
  archetype: ["support", "enchanter", "counter-engage", "peel"],
  primaryWinCondition: [
    "Protect carries with Bailout, punish enemy engage with (Q) and (R), and turn extended fights after the enemy commits.",
  ],
  dangerAbilities: ["(W) Bailout", "(Q) disengage", "(R) Hostile Takeover"],
  dangerProfile: {
    dangerousWhen: [
      "Her ADC can keep fighting through Bailout.",
      "Enemy team commits into a narrow path.",
      "She holds (Q) for divers.",
    ],
    mustRespect: [
      "Bailout changes kill thresholds.",
      "(R) is strongest into grouped auto attackers.",
      "Renata punishes overcommit more than she starts fights.",
    ],
  },
  commonWeaknesses: [
    "Low proactive engage range.",
    "Skillshot dependent peel.",
    "Can be poked before fights start.",
  ],
  damageType: "magic",
  hardCrowdControl: ["(Q) root/displacement"],
  id: "Renata",
  importantAbilityNotes: [
    "Bailout changes kill thresholds.",
    "(R) is strongest into grouped auto attackers.",
    "Renata punishes overcommit more than she starts fights.",
  ],
  lanePlan: {
    avoids: [
      "Using (W) too early.",
      "Standing in poke range.",
      "Starting fights without a clear target.",
    ],
    idealLaneState:
      "A controlled lane where Renata shields trades, saves (W) for lethal moments, and punishes engages with displacement.",
    wants: ["Extended ADC trades.", "Enemy dive into her backline.", "Choke fights for (R)."],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Counter-engage lanes.",
      "Extended skirmishes.",
      "Teamfights against dive or auto attackers.",
    ],
    scalingPriority: "high",
    winLaneBy: [
      "Timing Bailout.",
      "Stopping divers with (Q).",
      "Casting (R) through grouped enemies.",
    ],
  },
  majorPowerSpikes: [
    "Level 2 shield and trade tools.",
    "Level 3 Bailout changes all-ins.",
    "Level 6 Hostile Takeover.",
  ],
  matchupPreferences: {
    strongInto: ["Dive lanes.", "Auto-attack carries.", "ADCs that love extended fights."],
    weakInto: [
      "Long-range poke.",
      "Pick lanes that kill before Bailout value.",
      "Low-DPS ADC pairings.",
    ],
  },
  mobilityLevel: "low",
  name: "Renata",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 2",
        reason: "Level 2 shield and trade tools.",
        changesGameplay:
          "The first real bot-lane interaction changes once this support can pair two early abilities.",
        playerAction:
          "Track the level 2 race and only contest the wave if the ADC can follow the support's threat.",
        enemyResponse:
          "Respect the level 2 timer and back up before the support reaches the wave first.",
      },
      {
        timing: "Level 3",
        reason: "Level 3 Bailout changes all-ins.",
        changesGameplay:
          "The full basic kit unlocks the support's main trade, peel, or poke pattern.",
        playerAction:
          "Use the complete kit around brush control, ADC follow-up, and the enemy support's key cooldown.",
        enemyResponse:
          "Punish the support after their main cooldown is spent or when the wave blocks their angle.",
      },
      {
        timing: "Level 6",
        reason: "Level 6 Hostile Takeover.",
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
    "Shield and slow with (E), hold (Q) for the commit, and use Bailout only when the ADC can actually reset or finish the fight.",
  punishProfile: {
    canPunish: [
      "Divers after dash commits.",
      "All-ins where Bailout buys a reset.",
      "Grouped enemies in river.",
    ],
    strugglesToPunish: [
      "Poke before engage.",
      "Burst that kills after Bailout expires.",
      "Lanes that never extend trades.",
    ],
  },
  shields: ["(E) shield"],
  softCrowdControl: ["(E) slow", "(R) berserk"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "survive",
    preferredGameLength: "long",
    scalingProfile: "late",
    winMethod: [
      "Timing Bailout.",
      "Stopping divers with (Q).",
      "Casting (R) through grouped enemies.",
    ],
  },
  supportSynergy: {
    excellentWith: ["Kalista", "Draven", "KogMaw"],
    goodWith: ["Jinx", "Aphelios", "Twitch"],
    strugglesWith: ["Ezreal", "Ziggs", "Smolder"],
    notes: [
      "Kalista, Draven, KogMaw convert Renata's strongest lane pattern especially well.",
      "Jinx, Aphelios, Twitch fit Renata when the lane can play around the same tempo window.",
      "Ezreal, Ziggs, Smolder can struggle with Renata when they need a different lane pace or protection pattern.",
    ],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "(W) is wasted.",
      "(Q) misses.",
      "The ADC cannot deal damage during Bailout.",
    ],
    goodTradeConditions: [
      "Enemy commits into her.",
      "ADC can free-hit during (W).",
      "(R) has a narrow path.",
    ],
    primaryPattern:
      "Shield and slow with (E), hold (Q) for the commit, and use Bailout only when the ADC can actually reset or finish the fight.",
  },
  punishWindows: [
    "Bait Bailout then disengage.",
    "Poke outside her range.",
    "Avoid grouping for (R).",
  ],
} satisfies LeagueChampionKnowledgeProfile;
