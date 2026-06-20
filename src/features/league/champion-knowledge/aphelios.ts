import type { LeagueChampionKnowledgeProfile } from "./types";

export const apheliosCombatProfile = {
  profileQuality: "reviewed",
  masteryDifficulty: "very_high",
  abilities: {
    Q: "Weapon Ability",
    W: "Phase",
    E: "Weapon Queue",
    R: "Moonlight Vigil",
  },
  archetype: ["marksman", "weapon cycling", "scaling", "setup carry"],
  primaryWinCondition: [
    "Manage weapon states so lane trades, wave control, and objective fights happen around the gun pair that gives Aphelios the strongest temporary window.",
  ],
  dangerAbilities: [
    "Calibrum poke",
    "Severum sustain",
    "Gravitum root",
    "Infernum AoE",
    "Crescendum DPS",
    "(R) weapon burst",
  ],
  dangerProfile: {
    dangerousWhen: [
      "Calibrum gives long-range mark punishment while enemies step up for CS.",
      "Gravitum root is available with support or jungle follow-up.",
      "Infernum or Crescendum creates a temporary all-in or grouped-fight spike.",
      "His support can protect him while he plays around the correct weapon pair.",
    ],
    mustRespect: [
      "His lane strength changes by weapon state, not only by level or item.",
      "Gravitum turns chip damage into crowd control for support follow-up.",
      "Infernum and Crescendum can make close-range or grouped fights much stronger than expected.",
    ],
  },
  commonWeaknesses: [
    "Weak if forced to fight with the wrong weapon pair.",
    "No dash and very support dependent against engage.",
    "Requires planning around ammo and wave state.",
  ],
  damageType: "physical",
  hardCrowdControl: ["Gravitum root"],
  id: "Aphelios",
  importantAbilityNotes: [
    "Calibrum punishes last hits from range and extends follow-up damage through marks.",
    "Severum supports safer sustain trades but does not fix bad all-in positioning.",
    "Gravitum makes support CC or jungle ganks easier to chain.",
    "Infernum can punish grouped minion waves and champions standing near the wave.",
    "Crescendum rewards close-range DPS windows, especially when turrets or support peel keep enemies near him.",
  ],
  lanePlan: {
    avoids: [
      "Taking fights without checking current and next weapon pair.",
      "Pushing past river without support cover because he has no dash.",
      "Spending Gravitum before a real setup window.",
      "Fighting engage lanes when his weapons only provide poke or waveclear.",
    ],
    idealLaneState:
      "A controlled bot lane where Aphelios farms safely, cycles toward useful weapon pairs, and uses support setup to convert the right gun state into trades or objective pressure.",
    wants: [
      "Support peel or CC while he cycles weapons.",
      "Wave states that match the current weapon pair: poke with Calibrum, control with Gravitum, wave punish with Infernum.",
      "Enemy ADCs forced to last-hit while his stronger weapon is available.",
      "Objective setup timed around a strong weapon pair instead of random ammo states.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Stable lanes where he can plan weapon cycles.",
      "Short windows where a specific weapon pair creates an unfair trade.",
      "Grouped objective fights with peel after item spikes.",
    ],
    scalingPriority: "high",
    winLaneBy: [
      "Punishing CS attempts with Calibrum range or Infernum wave splash.",
      "Holding Gravitum for real support or jungle follow-up.",
      "Avoiding bad trades when his weapon state is weak.",
      "Entering dragon fights with a planned weapon pair.",
    ],
  },
  majorPowerSpikes: [
    "Strong weapon pair before a lane trade.",
    "Level 6 (R) with the right weapon effect.",
    "First completed marksman item.",
  ],
  matchupPreferences: {
    strongInto: [
      "Slow lanes that let him scale and plan weapon cycles.",
      "Bot lanes that cannot punish his no-dash window.",
      "Grouped fights where Infernum or Crescendum can take over.",
    ],
    weakInto: [
      "Hard engage before support peel is ready.",
      "Long-range poke that denies stable weapon cycling.",
      "Mobile ADCs that can avoid his best weapon windows.",
    ],
  },
  counters: [
    {
      champion: "KogMaw",
      reasons: [
        "Aphelios can punish Kog'Maw before Kog'Maw has enough attack speed and range uptime.",
        "Severum and Gravitum rotations give Aphelios sustain or setup that Kog'Maw cannot easily match early.",
        "Infernum objective fights can punish Kog'Maw's low mobility if he is forced to group tightly.",
      ],
    },
  ],
  counteredBy: [
    {
      champion: "Caitlyn",
      reasons: [
        "Caitlyn can use range and traps to punish Aphelios before his stronger weapon pairs are ready.",
        "Aphelios has no dash, so Caitlyn's (W) trap setups are hard to escape after support crowd control.",
        "If Caitlyn controls the wave, Aphelios can be denied safe access to early farm and plates.",
      ],
    },
  ],
  mobilityLevel: "none",
  name: "Aphelios",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Strong weapon pair",
        reason: "Weapon combinations create temporary lane and fight spikes",
        changesGameplay:
          "Aphelios can move from weak to threatening depending on whether his current guns match the trade or wave state.",
        playerAction:
          "Plan trades around the active and next weapon pair instead of fighting whenever cooldowns are up.",
        enemyResponse: "Check his weapons before contesting CS, dragon, or all-in windows.",
      },
      {
        timing: "Level 6",
        reason: "(R) gains different value based on the active weapon",
        changesGameplay:
          "Moonlight Vigil can become poke, CC setup, AoE burst, sustain, or close-range DPS amplification.",
        playerAction: "Use (R) only when the active weapon effect fits the fight you are starting.",
        enemyResponse:
          "Spread, disengage, or force him before the dangerous weapon pairing is ready.",
      },
    ],
  },
  primaryRoles: ["adc"],
  secondaryRoles: [],
  primaryTradingPattern:
    "Trade around the current weapon pair: poke with Calibrum, root with Gravitum, punish waves with Infernum, sustain with Severum, and commit with Crescendum only when peel exists.",
  punishProfile: {
    canPunish: [
      "ADC last hits when Calibrum range or Infernum splash is available.",
      "Targets tagged by Gravitum when support can follow.",
      "Grouped enemies standing in Infernum wave or objective setups.",
    ],
    strugglesToPunish: [
      "Fast engage when his weapons do not provide peel.",
      "Opponents who disengage until the strong weapon pair is gone.",
    ],
  },
  shields: [],
  softCrowdControl: ["Gravitum slow"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "scale",
    preferredGameLength: "long",
    scalingProfile: "late",
    winMethod: ["weapon management", "support-protected scaling", "objective fight DPS"],
  },
  supportSynergy: {
    excellentWith: ["Thresh", "Lulu", "Milio"],
    goodWith: ["Braum", "Nautilus", "Janna"],
    strugglesWith: ["Bard", "Pyke", "roam-heavy supports"],
    notes: [
      "Thresh lantern covers Aphelios when he steps up during weak weapon cycles.",
      "Lulu and Milio preserve Aphelios through immobile teamfights and extend his DPS windows.",
      "Hard engage supports work best when they can sync fights with Aphelios' stronger weapon pairs.",
      "Roaming supports can leave Aphelios exposed before he has enough items to defend waves alone.",
    ],
  },
  sustain: ["Severum lifesteal weapon."],
  trading: {
    badTradeConditions: [
      "His current weapons do not match the fight.",
      "Support cannot protect his no-dash positioning.",
      "Gravitum or the key weapon was just spent.",
    ],
    goodTradeConditions: [
      "The active weapon pair creates poke, CC, or DPS advantage.",
      "Enemy ADC must step up for CS into Calibrum or Infernum pressure.",
      "Support can protect him while he uses the weapon window.",
    ],
    primaryPattern:
      "Make the weapon state decide the trade; avoid generic fights when the active guns do not support the lane state.",
  },
  punishWindows: [
    "When he has a weak weapon pair, force before he cycles.",
    "No dash makes him vulnerable if support loses brush or river control.",
    "After Gravitum is spent, his setup threat drops sharply.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
