import type { LeagueChampionKnowledgeProfile } from "./types";

export const annieCombatProfile = {
    profileQuality: "draft",
    abilities: {
      Q: "Disintegrate",
      W: "Incinerate",
      E: "Molten Shield",
      R: "Summon: Tibbers",
    },
    archetype: ["mage", "pick", "roam", "burst"],
    primaryWinCondition: ["Find a pick with R and follow up with Q and W for burst."],
    dangerAbilities: ["R Tibbers stun and damage", "Passive Pyromania stun on 4th stack"],
    dangerProfile: {
      dangerousWhen: ["R Tibbers stun and damage", "Passive Pyromania stun on 4th stack"],
      mustRespect: [
            "Annie's main trading pattern is to proc her passive with Q and W for burst damage and stun.",
            "R Tibbers is her main pick tool, it can be used to engage or follow up on engages.",
            "Annie can be very oppressive in lane if she gets an early lead and can also roam effectively with her R.",
          ],
    },
    commonWeaknesses: [
      "Annie has not the best waveclear, if she is forced to push with W she will run out of mana quickly.",
      "Annie doesnt have the highest range, if she is poked out of lane she can struggle to farm and find picks.",
    ],
    damageType: "magic",
    hardCrowdControl: ["4th Passive stack stun"],
    id: "Annie",
    importantAbilityNotes: [
      "Annie's main trading pattern is to proc her passive with Q and W for burst damage and stun.",
      "R Tibbers is her main pick tool, it can be used to engage or follow up on engages.",
      "Annie can be very oppressive in lane if she gets an early lead and can also roam effectively with her R.",
    ],
    lanePlan: {
      avoids: [
            "Annie has not the best waveclear, if she is forced to push with W she will run out of mana quickly.",
            "Annie doesnt have the highest range, if she is poked out of lane she can struggle to farm and find picks.",
          ],
      idealLaneState: "Annie is a mage who excels at burst damage and picking.",
      wants: ["Find a pick with R and follow up with Q and W for burst."],
    },
    laneIdentity:
      {
      earlyGameAgency: "low",
      scalingPriority: "high",
      lanePressure: "medium",
      preferredGameState: ["Find a pick with R and follow up with Q and W for burst."],
      winLaneBy: ["Find a pick with R and follow up with Q and W for burst."],
    },
    majorPowerSpikes: [
      "Level 6 is a huge power spike for Annie, as R Tibbers gives her a strong pick tool and significant burst damage.",
      "First completed AP item is also a significant power spike for Annie",
    ],
    matchupPreferences: {
      strongInto: [],
      weakInto: [],
    },
    mobilityLevel: "medium",
    name: "Annie",
    offMetaRoles: [],
    strategicIdentity: {
      laneGoal: "teamfight",
      scalingProfile: "mid",
      preferredGameLength: "medium",
      winMethod: ["flash engage", "burst picks", "teamfight initiation"],
    },
    powerSpikes: {
      major: [
        {
          timing: "Level 6",
          reason: "Level 6 is a huge power spike for Annie, as R Tibbers gives her a strong pick tool and significant burst damage",
          changesGameplay: "Annie's ultimate becomes available, so the matchup shifts around whether the commit, pick, roam, or escape threat is ready.",
          playerAction: "Track R availability and use the window for verified all-ins, picks, roams, or defensive resets rather than forcing blind.",
          enemyResponse: "Respect Annie's R window, hold key defensive tools for the commit, and punish after R is spent.",
        },
        {
          timing: "First completed AP item is also a significant power spike for Annie",
          reason: "First completed AP item is also a significant power spike for Annie",
          changesGameplay: "Annie's damage, wave control, or trade reliability improves enough that earlier neutral trades can become losing trades.",
          playerAction: "After the item, pressure waves and trades more confidently while still tracking the enemy's main answer.",
          enemyResponse: "Do not treat pre-item trades as still safe once Annie's first item threshold is completed.",
        },
      ],
    },
    primaryRoles: ["mid"],
    secondaryRoles: [],
    primaryTradingPattern:
      "Annie's main trading pattern is Q + W with 4th passive stack and finish with an auto attack to proc electrocute",
    punishProfile: {
      canPunish: [],
      strugglesToPunish: [
            "Annie has not the best waveclear, if she is forced to push with W she will run out of mana quickly.",
            "Annie doesnt have the highest range, if she is poked out of lane she can struggle to farm and find picks.",
          ],
    },
    shields: ["E Molten Shield"],
    softCrowdControl: [],
    stealthOrInvisibility: null,
    sustain: [""],
    trading: {
      badTradeConditions: [
            "If Annie is poked out of lane, she can struggle to farm and find picks.",
            "If Annie is forced to push with W, she can run out of mana quickly and become vulnerable to all-ins.",
      ],
      goodTradeConditions: [],
      primaryPattern: "Annie's main trading pattern is Q + W with 4th passive stack and finish with an auto attack to proc electrocute",
    },
    punishWindows: [
      "If Annie is poked out of lane, she can struggle to farm and find picks.",
      "If Annie is forced to push with W, she can run out of mana quickly and become vulnerable to all-ins.",
]
  } satisfies LeagueChampionKnowledgeProfile;
