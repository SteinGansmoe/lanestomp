import type { LeagueChampionKnowledgeProfile } from "./types";

export const zeriCombatProfile = {
  profileQuality: "reviewed",
  masteryDifficulty: "high",
  abilities: {
    Q: "Burst Fire",
    W: "Ultrashock Laser",
    E: "Spark Surge",
    R: "Lightning Crash",
  },
  archetype: ["marksman", "mobility", "scaling", "kite carry"],
  primaryWinCondition: [
    "Farm safely and use wall mobility to reach item spikes, then kite extended fights with (R) movement and repeated (Q) damage.",
  ],
  dangerAbilities: ["(E) wall dash", "(R) extended fight", "(W) wall laser"],
  dangerProfile: {
    dangerousWhen: [
      "She has terrain for (E) escape or chase.",
      "(R) is active and the fight lasts long enough for her movement and DPS to stack.",
      "(W) can fire through walls before objectives or lane trades.",
      "She reaches item spikes where extended kiting becomes reliable.",
    ],
    mustRespect: [
      "Her mobility is heavily terrain dependent; wall access changes punish windows.",
      "(R) rewards long fights, so short burst and disengage are better than chasing.",
      "(Q) being a skillshot-like auto means minion and champion positioning affect her trades.",
    ],
  },
  commonWeaknesses: [
    "Weak if forced before items.",
    "Struggles when (E) is down or terrain is not available.",
    "Can be punished by lockdown that stops her kiting.",
  ],
  damageType: "mixed",
  hardCrowdControl: [],
  id: "Zeri",
  importantAbilityNotes: [
    "(Q) is her main attack pattern and can be blocked or complicated by positioning.",
    "(W) becomes much stronger through walls and can punish predictable CS or objective paths.",
    "(E) over walls is her defining escape and chase tool.",
    "(R) rewards extended fights where she can keep moving and firing.",
  ],
  lanePlan: {
    avoids: [
      "Trading heavily before item spikes.",
      "Using (E) forward without a wall escape or reset plan.",
      "Standing in lane positions where support CC can lock her before she kites.",
      "Taking short burst trades into lane bullies without scaling value.",
    ],
    idealLaneState:
      "A stable bot lane where Zeri farms toward items, keeps wall access for safety, and pokes with (W) angles when enemies walk predictable paths.",
    wants: [
      "Support peel or enchanter help while she scales.",
      "Terrain nearby for (E) safety.",
      "Enemy ADCs forced into narrow CS paths where (W) or (Q) can connect.",
      "Long fights after (R), not short burst trades before items.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "low",
    lanePressure: "medium",
    preferredGameState: [
      "Stable scaling lanes with wall escape routes.",
      "Extended fights where (R) and movement keep her safe.",
      "Objective setups with wall laser poke before the fight.",
    ],
    scalingPriority: "high",
    winLaneBy: [
      "Preserving health until item spikes.",
      "Using wall terrain to deny engage punishment.",
      "Punishing predictable CS or river movement with (W).",
      "Taking extended fights only when (R) can stay active.",
    ],
  },
  majorPowerSpikes: [
    "Level 6 (R)",
    "First completed marksman item",
    "Two-item extended fight spike",
  ],
  matchupPreferences: {
    strongInto: [
      "Slow fights where she can kite.",
      "Skillshot lanes she can outmaneuver near walls.",
      "Teams that struggle to lock her down after (R).",
    ],
    weakInto: [
      "Point-and-click lockdown.",
      "Early lane bullies before items.",
      "Wave states where she has no wall escape.",
    ],
  },
  counters: [
    {
      champion: "Ashe",
      reasons: [
        "Zeri can use mobility to avoid Ashe's slower all-in setup and kite around (R) threat.",
        "Once Zeri has movement speed from (R), Ashe struggles to keep her pinned down alone.",
        "Wall angles let Zeri escape lanes where Ashe wants repeated slow pressure.",
      ],
    },
  ],
  counteredBy: [
    {
      champion: "Caitlyn",
      reasons: [
        "Caitlyn can punish Zeri's early low range and weak first waves.",
        "Traps make Zeri's wall and dash paths more predictable around objectives.",
        "If Caitlyn gets plates early, Zeri reaches her mobile teamfight spikes later.",
      ],
    },
  ],
  mobilityLevel: "very_high",
  name: "Zeri",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "(R) turns Zeri into an extended-fight kite carry",
        changesGameplay: "Chasing Zeri during (R) can feed her movement and damage uptime.",
        playerAction: "Use (R) when the fight will last and there is room to kite around terrain.",
        enemyResponse: "Disengage or lock her down quickly instead of taking a long chase.",
      },
      {
        timing: "Two items",
        reason: "Extended fights become much more favorable if she has space",
        changesGameplay: "Zeri can take over objectives when enemies cannot pin her down.",
        playerAction: "Fight around walls and peel so she can keep firing through the whole fight.",
        enemyResponse: "Force her (E) before committing or fight away from wall escape routes.",
      },
    ],
  },
  primaryRoles: ["adc"],
  secondaryRoles: [],
  primaryTradingPattern:
    "Farm toward items, use wall (W) and careful (Q) spacing for poke, save (E) for terrain safety, and commit to long fights only with (R).",
  punishProfile: {
    canPunish: [
      "Enemies chasing through terrain while (R) is active.",
      "ADC last-hit paths exposed to wall (W).",
      "Skillshot lanes that miss into her movement near walls.",
    ],
    strugglesToPunish: ["Point-and-click lockdown.", "Early range pressure before item spikes."],
  },
  shields: [],
  softCrowdControl: ["(W) slow"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "scale",
    preferredGameLength: "long",
    scalingProfile: "late",
    winMethod: ["mobility kiting", "extended fights", "wall terrain abuse"],
  },
  supportSynergy: {
    excellentWith: ["Lulu", "Milio", "Janna"],
    goodWith: ["Yuumi", "Nami", "Karma"],
    strugglesWith: ["Nautilus", "Leona", "supports that force early all-ins"],
    notes: [
      "Lulu and Milio strengthen Zeri's extended fights and protect her ramp-up windows.",
      "Janna peels divers while Zeri kites around terrain and resets movement.",
      "Yuumi can pair with Zeri's mobility, but the lane may give up early push.",
      "Hard-engage supports can desync from Zeri if they force before she has damage.",
    ],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "(E) is down and enemy engage is available.",
      "She is fighting before item spikes without (R).",
      "No wall or terrain gives her a safe escape path.",
    ],
    goodTradeConditions: [
      "(R) is available for a long fight.",
      "Wall (W) can punish a predictable path.",
      "Support peel keeps enemies from pinning her down.",
    ],
    primaryPattern:
      "Zeri wants to stretch fights with movement and terrain; avoid short, forced trades before her tools are ready.",
  },
  punishWindows: [
    "After (E), her escape options are much lower.",
    "Before items and (R), lane bullies can force her off wave.",
    "Fight away from walls to reduce her mobility options.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
