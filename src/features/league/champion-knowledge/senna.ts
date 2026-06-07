import type { LeagueChampionKnowledgeProfile } from "./types";

export const sennaCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: { Q: "Piercing Darkness", W: "Last Embrace", E: "Curse of the Black Mist", R: "Dawning Shadow" },
  archetype: ["support", "marksman", "poke", "scaling"],
  primaryWinCondition: [
    "Scale through souls while controlling lane with range, sustain, and root pick threat.",
  ],
  dangerAbilities: ["(Q) poke/heal", "(W) root", "(R) global shield"],
  dangerProfile: {
    dangerousWhen: [
      "She can trade from range.",
      "Her ADC benefits from sustain.",
      "Root lands through minions or follow-up CC.",
  ],
    mustRespect: [
      "Senna adds ADC-like damage from support.",
      "Her sustain wins slow lanes.",
      "She is fragile if hard engaged.",
  ],
  },
  commonWeaknesses: [
    "Weak into hard engage.",
    "Can be punished while collecting souls.",
    "Low peel if (W) misses.",
  ],
  damageType: "physical",
  hardCrowdControl: ["(W) root"],
  id: "Senna",
  importantAbilityNotes: [
    "Senna adds ADC-like damage from support.",
    "Her sustain wins slow lanes.",
    "She is fragile if hard engaged.",
  ],
  lanePlan: {
    avoids: [
      "Walking up for souls into engage.",
      "Using (W) without follow-up.",
      "Fighting short-range all-ins.",
  ],
    idealLaneState: "A long-range poke lane where Senna trades with autos and (Q), collects souls safely, and roots enemies who overstep.",
    wants: [
      "Safe soul collection.",
      "ADC who can survive or farm.",
      "Long-range poke trades.",
  ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Poke lanes.",
      "Scaling lanes.",
      "Global shield fights.",
  ],
    scalingPriority: "high",
    winLaneBy: [
      "Winning range trades.",
      "Collecting souls.",
      "Landing (W) after poke.",
  ],
  },
  majorPowerSpikes: ["Level 2 (Q)+(W) trade.", "Level 3 mist reposition.", "Level 6 global shield/damage."],
  matchupPreferences: {
    strongInto: [
      "Low engage lanes.",
      "Short-range ADCs.",
      "Sustain wars.",
  ],
    weakInto: [
      "Hard engage.",
      "Hook supports.",
      "Burst lanes.",
  ],
  },
  mobilityLevel: "low",
  name: "Senna",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 2",
        reason: "Level 2 (Q)+(W) trade.",
        changesGameplay: "The first real bot-lane interaction changes once this support can pair two early abilities.",
        playerAction: "Track the level 2 race and only contest the wave if the ADC can follow the support's threat.",
        enemyResponse: "Respect the level 2 timer and back up before the support reaches the wave first.",
      },
      {
        timing: "Level 3",
        reason: "Level 3 mist reposition.",
        changesGameplay: "The full basic kit unlocks the support's main trade, peel, or poke pattern.",
        playerAction: "Use the complete kit around brush control, ADC follow-up, and the enemy support's key cooldown.",
        enemyResponse: "Punish the support after their main cooldown is spent or when the wave blocks their angle.",
      },
      {
        timing: "Level 6",
        reason: "Level 6 global shield/damage.",
        changesGameplay: "The ultimate changes all-in, peel, roam, or objective threat for the bot lane.",
        playerAction: "Use level 6 around confirmed ADC follow-up, river setup, or defensive reset value.",
        enemyResponse: "Track the ultimate cooldown and avoid giving a clean engage or counter-engage angle.",
      },
    ],
  },
  primaryRoles: ["support"],
  secondaryRoles: [],
  primaryTradingPattern: "Auto and (Q) from max range, hold (W) for oversteps, and avoid soul collection when engage cooldowns are up.",
  punishProfile: {
    canPunish: [
      "ADCs last-hitting in her range.",
      "Supports walking forward without engage.",
      "Low-health cross-map fights with (R).",
  ],
    strugglesToPunish: [
      "Fast all-ins.",
      "Long-range mages matching poke.",
      "Tanks who can ignore her early damage.",
  ],
  },
  shields: ["(R) global shield"],
  softCrowdControl: [],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "control",
    preferredGameLength: "long",
    scalingProfile: "late",
    winMethod: ["Winning range trades.", "Collecting souls.", "Landing (W) after poke."],
  },
  supportSynergy: {
    excellentWith: ["TahmKench", "Ashe", "Jhin"],
    goodWith: ["Varus", "Caitlyn", "Nilah"],
    strugglesWith: ["Draven", "Samira", "Kalista"],
    notes: [
      "TahmKench, Ashe, Jhin convert Senna's strongest lane pattern especially well.",
      "Varus, Caitlyn, Nilah fit Senna when the lane can play around the same tempo window.",
      "Draven, Samira, Kalista can struggle with Senna when they need a different lane pace or protection pattern.",
  ],
  },
  sustain: ["(Q) healing."],
  trading: {
    badTradeConditions: [
      "(W) misses.",
      "She steps up for souls.",
      "Enemy engage has flash or hook available.",
  ],
    goodTradeConditions: [
      "Enemy engage is down.",
      "She can Q through minions or ADC.",
      "Her ADC can follow root.",
  ],
    primaryPattern: "Auto and (Q) from max range, hold (W) for oversteps, and avoid soul collection when engage cooldowns are up.",
  },
  punishWindows: [
    "Engage when she steps up.",
    "Deny free souls.",
    "Force fights before she scales.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
