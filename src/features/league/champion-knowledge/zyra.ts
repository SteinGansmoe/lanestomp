import type { LeagueChampionKnowledgeProfile } from "./types";

export const zyraCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: { Q: "Deadly Spines", W: "Rampant Growth", E: "Grasping Roots", R: "Stranglethorns" },
  archetype: ["support", "mage", "poke", "zone control"],
  primaryWinCondition: [
    "Control brush and wave with plants, punish rooted targets, and dominate clustered fights with Stranglethorns.",
  ],
  dangerAbilities: ["Plant poke", "(E) root", "(R) knockup"],
  dangerProfile: {
    dangerousWhen: [
      "She controls brush with plants.",
      "Enemy walks through minion-root angles.",
      "Level 6 can punish grouped all-ins.",
  ],
    mustRespect: [
      "Plants make brush control expensive for enemies.",
      "Root into plants creates immediate ADC follow-up.",
      "(R) turns enemy engage into a zone fight.",
  ],
  },
  commonWeaknesses: [
    "Immobile and vulnerable to hooks.",
    "Plants can push waves unintentionally.",
    "Weak after (E) misses.",
  ],
  damageType: "magic",
  hardCrowdControl: ["(E) root", "(R) knockup"],
  id: "Zyra",
  importantAbilityNotes: [
    "Plants make brush control expensive for enemies.",
    "Root into plants creates immediate ADC follow-up.",
    "(R) turns enemy engage into a zone fight.",
  ],
  lanePlan: {
    avoids: [
      "Missing (E) before enemy engage.",
      "Overpushing when ADC wants freeze.",
      "Standing in hook range.",
  ],
    idealLaneState: "A poke-control lane where Zyra owns brush with seeds, roots enemies through wave gaps, and punishes engage with plant zones.",
    wants: [
      "Brush control.",
      "ADC follow-up on root.",
      "Enemy forced through plant zones.",
  ],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    lanePressure: "high",
    preferredGameState: [
      "Poke lanes.",
      "Zone-control objective fights.",
      "Anti-engage with (R).",
  ],
    scalingPriority: "medium",
    winLaneBy: [
      "Landing root.",
      "Controlling brush with plants.",
      "Forcing enemies through (R).",
  ],
  },
  majorPowerSpikes: ["Level 2 root plus plant poke.", "Level 3 stronger seed control.", "Level 6 Stranglethorns."],
  matchupPreferences: {
    strongInto: [
      "Short-range lanes.",
      "Low-sustain ADCs.",
      "Engage that clumps into plants.",
  ],
    weakInto: [
      "Hook supports.",
      "Long-range artillery.",
      "Mobile ADCs dodging root.",
  ],
  },
  mobilityLevel: "none",
  name: "Zyra",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 2",
        reason: "Level 2 root plus plant poke.",
        changesGameplay: "The first real bot-lane interaction changes once this support can pair two early abilities.",
        playerAction: "Track the level 2 race and only contest the wave if the ADC can follow the support's threat.",
        enemyResponse: "Respect the level 2 timer and back up before the support reaches the wave first.",
      },
      {
        timing: "Level 3",
        reason: "Level 3 stronger seed control.",
        changesGameplay: "The full basic kit unlocks the support's main trade, peel, or poke pattern.",
        playerAction: "Use the complete kit around brush control, ADC follow-up, and the enemy support's key cooldown.",
        enemyResponse: "Punish the support after their main cooldown is spent or when the wave blocks their angle.",
      },
      {
        timing: "Level 6",
        reason: "Level 6 Stranglethorns.",
        changesGameplay: "The ultimate changes all-in, peel, roam, or objective threat for the bot lane.",
        playerAction: "Use level 6 around confirmed ADC follow-up, river setup, or defensive reset value.",
        enemyResponse: "Track the ultimate cooldown and avoid giving a clean engage or counter-engage angle.",
      },
    ],
  },
  primaryRoles: ["support"],
  secondaryRoles: [],
  primaryTradingPattern: "Seed brush, threaten (E), and use plants to punish every CS attempt while holding (R) for committed fights.",
  punishProfile: {
    canPunish: [
      "ADCs walking through plant zones.",
      "Supports face-checking brush.",
      "Engage supports after their dash commits.",
  ],
    strugglesToPunish: [
      "Hooks before she sets plants.",
      "Long-range poke.",
      "Sustain that erases plant damage.",
  ],
  },
  shields: [],
  softCrowdControl: [],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "control",
    preferredGameLength: "medium",
    scalingProfile: "mid",
    winMethod: ["Landing root.", "Controlling brush with plants.", "Forcing enemies through (R)."],
  },
  supportSynergy: {
    excellentWith: ["Jhin", "Caitlyn", "Ashe"],
    goodWith: ["Varus", "MissFortune", "Ezreal"],
    strugglesWith: ["Samira", "Nilah", "Kalista"],
    notes: [
      "Jhin, Caitlyn, Ashe convert Zyra's strongest lane pattern especially well.",
      "Varus, MissFortune, Ezreal fit Zyra when the lane can play around the same tempo window.",
      "Samira, Nilah, Kalista can struggle with Zyra when they need a different lane pace or protection pattern.",
  ],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "(E) misses.",
      "Seeds are down.",
      "She is forced out of brush.",
  ],
    goodTradeConditions: [
      "Brush is seeded.",
      "Enemy wave has root gaps.",
      "ADC can hit rooted target.",
  ],
    primaryPattern: "Seed brush, threaten (E), and use plants to punish every CS attempt while holding (R) for committed fights.",
  },
  punishWindows: [
    "Clear plants safely.",
    "Engage after (E) misses.",
    "Avoid clumping for (R).",
  ],
} satisfies LeagueChampionKnowledgeProfile;
