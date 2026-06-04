import type { LeagueChampionKnowledgeProfile } from "./types";

export const jayceCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "high",
  abilities: { Q: "To the Skies! / Shock Blast", W: "Lightning Field / Hyper Charge", E: "Thundering Blow / Acceleration Gate", R: "Mercury Cannon / Mercury Hammer" },
  archetype: ["poke", "lane bully", "form-swap skirmisher", "siege"],
  primaryWinCondition: ["Use ranged pressure and empowered (Q) poke to create health leads, then convert form-swap burst into lane priority or side-lane pressure."],
  dangerAbilities: ["Cannon (Q) through (E)", "Hammer (Q) engage", "Hammer (E) knockback"],
  dangerProfile: {
    dangerousWhen: ["Cannon (Q) is empowered through (E).", "He has range advantage and can deny melee last-hits.", "Hammer form can finish a low-health target after poke."],
    mustRespect: ["His early lane pressure is high but execution dependent.", "Poke damage changes all-in thresholds.", "Hammer form commits are punishable if they do not end the fight."],
  },
  commonWeaknesses: ["Mana and cooldown dependent.", "Falls behind if early pressure fails.", "Can be punished after hammer form commit."],
  damageType: "physical",
  hardCrowdControl: ["Hammer (E) knockback"],
  id: "Jayce",
  importantAbilityNotes: ["Cannon (Q) plus (E) is his signature poke.", "Hammer (Q) is a gap close.", "Hammer (E) knocks enemies away.", "(R) swaps forms and resets his combat pattern."],
  lanePlan: {
    avoids: ["Wasting mana on missed poke.", "Hammer jumping into stronger extended duelists.", "Letting scaling champions secure free farm after he wins early push."],
    idealLaneState: "A pressured top lane where Jayce can control range, land empowered poke, and crash waves before enemies can force long fights.",
    wants: ["Ranged harass before melee champions can engage.", "Poke landed before committing hammer form.", "Lane priority from wave pressure and resets."],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    lanePressure: "high",
    preferredGameState: ["Ranged lane pressure.", "Siege and poke setups.", "Short burst trades after health leads."],
    scalingPriority: "medium",
    winLaneBy: ["Denying farm with ranged autos.", "Landing (Q) through (E).", "Converting health leads into wave and plate pressure."],
  },
  majorPowerSpikes: ["Level 1 form access.", "First lethality or damage item.", "Mid-game poke siege."],
  matchupPreferences: {
    strongInto: ["Melee champions vulnerable to ranged pressure.", "Low sustain lanes.", "Compositions that struggle into poke."],
    weakInto: ["Hard engage that reaches him.", "Sustain that neutralizes poke.", "Champions that outscale if he fails to snowball."],
  },
  mobilityLevel: "medium",
  name: "Jayce",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      { timing: "First damage item", reason: "Poke and burst become much more punishing", changesGameplay: "Neutral health states can quickly become dive or crash windows.", playerAction: "Use item spike to pressure waves and land empowered poke before objectives.", enemyResponse: "Avoid taking free poke and punish hammer form cooldowns." },
      { timing: "Mid-game poke siege", reason: "Empowered cannon (Q) controls approaches", changesGameplay: "Teams must respect choke and tower pressure.", playerAction: "Set up vision and fire through (E) before committing.", enemyResponse: "Force engage before poke lands or flank around gate angles." },
    ],
  },
  primaryRoles: ["top"],
  primaryTradingPattern: "Use cannon range and (Q)+(E) poke to create health leads, then hammer form only when the enemy cannot win the extended return trade.",
  punishProfile: {
    canPunish: ["Melee last-hits.", "Targets hit by empowered (Q).", "Low-health enemies after poke."],
    strugglesToPunish: ["Durable sustain lanes.", "Hard engage after he spends hammer form."],
  },
  secondaryRoles: [],
  shields: [],
  softCrowdControl: [],
  stealthOrInvisibility: null,
  strategicIdentity: { laneGoal: "snowball", preferredGameLength: "medium", scalingProfile: "early", winMethod: ["lane pressure", "poke siege", "lane priority"] },
  sustain: [],
  trading: {
    badTradeConditions: ["Mana is low.", "Empowered (Q) misses.", "Hammer form commits into a stronger long duel."],
    goodTradeConditions: ["He has ranged spacing.", "Poke has already landed.", "The enemy's engage tool is down."],
    primaryPattern: "Poke first, build lane priority, and use melee form as a finisher or disengage tool rather than blind engage.",
  },
  punishWindows: ["After hammer (Q) commits, he has limited escape.", "Missed empowered (Q) reduces pressure.", "If early lane is even, his snowball pressure is weaker."],
} satisfies LeagueChampionKnowledgeProfile;
