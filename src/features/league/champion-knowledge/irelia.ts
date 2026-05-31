import type { LeagueChampionKnowledgeProfile } from "./types";

export const ireliaCombatProfile = {
  profileQuality: "draft",
  abilities: {
    Q: "Bladesurge",
    W: "Defiant Dance",
    E: "Flawless Duet",
    R: "Vanguard's Edge",
  },
  archetype: ["fighter", "mobile skirmisher", "all-in", "reset"],
  primaryWinCondition: [
    "Use wave setup and Q resets to create extended all-in windows before ranged mids can stabilize.",
  ],
  dangerAbilities: ["E Flawless Duet stun", "R Vanguard's Edge engage and slow", "Q Bladesurge resets"],
  dangerProfile: {
    dangerousWhen: [
      "Low-health minions give Q reset paths.",
      "E or R marks the target for reliable Q access.",
      "She has passive stacks and can extend the fight.",
    ],
    mustRespect: [
      "Q reset access changes her threat range around minion waves.",
      "E is her key stun setup.",
      "R creates a stronger all-in and makes retreat harder.",
    ],
  },
  commonWeaknesses: [
    "Reliant on wave state and Q resets.",
    "Punishable if E or R misses.",
    "Can struggle when denied minion access or kited after Q commits.",
  ],
  damageType: "physical",
  hardCrowdControl: ["E Flawless Duet stun"],
  id: "Irelia",
  importantAbilityNotes: [
    "Q resets on kills and marked targets.",
    "E marks and stuns if both blades connect.",
    "W reduces incoming damage while charging.",
    "R marks enemies and creates a strong engage window.",
  ],
  lanePlan: {
    avoids: [
      "Fighting without passive stacks or reset access.",
      "Using Q into the enemy with no exit minion or mark.",
      "Forcing through large enemy waves before setup.",
    ],
    idealLaneState:
      "A mid wave with low-health minions that lets Irelia stack passive, threaten Q resets, and force extended trades.",
    wants: [
      "Minion waves she can use for Q mobility.",
      "Enemy cooldowns spent before she commits.",
      "E or R marks that enable reliable follow-up.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    lanePressure: "high",
    preferredGameState: [
      "Active waves with minions available for Q resets.",
      "Extended trades after passive is stacked.",
      "Side-lane or skirmish states where she can chase marked targets.",
    ],
    scalingPriority: "medium",
    winLaneBy: [
      "Using minion waves to create unexpected engage angles.",
      "Punishing immobile mages after key spells are used.",
      "Converting early all-ins into side pressure.",
    ],
  },
  majorPowerSpikes: [
    "Level 2 with Q and E access.",
    "Level 6 Vanguard's Edge.",
    "First completed fighter item.",
  ],
  matchupPreferences: {
    strongInto: [
      "Immobile mages who must stand near the wave.",
      "Champions with key skillshots she can dodge through minions.",
      "Lanes where she can maintain passive stacks.",
    ],
    weakInto: [
      "Crowd control that stops her after Q commits.",
      "Champions who can freeze safely and deny reset paths.",
      "Disengage that prevents extended fights.",
    ],
  },
  mobilityLevel: "very_high",
  name: "Irelia",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      "Level 2 with Q and E access.",
      "Level 6 Vanguard's Edge.",
      "First completed fighter item.",
    ],
    notes: [
      "Minion wave state can be as important as level spikes.",
      "Level 6 gives stronger stickiness and all-in threat.",
    ],
  },
  primaryRoles: ["mid"],
  secondaryRoles: ["top"],
  primaryTradingPattern:
    "Stack passive through the wave, use Q resets to close distance, and commit hard only when E or R creates a marked target.",
  punishProfile: {
    canPunish: [
      "Immobile champions standing near low-health minions.",
      "Enemies who spend crowd control before she commits.",
      "Targets marked by E or R.",
    ],
    strugglesToPunish: [
      "Champions who keep the wave away from her reset paths.",
      "Enemies holding reliable point-and-click control.",
    ],
  },
  shields: [],
  softCrowdControl: ["R Vanguard's Edge slow zone"],
  stealthOrInvisibility: null,
  sustain: ["Q Bladesurge healing on hit."],
  trading: {
    badTradeConditions: [
      "No passive stacks or Q reset path.",
      "E and R are unavailable.",
      "The enemy can stop her after she Qs forward.",
    ],
    goodTradeConditions: [
      "Low-health minions create Q paths.",
      "E lands or R marks the target.",
      "The enemy has spent their main peel or burst tool.",
    ],
    primaryPattern:
      "Prepare passive and minion resets first, then use Q mobility to force an extended fight around E or R marks.",
  },
  punishWindows: [
    "If Irelia misses E, her all-in becomes much less reliable.",
    "If she Qs forward with no reset, she is easier to punish.",
    "When passive stacks fall off, her extended trade threat is lower.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
