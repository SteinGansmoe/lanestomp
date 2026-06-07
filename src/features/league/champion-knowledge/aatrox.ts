import type { LeagueChampionKnowledgeProfile } from "./types";

export const aatroxCombatProfile = {
  profileQuality: "draft",
  abilities: {
    Q: "The Darkin Blade",
    W: "Infernal Chains",
    E: "Umbral Dash",
    R: "World Ender",
  },
  archetype: ["juggernaut", "drain tank", "lane bully", "teamfight"],
  primaryWinCondition: [
    "Control spacing with repeated (Q) sweet spots, sustain through extended fights, and turn level 6 or item spikes into side-lane pressure.",
  ],
  dangerAbilities: ["(Q) sweet spots", "(W) pull", "(R) reset and healing amp"],
  dangerProfile: {
    dangerousWhen: [
      "(Q) sweet spots can be chained while (E) repositions him.",
      "(W) lands and forces the enemy to walk through the second hit or follow-up (Q).",
      "(R) is active and his healing turns close fights into resets.",
    ],
    mustRespect: [
      "His threat range changes with (E) plus each (Q) cast.",
      "Anti-sustain or burst timing matters more after (R).",
      "He is strongest when the wave lets him threaten sweet spots without overextending.",
    ],
  },
  commonWeaknesses: [
    "Skillshot reliant and punishable after (Q) casts are spent.",
    "Can be kited or disengaged if (E) and (W) miss.",
    "Healing reduction and burst windows matter when (R) is unavailable.",
  ],
  damageType: "physical",
  hardCrowdControl: ["(Q) knockups"],
  id: "Aatrox",
  importantAbilityNotes: [
    "(Q) has three casts with sweet spots that knock up.",
    "(E) repositions during trades and gives access to better (Q) angles.",
    "(W) punishes targets that cannot exit the chain zone.",
    "(R) increases threat, healing, and chase/reset power.",
  ],
  lanePlan: {
    avoids: [
      "Throwing all (Q) casts into champions who can disengage cleanly.",
      "Fighting short trades after missing (Q1) or (W).",
      "Letting the wave sit where ranged champions can poke without entering (Q) range.",
    ],
    idealLaneState:
      "A controlled top wave near the middle or his side where Aatrox can threaten (Q) sweet spots, hold (E) for angle correction, and sustain through return damage.",
    wants: [
      "Enemies forced to last-hit inside (Q) threat.",
      "Long enough trades for multiple (Q) casts and sustain to matter.",
      "Level 6 fights where (R) lets him chase or reset.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "high",
    preferredGameState: [
      "Measured top-lane spacing around (Q) cooldowns.",
      "Extended skirmishes where sustain and resets matter.",
      "Side-lane pressure that pulls enemies into his spell ranges.",
    ],
    scalingPriority: "medium",
    winLaneBy: [
      "Landing repeated (Q) sweet spots.",
      "Punishing enemies who cannot exit (W).",
      "Using (R) windows to convert close trades into kills or forced recalls.",
    ],
  },
  majorPowerSpikes: ["Level 4-5 with repeated (Q) trades.", "Level 6 (R).", "First fighter item."],
  matchupPreferences: {
    strongInto: [
      "Melee champions who must walk into (Q) sweet spots.",
      "Low mobility targets that struggle to exit (W).",
      "Matchups where sustain outlasts poke or short burst.",
    ],
    weakInto: [
      "High mobility champions that dodge key (Q) casts.",
      "Disengage or poke that denies extended fights.",
      "Champions that punish him hard after (Q) and (E) are down.",
    ],
  },
  mobilityLevel: "medium",
  name: "Aatrox",
  offMetaRoles: ["jungle"],
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "(R) unlocks chase, healing amplification, and reset threat",
        changesGameplay:
          "Close extended fights become much harder to judge because his sustain and movement spike.",
        playerAction:
          "Use (R) only when there is space to keep fighting or force a decisive all-in.",
        enemyResponse: "Disengage the first (R) window or burst him before healing can take over.",
      },
      {
        timing: "First fighter item",
        reason: "Damage, haste, and durability make repeated (Q) trades more reliable",
        changesGameplay:
          "Neutral trades can become winning trades if Aatrox lands two or more sweet spots.",
        playerAction:
          "Pressure the wave and threaten longer trades while tracking enemy disengage.",
        enemyResponse: "Punish missed (Q) casts and avoid giving him sustained combat time.",
      },
    ],
  },
  primaryRoles: ["top"],
  primaryTradingPattern:
    "Trade around (Q) sweet spots, use (E) to correct spacing, and extend only when (W), wave state, or (R) prevents clean disengage.",
  punishProfile: {
    canPunish: [
      "Melee last-hits inside (Q1) or (Q2) range.",
      "Targets trapped by (W).",
      "Enemies who commit while (R) and sustain are available.",
    ],
    strugglesToPunish: [
      "Champions who dodge sideways and force missed (Q) casts.",
      "Targets that disengage after his first spell rotation.",
    ],
  },
  secondaryRoles: [],
  shields: [],
  softCrowdControl: ["(W) slow and pull threat"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "snowball",
    preferredGameLength: "medium",
    scalingProfile: "mid",
    winMethod: ["lane pressure", "drain-tank skirmishes", "side-lane threat"],
  },
  sustain: ["Passive healing", "(E) omnivamp", "(R) healing amplification"],
  trading: {
    badTradeConditions: [
      "(Q) casts are missed or on cooldown.",
      "(E) is unavailable to adjust sweet spot spacing.",
      "The enemy can disengage before his second or third (Q).",
    ],
    goodTradeConditions: [
      "The enemy must walk forward for a minion.",
      "(W) lands or blocks the enemy's retreat path.",
      "(R) is available for an extended fight.",
    ],
    primaryPattern:
      "Fish for (Q1), use (E) to secure a sweet spot or retreat, then extend through (W) and later (Q) casts only when the enemy cannot leave freely.",
  },
  punishWindows: [
    "After Aatrox misses (Q1), his lane threat drops until the next rotation.",
    "When (E) is down, he has fewer ways to force sweet spots or escape.",
    "Before level 6, he has less chase and reset power.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
