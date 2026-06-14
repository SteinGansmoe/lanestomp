import type { LeagueChampionKnowledgeProfile } from "./types";

export const threshCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: { Q: "Death Sentence", W: "Dark Passage", E: "Flay", R: "The Box" },
  archetype: ["support", "pick", "peel", "playmaker"],
  primaryWinCondition: [
    "Control brush with hook and Flay threat, create picks, and use lantern to protect immobile ADCs or extend ganks.",
  ],
  dangerAbilities: ["(Q) hook", "(W) lantern", "(E) Flay"],
  dangerProfile: {
    dangerousWhen: [
      "He controls brush.",
      "Lantern can save an exposed ADC.",
      "Flay can interrupt enemy dash engage.",
  ],
    mustRespect: [
      "Thresh can start or deny fights.",
      "Lantern changes gank and trade safety.",
      "Hook threat is often stronger when held.",
  ],
  },
  commonWeaknesses: [
    "Skillshot dependent.",
    "Punishable after missed hook.",
    "Needs good spacing to balance engage and peel.",
  ],
  damageType: "mixed",
  hardCrowdControl: ["(Q) hook", "(E) displacement"],
  id: "Thresh",
  importantAbilityNotes: [
    "Thresh can start or deny fights.",
    "Lantern changes gank and trade safety.",
    "Hook threat is often stronger when held.",
  ],
  lanePlan: {
    avoids: [
      "Throwing hook on cooldown.",
      "Using lantern too late.",
      "Standing where poke can chip him out.",
  ],
    idealLaneState: "A control lane where Thresh threatens hook from brush, holds Flay for dashes, and uses lantern to manage ADC risk.",
    wants: [
      "Brush control.",
      "ADC follow-up or protection.",
      "Enemy dash to interrupt.",
  ],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    lanePressure: "high",
    preferredGameState: [
      "Pick lanes.",
      "Protected immobile carries.",
      "Gank setup lanes.",
  ],
    scalingPriority: "medium",
    winLaneBy: [
      "Landing hook.",
      "Flaying engage.",
      "Lanterning ADC or jungler.",
  ],
  },
  majorPowerSpikes: ["Level 2 hook plus Flay.", "Level 3 lantern safety.", "Level 6 The Box all-in or peel."],
  matchupPreferences: {
    strongInto: [
      "Immobile ADCs.",
      "Dash engage he can Flay.",
      "Lanes that fear ganks.",
  ],
    weakInto: [
      "Long-range poke.",
      "Spell shields.",
      "Minion cover lanes.",
  ],
  },
  counters: [
    {
      champion: "Leona",
      reasons: [
        "Thresh can Flay Leona's engage and turn her predictable all-in path into a losing trade.",
      ],
    },
    {
      champion: "Rell",
      reasons: [
        "Thresh can interrupt Rell's engage timing with Flay and lantern his ADC out of follow-up range.",
      ],
    },
    {
      champion: "Nautilus",
      reasons: [
        "Thresh can punish Nautilus after missed hook and use lantern to reduce his point-and-click follow-up value.",
      ],
    },
    {
      champion: "Jinx",
      reasons: [
        "Thresh can punish Jinx's low mobility with hook threat and force her to spend summoners before resets matter.",
      ],
    },
  ],
  counteredBy: [
    {
      champion: "Morgana",
      reasons: [
        "Morgana can block Thresh hook or Flay follow-up with Black Shield and punish missed engages.",
      ],
    },
    {
      champion: "Zyra",
      reasons: [
        "Zyra can control brush with plants and punish Thresh when he steps up for hook angles.",
      ],
    },
    {
      champion: "Brand",
      reasons: [
        "Brand can chip Thresh down before engage windows and punish him if he misses hook.",
      ],
    },
    {
      champion: "Janna",
      reasons: [
        "Janna can deny Thresh's engage follow-up with disengage tools and keep carries out of hook punish range.",
      ],
    },
  ],
  mobilityLevel: "medium",
  name: "Thresh",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 2",
        reason: "Level 2 hook plus Flay.",
        changesGameplay: "The first real bot-lane interaction changes once this support can pair two early abilities.",
        playerAction: "Track the level 2 race and only contest the wave if the ADC can follow the support's threat.",
        enemyResponse: "Respect the level 2 timer and back up before the support reaches the wave first.",
      },
      {
        timing: "Level 3",
        reason: "Level 3 lantern safety.",
        changesGameplay: "The full basic kit unlocks the support's main trade, peel, or poke pattern.",
        playerAction: "Use the complete kit around brush control, ADC follow-up, and the enemy support's key cooldown.",
        enemyResponse: "Punish the support after their main cooldown is spent or when the wave blocks their angle.",
      },
      {
        timing: "Level 6",
        reason: "Level 6 The Box all-in or peel.",
        changesGameplay: "The ultimate changes all-in, peel, roam, or objective threat for the bot lane.",
        playerAction: "Use level 6 around confirmed ADC follow-up, river setup, or defensive reset value.",
        enemyResponse: "Track the ultimate cooldown and avoid giving a clean engage or counter-engage angle.",
      },
    ],
  },
  primaryRoles: ["support"],
  secondaryRoles: [],
  primaryTradingPattern: "Hold hook threat, Flay enemy dashes or pulls, and use lantern to let ADCs trade closer than they normally could.",
  punishProfile: {
    canPunish: [
      "ADCs without minion cover.",
      "Dash engage supports.",
      "Enemies ignoring lantern ganks.",
  ],
    strugglesToPunish: [
      "Full minion waves.",
      "Poke lanes.",
      "Spell-shielded targets.",
  ],
  },
  shields: ["(W) lantern shield"],
  softCrowdControl: ["(R) slow"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "control",
    preferredGameLength: "medium",
    scalingProfile: "mid",
    winMethod: ["Landing hook.", "Flaying engage.", "Lanterning ADC or jungler."],
  },
  supportSynergy: {
    excellentWith: ["Aphelios", "Draven", "Jinx"],
    goodWith: ["Caitlyn", "Kalista", "Kaisa"],
    strugglesWith: ["Ezreal", "Ziggs", "Smolder"],
    notes: [
      "Aphelios, Draven, Jinx convert Thresh's strongest lane pattern especially well.",
      "Caitlyn, Kalista, Kaisa fit Thresh when the lane can play around the same tempo window.",
      "Ezreal, Ziggs, Smolder can struggle with Thresh when they need a different lane pace or protection pattern.",
  ],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "(Q) misses.",
      "(E) is down against engage.",
      "Lantern is unavailable.",
  ],
    goodTradeConditions: [
      "Brush is controlled.",
      "Enemy dash is predictable.",
      "ADC or jungler can use lantern.",
  ],
    primaryPattern: "Hold hook threat, Flay enemy dashes or pulls, and use lantern to let ADCs trade closer than they normally could.",
  },
  punishWindows: [
    "Stand behind minions.",
    "Punish missed hook.",
    "Ward lantern gank paths.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
