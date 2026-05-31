import type { LeagueChampionKnowledgeProfile } from "./types";

export const twistedFateCombatProfile = {
  profileQuality: "draft",
  abilities: {
    Q: "Wild Cards",
    W: "Pick a Card",
    E: "Stacked Deck",
    R: "Destiny",
  },
  archetype: ["roam", "utility mage", "pick", "wave control"],
  primaryWinCondition: [
    "Control the wave, threaten Gold Card picks, and use R to create side-lane numbers advantage.",
  ],
  dangerAbilities: ["W Pick a Card Gold Card stun", "R Destiny reveal and teleport"],
  dangerProfile: {
    dangerousWhen: [
      "Gold Card is selected and he has follow-up nearby.",
      "R is available and side lanes are overextended.",
      "He has wave priority and can leave lane first.",
    ],
    mustRespect: [
      "Gold Card is point-and-click setup when he is in range.",
      "R gives global pressure and reveals enemies.",
      "His solo burst is lower than pure assassins, but his setup is reliable.",
    ],
  },
  commonWeaknesses: [
    "Limited mobility and vulnerable to all-ins.",
    "Needs wave control to roam safely.",
    "Lower direct duel power than many mid champions.",
  ],
  damageType: "magic",
  hardCrowdControl: ["W Pick a Card Gold Card stun"],
  id: "TwistedFate",
  importantAbilityNotes: [
    "Q is long-range poke and waveclear.",
    "W card choice defines his trade or setup.",
    "E adds periodic empowered auto damage.",
    "R is a map pressure and pick tool, not a lane damage spell.",
  ],
  lanePlan: {
    avoids: [
      "Standing in all-in range without Gold Card ready.",
      "Roaming while losing too much mid wave.",
      "Taking extended duels against stronger combat mids.",
    ],
    idealLaneState:
      "A controlled lane where Twisted Fate can clear waves, hold Gold Card threat, and move first with R or river pressure.",
    wants: [
      "Wave priority before R or roam timings.",
      "Enemies stepping into Gold Card range.",
      "Side lanes that can be punished by Destiny.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Map states where side lanes can be punished.",
      "Controlled waves that let him leave lane.",
      "Pick setups where Gold Card starts the play.",
    ],
    scalingPriority: "medium",
    winLaneBy: [
      "Creating map pressure rather than forcing solo kills.",
      "Using Gold Card to punish oversteps.",
      "Turning level 6 into numbers advantage.",
    ],
  },
  majorPowerSpikes: [
    "Level 6 Destiny.",
    "First completed AP or utility item.",
  ],
  matchupPreferences: {
    strongInto: [
      "Immobile targets vulnerable to point-and-click stun.",
      "Games where side lanes are punishable.",
      "Compositions that benefit from reliable pick setup.",
    ],
    weakInto: [
      "Assassins who can punish his low mobility.",
      "Champions that shove faster and deny roams.",
      "Long-range poke that prevents safe card range.",
    ],
  },
  mobilityLevel: "medium",
  name: "Twisted Fate",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      "Level 6 Destiny.",
      "First completed AP or utility item.",
    ],
    notes: [
      "Level 6 is his largest map pressure spike.",
      "Gold Card threat is reliable but requires him to be in range.",
    ],
  },
  primaryRoles: ["mid"],
  secondaryRoles: [],
  primaryTradingPattern:
    "Use Q and autos for wave control, hold Gold Card to discourage commits, and turn priority into R plays.",
  punishProfile: {
    canPunish: [
      "Enemies entering Gold Card range.",
      "Overextended side lanes after level 6.",
      "Targets without cleanse or mobility when allies can follow.",
    ],
    strugglesToPunish: [
      "Hard all-in champions before he can select Gold Card.",
      "Lanes that deny wave priority and roam timers.",
    ],
  },
  shields: [],
  softCrowdControl: ["W Pick a Card Red Card slow"],
  stealthOrInvisibility: null,
  sustain: [],
  trading: {
    badTradeConditions: [
      "Gold Card is not ready against all-in threat.",
      "He is taking extended duels with stronger fighters or assassins.",
      "Roaming would sacrifice too much wave tempo.",
    ],
    goodTradeConditions: [
      "Gold Card is selected and follow-up is available.",
      "The wave is pushed before R or roam timing.",
      "The enemy has no way to punish his card range.",
    ],
    primaryPattern:
      "Control wave, threaten Gold Card for short trades or setup, and prioritize map plays over risky solo duels.",
  },
  punishWindows: [
    "If Twisted Fate uses W poorly, he loses his main safety and pick tool.",
    "If R is down, side lanes can play with less map pressure.",
    "All-in champions can punish him when Gold Card is unavailable.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
