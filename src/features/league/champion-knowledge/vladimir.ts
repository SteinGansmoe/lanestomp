import type { LeagueChampionKnowledgeProfile } from "./types";

export const vladimirCombatProfile = {
  profileQuality: "draft",
  abilities: {
    Q: "Transfusion",
    W: "Sanguine Pool",
    E: "Tides of Blood",
    R: "Hemoplague",
  },
  archetype: ["scaling mage", "sustain", "teamfight", "burst"],
  primaryWinCondition: [
    "Survive early lane through sustain, scale into AP spikes, and threaten grouped fights with Hemoplague burst.",
  ],
  dangerAbilities: ["W Sanguine Pool untargetability", "R Hemoplague teamfight burst", "Q empowered Transfusion"],
  dangerProfile: {
    dangerousWhen: [
      "Empowered Q is ready and he can step forward safely.",
      "R is available for a burst trade or teamfight engage.",
      "W can deny key damage or crowd control.",
    ],
    mustRespect: [
      "W makes him untargetable but has a long cooldown and health cost.",
      "Empowered Q changes short trade threat.",
      "R amplifies his damage and rewards grouped targets.",
    ],
  },
  commonWeaknesses: [
    "Weak early wave control and limited range.",
    "Vulnerable after W is forced.",
    "Can be punished before AP and cooldown spikes.",
  ],
  damageType: "magic",
  hardCrowdControl: [],
  id: "Vladimir",
  importantAbilityNotes: [
    "Q is his sustain and short trade tool.",
    "Empowered Q is the trade window opponents must respect.",
    "W avoids targetable damage and crowd control but is costly.",
    "R is his major all-in and teamfight spell.",
  ],
  lanePlan: {
    avoids: [
      "Being forced to use W for small trades.",
      "Taking heavy poke before sustain can stabilize.",
      "Fighting early waves where he cannot match push.",
    ],
    idealLaneState:
      "A survivable lane where Vladimir can farm, use Q sustain, and avoid losing too much tempo before AP spikes.",
    wants: [
      "Short Q trades and sustain windows.",
      "Calm scaling lanes without forced early all-ins.",
      "Grouped fights once R and items are ready.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "low",
    lanePressure: "low",
    preferredGameState: [
      "Low-pressure early lane.",
      "Mid-game fights where he can flank or reach carries.",
      "Grouped enemies vulnerable to R and E burst.",
    ],
    scalingPriority: "very_high",
    winLaneBy: [
      "Preserving health and farm through early weakness.",
      "Using empowered Q to win short trades.",
      "Scaling into decisive teamfight damage.",
    ],
  },
  majorPowerSpikes: [
    "Level 6 Hemoplague.",
    "First completed AP item.",
    "Mid-game AP and cooldown spikes.",
  ],
  matchupPreferences: {
    strongInto: [
      "Low-pressure lanes that let him farm.",
      "Compositions that group into his R.",
      "Champions that cannot punish W cooldown consistently.",
    ],
    weakInto: [
      "Strong early wave pressure and poke.",
      "Champions that force W before real fights.",
      "Long-range control that keeps him away from carries.",
    ],
  },
  mobilityLevel: "low",
  name: "Vladimir",
  offMetaRoles: [],
      powerSpikes: {
      major: [
        {
          timing: "Level 6",
          reason: "Level 6 Hemoplague",
          changesGameplay: "Level 6 adds real all-in threat but he still values item scaling",
          playerAction: "Track R availability and use the window for verified all-ins, picks, roams, or defensive resets rather than forcing blind.",
          enemyResponse: "Respect Vladimir's R window, hold key defensive tools for the commit, and punish after R is spent.",
        },
        {
          timing: "First completed AP item",
          reason: "First completed AP item",
          changesGameplay: "W cooldown is one of the clearest windows to punish him",
          playerAction: "After the item, pressure waves and trades more confidently while still tracking the enemy's main answer.",
          enemyResponse: "Do not treat pre-item trades as still safe once Vladimir's first item threshold is completed.",
        },
        {
          timing: "Mid-game item progression",
          reason: "Mid-game AP and cooldown spikes",
          changesGameplay: "This timing changes how safely Vladimir can contest trades, waves, or river space.",
          playerAction: "Change trading pace only when this timing is active and the enemy has no clean punish window.",
          enemyResponse: "Respect the timing until Vladimir's key cooldowns or resources are spent.",
        },
      ],
    },
  primaryRoles: ["mid"],
  secondaryRoles: ["top"],
  primaryTradingPattern:
    "Farm safely, take short Q trades around empowered Q, and save W for meaningful enemy commits.",
  punishProfile: {
    canPunish: [
      "Enemies who trade into empowered Q.",
      "Grouped targets during R windows.",
      "Low-pressure lanes that let him reach items.",
    ],
    strugglesToPunish: [
      "Long-range champions who deny Q access.",
      "Enemies who force W and wait for the cooldown.",
    ],
  },
  shields: [],
  softCrowdControl: ["W Sanguine Pool slow"],
  stealthOrInvisibility: "W Sanguine Pool makes Vladimir untargetable.",
  sustain: ["Q Transfusion healing", "Empowered Q stronger healing"],
  trading: {
    badTradeConditions: [
      "W is down and enemy engage is available.",
      "Empowered Q is not ready for the short trade.",
      "The enemy outranges him and can punish his approach.",
    ],
    goodTradeConditions: [
      "Empowered Q is ready.",
      "W can deny the enemy's key response.",
      "R can amplify enough damage to finish the trade.",
    ],
    primaryPattern:
      "Use Q sustain to survive lane, trade around empowered Q, and avoid spending W unless it denies a major threat.",
  },
  punishWindows: [
    "If Vladimir uses W, punish the long cooldown before it returns.",
    "Before item spikes, his wave control and burst are limited.",
    "When empowered Q is not ready, his short trade threat is lower.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
