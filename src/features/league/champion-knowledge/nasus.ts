import type { LeagueChampionKnowledgeProfile } from "./types";

export const nasusCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "low",
  abilities: {
    Q: "Siphoning Strike",
    W: "Wither",
    E: "Spirit Fire",
    R: "Fury of the Sands",
  },
  archetype: ["scaling juggernaut", "splitpush", "sustain", "stat-check duelist"],
  primaryWinCondition: [
    "Survive early lane, stack (Q), and become a side-lane threat that forces enemies to respect (W) and level 6 extended fights.",
  ],
  dangerAbilities: ["(Q) stacking damage", "(W) slow", "(R) extended fight durability"],
  dangerProfile: {
    dangerousWhen: [
      "He has enough (Q) stacks to punish melee range.",
      "(W) lands on a target that needs movement or attack speed to trade back.",
      "(R) is active and the fight lasts long enough for repeated (Q) casts.",
      "At around 15-20 minutes Nasus becomes a significant threat if he havent been punished in the early levels.",
      "If Nasus is ahead in lane, he can often 1v2 if enemy jungler ganks",
    ],
    mustRespect: [
      "A passive lane favors his scaling plan.",
      "(W) can turn overextended trades into forced all-ins.",
      "His side-lane threat rises sharply once (Q) stacks and durability come online.",
    ],
  },
  commonWeaknesses: [
    "Low mobility.",
    "Weak early lane pressure when denied farm.",
    "Can be punished by wave control, poke, and coordinated dives before he scales.",
  ],
  damageType: "physical",
  hardCrowdControl: [],
  id: "Nasus",
  importantAbilityNotes: [
    "(Q) permanently gains damage when it kills units.",
    "(W) heavily slows movement and attack speed.",
    "(E) helps farm, trade, and reduce armor in its area.",
    "(R) gives durability and improves extended-fight threat.",
  ],
  lanePlan: {
    avoids: [
      "Taking early fights before (Q) stacks matter.",
      "Letting the wave freeze far from safety against stronger early lanes.",
      "Using (W) too early when the enemy can disengage and re-enter.",
    ],
    idealLaneState:
      "A controlled top wave near his side where Nasus can last-hit with (Q), preserve health through passive sustain, and avoid early all-in pressure.",
    wants: [
      "CS access and repeated (Q) stacks.",
      "Slow, low-interaction lanes that reach mid game.",
      "Side-lane space where (W), (R), and stacked (Q) force duels.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "low",
    lanePressure: "low",
    preferredGameState: [
      "Stable farm lanes that do not punish his weak early levels.",
      "Side-lane duels after stack and item thresholds.",
      "Extended fights where repeated (Q) casts matter.",
    ],
    scalingPriority: "very_high",
    winLaneBy: [
      "Denying early snowball attempts.",
      "Stacking (Q) safely.",
      "Using (W) and (R) to punish enemies who overstay in side lane.",
    ],
  },
  majorPowerSpikes: ["Level 6 (R).", "First defensive or sheen-style item.", "High (Q) stack side-lane threshold."],
  matchupPreferences: {
    strongInto: [
      "Low-pressure lanes that cannot deny farm.",
      "Melee duelists vulnerable to (W).",
      "Side-lane matchups that must fight him in extended range.",
    ],
    weakInto: [
      "Early lane bullies who can freeze or dive.",
      "Ranged poke that denies him from stacking (Q).",
      "High mobility champions early game.",
    ],
  },
  mobilityLevel: "low",
  name: "Nasus",
  offMetaRoles: ["mid"],
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "(R) gives durability and repeated-fight threat",
        changesGameplay:
          "Nasus can survive longer trades and punish opponents who stay in range for repeated (Q) casts.",
        playerAction:
          "Use (R) to hold ground in extended fights only when the enemy cannot kite the full duration.",
        enemyResponse:
          "Disengage the (R) window and punish his low mobility before it returns.",
      },
      {
        timing: "High (Q) stack side-lane threshold",
        reason: "Stacked (Q) turns him into a major one-on-one threat",
        changesGameplay:
          "Side-lane defenders must respect (W) into repeated (Q) damage.",
        playerAction:
          "Pressure side lane and force enemies to answer once stacks and durability make duels favorable.",
        enemyResponse:
          "Avoid isolated extended fights and coordinate pressure before he reaches the wave.",
      },
    ],
  },
  primaryRoles: ["top"],
  primaryTradingPattern:
    "Prioritize safe (Q) stacks early, use (W) to stop overextended trades, and only force long fights when (R), stacks, and wave state favor him.",
  punishProfile: {
    canPunish: [
      "Enemies who let him stack for free.",
      "Attack-speed or mobility-reliant champions caught by (W).",
      "Side-lane targets who cannot kite his (R) duration.",
    ],
    strugglesToPunish: [
      "Ranged champions who deny farm without entering (W) range.",
      "Teams that collapse before he can reach side-lane targets.",
    ],
  },
  secondaryRoles: ["jungle"],
  shields: [],
  softCrowdControl: ["(W) slow", "(E) armor reduction zone"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "scale",
    preferredGameLength: "long",
    scalingProfile: "late",
    winMethod: ["high stacks of (Q)", "side-lane scaling", "extended juggernaut fights"],
  },
  sustain: ["Passive lifesteal"],
  trading: {
    badTradeConditions: [
      "He is fighting before meaningful (Q) stacks.",
      "(W) is unavailable.",
      "The enemy can kite away from (R).",
    ],
    goodTradeConditions: [
      "The wave is near his side and he can retreat after farming.",
      "The enemy walks into (W) range without disengage.",
      "(R) is available and he has enough stacks for repeated (Q) damage.",
    ],
    primaryPattern:
      "Farm first, slow enemies with (W) when they overcommit, and convert stacked (Q) plus (R) into side-lane wins after early pressure fades.",
  },
  punishWindows: [
    "Before stacks and level 6, Nasus has low lane pressure.",
    "When (W) is down, he has little way to stop mobile champions.",
    "If the wave is frozen away from him, his scaling plan slows down heavily.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
