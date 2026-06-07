import type { LeagueChampionKnowledgeProfile } from "./types";

export const kassadinCombatProfile = {
  profileQuality: "draft",
  abilities: {
    Q: "Null Sphere",
    W: "Nether Blade",
    E: "Force Pulse",
    R: "Riftwalk",
  },
  archetype: ["scaling assassin", "anti-mage", "mobility", "burst"],
  primaryWinCondition: [
    "Survive early lane, reach level 6, then scale into mobile burst and side-lane pressure.",
  ],
  dangerAbilities: ["(R) mobility and burst", "(Q) magic shield"],
  dangerProfile: {
    dangerousWhen: [
      "He reaches level 6 and can choose shorter trades with (R).",
      "He has mana and repeated (R) stacks available for burst.",
      "The matchup is magic-damage heavy and gives him time to scale.",
    ],
    mustRespect: [
      "Pre-6 Kassadin is much easier to punish.",
      "(R) changes his threat range and escape options.",
      "(Q) helps him absorb magic poke but not physical pressure.",
    ],
  },
  commonWeaknesses: [
    "Very punishable before level 6.",
    "Weak wave control early.",
    "Can be pressured by physical damage and strong early push.",
  ],
  damageType: "magic",
  hardCrowdControl: [],
  id: "Kassadin",
  importantAbilityNotes: [
    "(Q) gives a magic shield and poke.",
    "(W) restores mana and improves close-range trades.",
    "(E) requires nearby spell casts and slows in an area.",
    "(R) is his defining mobility and burst tool after level 6.",
  ],
  lanePlan: {
    avoids: [
      "Taking extended trades before level 6.",
      "Losing too much health to early wave pressure.",
      "Using (R) repeatedly without mana to escape afterward.",
    ],
    idealLaneState:
      "A safe early lane where Kassadin can farm near tower, preserve health, and reach level 6 without falling too far behind.",
    wants: [
      "Magic damage lanes he can absorb with (Q).",
      "Safe last-hit windows before level 6.",
      "Post-6 short trades and side pressure.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "low",
    lanePressure: "low",
    preferredGameState: [
      "Low-action early lane.",
      "Post-6 skirmishes where he can enter and leave with (R).",
      "Scaling game states where his mobility becomes hard to answer.",
    ],
    scalingPriority: "very_high",
    winLaneBy: [
      "Surviving early punish windows.",
      "Using level 6 to stop being pinned in lane.",
      "Scaling into repeated mobile burst.",
    ],
  },
  majorPowerSpikes: [
    "Level 6 (R).",
    "First completed scaling AP item.",
    "Level 11 stronger (R) uptime and damage.",
  ],
  matchupPreferences: {
    strongInto: [
      "Magic damage champions with low early kill pressure.",
      "Scaling lanes that cannot punish pre-6 weakness.",
      "Backline champions vulnerable to post-6 flanks.",
    ],
    weakInto: [
      "Physical damage lane bullies.",
      "Strong early wave push that denies farm.",
      "Crowd control that locks him after (R).",
    ],
  },
  mobilityLevel: "very_high",
  name: "Kassadin",
  offMetaRoles: [],
  strategicIdentity: {
    laneGoal: "scale",
    scalingProfile: "late",
    preferredGameLength: "long",
    winMethod: ["item scaling", "late game carry", "side lane pressure"],
  },
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "Level 6 (R)",
        changesGameplay: "Level 6 is the critical breakpoint that gives mobility and agency",
        playerAction:
          "Track (R) availability and use the window for verified all-ins, picks, roams, or defensive resets rather than forcing blind.",
        enemyResponse:
          "Respect (R) window, hold key defensive tools for the commit, and punish after (R) is spent.",
      },
      {
        timing: "First completed scaling AP item",
        reason: "First completed scaling AP item",
        changesGameplay: "Later levels and items make repeated (R) use more threatening",
        playerAction:
          "After the item, pressure waves and trades more confidently while still tracking the enemy's main answer.",
        enemyResponse:
          "Do not treat pre-item trades as still safe once Kassadin's first item threshold is completed.",
      },
      {
        timing: "Level 11",
        reason: "Level 11 stronger (R) uptime and damage",
        changesGameplay:
          "Kassadin's later level scaling improves repeat threat and makes loose positioning harder to recover from.",
        playerAction:
          "Use the stronger level breakpoint to contest space more often, but do not skip cooldown or wave checks.",
        enemyResponse:
          "Avoid loose extended fights after this level breakpoint unless Kassadin's key cooldowns are down.",
      },
    ],
  },
  primaryRoles: ["mid"],
  secondaryRoles: [],
  primaryTradingPattern:
    "Before level 6, trade minimally with (Q) and secure CS without overextending; after level 6, use short (R) trades only when mana and escape options are safe.",
  punishProfile: {
    canPunish: [
      "Immobile targets after level 6.",
      "Magic poke that he can shield with (Q).",
      "Enemies who overextend once he has (R).",
    ],
    strugglesToPunish: [
      "Early physical pressure before level 6.",
      "Champions who shove and roam before he can follow.",
    ],
  },
  shields: ["(Q) magic shield"],
  softCrowdControl: ["(E) slow"],
  stealthOrInvisibility: null,
  sustain: [],
  trading: {
    badTradeConditions: [
      "Before level 6 against strong early pressure.",
      "Low mana after repeated (R) casts.",
      "The enemy can lock him down after he uses (R) aggressively.",
    ],
    goodTradeConditions: [
      "(Q) can absorb magic poke.",
      "Level 6 is available and the enemy lacks lockdown.",
      "The target is low enough for short (R) burst.",
    ],
    primaryPattern:
      "Play defensively before level 6, then use (R) for short, controlled trades while preserving mana for escape.",
  },
  punishWindows: [
    "Before level 6, Kassadin has limited mobility and wave control.",
    "If Kassadin spends (R) aggressively with low mana, he can be trapped.",
    "Physical damage lanes punish him harder than magic poke lanes.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
