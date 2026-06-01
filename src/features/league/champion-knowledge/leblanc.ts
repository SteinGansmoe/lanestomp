import type { LeagueChampionKnowledgeProfile } from "./types";

export const leblancCombatProfile = {
    profileQuality: "draft",
    abilities: {
      Q: "Sigil of Malice",
      W: "Distortion",
      E: "Ethereal Chains",
      R: "Mimic",
    },
    archetype: ["assassin", "poke", "mobility", "burst"],
    primaryWinCondition: ["Can be very hard to deal with in lane for other champions."],
    dangerAbilities: [],
    dangerProfile: {
      dangerousWhen: [],
      mustRespect: [
            "(W) is both her main damage pattern and mobility.",
            "(E) root is delayed and can be broken by distance.",
            "(R) repeats a basic ability after level 6.",
          ],
    },
    commonWeaknesses: [
      "Has low waveclear, if enemy pushes her she ends up farming under tower.",
      "Can be punished if her return pad is controlled.",
      "Needs clean ability chains to convert pressure.",
    ],
    damageType: "magic",
    hardCrowdControl: ["(E) root after tether completes"],
    id: "Leblanc",
    importantAbilityNotes: [
      "(W) is both her main damage pattern and mobility.",
      "(E) root is delayed and can be broken by distance.",
      "(R) repeats a basic ability after level 6.",
    ],
    lanePlan: {
      avoids: [
            "Has low waveclear, if enemy pushes her she ends up farming under tower.",
            "Can be punished if her return pad is controlled.",
            "Needs clean ability chains to convert pressure.",
          ],
      idealLaneState: "Mobile AP assassin who pressures with burst trades and punishes poor spacing.",
      wants: ["Can be very hard to deal with in lane for other champions."],
    },
    laneIdentity:
      {
      earlyGameAgency: "low",
      scalingPriority: "high",
      lanePressure: "medium",
      preferredGameState: ["Can be very hard to deal with in lane for other champions."],
      winLaneBy: ["Can be very hard to deal with in lane for other champions."],
    },
    majorPowerSpikes: [
      "Level 2 burst with (Q) plus (W) or (E).",
      "Level 6 (R).",
      "First completed AP burst item.",
    ],
    matchupPreferences: {
      strongInto: [],
      weakInto: [],
    },
    mobilityLevel: "very_high",
    name: "LeBlanc",
    offMetaRoles: [],
    strategicIdentity: {
      laneGoal: "snowball",
      scalingProfile: "early",
      preferredGameLength: "short",
      winMethod: ["lane picks", "roam pressure", "burst trades"],
    },
    powerSpikes: {
      major: [
        {
          timing: "Level 2",
          reason: "Level 2 burst with (Q) plus (W) or (E)",
          changesGameplay: "The early ability combination gives LeBlanc a real trade or all-in pattern instead of isolated lane pressure.",
          playerAction: "Use the unlocked combo only when cooldowns, minions, and spacing make the trade hard to punish.",
          enemyResponse: "Respect the early combo unlock and avoid giving LeBlanc the wave or spacing needed to start it cleanly.",
        },
        {
          timing: "Level 6",
          reason: "Level 6 (R)",
          changesGameplay: "LeBlanc's ultimate becomes available, so the matchup shifts around whether the commit, pick, roam, or escape threat is ready.",
          playerAction: "Track (R) availability and use the window for verified all-ins, picks, roams, or defensive resets rather than forcing blind.",
          enemyResponse: "Respect (R) window, hold key defensive tools for the commit, and punish after (R) is spent.",
        },
        {
          timing: "First completed AP burst item",
          reason: "First completed AP burst item",
          changesGameplay: "LeBlanc's damage, wave control, or trade reliability improves enough that earlier neutral trades can become losing trades.",
          playerAction: "After the item, pressure waves and trades more confidently while still tracking the enemy's main answer.",
          enemyResponse: "Do not treat pre-item trades as still safe once LeBlanc's first item threshold is completed.",
        },
      ],
    },
    primaryRoles: ["mid"],
    secondaryRoles: [],
    primaryTradingPattern:
      "Use (W) for burst and repositioning, then threaten (E) Chains if the opponent cannot answer.",
    punishProfile: {
      canPunish: [],
      strugglesToPunish: [
            "Has low waveclear, if enemy pushes her she ends up farming under tower.",
            "Can be punished if her return pad is controlled.",
            "Needs clean ability chains to convert pressure.",
          ],
    },
    shields: [],
    softCrowdControl: [],
    stealthOrInvisibility: "Passive Mirror Image briefly makes her harder to identify at low health.",
    sustain: [],
    trading: {
      badTradeConditions: [
        "If LeBlanc uses (W) to engage and misses, she can be punished hard.",
        "Leblanc has very low waveclear, she can be pushed under tower and can easily be poked down, forcing her out of lane or into unfavorable trades if she tries to contest the push."
      ],
      goodTradeConditions: [],
      primaryPattern: "Use (W) for burst and repositioning, then threaten (E) Chains if the opponent cannot answer.",
    },
    punishWindows: [
  "If LeBlanc uses (W) to engage and misses, she can be punished hard.",
  "Leblanc has very low waveclear, she can be pushed under tower and can easily be poked down, forcing her out of lane or into unfavorable trades if she tries to contest the push."
]
  } satisfies LeagueChampionKnowledgeProfile;
