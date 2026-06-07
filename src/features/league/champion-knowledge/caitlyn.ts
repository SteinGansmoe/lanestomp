import type { LeagueChampionKnowledgeProfile } from "./types";

export const caitlynCombatProfile = {
  profileQuality: "reviewed",
  masteryDifficulty: "medium",
  abilities: {
    Q: "Piltover Peacemaker",
    W: "Yordle Snap Trap",
    E: "90 Caliber Net",
    R: "Ace in the Hole",
  },
  archetype: ["marksman", "lane bully", "siege", "range advantage"],
  primaryWinCondition: [
    "Use her longer range to keep wave control and build CS leads, take plates, and have prio for dragon fights.",
  ],
  dangerAbilities: ["(Q) poke", "(W) trap setup", "(E) disengage"],
  dangerProfile: {
    dangerousWhen: [
      "She controls the wave and can hit tower with support cover.",
      "(W) traps punish CC from her support or enemy pathing around turret.",
      "Her range lets her take first move on CS and plate windows.",
      "Before the first back, Caitlyn is generally stronger than other ADCs due to her range, but she can be punished by aggressive supports or enemy ADCs that can win short trades.",
    ],
    mustRespect: [
      "Her auto range decides many early trade windows.",
      "Trap setups are strongest when support CC or turret pressure forces movement.",
      "(E) can deny direct all-ins if it is held for engage.",
      "She has strong level 1 range control compared to most ADCs.",
    ],
  },
  commonWeaknesses: [
    "Can struggle when forced into extended all-ins.",
    "Needs lane control to make range pressure matter.",
    "Vulnerable if (E) is down and support cannot peel.",
    "After first back, other ADCs catch up to her in stats."
  ],
  damageType: "physical",
  hardCrowdControl: ["(W) root"],
  id: "Caitlyn",
  importantAbilityNotes: [
    "Her auto range creates direct last-hit punishment when enemies walk up for melee, cannon, or low-health ranged minions.",
    "(W) traps are strongest layered under support CC, along turret edges, and on retreat paths after a wave crash.",
    "(Q) is easier to land when the enemy ADC is locked into CS or walking around trap zones.",
    "(E) is her main safety tool; using it for poke opens a clear engage window.",
  ],
  lanePlan: {
    avoids: [
      "Letting the wave sit near enemy tower without support vision.",
      "Using (E) casually before enemy engage tools are known.",
      "Taking long all-ins against ADCs with stronger sustained combat.",
      "Dropping traps where they do not change enemy CS, retreat, or support-engage paths.",
    ],
    idealLaneState:
      "A pushed bot lane where Caitlyn uses range, traps, and support cover to deny CS and threaten plates.",
    wants: [
      "Support can help contest wave control.",
      "Crash waves into turret for plate pressure.",
      "Short poke trades before enemy all-in support can engage.",
      "Enemy ADCs forced to choose between last hitting and taking a range auto.",
      "Trap lines that make turret CS or brush exits predictable.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    lanePressure: "high",
    preferredGameState: [
      "Bot priority before dragon setup.",
      "Tower pressure with trap zones.",
      "Siege fights where she can hit safely from range.",
    ],
    scalingPriority: "medium",
    winLaneBy: [
      "Using range to punish CS attempts.",
      "Stacking waves into plate pressure.",
      "Holding (E) for enemy engage instead of trading it for poke.",
      "Autoing during enemy last-hit animations before they can answer with equal range.",
      "Placing traps where support CC, tower pressure, or minion pathing forces movement.",
    ],
  },
  majorPowerSpikes: [
    "Level 1 range control.",
    "First completed marksman item.",
    "Two-item siege and objective setup.",
  ],
  matchupPreferences: {
    strongInto: [
      "Short-range ADCs without reliable engage support.",
      "Lanes that cannot contest early push.",
      "Bot lanes vulnerable to turret trap pressure.",
    ],
    weakInto: [
      "Hard engage supports that can force through her range.",
      "ADC threats that win extended all-ins.",
      "Waveclear lanes that neutralize her plate pressure.",
    ],
  },
  mobilityLevel: "medium",
  name: "Caitlyn",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 1",
        reason: "High base range creates immediate CS pressure",
        changesGameplay: "Caitlyn can hit first and control the wave before many ADCs can answer.",
        playerAction: "Use range to punish CS attempts while keeping the wave controlled.",
        enemyResponse:
          "Avoid bleeding health for every last hit before support cooldowns are ready.",
      },
      {
        timing: "First completed marksman item",
        reason: "Poke and tower pressure convert into stronger plate threats",
        changesGameplay: "Her wave crashes become more punishing around plates and dragon setup.",
        playerAction:
          "Crash with support cover and turn bot priority into plates or dragon vision.",
        enemyResponse: "Contest the push before she gets a clean trap line around turret.",
      },
    ],
  },
  primaryRoles: ["adc"],
  secondaryRoles: [],
  primaryTradingPattern:
    "Use range for short auto trades, layer (W) around support setup, and hold (E) for enemy all-ins.",
  punishProfile: {
    canPunish: [
      "Short-range ADCs walking up for CS.",
      "Supports that miss engage and leave their ADC exposed.",
      "Enemies trapped under turret with limited movement space.",
      "Enemy ADCs collecting cannon minions without support covering the forward step.",
      "Bot lanes that surrender brush control and let her trap the lane exit.",
      "When Caitlyn's wave is pushed up to enemy turret, she can place traps under the turret which are hard to see and punish enemies trying to last hit or escape.",
    ],
    strugglesToPunish: [
      "Hard engage when (E) is down.",
      "Long-range waveclear that denies turret pressure.",
      "High CC champions that can stick to her",
    ],
  },
  shields: [],
  softCrowdControl: ["(E) slow"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "control",
    preferredGameLength: "medium",
    scalingProfile: "early",
    winMethod: ["range pressure", "plate leads", "siege control"],
  },
  supportSynergy: {
    excellentWith: ["Morgana", "Lux", "Karma", "Leona"],
    goodWith: ["Thresh", "Milio", "Janna", "Nautilus", "Rell", "Braum", "Alistar", "Seraphine"],
    strugglesWith: ["Yuumi", "Sona", "Passive enchanters"],
    notes: [
  "Morgana (Q) enables guaranteed Caitlyn (W) trap follow-up.",
  "Lux bindings create similar trap-chain kill pressure while adding poke.",
  "Karma helps Caitlyn maintain lane priority and siege pressure.",
  "Leona provides reliable engage that lets Caitlyn convert range advantage into kills.",
  "Low-pressure enchanters can leave Caitlyn with push but few punish windows.",
    ],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "(E) is down against engage.",
      "The enemy support can force an all-in through the wave.",
      "She cannot hit first with range advantage.",
    ],
    goodTradeConditions: [
      "The enemy ADC steps up for CS.",
      "Support cooldowns can protect her forward position.",
      "(W) zones the retreat path after a wave crash.",
      "A large allied wave lets her auto safely while the enemy farms under pressure.",
      "Enemy support engage is down, making range trades low-risk.",
    ],
    primaryPattern:
      "Win short range-based trades and turret pressure; avoid turning poke leads into extended all-ins.",
  },
  punishWindows: [
    "After (E), direct engage is much stronger into her.",
    "If her wave push is neutralized, her plate plan slows down.",
    "When support cannot contest brush or river, forward trap pressure is risky.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
