import type { LeagueChampionKnowledgeProfile } from "./types";

export const jannaCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: { Q: "Howling Gale", W: "Zephyr", E: "Eye of the Storm", R: "Monsoon" },
  archetype: ["support", "enchanter", "peel", "disengage"],
  primaryWinCondition: [
    "Deny enemy engage with tornado and Monsoon, shield key trades, and help scaling ADCs survive until teamfights.",
  ],
  dangerAbilities: ["Charged (Q)", "(E) shield", "(R) reset"],
  dangerProfile: {
    dangerousWhen: [
      "She has tornado charged from fog.",
      "Her ADC can trade under (E).",
      "(R) can cancel a dive or reset a fight.",
  ],
    mustRespect: [
      "Janna punishes predictable engage paths.",
      "(E) changes short trade math.",
      "(R) can ruin committed all-ins.",
  ],
  },
  commonWeaknesses: [
    "Low kill threat without ADC damage.",
    "Can be pushed in by hard poke lanes.",
    "Vulnerable if (Q) is baited before engage.",
  ],
  damageType: "magic",
  hardCrowdControl: ["(Q) knockup", "(R) knockback"],
  id: "Janna",
  importantAbilityNotes: [
    "Janna punishes predictable engage paths.",
    "(E) changes short trade math.",
    "(R) can ruin committed all-ins.",
  ],
  lanePlan: {
    avoids: [
      "Using (Q) randomly.",
      "Standing forward without tornado.",
      "Falling behind in wave pressure against poke lanes.",
  ],
    idealLaneState: "A stable or slightly defensive lane where Janna shields key trades, controls brush with tornado threat, and prevents hard engage.",
    wants: [
      "Scaling ADC protected.",
      "Enemy engage telegraphed.",
      "Short trades where shield value matters.",
  ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "low",
    preferredGameState: [
      "Peel lanes.",
      "Scaling bot lanes.",
      "Teamfights where divers must pass through her.",
  ],
    scalingPriority: "high",
    winLaneBy: [
      "Denying all-ins.",
      "Shielding ADC poke or last-hit trades.",
      "Resetting bad fights with (R).",
  ],
  },
  majorPowerSpikes: ["Level 2 shield plus disengage.", "Level 3 full peel kit.", "Level 6 (R) fight reset."],
  matchupPreferences: {
    strongInto: [
      "Hard engage supports.",
      "Dive ADCs.",
      "Comps relying on one entry path.",
  ],
    weakInto: [
      "Heavy poke and sustain lanes.",
      "Hook supports when (Q) is down.",
      "Roam supports that ignore lane.",
  ],
  },
  mobilityLevel: "medium",
  name: "Janna",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 2",
        reason: "Level 2 shield plus disengage.",
        changesGameplay: "The first real bot-lane interaction changes once this support can pair two early abilities.",
        playerAction: "Track the level 2 race and only contest the wave if the ADC can follow the support's threat.",
        enemyResponse: "Respect the level 2 timer and back up before the support reaches the wave first.",
      },
      {
        timing: "Level 3",
        reason: "Level 3 full peel kit.",
        changesGameplay: "The full basic kit unlocks the support's main trade, peel, or poke pattern.",
        playerAction: "Use the complete kit around brush control, ADC follow-up, and the enemy support's key cooldown.",
        enemyResponse: "Punish the support after their main cooldown is spent or when the wave blocks their angle.",
      },
      {
        timing: "Level 6",
        reason: "Level 6 (R) fight reset.",
        changesGameplay: "The ultimate changes all-in, peel, roam, or objective threat for the bot lane.",
        playerAction: "Use level 6 around confirmed ADC follow-up, river setup, or defensive reset value.",
        enemyResponse: "Track the ultimate cooldown and avoid giving a clean engage or counter-engage angle.",
      },
    ],
  },
  primaryRoles: ["support"],
  secondaryRoles: [],
  primaryTradingPattern: "Shield the ADC's best auto trade, hold (Q) for enemy engage, and use (W) only when she can back out safely.",
  punishProfile: {
    canPunish: [
      "Telegraphed engage.",
      "Divers after dash commits.",
      "Short trades where shield blocks return damage.",
  ],
    strugglesToPunish: [
      "Long-range poke.",
      "Roams that happen away from her protected ADC.",
      "Lanes that never commit.",
  ],
  },
  shields: ["(E) shield"],
  softCrowdControl: ["(W) slow"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "survive",
    preferredGameLength: "long",
    scalingProfile: "late",
    winMethod: ["Denying all-ins.", "Shielding ADC poke or last-hit trades.", "Resetting bad fights with (R)."],
  },
  supportSynergy: {
    excellentWith: ["Jinx", "KogMaw", "Zeri"],
    goodWith: ["Vayne", "Aphelios", "Smolder"],
    strugglesWith: ["Draven", "Samira", "Kalista"],
    notes: [
      "Scaling carries love her peel and shielded trades.",
      "Immobile ADCs gain a real anti-dive layer from tornado and Monsoon.",
      "Pure all-in ADCs can lack kill pressure with Janna before enemy mistakes.",
  ],
  },
  sustain: ["(R) healing."],
  trading: {
    badTradeConditions: [
      "(Q) is down.",
      "Her ADC cannot trade during (E).",
      "The enemy can poke without committing.",
  ],
    goodTradeConditions: [
      "Enemy engage is predictable.",
      "(E) is ready for ADC damage.",
      "(R) can interrupt the all-in.",
  ],
    primaryPattern: "Shield the ADC's best auto trade, hold (Q) for enemy engage, and use (W) only when she can back out safely.",
  },
  punishWindows: [
    "Bait tornado first.",
    "Push and poke when she cannot contest wave.",
    "Roam before her lane can follow.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
