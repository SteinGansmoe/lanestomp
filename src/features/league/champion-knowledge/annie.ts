import type { LeagueChampionKnowledgeProfile } from "./types";

export const annieCombatProfile = {
    archetype: ["mage", "pick", "roam", "burst"],
    primaryWinCondition: ["Find a pick with R and follow up with Q and W for burst."],
    dangerAbilities: ["R Tibbers stun and damage", "Passive Pyromania stun on 4th stack"],
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
    laneIdentity:
      "Annie is a mage who excels at burst damage and picking.",
    majorPowerSpikes: [
      "Level 6 is a huge power spike for Annie, as R Tibbers gives her a strong pick tool and significant burst damage.",
      "First completed AP item is also a significant power spike for Annie",
    ],
    mobilityLevel: "medium",
    name: "Annie",
    offMetaRoles: [],
    primaryRoles: ["mid"],
    secondaryRoles: [],
    primaryTradingPattern:
      "Annie's main trading pattern is Q + W with 4th passive stack and finish with an auto attack to proc electrocute",
    shields: ["E Molten Shield"],
    softCrowdControl: [],
    stealthOrInvisibility: null,
    sustain: [""],
    punishWindows: [
      "If Annie is poked out of lane, she can struggle to farm and find picks.",
      "If Annie is forced to push with W, she can run out of mana quickly and become vulnerable to all-ins.",
]
  } satisfies LeagueChampionKnowledgeProfile;
