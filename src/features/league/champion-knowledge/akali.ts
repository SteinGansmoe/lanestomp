import type { LeagueChampionKnowledgeProfile } from "./types";

export const akaliCombatProfile = {
  profileQuality: "reviewed",
  abilities: {
    Q: "Five Point Strike",
    W: "Twilight Shroud",
    E: "Shuriken Flip",
    R: "Perfect Execution",
  },
  archetype: ["assassin", "skirmisher", "burst"],
  primaryWinCondition: ["Correct use of (W) with (Q) hit and passive will make Akali a formidable threat."],
  dangerAbilities: ["(W), (E)"],
  dangerProfile: {
    dangerousWhen: ["(W), (E)"],
    mustRespect: [
      "(W) is not a level 6 spike.",
      "(W) creates her safest trading window.",
      "(E) recast is a major commit point.",
    ],
  },
  commonWeaknesses: [
    "Can be punished when (W) is down.",
    "Early waveclear can be exploitable by ranged mids.",
    "Needs energy and ability access to extend trades.",
  ],
  damageType: "magic",
  hardCrowdControl: [],
  id: "Akali",
  importantAbilityNotes: [
    "(W) is not a level 6 spike.",
    "(W) creates her safest trading window.",
    "(E) recast is a major commit point.",
  ],
  lanePlan: {
    avoids: [
      "Can be punished when (W) is down.",
      "Early waveclear can be exploitable by ranged mids.",
      "Needs energy and ability access to extend trades.",
    ],
    idealLaneState: "Melee AP assassin who gives ground early, becomes stronger after level 3.",
    wants: ["Use (W) to create safe windows for extended trades and all-ins."],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    scalingPriority: "medium",
    lanePressure: "high",
    preferredGameState: ["Use (W) to create safe windows for extended trades and all-ins."],
    winLaneBy: ["Use (W) to create safe windows for extended trades and all-ins."],
  },
  majorPowerSpikes: [
    "Level 3 unlocks (Q)-(W)-(E) trading with (W) safety and (E) follow-up.",
    "Level 6 (R).",
    "Becomes incredibly strong after Hextech Gunblade is purchased.",
  ],
  matchupPreferences: {
    strongInto: ["Melee champions"],
    weakInto: ["Long distance champions with strong poke or waveclear"],
  },
  counters: [
    {
      champion: "Veigar",
      reasons: [
        "Akali can use (W) to delay Veigar's target access and make his burst window awkward.",
        "(E) and (R) let Akali threaten Veigar after his (E) cage is down.",
        "Veigar's early lane gives Akali time to reach level 6 and start forcing all-ins.",
      ],
    },
  ],
  counteredBy: [
    {
      champion: "Lissandra",
      reasons: [
        "Lissandra can hold (W) for Akali's dash-in timing and stop the follow-up trade.",
        "After level 6, Lissandra can use (R) to deny Akali's burst or lock Akali down.",
        "Early defensive items and waveclear make it harder for Akali to snowball the lane.",
      ],
    },
  ],
  mobilityLevel: "very_high",
  name: "Akali",
  offMetaRoles: [],
  strategicIdentity: {
    laneGoal: "snowball",
    scalingProfile: "mid",
    preferredGameLength: "medium",
    winMethod: ["side-lane picks", "burst all-ins", "flank pressure"],
  },
  powerSpikes: {
    major: [
      {
        timing: "Level 3",
        reason: "Level 3 unlocks (Q)-(W)-(E) trading with (W) safety and (E) follow-up",
        changesGameplay:
          "The early ability combination gives Akali a real trade or all-in pattern instead of isolated lane pressure.",
        playerAction:
          "Use the unlocked combo only when cooldowns, minions, and spacing make the trade hard to punish.",
        enemyResponse:
          "Respect the early combo unlock and avoid giving Akali the wave or spacing needed to start it cleanly.",
      },
      {
        timing: "Level 6",
        reason: "Level 6 (R)",
        changesGameplay:
          "Akali's ultimate becomes available, so the matchup shifts around whether the commit, pick, roam, or escape threat is ready.",
        playerAction:
          "Track (R) availability and use the window for verified all-ins, picks, roams, or defensive resets rather than forcing blind.",
        enemyResponse:
          "Respect (R) window, hold key defensive tools for the commit, and punish after (R) is spent.",
      },
      {
        timing: "First completed AP assassin item",
        reason: "First completed AP assassin item",
        changesGameplay:
          "Akali's damage, wave control, or trade reliability improves enough that earlier neutral trades can become losing trades.",
        playerAction:
          "After the item, pressure waves and trades more confidently while still tracking the enemy's main answer.",
        enemyResponse:
          "Do not treat pre-item trades as still safe once Akali's first item threshold is completed.",
      },
    ],
  },
  primaryRoles: ["mid"],
  secondaryRoles: ["top"],
  primaryTradingPattern:
    "Look for (Q) poke into passive autos, then commit harder with (W) or (E) when the opponent is exposed.",
  punishProfile: {
    canPunish: [],
    strugglesToPunish: [
      "Can be punished when (W) is down.",
      "Early waveclear can be exploitable by ranged mids.",
      "Needs energy and ability access to extend trades.",
    ],
  },
  shields: [],
  softCrowdControl: ["Short slow on (Q) hit"],
  stealthOrInvisibility: "(W) obscures Akali and enables trades.",
  sustain: [],
  trading: {
    badTradeConditions: [
      "Bad use of (W) can lead to enemy laner winning trades.",
    ],
    goodTradeConditions: [],
    primaryPattern:
      "Look for (Q) poke into passive autos, then commit harder with (W) or (E) when the opponent is exposed.",
  },
  punishWindows: [
    "Akali can be punished when (W) is down.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
