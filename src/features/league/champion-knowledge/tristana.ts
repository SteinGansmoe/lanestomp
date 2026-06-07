import type { LeagueChampionKnowledgeProfile } from "./types";

export const tristanaCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: {
    Q: "Rapid Fire",
    W: "Rocket Jump",
    E: "Explosive Charge",
    R: "Buster Shot",
  },
  archetype: ["marksman", "all-in", "reset carry", "tower pressure"],
  primaryWinCondition: [
    "Use level and item spikes to force all-ins or turret pressure, then snowball resets into mid-game objective control.",
  ],
  dangerAbilities: ["(W) jump", "(E) burst", "(R) knockback"],
  dangerProfile: {
    dangerousWhen: [
      "She reaches level 2 first and can jump with support follow-up.",
      "(E) is stacked fully during an all-in.",
      "A takedown resets (W) and lets her continue or escape.",
    ],
    mustRespect: [
      "Her early all-in is dangerous when support setup exists.",
      "(E) gives strong turret and burst pressure.",
      "(R) can finish targets or deny enemy engage.",
    ],
  },
  commonWeaknesses: [
    "Can overcommit if (W) is used forward.",
    "Passive wave push can expose her to bad lane states.",
    "All-ins are weaker if support cannot follow.",
  ],
  damageType: "physical",
  hardCrowdControl: ["(R) knockback"],
  id: "Tristana",
  importantAbilityNotes: [
    "(E) is both her champion burst and turret pressure tool; stacking it fully is what makes trades lethal.",
    "(W) is a commitment unless a reset is likely, so support follow-up and enemy disengage cooldowns decide the play.",
    "Passive (E) splash constantly pushes waves, which can create plate pressure or expose her to engage.",
    "(R) can finish a burst combo or interrupt enemy engage, but using it early can push targets out of follow-up damage.",
  ],
  lanePlan: {
    avoids: [
      "Jumping forward without support follow-up.",
      "Letting passive push create unsafe wave positions.",
      "Taking poke without a clear all-in or reset angle.",
      "Forcing jumps into large enemy waves where minion damage and support peel turn the all-in.",
    ],
    idealLaneState:
      "A pressured bot lane where Tristana hits level spikes first, threatens (W) all-ins, and converts (E) into plates.",
    wants: [
      "Support can follow her jump all-in.",
      "Early level advantage before enemy disengage is ready.",
      "Turret access where (E) turns wave pressure into plates.",
      "Wave crashes that let (E) threaten plates after a recall or kill pressure.",
      "Enemy ADCs standing away from support peel so (W) and (E) can isolate them.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    lanePressure: "high",
    preferredGameState: [
      "Level advantage all-ins.",
      "Turret pressure after winning wave control.",
      "Reset fights where she can jump out or forward again.",
    ],
    scalingPriority: "high",
    winLaneBy: [
      "Forcing level 2 or level 3 all-ins.",
      "Stacking (E) during committed trades.",
      "Taking plates after enemy recalls.",
      "Using passive push intentionally to crash waves instead of accidentally freezing herself out.",
      "Punishing ADCs who step forward after her support creates a reset-ready all-in.",
    ],
  },
  majorPowerSpikes: [
    "Level 2 all-in.",
    "First completed marksman item.",
    "Late-game range scaling.",
  ],
  matchupPreferences: {
    strongInto: [
      "ADC lanes that cannot punish her jump reset.",
      "Squishy targets vulnerable to all-in burst.",
      "Turrets she can pressure after wave wins.",
    ],
    weakInto: [
      "Disengage that stops her jump follow-up.",
      "Poke lanes that chunk her before all-in range.",
      "Wave states where passive push exposes her.",
    ],
  },
  mobilityLevel: "high",
  name: "Tristana",
  offMetaRoles: ["mid"],
  powerSpikes: {
    major: [
      {
        timing: "Level 2",
        reason: "(W) and (E) can create a sudden all-in",
        changesGameplay: "Tristana can punish ADCs that lose the race to level 2.",
        playerAction: "Push for level 2 with support cover and jump only when follow-up is ready.",
        enemyResponse: "Back away before level 2 if she and her support hit it first.",
      },
      {
        timing: "First completed marksman item",
        reason: "All-in burst and turret pressure become more reliable",
        changesGameplay: "Winning one trade can quickly become plates or dragon priority.",
        playerAction: "Turn forced recalls into turret damage with (E).",
        enemyResponse: "Deny clean jumps and punish her passive wave push.",
      },
    ],
  },
  primaryRoles: ["adc"],
  secondaryRoles: ["mid"],
  primaryTradingPattern:
    "Threaten burst with (E), jump only with support follow-up or reset confidence, and convert winning trades into plates.",
  punishProfile: {
    canPunish: [
      "ADCs who lose early level races.",
      "Squishy lanes without disengage.",
      "Low-health targets that enable (W) reset.",
      "Enemy ADCs caught in a small wave where (E) stacks can be completed.",
      "Bot lanes that allow her to crash wave and hit turret with (E).",
    ],
    strugglesToPunish: [
      "Disengage supports that interrupt the jump.",
      "Poke lanes that keep her too low to commit.",
    ],
  },
  shields: [],
  softCrowdControl: [],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "snowball",
    preferredGameLength: "medium",
    scalingProfile: "late",
    winMethod: ["level all-ins", "tower pressure", "reset cleanup"],
  },
  supportSynergy: {
    excellentWith: ["Rell", "Leona", "Nautilus"],
    goodWith: ["Alistar", "Rakan", "Thresh"],
    strugglesWith: ["Yuumi", "Sona", "supports that cannot enable level 2 pressure"],
    notes: [
      "Rell and Leona hold targets still while Tristana stacks (E).",
      "Nautilus and Alistar create reliable jump-in windows for early lane kills.",
      "Rakan and Thresh add engage without completely abandoning Tristana after she jumps.",
      "Low-pressure enchanters can waste Tristana's strongest early all-in timing.",
    ],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "Support cannot follow her jump.",
      "Enemy disengage is ready for (W).",
      "Her passive push exposes her without vision.",
    ],
    goodTradeConditions: [
      "She reaches level 2 first.",
      "The enemy ADC is low enough for (E) burst and reset threat.",
      "Support CC can hold the target during (E) stacks.",
      "Enemy disengage is down before she uses (W) forward.",
      "The wave is small or crashing so her jump does not turn into a minion-damage trap.",
    ],
    primaryPattern:
      "Force committed all-ins around level or support setup, then use reset and turret pressure to snowball.",
  },
  punishWindows: [
    "If (W) is used forward and no reset follows, punish immediately.",
    "Passive wave push can leave her exposed to ganks or engage.",
    "Disengage cooldowns can deny her all-in completely.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
