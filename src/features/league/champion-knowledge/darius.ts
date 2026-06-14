import type { LeagueChampionKnowledgeProfile } from "./types";

export const dariusCombatProfile = {
  profileQuality: "draft",
  abilities: {
    Q: "Decimate",
    W: "Crippling Strike",
    E: "Apprehend",
    R: "Noxian Guillotine",
  },
  archetype: ["juggernaut", "lane bully", "all-in", "reset"],
  primaryWinCondition: [
    "Force extended melee trades, stack passive, and convert level 6 or summoner pressure into lane kills or land outer (Q) for sustain and damage to force enemy out of lane.",
  ],
  dangerAbilities: ["(E) pull", "(Q) outer blade", "(R) execute reset"],
  dangerProfile: {
    dangerousWhen: [
      "He can keep the enemy inside melee range long enough to stack passive.",
      "(E) is available to pull targets who step too close.",
      "Level 6 makes low-health extended trades lethal through (R).",
      "Outer (Q) heals and increases damage, making it a key part of his trading pattern.",
    ],
    mustRespect: [
      "Outer (Q) heals Darius and swings trades.",
      "Five passive stacks massively change all-in math.",
      "(E) threatens any champion that uses mobility too early.",
    ],
  },
  commonWeaknesses: [
    "Low mobility outside summoners.",
    "Can be kited if (E) is baited or outranged.",
    "Short trades that exit before passive stacks deny his best pattern.",
    "If enemy manages to stay close to Darius without getting hit by outer (Q), he will lack sustain",
  ],
  damageType: "physical",
  hardCrowdControl: ["(E) pull"],
  id: "Darius",
  importantAbilityNotes: [
    "(Q) outer edge heals and deals more damage.",
    "(E) pulls and sets up all-ins.",
    "(R) executes and can reset after kills.",
    "Passive bleed stacks make extended trades dangerous.",
  ],
  lanePlan: {
    avoids: [
      "Letting ranged or mobile champions take free short trades.",
      "Using (E) too early into champions with saved mobility.",
      "Pushing without river vision when immobile.",
      "Missing outer (Q) and losing sustain and damage in trades.",
    ],
    idealLaneState:
      "A top wave on his side or near center where enemies must walk into (E) and cannot escape long passive-stack trades.",
    wants: [
      "Enemy champions inside pull range.",
      "Long trades where passive reaches high stacks.",
      "Level 6 execute windows after prior chip damage.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    lanePressure: "high",
    preferredGameState: [
      "Melee champions forced to contest wave near him.",
      "Extended duels with limited disengage.",
      "Side lane where pull threat controls spacing.",
    ],
    scalingPriority: "medium",
    winLaneBy: [
      "Denying safe last hits with (E) threat.",
      "Winning extended trades through passive stacks.",
      "Hitting enemy with outer (Q) for healing and damage.",
      "Using level 6 execute resets to snowball.",
    ],
  },
  majorPowerSpikes: ["Level 1-3 melee pressure.", "Level 6 (R).", "First completed item."],
  matchupPreferences: {
    strongInto: [
      "Immobile melee champions.",
      "Tanks that cannot disengage early trades.",
      "Champions reliant on slow extended fights.",
    ],
    weakInto: [
      "Ranged poke that never enters (E).",
      "Mobility that dodges (E) and exits trades.",
      "Peel or slows that deny passive stacking.",
      "Champions that can stay close without getting hit by outer (Q).",
    ],
  },
  counters: [
    {
      champion: "Garen",
      reasons: [
        "Darius can force extended trades that outdamage Garen before Garen can reset with passive.",
      ],
    },
    {
      champion: "Nasus",
      reasons: [
        "Darius can deny Nasus early stacks by freezing near his side and threatening pull on every last hit.",
      ],
    },
    {
      champion: "Sion",
      reasons: [
        "Darius can punish Sion's slow animations and stack passive through extended melee trades.",
      ],
    },
    {
      champion: "DrMundo",
      reasons: [
        "Darius can pressure Dr. Mundo before durability items and punish him when cleavers do not create enough space.",
      ],
    },
  ],
  counteredBy: [
    {
      champion: "Vayne",
      reasons: [
        "Vayne can kite outside Darius pull range and punish his low mobility with repeated short trades.",
      ],
    },
    {
      champion: "Quinn",
      reasons: [
        "Quinn can deny Darius contact with range, blind, and disengage before passive stacks become threatening.",
      ],
    },
    {
      champion: "Kayle",
      reasons: [
        "Kayle can scale past Darius if she avoids early pull windows and later fights from outside his reach.",
      ],
    },
    {
      champion: "Teemo",
      reasons: [
        "Teemo can blind Darius during key trade windows and chip him down before he can force an all-in.",
      ],
    },
  ],
  mobilityLevel: "low",
  name: "Darius",
  offMetaRoles: ["mid"],
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "(R) execute unlocks lethal and reset threat",
        changesGameplay: "Trades that were only winning before can become immediate kills.",
        playerAction:
          "Stack passive before committing to (R) and use low-health windows decisively.",
        enemyResponse: "Avoid extended trades near execute range and disengage before five stacks.",
      },
      {
        timing: "First bruiser item",
        reason: "Durability and damage make long fights easier to force",
        changesGameplay:
          "Darius can threaten longer chases and survive return burst more reliably.",
        playerAction:
          "Use wave control to force enemies into pull range before starting the trade.",
        enemyResponse: "Keep trades short and punish missed (E).",
      },
    ],
  },
  primaryRoles: ["top"],
  primaryTradingPattern:
    "Threaten (E), force the enemy to either respect the wave or enter melee range, then extend through passive stacks and outer (Q).",
  punishProfile: {
    canPunish: [
      "Melee champions who step into (E) range.",
      "Enemies who gets hit by outer (Q) frequently.",
      "Targets staying in trade after three or more passive stacks.",
    ],
    strugglesToPunish: [
      "Ranged champions with consistent spacing.",
      "Targets that bait (E) and disengage instantly.",
      "Champion able to stay inside (Q) without getting hit by the outer edge.",
    ],
  },
  secondaryRoles: ["jungle"],
  shields: [],
  softCrowdControl: ["(W) slow"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "snowball",
    preferredGameLength: "medium",
    scalingProfile: "early",
    winMethod: ["lane kills", "extended duels", "side-lane pressure"],
  },
  sustain: ["Outer (Q) healing"],
  trading: {
    badTradeConditions: [
      "(E) is down and the enemy can kite.",
      "The enemy can exit before passive stacks build.",
      "He cannot land outer (Q).",
      "Enemy is able to stay close to Darius to avoid being hit by outer (Q) and thus deny him sustain.",
    ],
    goodTradeConditions: [
      "Enemy mobility is spent.",
      "Wave is close enough that a pull starts a long trade.",
      "The target is already chipped before level 6.",
    ],
    primaryPattern:
      "Use pull threat to control spacing, auto and (W) to keep contact, land outer (Q), then finish only after passive stacks create lethal pressure.",
  },
  punishWindows: [
    "When (E) misses, Darius has limited reach.",
    "If outer (Q) is dodged inward, he loses damage and healing.",
    "Short trades before passive stacks deny his main damage pattern.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
