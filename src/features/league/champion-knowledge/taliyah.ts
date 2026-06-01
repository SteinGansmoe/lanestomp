import type { LeagueChampionKnowledgeProfile } from "./types";

export const taliyahCombatProfile = {
  profileQuality: "draft",
  abilities: {
    Q: "Threaded Volley",
    W: "Seismic Shove",
    E: "Unraveled Earth",
    R: "Weaver's Wall",
  },
  archetype: ["control mage", "roam", "anti-dash", "battle mage"],
  primaryWinCondition: [
    "Control mid wave with (Q), punish movement through (E) and (W), then turn push into river or side-lane pressure.",
  ],
  dangerAbilities: ["(W) displacement", "(E) anti-dash zone"],
  dangerProfile: {
    dangerousWhen: [
      "(E) is available against champions who need to dash or walk through narrow space.",
      "(W) can shove the enemy through (E) for a strong punish window.",
      "She has wave push and can leave lane for river or side-lane pressure.",
    ],
    mustRespect: [
      "(E) punishes dashes and predictable forward movement.",
      "(W) is her main setup and peel tool.",
      "(R) creates map access and cutoffs, but is not a direct lane damage spell.",
    ],
  },
  commonWeaknesses: [
    "Vulnerable when (W) and (E) are down.",
    "Can struggle if long-range champions clear without entering her threat range.",
    "Needs clean spacing because she has limited in-combat mobility.",
  ],
  damageType: "magic",
  hardCrowdControl: ["(W) displacement"],
  id: "Taliyah",
  importantAbilityNotes: [
    "(Q) is her main poke and wave control tool.",
    "(W) sets up displacement and can force enemies through (E).",
    "(E) is strongest into dashes, forced movement, and narrow paths.",
    "(R) is mainly for roaming, cutting off exits, or arriving to fights.",
  ],
  lanePlan: {
    avoids: [
      "Spending (W) and (E) without a clear punish or peel need.",
      "Standing close enough for melee champions to force extended trades after her cooldowns are spent.",
      "Using push without tracking jungle or river threats.",
    ],
    idealLaneState:
      "A controlled mid wave where Taliyah can poke with (Q), hold (W) and (E) for commits, and create roam timers after pushing.",
    wants: [
      "Short trades where (Q) lands while she keeps safe spacing.",
      "Enemy dashes or forward movement into (E) threat.",
      "Wave states that let her move first to river, skirmishes, or side lanes.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Stable wave control with room to kite backward through (E).",
      "River fights where terrain and choke points make (W) and (E) harder to avoid.",
      "Push timers that let her roam without losing too much mid wave tempo.",
    ],
    scalingPriority: "medium",
    winLaneBy: [
      "Punishing dashes or predictable commits with (W) and (E).",
      "Using (Q) to control space and chip health before committing.",
      "Turning mid push into map pressure instead of forcing risky lane all-ins.",
    ],
  },
  majorPowerSpikes: [
    "Level 6 (R) for map plays.",
    "First completed mage item.",
  ],
  matchupPreferences: {
    strongInto: [
      "Dash-reliant champions who must enter (E) threat to trade.",
      "Short-range champions that can be kited through (Q) and (E) space.",
      "Opponents who give her time to push and move first.",
    ],
    weakInto: [
      "Long-range champions who clear safely outside (W) and (E) threat.",
      "Champions that can dodge (W) consistently and punish the cooldown.",
      "Hard engage when she has already spent her defensive tools.",
    ],
  },
  mobilityLevel: "medium",
  name: "Taliyah",
  offMetaRoles: [],
      strategicIdentity: {
        laneGoal: "roam",
        scalingProfile: "mid",
        preferredGameLength: "medium",
        winMethod: ["wave control into roams", "anti-dash punishment", "map pressure"],
      },
      powerSpikes: {
      major: [
        {
          timing: "Level 6",
          reason: "Level 6 (R) for map plays",
          changesGameplay: "Level 6 increases map pressure more than direct lane burst",
          playerAction: "Track (R) availability and use the window for verified all-ins, picks, roams, or defensive resets rather than forcing blind.",
          enemyResponse: "Respect (R) window, hold key defensive tools for the commit, and punish after (R) is spent.",
        },
        {
          timing: "First completed mage item",
          reason: "First completed mage item",
          changesGameplay: "First mage item improves wave control and poke reliability",
          playerAction: "After the item, pressure waves and trades more confidently while still tracking the enemy's main answer.",
          enemyResponse: "Do not treat pre-item trades as still safe once Taliyah's first item threshold is completed.",
        },
      ],
      minor: [
        {
          timing: "Level 3",
          reason: "Level 3 gives her the (Q)-(W)-(E) pattern needed to punish commits, but her major spikes are map and item timings",
          changesGameplay: "Taliyah can punish predictable commits with (W) and (E), but her main spikes are map access and item reliability.",
          playerAction: "Hold (W) and (E) for enemy movement or dash commits instead of forcing low-confidence level 3 trades.",
          enemyResponse: "Avoid telegraphed engages into (W) and (E), then punish her if those tools are spent on the wave.",
        },
      ],
    },
  primaryRoles: ["mid"],
  secondaryRoles: ["jungle"],
  primaryTradingPattern:
    "Use (Q) for short poke and wave control, hold (W) and (E) for enemy commits, then shove and roam when the wave is safe.",
  punishProfile: {
    canPunish: [
      "Dashes through (E) or predictable movement into (W) range.",
      "Enemies who spend mobility before trading.",
      "Slow resets or roams that let her crash the wave and move first.",
    ],
    strugglesToPunish: [
      "Champions who outrange her and avoid (W) and (E) space.",
      "Enemies who can bait (W) and re-engage while it is down.",
    ],
  },
  shields: [],
  softCrowdControl: ["(E) slow"],
  stealthOrInvisibility: null,
  sustain: [],
  trading: {
    badTradeConditions: [
      "(W) and (E) are unavailable.",
      "The enemy can force an extended trade after dodging (W).",
      "The wave or jungle position makes stepping forward unsafe.",
    ],
    goodTradeConditions: [
      "The enemy has used mobility or must walk through (E) space.",
      "Taliyah can land (Q) while keeping enough distance to kite back.",
      "(W) can shove the target through (E) or away from a commit.",
    ],
    primaryPattern:
      "Poke with (Q), preserve (W) and (E) for the enemy's forward movement, and avoid extended trades unless the opponent is trapped in (E) space.",
  },
  punishWindows: [
    "If Taliyah misses (W), she loses her main setup and peel window.",
    "If Taliyah spends (E) early, dash champions can pressure before it returns.",
    "If she pushes without vision, she can be punished while rotating.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
