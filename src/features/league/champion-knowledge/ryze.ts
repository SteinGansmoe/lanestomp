import type { LeagueChampionKnowledgeProfile } from "./types";

export const ryzeCombatProfile = {
  profileQuality: "draft",
  abilities: {
    Q: "Overload",
    W: "Rune Prison",
    E: "Spell Flux",
    R: "Realm Warp",
  },
  archetype: ["scaling mage", "battle mage", "waveclear", "roam"],
  primaryWinCondition: [
    "Scale through safe farming, use spell rotations for sustained damage, and convert wave control into map movement.",
  ],
  dangerAbilities: ["(W) root", "(E) spread", "(Q) empowered damage"],
  dangerProfile: {
    dangerousWhen: [
      "He has enough mana and cooldowns to cycle spells repeatedly.",
      "(E) spreads through the wave and sets up (Q) damage.",
      "(W) root can hold a target for follow-up.",
    ],
    mustRespect: [
      "His damage is rotation-based rather than one single spell.",
      "(W) root is more threatening when empowered through (E) setup.",
      "(R) is primarily a map movement tool, not lane burst.",
    ],
  },
  commonWeaknesses: [
    "Short range for a mage.",
    "Needs mana, levels, and items before he becomes reliable.",
    "Can be punished when he steps forward to apply (E) and (W).",
  ],
  damageType: "magic",
  hardCrowdControl: ["(W) root"],
  id: "Ryze",
  importantAbilityNotes: [
    "(Q) is his main repeated damage spell.",
    "(W) roots and helps set up trades.",
    "(E) marks and spreads through targets for empowered interactions.",
    "(R) moves Ryze and allies across the map.",
  ],
  lanePlan: {
    avoids: [
      "Taking long-range poke while trying to reach (E) and (W) range.",
      "Trading without mana for follow-up rotations.",
      "Using wave push without tracking enemy roam or jungle pressure.",
    ],
    idealLaneState:
      "A controlled lane where Ryze can farm, manage mana, and use waveclear to create safe movement windows.",
    wants: [
      "Safe scaling farm.",
      "Short windows to apply (E) and (Q) without being outranged.",
      "Map plays after pushing with (R) or lane tempo.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "low",
    lanePressure: "medium",
    preferredGameState: [
      "Stable waves with farm access.",
      "Mid-game side pressure where his waveclear matters.",
      "Coordinated rotations where (R) creates numbers advantage.",
    ],
    scalingPriority: "high",
    winLaneBy: [
      "Avoiding early health loss while farming.",
      "Using waveclear to stop roams or create his own.",
      "Scaling into sustained spell rotations.",
    ],
  },
  majorPowerSpikes: [
    "First mana/AP item.",
    "Level 6 (R) for map plays.",
  ],
  matchupPreferences: {
    strongInto: [
      "Short-range champions he can root and kite.",
      "Lanes that allow safe farming.",
      "Games where waveclear and rotations are valuable.",
    ],
    weakInto: [
      "Long-range poke that punishes his short range.",
      "Early all-in pressure before items.",
      "Champions who can interrupt his wave control and roams.",
    ],
  },
  mobilityLevel: "medium",
  name: "Ryze",
  offMetaRoles: [],
      strategicIdentity: {
        laneGoal: "scale",
        scalingProfile: "late",
        preferredGameLength: "long",
        winMethod: ["item scaling", "side lane pressure", "map movement"],
      },
      powerSpikes: {
      major: [
        {
          timing: "First mana/AP item",
          reason: "First mana/AP item",
          changesGameplay: "Item and mana scaling are more important to combat threat than level 6 damage",
          playerAction: "After the item, pressure waves and trades more confidently while still tracking the enemy's main answer.",
          enemyResponse: "Do not treat pre-item trades as still safe once Ryze's first item threshold is completed.",
        },
        {
          timing: "Level 6",
          reason: "Level 6 (R) for map plays",
          changesGameplay: "(R) changes map options rather than direct duel power",
          playerAction: "Track (R) availability and use the window for verified all-ins, picks, roams, or defensive resets rather than forcing blind.",
          enemyResponse: "Respect (R) window, hold key defensive tools for the commit, and punish after (R) is spent.",
        },
      ],
    },
  primaryRoles: ["mid"],
  secondaryRoles: ["top"],
  primaryTradingPattern:
    "Use (E) and (Q) for controlled poke, hold (W) to stop enemy commits, and extend only when mana and spacing allow repeated rotations.",
  punishProfile: {
    canPunish: [
      "Enemies who enter (W) range without mobility.",
      "Wave states where (E) spread gives easy (Q) follow-up.",
      "Slow rotations after he gains push control.",
    ],
    strugglesToPunish: [
      "Long-range mages outside his spell range.",
      "Burst champions that kill before his rotations matter.",
    ],
  },
  shields: [],
  softCrowdControl: [],
  stealthOrInvisibility: null,
  sustain: [],
  trading: {
    badTradeConditions: [
      "Low mana prevents follow-up rotations.",
      "The enemy outranges him and can punish his step forward.",
      "(W) is needed defensively and cannot be used for trade setup.",
    ],
    goodTradeConditions: [
      "(E) can spread through wave or target.",
      "(W) can hold the enemy for (Q) follow-up.",
      "Ryze has mana and space for multiple spell rotations.",
    ],
    primaryPattern:
      "Farm and control wave, trade through (E) and (Q), and save (W) to punish commits or secure short rotation windows.",
  },
  punishWindows: [
    "If Ryze is low on mana, his threat drops sharply.",
    "If (W) is down, enemies can commit more freely.",
    "Long-range poke can punish him when he steps up to cast (E).",
  ],
} satisfies LeagueChampionKnowledgeProfile;
