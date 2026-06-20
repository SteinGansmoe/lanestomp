import type { LeagueChampionKnowledgeProfile } from "./types";

export const varusCombatProfile = {
  profileQuality: "reviewed",
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
  importantAbilityNotes: [
    "(Q) poke is strongest when he has time and space to charge outside engage range.",
    "(W) blight stacks reward weaving autos before detonating with (Q) or (E), changing short trades into burst windows.",
    "(E) slows, applies grievous wounds, and can punish ADCs locked into CS or sustain-based trades.",
    "(R) is both pick setup and self-peel, so missing it opens a major engage window.",
  ],
  lanePlan: {
    avoids: [
      "Charging (Q) in range of hard engage.",
      "Fighting without (R) when enemy all-in is stronger.",
      "Letting mobile ADCs force through poke before it lands.",
      "Charging (Q) while his support is too far back to stop engage.",
    ],
    idealLaneState:
      "A controlled bot lane where Varus uses wave access and poke to threaten CS, then holds (R) for support follow-up or disengage.",
    wants: [
      "Support can protect his poke setup or follow (R).",
      "Wave control before dragon setup.",
      "Enemy ADC forced to choose between CS and taking poke.",
      "Thin or controlled waves where charged (Q) can threaten the enemy ADC instead of only minions.",
      "Support positioning that lets him auto for blight stacks before detonating safely.",
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
      "Punishing last-hit commitments with charged (Q) or (E) slow.",
      "Stacking blight in short trades, then detonating when the enemy cannot extend.",
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
  counters: [
    {
      champion: "Kaisa",
      reasons: [
        "Varus can poke Kaisa before she reaches evolved all-in thresholds.",
        "(R) can stop Kaisa when she tries to commit with ultimate follow-up.",
        "Lane control from Varus can delay Kaisa's first item and evolution timing.",
      ],
    },
  ],
  counteredBy: [
    {
      champion: "Samira",
      reasons: [
        "Samira can block Varus poke or ultimate setup with (W) when timed well.",
        "Varus has no dash, so Samira can punish him once support CC creates an entry.",
        "If Varus misses (R), Samira has a large window to force the all-in.",
      ],
    },
  ],
  mobilityLevel: "none",
  name: "Varus",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "(R) adds pick threat and self-peel",
        changesGameplay: "Varus can punish immobile ADCs or stop engage before it reaches him.",
        playerAction: "Hold (R) for a real catch or the enemy's committed engage.",
        enemyResponse: "Bait (R) before forcing all-ins into his lane.",
      },
      {
        timing: "First completed damage item",
        reason: "Poke or on-hit pattern becomes more threatening",
        changesGameplay:
          "His lane pressure starts converting into objective control more reliably.",
        playerAction: "Use item timing to pressure waves before dragon or turret setup.",
        enemyResponse: "Force engage before repeated poke creates a health deficit.",
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
      "ADC players locked into cannon or ranged-minion CS while he charges (Q).",
      "Sustain lanes standing inside (E) while trying to recover from poke.",
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
  supportSynergy: {
    excellentWith: ["Karma", "Lux", "Nautilus"],
    goodWith: ["Morgana", "Thresh", "Milio"],
    strugglesWith: ["Yuumi", "Sona", "supports with no pressure or setup"],
    notes: [
      "Karma and Lux maximize Varus poke lanes by forcing enemies to dodge through charged arrows.",
      "Nautilus gives on-hit and pick Varus reliable engage that chains into Varus (R).",
      "Morgana and Thresh create CC windows for guaranteed Piercing Arrow follow-up.",
      "Supports without lane pressure or setup make Varus easier to outscale or engage on.",
    ],
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
      "The enemy ADC is slowed by (E) or rooted by support setup before charged (Q).",
      "He has already applied blight stacks and can detonate them without entering all-in range.",
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
