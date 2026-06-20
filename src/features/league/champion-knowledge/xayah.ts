import type { LeagueChampionKnowledgeProfile } from "./types";

export const xayahCombatProfile = {
  profileQuality: "reviewed",
  masteryDifficulty: "medium",
  abilities: {
    Q: "Double Daggers",
    W: "Deadly Plumage",
    E: "Bladecaller",
    R: "Featherstorm",
  },
  archetype: ["marksman", "self-peel", "scaling", "zone control"],
  primaryWinCondition: [
    "Use feather control, self-peel, and scaling DPS to punish engage lanes and win front-to-back fights after item spikes.",
  ],
  dangerAbilities: ["(E) feather root", "(R) untargetable", "(W) DPS"],
  dangerProfile: {
    dangerousWhen: [
      "Enemies walk through feather lines to engage.",
      "(R) is available to dodge the key commit.",
      "She has items and can control a front-to-back fight with feathers.",
    ],
    mustRespect: [
      "(E) can root targets that chase through feathers.",
      "(R) can deny a major engage or burst window.",
      "Her DPS scales well if she is allowed to stand and fight.",
    ],
  },
  commonWeaknesses: [
    "Shorter range than many lane bullies.",
    "Needs feather setup to threaten roots.",
    "More vulnerable when (R) is down.",
  ],
  damageType: "physical",
  hardCrowdControl: ["(E) root"],
  id: "Xayah",
  importantAbilityNotes: [
    "(Q) and autos place feathers that define whether a trade can become a root.",
    "(W) improves DPS for committed trades but needs enough spacing to keep firing.",
    "(E) punishes enemies who chase through feathers or stand in predictable CS paths.",
    "(R) makes her untargetable and adds feathers, so it can deny all-in lanes and create a return root.",
  ],
  lanePlan: {
    avoids: [
      "Taking poke trades before feather setup exists.",
      "Using (R) for low-value damage instead of avoiding engage.",
      "Standing too far forward when feathers cannot threaten the return path.",
      "Letting long-range ADCs farm freely while she waits for perfect feather lines.",
    ],
    idealLaneState:
      "A controlled bot lane where Xayah farms toward items, places feathers through trades, and punishes engage attempts with (E).",
    wants: [
      "Support can help hold enemies in feather lines.",
      "Safe access to first item spike.",
      "Enemy engage paths that must cross her feathers.",
      "Enemy ADCs stepping forward for CS through existing feather lines.",
      "Wave states where she can place feathers behind the enemy without overextending.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Fights where enemies must engage into her feathers.",
      "Stable lanes that reach item spikes.",
      "Front-to-back teamfights with self-peel available.",
    ],
    scalingPriority: "high",
    winLaneBy: [
      "Punishing linear engage with feather roots.",
      "Using (R) to deny the enemy's key commit.",
      "Scaling into reliable DPS with peel.",
      "Threatening (E) when enemies last-hit in line with her feathers.",
    ],
  },
  majorPowerSpikes: ["Level 6 (R).", "First completed marksman item.", "Two-item DPS spike."],
  matchupPreferences: {
    strongInto: [
      "Engage lanes that must run through feathers.",
      "Short-range ADCs that cannot ignore (E).",
      "Front-to-back fights where self-peel matters.",
    ],
    weakInto: [
      "Long-range poke lanes.",
      "ADC matchups that deny her setup time.",
      "Fights where (R) is forced before the real engage.",
    ],
  },
  counters: [
    {
      champion: "Nilah",
      reasons: [
        "Xayah can punish Nilah when Nilah walks into feather recall paths.",
        "(R) lets Xayah dodge Nilah's key all-in timing and reset spacing.",
        "Feather setup around waves makes it risky for Nilah to commit straight through minions.",
      ],
    },
  ],
  counteredBy: [
    {
      champion: "Caitlyn",
      reasons: [
        "Caitlyn can pressure Xayah before Xayah has enough feathers set up.",
        "Trap zones punish Xayah after she uses (R) or when support CC lands.",
        "Long-range wave pressure can deny Xayah clean feather-control positions.",
      ],
    },
  ],
  mobilityLevel: "medium",
  name: "Xayah",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "(R) gives self-peel and burst avoidance",
        changesGameplay: "Xayah can deny a committed engage and punish the chase with feathers.",
        playerAction: "Hold (R) for the enemy's real commit instead of using it for poke.",
        enemyResponse: "Bait (R) before investing the main engage tools.",
      },
      {
        timing: "Two items",
        reason: "Sustained DPS and feather threat become reliable",
        changesGameplay:
          "She can take longer front-to-back fights if enemies must walk into her setup.",
        playerAction: "Fight around feather lines and punish overcommits with (E).",
        enemyResponse: "Avoid chasing in straight lines through her feathers.",
      },
    ],
  },
  primaryRoles: ["adc"],
  secondaryRoles: [],
  primaryTradingPattern:
    "Trade when feathers can threaten the return path, save (R) for the real engage, and punish chases with (E).",
  punishProfile: {
    canPunish: [
      "Engage champions chasing through feathers.",
      "ADCs that step forward after (W) starts.",
      "Forced fights where (R) dodges the key burst.",
      "Enemy ADCs walking through feather return lines for cannon or melee CS.",
    ],
    strugglesToPunish: [
      "Long-range poke that never enters feather lines.",
      "Disengage that waits out her (W).",
    ],
  },
  shields: [],
  softCrowdControl: [],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "scale",
    preferredGameLength: "long",
    scalingProfile: "late",
    winMethod: ["self-peel", "feather control", "front-to-back DPS"],
  },
  supportSynergy: {
    excellentWith: ["Rakan", "Thresh", "Rell"],
    goodWith: ["Leona", "Nautilus", "Milio"],
    strugglesWith: ["Yuumi", "Sona", "low-pressure scaling supports"],
    notes: [
      "Rakan gives Xayah unique engage and peel timing around feather pullbacks.",
      "Thresh and Rell hold enemies in place long enough for Xayah to set up blade roots.",
      "Leona and Nautilus make it easier to punish enemies who step through feathers.",
      "Very passive supports can leave Xayah without enough pressure to control feather zones.",
    ],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "No feathers threaten the enemy's return path.",
      "(R) is down against all-in threat.",
      "She is outranged and forced to walk into poke.",
    ],
    goodTradeConditions: [
      "Enemy engage must cross feather lines.",
      "Support CC can hold targets for (E).",
      "(R) is available to deny the counter-engage.",
      "The wave lets her place feathers through the enemy's last-hit path.",
    ],
    primaryPattern:
      "Set feathers first, then punish enemies that chase or commit through the pullback line.",
  },
  punishWindows: [
    "After (R), all-in windows are much stronger into her.",
    "If feathers are poorly placed, (E) threat is low.",
    "Long-range poke can pressure her before she sets up.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
