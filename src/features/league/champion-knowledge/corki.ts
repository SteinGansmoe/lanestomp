import type { LeagueChampionKnowledgeProfile } from "./types";

export const corkiCombatProfile = {
  profileQuality: "draft",
  abilities: {
    Q: "Phosphorus Bomb",
    W: "Valkyrie",
    E: "Gatling Gun",
    R: "Missile Barrage",
  },
  archetype: ["poke", "marksman mage", "scaling", "mobility"],
  primaryWinCondition: [
    "Secure CS into item spikes, then use rockets and mixed damage poke to control mid-game fights.",
  ],
  dangerAbilities: ["(R) poke", "(W) reposition"],
  dangerProfile: {
    dangerousWhen: [
      "(R) is stocked and he can poke before objectives.",
      "He has item spikes that make repeated rockets meaningful.",
      "(W) is available to reposition away from all-ins.",
    ],
    mustRespect: [
      "(R) gives repeated long-range poke after level 6.",
      "(W) is his main escape and should be tracked before forcing fights.",
      "His damage pattern improves sharply with items.",
    ],
  },
  commonWeaknesses: [
    "Can be pressured before item spikes.",
    "Vulnerable if (W) is forced or used forward.",
    "Needs time and space to poke before committing.",
  ],
  damageType: "mixed",
  hardCrowdControl: [],
  id: "Corki",
  importantAbilityNotes: [
    "(Q) reveals and adds poke in trades, including bot-lane brush checks.",
    "(W) is mobility, not a reliable combat engage in lane; using it forward invites support engage.",
    "(E) shreds resistances during close trades but requires Corki to stand in punish range.",
    "(R) is his main post-6 poke pattern and can punish ADCs walking up for CS before objectives.",
  ],
  lanePlan: {
    avoids: [
      "Using (W) forward without knowing enemy cooldowns.",
      "Taking extended early fights before items.",
      "Letting wave pressure force him off CS.",
      "Playing bot lane as if he can match early marksman DPS before his poke items.",
    ],
    idealLaneState:
      "A stable mid lane where Corki secures CS, chips with (Q) and autos, then uses (R) poke after level 6.",
    wants: [
      "CS access toward item spikes.",
      "Poke windows before objectives or recalls.",
      "Enemies low enough that rockets control their movement.",
      "Support peel that lets him farm safely until rockets and item poke matter.",
      "Enemy ADCs forced to last-hit while he has (Q) or (R) poke available.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "low",
    lanePressure: "medium",
    preferredGameState: [
      "Stable early waves with low all-in risk.",
      "Mid-game poke setups around objectives.",
      "Fights where he can kite and fire repeated (R) casts.",
    ],
    scalingPriority: "high",
    winLaneBy: [
      "Preserving health through early pressure.",
      "Using post-6 rockets to control recalls and river setups.",
      "Reaching item spikes where his poke becomes hard to ignore.",
      "Punishing bot-lane CS attempts with safe poke instead of walking into extended autos.",
    ],
  },
  majorPowerSpikes: [
    "Level 6 (R).",
    "First completed damage item.",
    "Mid-game item spikes for stronger poke.",
  ],
  matchupPreferences: {
    strongInto: [
      "Lanes that cannot punish his scaling window.",
      "Short-range champions that must walk through poke.",
      "Compositions vulnerable to pre-objective poke.",
    ],
    weakInto: [
      "Hard engage when (W) is down.",
      "Strong early lane bullies that deny farm.",
      "Long-range mages who can outpoke him before items.",
    ],
  },
  mobilityLevel: "medium",
  name: "Corki",
  offMetaRoles: ["adc"],
  strategicIdentity: {
    laneGoal: "scale",
    scalingProfile: "mid",
    preferredGameLength: "medium",
    winMethod: ["poke pressure", "item scaling", "objective siege"],
  },
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "Level 6 (R)",
        changesGameplay: "Level 6 changes his lane from mostly short trades into repeat poke",
        playerAction:
          "Track (R) availability and use the window for verified all-ins, picks, roams, or defensive resets rather than forcing blind.",
        enemyResponse:
          "Respect (R) window, hold key defensive tools for the commit, and punish after (R) is spent.",
      },
      {
        timing: "First completed damage item",
        reason: "First completed damage item",
        changesGameplay: "Items matter heavily because his threat depends on sustained poke damage",
        playerAction:
          "After the item, pressure waves and trades more confidently while still tracking the enemy's main answer.",
        enemyResponse:
          "Do not treat pre-item trades as still safe once Corki's first item threshold is completed.",
      },
      {
        timing: "Mid-game item progression",
        reason: "Mid-game item spikes for stronger poke",
        changesGameplay:
          "Corki's damage, wave control, or trade reliability improves enough that earlier neutral trades can become losing trades.",
        playerAction:
          "After the item, pressure waves and trades more confidently while still tracking the enemy's main answer.",
        enemyResponse:
          "Do not treat pre-item trades as still safe once Corki's first item threshold is completed.",
      },
    ],
  },
  primaryRoles: ["mid"],
  secondaryRoles: ["adc"],
  primaryTradingPattern:
    "Use (Q) and autos for short trades, preserve (W) for danger, then rely on (R) poke once level 6 is reached.",
  punishProfile: {
    canPunish: [
      "Enemies who take repeated rockets before objectives.",
      "Short-range champions walking into (Q) and (E) range.",
      "Overcommits after he kites back with (W).",
      "ADC players who step out from minion cover into rocket or (Q) poke.",
    ],
    strugglesToPunish: [
      "Long-range champions who outrange his early poke.",
      "Assassins that can force (W) and re-engage.",
    ],
  },
  shields: [],
  softCrowdControl: [],
  stealthOrInvisibility: null,
  supportSynergy: {
    excellentWith: ["Lulu", "Milio", "Janna"],
    goodWith: ["Karma", "Nami", "Braum"],
    strugglesWith: ["Leona", "Nautilus", "hard-forcing engage supports"],
    notes: [
      "Lulu and Milio protect Corki through short-range trades until item spikes take over.",
      "Karma and Nami help Corki contest early waves without committing to losing all-ins.",
      "Braum covers Corki when he needs to step forward for poke or package setup.",
      "Supports that demand constant early all-ins can desync from Corki's scaling poke plan.",
    ],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "(W) is unavailable against all-in threat.",
      "He is fighting before meaningful item damage.",
      "The enemy can force melee range before Corki pokes first.",
    ],
    goodTradeConditions: [
      "He can poke without spending (W).",
      "(R) is available for repeat follow-up.",
      "The enemy is already low from rockets or (Q).",
      "Support can discourage all-in while he uses poke to contest CS.",
    ],
    primaryPattern:
      "Take short poke trades, avoid spending (W) casually, and use (R) to soften enemies before any longer fight.",
  },
  punishWindows: [
    "If Corki uses (W) forward, he is much easier to all-in.",
    "Before level 6, his lane poke is less oppressive.",
    "If rockets are low or unavailable, his posturing threat drops.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
