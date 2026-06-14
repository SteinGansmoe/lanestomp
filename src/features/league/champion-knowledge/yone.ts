import type { LeagueChampionKnowledgeProfile } from "./types";

export const yoneCombatProfile = {
  profileQuality: "draft",
  abilities: {
    Q: "Mortal Steel",
    W: "Spirit Cleave",
    E: "Soul Unbound",
    R: "Fate Sealed",
  },
  archetype: ["skirmisher", "assassin", "melee carry"],
  primaryWinCondition: ["Use (E) + (Q) combo to force trades with a planned exit."],
  dangerAbilities: ["(E) knockup/stun"],
  dangerProfile: {
    dangerousWhen: ["(E) knockup/stun"],
    mustRespect: [
      "(E) is his main trade extension and snapback tool.",
      "(Q) third cast creates knockup threat.",
      "A well timed (R) can instantly turn a fight in his favour.",
    ],
  },
  commonWeaknesses: [
    "When (E) is used the enemy knows where Yone will be when (E) is over.",
    "Needs (Q) setup for knockup threat.",
    "Vulnerable before he can reliably enter and exit trades.",
  ],
  damageType: "mixed",
  hardCrowdControl: ["(Q) third-cast knockup", "(R) knockup/displacement"],
  id: "Yone",
  importantAbilityNotes: [
    "(E) is his main trade extension and snapback tool.",
    "(Q) third cast creates knockup threat.",
    "A well timed (R) can instantly turn a fight in his favour.",
  ],
  lanePlan: {
    avoids: [
      "When (E) is used the enemy knows where Yone will be when (E) is over.",
      "Needs (Q) setup for knockup threat.",
      "Vulnerable before he can reliably enter and exit trades.",
    ],
    idealLaneState:
      "Scaling melee carry who uses (E) + (Q) combo to force trades with a planned exit.",
    wants: ["Use (E) + (Q) combo to force trades with a planned exit."],
  },
  laneIdentity: {
    earlyGameAgency: "low",
    scalingPriority: "high",
    lanePressure: "low",
    preferredGameState: ["Use (E) + (Q) combo to force trades with a planned exit."],
    winLaneBy: ["Use (E) + (Q) combo to force trades with a planned exit."],
  },
  majorPowerSpikes: [
    "Level 3 unlocks (Q)-(W)-(E) trade pattern with (E) extension and (W) shield.",
    "First back for more attack speed.",
    "Bork is a great item for him.",
  ],
  matchupPreferences: {
    strongInto: [],
    weakInto: [],
  },
  counters: [
    {
      champion: "Syndra",
      reasons: [
        "Yone can use (E) to pressure Syndra after her (E) is down and snap back before her burst fully lands.",
      ],
    },
    {
      champion: "Lux",
      reasons: [
        "Yone can threaten Lux's low mobility after she misses (Q) and punish her before she resets spacing.",
      ],
    },
    {
      champion: "Veigar",
      reasons: [
        "Yone can use (E) and (R) to force through Veigar's range once cage is unavailable.",
      ],
    },
    {
      champion: "Kassadin",
      reasons: [
        "Yone can punish Kassadin's weaker early lane before Kassadin reaches higher-level mobility.",
      ],
    },
  ],
  counteredBy: [
    {
      champion: "Lissandra",
      reasons: [
        "Lissandra can lock Yone down when he enters with (E) and punish his predictable snapback position.",
      ],
    },
    {
      champion: "Renekton",
      reasons: [
        "Renekton can win early melee trades with stun and burst before Yone scales into item fights.",
      ],
    },
    {
      champion: "Pantheon",
      reasons: [
        "Pantheon can stop Yone's engage with point-and-click stun and punish his low early durability.",
      ],
    },
    {
      champion: "Malphite",
      reasons: [
        "Malphite can stack armor, slow Yone's attack pattern, and force fights with reliable knockup.",
      ],
    },
  ],
  mobilityLevel: "high",
  name: "Yone",
  offMetaRoles: [],
  strategicIdentity: {
    laneGoal: "snowball",
    scalingProfile: "mid",
    preferredGameLength: "medium",
    winMethod: ["side-lane pressure", "extended trades", "teamfight engage"],
  },
  powerSpikes: {
    major: [
      {
        timing: "Level 3",
        reason: "Level 3 unlocks (Q)-(W)-(E) trade pattern with (E) extension and (W) shield",
        changesGameplay:
          "The early ability combination gives Yone a real trade or all-in pattern instead of isolated lane pressure.",
        playerAction:
          "Use the unlocked combo only when cooldowns, minions, and spacing make the trade hard to punish.",
        enemyResponse:
          "Respect the early combo unlock and avoid giving Yone the wave or spacing needed to start it cleanly.",
      },
      {
        timing: "First attack-speed buy",
        reason: "First back for more attack speed",
        changesGameplay:
          "Yone's damage, wave control, or trade reliability improves enough that earlier neutral trades can become losing trades.",
        playerAction:
          "After the item, pressure waves and trades more confidently while still tracking the enemy's main answer.",
        enemyResponse:
          "Do not treat pre-item trades as still safe once Yone's first item threshold is completed.",
      },
      {
        timing: "Blade of the Ruined King timing",
        reason: "Bork is a great item for him",
        changesGameplay:
          "Yone's damage, wave control, or trade reliability improves enough that earlier neutral trades can become losing trades.",
        playerAction:
          "After the item, pressure waves and trades more confidently while still tracking the enemy's main answer.",
        enemyResponse:
          "Do not treat pre-item trades as still safe once Yone's first item threshold is completed.",
      },
    ],
  },
  primaryRoles: ["mid"],
  secondaryRoles: ["top"],
  primaryTradingPattern:
    "Stack (Q), use (E) and second (Q) to gap close, snap back with (E) to avoid punishment.",
  punishProfile: {
    canPunish: [],
    strugglesToPunish: [
      "When (E) is used the enemy knows where Yone will be when (E) is over.",
      "Needs (Q) setup for knockup threat.",
      "Vulnerable before he can reliably enter and exit trades.",
    ],
  },
  shields: ["(W) shield"],
  softCrowdControl: [
    "(Q) after gaining 2 stacks of Gathering Storm, makes enemies airborne, (R) blinking behind the last enemy hit and knocking everyone airborne towards him.",
  ],
  stealthOrInvisibility: null,
  sustain: [],
  trading: {
    badTradeConditions: [
      "If (E) is used from a bad position.",
      "If Yone misses key abilities like (Q) knockup or (R) displacement.",
    ],
    goodTradeConditions: [],
    primaryPattern:
      "Stack (Q), use (E) and second (Q) to gap close, snap back with (E) to avoid punishment.",
  },
  punishWindows: [
    "If (E) is used from a bad position.",
    "If Yone misses key abilities like (Q) knockup or (R) displacement.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
