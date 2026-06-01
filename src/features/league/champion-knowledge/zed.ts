import type { LeagueChampionKnowledgeProfile } from "./types";

export const zedCombatProfile = {
    profileQuality: "draft",
    abilities: {
      Q: "Razor Shuriken",
      W: "Living Shadow",
      E: "Shadow Slash",
      R: "Death Mark",
    },
    archetype: ["skirmisher", "assassin", "melee carry", "burst"],
    primaryWinCondition: ["Take down enemy carries with his high burst and mobility."],
    dangerAbilities: ["W + E + Q combo, R Death Mark"],
    dangerProfile: {
      dangerousWhen: ["W + E + Q combo, R Death Mark"],
      mustRespect: [
            "Dodging Q is key to trading with Zed.",
            "R is his main all-in tool, it can be used to dodge key abilities or finish off targets.",
            "W + E is almost impossible to dodge, stay focused on dodging Q",
          ],
    },
    commonWeaknesses: [
      "Very weak from level 1-3, can be bullied by strong early laners.",
      "Falls off if he can't get on carries in fights.",
      "Hard to damage more then one target in fights due to his single-target focus.",
    ],
    damageType: "physical",
    hardCrowdControl: [],
    id: "Zed",
    importantAbilityNotes: [
      "Dodging Q is key to trading with Zed.",
      "R is his main all-in tool, it can be used to dodge key abilities or finish off targets.",
      "W + E is almost impossible to dodge, stay focused on dodging Q",
    ],
    lanePlan: {
      avoids: [
            "Very weak from level 1-3, can be bullied by strong early laners.",
            "Falls off if he can't get on carries in fights.",
            "Hard to damage more then one target in fights due to his single-target focus.",
          ],
      idealLaneState: "Pick-focused AD assassin who looks to burst carries and dodge key abilities.",
      wants: ["Take down enemy carries with his high burst and mobility."],
    },
    laneIdentity:
      {
      earlyGameAgency: "high",
      scalingPriority: "medium",
      lanePressure: "high",
      preferredGameState: ["Take down enemy carries with his high burst and mobility."],
      winLaneBy: ["Take down enemy carries with his high burst and mobility."],
    },
    majorPowerSpikes: [
      "Level 3 unlocks W-E-Q shadow combo for real poke and all-in setup.",
      "Level 6 Death Mark.",
      "First completed lethality item.",
    ],
    matchupPreferences: {
      strongInto: [],
      weakInto: [],
    },
    mobilityLevel: "high",
    name: "Zed",
    offMetaRoles: [],
    strategicIdentity: {
      laneGoal: "snowball",
      scalingProfile: "early",
      preferredGameLength: "short",
      winMethod: ["burst all-ins", "side-lane picks", "roam pressure"],
    },
    powerSpikes: {
      major: [
        {
          timing: "Level 3",
          reason: "Level 3 unlocks W-E-Q shadow combo for real poke and all-in setup",
          changesGameplay: "The early ability combination gives Zed a real trade or all-in pattern instead of isolated lane pressure.",
          playerAction: "Use the unlocked combo only when cooldowns, minions, and spacing make the trade hard to punish.",
          enemyResponse: "Respect the early combo unlock and avoid giving Zed the wave or spacing needed to start it cleanly.",
        },
        {
          timing: "Level 6",
          reason: "Level 6 Death Mark",
          changesGameplay: "Zed's ultimate becomes available, so the matchup shifts around whether the commit, pick, roam, or escape threat is ready.",
          playerAction: "Track R availability and use the window for verified all-ins, picks, roams, or defensive resets rather than forcing blind.",
          enemyResponse: "Respect Zed's R window, hold key defensive tools for the commit, and punish after R is spent.",
        },
        {
          timing: "First completed lethality item",
          reason: "First completed lethality item",
          changesGameplay: "Zed's damage, wave control, or trade reliability improves enough that earlier neutral trades can become losing trades.",
          playerAction: "After the item, pressure waves and trades more confidently while still tracking the enemy's main answer.",
          enemyResponse: "Do not treat pre-item trades as still safe once Zed's first item threshold is completed.",
        },
      ],
    },
    primaryRoles: ["mid"],
    secondaryRoles: ["jungle"],
    primaryTradingPattern:
      "W + E for guaranteed damage, use Q to poke and finish, then R for all-in.",
    punishProfile: {
      canPunish: [],
      strugglesToPunish: [
            "Very weak from level 1-3, can be bullied by strong early laners.",
            "Falls off if he can't get on carries in fights.",
            "Hard to damage more then one target in fights due to his single-target focus.",
          ],
    },
    shields: [],
    softCrowdControl: ["E Living Shadow slow"],
    stealthOrInvisibility: null,
    sustain: [""],
    trading: {
      badTradeConditions: [
            "Before level 3, Zed is very vulnerable to pressure and can be bullied out of lane.",
            "If Zed uses W to engage and misses combo, he can be punished hard.",
      ],
      goodTradeConditions: [],
      primaryPattern: "W + E for guaranteed damage, use Q to poke and finish, then R for all-in.",
    },
    punishWindows: [
      "Before level 3, Zed is very vulnerable to pressure and can be bullied out of lane.",
      "If Zed uses W to engage and misses combo, he can be punished hard.",
]
  } satisfies LeagueChampionKnowledgeProfile;
