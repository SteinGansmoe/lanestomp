import type { LeagueChampionKnowledgeProfile } from "./types";

export const sylasCombatProfile = {
    profileQuality: "draft",
    abilities: {
      Q: "Chain Lash",
      W: "Kingslayer",
      E: "Abscond / Abduct",
      R: "Hijack",
    },
    archetype: ["skirmisher", "bruiser mage", "assassin"],
    primaryWinCondition: ["Use (E) to engage or threaten, then look for extended trades with (W) and stolen ultimates."],
    dangerAbilities: ["(E) knockup/stun on hit"],
    dangerProfile: {
      dangerousWhen: ["(E) knockup/stun on hit"],
      mustRespect: [
            "(W) is his main combat heal.",
            "(R) depends on available enemy ultimates.",
            "(E) is his main engage and escape pattern.",
          ],
    },
    commonWeaknesses: [
      "Can be punished when (W) or (E) is down.",
      "Melee range makes early lane risky into poke.",
      "Ultimate value depends on enemy ultimates.",
    ],
    damageType: "magic",
    hardCrowdControl: ["(E) knockup/stun on hit"],
    id: "Sylas",
    importantAbilityNotes: [
      "(W) is his main combat heal.",
      "(R) depends on available enemy ultimates.",
      "(E) is his main engage and escape pattern.",
    ],
    lanePlan: {
      avoids: [
            "Can be punished when (W) or (E) is down.",
            "Melee range makes early lane risky into poke.",
            "Ultimate value depends on enemy ultimates.",
          ],
      idealLaneState: "Melee AP skirmisher who looks for extended trades and strong stolen ultimate windows.",
      wants: ["Use (E) to engage or threaten, then look for extended trades with (W) and stolen ultimates."],
    },
    laneIdentity:
      {
      earlyGameAgency: "high",
      scalingPriority: "medium",
      lanePressure: "high",
      preferredGameState: ["Use (E) to engage or threaten, then look for extended trades with (W) and stolen ultimates."],
      winLaneBy: ["Use (E) to engage or threaten, then look for extended trades with (W) and stolen ultimates."],
    },
    majorPowerSpikes: [
      "Level 3 unlocks (Q)-(W)-(E) skirmish pattern with dash, chain, and sustain access.",
      "Level 6 (R) if valuable ultimates are available.",
      "First completed AP skirmish item.",
    ],
    matchupPreferences: {
      strongInto: [],
      weakInto: [],
    },
    mobilityLevel: "high",
    name: "Sylas",
    offMetaRoles: ["top", "jungle"],
    strategicIdentity: {
      laneGoal: "snowball",
      scalingProfile: "mid",
      preferredGameLength: "medium",
      winMethod: ["skirmish healing", "ultimate theft", "all-in pressure"],
    },
    powerSpikes: {
      major: [
        {
          timing: "Level 3",
          reason: "Level 3 unlocks (Q)-(W)-(E) skirmish pattern with dash, chain, and sustain access",
          changesGameplay: "The early ability combination gives Sylas a real trade or all-in pattern instead of isolated lane pressure.",
          playerAction: "Use the unlocked combo only when cooldowns, minions, and spacing make the trade hard to punish.",
          enemyResponse: "Respect the early combo unlock and avoid giving Sylas the wave or spacing needed to start it cleanly.",
        },
        {
          timing: "Level 6",
          reason: "Level 6 (R) if valuable ultimates are available",
          changesGameplay: "Sylas's ultimate becomes available, so the matchup shifts around whether the commit, pick, roam, or escape threat is ready.",
          playerAction: "Track (R) availability and use the window for verified all-ins, picks, roams, or defensive resets rather than forcing blind.",
          enemyResponse: "Respect (R) window, hold key defensive tools for the commit, and punish after (R) is spent.",
        },
        {
          timing: "First completed AP skirmish item",
          reason: "First completed AP skirmish item",
          changesGameplay: "Sylas's damage, wave control, or trade reliability improves enough that earlier neutral trades can become losing trades.",
          playerAction: "After the item, pressure waves and trades more confidently while still tracking the enemy's main answer.",
          enemyResponse: "Do not treat pre-item trades as still safe once Sylas's first item threshold is completed.",
        },
      ],
    },
    primaryRoles: ["mid"],
    secondaryRoles: [],
    primaryTradingPattern:
      "Use (E) to enter or threaten, trade with passive autos and (W), then disengage if cooldowns are down.",
    punishProfile: {
      canPunish: [],
      strugglesToPunish: [
            "Can be punished when (W) or (E) is down.",
            "Melee range makes early lane risky into poke.",
            "Ultimate value depends on enemy ultimates.",
          ],
    },
    shields: [],
    softCrowdControl: ["(Q) slow"],
    stealthOrInvisibility: null,
    sustain: ["(W) heal"],
    trading: {
      badTradeConditions: [
        "If Sylas uses (E) to engage and misses, he can be punished hard.",
        "An early healing cut item can significantly reduce his sustain in trades.",
        "Being shoved under turret is not ideal for Sylas as his waveclear is not the best and he can be punished by enemy laner."
      ],
      goodTradeConditions: [],
      primaryPattern: "Use (E) to enter or threaten, trade with passive autos and (W), then disengage if cooldowns are down.",
    },
    punishWindows: [
  "If Sylas uses (E) to engage and misses, he can be punished hard.",
  "An early healing cut item can significantly reduce his sustain in trades.",
  "Being shoved under turret is not ideal for Sylas as his waveclear is not the best and he can be punished by enemy laner."
]
  } satisfies LeagueChampionKnowledgeProfile;
