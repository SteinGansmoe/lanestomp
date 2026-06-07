import type { LeagueChampionKnowledgeProfile } from "./types";

export const ornnCombatProfile = {
  profileQuality: "draft",
  abilities: {
    Q: "Volcanic Rupture",
    W: "Bellows Breath",
    E: "Searing Charge",
    R: "Call of the Forge God",
  },
  archetype: ["tank", "scaling", "engage", "crowd control"],
  primaryWinCondition: [
    "Neutralize lane with durable trades, scale through item upgrades, and create teamfight picks with layered crowd control.",
  ],
  dangerAbilities: ["(E) terrain knockup", "(W) brittle", "(R) long-range engage"],
  dangerProfile: {
    dangerousWhen: [
      "(Q) creates terrain for (E) knockup.",
      "(W) applies brittle and sets up stronger follow-up.",
      "(R) can start fights from long range or turn ganks.",
    ],
    mustRespect: [
      "Terrain positioning matters against (E).",
      "Brittle increases the danger of follow-up crowd control.",
      "His scaling value rises even from an even lane.",
    ],
  },
  commonWeaknesses: [
    "Low kill pressure if crowd control misses.",
    "Can be pressured by strong early duelists before durability spikes.",
    "Predictable engage paths around terrain and (R).",
  ],
  damageType: "magic",
  hardCrowdControl: ["(E) knockup", "(R) knockup"],
  id: "Ornn",
  importantAbilityNotes: [
    "(Q) makes a pillar that can enable (E).",
    "(W) makes Ornn unstoppable during cast and applies brittle.",
    "(E) knocks up if he hits terrain.",
    "(R) is a two-part long-range engage.",
  ],
  lanePlan: {
    avoids: [
      "Fighting early extended duels into stronger bruisers.",
      "Using (E) without terrain or a confirmed escape plan.",
      "Wasting (R) when no follow-up can happen.",
    ],
    idealLaneState:
      "A stable top lane where Ornn farms safely, trades around brittle and terrain, and reaches teamfight or item-upgrade value.",
    wants: [
      "Even or survivable lanes.",
      "Terrain setups for (E).",
      "Grouped fights where (R) and brittle enable allies.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "low",
    lanePressure: "medium",
    preferredGameState: [
      "Stable farm lanes.",
      "Teamfights with long-range engage.",
      "Scaling games where upgrades and tank value matter.",
    ],
    scalingPriority: "very_high",
    winLaneBy: [
      "Avoiding early snowball against him.",
      "Taking safe brittle trades.",
      "Using level 6 and teamfight engage to create map value.",
    ],
  },
  majorPowerSpikes: [
    "Level 6 (R).",
    "First tank item.",
    "Upgrade/scaling stages later in the game.",
  ],
  matchupPreferences: {
    strongInto: [
      "Lanes that cannot punish his scaling.",
      "Melee champions vulnerable to brittle trades.",
      "Teamfight comps that benefit from engage.",
    ],
    weakInto: [
      "Early duelists that can punish before tank stats.",
      "Splitpushers that avoid teamfights.",
      "Ranged poke that denies stable farm.",
    ],
  },
  mobilityLevel: "low",
  name: "Ornn",
  offMetaRoles: ["support"],
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "(R) unlocks long-range engage and gank setup",
        changesGameplay:
          "Ornn can start fights or turn lane pressure without walking into melee range first.",
        playerAction:
          "Use (R) when follow-up is ready or the enemy lacks space to dodge the second cast.",
        enemyResponse:
          "Keep movement options for the second (R) cast and avoid fighting near terrain.",
      },
      {
        timing: "First tank item",
        reason: "Durability makes neutralizing lane easier",
        changesGameplay: "Ornn can absorb more trades and focus on scaling toward teamfight value.",
        playerAction:
          "Play for stable waves and controlled brittle trades rather than forced kills.",
        enemyResponse: "Create pressure before he becomes too durable to move.",
      },
    ],
  },
  primaryRoles: ["top"],
  primaryTradingPattern:
    "Trade around (Q) terrain, brittle from (W), and (E) knockup while prioritizing stable scaling over risky early all-ins.",
  punishProfile: {
    canPunish: [
      "Enemies standing near terrain.",
      "Targets hit by brittle before follow-up crowd control.",
      "Overextended lanes after level 6.",
    ],
    strugglesToPunish: [
      "Ranged champions who avoid brittle trades.",
      "Splitpushers that ignore his teamfight value.",
    ],
  },
  secondaryRoles: [],
  shields: [],
  softCrowdControl: ["(Q) slow", "brittle follow-up"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "teamfight",
    preferredGameLength: "long",
    scalingProfile: "late",
    winMethod: ["stable scaling", "item upgrades", "crowd-control engage"],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "(E) has no terrain or escape path.",
      "Enemy early damage can force an extended duel.",
      "He has no follow-up for (R).",
    ],
    goodTradeConditions: [
      "Enemy stands near (Q) pillar or wall.",
      "(W) can apply brittle safely.",
      "Team or jungle follow-up is ready for (R).",
    ],
    primaryPattern:
      "Use safe poke and brittle trades, threaten (E) only with terrain, and rely on level 6 plus scaling to decide bigger fights.",
  },
  punishWindows: [
    "Before level 6, Ornn has less long-range engage.",
    "If (E) is used away from terrain, his knockup threat is lower.",
    "Strong early duelists can punish him before tank items.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
