import type { LeagueChampionKnowledgeProfile } from "./types";

export const syndraCombatProfile = {
  profileQuality: "draft",
  abilities: {
    Q: "Dark Sphere",
    W: "Force of Will",
    E: "Scatter the Weak",
    R: "Unleashed Power",
  },
  archetype: ["burst mage", "control mage"],
  primaryWinCondition: [
    "Use (Q) and (W) to control space and poke, then look for (E) stun into (R) burst all-in windows.",
  ],
  dangerAbilities: ["(E) stun when knocking spheres"],
  dangerProfile: {
    dangerousWhen: ["(E) stun when knocking spheres"],
    mustRespect: [
      "(E) is her key disengage and stun tool.",
      "(R) is level 6 single-target burst.",
      "Sphere placement changes her stun threat.",
    ],
  },
  commonWeaknesses: [
    "Immobile and punishable when (E) is down.",
    "Needs sphere setup for strongest control.",
    "Can be pressured before scaling stacks and items.",
  ],
  damageType: "magic",
  hardCrowdControl: ["(E) stun when knocking spheres"],
  id: "Syndra",
  importantAbilityNotes: [
    "(E) is her key disengage and stun tool.",
    "(R) is level 6 single-target burst.",
    "Sphere placement changes her stun threat.",
  ],
  lanePlan: {
    avoids: [
      "Immobile and punishable when (E) is down.",
      "Needs sphere setup for strongest control.",
      "Can be pressured before scaling stacks and items.",
    ],
    idealLaneState:
      "Burst control mage who zones with spheres and punishes oversteps with stun into burst.",
    wants: [
      "Use (Q) and (W) to control space and poke, then look for (E) stun into (R) burst all-in windows.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "low",
    scalingPriority: "high",
    lanePressure: "medium",
    preferredGameState: [
      "Use (Q) and (W) to control space and poke, then look for (E) stun into (R) burst all-in windows.",
    ],
    winLaneBy: [
      "Use (Q) and (W) to control space and poke, then look for (E) stun into (R) burst all-in windows.",
    ],
  },
  majorPowerSpikes: ["Level 6 (R).", "First completed mage item."],
  matchupPreferences: {
    strongInto: [],
    weakInto: [],
  },
  counters: [
    {
      champion: "Ahri",
      reasons: [
        "Syndra can outrange Ahri's short trade windows and punish charm attempts with stronger burst.",
      ],
    },
    {
      champion: "Katarina",
      reasons: [
        "Syndra can hold (E) for Katarina's jump and stop her reset setup before she channels (R).",
      ],
    },
    {
      champion: "Akali",
      reasons: [
        "Syndra can punish Akali before shroud and use knockback to interrupt her committed dash windows.",
      ],
    },
    {
      champion: "Veigar",
      reasons: [
        "Syndra can pressure Veigar's weak early lane and contest space before his cage and stacks scale.",
      ],
    },
  ],
  counteredBy: [
    {
      champion: "Yasuo",
      reasons: [
        "Yasuo can block Syndra's stun setup with Wind Wall and pressure her immobility through the wave.",
      ],
    },
    {
      champion: "Fizz",
      reasons: [
        "Fizz can dodge Syndra's key stun or burst with (E) and threaten her once Scatter is down.",
      ],
    },
    {
      champion: "Kassadin",
      reasons: [
        "Kassadin can absorb Syndra's magic poke and later outscale her with repeated mobility.",
      ],
    },
    {
      champion: "Zed",
      reasons: [
        "Zed can punish Syndra's immobility after (E) is down and threaten lethal side-lane pressure.",
      ],
    },
  ],
  mobilityLevel: "none",
  name: "Syndra",
  offMetaRoles: [],
  strategicIdentity: {
    laneGoal: "control",
    scalingProfile: "mid",
    preferredGameLength: "medium",
    winMethod: ["lane pressure", "pick threat", "burst control"],
  },
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "Level 6 (R)",
        changesGameplay:
          "Syndra's ultimate becomes available, so the matchup shifts around whether the commit, pick, roam, or escape threat is ready.",
        playerAction:
          "Track (R) availability and use the window for verified all-ins, picks, roams, or defensive resets rather than forcing blind.",
        enemyResponse:
          "Respect (R) window, hold key defensive tools for the commit, and punish after (R) is spent.",
      },
      {
        timing: "First completed mage item",
        reason: "First completed mage item",
        changesGameplay:
          "Syndra's damage, wave control, or trade reliability improves enough that earlier neutral trades can become losing trades.",
        playerAction:
          "After the item, pressure waves and trades more confidently while still tracking the enemy's main answer.",
        enemyResponse:
          "Do not treat pre-item trades as still safe once Syndra's first item threshold is completed.",
      },
      {
        timing: "Levels 11 and 16",
        reason: "Level 11 and 16 when maxing (Q) for lower cooldown and stronger poke",
        changesGameplay:
          "Syndra's later level scaling improves repeat threat and makes loose positioning harder to recover from.",
        playerAction:
          "Use the stronger level breakpoint to contest space more often, but do not skip cooldown or wave checks.",
        enemyResponse:
          "Avoid loose extended fights after this level breakpoint unless Syndra's key cooldowns are down.",
      },
      {
        timing: "(Q) upgrade",
        reason: "Once her (Q) is upgraded she can reliably poke back and threaten stuns more often",
        changesGameplay:
          "The upgraded ability makes Syndra's poke and follow-up threat more reliable.",
        playerAction:
          "Use the upgraded spell threat to contest poke, stuns, or wave control more consistently.",
        enemyResponse:
          "Respect the upgraded spell pattern and punish only after the key spell misses or is spent on wave.",
      },
    ],
  },
  primaryRoles: ["mid"],
  secondaryRoles: [],
  primaryTradingPattern: "Poke with (Q), hold (E) to punish commits, and burst when stun lands.",
  punishProfile: {
    canPunish: [],
    strugglesToPunish: [
      "Immobile and punishable when (E) is down.",
      "Needs sphere setup for strongest control.",
      "Can be pressured before scaling stacks and items.",
    ],
  },
  shields: [],
  softCrowdControl: ["(W) slow"],
  stealthOrInvisibility: null,
  sustain: [],
  trading: {
    badTradeConditions: [
      "If (E) stun is missed, Syndra has no escape at all.",
      "If Syndra misses spells, she can be all-inned as she has no mobility or sustain.",
    ],
    goodTradeConditions: [],
    primaryPattern: "Poke with (Q), hold (E) to punish commits, and burst when stun lands.",
  },
  punishWindows: [
    "If (E) stun is missed, Syndra has no escape at all.",
    "If Syndra misses spells, she can be all-inned as she has no mobility or sustain.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
