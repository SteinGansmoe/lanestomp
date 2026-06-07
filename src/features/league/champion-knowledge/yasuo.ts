import type { LeagueChampionKnowledgeProfile } from "./types";

export const yasuoCombatProfile = {
  profileQuality: "draft",
  abilities: {
    Q: "Steel Tempest",
    W: "Wind Wall",
    E: "Sweeping Blade",
    R: "Last Breath",
  },
  archetype: ["skirmisher", "melee carry", "mobility", "skirmisher"],
  primaryWinCondition: [
    "Use (Q) and (E) to create mobility and control space, wants to fight close to minions.",
  ],
  dangerAbilities: ["Second (Q) tornado knockup, (R) follow-up on airborne targets"],
  dangerProfile: {
    dangerousWhen: ["Second (Q) tornado knockup, (R) follow-up on airborne targets"],
    mustRespect: [
      "(E) requires targets and cannot freely dash without them.",
      "(W) blocks many projectiles but not all abilities.",
      "(R) requires an airborne target.",
    ],
  },
  commonWeaknesses: [
    "Needs minion waves or targets for mobility.",
    "Vulnerable when (W) and passive shield are down.",
    "Can be punished by controlled wave states and point-and-click CC.",
  ],
  damageType: "physical",
  hardCrowdControl: ["(Q) tornado knockup", "(R) follow-up on airborne targets"],
  id: "Yasuo",
  importantAbilityNotes: [
    "(E) requires targets and cannot freely dash without them.",
    "(W) blocks many projectiles but not all abilities.",
    "(R) requires an airborne target.",
  ],
  lanePlan: {
    avoids: [
      "Needs minion waves or targets for mobility.",
      "Vulnerable when (W) and passive shield are down.",
      "Can be punished by controlled wave states and point-and-click CC.",
    ],
    idealLaneState:
      "Melee AD skirmisher who uses waves for mobility, short trades, and all-ins off knockups.",
    wants: [
      "Use (Q) and (E) to create mobility and control space, wants to fight close to minions.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    scalingPriority: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Use (Q) and (E) to create mobility and control space, wants to fight close to minions.",
    ],
    winLaneBy: [
      "Use (Q) and (E) to create mobility and control space, wants to fight close to minions.",
    ],
  },
  majorPowerSpikes: [
    "Level 2 access to (Q) plus (E) mobility.",
    "Level 6 (R) if knockup access exists.",
    "First completed item.",
  ],
  matchupPreferences: {
    strongInto: [],
    weakInto: [],
  },
  mobilityLevel: "very_high",
  name: "Yasuo",
  offMetaRoles: ["adc"],
  strategicIdentity: {
    laneGoal: "snowball",
    scalingProfile: "mid",
    preferredGameLength: "medium",
    winMethod: ["wave-based trades", "extended skirmishes", "side-lane pressure"],
  },
  powerSpikes: {
    major: [
      {
        timing: "Level 2",
        reason: "Level 2 access to (Q) plus (E) mobility",
        changesGameplay:
          "The early ability combination gives Yasuo a real trade or all-in pattern instead of isolated lane pressure.",
        playerAction:
          "Use the unlocked combo only when cooldowns, minions, and spacing make the trade hard to punish.",
        enemyResponse:
          "Respect the early combo unlock and avoid giving Yasuo the wave or spacing needed to start it cleanly.",
      },
      {
        timing: "Level 6",
        reason: "Level 6 (R) if knockup access exists",
        changesGameplay:
          "Yasuo's ultimate becomes available, so the matchup shifts around whether the commit, pick, roam, or escape threat is ready.",
        playerAction:
          "Track (R) availability and use the window for verified all-ins, picks, roams, or defensive resets rather than forcing blind.",
        enemyResponse:
          "Respect (R) window, hold key defensive tools for the commit, and punish after (R) is spent.",
      },
      {
        timing: "First completed item",
        reason: "First completed item",
        changesGameplay:
          "Yasuo's damage, wave control, or trade reliability improves enough that earlier neutral trades can become losing trades.",
        playerAction:
          "After the item, pressure waves and trades more confidently while still tracking the enemy's main answer.",
        enemyResponse:
          "Do not treat pre-item trades as still safe once Yasuo's first item threshold is completed.",
      },
    ],
  },
  primaryRoles: ["mid"],
  secondaryRoles: ["top"],
  primaryTradingPattern:
    "Stack (Q), dash through wave targets, use (W) against key projectiles, and commit on knockup threat.",
  punishProfile: {
    canPunish: [],
    strugglesToPunish: [
      "Needs minion waves or targets for mobility.",
      "Vulnerable when (W) and passive shield are down.",
      "Can be punished by controlled wave states and point-and-click CC.",
    ],
  },
  shields: ["Passive Way of the Wanderer flow shield"],
  softCrowdControl: [],
  stealthOrInvisibility: null,
  sustain: [],
  trading: {
    badTradeConditions: [
      "When (W) is down, Yasuo has no real way of dodging.",
      "When there isnt a minion wave to (E) back and forth from.",
    ],
    goodTradeConditions: [],
    primaryPattern:
      "Stack (Q), dash through wave targets, use (W) against key projectiles, and commit on knockup threat.",
  },
  punishWindows: [
    "When (W) is down, Yasuo has no real way of dodging.",
    "When there isnt a minion wave to (E) back and forth from.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
