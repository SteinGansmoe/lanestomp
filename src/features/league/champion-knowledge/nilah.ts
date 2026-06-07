import type { LeagueChampionKnowledgeProfile } from "./types";

export const nilahCombatProfile = {
  profileQuality: "reviewed",
  masteryDifficulty: "high",
  abilities: {
    Q: "Formless Blade",
    W: "Jubilant Veil",
    E: "Slipstream",
    R: "Apotheosis",
  },
  archetype: ["melee marksman", "all-in", "scaling", "support-dependent"],
  primaryWinCondition: [
    "Survive short-range early lane with support help, then use level advantage, engage timing, and (W) protection to win committed all-ins.",
  ],
  dangerAbilities: ["(Q) extended range", "(W) attack immunity", "(E) dash", "(R) AoE pull"],
  dangerProfile: {
    dangerousWhen: [
      "Her support can engage or protect her through the first burst.",
      "(W) is available to deny auto-based retaliation.",
      "She reaches level 6 and can pull multiple targets into a committed fight.",
      "The wave is close enough to her side that her short range is not punished for free.",
    ],
    mustRespect: [
      "Her short range is a weakness until support setup turns it into all-in access.",
      "(W) can make normal ADC auto-trade logic fail for a short window.",
      "Her passive XP and scaling can flip lanes if enemies only farm calmly.",
    ],
  },
  commonWeaknesses: [
    "Very short range before she commits.",
    "Needs support help to enter fights safely.",
    "Can be punished hard by poke and wave denial.",
  ],
  damageType: "physical",
  hardCrowdControl: ["(R) pull"],
  id: "Nilah",
  importantAbilityNotes: [
    "(Q) gives temporary range and wave interaction after it hits.",
    "(W) blocks auto attacks, which is especially important against marksmen.",
    "(E) needs a target and is a commitment tool, not free mobility.",
    "(R) rewards fighting grouped enemies with support follow-up.",
  ],
  lanePlan: {
    avoids: [
      "Standing in poke range before (Q) range or support setup is available.",
      "Using (E) forward without support follow-up.",
      "Fighting after (W) is down against auto-heavy ADCs.",
      "Letting long-range ADCs freeze and deny her CS.",
    ],
    idealLaneState:
      "A short lane near Nilah's side where she can farm with support protection, then commit when enemy poke or disengage is down.",
    wants: [
      "Engage, sustain, or peel support that helps her cross range gaps.",
      "Enemy ADCs forced close to last-hit or contest a crashing wave.",
      "All-in windows where (W) denies autos and (R) keeps enemies in range.",
      "Stable XP access so passive level pressure matters.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Protected farming until level or item windows.",
      "Committed all-ins after enemy cooldowns are spent.",
      "Grouped fights where (R) and support follow-up keep enemies close.",
    ],
    scalingPriority: "high",
    winLaneBy: [
      "Preserving health through poke lanes.",
      "Punishing CS attempts only when the enemy ADC steps into her short threat range.",
      "Using (W) to deny auto retaliation during all-ins.",
      "Turning support engage into (E) and (R) commitment.",
    ],
  },
  majorPowerSpikes: ["Level 3 all-in tools", "Level 6 (R)", "First completed marksman item"],
  matchupPreferences: {
    strongInto: [
      "Auto-attack reliant ADCs she can block with (W).",
      "Engage-support lanes that can start fights for her.",
      "Short fights where enemies cannot kite her out.",
    ],
    weakInto: [
      "Long-range poke and wave denial.",
      "Disengage supports that stop her (E) follow-up.",
      "Bot lanes that freeze outside her safe range.",
    ],
  },
  mobilityLevel: "medium",
  name: "Nilah",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "(R) turns a support engage into a full committed fight",
        changesGameplay:
          "Nilah can keep multiple enemies close long enough for her short-range damage to matter.",
        playerAction:
          "Commit with support setup and use (W) to deny the enemy ADC's auto response.",
        enemyResponse:
          "Disengage before she reaches melee range or wait out (W).",
      },
      {
        timing: "First completed marksman item",
        reason: "All-in damage becomes more reliable if she can enter safely",
        changesGameplay:
          "Her short-range commits can become kill threats instead of only defensive trades.",
        playerAction:
          "Use item timing to force fights when support can start and enemy poke is down.",
        enemyResponse:
          "Keep the wave away from her and punish before she dashes in.",
      },
    ],
  },
  primaryRoles: ["adc"],
  secondaryRoles: [],
  primaryTradingPattern:
    "Farm carefully through range disadvantage, then all-in with support setup, (W) anti-auto timing, and (R) to keep targets close.",
  punishProfile: {
    canPunish: [
      "Auto-reliant ADCs during (W).",
      "Enemy ADCs stepping too close to contest a wave crash.",
      "Bot lanes that spend disengage before her support engages.",
    ],
    strugglesToPunish: [
      "Long-range poke that never enters her threat range.",
      "Disengage supports that deny the first commit.",
    ],
  },
  shields: [],
  softCrowdControl: [],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "scale",
    preferredGameLength: "medium",
    scalingProfile: "mid",
    winMethod: ["support all-ins", "short-range scaling", "anti-auto windows"],
  },
  supportSynergy: {
    excellentWith: ["Rell", "Nautilus", "Taric"],
    goodWith: ["Soraka", "Sona", "Nami"],
    strugglesWith: ["Xerath", "Lux", "roam-heavy poke supports"],
    notes: [
      "Rell and Nautilus bring the layered engage Nilah needs to enter short-range fights.",
      "Taric pairs well with Nilah's dive timing and can protect her during committed all-ins.",
      "Sustain enchanters help Nilah survive poke lanes until her short-range skirmishing matters.",
      "Long-range poke supports can leave Nilah unable to threaten without a real engage tool.",
    ],
  },
  sustain: ["Passive improves allied healing and shielding."],
  trading: {
    badTradeConditions: [
      "Enemy ADC can poke from outside her threat range.",
      "(W) is down before the all-in starts.",
      "Support cannot help her cross the range gap.",
    ],
    goodTradeConditions: [
      "Enemy poke or disengage is down.",
      "Support engage gives her a target for (E).",
      "(W) can deny the enemy ADC's main auto response.",
    ],
    primaryPattern:
      "Nilah wants protected farm into decisive all-ins, not repeated poke trades.",
  },
  punishWindows: [
    "Before support setup, her short range is exploitable.",
    "After (W), auto-heavy ADCs can trade back normally.",
    "If (E) is used forward without a kill angle, she can be kited.",
  ],
} satisfies LeagueChampionKnowledgeProfile;

