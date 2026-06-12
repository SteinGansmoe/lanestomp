import type { LeagueChampionKnowledgeProfile } from "./types";

export const kalistaCombatProfile = {
  profileQuality: "reviewed",
  masteryDifficulty: "very_high",
  abilities: {
    Q: "Pierce",
    W: "Sentinel",
    E: "Rend",
    R: "Fate's Call",
  },
  archetype: ["marksman", "early skirmisher", "mobility", "support-bound"],
  primaryWinCondition: [
    "Use hop spacing, Rend threat, and support all-in setup to win early lane and objective fights before low-range scaling problems appear.",
  ],
  dangerAbilities: ["(E) Rend execute", "(R) support engage", "Martial Poise hops"],
  dangerProfile: {
    dangerousWhen: [
      "She can stack spears through minions or champions and threaten (E) reset.",
      "Her support can engage or be pulled with (R).",
      "The wave is long enough for repeated hops and chase autos.",
      "She controls dragon or objective DPS with Rend execute threat.",
    ],
    mustRespect: [
      "Rend changes last-hit contests because stacked minions can become champion poke or execute pressure.",
      "Her support pairing matters more than most ADCs because (R) turns support position into engage.",
      "Hop spacing makes skillshot lanes harder if she has room to move.",
    ],
  },
  commonWeaknesses: [
    "Low range makes poke lanes difficult.",
    "Slows and attack-speed reduction punish her hop pattern.",
    "Falls off if early lane and objective control fail.",
  ],
  damageType: "physical",
  hardCrowdControl: [],
  id: "Kalista",
  importantAbilityNotes: [
    "Passive hops let her kite while autoing, but slows heavily reduce her combat pattern.",
    "(Q) can transfer Rend stacks through a killed minion into a champion.",
    "(E) rewards spear stacking on minions and champions and can reset on kills.",
    "(R) depends on support positioning and can start or save an all-in.",
  ],
  lanePlan: {
    avoids: [
      "Short-range poke lanes where she cannot stack autos safely.",
      "Fighting while slowed or when support cannot follow.",
      "Letting the wave sit under enemy tower without vision.",
      "Using Rend before the execute or reset is meaningful.",
    ],
    idealLaneState:
      "A long bot lane where Kalista and her support can threaten all-ins, stack Rend through minions, and convert early priority into dragon control.",
    wants: [
      "Engage or melee support that can use (R) aggressively.",
      "Enemy ADCs stepping into auto range for CS while Rend stacks are possible.",
      "Long lane space for hopping and chase patterns.",
      "Objective setups where Rend secures dragon or forces enemy contest timing.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    lanePressure: "high",
    preferredGameState: [
      "Early skirmishes with support engage.",
      "Long lane trades where repeated autos stack Rend.",
      "Dragon setups where Rend controls objective health.",
    ],
    scalingPriority: "medium",
    winLaneBy: [
      "Stacking spears when enemies last-hit or cannot disengage.",
      "Using support (R) to force all-ins on her terms.",
      "Threatening Rend resets through low-health minions.",
      "Converting lane pressure into early dragons.",
    ],
  },
  majorPowerSpikes: ["Level 2-3 support all-in", "Level 6 (R)", "First completed attack-speed item"],
  matchupPreferences: {
    strongInto: [
      "Short-range ADCs that must trade inside her hop range.",
      "Bot lanes without slows or reliable disengage.",
      "Objective fights where Rend secure matters.",
    ],
    weakInto: [
      "Long-range poke lanes.",
      "Slows that cripple her hopping.",
      "Disengage supports that deny extended spear stacks.",
    ],
  },
  counters: [
    {
      champion: "Ezreal",
      reasons: [
        "Kalista can force extended fights when Ezreal's (E) is down.",
        "Rend threatens objective and minion-wave control that Ezreal cannot easily contest early.",
        "Her support ultimate can start fights before Ezreal has enough poke damage.",
      ],
    },
  ],
  counteredBy: [
    {
      champion: "Ashe",
      reasons: [
        "Ashe slows reduce Kalista's passive hop value and make trades harder to reset.",
        "(R) can start fights from outside Kalista's preferred engage range.",
        "Repeated (W) poke can force Kalista low before she finds a clean all-in.",
      ],
    },
  ],
  mobilityLevel: "high",
  name: "Kalista",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "(R) turns support position into engage or rescue",
        changesGameplay:
          "Kalista can force all-ins from unusual support positions or save her partner after a bait.",
        playerAction:
          "Coordinate (R) with support engage and use the knockup to stack Rend safely.",
        enemyResponse:
          "Track her bound support and avoid standing where Fate's Call can start the fight.",
      },
      {
        timing: "First completed attack-speed item",
        reason: "More autos mean faster Rend threat and stronger objective control",
        changesGameplay:
          "Extended fights and dragon contests become much more dangerous if she can keep autoing.",
        playerAction:
          "Force longer trades and objective control while Rend stacks are reliable.",
        enemyResponse:
          "Disengage before stacks build or slow her movement before she can chase.",
      },
    ],
  },
  primaryRoles: ["adc"],
  secondaryRoles: [],
  primaryTradingPattern:
    "Hop between autos, stack Rend through minions or champions, and commit when support can lock the target long enough for spear stacks.",
  punishProfile: {
    canPunish: [
      "ADC last hits inside her auto range while Rend is available.",
      "Low-health minions that can transfer (Q) and Rend pressure.",
      "Bot lanes that cannot stop her support from engaging with (R).",
    ],
    strugglesToPunish: [
      "Poke lanes outside her auto range.",
      "Slows or disengage that deny repeated hops.",
    ],
  },
  shields: [],
  softCrowdControl: [],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "snowball",
    preferredGameLength: "short",
    scalingProfile: "early",
    winMethod: ["support all-ins", "Rend pressure", "early objective control"],
  },
  supportSynergy: {
    excellentWith: ["Renata", "Thresh", "Nautilus"],
    goodWith: ["Leona", "Alistar", "Rell"],
    strugglesWith: ["Yuumi", "Sona", "supports that avoid early fighting"],
    notes: [
      "Renata extends Kalista's skirmish durability and makes Rend all-ins harder to escape.",
      "Thresh adds hook threat and lantern safety while Kalista controls early waves.",
      "Nautilus, Leona, and Rell become powerful (R) delivery targets for forced engages.",
      "Passive supports waste Kalista's early lane agency and objective control windows.",
    ],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "She is slowed before she can hop freely.",
      "Support cannot follow the all-in.",
      "The enemy can disengage before Rend stacks matter.",
    ],
    goodTradeConditions: [
      "The enemy ADC is stuck last-hitting in her auto range.",
      "Support engage or (R) can start the fight.",
      "Low-health minions create Rend reset or (Q) transfer pressure.",
    ],
    primaryPattern:
      "Kalista wants extended early trades with support setup, not isolated poke trades at max enemy range.",
  },
  punishWindows: [
    "Slows and disengage heavily reduce her threat.",
    "If Rend is used early, her execute pressure disappears.",
    "If early lane control fails, her short range becomes harder to play.",
  ],
} satisfies LeagueChampionKnowledgeProfile;

