import type { LeagueChampionKnowledgeProfile } from "./types";

export const seraphineCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: { Q: "High Note", W: "Surround Sound", E: "Beat Drop", R: "Encore" },
  archetype: ["support", "mage", "enchanter", "teamfight"],
  primaryWinCondition: [
    "Control waves and grouped fights with poke, shields, and Encore while layering (E) with allied slows or roots.",
  ],
  dangerAbilities: ["Empowered (E)", "(W) sustain", "(R) Encore"],
  dangerProfile: {
    dangerousWhen: [
      "Allies provide slows for (E).",
      "Bot lane groups for empowered spells.",
      "Level 6 can charm through multiple targets.",
  ],
    mustRespect: [
      "Encore can extend through champions.",
      "Her (E) improves dramatically with allied CC.",
      "Empowered spell choice decides trade or sustain value.",
  ],
  },
  commonWeaknesses: [
    "Immobile and vulnerable to engage.",
    "Cooldown dependent.",
    "Weak if forced into scattered fights.",
  ],
  damageType: "magic",
  hardCrowdControl: ["Empowered (E) root/stun", "(R) charm"],
  id: "Seraphine",
  importantAbilityNotes: [
    "Encore can extend through champions.",
    "Her (E) improves dramatically with allied CC.",
    "Empowered spell choice decides trade or sustain value.",
  ],
  lanePlan: {
    avoids: [
      "Standing in engage range.",
      "Wasting empowered spell.",
      "Fighting spread away from her team.",
  ],
    idealLaneState: "A wave-control lane where Seraphine pokes safely, uses empowered (W) to stabilize, and layers (E) with ADC slows.",
    wants: [
      "Grouped allies.",
      "ADC slows or roots.",
      "Wave states where she can poke and shield.",
  ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Poke lanes.",
      "Sustain lanes.",
      "Grouped teamfights.",
  ],
    scalingPriority: "high",
    winLaneBy: [
      "Layering (E).",
      "Sustaining trades.",
      "Landing multi-target (R).",
  ],
  },
  majorPowerSpikes: ["Level 2 poke plus slow/root setup.", "Level 3 shield sustain.", "Level 6 Encore."],
  matchupPreferences: {
    strongInto: [
      "Grouped enemies.",
      "ADCs with slows.",
      "Teamfight comps.",
  ],
    weakInto: [
      "Hard engage.",
      "Flank assassins.",
      "Long-range artillery that outranges her.",
  ],
  },
  mobilityLevel: "none",
  name: "Seraphine",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 2",
        reason: "Level 2 poke plus slow/root setup.",
        changesGameplay: "The first real bot-lane interaction changes once this support can pair two early abilities.",
        playerAction: "Track the level 2 race and only contest the wave if the ADC can follow the support's threat.",
        enemyResponse: "Respect the level 2 timer and back up before the support reaches the wave first.",
      },
      {
        timing: "Level 3",
        reason: "Level 3 shield sustain.",
        changesGameplay: "The full basic kit unlocks the support's main trade, peel, or poke pattern.",
        playerAction: "Use the complete kit around brush control, ADC follow-up, and the enemy support's key cooldown.",
        enemyResponse: "Punish the support after their main cooldown is spent or when the wave blocks their angle.",
      },
      {
        timing: "Level 6",
        reason: "Level 6 Encore.",
        changesGameplay: "The ultimate changes all-in, peel, roam, or objective threat for the bot lane.",
        playerAction: "Use level 6 around confirmed ADC follow-up, river setup, or defensive reset value.",
        enemyResponse: "Track the ultimate cooldown and avoid giving a clean engage or counter-engage angle.",
      },
    ],
  },
  primaryRoles: ["support"],
  secondaryRoles: [],
  primaryTradingPattern: "Poke with (Q), use (E) after slows, and save empowered (W) or (R) for committed fights.",
  punishProfile: {
    canPunish: [
      "Enemies lined behind each other.",
      "Bot lanes slowed by ADC setup.",
      "All-ins that clump into (R).",
  ],
    strugglesToPunish: [
      "Spread targets.",
      "Engage after her empowered spell.",
      "Poke outside her range.",
  ],
  },
  shields: ["(W) shield"],
  softCrowdControl: ["(E) slow"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "survive",
    preferredGameLength: "long",
    scalingProfile: "late",
    winMethod: ["Layering (E).", "Sustaining trades.", "Landing multi-target (R)."],
  },
  supportSynergy: {
    excellentWith: ["Ashe", "MissFortune", "Varus"],
    goodWith: ["Jhin", "Sivir", "Caitlyn"],
    strugglesWith: ["Samira", "Draven", "Kalista"],
    notes: [
      "Ashe, MissFortune, Varus convert Seraphine's strongest lane pattern especially well.",
      "Jhin, Sivir, Caitlyn fit Seraphine when the lane can play around the same tempo window.",
      "Samira, Draven, Kalista can struggle with Seraphine when they need a different lane pace or protection pattern.",
  ],
  },
  sustain: ["(W) healing when empowered."],
  trading: {
    badTradeConditions: [
      "Empowered spell is wrong for the fight.",
      "(E) misses.",
      "She has no flash against engage.",
  ],
    goodTradeConditions: [
      "ADC can slow first.",
      "Enemy team is grouped.",
      "(W) can shield multiple allies.",
  ],
    primaryPattern: "Poke with (Q), use (E) after slows, and save empowered (W) or (R) for committed fights.",
  },
  punishWindows: [
    "Force her to choose between wave and poke.",
    "Engage after (E).",
    "Do not line up for Encore.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
