import type { LeagueChampionKnowledgeProfile } from "./types";

export const lockeCombatProfile = {
  profileQuality: "draft",
  abilities: {
    Q: "Ritual Nails",
    W: "Soul Ignition",
    E: "Ashen Pursuit",
    R: "Purgatory",
  },
  archetype: ["assassin", "mage", "melee skirmisher", "execute"],
  primaryWinCondition: [
    "Stack Soul Nails with (Q), use (W) and (E) to force a committed skirmish, then convert low-health targets with (R).",
  ],
  dangerAbilities: [
    "(Q) Soul Nail marks and slow",
    "(E) teleport, target dash, and takedown reset",
    "(R) long-range slow and execute mark",
  ],
  dangerProfile: {
    dangerousWhen: [
      "Targets are already chipped and can fall into (R) execute range.",
      "(Q) nails have marked a target and Locke can consume the marks with attacks or (E).",
      "(E) is available to close distance, consume marks, or reset after a takedown.",
    ],
    mustRespect: [
      "(Q) is the setup tool: multiple nails increase the slow and make his follow-up easier.",
      "(W) gives attack speed and movement speed but spends current health while active.",
      "(R) can convert low-health enemies and permanently improve its execute threshold when Locke seals champions.",
    ],
  },
  commonWeaknesses: [
    "Melee range means he can be poked or zoned before he commits.",
    "(W) costs health over time, so failed all-ins can leave him easier to finish.",
    "He needs mark setup and low-health targets before his execute pressure becomes reliable.",
    "Hard crowd control during (E) follow-up can stop his reset chain.",
  ],
  damageType: "magic",
  hardCrowdControl: [],
  id: "Locke",
  importantAbilityNotes: [
    "Passive: Silver Stake adds magic on-hit damage that increases against lower-health enemies.",
    "(Q) throws Soul Nails that mark, slow, and add bonus magic damage when consumed.",
    "(W) grants attack speed and movement speed while draining current health, then restores part of recent damage taken.",
    "(E) teleports to a location, then dashes on the next attack; takedowns reset its cooldown.",
    "(R) throws a long-range binding artifact that slows, marks, and can execute low-health champions.",
  ],
  lanePlan: {
    avoids: [
      "Taking poke-heavy lanes without enough health to use (W) aggressively.",
      "Using (E) before Soul Nails or enemy cooldowns create a real punish window.",
      "Casting (R) into healthy targets where the execute mark will not threaten a seal.",
    ],
    idealLaneState:
      "A skirmish lane where Locke can thin the wave, mark with (Q), and threaten committed trades once the enemy is low enough for execute pressure.",
    wants: [
      "Short setup trades with (Q) before committing.",
      "Low-health targets that can be forced into (R) execute range.",
      "Fights where takedown resets let (E) turn one kill into a chase.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Scrappy mid-game fights around marked targets.",
      "Enemy lanes that cannot freely kite his (E) follow-up.",
      "Low-health skirmishes where his passive and (R) finish targets.",
    ],
    scalingPriority: "medium",
    winLaneBy: [
      "Landing (Q) nails before trading.",
      "Managing (W) health cost so trades do not backfire.",
      "Holding (E) until it can consume marks, dodge space, or reset after a takedown.",
    ],
  },
  majorPowerSpikes: [
    "Level 3 with (Q), (W), and (E) available.",
    "Level 6 (R) execute mark.",
    "First completed assassin or AP skirmish item.",
  ],
  masteryDifficulty: "medium",
  matchupPreferences: {
    strongInto: [
      "Low-mobility squishies he can mark with (Q).",
      "Champions who fall into predictable low-health all-in windows.",
      "Skirmish-heavy lanes where takedown resets matter.",
    ],
    weakInto: [
      "Long-range poke that keeps him too low to spend health on (W).",
      "Reliable hard crowd control that stops (E) follow-up.",
      "Disengage and peel that denies his execute cleanup.",
    ],
  },
  mobilityLevel: "medium",
  name: "Locke",
  offMetaRoles: [],
  strategicIdentity: {
    laneGoal: "snowball",
    scalingProfile: "mid",
    preferredGameLength: "medium",
    winMethod: ["mark setup", "melee skirmish", "execute cleanup"],
  },
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "Level 6 (R) execute mark",
        changesGameplay:
          "Locke can threaten low-health targets from longer range and convert kills into permanent execute-threshold gains.",
        playerAction:
          "Chip targets with (Q) and passive damage before committing (R), then use (E) resets to chase only after a real takedown angle appears.",
        enemyResponse:
          "Stay above execute range, hold crowd control for his (E) follow-up, and avoid extended low-health fights.",
      },
      {
        timing: "First completed assassin or AP skirmish item",
        reason: "First completed assassin or AP skirmish item",
        changesGameplay:
          "His mark consumption and execute setup become more punishing, especially against isolated squishy targets.",
        playerAction:
          "Look for marked targets and reset chains instead of forcing front-to-back fights into peel.",
        enemyResponse:
          "Deny flank angles, group with peel, and punish (W) health drain when his engage does not find a kill.",
      },
    ],
    minor: [
      {
        timing: "Level 3",
        reason: "Level 3 with (Q), (W), and (E) available",
        changesGameplay:
          "Locke gains his full basic trade pattern: mark with (Q), empower the commit with (W), then reposition or follow with (E).",
        playerAction:
          "Trade only when (Q) creates a mark advantage or the enemy has already spent key control.",
        enemyResponse:
          "Respect his first complete combo, then punish if he spends (E) without securing health advantage.",
      },
    ],
  },
  primaryRoles: ["mid"],
  secondaryRoles: ["jungle"],
  primaryTradingPattern:
    "Mark with (Q), activate (W) for attack speed and movement speed, then use (E) to close distance and consume Soul Nails when the target can be finished.",
  punishProfile: {
    canPunish: [
      "Targets hit by multiple (Q) nails.",
      "Low-health enemies who stay in (R) execute range.",
      "Skirmishes where a takedown can reset (E).",
    ],
    strugglesToPunish: [
      "Champions who keep him outside melee follow-up range.",
      "Teams with reliable disengage after his first (E).",
      "Targets that force him to spend (W) health without giving a kill window.",
    ],
  },
  shields: [],
  softCrowdControl: ["(Q) slow", "(R) slow"],
  stealthOrInvisibility: null,
  sustain: ["(W) restores part of recent damage taken after its health-drain window."],
  trading: {
    badTradeConditions: [
      "(Q) misses or only lightly marks the target.",
      "(W) drains health without creating immediate pressure.",
      "(E) is used before enemy crowd control or disengage is forced out.",
    ],
    goodTradeConditions: [
      "Multiple (Q) nails connect and slow the target.",
      "The enemy is already chipped toward passive and (R) execute pressure.",
      "A takedown is realistic enough for (E) reset value.",
    ],
    primaryPattern:
      "Use (Q) as the setup, treat (W) as a committed skirmish button, and save (E) for follow-up that can actually convert.",
  },
  punishWindows: [
    "After (E) is spent without a takedown, Locke has less access to resets and chase pressure.",
    "If (W) is active but he cannot stay on target, its health cost can make the trade losing.",
    "Before (R) or when targets stay above execute range, his cleanup threat is much lower.",
  ],
  debugNote:
    "Draft profile created from Riot Data Dragon 16.13.1 metadata; review role placement and matchup specifics after live gameplay data is available.",
} satisfies LeagueChampionKnowledgeProfile;
