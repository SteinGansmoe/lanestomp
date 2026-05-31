import type { LeagueChampionKnowledgeProfile } from "./types";

export const galioCombatProfile = {
  profileQuality: "draft",
  abilities: {
    Q: "Winds of War",
    W: "Shield of Durand",
    E: "Justice Punch",
    R: "Hero's Entrance",
  },
  archetype: ["anti-magic tank", "roam", "engage", "peel"],
  primaryWinCondition: [
    "Absorb magic pressure, control short trades with taunt and knock-up, then impact side fights with R.",
  ],
  dangerAbilities: ["W Shield of Durand taunt", "E Justice Punch knock-up", "R Hero's Entrance follow-up"],
  dangerProfile: {
    dangerousWhen: [
      "W and E are available for layered crowd control.",
      "A teammate can start a fight that Galio can join with R.",
      "He can shove the wave and move first to river.",
    ],
    mustRespect: [
      "W taunt punishes enemies who stand too close.",
      "E can start or interrupt short-range commits.",
      "R is a map tool and follow-up, not a solo lane damage spell.",
    ],
  },
  commonWeaknesses: [
    "Can be kited by long-range champions.",
    "Less threatening if W or E are missed.",
    "Wave and roam reliant; quiet scaling lanes can reduce his impact.",
  ],
  damageType: "magic",
  hardCrowdControl: ["W Shield of Durand taunt", "E Justice Punch knock-up", "R Hero's Entrance knock-up"],
  id: "Galio",
  importantAbilityNotes: [
    "W is his key defensive and engage threat.",
    "E gives engage and peel but can be dodged or baited.",
    "R lets him join allied fights and protect teammates.",
    "His passive helps short trades and wave control.",
  ],
  lanePlan: {
    avoids: [
      "Chasing long-range champions through poke.",
      "Spending E without a clear hit or escape plan.",
      "Staying in lane while R could affect a skirmish.",
    ],
    idealLaneState:
      "A pushed or neutral wave where Galio can threaten short CC trades and move first to river or side fights.",
    wants: [
      "Short-range enemies entering W and E threat.",
      "Skirmishes where R can turn the fight.",
      "Magic damage lanes where his defensive profile has value.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Mid waves that let him move first.",
      "River or side fights where his crowd control matters.",
      "Enemy magic damage threats he can absorb better than most mids.",
    ],
    scalingPriority: "medium",
    winLaneBy: [
      "Neutralizing magic poke and forcing short CC trades.",
      "Creating roam pressure after pushing.",
      "Using R to protect allies or punish overcommits.",
    ],
  },
  majorPowerSpikes: [
    "Level 3 full basic ability access.",
    "Level 6 Hero's Entrance.",
    "First durability or AP utility item.",
  ],
  matchupPreferences: {
    strongInto: [
      "Magic damage champions who must enter his CC range.",
      "Teams that want to skirmish around river.",
      "Allied engage compositions that use his R follow-up well.",
    ],
    weakInto: [
      "Long-range waveclear that denies his engage range.",
      "Physical damage lane bullies.",
      "Champions that can avoid W and E while scaling freely.",
    ],
  },
  mobilityLevel: "medium",
  name: "Galio",
  offMetaRoles: ["support"],
  powerSpikes: {
    major: [
      "Level 3 full basic ability access.",
      "Level 6 Hero's Entrance.",
      "First durability or AP utility item.",
    ],
    notes: [
      "Level 6 increases his map impact more than his solo kill threat.",
      "Early durability makes his short trade and roam pattern safer.",
    ],
  },
  primaryRoles: ["mid"],
  secondaryRoles: ["support"],
  primaryTradingPattern:
    "Use Q and passive for short wave trades, hold W and E to punish enemies who step too close, then move to fights with R.",
  punishProfile: {
    canPunish: [
      "Enemies stepping into W taunt range.",
      "Predictable dashes or commits that E can interrupt.",
      "Side fights where he can arrive with R.",
    ],
    strugglesToPunish: [
      "Long-range champions who clear safely.",
      "Enemies who refuse short-range trades and track his roam timers.",
    ],
  },
  shields: ["Passive magic shield", "R Hero's Entrance ally shield on arrival"],
  softCrowdControl: [],
  stealthOrInvisibility: null,
  sustain: [],
  trading: {
    badTradeConditions: [
      "W and E are unavailable.",
      "The enemy can kite outside taunt range.",
      "A physical damage bully can punish him before he reaches the wave.",
    ],
    goodTradeConditions: [
      "The enemy walks into W or E range.",
      "Galio can trade briefly with passive and disengage.",
      "A roam or R timer is available after shoving.",
    ],
    primaryPattern:
      "Take short trades around Q, passive, W, and E, then use wave pressure to look for map impact.",
  },
  punishWindows: [
    "If Galio misses E, he loses a major engage and peel tool.",
    "If W is down, short-range enemies can trade more freely.",
    "If R is unavailable, his map threat drops sharply.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
