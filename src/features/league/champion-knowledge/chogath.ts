import type { LeagueChampionKnowledgeProfile } from "./types";

export const chogathCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: { Q: "Rupture", W: "Feral Scream", E: "Vorpal Spikes", R: "Feast" },
  archetype: ["tank", "scaling health stacker", "zone control", "execute"],
  primaryWinCondition: ["Control space with (Q) and (W), survive lane through passive sustain, and scale into durable objective and front-line threat with (R) stacks."],
  dangerAbilities: ["(Q) knockup", "(W) silence", "(R) execute"],
  dangerProfile: {
    dangerousWhen: ["(Q) lands or forces a predictable dodge path.", "(W) silence interrupts the enemy's trade or escape spell.", "(R) is available on a low-health target or objective."],
    mustRespect: ["His crowd control chain is slow but punishing if enemies walk into it.", "(R) changes low-health lane and objective thresholds.", "Free farming lets his durability become a major front-line problem."],
  },
  commonWeaknesses: ["Low mobility.", "Key lane threat depends on landing delayed (Q).", "Can be kited or punished when (Q) and (W) are unavailable."],
  damageType: "magic",
  hardCrowdControl: ["(Q) knockup"],
  id: "Chogath",
  importantAbilityNotes: ["(Q) is delayed area knockup and slow.", "(W) is an area silence.", "(E) adds empowered spikes to autos.", "(R) executes and grants permanent health on kills."],
  lanePlan: {
    avoids: ["Throwing (Q) with no setup.", "Letting mobile enemies bait (Q) before trading.", "Taking long early trades before defensive scaling matters."],
    idealLaneState: "A stable top lane where Chogath can farm, sustain through passive, and threaten (Q) plus (W) when enemies last-hit.",
    wants: ["Predictable enemy movement near minions.", "Short control trades that end after (Q) or (W).", "Time to stack (R) and become a durable front line."],
  },
  laneIdentity: {
    earlyGameAgency: "low",
    lanePressure: "medium",
    preferredGameState: ["Stable farm lanes.", "Objective fights where (R) execute matters.", "Front-to-back teamfights where his area control blocks entrances."],
    scalingPriority: "high",
    winLaneBy: ["Landing (Q) on last-hit timings.", "Silencing key retaliation with (W).", "Using passive sustain to outlast poke."],
  },
  majorPowerSpikes: ["Level 6 (R).", "First tank item.", "Multiple (R) stack durability."],
  matchupPreferences: {
    strongInto: ["Low mobility melee champions.", "Teams that must walk through choke points.", "Lanes that cannot punish his early farming."],
    weakInto: ["High mobility duelists.", "Sustained ranged poke.", "Champions that punish missed (Q) cooldowns."],
  },
  mobilityLevel: "low",
  name: "Chogath",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      { timing: "Level 6", reason: "(R) unlocks execute and permanent health stacking", changesGameplay: "Low-health targets and neutral objectives become much riskier around Chogath.", playerAction: "Use (R) to secure kills, stacks, or objectives instead of wasting it on low-value trades.", enemyResponse: "Avoid staying in lane near execute range and punish him before stacks accumulate." },
      { timing: "Multiple (R) stacks", reason: "Health stacking turns him into a durable front line", changesGameplay: "Bursting through him becomes harder and fights shift around his control zones.", playerAction: "Front line for carries and force enemies through (Q) and (W) zones.", enemyResponse: "Kite him and avoid grouped choke fights." },
    ],
  },
  primaryRoles: ["top"],
  primaryTradingPattern: "Fish for (Q) on last-hit timings, silence with (W) if the enemy commits, and take short trades until (R) execute or tank scaling changes the fight.",
  punishProfile: {
    canPunish: ["Enemies walking predictably for minions.", "Targets caught by (Q) into (W).", "Low-health opponents in (R) range."],
    strugglesToPunish: ["Mobile champions that dodge (Q).", "Ranged champions that never enter silence range."],
  },
  secondaryRoles: [],
  shields: [],
  softCrowdControl: ["(Q) slow", "(E) slow"],
  stealthOrInvisibility: null,
  strategicIdentity: { laneGoal: "scale", preferredGameLength: "long", scalingProfile: "late", winMethod: ["health stacking", "front-line control", "objective execute"] },
  sustain: ["Passive health and mana restore on kills"],
  trading: {
    badTradeConditions: ["(Q) is missed.", "The enemy can kite outside (W).", "He is forced into long early duels before scaling."],
    goodTradeConditions: ["The enemy must last-hit inside (Q) range.", "(W) can interrupt the enemy's main trade spell.", "(R) is available near execute range."],
    primaryPattern: "Use (Q) to threaten space, follow with (W) only when the enemy is committed, and scale through passive sustain and (R) stacks.",
  },
  punishWindows: ["After (Q) misses, his engage threat drops.", "When (W) is down, mobile champions can trade more freely.", "Before level 6 and tank items, he is easier to pressure."],
} satisfies LeagueChampionKnowledgeProfile;

