import type { LeagueChampionKnowledgeProfile } from "./types";

export const twitchCombatProfile = {
  profileQuality: "reviewed",
  masteryDifficulty: "medium",
  abilities: {
    Q: "Ambush",
    W: "Venom Cask",
    E: "Contaminate",
    R: "Spray and Pray",
  },
  archetype: ["marksman", "stealth", "scaling", "ambush carry"],
  primaryWinCondition: [
    "Survive lane, create stealth timing pressure with support or jungle help, then use (R) piercing range to clean up grouped fights.",
  ],
  dangerAbilities: ["(Q) stealth", "(E) poison burst", "(R) piercing DPS"],
  dangerProfile: {
    dangerousWhen: [
      "(Q) lets him appear from fog or lane brush with support follow-up.",
      "Enemies are already poisoned enough for (E) to finish a trade.",
      "Level 6 gives long-range piercing autos through grouped targets.",
      "He reaches item spikes and can open fights from unseen angles.",
    ],
    mustRespect: [
      "Missing Twitch from lane changes how far the enemy ADC can walk up for CS.",
      "(R) can hit multiple champions if they line up in wave or objective fights.",
      "His weak early lane can flip if enemies disrespect stealth return timings.",
    ],
  },
  commonWeaknesses: [
    "Weak early if forced into direct lane trades.",
    "No dash and very vulnerable when revealed or caught.",
    "Needs items and setup before becoming a reliable carry.",
  ],
  damageType: "physical",
  hardCrowdControl: [],
  id: "Twitch",
  importantAbilityNotes: [
    "(Q) creates stealth recall, roam, and lane re-entry pressure.",
    "(W) slows and stacks poison, making (E) stronger.",
    "(E) cashes out poison stacks and punishes enemies who stay too long after being tagged.",
    "(R) increases range and pierces targets, so positioning near minion waves or teammates matters.",
  ],
  lanePlan: {
    avoids: [
      "Taking fair early trades against stronger lane ADCs.",
      "Using (Q) where control wards, sweepers, or lane state make the ambush obvious.",
      "Standing in direct engage range after stealth is down.",
      "Fighting before poison stacks make (E) meaningful.",
    ],
    idealLaneState:
      "A patient bot lane where Twitch farms safely, threatens stealth re-entry with support cover, and waits for item or level 6 windows.",
    wants: [
      "Support can help survive early or start fights after stealth.",
      "Enemy ADCs overstepping for CS while Twitch is missing or in stealth.",
      "Grouped enemy formations where (R) pierces multiple targets.",
      "Slow pushes or recall timings that let him disappear from vision.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "low",
    lanePressure: "medium",
    preferredGameState: [
      "Stable early farm into stealth threat.",
      "Ambush windows after enemy vision expires.",
      "Late grouped fights where (R) pierces through teams.",
    ],
    scalingPriority: "high",
    winLaneBy: [
      "Using stealth to punish greedy CS or recall timings.",
      "Avoiding fair trades until poison stacks or support setup exist.",
      "Opening with (R) from an angle that hits both ADC and support.",
      "Scaling into itemized ambush fights.",
    ],
  },
  majorPowerSpikes: ["Level 6 (R)", "First completed marksman item", "Two-item stealth carry spike"],
  matchupPreferences: {
    strongInto: [
      "Passive lanes that let him scale.",
      "Bot lanes that overextend without vision.",
      "Grouped teams vulnerable to piercing (R).",
    ],
    weakInto: [
      "Early lane bullies that deny farm.",
      "Hard engage when stealth is down.",
      "Vision control that removes ambush angles.",
    ],
  },
  counters: [
    {
      champion: "Jinx",
      reasons: [
        "Twitch can use stealth angles to attack Jinx before she has trap control set up.",
        "Spray and Pray lets Twitch outrange Jinx in surprise fights and punish grouped targets.",
        "If Twitch starts fights first, Jinx may die before she can trigger reset movement.",
      ],
    },
  ],
  counteredBy: [
    {
      champion: "Caitlyn",
      reasons: [
        "Caitlyn can punish Twitch's weak early lane with range and wave control.",
        "Trap lines make it harder for Twitch to exit stealth into clean auto range.",
        "If Twitch falls behind, he struggles to reach the item timing needed for flank fights.",
      ],
    },
  ],
  mobilityLevel: "low",
  name: "Twitch",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "(R) gives long-range piercing fight access",
        changesGameplay:
          "Twitch can punish enemies standing near minions, support, or objective choke lines.",
        playerAction:
          "Open from stealth or fog where (R) hits multiple targets before they can spread.",
        enemyResponse:
          "Do not line up with the wave or support when Twitch is missing.",
      },
      {
        timing: "Two items",
        reason: "Stealth openings become real teamfight carry threats",
        changesGameplay:
          "If Twitch finds a flank, one opening can decide the entire fight.",
        playerAction:
          "Use vision denial and support cover to create unseen (R) angles.",
        enemyResponse:
          "Control wards and sweepers must track his flank before objectives.",
      },
    ],
  },
  primaryRoles: ["adc"],
  secondaryRoles: [],
  primaryTradingPattern:
    "Avoid fair early trades, use stealth to punish overextended CS attempts, stack poison with (W) and autos, then cash out with (E) or open fights with (R).",
  punishProfile: {
    canPunish: [
      "ADC players stepping up while Twitch is missing or stealthed.",
      "Enemies grouped with minions during (R).",
      "Targets staying after poison stacks are already applied.",
    ],
    strugglesToPunish: [
      "Strong early lanes that force him under tower.",
      "Vision control that reveals stealth timings.",
    ],
  },
  shields: [],
  softCrowdControl: ["(W) slow"],
  stealthOrInvisibility: "(Q) camouflages Twitch before his attack-speed ambush window.",
  strategicIdentity: {
    laneGoal: "scale",
    preferredGameLength: "long",
    scalingProfile: "late",
    winMethod: ["stealth picks", "ambush flanks", "piercing teamfight DPS"],
  },
  supportSynergy: {
    excellentWith: ["Lulu", "Yuumi", "Milio"],
    goodWith: ["Janna", "Nami", "Rakan"],
    strugglesWith: ["Xerath", "Zyra", "supports that only poke without protecting him"],
    notes: [
      "Lulu and Milio amplify Twitch's stealth ambushes and protect him during Spray and Pray.",
      "Yuumi follows Twitch through stealth setups and strengthens mid-game pick angles.",
      "Janna and Nami give Twitch enough peel or trade power to survive lane.",
      "Poke-only supports can leave Twitch exposed when enemies collapse on his all-in reveal.",
    ],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "He is revealed before the ambush starts.",
      "The enemy ADC wins direct early autos.",
      "He has no poison stacks and cannot make (E) matter.",
    ],
    goodTradeConditions: [
      "Enemy ADC overextends for CS while Twitch is unseen.",
      "(R) can pierce multiple targets.",
      "Support or jungle can follow the stealth opening.",
    ],
    primaryPattern:
      "Twitch wins by changing the fight timing with stealth, not by announcing fair lane trades.",
  },
  punishWindows: [
    "Before items, direct lane pressure can deny him.",
    "After (Q) is revealed or down, engage is cleaner.",
    "Control vision around stealth paths before objectives.",
  ],
} satisfies LeagueChampionKnowledgeProfile;

