import type { LeagueChampionKnowledgeProfile } from "./types";

export const mordekaiserCombatProfile = {
  profileQuality: "draft",
  abilities: {
    Q: "Obliterate",
    W: "Indestructible",
    E: "Death's Grasp",
    R: "Realm of Death",
  },
  archetype: ["ap juggernaut", "isolation", "sustained damage", "teamfight"],
  primaryWinCondition: [
    "Use wave and pull pressure to force extended AP trades, then isolate priority targets with (R) once all-in math is favorable.",
  ],
  dangerAbilities: ["(E) pull", "(Q) isolated hit", "(R) isolation"],
  dangerProfile: {
    dangerousWhen: [
      "(E) lands and sets up (Q) plus passive damage.",
      "His passive is active and the enemy cannot exit the zone.",
      "(R) removes outside help and creates a forced duel.",
    ],
    mustRespect: [
      "Isolated (Q) damage changes short trade math.",
      "(W) can turn stored damage into a shield or heal.",
      "(R) is a major danger if he already has health or item advantage.",
    ],
  },
  commonWeaknesses: [
    "Low mobility and skillshot reliant.",
    "Punishable when (E) misses.",
    "Can be kited before passive sticks.",
  ],
  damageType: "magic",
  hardCrowdControl: ["(E) pull"],
  id: "Mordekaiser",
  importantAbilityNotes: [
    "(Q) hits harder on isolated targets.",
    "(E) pulls enemies into his trade pattern.",
    "(W) stores damage taken/dealt as shield value.",
    "(R) isolates one target in a duel.",
  ],
  lanePlan: {
    avoids: [
      "Missing (E) and walking forward with no way to start the fight.",
      "Taking repeated short poke before passive can stick.",
      "Using (R) when the target can kite the realm duration.",
    ],
    idealLaneState:
      "A slow top wave where Mordekaiser can threaten (E), land isolated (Q), and force the opponent to fight inside passive range.",
    wants: [
      "Enemies with limited mobility after (E).",
      "Extended trades where passive damage keeps ticking.",
      "Level 6 isolation against targets who cannot kite him.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Slow extended melee trades.",
      "Side lane duels where (R) removes help.",
      "Objective fights where he can isolate a key target.",
    ],
    scalingPriority: "medium",
    winLaneBy: [
      "Landing (E) into isolated (Q).",
      "Keeping passive active through extended trades.",
      "Using (R) to remove escape or jungle assistance.",
    ],
  },
  majorPowerSpikes: ["Level 6 (R).", "First AP bruiser item.", "Mid-game dueling items."],
  matchupPreferences: {
    strongInto: [
      "Immobile melee champions.",
      "Tanks who must fight inside passive range.",
      "Targets reliant on team help that (R) can remove.",
    ],
    weakInto: [
      "High mobility kite champions.",
      "Ranged poke that avoids (E).",
      "Champions that can survive or stall the realm.",
    ],
  },
  mobilityLevel: "none",
  name: "Mordekaiser",
  offMetaRoles: ["jungle"],
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "(R) forces an isolated duel",
        changesGameplay:
          "The lane becomes much more dangerous for targets that cannot kite or survive him alone.",
        playerAction:
          "Use (R) after landing or threatening (E), not as a blind opener into easy disengage.",
        enemyResponse: "Save mobility and defensive cooldowns for the realm window.",
      },
      {
        timing: "First AP bruiser item",
        reason: "Sustained damage and durability improve together",
        changesGameplay: "Mordekaiser can keep passive active longer and win slower duels.",
        playerAction: "Force longer trades only when (E) or wave state keeps the enemy nearby.",
        enemyResponse: "Keep trades short and punish missed pull windows.",
      },
    ],
  },
  primaryRoles: ["top"],
  primaryTradingPattern:
    "Threaten (E), land isolated (Q), and extend only when passive is active or (R) can force the enemy to stay.",
  punishProfile: {
    canPunish: [
      "Immobile targets hit by (E).",
      "Enemies who stand isolated for (Q).",
      "Targets who cannot kite (R).",
    ],
    strugglesToPunish: [
      "Mobile champions that sidestep (E).",
      "Ranged champions that never enter pull range.",
    ],
  },
  secondaryRoles: [],
  shields: ["(W) shield"],
  softCrowdControl: [],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "control",
    preferredGameLength: "medium",
    scalingProfile: "mid",
    winMethod: ["extended AP duels", "isolation", "frontline teamfight threat"],
  },
  sustain: ["(W) can convert shield into healing"],
  trading: {
    badTradeConditions: [
      "(E) misses.",
      "The target can kite outside passive range.",
      "(W) has no stored shield value.",
    ],
    goodTradeConditions: [
      "(E) pulls the enemy in.",
      "(Q) can hit an isolated target.",
      "(R) can force a duel the enemy cannot escape.",
    ],
    primaryPattern:
      "Use (E) to pull or zone, hit isolated (Q), then keep fighting while passive and (W) make the extended trade favorable.",
  },
  punishWindows: [
    "After Mordekaiser misses (E), his engage threat is much lower.",
    "Before level 6, he cannot force isolation.",
    "If passive is not active, his extended trade damage is lower.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
