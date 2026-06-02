import type { LeagueChampionKnowledgeProfile } from "./types";

export const ireliaCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "very_high",
  abilities: {
    Q: "Bladesurge",
    W: "Defiant Dance",
    E: "Flawless Duet",
    R: "Vanguard's Edge",
  },
  archetype: ["fighter", "mobile skirmisher", "all-in", "reset", "side-lane"],
  primaryWinCondition: [
    "Use wave setup, passive stacks, and (Q) resets to create extended all-in windows before opponents can deny her minion access.",
  ],
  dangerAbilities: ["(E) stun", "(R) engage and slow", "(Q) resets"],
  dangerProfile: {
    dangerousWhen: [
      "Low-health minions give (Q) reset paths.",
      "(E) or (R) marks the target for reliable (Q) access.",
      "She has passive stacks and enough wave space to extend the fight.",
    ],
    mustRespect: [
      "(Q) reset access changes her threat range around minion waves.",
      "(E) is her key stun setup and makes her all-in much more reliable.",
      "(R) creates a stronger commit window and makes retreat harder.",
    ],
  },
  commonWeaknesses: [
    "Reliant on wave state and (Q) resets.",
    "Punishable if (E) or (R) misses.",
    "Can struggle when denied minion access, passive stacks, or clean reset paths.",
  ],
  damageType: "physical",
  hardCrowdControl: ["(E) stun"],
  id: "Irelia",
  importantAbilityNotes: [
    "(Q) resets on kills and marked targets.",
    "(W) reduces incoming damage while charging and can help survive burst.",
    "(E) marks and stuns if both blades connect.",
    "(R) marks enemies and creates a strong engage window.",
  ],
  lanePlan: {
    avoids: [
      "Fighting without passive stacks or reset access.",
      "Using (Q) into the enemy with no exit minion or mark.",
      "Forcing through large enemy waves before setup.",
    ],
    idealLaneState:
      "A wave with low-health minions that lets Irelia stack passive, threaten (Q) resets, and choose whether to extend into an all-in.",
    wants: [
      "Minion waves she can use for (Q) mobility.",
      "Enemy cooldowns spent before she commits.",
      "(E) or (R) marks that enable reliable follow-up.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    lanePressure: "high",
    preferredGameState: [
      "Active waves with minions available for (Q) resets.",
      "Extended trades after passive is stacked.",
      "Side-lane or skirmish states where she can chase marked targets.",
    ],
    scalingPriority: "medium",
    winLaneBy: [
      "Using minion waves to create unexpected engage angles.",
      "Punishing enemies after key crowd control, burst, or disengage is spent.",
      "Converting early all-ins into side pressure.",
    ],
  },
  majorPowerSpikes: [
    "Level 2 with (Q) and (E) access.",
    "Level 6 (R).",
    "First completed fighter item.",
  ],
  matchupPreferences: {
    strongInto: [
      "Immobile champions who must stand near the wave.",
      "Champions with key skillshots she can dodge through minions.",
      "Lanes where she can maintain passive stacks.",
    ],
    weakInto: [
      "Crowd control that stops her after (Q) commits.",
      "Champions who can freeze safely and deny reset paths.",
      "Disengage that prevents extended fights.",
    ],
  },
  mobilityLevel: "very_high",
  name: "Irelia",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 2",
        reason: "(Q) and (E) together unlock early stun into reset threat",
        changesGameplay:
          "Minion wave state can become as important as champion spacing.",
        playerAction:
          "Use the early combo only when cooldowns, minions, and spacing make the trade hard to punish.",
        enemyResponse:
          "Respect the early combo unlock and avoid giving Irelia the wave or spacing needed to start it cleanly.",
      },
      {
        timing: "Level 6",
        reason: "(R) adds engage, marks, and slow-zone pressure",
        changesGameplay:
          "Irelia gains stronger stickiness and can force longer all-ins around marked targets.",
        playerAction:
          "Use (R) for verified all-ins or skirmishes where reset paths and passive stacks are ready.",
        enemyResponse:
          "Hold key defensive tools for the commit and punish after (R) is spent.",
      },
      {
        timing: "First completed fighter item",
        reason: "Damage and durability make extended trades more reliable",
        changesGameplay:
          "Earlier neutral trades can become Irelia-favored if she keeps passive active.",
        playerAction:
          "Pressure waves and side-lane trades more confidently while still tracking the enemy's main answer.",
        enemyResponse:
          "Do not treat pre-item trade patterns as safe once Irelia reaches her first item.",
      },
    ],
  },
  primaryRoles: ["mid", "top"],
  primaryTradingPattern:
    "Stack passive through the wave, use (Q) resets to close distance, and commit hard only when (E), (R), or minion setup creates a reliable reset path.",
  punishProfile: {
    canPunish: [
      "Champions standing near low-health minions.",
      "Enemies who spend crowd control or disengage before she commits.",
      "Targets marked by (E) or (R).",
    ],
    strugglesToPunish: [
      "Champions who keep the wave away from her reset paths.",
      "Enemies holding reliable point-and-click control.",
    ],
  },
  secondaryRoles: [],
  shields: [],
  softCrowdControl: ["(R) slow zone"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "snowball",
    preferredGameLength: "medium",
    scalingProfile: "mid",
    winMethod: ["wave-based all-ins", "side-lane pressure", "extended skirmishes"],
  },
  sustain: ["(Q) healing on hit"],
  trading: {
    badTradeConditions: [
      "No passive stacks or (Q) reset path.",
      "(E) and (R) are unavailable.",
      "The enemy can stop her after she uses (Q) forward.",
    ],
    goodTradeConditions: [
      "Low-health minions create (Q) paths.",
      "(E) lands or (R) marks the target.",
      "The enemy has spent their main peel, control, or burst tool.",
    ],
    primaryPattern:
      "Prepare passive and minion resets first, then use (Q) mobility to force an extended fight around (E) or (R) marks.",
  },
  punishWindows: [
    "If Irelia misses (E), her all-in becomes much less reliable.",
    "If she uses (Q) forward with no reset, she is easier to punish.",
    "When passive stacks fall off, her extended trade threat is lower.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
