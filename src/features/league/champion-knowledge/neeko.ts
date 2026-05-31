import type { LeagueChampionKnowledgeProfile } from "./types";

export const neekoCombatProfile = {
  profileQuality: "draft",
  abilities: {
    Q: "Blooming Burst",
    W: "Shapesplitter",
    E: "Tangle-Barbs",
    R: "Pop Blossom",
  },
  archetype: ["mage", "pick", "disguise", "teamfight"],
  primaryWinCondition: [
    "Use disguise, root setup, and ultimate threat to create picks or multi-target teamfight control.",
  ],
  dangerAbilities: ["E Tangle-Barbs root", "R Pop Blossom knock-up and burst", "Passive Inherent Glamour disguise"],
  dangerProfile: {
    dangerousWhen: [
      "E can pass through units and root for longer.",
      "Her disguise hides engage positioning.",
      "R is available for multi-target burst and crowd control.",
    ],
    mustRespect: [
      "E through minions is more threatening than a raw E.",
      "W and passive can hide her real position.",
      "R threat changes how close enemies can stand to her.",
    ],
  },
  commonWeaknesses: [
    "Shorter range than artillery mages.",
    "Punishable if E misses.",
    "Engage patterns become weaker when disguise is tracked.",
  ],
  damageType: "magic",
  hardCrowdControl: ["E Tangle-Barbs root", "R Pop Blossom knock-up"],
  id: "Neeko",
  importantAbilityNotes: [
    "Q is her main poke and wave damage.",
    "E roots and becomes stronger after passing through units.",
    "W creates a clone and helps misdirection.",
    "R is a major teamfight and all-in tool.",
  ],
  lanePlan: {
    avoids: [
      "Throwing E without minion or positioning advantage.",
      "Forcing R when enemies can easily disengage.",
      "Taking extended trades after her burst cooldowns are spent.",
    ],
    idealLaneState:
      "A lane where Neeko can use minion lines for E angles, poke with Q, and threaten disguised all-ins after level 6.",
    wants: [
      "E angles through minions.",
      "Enemy attention split by W or passive disguise.",
      "Grouped enemies for R impact.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "high",
    preferredGameState: [
      "Lane states with minions that empower E.",
      "Fog or disguise angles for picks.",
      "Teamfights where R can hit multiple targets.",
    ],
    scalingPriority: "medium",
    winLaneBy: [
      "Landing E into Q trades.",
      "Using disguise to create uncertainty.",
      "Turning level 6 threat into picks or forced spacing.",
    ],
  },
  majorPowerSpikes: [
    "Level 6 Pop Blossom.",
    "First completed AP burst item.",
  ],
  matchupPreferences: {
    strongInto: [
      "Champions who must farm behind minion lines.",
      "Immobile targets vulnerable to root into burst.",
      "Teams that group tightly into R threat.",
    ],
    weakInto: [
      "Long-range mages who avoid E range.",
      "Champions who can disengage from R.",
      "Enemies that track disguise and clone patterns well.",
    ],
  },
  mobilityLevel: "medium",
  name: "Neeko",
  offMetaRoles: ["support"],
  powerSpikes: {
    major: [
      "Level 6 Pop Blossom.",
      "First completed AP burst item.",
    ],
    notes: [
      "Level 6 creates strong all-in and teamfight threat.",
      "Her best moments often come from fog, disguise, or minion-enhanced E.",
    ],
  },
  primaryRoles: ["mid"],
  secondaryRoles: ["support"],
  primaryTradingPattern:
    "Look for E through minions, follow with Q burst, and use W or passive to disguise all-in timing.",
  punishProfile: {
    canPunish: [
      "Enemies standing behind minions when E can pass through.",
      "Immobile targets after E connects.",
      "Grouped enemies during R windows.",
    ],
    strugglesToPunish: [
      "Long-range champions outside E and R threat.",
      "Enemies who hold disengage for her ultimate.",
    ],
  },
  shields: ["R Pop Blossom shield during cast"],
  softCrowdControl: [],
  stealthOrInvisibility: "Passive Inherent Glamour disguise and W Shapesplitter clone misdirection.",
  sustain: [],
  trading: {
    badTradeConditions: [
      "E misses.",
      "The enemy can disengage from R.",
      "Her disguise or W clone has already been identified.",
    ],
    goodTradeConditions: [
      "E can pass through minions.",
      "The enemy is close enough for Q follow-up.",
      "R can be hidden or layered with crowd control.",
    ],
    primaryPattern:
      "Fish for empowered E angles, burst with Q, and preserve R threat for picks or grouped fights.",
  },
  punishWindows: [
    "If Neeko misses E, she is much easier to trade into.",
    "If R is down, her all-in threat drops significantly.",
    "When disguise is tracked, her engage is easier to respect.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
