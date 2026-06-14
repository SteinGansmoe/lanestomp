import type { LeagueChampionKnowledgeProfile } from "./types";

export const katarinaCombatProfile = {
  profileQuality: "draft",
  abilities: {
    Q: "Bouncing Blade",
    W: "Preparation",
    E: "Shunpo",
    R: "Death Lotus",
  },
  archetype: ["assassin", "reset", "roam", "skirmisher"],
  primaryWinCondition: [
    "Find dagger reset windows in skirmishes and snowball fights through takedown resets.",
  ],
  dangerAbilities: ["(E) mobility", "(R) channel", "Passive Voracity resets"],
  dangerProfile: {
    dangerousWhen: [
      "Daggers are positioned near the enemy or escape paths.",
      "Crowd control has been used and (R) can channel safely.",
      "A takedown reset lets her chain mobility and damage.",
    ],
    mustRespect: [
      "Her daggers define where the burst will happen.",
      "(E) resets around daggers and takedowns.",
      "(R) is dangerous but can be interrupted by crowd control.",
    ],
  },
  commonWeaknesses: [
    "Weak wave control and vulnerable early lane.",
    "Reliant on enemy mistakes, dagger setup, and resets.",
    "Crowd control can stop her ultimate and reset chain.",
  ],
  damageType: "mixed",
  hardCrowdControl: [],
  id: "Katarina",
  importantAbilityNotes: [
    "(Q) creates a dagger landing spot for follow-up.",
    "(W) drops a dagger and gives movement speed.",
    "(E) is targeted mobility and reset-based repositioning.",
    "(R) is a channel that can be interrupted.",
  ],
  lanePlan: {
    avoids: [
      "Forcing trades without dagger setup.",
      "Channeling (R) into available crowd control.",
      "Staying trapped under wave pressure without roam options.",
    ],
    idealLaneState:
      "A volatile lane where Katarina can preserve health, punish cooldowns, and leave for skirmishes when the wave allows.",
    wants: [
      "Enemy cooldowns spent before she jumps in.",
      "Dagger positions that threaten both damage and escape.",
      "River or side skirmishes where resets are possible.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "low",
    lanePressure: "low",
    preferredGameState: [
      "Chaotic skirmishes with low-health targets.",
      "Roam timers after the enemy wave is handled.",
      "Fights where key crowd control is already used.",
    ],
    scalingPriority: "medium",
    winLaneBy: [
      "Surviving early lane without bleeding too much health.",
      "Punishing missed cooldowns with dagger trades.",
      "Turning skirmishes into reset chains.",
    ],
  },
  majorPowerSpikes: [
    "Level 3 unlocks (Q)-(W)-(E) dagger setup with mobility for her first real burst trade.",
    "Level 6 (R).",
    "First completed burst item.",
  ],
  matchupPreferences: {
    strongInto: [
      "Low crowd control teams that cannot interrupt (R).",
      "Squishy champions who misposition near daggers.",
      "Skirmish-heavy games with reset opportunities.",
    ],
    weakInto: [
      "Reliable crowd control held for her engage.",
      "Strong waveclear that pins her in lane.",
      "Champions who can punish her before dagger setup.",
    ],
  },
  counters: [
    {
      champion: "Veigar",
      reasons: [
        "Katarina can punish Veigar after cage is down and snowball skirmishes before he scales.",
      ],
    },
    {
      champion: "Lux",
      reasons: [
        "Katarina can jump past Lux poke and punish her hard if binding is unavailable.",
      ],
    },
    {
      champion: "Xerath",
      reasons: [
        "Katarina can threaten Xerath's low mobility once she gets a dagger or side-angle entry.",
      ],
    },
    {
      champion: "Aurelion Sol",
      reasons: [
        "Katarina can punish Aurelion Sol's channel windows and weak early dueling before he scales.",
      ],
    },
  ],
  counteredBy: [
    {
      champion: "Lissandra",
      reasons: [
        "Lissandra can hold crowd control for Katarina's jump and stop her reset chain.",
      ],
    },
    {
      champion: "Galio",
      reasons: [
        "Galio can interrupt Katarina's ultimate and survive her burst with magic durability.",
      ],
    },
    {
      champion: "Malzahar",
      reasons: [
        "Malzahar can suppress Katarina when she commits and keep lane pushed to deny roams.",
      ],
    },
    {
      champion: "Pantheon",
      reasons: [
        "Pantheon can stun Katarina before she finishes dagger damage or channels ultimate.",
      ],
    },
  ],
  mobilityLevel: "very_high",
  name: "Katarina",
  offMetaRoles: [],
  strategicIdentity: {
    laneGoal: "snowball",
    scalingProfile: "mid",
    preferredGameLength: "short",
    winMethod: ["roam resets", "skirmish cleanup", "snowball fights"],
  },
  powerSpikes: {
    major: [
      {
        timing: "Level 3",
        reason:
          "Level 3 unlocks (Q)-(W)-(E) dagger setup with mobility for her first real burst trade",
        changesGameplay: "Level 6 adds major all-in threat if crowd control is unavailable",
        playerAction:
          "Use the unlocked combo only when cooldowns, minions, and spacing make the trade hard to punish.",
        enemyResponse:
          "Respect the early combo unlock and avoid giving Katarina the wave or spacing needed to start it cleanly.",
      },
      {
        timing: "Level 6",
        reason: "Level 6 (R)",
        changesGameplay:
          "Her strongest spikes often come from skirmish kills and item acceleration",
        playerAction:
          "Track (R) availability and use the window for verified all-ins, picks, roams, or defensive resets rather than forcing blind.",
        enemyResponse:
          "Respect (R) window, hold key defensive tools for the commit, and punish after (R) is spent.",
      },
      {
        timing: "First completed burst item",
        reason: "First completed burst item",
        changesGameplay:
          "Katarina's damage, wave control, or trade reliability improves enough that earlier neutral trades can become losing trades.",
        playerAction:
          "After the item, pressure waves and trades more confidently while still tracking the enemy's main answer.",
        enemyResponse:
          "Do not treat pre-item trades as still safe once Katarina's first item threshold is completed.",
      },
    ],
  },
  primaryRoles: ["mid"],
  secondaryRoles: [],
  primaryTradingPattern:
    "Set daggers with (Q) or (W), wait for enemy cooldowns, then use (E) to take short burst trades or commit only when resets are realistic.",
  punishProfile: {
    canPunish: [
      "Enemies standing near daggers.",
      "Used crowd control or mobility cooldowns.",
      "Low-health targets in river fights.",
    ],
    strugglesToPunish: [
      "Champions who hold crowd control for her jump.",
      "Lanes that shove safely and deny roams.",
    ],
  },
  shields: [],
  softCrowdControl: [],
  stealthOrInvisibility: null,
  sustain: [],
  trading: {
    badTradeConditions: [
      "No dagger is positioned for damage or escape.",
      "Enemy crowd control can interrupt (R).",
      "The wave is too large to jump forward safely.",
    ],
    goodTradeConditions: [
      "The enemy has used crowd control or mobility.",
      "A dagger is positioned behind or beside the target.",
      "A skirmish has low-health targets for resets.",
    ],
    primaryPattern:
      "Trade around dagger placement, use (E) carefully, and commit fully only when crowd control is down or resets are likely.",
  },
  punishWindows: [
    "If Katarina uses (E) forward without a reset path, she is easier to punish.",
    "If (R) is interrupted, her all-in loses much of its threat.",
    "Early wave pressure can deny her roam pattern.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
