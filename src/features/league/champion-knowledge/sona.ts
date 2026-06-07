import type { LeagueChampionKnowledgeProfile } from "./types";

export const sonaCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: { Q: "Hymn of Valor", W: "Aria of Perseverance", E: "Song of Celerity", R: "Crescendo" },
  archetype: ["support", "enchanter", "scaling", "teamfight"],
  primaryWinCondition: [
    "Survive early lane, scale aura value, and use Crescendo to punish grouped enemies or stop dives.",
  ],
  dangerAbilities: ["Power chord", "(W) sustain", "(R) Crescendo"],
  dangerProfile: {
    dangerousWhen: [
      "She reaches item and level scaling.",
      "Enemy engage is unavailable.",
      "Level 6 stun can stop a commit.",
  ],
    mustRespect: [
      "Her early lane is fragile but scales hard.",
      "Power chord choice matters for trade, slow, or damage reduction.",
      "Crescendo is her main hard punish.",
  ],
  },
  commonWeaknesses: [
    "Very vulnerable early.",
    "Low wave pressure.",
    "Punishable if she steps up for poke without vision.",
  ],
  damageType: "magic",
  hardCrowdControl: ["(R) stun"],
  id: "Sona",
  importantAbilityNotes: [
    "Her early lane is fragile but scales hard.",
    "Power chord choice matters for trade, slow, or damage reduction.",
    "Crescendo is her main hard punish.",
  ],
  lanePlan: {
    avoids: [
      "Walking up without minion cover.",
      "Taking level 2 all-ins.",
      "Using mana on low-value trades.",
  ],
    idealLaneState: "A defensive scaling lane where Sona trades lightly with (Q), sustains with (W), and avoids hard engage until level 6.",
    wants: [
      "Scaling ADC.",
      "Short safe poke trades.",
      "Enemy engage cooldowns tracked.",
  ],
  },
  laneIdentity: {
    earlyGameAgency: "low",
    lanePressure: "low",
    preferredGameState: [
      "Scaling lanes.",
      "Grouped teamfights.",
      "Anti-dive with Crescendo.",
  ],
    scalingPriority: "very_high",
    winLaneBy: [
      "Surviving early.",
      "Stacking aura value.",
      "Landing (R) on commits.",
  ],
  },
  majorPowerSpikes: ["Level 2 sustain trade.", "Level 3 movement aura.", "Level 6 Crescendo."],
  matchupPreferences: {
    strongInto: [
      "Low kill pressure lanes.",
      "Scaling carries.",
      "Teams that group around her auras.",
  ],
    weakInto: [
      "Hard engage.",
      "Hook supports.",
      "Early burst lanes.",
  ],
  },
  mobilityLevel: "low",
  name: "Sona",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 2",
        reason: "Level 2 sustain trade.",
        changesGameplay: "The first real bot-lane interaction changes once this support can pair two early abilities.",
        playerAction: "Track the level 2 race and only contest the wave if the ADC can follow the support's threat.",
        enemyResponse: "Respect the level 2 timer and back up before the support reaches the wave first.",
      },
      {
        timing: "Level 3",
        reason: "Level 3 movement aura.",
        changesGameplay: "The full basic kit unlocks the support's main trade, peel, or poke pattern.",
        playerAction: "Use the complete kit around brush control, ADC follow-up, and the enemy support's key cooldown.",
        enemyResponse: "Punish the support after their main cooldown is spent or when the wave blocks their angle.",
      },
      {
        timing: "Level 6",
        reason: "Level 6 Crescendo.",
        changesGameplay: "The ultimate changes all-in, peel, roam, or objective threat for the bot lane.",
        playerAction: "Use level 6 around confirmed ADC follow-up, river setup, or defensive reset value.",
        enemyResponse: "Track the ultimate cooldown and avoid giving a clean engage or counter-engage angle.",
      },
    ],
  },
  primaryRoles: ["support"],
  secondaryRoles: [],
  primaryTradingPattern: "Take small empowered-auto trades only when safe, heal the return damage, and preserve health until scaling and (R).",
  punishProfile: {
    canPunish: [
      "Enemies overcommitting into (R).",
      "Short trades after enemy engage misses.",
      "Grouped fights around objectives.",
  ],
    strugglesToPunish: [
      "Early all-ins.",
      "Long-range poke that outranges her.",
      "Roam pressure before she scales.",
  ],
  },
  shields: ["(W) shield"],
  softCrowdControl: ["Empowered (E) slow"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "survive",
    preferredGameLength: "long",
    scalingProfile: "late",
    winMethod: ["Surviving early.", "Stacking aura value.", "Landing (R) on commits."],
  },
  supportSynergy: {
    excellentWith: ["KogMaw", "Jinx", "Vayne"],
    goodWith: ["Nilah", "Zeri", "Smolder"],
    strugglesWith: ["Draven", "Samira", "Kalista"],
    notes: [
      "KogMaw, Jinx, Vayne convert Sona's strongest lane pattern especially well.",
      "Nilah, Zeri, Smolder fit Sona when the lane can play around the same tempo window.",
      "Draven, Samira, Kalista can struggle with Sona when they need a different lane pace or protection pattern.",
  ],
  },
  sustain: ["(W) healing."],
  trading: {
    badTradeConditions: [
      "Mana is low.",
      "(R) is down.",
      "Enemy engage has flash and brush control.",
  ],
    goodTradeConditions: [
      "Enemy engage misses.",
      "ADC can scale safely.",
      "Teamfight is grouped.",
  ],
    primaryPattern: "Take small empowered-auto trades only when safe, heal the return damage, and preserve health until scaling and (R).",
  },
  punishWindows: [
    "Force early level 2 pressure.",
    "Deny brush vision.",
    "Punish her when (R) is down.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
