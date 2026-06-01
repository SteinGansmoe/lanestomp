import type { LeagueChampionKnowledgeProfile } from "./types";

export const fizzCombatProfile = {
    profileQuality: "draft",
    abilities: {
      Q: "Urchin Strike",
      W: "Seastone Trident",
      E: "Playful / Trickster",
      R: "Chum the Waters",
    },
    archetype: ["assassin", "burst", "skirmisher"],
    primaryWinCondition: ["Short trades until target is in kill range."],
    dangerAbilities: [],
    dangerProfile: {
      dangerousWhen: [],
      mustRespect: [
            "E Playful / Trickster is his main dodge, engage, and escape tool.",
            "R Chum the Waters creates his level 6 kill threat.",
            "He has no reliable hard CC before ultimate.",
          ],
    },
    commonWeaknesses: [
      "If enemy team is very tanky, Fizz might not be able to secure kills.",
      "Have to be very careful before level 3, give up minions to not lose hp.",
      "Is a melee champion.",
    ],
    damageType: "magic",
    hardCrowdControl: ["R Chum the Waters knockup"],
    id: "Fizz",
    importantAbilityNotes: [
      "E Playful / Trickster is his main dodge, engage, and escape tool.",
      "R Chum the Waters creates his level 6 kill threat.",
      "He has no reliable hard CC before ultimate.",
    ],
    lanePlan: {
      avoids: [
            "If enemy team is very tanky, Fizz might not be able to secure kills.",
            "Have to be very careful before level 3, give up minions to not lose hp.",
            "Is a melee champion.",
          ],
      idealLaneState: "Melee AP assassin who survives early pressure and looks for level 6 burst windows.",
      wants: ["Short trades until target is in kill range."],
    },
    laneIdentity:
      {
      earlyGameAgency: "high",
      scalingPriority: "medium",
      lanePressure: "high",
      preferredGameState: ["Short trades until target is in kill range."],
      winLaneBy: ["Short trades until target is in kill range."],
    },
    majorPowerSpikes: [
      "Level 3 unlocks Fizz's first real trade pattern with Q engage, W damage, and E dodge or escape.",
      "Level 6 Chum the Waters.",
      "First completed AP assassin item.",
    ],
    matchupPreferences: {
      strongInto: [],
      weakInto: [],
    },
    mobilityLevel: "high",
    name: "Fizz",
    offMetaRoles: [],
    strategicIdentity: {
      laneGoal: "snowball",
      scalingProfile: "early",
      preferredGameLength: "short",
      winMethod: ["level 6 all-ins", "roam kills", "burst picks"],
    },
    powerSpikes: {
      major: [
        {
          timing: "Level 3",
          reason: "Level 3 unlocks Fizz's first real trade pattern with Q engage, W damage, and E dodge or escape",
          changesGameplay: "The early ability combination gives Fizz a real trade or all-in pattern instead of isolated lane pressure.",
          playerAction: "Use the unlocked combo only when cooldowns, minions, and spacing make the trade hard to punish.",
          enemyResponse: "Respect the early combo unlock and avoid giving Fizz the wave or spacing needed to start it cleanly.",
        },
        {
          timing: "Level 6",
          reason: "Level 6 Chum the Waters",
          changesGameplay: "Fizz's ultimate becomes available, so the matchup shifts around whether the commit, pick, roam, or escape threat is ready.",
          playerAction: "Track R availability and use the window for verified all-ins, picks, roams, or defensive resets rather than forcing blind.",
          enemyResponse: "Respect Fizz's R window, hold key defensive tools for the commit, and punish after R is spent.",
        },
        {
          timing: "First completed AP assassin item",
          reason: "First completed AP assassin item",
          changesGameplay: "Fizz's damage, wave control, or trade reliability improves enough that earlier neutral trades can become losing trades.",
          playerAction: "After the item, pressure waves and trades more confidently while still tracking the enemy's main answer.",
          enemyResponse: "Do not treat pre-item trades as still safe once Fizz's first item threshold is completed.",
        },
      ],
    },
    primaryRoles: ["mid"],
    secondaryRoles: ["jungle"],
    primaryTradingPattern:
      "Dash in for burst, use Playful / Trickster to dodge the key answer, then exit or finish.",
    punishProfile: {
      canPunish: [],
      strugglesToPunish: [
            "If enemy team is very tanky, Fizz might not be able to secure kills.",
            "Have to be very careful before level 3, give up minions to not lose hp.",
            "Is a melee champion.",
          ],
    },
    shields: [],
    softCrowdControl: ["E Playful / Trickster slow"],
    stealthOrInvisibility: null,
    sustain: [],
    trading: {
      badTradeConditions: [
        "If Fizz uses E recklessly, he will struggle.",
        "Before Fizz turns level 3 he is very weak, if he steps up attack him"
      ],
      goodTradeConditions: [],
      primaryPattern: "Dash in for burst, use Playful / Trickster to dodge the key answer, then exit or finish.",
    },
    punishWindows: [
  "If Fizz uses E recklessly, he will struggle.",
  "Before Fizz turns level 3 he is very weak, if he steps up attack him"
]
  } satisfies LeagueChampionKnowledgeProfile;
