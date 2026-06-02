import type { LeagueChampionKnowledgeProfile } from "./types";

export const shenCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "high",
  abilities: {
    Q: "Twilight Assault",
    W: "Spirit's Refuge",
    E: "Shadow Dash",
    R: "Stand United",
  },
  archetype: ["tank", "global protector", "taunt engage", "macro side-laner"],
  primaryWinCondition: [
    "Control short trades with empowered (Q), protect key allies with (R), and turn side-lane pressure into map impact instead of pure duel scaling.",
  ],
  dangerAbilities: ["(E) taunt", "(W) attack block", "(R) global shield"],
  dangerProfile: {
    dangerousWhen: [
      "(E) can force a taunt into empowered (Q) trades.",
      "(W) blocks important auto-attack damage during a short trade.",
      "(R) can turn fights elsewhere while Shen holds side-lane pressure.",
    ],
    mustRespect: [
      "His combat threat depends heavily on (E) and blade positioning for empowered (Q).",
      "(W) can invalidate auto-based burst if timed correctly.",
      "His global pressure means a quiet lane can still become map advantage.",
    ],
  },
  commonWeaknesses: [
    "Lower wave clear than many top laners.",
    "Can lose plates or waves after using (R) if the lane is not prepared.",
    "Long duels are weaker when (E), (W), or empowered (Q) are unavailable.",
  ],
  damageType: "mixed",
  hardCrowdControl: ["(E) taunt"],
  id: "Shen",
  importantAbilityNotes: [
    "(Q) pulls Shen's blade and empowers attacks, stronger if the blade passes through an enemy champion.",
    "(W) blocks basic attacks in the protected zone.",
    "(E) dashes and taunts enemies hit.",
    "(R) shields an allied champion and teleports Shen to them.",
  ],
  lanePlan: {
    avoids: [
      "Using (E) aggressively without a wave or escape plan.",
      "Casting (R) while a large enemy wave will crash for free plates.",
      "Taking long duels after his empowered autos and defensive tools are spent.",
    ],
    idealLaneState:
      "A managed top wave where Shen can threaten short empowered (Q) trades, keep (E) as a punish tool, and prepare waves before using (R).",
    wants: [
      "Short trades around empowered (Q) and grasp-style patterns.",
      "Enemy auto attacks committed into (W).",
      "Side-lane states where (R) can influence fights without sacrificing too much wave value.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Short trades where (Q), (W), and (E) decide the exchange.",
      "Side-lane waves prepared before global plays.",
      "Teamfights or skirmishes where (R) changes numbers advantage.",
    ],
    scalingPriority: "medium",
    winLaneBy: [
      "Using empowered (Q) and (W) to win short trades.",
      "Punishing oversteps with (E) taunt.",
      "Converting (R) into map wins without losing too much top tempo.",
    ],
  },
  majorPowerSpikes: ["Level 3 short-trade kit.", "Level 6 (R).", "First tank item."],
  matchupPreferences: {
    strongInto: [
      "Auto-attack reliant champions that lose value into (W).",
      "Squishy targets vulnerable to taunt setup.",
      "Games where global protection can decide skirmishes.",
    ],
    weakInto: [
      "Heavy wave-clear champions that punish (R) usage.",
      "Scaling duelists who outgrow his side-lane damage.",
      "Champions that can bait (E) and force long trades afterward.",
    ],
  },
  mobilityLevel: "medium",
  name: "Shen",
  offMetaRoles: ["support"],
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "(R) unlocks global shield and teleport impact",
        changesGameplay:
          "Shen can turn fights across the map even when top lane is stable.",
        playerAction:
          "Prepare the wave before using (R), then convert the numbers advantage into an objective, kill, or saved carry.",
        enemyResponse:
          "Punish his lane if he leaves with a bad wave or force fights when (R) is down.",
      },
      {
        timing: "First tank item",
        reason: "Durability improves taunt engage and short trade reliability",
        changesGameplay:
          "Shen can absorb more return damage when forcing (E) and empowered (Q) trades.",
        playerAction:
          "Play more confidently around short trades and controlled front-line engages.",
        enemyResponse:
          "Avoid giving free taunt angles and punish his lower wave clear.",
      },
    ],
    minor: [
      {
        timing: "Level 3",
        reason: "Basic kit gives empowered attacks, attack block, and taunt",
        changesGameplay:
          "Shen can set up a complete short trade if (E) lands.",
        playerAction:
          "Look for short taunt trades when the wave does not expose you to a long chase.",
        enemyResponse:
          "Bait (E) before committing to a longer fight.",
      },
    ],
  },
  primaryRoles: ["top"],
  primaryTradingPattern:
    "Set up empowered (Q), threaten short (E) taunt trades, and use (W) to block the enemy's best auto-based response before disengaging.",
  punishProfile: {
    canPunish: [
      "Enemies who walk through his blade for empowered (Q).",
      "Auto attackers committing into (W).",
      "Targets standing in (E) taunt range without mobility.",
    ],
    strugglesToPunish: [
      "Champions with stronger long duels after his short-trade tools are down.",
      "Wave-clear champions that punish him when he uses (R).",
    ],
  },
  secondaryRoles: [],
  shields: ["(R) shield"],
  softCrowdControl: [],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "teamfight",
    preferredGameLength: "medium",
    scalingProfile: "mid",
    winMethod: ["global protection", "short trades", "taunt engage"],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "(E) misses or is used into a losing long trade.",
      "(W) is down into auto-attack damage.",
      "He uses (R) without preparing the wave.",
    ],
    goodTradeConditions: [
      "Empowered (Q) is set up through the enemy.",
      "The enemy's main mobility is down and (E) can connect.",
      "(W) can block the enemy's key auto-attack damage window.",
    ],
    primaryPattern:
      "Use blade position to empower (Q), force short taunt trades with (E), and exit after (W) denies return damage rather than staying for extended duels.",
  },
  punishWindows: [
    "After Shen misses (E), he has less threat and escape.",
    "When (W) is down, auto attackers can punish him more reliably.",
    "After (R), his top wave and tower can be punished if he left at a bad timing.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
