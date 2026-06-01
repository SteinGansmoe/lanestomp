import type { LeagueChampionKnowledgeProfile } from "./types";

export const ekkoCombatProfile = {
    profileQuality: "draft",
    abilities: {
      Q: "Timewinder",
      W: "Parallel Convergence",
      E: "Phase Dive",
      R: "Chronobreak",
    },
    archetype: ["assassin", "skirmisher", "scaling", "burst"],
    primaryWinCondition: ["Short trades with Q and E, a well-times W stun can turn a fight in his favor, and R can be used to dodge key damage or reset fights."],
    dangerAbilities: ["W Parallel Convergence stun", "E Phase Dive", "R Chronobreak"],
    dangerProfile: {
      dangerousWhen: ["W Parallel Convergence stun", "E Phase Dive", "R Chronobreak"],
      mustRespect: [
            "Parallel Convergence is delayed and requires setup.",
            "Chronobreak is his level 6 safety and burst reset.",
            "Phase Dive is his main trading mobility.",
          ],
    },
    commonWeaknesses: [
      "Alot of CC champions will interrupt his setup.",
      "Can be pressured before level 6.",
      "Needs items to shine.",
    ],
    damageType: "magic",
    hardCrowdControl: ["W Parallel Convergence stun"],
    id: "Ekko",
    importantAbilityNotes: [
      "Parallel Convergence is delayed and requires setup.",
      "Chronobreak is his level 6 safety and burst reset.",
      "Phase Dive is his main trading mobility.",
    ],
    lanePlan: {
      avoids: [
            "Alot of CC champions will interrupt his setup.",
            "Can be pressured before level 6.",
            "Needs items to shine.",
          ],
      idealLaneState: "Scaling AP assassin who wants short trades, wave access, and explosive all-ins after setup.",
      wants: ["Short trades with Q and E, a well-times W stun can turn a fight in his favor, and R can be used to dodge key damage or reset fights."],
    },
    laneIdentity:
      {
      earlyGameAgency: "low",
      scalingPriority: "high",
      lanePressure: "low",
      preferredGameState: ["Short trades with Q and E, a well-times W stun can turn a fight in his favor, and R can be used to dodge key damage or reset fights."],
      winLaneBy: ["Short trades with Q and E, a well-times W stun can turn a fight in his favor, and R can be used to dodge key damage or reset fights."],
    },
    majorPowerSpikes: [
      "Level 3 unlocks Ekko's Q-W-E trade pattern with dash access and stun threat.",
      "Level 6 Chronobreak.",
      "First completed AP burst item.",
    ],
    matchupPreferences: {
      strongInto: [],
      weakInto: [],
    },
    mobilityLevel: "high",
    name: "Ekko",
    offMetaRoles: [],
    powerSpikes: {
      major: [
        {
          timing: "Level 3",
          reason: "Level 3 unlocks Ekko's Q-W-E trade pattern with dash access and stun threat",
          changesGameplay: "The early ability combination gives Ekko a real trade or all-in pattern instead of isolated lane pressure.",
          playerAction: "Use the unlocked combo only when cooldowns, minions, and spacing make the trade hard to punish.",
          enemyResponse: "Respect the early combo unlock and avoid giving Ekko the wave or spacing needed to start it cleanly.",
        },
        {
          timing: "Level 6",
          reason: "Level 6 Chronobreak",
          changesGameplay: "Ekko's ultimate becomes available, so the matchup shifts around whether the commit, pick, roam, or escape threat is ready.",
          playerAction: "Track R availability and use the window for verified all-ins, picks, roams, or defensive resets rather than forcing blind.",
          enemyResponse: "Respect Ekko's R window, hold key defensive tools for the commit, and punish after R is spent.",
        },
        {
          timing: "First completed AP burst item",
          reason: "First completed AP burst item",
          changesGameplay: "Ekko's damage, wave control, or trade reliability improves enough that earlier neutral trades can become losing trades.",
          playerAction: "After the item, pressure waves and trades more confidently while still tracking the enemy's main answer.",
          enemyResponse: "Do not treat pre-item trades as still safe once Ekko's first item threshold is completed.",
        },
      ],
    },
    primaryRoles: ["jungle"],
    secondaryRoles: ["mid"],
    primaryTradingPattern:
      "Use Timewinder and Phase Dive for quick burst, then disengage after proccing passive for movement speed to back off.",
    punishProfile: {
      canPunish: [],
      strugglesToPunish: [
            "Alot of CC champions will interrupt his setup.",
            "Can be pressured before level 6.",
            "Needs items to shine.",
          ],
    },
    shields: ["W Parallel Convergence shield if Ekko enters the zone"],
    softCrowdControl: ["Q Timewinder slow"],
    stealthOrInvisibility: null,
    sustain: ["R Chronobreak heal on cast."],
    trading: {
      badTradeConditions: [
        "W takes a while to activate, and if it misses he will take return damage in trades.",
        "If Ekko engages with E but misses with Q, he will often lose out in trades.",
        "Before level 6 Ekko is much easier to kill"
      ],
      goodTradeConditions: [],
      primaryPattern: "Use Timewinder and Phase Dive for quick burst, then disengage after proccing passive for movement speed to back off.",
    },
    punishWindows: [
  "W takes a while to activate, and if it misses he will take return damage in trades.",
  "If Ekko engages with E but misses with Q, he will often lose out in trades.",
  "Before level 6 Ekko is much easier to kill"
]
  } satisfies LeagueChampionKnowledgeProfile;
