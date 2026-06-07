import type { LeagueChampionKnowledgeProfile } from "./types";

export const dravenCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "high",
  abilities: {
    Q: "Spinning Axe",
    W: "Blood Rush",
    E: "Stand Aside",
    R: "Whirling Death",
  },
  archetype: ["marksman", "lane bully", "snowball", "high-risk carry"],
  primaryWinCondition: [
    "Use Spinning Axe damage to win early trades, cash in passive gold, and turn lane control into kill pressure before scaling ADCs stabilize.",
  ],
  dangerAbilities: ["(Q) axe damage", "(E) interrupt", "(R) execute"],
  dangerProfile: {
    dangerousWhen: [
      "He has one or two axes spinning and can auto during enemy CS attempts.",
      "The enemy support cannot punish his axe catch path.",
      "He already has lane control and first item turns axe trades into kill threats.",
      "(E) is available to interrupt dashes or disengage attempts.",
    ],
    mustRespect: [
      "A single axe auto can make normal ADC CS trades losing.",
      "Axe catch locations telegraph where Draven wants to move but also define where he threatens damage.",
      "Passive cash-in makes one death much more punishing than in most ADC lanes.",
    ],
  },
  commonWeaknesses: [
    "Axe catch paths can be targeted by skillshots and support engage.",
    "Falls behind hard if early deaths deny cash-in.",
    "No dash and limited teamfight safety.",
  ],
  damageType: "physical",
  hardCrowdControl: [],
  id: "Draven",
  importantAbilityNotes: [
    "(Q) is the core trade pattern and last-hit punish.",
    "(W) refreshes when catching axes, so movement speed depends on clean axe management.",
    "(E) can interrupt dashes, slow retreats, or stop engage timing.",
    "(R) is a long-range execute and passive cash-in tool after enemies are chunked.",
  ],
  lanePlan: {
    avoids: [
      "Chasing unsafe axe catch spots into support CC.",
      "Letting the wave push without vision when he needs to stand forward.",
      "Trading without axes active.",
      "Taking even lanes that deny passive cash-in value.",
    ],
    idealLaneState:
      "An aggressive bot lane where Draven controls the first waves, threatens axe autos during every CS attempt, and uses support pressure to make axe catches safe.",
    wants: [
      "Support can contest brush and protect axe catch zones.",
      "Enemy ADC forced to last-hit inside axe auto range.",
      "Wave control that keeps him forward without exposing gank paths.",
      "Early kill or plate pressure before scaling ADCs reach safe item thresholds.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    lanePressure: "high",
    preferredGameState: [
      "Early lane control with support cover.",
      "Short brutal trades around axe autos.",
      "Snowball lanes where one cash-in decides the matchup.",
    ],
    scalingPriority: "medium",
    winLaneBy: [
      "Punishing last hits with (Q) empowered autos.",
      "Keeping axes active while support controls brush.",
      "Using (E) to interrupt the enemy's escape or engage answer.",
      "Cashing in passive stacks before the enemy ADC scales.",
    ],
  },
  majorPowerSpikes: [
    "Level 1 axe trade pressure.",
    "First kill cash-in.",
    "First completed damage item.",
  ],
  matchupPreferences: {
    strongInto: [
      "Scaling ADCs that cannot contest early axe damage.",
      "Passive supports that cannot punish catch paths.",
      "Short trade lanes where he can hit first and leave.",
    ],
    weakInto: [
      "Hard CC supports that camp axe locations.",
      "Long-range poke that forces him off catch paths.",
      "Disengage lanes that deny early cash-in.",
    ],
  },
  mobilityLevel: "low",
  name: "Draven",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 1",
        reason: "(Q) axe autos heavily out-trade normal marksman autos",
        changesGameplay:
          "The enemy ADC cannot safely contest early CS if Draven has room to throw axes.",
        playerAction:
          "Stand forward with support cover and punish every exposed last-hit attempt with axe autos.",
        enemyResponse:
          "Concede some CS or aim support pressure at his axe catch path.",
      },
      {
        timing: "First completed damage item",
        reason: "Axe trades become kill threats if he already controls lane",
        changesGameplay:
          "A winning Draven can turn one auto trade into a forced recall, dive setup, or cash-in.",
        playerAction:
          "Use item lead to force short axe trades before the enemy ADC reaches stable DPS.",
        enemyResponse:
          "Avoid trading into axes and force him to catch in dangerous zones.",
      },
    ],
  },
  primaryRoles: ["adc"],
  secondaryRoles: [],
  primaryTradingPattern:
    "Keep axes active, auto the enemy ADC during CS attempts, use (W) to reposition after catches, and hold (E) for interrupts or chase control.",
  punishProfile: {
    canPunish: [
      "Enemy ADCs stepping up for CS while axes are active.",
      "Supports that cannot contest his catch path.",
      "Dash commits that can be interrupted by (E).",
    ],
    strugglesToPunish: [
      "Long-range lanes that harass axe locations.",
      "Hard engage that forces him away from axes.",
    ],
  },
  shields: [],
  softCrowdControl: ["(E) slow"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "snowball",
    preferredGameLength: "short",
    scalingProfile: "early",
    winMethod: ["axe trades", "passive cash-in", "lane dominance"],
  },
  supportSynergy: {
    excellentWith: ["Nautilus", "Leona", "Thresh"],
    goodWith: ["Nami", "Braum", "Pyke"],
    strugglesWith: ["Yuumi", "Sona", "passive scaling supports"],
    notes: [
      "Nautilus and Leona lock enemies in place long enough for Draven to cash in early axe damage.",
      "Thresh can threaten hooks while lantern protects Draven's axe-catching path.",
      "Nami adds strong trade burst without forcing Draven to give up wave control.",
      "Passive enchanters often fail to create the early kill pressure Draven needs.",
    ],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "Axes are inactive or catch zones are controlled by enemy support.",
      "He must catch an axe inside enemy CC threat.",
      "The wave is too large to walk forward safely.",
    ],
    goodTradeConditions: [
      "Enemy ADC is locked into a last-hit animation.",
      "Support controls brush and protects axe movement.",
      "(E) can stop the enemy's dash or disengage.",
    ],
    primaryPattern:
      "Trade around axe catches and CS timing; Draven wants unfair short trades, not passive farming.",
  },
  punishWindows: [
    "When axes drop, his lane threat falls sharply.",
    "Axe catch paths are predictable and can be targeted.",
    "If he dies before cashing in, his snowball plan is heavily delayed.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
