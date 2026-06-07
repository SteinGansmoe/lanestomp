import type { LeagueChampionKnowledgeProfile } from "./types";

export const akshanCombatProfile = {
  profileQuality: "draft",
  abilities: {
    Q: "Avengerang",
    W: "Going Rogue",
    E: "Heroic Swing",
    R: "Comeuppance",
  },
  archetype: ["marksman", "roam", "lane bully"],
  primaryWinCondition: ["Use (E) to punish overextensions and create roam opportunities."],
  dangerAbilities: ["(E) mobility", "(R)"],
  dangerProfile: {
    dangerousWhen: ["(E) mobility", "(R)"],
    mustRespect: [
      "(W) is camouflage and roaming utility, not a direct combat spell.",
      "(E) is his main mobility and commit tool.",
      "He should not be described as a crowd-control champion.",
    ],
  },
  commonWeaknesses: [
    "Short range for a marksman makes positioning risky.",
    "(E) can be interrupted or punished if used forward.",
    "Falls behind if early pressure does not convert.",
  ],
  damageType: "physical",
  hardCrowdControl: [],
  id: "Akshan",
  importantAbilityNotes: [
    "(W) is camouflage and roaming utility, not a direct combat spell.",
    "(E) is his main mobility and commit tool.",
    "He should not be described as a crowd-control champion.",
  ],
  lanePlan: {
    avoids: [
      "Short range for a marksman makes positioning risky.",
      "(E) can be interrupted or punished if used forward.",
      "Falls behind if early pressure does not convert.",
    ],
    idealLaneState:
      "Ranged AD lane bully who pressures short trades, early push, and side movement.",
    wants: ["Use (E) to punish overextensions and create roam opportunities."],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    scalingPriority: "medium",
    lanePressure: "high",
    preferredGameState: ["Use (E) to punish overextensions and create roam opportunities."],
    winLaneBy: ["Use (E) to punish overextensions and create roam opportunities."],
  },
  majorPowerSpikes: [
    "Level 2 access to (Q) plus (E) or (W) utility.",
    "Level 6 (R).",
    "First completed AD marksman item.",
  ],
  matchupPreferences: {
    strongInto: [],
    weakInto: [],
  },
  mobilityLevel: "high",
  name: "Akshan",
  offMetaRoles: [],
  strategicIdentity: {
    laneGoal: "snowball",
    scalingProfile: "early",
    preferredGameLength: "short",
    winMethod: ["early lane pressure", "roam resets", "skirmish cleanup"],
  },
  powerSpikes: {
    major: [
      {
        timing: "Level 2",
        reason: "Level 2 access to (Q) plus (E) or (W) utility",
        changesGameplay:
          "The early ability combination gives Akshan a real trade or all-in pattern instead of isolated lane pressure.",
        playerAction:
          "Use the unlocked combo only when cooldowns, minions, and spacing make the trade hard to punish.",
        enemyResponse:
          "Respect the early combo unlock and avoid giving Akshan the wave or spacing needed to start it cleanly.",
      },
      {
        timing: "Level 6",
        reason: "Level 6 (R)",
        changesGameplay:
          "Akshan's ultimate becomes available, so the matchup shifts around whether the commit, pick, roam, or escape threat is ready.",
        playerAction:
          "Track (R) availability and use the window for verified all-ins, picks, roams, or defensive resets rather than forcing blind.",
        enemyResponse:
          "Respect (R) window, hold key defensive tools for the commit, and punish after (R) is spent.",
      },
      {
        timing: "First completed AD marksman item",
        reason: "First completed AD marksman item",
        changesGameplay:
          "Akshan's damage, wave control, or trade reliability improves enough that earlier neutral trades can become losing trades.",
        playerAction:
          "After the item, pressure waves and trades more confidently while still tracking the enemy's main answer.",
        enemyResponse:
          "Do not treat pre-item trades as still safe once Akshan's first item threshold is completed.",
      },
    ],
  },
  primaryRoles: ["mid"],
  secondaryRoles: [],
  primaryTradingPattern: "Use autos and (Q) for short ranged pressure, then reposition with (E).",
  punishProfile: {
    canPunish: [],
    strugglesToPunish: [
      "Short range for a marksman makes positioning risky.",
      "(E) can be interrupted or punished if used forward.",
      "Falls behind if early pressure does not convert.",
    ],
  },
  shields: [],
  softCrowdControl: [],
  stealthOrInvisibility: "(W) grants camouflage outside direct combat.",
  sustain: [],
  trading: {
    badTradeConditions: [
      "After Akshan uses (E) to engage, if he misses or is interrupted he can be punished hard.",
    ],
    goodTradeConditions: [],
    primaryPattern: "Use autos and (Q) for short ranged pressure, then reposition with (E).",
  },
  punishWindows: [
    "After Akshan uses (E) to engage, if he misses or is interrupted he can be punished hard.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
