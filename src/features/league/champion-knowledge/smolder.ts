import type { LeagueChampionKnowledgeProfile } from "./types";

export const smolderCombatProfile = {
  profileQuality: "reviewed",
  masteryDifficulty: "medium",
  abilities: {
    Q: "Super Scorcher Breath",
    W: "Achooo!",
    E: "Flap, Flap, Flap",
    R: "MMOOOMMMM!",
  },
  archetype: ["marksman", "scaling", "poke", "execute"],
  primaryWinCondition: [
    "Stack (Q) safely through lane, avoid early all-ins, and reach scaling thresholds where poke and execute pressure take over fights.",
  ],
  dangerAbilities: ["Stacked (Q)", "(W) poke", "(E) flight", "(R) lane swing"],
  dangerProfile: {
    dangerousWhen: [
      "He farms safely and stacks (Q) without losing health.",
      "(W) can punish ADCs grouped with the wave.",
      "(E) is available to escape over terrain or reposition away from engage.",
      "Later (Q) thresholds add stronger poke and execute pressure.",
    ],
    mustRespect: [
      "Smolder is weak if denied stacks, but becomes much harder to handle as (Q) evolves.",
      "(E) changes engage angles because terrain can become an escape route.",
      "(R) can swing bot lane health totals during dives or objective fights.",
    ],
  },
  commonWeaknesses: [
    "Needs stacks and time before becoming threatening.",
    "Can be bullied by early lane pressure.",
    "Vulnerable when (E) is down or terrain escape is unavailable.",
  ],
  damageType: "mixed",
  hardCrowdControl: [],
  id: "Smolder",
  importantAbilityNotes: [
    "(Q) stacking is the central lane objective and should shape CS decisions.",
    "(W) poke is strongest when enemies stand near minions or predictable last-hit paths.",
    "(E) provides terrain mobility but can be punished if forced early.",
    "(R) can heal Smolder and damage enemies, making low-health dives risky.",
  ],
  lanePlan: {
    avoids: [
      "Trading health for low-value CS when he needs safe stacks.",
      "Using (E) aggressively before enemy engage is spent.",
      "Letting early bullies freeze and deny (Q) stacking.",
      "Taking extended early fights before stack thresholds.",
    ],
    idealLaneState:
      "A stable bot lane where Smolder last-hits with (Q), pokes when enemies group with the wave, and keeps (E) ready for engage.",
    wants: [
      "Safe access to (Q) stacks.",
      "Support peel or sustain through early pressure.",
      "Wave states where he can last-hit without standing in engage range.",
      "Enemy ADCs forced into predictable CS paths for (W) or (Q) poke.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "low",
    lanePressure: "medium",
    preferredGameState: [
      "Stable farming lanes with low all-in risk.",
      "Scaling windows where (Q) thresholds come online.",
      "Objective fights after poke and execute pressure are active.",
    ],
    scalingPriority: "very_high",
    winLaneBy: [
      "Stacking (Q) without bleeding health.",
      "Using (W) to punish enemies grouped near the wave.",
      "Saving (E) for real engage threats.",
      "Reaching thresholds where his poke and execute change fights.",
    ],
  },
  majorPowerSpikes: ["Early (Q) stack thresholds", "Level 6 (R)", "Late (Q) execute scaling"],
  matchupPreferences: {
    strongInto: [
      "Slow lanes that let him stack.",
      "Bot lanes that cannot force through (E) and support peel.",
      "Late fights where execute pressure matters.",
    ],
    weakInto: [
      "Early lane bullies that deny stacks.",
      "Hard engage after (E) is down.",
      "Wave control that freezes him away from safe (Q) last hits.",
    ],
  },
  mobilityLevel: "medium",
  name: "Smolder",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "(Q) stack thresholds",
        reason: "Each threshold improves Smolder's poke and scaling threat",
        changesGameplay:
          "A quiet lane becomes increasingly favorable for Smolder even without early kills.",
        playerAction:
          "Prioritize safe (Q) last hits and avoid trades that cost stack access.",
        enemyResponse:
          "Pressure him before thresholds instead of letting him farm calmly.",
      },
      {
        timing: "Level 6",
        reason: "(R) can swing low-health lane fights and punish dives",
        changesGameplay:
          "Enemies must account for a long-range damage and healing swing before committing.",
        playerAction:
          "Use (R) when the enemy commits or when it protects a stack and wave state.",
        enemyResponse:
          "Do not dive or all-in low health without tracking (R).",
      },
    ],
  },
  primaryRoles: ["adc"],
  secondaryRoles: [],
  primaryTradingPattern:
    "Prioritize safe (Q) stacks, poke with (W) when enemies group with the wave, and save (E) for engage rather than forcing early trades.",
  punishProfile: {
    canPunish: [
      "Enemy ADCs standing near minions for (W) splash poke.",
      "Low-health enemies trying to force through (R).",
      "Passive lanes that give free (Q) stacks.",
    ],
    strugglesToPunish: [
      "Early bullies that deny stack access.",
      "Hard engage after (E) is forced.",
    ],
  },
  shields: [],
  softCrowdControl: [],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "scale",
    preferredGameLength: "long",
    scalingProfile: "late",
    winMethod: ["Q stacking", "poke scaling", "execute pressure"],
  },
  supportSynergy: {
    excellentWith: ["Milio", "Lulu", "Janna"],
    goodWith: ["Karma", "Nami", "Braum"],
    strugglesWith: ["Pyke", "Leona", "hard engage that demands early fighting"],
    notes: [
      "Milio and Lulu protect Smolder while he stacks and reaches stronger ability upgrades.",
      "Janna and Braum reduce dive threat during Smolder's vulnerable early waves.",
      "Karma and Nami help him contest lanes without sacrificing scaling.",
      "Early hard-engage supports can force fights before Smolder has enough damage to contribute.",
    ],
  },
  sustain: ["(R) can heal Smolder when it returns to him."],
  trading: {
    badTradeConditions: [
      "(E) is down against engage.",
      "He trades health instead of securing (Q) stacks.",
      "The enemy freezes outside his safe last-hit range.",
    ],
    goodTradeConditions: [
      "He can last-hit with (Q) safely.",
      "Enemy ADC stands near the wave for (W) poke.",
      "Support can protect him while he scales.",
    ],
    primaryPattern:
      "Smolder's best lane trade is often safe stack progress; force only when poke or (R) makes the exchange clean.",
  },
  punishWindows: [
    "Before (Q) thresholds, pressure him hard.",
    "After (E), engage is much more reliable.",
    "Freezes that deny (Q) last hits slow his win condition.",
  ],
} satisfies LeagueChampionKnowledgeProfile;

