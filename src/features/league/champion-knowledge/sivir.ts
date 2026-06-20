import type { LeagueChampionKnowledgeProfile } from "./types";

export const sivirCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: {
    Q: "Boomerang Blade",
    W: "Ricochet",
    E: "Spell Shield",
    R: "On The Hunt",
  },
  archetype: ["marksman", "waveclear", "scaling", "teamfight utility"],
  primaryWinCondition: [
    "Use waveclear and Spell Shield to survive pressure, then enable team fights with (R) and ricochet DPS after item spikes.",
  ],
  dangerAbilities: ["(Q) double-hit poke", "(W) ricochet", "(E) Spell Shield", "(R) engage speed"],
  dangerProfile: {
    dangerousWhen: [
      "She can clear waves quickly and deny enemy crash or roam value.",
      "(E) is available to block hook, poke, or engage setup.",
      "Ricochet can punish enemies standing near the wave while last-hitting.",
      "(R) lets her team force or disengage on her timing.",
    ],
    mustRespect: [
      "Spell Shield can flip support cooldown trades by denying the key engage spell.",
      "Her waveclear makes slow pushes and siege setups harder to maintain against her.",
      "She scales into strong grouped fights even if lane is quiet.",
    ],
  },
  commonWeaknesses: [
    "Short auto range compared with lane bullies.",
    "Much easier to punish after Spell Shield is down.",
    "Needs items before her teamfight DPS fully turns on.",
  ],
  damageType: "physical",
  hardCrowdControl: [],
  id: "Sivir",
  importantAbilityNotes: [
    "(Q) can hit twice and punishes predictable last-hit movement.",
    "(W) ricochets through minion waves and can tag ADCs hiding behind their wave.",
    "(E) blocks one spell and restores safety if timed into the matchup's key threat.",
    "(R) changes support and jungle engage ranges for both teams.",
  ],
  lanePlan: {
    avoids: [
      "Wasting (E) before the enemy's key support or poke spell.",
      "Taking short-range auto trades against longer-range ADCs without wave advantage.",
      "Letting enemies freeze when she needs waveclear access.",
      "Fighting before items if the enemy can bypass Spell Shield.",
    ],
    idealLaneState:
      "A controlled waveclear lane where Sivir farms safely, blocks the key spell, and uses ricochet pressure to deny enemy setup.",
    wants: [
      "Wave states where (W) can clear and tag champions behind minions.",
      "Enemy support telegraphing a blockable engage or poke spell.",
      "Grouped fights where (R) gives her team the first movement advantage.",
      "Support that can help her survive early range disadvantage.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Waveclear lanes that neutralize enemy pressure.",
      "Spell Shield mind games against engage or poke supports.",
      "Grouped fights where team speed and ricochet DPS matter.",
    ],
    scalingPriority: "high",
    winLaneBy: [
      "Blocking the matchup-defining spell with (E).",
      "Punishing CS attempts with (Q) pathing or (W) ricochet.",
      "Clearing waves before enemies convert pressure into plates.",
      "Reaching item spikes without falling behind in health or turret.",
    ],
  },
  majorPowerSpikes: [
    "Spell Shield trade windows",
    "First completed marksman item",
    "Level 6 (R) team movement",
  ],
  matchupPreferences: {
    strongInto: [
      "Single-spell engage lanes she can block.",
      "Wave-reliant lanes that need crashes to win.",
      "Grouped fights where her team uses (R) well.",
    ],
    weakInto: [
      "Long-range ADCs that punish her short range.",
      "Multi-threat engage that baits Spell Shield first.",
      "High burst after (E) is down.",
    ],
  },
  mobilityLevel: "medium",
  name: "Sivir",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Spell Shield available",
        reason: "(E) can deny the lane's key engage or poke spell",
        changesGameplay:
          "The enemy support must bait Spell Shield before committing their most important cooldown.",
        playerAction: "Hold (E) for the matchup-defining spell instead of blocking low-value poke.",
        enemyResponse: "Bait (E) first, then force the real trade while it is down.",
      },
      {
        timing: "Level 6",
        reason: "(R) gives teamwide movement for engage or disengage",
        changesGameplay: "Sivir can turn a neutral wave state into a coordinated all-in or escape.",
        playerAction:
          "Use (R) with support or jungle movement, not as a panic button after the fight is lost.",
        enemyResponse: "Track (R) before overextending into her team's engage range.",
      },
    ],
  },
  primaryRoles: ["adc"],
  secondaryRoles: [],
  primaryTradingPattern:
    "Clear and chip with (Q)/(W), hold (E) for the key spell, and avoid short-range auto trades unless wave control or Spell Shield gives advantage.",
  punishProfile: {
    canPunish: [
      "Enemy ADCs standing behind minions when (W) ricochet is active.",
      "Predictable CS movement with (Q) return path.",
      "Supports who telegraph one blockable engage spell.",
    ],
    strugglesToPunish: [
      "Long-range ADCs outside ricochet and auto range.",
      "Lanes that bait Spell Shield before the real commit.",
    ],
  },
  shields: ["(E) Spell Shield"],
  softCrowdControl: [],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "scale",
    preferredGameLength: "medium",
    scalingProfile: "late",
    winMethod: ["waveclear", "spell denial", "teamfight speed"],
  },
  supportSynergy: {
    excellentWith: ["Karma", "Morgana", "Lulu"],
    goodWith: ["Milio", "Janna", "Nami"],
    strugglesWith: ["Pyke", "Blitzcrank", "supports that rely on narrow all-in windows"],
    notes: [
      "Karma and Sivir create strong wave control that forces enemies to farm under pressure.",
      "Morgana protects Sivir while adding binding threat into boomerang follow-up.",
      "Lulu and Milio scale Sivir's teamfight movement and DPS after early waveclear.",
      "Hook supports can feel awkward when Sivir wants steady push instead of coin-flip engages.",
    ],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "(E) is down against engage.",
      "She must trade autos into longer range without wave advantage.",
      "The enemy can freeze outside her safe waveclear range.",
    ],
    goodTradeConditions: [
      "Enemy key spell is blockable and still available.",
      "(W) can tag the enemy ADC through minions.",
      "The wave can be cleared before enemy pressure converts.",
    ],
    primaryPattern:
      "Sivir wins by controlling the wave and key cooldown exchange, not by raw range bullying.",
  },
  punishWindows: [
    "After (E), engage and poke lanes can force harder.",
    "Short range is punishable if she cannot clear the wave.",
    "Before items, she may clear well but lacks full teamfight DPS.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
