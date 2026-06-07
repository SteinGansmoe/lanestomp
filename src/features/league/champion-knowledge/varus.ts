import type { LeagueChampionKnowledgeProfile } from "./types";

export const varusCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: {
    Q: "Piercing Arrow",
    W: "Blighted Quiver",
    E: "Hail of Arrows",
    R: "Chain of Corruption",
  },
  archetype: ["marksman", "poke", "pick setup", "on-hit DPS"],
  primaryWinCondition: [
    "Use poke, wave control, and (R) pick threat to control bot priority and objective setups before enemies can hard engage.",
  ],
  dangerAbilities: ["(Q) poke", "(R) root", "(E) grievous zone"],
  dangerProfile: {
    dangerousWhen: [
      "He can charge (Q) safely before dragon or turret fights.",
      "(R) is available and support or team follow-up can convert the catch.",
      "On-hit builds let him punish longer front-to-back fights.",
    ],
    mustRespect: [
      "His poke can force low-health objective setups.",
      "(R) creates pick threat against immobile ADCs.",
      "His build path can shift between poke and sustained DPS.",
    ],
  },
  commonWeaknesses: [
    "No dash against hard engage.",
    "Poke patterns need space and setup time.",
    "Can be punished if (R) misses or is unavailable.",
  ],
  damageType: "mixed",
  hardCrowdControl: ["(R) root"],
  id: "Varus",
  lanePlan: {
    avoids: [
      "Charging (Q) in range of hard engage.",
      "Fighting without (R) when enemy all-in is stronger.",
      "Letting mobile ADCs force through poke before it lands.",
    ],
    idealLaneState:
      "A controlled bot lane where Varus uses wave access and poke to threaten CS, then holds (R) for support follow-up or disengage.",
    wants: [
      "Support can protect his poke setup or follow (R).",
      "Wave control before dragon setup.",
      "Enemy ADC forced to choose between CS and taking poke.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    lanePressure: "high",
    preferredGameState: [
      "Bot priority before objectives.",
      "Poke setups where enemies approach through vision.",
      "Pick windows with (R) and support follow-up.",
    ],
    scalingPriority: "medium",
    winLaneBy: [
      "Landing poke before trades start.",
      "Using (R) to punish immobile targets.",
      "Converting lane push into dragon control.",
    ],
  },
  majorPowerSpikes: ["Level 6 (R).", "First completed damage item.", "Objective poke setup."],
  matchupPreferences: {
    strongInto: [
      "Immobile ADCs vulnerable to poke and (R).",
      "Lanes that cannot engage before he charges (Q).",
      "Objective setups where poke lands first.",
    ],
    weakInto: [
      "Hard engage that reaches him through poke.",
      "Mobile ADCs that dodge (Q) and (R).",
      "Sustain lanes that absorb poke without losing priority.",
    ],
  },
  mobilityLevel: "none",
  name: "Varus",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "(R) adds pick threat and self-peel",
        changesGameplay:
          "Varus can punish immobile ADCs or stop engage before it reaches him.",
        playerAction:
          "Hold (R) for a real catch or the enemy's committed engage.",
        enemyResponse:
          "Bait (R) before forcing all-ins into his lane.",
      },
      {
        timing: "First completed damage item",
        reason: "Poke or on-hit pattern becomes more threatening",
        changesGameplay:
          "His lane pressure starts converting into objective control more reliably.",
        playerAction:
          "Use item timing to pressure waves before dragon or turret setup.",
        enemyResponse:
          "Force engage before repeated poke creates a health deficit.",
      },
    ],
  },
  primaryRoles: ["adc"],
  secondaryRoles: [],
  primaryTradingPattern:
    "Use wave control to land (Q), hold (R) for catch or peel, and avoid standing still into direct engage.",
  punishProfile: {
    canPunish: [
      "Immobile ADCs in (R) range.",
      "Enemies walking through predictable objective entrances.",
      "Bot lanes that cannot engage before poke lands.",
    ],
    strugglesToPunish: [
      "Hard engage after (R) is down.",
      "Sustain or shield lanes that erase poke.",
    ],
  },
  shields: [],
  softCrowdControl: ["(E) slow"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "control",
    preferredGameLength: "medium",
    scalingProfile: "mid",
    winMethod: ["poke pressure", "pick setup", "objective control"],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "He charges (Q) while enemy engage is in range.",
      "(R) is down against hard all-in threat.",
      "The enemy lane can sustain through poke and force longer fights.",
    ],
    goodTradeConditions: [
      "The wave gives clear (Q) angles.",
      "Support can follow (R).",
      "Enemies must walk into poke before dragon setup.",
    ],
    primaryPattern:
      "Win through poke and pick threat before fights start; avoid raw all-ins when engage is still available.",
  },
  punishWindows: [
    "After (R), he has fewer answers to engage.",
    "No dash makes him vulnerable if poke spacing breaks.",
    "If (Q) misses repeatedly, his lane pressure falls off.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
