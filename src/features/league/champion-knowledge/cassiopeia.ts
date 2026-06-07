import type { LeagueChampionKnowledgeProfile } from "./types";

export const cassiopeiaCombatProfile = {
  profileQuality: "draft",
  abilities: {
    Q: "Noxious Blast",
    W: "Miasma",
    E: "Twin Fang",
    R: "Petrifying Gaze",
  },
  archetype: ["battle mage", "DPS", "anti-mobility", "scaling"],
  primaryWinCondition: [
    "Poison targets, maintain spacing, and win extended fights through repeated (E) casts.",
  ],
  dangerAbilities: ["(W) grounding", "(R) stun or slow"],
  dangerProfile: {
    dangerousWhen: [
      "The target is poisoned and Cassiopeia can repeatedly cast (E).",
      "(W) blocks enemy mobility or escape routes.",
      "(R) is available against enemies facing her during an all-in.",
    ],
    mustRespect: [
      "(W) grounds dashes and can trap mobile champions in bad trades.",
      "(R) punishes enemies who face her during commits.",
      "Her sustained damage is much stronger than her short burst.",
    ],
  },
  commonWeaknesses: [
    "Short range compared with artillery mages.",
    "Mana and positioning dependent early.",
    "Punishable if poison misses and she cannot use empowered (E) trades.",
  ],
  damageType: "magic",
  hardCrowdControl: ["(R) stun"],
  id: "Cassiopeia",
  importantAbilityNotes: [
    "(Q) poison enables stronger (E) trades.",
    "(W) grounds and slows, making it critical against mobility.",
    "(E) is her repeated DPS tool when targets are poisoned.",
    "(R) is strongest when enemies are facing her.",
  ],
  lanePlan: {
    avoids: [
      "Trading without poison applied.",
      "Being outranged before she can establish threat.",
      "Spending (W) before the enemy mobility threat matters.",
    ],
    idealLaneState:
      "A mid-range lane where Cassiopeia can hold space, apply poison, and force extended trades on her terms.",
    wants: [
      "Enemies walking into (Q) or (W) range.",
      "Longer trades where (E) can be repeated.",
      "Mobility champions forced to fight inside (W).",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Controlled mid-range trades.",
      "Extended skirmishes where she can keep casting (E).",
      "Front-to-back fights where enemies must walk into her zone.",
    ],
    scalingPriority: "high",
    winLaneBy: [
      "Landing poison before committing to trades.",
      "Using (W) to deny dashes and secure spacing.",
      "Out-damaging opponents in sustained fights.",
    ],
  },
  majorPowerSpikes: ["Level 6 (R).", "First mana/AP item."],
  matchupPreferences: {
    strongInto: [
      "Champions who need to dash into her (W) zone.",
      "Short-range champions that cannot escape extended (E) trades.",
      "Low-range teamfight compositions.",
    ],
    weakInto: [
      "Long-range poke that avoids her sustained damage range.",
      "Burst that kills before she can extend the trade.",
      "Enemies who can bait (W) and re-engage after it ends.",
    ],
  },
  mobilityLevel: "low",
  name: "Cassiopeia",
  offMetaRoles: [],
  strategicIdentity: {
    laneGoal: "scale",
    scalingProfile: "late",
    preferredGameLength: "long",
    winMethod: ["extended fights", "anti-dash zones", "sustained DPS"],
  },
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "Level 6 (R)",
        changesGameplay: "Level 6 makes direct commits much riskier into her",
        playerAction:
          "Track (R) availability and use the window for verified all-ins, picks, roams, or defensive resets rather than forcing blind.",
        enemyResponse:
          "Respect (R) window, hold key defensive tools for the commit, and punish after (R) is spent.",
      },
      {
        timing: "First mana/AP item",
        reason: "First mana/AP item",
        changesGameplay: "Mana and AP items improve her ability to sustain long trades",
        playerAction:
          "After the item, pressure waves and trades more confidently while still tracking the enemy's main answer.",
        enemyResponse:
          "Do not treat pre-item trades as still safe once Cassiopeia's first item threshold is completed.",
      },
    ],
  },
  primaryRoles: ["mid"],
  secondaryRoles: [],
  primaryTradingPattern:
    "Land (Q) or (W), repeat (E) while the target is poisoned, and use (W) or (R) to stop commits.",
  punishProfile: {
    canPunish: [
      "Dashes or forced movement into (W).",
      "Enemies facing her during (R) windows.",
      "Targets who stay poisoned long enough for repeated (E) casts.",
    ],
    strugglesToPunish: [
      "Champions who outrange her and avoid poison.",
      "Short burst trades that end before she can DPS.",
    ],
  },
  shields: [],
  softCrowdControl: ["(W) slow", "(R) slow if enemies are not facing her"],
  stealthOrInvisibility: null,
  sustain: ["(E) heals when used on poisoned targets."],
  trading: {
    badTradeConditions: [
      "(Q) misses and no poison is available.",
      "(W) is down against a mobility champion.",
      "The enemy can burst and leave before (E) DPS matters.",
    ],
    goodTradeConditions: [
      "The enemy is poisoned.",
      "(W) can block a dash or escape path.",
      "Cassiopeia has enough mana and space to extend the trade.",
    ],
    primaryPattern:
      "Poison first, then use repeated (E) damage while holding (W) or (R) for enemy movement.",
  },
  punishWindows: [
    "If Cassiopeia misses (Q), her immediate trade threat drops.",
    "If (W) is down, mobile champions can commit or escape more freely.",
    "If (R) is unavailable, direct all-ins are easier to force.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
