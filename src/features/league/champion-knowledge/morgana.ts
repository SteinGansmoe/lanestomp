import type { LeagueChampionKnowledgeProfile } from "./types";

export const morganaCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: { Q: "Dark Binding", W: "Tormented Shadow", E: "Black Shield", R: "Soul Shackles" },
  archetype: ["support", "pick", "anti-engage", "mage"],
  primaryWinCondition: [
    "Use (Q) pick threat and Black Shield to deny engage while enabling ADC follow-up on rooted targets.",
  ],
  dangerAbilities: ["(Q) binding", "(E) Black Shield", "(R) all-in"],
  dangerProfile: {
    dangerousWhen: [
      "She can protect an ADC from hook or stun engage.",
      "Brush hides (Q) angles.",
      "Level 6 makes close-range all-ins risky.",
  ],
    mustRespect: [
      "Black Shield changes whether engage supports can start fights.",
      "Binding creates long ADC punish windows.",
      "Her cooldowns are long enough to punish when missed.",
  ],
  },
  commonWeaknesses: [
    "Very cooldown dependent.",
    "Low pressure if (Q) misses.",
    "Can be pushed in if she only fishes for bindings.",
  ],
  damageType: "magic",
  hardCrowdControl: ["(Q) root", "(R) stun"],
  id: "Morgana",
  importantAbilityNotes: [
    "Black Shield changes whether engage supports can start fights.",
    "Binding creates long ADC punish windows.",
    "Her cooldowns are long enough to punish when missed.",
  ],
  lanePlan: {
    avoids: [
      "Spending Black Shield before the real engage.",
      "Throwing (Q) through full waves.",
      "Standing in hook range after missing (Q).",
  ],
    idealLaneState: "A controlled lane where Morgana holds (E) for enemy engage and uses brush or minion gaps to land (Q) for ADC follow-up.",
    wants: [
      "ADC trap or skillshot follow-up.",
      "Enemy engage denied by Black Shield.",
      "Brush angles for binding.",
  ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Anti-engage lanes.",
      "Pick lanes from brush.",
      "Bot lanes with trap follow-up.",
  ],
    scalingPriority: "medium",
    winLaneBy: [
      "Landing binding.",
      "Denying engage with Black Shield.",
      "Turning level 6 into a counter-engage.",
  ],
  },
  majorPowerSpikes: ["Level 2 binding plus shield threat.", "Level 3 adds wave/poke zone.", "Level 6 Soul Shackles all-in."],
  matchupPreferences: {
    strongInto: [
      "Hook and stun supports.",
      "Immobile ADCs.",
      "Trap ADC lanes.",
  ],
    weakInto: [
      "Long-range poke.",
      "Double-ranged lanes that avoid binding.",
      "Supports who bait shield then re-engage.",
  ],
  },
  mobilityLevel: "none",
  name: "Morgana",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 2",
        reason: "Level 2 binding plus shield threat.",
        changesGameplay: "The first real bot-lane interaction changes once this support can pair two early abilities.",
        playerAction: "Track the level 2 race and only contest the wave if the ADC can follow the support's threat.",
        enemyResponse: "Respect the level 2 timer and back up before the support reaches the wave first.",
      },
      {
        timing: "Level 3",
        reason: "Level 3 adds wave/poke zone.",
        changesGameplay: "The full basic kit unlocks the support's main trade, peel, or poke pattern.",
        playerAction: "Use the complete kit around brush control, ADC follow-up, and the enemy support's key cooldown.",
        enemyResponse: "Punish the support after their main cooldown is spent or when the wave blocks their angle.",
      },
      {
        timing: "Level 6",
        reason: "Level 6 Soul Shackles all-in.",
        changesGameplay: "The ultimate changes all-in, peel, roam, or objective threat for the bot lane.",
        playerAction: "Use level 6 around confirmed ADC follow-up, river setup, or defensive reset value.",
        enemyResponse: "Track the ultimate cooldown and avoid giving a clean engage or counter-engage angle.",
      },
    ],
  },
  primaryRoles: ["support"],
  secondaryRoles: [],
  primaryTradingPattern: "Hold Black Shield for the enemy's key CC, fish for (Q) from brush, and convert root duration into ADC damage.",
  punishProfile: {
    canPunish: [
      "Engage supports after their first CC is blocked.",
      "ADCs without minion cover.",
      "Face-checking supports.",
  ],
    strugglesToPunish: [
      "Lanes that never enter (Q) range.",
      "Poke after shield is down.",
      "Multiple CC waves.",
  ],
  },
  shields: ["(E) Black Shield"],
  softCrowdControl: [],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "control",
    preferredGameLength: "medium",
    scalingProfile: "mid",
    winMethod: ["Landing binding.", "Denying engage with Black Shield.", "Turning level 6 into a counter-engage."],
  },
  supportSynergy: {
    excellentWith: ["Caitlyn", "Jhin", "Varus"],
    goodWith: ["Ezreal", "MissFortune", "Ashe"],
    strugglesWith: ["Samira", "Nilah", "Kalista"],
    notes: [
      "Caitlyn, Jhin, Varus convert Morgana's strongest lane pattern especially well.",
      "Ezreal, MissFortune, Ashe fit Morgana when the lane can play around the same tempo window.",
      "Samira, Nilah, Kalista can struggle with Morgana when they need a different lane pace or protection pattern.",
  ],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "(Q) misses.",
      "(E) is baited.",
      "Her ADC cannot hit the rooted target.",
  ],
    goodTradeConditions: [
      "Enemy engage is one clear CC tool.",
      "Binding angle is hidden.",
      "ADC has trap or burst follow-up.",
  ],
    primaryPattern: "Hold Black Shield for the enemy's key CC, fish for (Q) from brush, and convert root duration into ADC damage.",
  },
  punishWindows: [
    "Bait Black Shield before using the real engage.",
    "Stand behind minions.",
    "Punish immediately after (Q) misses.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
