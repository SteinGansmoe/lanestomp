import type { LeagueChampionKnowledgeProfile } from "./types";

export const qiyanaCombatProfile = {
  profileQuality: "draft",
  abilities: {
    Q: "Elemental Wrath / Edge of Ixtal",
    W: "Terrashape",
    E: "Audacity",
    R: "Supreme Display of Talent",
  },
  archetype: ["assassin", "terrain", "burst", "roam"],
  primaryWinCondition: [
    "Use element swaps and terrain threat to create burst trades, then snowball river and flank fights with R.",
  ],
  dangerAbilities: ["R Supreme Display of Talent terrain stun", "Q element effects", "E Audacity dash"],
  dangerProfile: {
    dangerousWhen: [
      "She has the correct element for the trade.",
      "Enemies fight near walls, river, or brush for R impact.",
      "The target has already used mobility or defensive cooldowns.",
    ],
    mustRespect: [
      "Element choice changes Q function and threat.",
      "R is strongest around terrain and in river fights.",
      "She is much less threatening if she cannot access useful elements.",
    ],
  },
  commonWeaknesses: [
    "Reliant on element management and terrain.",
    "Can be punished before she has clean all-in setup.",
    "Struggles if she falls behind and cannot threaten burst.",
  ],
  damageType: "physical",
  hardCrowdControl: ["R Supreme Display of Talent stun"],
  id: "Qiyana",
  importantAbilityNotes: [
    "Q changes based on the element prepared by W.",
    "W repositions and prepares an element.",
    "E is a targeted dash used to close distance.",
    "R can stun and burst enemies near terrain or river.",
  ],
  lanePlan: {
    avoids: [
      "Trading with the wrong element for the situation.",
      "Committing E without lethal threat or escape path.",
      "Fighting away from terrain when R is the main threat.",
    ],
    idealLaneState:
      "A lane where Qiyana can preserve health, manage elements, and threaten short burst trades before moving to river fights.",
    wants: [
      "Brush, river, or wall access for element and R value.",
      "Enemy cooldowns spent before E commit.",
      "Roam or river skirmish windows after wave control.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Skirmishes near river or terrain.",
      "Short burst trades after element setup.",
      "Fog and flank angles where R is harder to respect.",
    ],
    scalingPriority: "medium",
    winLaneBy: [
      "Using element advantage for short trades.",
      "Punishing cooldowns with E into burst.",
      "Turning river fights with terrain-based R.",
    ],
  },
  majorPowerSpikes: [
    "Level 3 full basic ability access.",
    "Level 6 Supreme Display of Talent.",
    "First completed lethality item.",
  ],
  matchupPreferences: {
    strongInto: [
      "Squishy champions who can be burst after one mistake.",
      "River skirmish-heavy games.",
      "Enemies that must stand near walls or brush.",
    ],
    weakInto: [
      "Champions who can deny her early health and wave control.",
      "Durable targets that survive her burst.",
      "Long-range champions who avoid her E range.",
    ],
  },
  mobilityLevel: "high",
  name: "Qiyana",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      "Level 3 full basic ability access.",
      "Level 6 Supreme Display of Talent.",
      "First completed lethality item.",
    ],
    notes: [
      "Level 6 makes terrain positioning extremely important.",
      "Lethality spikes determine whether her burst is lethal or only poke.",
    ],
  },
  primaryRoles: ["mid"],
  secondaryRoles: [],
  primaryTradingPattern:
    "Prepare the right element with W, use Q for poke or setup, and commit E only when the target can be bursted or R terrain is available.",
  punishProfile: {
    canPunish: [
      "Targets near walls, river, or brush during R windows.",
      "Enemies who spend mobility before her E.",
      "Squishy champions after she has element setup.",
    ],
    strugglesToPunish: [
      "Champions who stay outside E range.",
      "Durable targets that survive her burst and return damage.",
    ],
  },
  shields: [],
  softCrowdControl: ["Q water element root", "Q earth element execute pressure"],
  stealthOrInvisibility: "Q brush element creates a stealth trail.",
  sustain: [],
  trading: {
    badTradeConditions: [
      "Wrong element is prepared.",
      "The fight is away from useful terrain.",
      "E commit does not threaten lethal or a safe exit.",
    ],
    goodTradeConditions: [
      "The target is near terrain for R.",
      "Enemy mobility or peel is down.",
      "Qiyana has the element that fits the trade.",
    ],
    primaryPattern:
      "Set element first, take short burst trades, and save full commits for terrain or cooldown advantages.",
  },
  punishWindows: [
    "If Qiyana uses E without lethal pressure, she can be traded back hard.",
    "If R is down or the fight is away from terrain, her all-in is less reliable.",
    "Poor element choice makes her trade easier to answer.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
