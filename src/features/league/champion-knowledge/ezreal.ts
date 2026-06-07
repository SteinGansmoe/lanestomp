import type { LeagueChampionKnowledgeProfile } from "./types";

export const ezrealCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "high",
  abilities: {
    Q: "Mystic Shot",
    W: "Essence Flux",
    E: "Arcane Shift",
    R: "Trueshot Barrage",
  },
  archetype: ["marksman", "poke", "skillshot", "safe scaling"],
  primaryWinCondition: [
    "Use safe range, (Q) poke, and (E) safety to survive lane, reach item spikes, and control fights before hard commits happen.",
  ],
  dangerAbilities: ["(Q) poke", "(E) reposition", "(R) global damage"],
  dangerProfile: {
    dangerousWhen: [
      "He can freely land (Q) without being forced into short range.",
      "(E) is available to deny engage or chase a low target.",
      "Item spikes make repeated (Q) hits meaningful before objectives.",
    ],
    mustRespect: [
      "His safety makes careless engage attempts easy to waste.",
      "Repeated (Q) poke can decide dragon setup before the fight starts.",
      "(E) changes whether he can be punished by support engage.",
    ],
  },
  commonWeaknesses: [
    "Weak wave shove if he misses (Q) or is blocked by minions.",
    "Can lack sustained DPS compared with hypercarries.",
    "Much easier to punish after (E) is used.",
  ],
  damageType: "mixed",
  hardCrowdControl: [],
  id: "Ezreal",
  lanePlan: {
    avoids: [
      "Using (E) aggressively without support cover.",
      "Letting stronger waveclear ADCs crash for free.",
      "Taking extended front-to-back fights before item spikes.",
    ],
    idealLaneState:
      "A controlled bot lane where Ezreal farms safely, lands (Q) through openings, and saves (E) for engage.",
    wants: [
      "Safe access to first item spike.",
      "Support can protect him while he contests wave access.",
      "Poke windows before dragon setup or recall timing.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Skillshot poke lanes with room to kite.",
      "Objective setups where he can land repeated (Q).",
      "Mid-game fights before short-range ADCs free-hit.",
    ],
    scalingPriority: "high",
    winLaneBy: [
      "Landing (Q) without spending (E).",
      "Preserving health through enemy engage windows.",
      "Using item spikes to contest waves and objectives.",
    ],
  },
  majorPowerSpikes: ["First completed item.", "Two-item poke spike.", "Level 6 (R)."],
  matchupPreferences: {
    strongInto: [
      "Engage lanes he can kite with (E).",
      "Short-range ADCs that cannot force through his poke.",
      "Slow objective setups where repeated (Q) hits matter.",
    ],
    weakInto: [
      "Heavy waveclear that hides behind minions.",
      "Hard engage after (E) is down.",
      "High-DPS late carries if fights become long front-to-back.",
    ],
  },
  mobilityLevel: "high",
  name: "Ezreal",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "First completed item",
        reason: "(Q) poke starts controlling wave and objective setup",
        changesGameplay:
          "Ezreal can contest space more confidently without entering auto range.",
        playerAction:
          "Use repeated (Q) hits to soften the lane before dragon or turret pressure.",
        enemyResponse:
          "Stand behind minions and punish him if (E) is used forward.",
      },
      {
        timing: "Two items",
        reason: "Poke and cooldown cycling become much more threatening",
        changesGameplay:
          "Objective standoffs become favorable if he lands repeated skillshots first.",
        playerAction:
          "Control fights before they start with poke rather than walking into pure DPS races.",
        enemyResponse:
          "Force decisive engage instead of letting him poke freely.",
      },
    ],
  },
  primaryRoles: ["adc"],
  secondaryRoles: [],
  primaryTradingPattern:
    "Poke with (Q), preserve (E) for engage, and avoid long auto-for-auto fights against higher-DPS ADCs.",
  punishProfile: {
    canPunish: [
      "Engage attempts wasted into (E).",
      "ADC players standing away from minion cover.",
      "Slow setups where repeated (Q) hits land first.",
    ],
    strugglesToPunish: [
      "Waveclear lanes that block (Q).",
      "Late fights where he cannot match sustained DPS.",
    ],
  },
  shields: [],
  softCrowdControl: [],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "scale",
    preferredGameLength: "medium",
    scalingProfile: "mid",
    winMethod: ["safe lane access", "poke control", "mid-game item spikes"],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "(E) is down against engage.",
      "Minions block (Q) and the enemy wins auto trades.",
      "The fight becomes a long DPS race after his poke misses.",
    ],
    goodTradeConditions: [
      "He can land (Q) without entering engage range.",
      "Enemy support cooldowns are down.",
      "(E) is available to deny the return engage.",
    ],
    primaryPattern:
      "Win through skillshot poke and safety; avoid fair standing DPS trades unless the enemy is already softened.",
  },
  punishWindows: [
    "After (E), he is much easier to engage.",
    "If (Q) is blocked by minions, his lane pressure drops.",
    "Before item spikes, stronger all-in lanes can force him off wave access.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
