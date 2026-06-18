import type { LeagueChampionKnowledgeProfile } from "./types";

export const luluCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: { Q: "Glitterlance", W: "Whimsy", E: "Help, Pix!", R: "Wild Growth" },
  archetype: ["support", "enchanter", "peel", "hypercarry amplifier"],
  primaryWinCondition: [
    "Protect and accelerate a scaling ADC with shields, polymorph, and Wild Growth while punishing divers who overcommit.",
  ],
  dangerAbilities: ["(W) polymorph", "(E) shield", "(R) Wild Growth"],
  dangerProfile: {
    dangerousWhen: [
      "Polymorph is available against engage.",
      "Her ADC can trade while shielded.",
      "Level 6 turns dives into counter-engage.",
    ],
    mustRespect: [
      "Polymorph denies assassins and divers.",
      "Shield plus Pix damage changes short trades.",
      "Wild Growth can both save and knock up.",
    ],
  },
  commonWeaknesses: [
    "Low hard engage threat.",
    "Can be outranged by poke lanes.",
    "Vulnerable if polymorph is used for haste at the wrong time.",
  ],
  damageType: "magic",
  hardCrowdControl: ["(W) polymorph", "(R) knockup"],
  id: "Lulu",
  importantAbilityNotes: [
    "Polymorph denies assassins and divers.",
    "Shield plus Pix damage changes short trades.",
    "Wild Growth can both save and knock up.",
  ],
  lanePlan: {
    avoids: [
      "Spending (W) before enemy engage.",
      "Long poke wars she cannot answer.",
      "Leaving her ADC outside shield range.",
    ],
    idealLaneState:
      "A protected scaling lane where Lulu shields ADC trades, holds polymorph for the enemy commit, and avoids unnecessary all-ins.",
    wants: [
      "ADC who scales with attack speed.",
      "Short shielded trades.",
      "Enemies forced to dive into polymorph.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Protected hypercarry lanes.",
      "Anti-dive fights.",
      "Front-to-back teamfights.",
    ],
    scalingPriority: "high",
    winLaneBy: ["Shielding key trades.", "Polymorphing engage.", "Scaling into carry protection."],
  },
  majorPowerSpikes: [
    "Level 2 shield and polymorph trade.",
    "Level 3 adds slow/poke control.",
    "Level 6 Wild Growth counter-engage.",
  ],
  matchupPreferences: {
    strongInto: ["Dive comps.", "Short-range all-in lanes.", "Games centered on one carry."],
    weakInto: [
      "Long-range poke lanes.",
      "Hard engage after (W) is wasted.",
      "Roam supports that outnumber the map.",
    ],
  },
  mobilityLevel: "low",
  name: "Lulu",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 2",
        reason: "Level 2 shield and polymorph trade.",
        changesGameplay:
          "The first real bot-lane interaction changes once this support can pair two early abilities.",
        playerAction:
          "Track the level 2 race and only contest the wave if the ADC can follow the support's threat.",
        enemyResponse:
          "Respect the level 2 timer and back up before the support reaches the wave first.",
      },
      {
        timing: "Level 3",
        reason: "Level 3 adds slow/poke control.",
        changesGameplay:
          "The full basic kit unlocks the support's main trade, peel, or poke pattern.",
        playerAction:
          "Use the complete kit around brush control, ADC follow-up, and the enemy support's key cooldown.",
        enemyResponse:
          "Punish the support after their main cooldown is spent or when the wave blocks their angle.",
      },
      {
        timing: "Level 6",
        reason: "Level 6 Wild Growth counter-engage.",
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
    "Shield the ADC's trade, hold polymorph for the enemy's main commit, and turn dives with (R).",
  punishProfile: {
    canPunish: [
      "Divers entering her ADC.",
      "Short trades where shield blocks damage.",
      "Enemies without range to punish her backline position.",
    ],
    strugglesToPunish: [
      "Artillery poke.",
      "Roams away from her ADC.",
      "Lanes that can bait polymorph then re-engage.",
    ],
  },
  shields: ["(E) shield"],
  softCrowdControl: ["(Q) slow"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "survive",
    preferredGameLength: "long",
    scalingProfile: "late",
    winMethod: ["Shielding key trades.", "Polymorphing engage.", "Scaling into carry protection."],
  },
  supportSynergy: {
    excellentWith: ["KogMaw", "Jinx", "Zeri"],
    goodWith: ["Vayne", "Aphelios", "Twitch"],
    strugglesWith: ["Draven", "Samira", "Caitlyn"],
    notes: [
      "KogMaw, Jinx, Zeri convert Lulu's strongest lane pattern especially well.",
      "Vayne, Aphelios, Twitch fit Lulu when the lane can play around the same tempo window.",
      "Draven, Samira, Caitlyn can struggle with Lulu when they need a different lane pace or protection pattern.",
    ],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "(W) is down.",
      "(E) cannot reach the ADC.",
      "The enemy can poke without committing.",
    ],
    goodTradeConditions: [
      "ADC is ready to trade under shield.",
      "Enemy engage has one predictable entry.",
      "Level 6 counter-engage is available.",
    ],
    primaryPattern:
      "Shield the ADC's trade, hold polymorph for the enemy's main commit, and turn dives with (R).",
  },
  punishWindows: [
    "Bait polymorph before engaging.",
    "Poke outside her shield range.",
    "Roam before her scaling lane can move.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
