import type { LeagueChampionKnowledgeProfile } from "./types";

export const vayneCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "high",
  abilities: { Q: "Tumble", W: "Silver Bolts", E: "Condemn", R: "Final Hour" },
  archetype: ["marksman", "anti-tank", "scaling duelist", "ranged top"],
  primaryWinCondition: [
    "Use ranged spacing and (Q) repositioning to deny melee champions, then scale into side-lane duels and anti-tank DPS through (W).",
  ],
  dangerAbilities: ["(E) wall stun", "(W) true damage", "(R) stealth tumble"],
  dangerProfile: {
    dangerousWhen: [
      "She has room to kite.",
      "(E) can pin a target into terrain.",
      "(R) is active and (Q) gives stealth repositioning.",
    ],
    mustRespect: [
      "Her true damage punishes tanks.",
      "Ranged top pressure can deny farm early.",
      "She is fragile if engage reaches her.",
    ],
  },
  commonWeaknesses: [
    "Very fragile.",
    "Low waveclear.",
    "Can be punished by ganks and hard engage.",
  ],
  damageType: "physical",
  hardCrowdControl: ["(E) wall stun"],
  id: "Vayne",
  importantAbilityNotes: [
    "(Q) repositions and empowers the next attack, making it her main CS punish and dodge tool.",
    "(W) deals true damage every third hit, so extended trades are much better than single poke autos.",
    "(E) knocks back and stuns into terrain, especially around bot lane wall and alcove angles.",
    "(R) empowers combat and grants stealth during (Q), letting her reposition in all-ins.",
  ],
  lanePlan: {
    avoids: [
      "Pushing without vision.",
      "Using (Q) forward when engage is ready.",
      "Fighting near walls that help the enemy if she cannot control spacing.",
      "Letting long-range ADCs punish every last hit before she reaches item spikes.",
    ],
    idealLaneState:
      "A safe bot lane or ranged side lane where Vayne keeps enough space to farm, punishes close CS attempts with (Q) autos, and holds (E) for engage or wall angles.",
    wants: [
      "Space to kite.",
      "Support peel through early range disadvantage.",
      "Enemy ADCs forced into short-range CS contests.",
      "Side-lane duels after items.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    lanePressure: "high",
    preferredGameState: [
      "Ranged denial lanes.",
      "Side-lane duels with space.",
      "Late fights where she can free-hit front line.",
    ],
    scalingPriority: "high",
    winLaneBy: [
      "Spacing with autos and (Q).",
      "Condemning engage into walls.",
      "Scaling into true damage DPS.",
      "Punishing exposed last hits with (Q) auto while preserving (E).",
    ],
  },
  majorPowerSpikes: ["Level 6 (R).", "First marksman item.", "Two-item side-lane duel spike."],
  matchupPreferences: {
    strongInto: [
      "Tanks and low mobility bruisers.",
      "Champions she can kite.",
      "Frontlines vulnerable to true damage.",
    ],
    weakInto: ["Hard engage.", "Gank pressure.", "Waveclear and poke that traps her under tower."],
  },
  mobilityLevel: "high",
  name: "Vayne",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "(R) empowers dueling and stealth repositioning",
        changesGameplay: "Vayne can outplay committed melee all-ins with stealth tumbles.",
        playerAction: "Use (R) when there is enough space to kite.",
        enemyResponse: "Force her into short spaces or engage after (E).",
      },
      {
        timing: "Two-item side-lane spike",
        reason: "True damage DPS becomes a major duel threat",
        changesGameplay: "Tanks and bruisers struggle to answer her alone.",
        playerAction: "Pressure side lane with vision and kite space.",
        enemyResponse: "Collapse with numbers rather than isolated duels.",
      },
    ],
  },
  primaryRoles: ["adc", "top"],
  primaryTradingPattern:
    "Auto from max range, use (Q) to maintain spacing, and hold (E) for enemy engage or terrain stun rather than poke.",
  punishProfile: {
    canPunish: [
      "Tanks in extended range.",
      "Melee champions without gap close.",
      "Targets near walls for (E).",
      "Short-range ADCs that must enter her auto range for CS.",
    ],
    strugglesToPunish: ["Coordinated ganks.", "Hard engage after (E)."],
  },
  secondaryRoles: [],
  shields: [],
  softCrowdControl: [],
  stealthOrInvisibility: "(R) makes (Q) briefly stealth Vayne.",
  strategicIdentity: {
    laneGoal: "scale",
    preferredGameLength: "long",
    scalingProfile: "late",
    winMethod: ["ranged top pressure", "anti-tank DPS", "side-lane kiting"],
  },
  supportSynergy: {
    excellentWith: ["Lulu", "Milio", "Janna"],
    goodWith: ["Nami", "Braum", "TahmKench"],
    strugglesWith: ["Xerath", "Zyra", "roam-heavy supports"],
    notes: [
      "Lulu and Milio keep Vayne alive through short-range tumble trades and late fights.",
      "Janna and Tahm Kench cover Vayne when enemies try to punish her weak early lane.",
      "Braum can protect Vayne while adding stun threat during extended trades.",
      "Roaming or poke-only supports can leave Vayne too vulnerable before her item spikes.",
    ],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "(Q) is used forward into engage.",
      "(E) is down.",
      "The wave is pushed without vision.",
    ],
    goodTradeConditions: [
      "There is space to kite.",
      "The enemy's engage is down.",
      "A wall angle enables (E).",
      "The enemy ADC is locked into a last-hit and cannot extend through her (Q) reposition.",
    ],
    primaryPattern:
      "Win with spacing discipline and true damage, not by standing still in fair melee range.",
  },
  punishWindows: [
    "After (E), engage is more reliable.",
    "If she pushes without vision, ganks punish hard.",
    "Low waveclear can trap her in bad lane states.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
