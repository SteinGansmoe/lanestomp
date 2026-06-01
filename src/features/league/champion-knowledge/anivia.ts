import type { LeagueChampionKnowledgeProfile } from "./types";

export const aniviaCombatProfile = {
    profileQuality: "draft",
    abilities: {
      Q: "Flash Frost",
      W: "Crystallize",
      E: "Frostbite",
      R: "Glacial Storm",
    },
    archetype: ["mage", "zoner", "control", "waveclear"],
    primaryWinCondition: ["Farm up and use her strong waveclear and zoning to control the lane and look for picks."],
    dangerAbilities: ["(Q) stun", "(R) slow and damage"],
    dangerProfile: {
      dangerousWhen: ["(Q) stun", "(R) slow and damage"],
      mustRespect: [
            "(Q) is best used together with other abilities as its not always easy to land",
            "(W) can be used to block movement and force the enemy to move into (Q) if placed properly",
            "(E) is her main single target damage spell, use it after target is hit by (Q) for max damage",
            "(R) is her main zoning and teamfight tool, it can be used to block off areas and force enemies into unfavorable positions",
          ],
    },
    commonWeaknesses: [
      "Anivia is very slow, if she is caught she can die easily.",
      "She has a hard time escaping if her flash is down.",
      "She can be punished by fast all-ins.",
    ],
    damageType: "magic",
    hardCrowdControl: ["(Q) stun"],
    id: "Anivia",
    importantAbilityNotes: [
      "(Q) is best used together with other abilities as its not always easy to land",
      "(W) can be used to block movement and force the enemy to move into (Q) if placed properly",
      "(E) is her main single target damage spell, use it after target is hit by (Q) for max damage",
      "(R) is her main zoning and teamfight tool, it can be used to block off areas and force enemies into unfavorable positions",
    ],
    lanePlan: {
      avoids: [
            "Anivia is very slow, if she is caught she can die easily.",
            "She has a hard time escaping if her flash is down.",
            "She can be punished by fast all-ins.",
          ],
      idealLaneState: "Anivia is a mage who excels at waveclear and zoning.",
      wants: ["Farm up and use her strong waveclear and zoning to control the lane and look for picks."],
    },
    laneIdentity:
      {
      earlyGameAgency: "low",
      scalingPriority: "high",
      lanePressure: "medium",
      preferredGameState: ["Farm up and use her strong waveclear and zoning to control the lane and look for picks."],
      winLaneBy: ["Farm up and use her strong waveclear and zoning to control the lane and look for picks."],
    },
    majorPowerSpikes: [
      "After 6 and Lost chapter, Anivia can basically free farm waves mid.",
      "Its hard to siege into Anivia after 6 because of her (R), so she can often get picks or force fights on her terms.",
    ],
    matchupPreferences: {
      strongInto: [
        "Short-range champions that must walk into her zone control",
        "Champions that struggle to escape terrain manipulation",
        "Champions that does not have any form of gap closer or mobility"
      ],
      weakInto: [
    "Highly mobile champions that can bypass terrain.",
    "Champions that can repeatedly force all-ins before she establishes zone control.",
    "Champions that can dodge or ignore her skillshots."
  ],
    },
    mobilityLevel: "low",
    name: "Anivia",
    offMetaRoles: ["top"],
    strategicIdentity: {
      laneGoal: "control",
      scalingProfile: "late",
      preferredGameLength: "long",
      winMethod: ["wave control", "zone denial", "scaling teamfights"],
    },
    powerSpikes: {
      major: [
        {
          timing: "First mana/AP item",
          reason: "After 6 and first mana/AP item, Anivia can basically free farm waves mid",
          changesGameplay: "Anivia's damage, wave control, or trade reliability improves enough that earlier neutral trades can become losing trades.",
          playerAction: "After the item, pressure waves and trades more confidently while still tracking the enemy's main answer.",
          enemyResponse: "Do not treat pre-item trades as still safe once Anivia's first item threshold is completed.",
        },
        {
          timing: "It is hard to siege into Anivia after 6 because of her (R), so she can often get picks or force fights on her terms",
          reason: "It is hard to siege into Anivia after 6 because of her (R), so she can often get picks or force fights on her terms",
          changesGameplay: "This timing changes how safely Anivia can contest trades, waves, or river space.",
          playerAction: "Change trading pace only when this timing is active and the enemy has no clean punish window.",
          enemyResponse: "Respect the timing until Anivia's key cooldowns or resources are spent.",
        },
      ],
    },
    primaryRoles: ["mid"],
    secondaryRoles: ["adc", "support"],
    primaryTradingPattern:
      "(Q) is her main trading and pick tool, (E) is her main damage tool, and (R) is her main zoning and teamfight tool.",
    punishProfile: {
      canPunish: [],
      strugglesToPunish: [
            "Anivia is very slow, if she is caught she can die easily.",
            "She has a hard time escaping if her flash is down.",
            "She can be punished by fast all-ins.",
          ],
    },
    shields: [],
    softCrowdControl: ["slow from (R)"],
    stealthOrInvisibility: null,
    sustain: [""],
    trading: {
      badTradeConditions: [
            "If Anivia misses (Q), thats when to punish her.",
      
      ],
      goodTradeConditions: [],
      primaryPattern: "(Q) is her main trading and pick tool, (E) is her main damage tool, and (R) is her main zoning and teamfight tool.",
    },
    punishWindows: [
      "If Anivia misses (Q), thats when to punish her.",

]
  } satisfies LeagueChampionKnowledgeProfile;
