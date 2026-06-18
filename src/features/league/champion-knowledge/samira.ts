import type { LeagueChampionKnowledgeProfile } from "./types";

export const samiraCombatProfile = {
  profileQuality: "reviewed",
  masteryDifficulty: "high",
  abilities: {
    Q: "Flair",
    W: "Blade Whirl",
    E: "Wild Rush",
    R: "Inferno Trigger",
  },
  archetype: ["marksman", "all-in", "reset carry", "engage follow-up"],
  primaryWinCondition: [
    "Pair with engage or knock-up support, survive poke until a real commit window, then stack Style and reset through all-in fights.",
  ],
  dangerAbilities: ["(W) projectile block", "(E) dash reset", "(R) AoE burst"],
  dangerProfile: {
    dangerousWhen: [
      "Her support lands CC that lets her dash in and stack Style safely.",
      "(W) can block the enemy ADC's key projectile or support setup.",
      "She reaches S rank and can channel (R) during a grouped all-in.",
      "A takedown gives (E) reset access to continue the fight.",
    ],
    mustRespect: [
      "Samira is much stronger after allied engage than when forced to start alone.",
      "(W) changes projectile matchups and can deny key poke or CC.",
      "Her all-in threat depends on Style stacking and reset conditions.",
    ],
  },
  commonWeaknesses: [
    "Short range makes poke lanes hard before engage.",
    "Needs allied CC or enemy mistakes to enter safely.",
    "Vulnerable if (W) or (E) is wasted before the real fight.",
  ],
  damageType: "physical",
  hardCrowdControl: [],
  id: "Samira",
  importantAbilityNotes: [
    "(Q) changes between ranged poke and melee slash depending on distance.",
    "(W) blocks projectiles and is matchup-defining into hook, poke, and skillshot lanes.",
    "(E) dashes through targets and resets on takedown, so entering early is risky without kill threat.",
    "(R) requires S rank and rewards committed grouped fights.",
  ],
  lanePlan: {
    avoids: [
      "Walking into poke range without engage pressure.",
      "Using (W) before the enemy key projectile is committed.",
      "Dashing in before support CC or enemy cooldowns create a real reset chance.",
      "Taking passive lanes that let long-range ADCs farm and poke freely.",
    ],
    idealLaneState:
      "A volatile bot lane where Samira's support can threaten engage, forcing enemies to respect dash follow-up and projectile block timing.",
    wants: [
      "Engage or knock-up support that starts fights for her.",
      "Enemy ADCs forced to last-hit close enough for (Q) or dash follow-up.",
      "Small windows after enemy poke or disengage is spent.",
      "Grouped all-ins where Style can stack into (R).",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Engage-support lanes with real all-in threat.",
      "Short explosive fights where resets matter.",
      "Messy skirmishes after enemy CC or poke is spent.",
    ],
    scalingPriority: "medium",
    winLaneBy: [
      "Blocking the key projectile with (W).",
      "Following support CC instead of starting alone.",
      "Punishing ADCs who step forward after disengage is down.",
      "Stacking Style only when the all-in can actually continue.",
    ],
  },
  majorPowerSpikes: ["Level 3 full kit", "Level 6 (R)", "First completed damage item"],
  matchupPreferences: {
    strongInto: [
      "Engage lanes that enable her entry.",
      "Projectile-reliant ADCs or supports she can block with (W).",
      "Squishy bot lanes that die before disengaging.",
    ],
    weakInto: [
      "Long-range poke with disengage.",
      "Point-and-click lockdown that interrupts her commit.",
      "Bot lanes that deny her support's engage angle.",
    ],
  },
  counters: [
    {
      champion: "Jhin",
      reasons: [
        "Samira can block Jhin (W) or parts of his follow-up with (W).",
        "Her dash punishes Jhin during reload windows or after he spends root setup.",
        "Once Samira stacks style, Jhin has limited tools to stop her close-range reset pattern alone.",
      ],
    },
  ],
  counteredBy: [
    {
      champion: "Alistar",
      reasons: [
        "Alistar's main engage and peel tools are not projectiles, so Samira cannot block them with (W).",
        "Point-blank knockup can stop Samira before she reaches (R).",
        "Alistar can survive her return damage with (R) while his team finishes the all-in.",
      ],
    },
  ],
  mobilityLevel: "high",
  name: "Samira",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "(R) rewards full Style stacks in committed fights",
        changesGameplay:
          "A support engage can become a fight-winning burst if Samira enters with cooldowns ready.",
        playerAction: "Wait for allied CC, stack Style quickly, and use (W) to protect the commit.",
        enemyResponse: "Hold disengage or CC for her dash and stop the S-rank channel.",
      },
      {
        timing: "First completed damage item",
        reason: "All-in damage and reset threat become harder to survive",
        changesGameplay: "If she gets the first reset, she can run through bot-side skirmishes.",
        playerAction: "Force fights only with support setup and enemy escape tools tracked.",
        enemyResponse: "Do not offer a low-health reset target after her item timing.",
      },
    ],
  },
  primaryRoles: ["adc"],
  secondaryRoles: [],
  primaryTradingPattern:
    "Absorb poke until support engage or enemy cooldowns create a commit, block the key projectile with (W), then dash in only when Style and reset conditions are realistic.",
  punishProfile: {
    canPunish: [
      "Projectile-reliant trades blocked by (W).",
      "Enemy ADCs standing too close after support CC lands.",
      "Low-health targets that enable (E) reset chains.",
    ],
    strugglesToPunish: [
      "Poke lanes that never allow engage.",
      "Disengage supports that hold tools for her dash.",
    ],
  },
  shields: [],
  softCrowdControl: [],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "snowball",
    preferredGameLength: "medium",
    scalingProfile: "mid",
    winMethod: ["engage follow-up", "reset fights", "projectile denial"],
  },
  supportSynergy: {
    excellentWith: ["Nautilus", "Leona", "Rell"],
    goodWith: ["Alistar", "Rakan", "Thresh"],
    strugglesWith: ["Yuumi", "Soraka", "poke supports without hard CC"],
    notes: [
      "Nautilus and Leona provide reliable knock-up or stun access for Samira's dash-in trades.",
      "Rell and Alistar create multi-target engage windows that set up Samira (R).",
      "Rakan and Thresh can start fights while still giving Samira follow-up flexibility.",
      "Supports without hard CC make it much harder for Samira to stack style safely.",
    ],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "Support cannot start the fight.",
      "(W) is down against key projectiles.",
      "She dashes before enemy disengage or CC is spent.",
    ],
    goodTradeConditions: [
      "Support CC connects.",
      "Enemy key projectile has been blocked or missed.",
      "A low-health target can give (E) reset access.",
    ],
    primaryPattern:
      "Samira trades around all-in conversion, not chip poke; she needs setup before committing.",
  },
  punishWindows: [
    "Before support engage, her short range is punishable.",
    "After (W), projectile lanes can trade much more freely.",
    "If (E) is used in without a reset, she can be kited or locked down.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
