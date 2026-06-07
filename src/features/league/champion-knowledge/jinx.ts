import type { LeagueChampionKnowledgeProfile } from "./types";

export const jinxCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: {
    Q: "Switcheroo!",
    W: "Zap!",
    E: "Flame Chompers!",
    R: "Super Mega Death Rocket!",
  },
  archetype: ["marksman", "hypercarry", "scaling", "reset carry"],
  primaryWinCondition: [
    "Survive lane with stable CS, reach item spikes, then use range and resets to take over grouped fights.",
  ],
  dangerAbilities: ["(Q) rocket range", "(E) trap zone", "(R) execute"],
  dangerProfile: {
    dangerousWhen: [
      "She has two items and enough frontline or peel to free-hit.",
      "A takedown activates her reset movement speed in fights.",
      "(Q) rockets let her threaten grouped enemies from safer range.",
    ],
    mustRespect: [
      "Her late-game DPS and reset chain can decide teamfights.",
      "(E) can punish predictable engage paths when support CC starts the play.",
      "Her rocket range makes grouped objective fights dangerous after items.",
    ],
  },
  commonWeaknesses: [
    "Weak if engaged before she has peel.",
    "Needs time to scale before she becomes a reliable carry.",
    "Limited mobility before a takedown reset.",
  ],
  damageType: "physical",
  hardCrowdControl: ["(E) root"],
  id: "Jinx",
  importantAbilityNotes: [
    "(Q) rockets give safer CS and poke access, while minigun is for committed DPS when she is protected.",
    "(W) punishes predictable movement after the enemy ADC starts a last-hit or walks through a narrow wave gap.",
    "(E) is best used on enemy engage paths or under support CC, not as random poke.",
    "Passive reset changes fight cleanup; before a takedown she is much easier to reach.",
  ],
  lanePlan: {
    avoids: [
      "Taking unsupported early all-ins.",
      "Pushing past river without vision or support cover.",
      "Trading health before first item when she needs stable CS.",
      "Using rockets so heavily that she loses mana before important wave or dragon contests.",
    ],
    idealLaneState:
      "A controlled bot lane where Jinx farms safely, uses rockets for wave access, and avoids engage until item spikes.",
    wants: [
      "Safe access to first item spike.",
      "Support can protect her through early all-in windows.",
      "Wave states where rockets can contest CS without overextending.",
      "Enemy ADCs grouped with the wave so rocket splash can tag them during CS.",
      "A slow push toward her side where she can farm without exposing her no-dash weakness.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "low",
    lanePressure: "medium",
    preferredGameState: [
      "Stable early waves with low engage risk.",
      "Grouped fights where teammates start the first kill.",
      "Late-game front-to-back fights with peel.",
    ],
    scalingPriority: "very_high",
    winLaneBy: [
      "Preserving health while farming.",
      "Using rockets to contest wave access from range.",
      "Converting first takedown into reset pressure.",
      "Punishing clustered CS attempts with rocket splash instead of walking into short range.",
      "Holding (E) for support-engage paths so enemies cannot freely force through the wave.",
    ],
  },
  majorPowerSpikes: ["First completed item.", "Two-item DPS spike.", "Level 6 (R)."],
  matchupPreferences: {
    strongInto: [
      "Slow lanes that let her reach items.",
      "Front-to-back fights with peel.",
      "Short-range ADCs that cannot punish her scaling window.",
    ],
    weakInto: [
      "Hard engage bot lanes.",
      "Early lane bullies that deny CS.",
      "Dive compositions that reach her before resets.",
    ],
  },
  mobilityLevel: "low",
  name: "Jinx",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "First completed item",
        reason: "Her DPS becomes reliable enough to contest longer trades",
        changesGameplay: "Jinx can start matching wave pressure instead of only preserving health.",
        playerAction:
          "Use item strength to hold wave access while still respecting engage cooldowns.",
        enemyResponse: "Punish her before she stacks items and gets reliable peel.",
      },
      {
        timing: "Two items",
        reason: "Rocket range and sustained DPS become real teamfight threats",
        changesGameplay: "Front-to-back fights become much more dangerous once she can free-hit.",
        playerAction: "Group around objectives where peel and one reset can start the fight chain.",
        enemyResponse: "Force her summoners before grouped fights or deny the first reset.",
      },
    ],
  },
  primaryRoles: ["adc"],
  secondaryRoles: [],
  primaryTradingPattern:
    "Use rockets for safe CS and poke, avoid unsupported extended fights, and turn only when support peel or enemy cooldowns allow it.",
  punishProfile: {
    canPunish: [
      "Teams that fail to finish fights before her reset.",
      "Short-range ADCs after she reaches item range pressure.",
      "Engage paths that walk through (E).",
      "Enemy ADCs standing near low-health caster minions where rocket splash connects.",
      "Supports that commit through a predictable choke and can be trapped by (E).",
    ],
    strugglesToPunish: [
      "Early all-in pressure.",
      "Divers that reach her before peel is available.",
    ],
  },
  shields: [],
  softCrowdControl: ["(W) slow"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "scale",
    preferredGameLength: "long",
    scalingProfile: "late",
    winMethod: ["item scaling", "teamfight resets", "front-to-back DPS"],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "The enemy support can engage before her support can peel.",
      "She is forced into short range without a reset threat.",
      "She trades health before important item timings.",
    ],
    goodTradeConditions: [
      "Rockets can hit without exposing her.",
      "Enemy engage cooldowns are unavailable.",
      "Support peel or CC can stop the enemy commit.",
      "Enemy ADC and minion wave are close enough for rocket splash to punish last hits.",
      "The wave is moving toward Jinx, giving her space to kite after using rockets.",
    ],
    primaryPattern:
      "Preserve health and CS early, then use rocket range and resets to win longer fights after items.",
  },
  punishWindows: [
    "Before first item, she has limited threat in forced all-ins.",
    "If she has no reset, she is easier to run down.",
    "When (E) is down, engage paths are much cleaner.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
