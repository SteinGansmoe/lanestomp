import type { LeagueChampionKnowledgeProfile } from "./types";

export const gangplankCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "very_high",
  abilities: { Q: "Parrrley", W: "Remove Scurvy", E: "Powder Keg", R: "Cannon Barrage" },
  archetype: ["scaling carry", "barrel zone control", "global pressure", "side-lane"],
  primaryWinCondition: ["Control lane with (Q) and barrel threat, scale into critical barrel damage, and use (R) to influence fights without leaving side lane."],
  dangerAbilities: ["(E) barrel chain", "(W) cleanse and heal", "(R) global slow"],
  dangerProfile: {
    dangerousWhen: ["A barrel is primed and he can chain it into the enemy.", "(W) is available to cleanse a key crowd control spell.", "(R) can turn a distant skirmish or slow a lane all-in."],
    mustRespect: ["Barrel placement controls where enemies can stand.", "His scaling damage can suddenly change once item thresholds arrive.", "(W) makes some engage patterns unreliable."],
  },
  commonWeaknesses: ["High execution requirement.", "Punishable if barrels are destroyed.", "Vulnerable to direct all-ins when (W) or barrel setup is unavailable."],
  damageType: "physical",
  hardCrowdControl: [],
  id: "Gangplank",
  importantAbilityNotes: ["(Q) applies on-hit effects and is used to trigger barrels.", "(W) cleanses crowd control and heals.", "(E) barrels are his matchup-defining damage and zoning tool.", "(R) is global area pressure."],
  lanePlan: {
    avoids: ["Dropping barrels where enemies can clear them for free.", "Letting all-in champions fight before barrel setup.", "Using (W) for small poke when hard engage is still available."],
    idealLaneState: "A controlled lane where Gangplank farms with (Q), protects barrel zones, and prevents enemies from forcing clean melee all-ins.",
    wants: ["Barrel control around the wave.", "Short (Q) poke and passive reset trades.", "Scaling time for item-based barrel threat."],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: ["Controlled waves with barrel coverage.", "Side-lane scaling while (R) helps teamfights.", "Objective setups where barrels zone entrances."],
    scalingPriority: "very_high",
    winLaneBy: ["Winning barrel timing contests.", "Using (W) to deny key crowd control.", "Maintaining farm and gold acceleration through (Q)."],
  },
  majorPowerSpikes: ["Sheen-style early damage.", "Level 6 (R).", "Critical item barrel scaling."],
  matchupPreferences: {
    strongInto: ["Low mobility melee champions.", "Compositions that must walk into barrels.", "Lanes where he can safely scale."],
    weakInto: ["Fast all-in champions that bypass barrels.", "Ranged champions that clear barrels safely.", "Point pressure that forces (W) early."],
  },
  mobilityLevel: "low",
  name: "Gangplank",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      { timing: "Level 6", reason: "(R) unlocks global fight influence", changesGameplay: "Gangplank can affect fights without leaving top lane.", playerAction: "Use (R) to swing skirmishes, protect dives, or slow enemies into barrel zones.", enemyResponse: "Track global pressure and avoid forcing close fights under (R)." },
      { timing: "Critical item barrel scaling", reason: "(E) damage becomes a major carry threat", changesGameplay: "One barrel chain can decide a side-lane or objective fight.", playerAction: "Set up barrels before enemies enter and fight around protected chains.", enemyResponse: "Clear barrels safely and punish him when setup is unavailable." },
    ],
  },
  primaryRoles: ["top"],
  primaryTradingPattern: "Poke with (Q), control space with (E), and only extend when passive, barrel setup, or (W) cleanse prevents the enemy's clean punish.",
  punishProfile: {
    canPunish: ["Enemies walking into barrel range.", "Champions whose engage can be cleansed by (W).", "Teams grouped in choke points."],
    strugglesToPunish: ["Enemies who consistently clear barrels.", "Hard engage that reaches him before setup."],
  },
  secondaryRoles: [],
  shields: [],
  softCrowdControl: ["(R) slow"],
  stealthOrInvisibility: null,
  strategicIdentity: { laneGoal: "scale", preferredGameLength: "long", scalingProfile: "late", winMethod: ["barrel zoning", "gold scaling", "global fight impact"] },
  sustain: ["(W) heal"],
  trading: {
    badTradeConditions: ["No barrel setup.", "(W) is down into crowd control.", "The enemy can force melee range before he primes barrels."],
    goodTradeConditions: ["A barrel chain is protected.", "Passive is ready for a short melee trade.", "The enemy's gap close is unavailable."],
    primaryPattern: "Use (Q) to farm and poke, threaten barrels as the main spacing rule, and save (W) for meaningful crowd control.",
  },
  punishWindows: ["After barrels are cleared, his zone control drops.", "When (W) is down, crowd control sticks.", "Before critical item scaling, his carry threat is lower."],
} satisfies LeagueChampionKnowledgeProfile;

