import type { LeagueChampionKnowledgeProfile } from "./types";

export const alistarCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: { Q: "Pulverize", W: "Headbutt", E: "Trample", R: "Unbreakable Will" },
  archetype: ["support", "tank", "engage", "peel"],
  primaryWinCondition: [
    "Use brush control, Flash, or flank angles to create (W)+(Q) engages, then peel carries with knockups and displacement.",
  ],
  dangerAbilities: ["(W)+(Q) combo", "(E) stun", "(R) tower-dive durability"],
  dangerProfile: {
    dangerousWhen: [
      "He controls lane brush and can threaten instant (W)+(Q).",
      "Level 2 arrives first with an ADC ready to follow.",
      "(R) is available for tower dives or extended all-ins.",
  ],
    mustRespect: [
      "His engage range increases sharply from brush or Flash.",
      "(W) can also peel divers away from his ADC.",
      "(R) lets him ignore early burst and finish dives.",
  ],
  },
  commonWeaknesses: [
    "Low poke and weak lane pressure before he finds an angle.",
    "Engage is predictable if brush and flank access are denied.",
    "Can push enemies away from his ADC if (W) timing is poor.",
  ],
  damageType: "magic",
  hardCrowdControl: ["(Q) knockup", "(W) displacement", "(E) stun"],
  id: "Alistar",
  importantAbilityNotes: [
    "His engage range increases sharply from brush or Flash.",
    "(W) can also peel divers away from his ADC.",
    "(R) lets him ignore early burst and finish dives.",
  ],
  lanePlan: {
    avoids: [
      "Being poked out before engage range.",
      "Starting fights without ADC damage in range.",
      "Using (W) before knowing whether he needs engage or peel.",
  ],
    idealLaneState: "A slightly pushing or neutral bot lane where Alistar owns brush and can threaten level 2 or level 3 all-ins without losing too much HP first.",
    wants: [
      "Brush control.",
      "ADC follow-up for knockups.",
      "Wave states that let him walk forward.",
  ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Short all-in windows from brush.",
      "Tower dives after level 6.",
      "Peel fights where divers must pass through him.",
  ],
    scalingPriority: "medium",
    winLaneBy: [
      "Reaching level 2 first.",
      "Forcing enemies to respect brush.",
      "Turning missed enemy poke into direct engage.",
  ],
  },
  majorPowerSpikes: ["Level 2 (W)+(Q) all-in.", "Level 3 adds (E) stun threat.", "Level 6 (R) enables dives and durable peel."],
  matchupPreferences: {
    strongInto: [
      "Immobile poke lanes that lose brush control.",
      "Dive lanes he can interrupt.",
  ],
    weakInto: [
      "Long-range poke that denies engage range.",
      "Disengage supports who cancel his entry.",
  ],
  },
  mobilityLevel: "medium",
  name: "Alistar",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 2",
        reason: "Level 2 (W)+(Q) all-in.",
        changesGameplay: "The first real bot-lane interaction changes once this support can pair two early abilities.",
        playerAction: "Track the level 2 race and only contest the wave if the ADC can follow the support's threat.",
        enemyResponse: "Respect the level 2 timer and back up before the support reaches the wave first.",
      },
      {
        timing: "Level 3",
        reason: "Level 3 adds (E) stun threat.",
        changesGameplay: "The full basic kit unlocks the support's main trade, peel, or poke pattern.",
        playerAction: "Use the complete kit around brush control, ADC follow-up, and the enemy support's key cooldown.",
        enemyResponse: "Punish the support after their main cooldown is spent or when the wave blocks their angle.",
      },
      {
        timing: "Level 6",
        reason: "Level 6 (R) enables dives and durable peel.",
        changesGameplay: "The ultimate changes all-in, peel, roam, or objective threat for the bot lane.",
        playerAction: "Use level 6 around confirmed ADC follow-up, river setup, or defensive reset value.",
        enemyResponse: "Track the ultimate cooldown and avoid giving a clean engage or counter-engage angle.",
      },
    ],
  },
  primaryRoles: ["support"],
  secondaryRoles: [],
  primaryTradingPattern: "Hold brush or flank space, threaten (W)+(Q), and only commit when the ADC can hit during the knockup.",
  punishProfile: {
    canPunish: [
      "ADC last hits near brush.",
      "Supports who spend disengage before he commits.",
      "Bot lanes that push without river or tri-brush vision.",
  ],
    strugglesToPunish: [
      "Lanes that keep him at range.",
      "ADCs who can dash the combo and supports who can interrupt his entry.",
  ],
  },
  shields: [],
  softCrowdControl: [],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "control",
    preferredGameLength: "medium",
    scalingProfile: "mid",
    winMethod: ["Reaching level 2 first.", "Forcing enemies to respect brush.", "Turning missed enemy poke into direct engage."],
  },
  supportSynergy: {
    excellentWith: ["Samira", "Tristana", "Draven"],
    goodWith: ["Kaisa", "Kalista", "Lucian"],
    strugglesWith: ["Ezreal", "Smolder", "Sivir"],
    notes: [
      "Burst and dash ADCs convert his knockups into immediate kills.",
      "He protects short-range carries by knocking divers away after the engage.",
      "Low-commit scaling ADCs can leave his all-in windows under-damaged.",
  ],
  },
  sustain: ["Passive Triumph roar healing."],
  trading: {
    badTradeConditions: [
      "(W) or (Q) is down.",
      "His ADC is too far back to follow.",
      "The enemy wave is too large for an all-in.",
  ],
    goodTradeConditions: [
      "He controls brush.",
      "The enemy support has missed poke or disengage.",
      "His ADC can immediately hit the knocked-up target.",
  ],
    primaryPattern: "Hold brush or flank space, threaten (W)+(Q), and only commit when the ADC can hit during the knockup.",
  },
  punishWindows: [
    "After (W)+(Q) is used, his lane threat drops heavily.",
    "Poke him before he can enter brush.",
    "Freeze away from his engage range and force him to walk through vision.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
