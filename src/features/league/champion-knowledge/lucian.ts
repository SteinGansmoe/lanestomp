import type { LeagueChampionKnowledgeProfile } from "./types";

export const lucianCombatProfile = {
  profileQuality: "reviewed",
  masteryDifficulty: "medium",
  abilities: {
    Q: "Piercing Light",
    W: "Ardent Blaze",
    E: "Relentless Pursuit",
    R: "The Culling",
  },
  archetype: ["marksman", "lane bully", "burst trades", "short range"],
  primaryWinCondition: [
    "Use early lane agency and support-triggered burst windows to create CS and kill pressure before longer-range scalers stabilize.",
  ],
  dangerAbilities: ["(Q) poke", "(E) dash", "(R) burst channel"],
  dangerProfile: {
    dangerousWhen: [
      "His support can enable his passive burst trades.",
      "He dashes forward after enemy key cooldowns are down.",
      "(R) can finish a target already forced out of position.",
    ],
    mustRespect: [
      "His short trades are strongest when he controls the first move.",
      "(E) can dodge skillshots or turn small windows into all-ins.",
      "He wants early leads before range and scaling disadvantages matter.",
    ],
  },
  commonWeaknesses: [
    "Short range makes late fights harder without a lead.",
    "Can be punished if (E) is used forward.",
    "Needs early pressure or support synergy to justify lane risk.",
  ],
  damageType: "physical",
  hardCrowdControl: [],
  id: "Lucian",
  importantAbilityNotes: [
    "(Q) can punish enemies through minions, especially when they stand behind low-health CS.",
    "Passive double shots make each spell a short burst-trade tool rather than just raw ability damage.",
    "(E) is his trade entry, dodge, and escape; forward (E) must be tied to a real support or cooldown advantage.",
    "(R) can finish pushed-out targets, but it is easier to sidestep if used without prior setup.",
  ],
  lanePlan: {
    avoids: [
      "Letting long-range ADCs farm without pressure.",
      "Using (E) forward before enemy engage or poke is spent.",
      "Taking passive lanes that let scalers reach items freely.",
      "Trading into large waves where his short range forces him to absorb minion damage.",
    ],
    idealLaneState:
      "An aggressive bot lane where Lucian contests early waves, trades after support setup, and converts short burst windows into lane control.",
    wants: [
      "Support can enable short burst trades.",
      "Early wave control before scaling ADCs stabilize.",
      "All-in windows after enemy poke or disengage is down.",
      "Enemy ADCs standing behind minions where (Q) can hit through the wave.",
      "Small wave states that let him dash in, proc passive, and leave before sustained DPS answers.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    lanePressure: "high",
    preferredGameState: [
      "Early bot priority with support pressure.",
      "Short trades before the enemy can extend DPS.",
      "Mid-game skirmishes where burst matters more than range.",
    ],
    scalingPriority: "medium",
    winLaneBy: [
      "Trading around passive burst.",
      "Using (E) to dodge and reposition aggressively.",
      "Denying free scaling through early wave pressure.",
      "Punishing last-hit paths with (Q) through the minion line.",
      "Crashing or thinning waves before short-range all-ins so minion damage does not flip the trade.",
    ],
  },
  majorPowerSpikes: ["Level 2 lane threat.", "First completed marksman item.", "Level 6 (R)."],
  matchupPreferences: {
    strongInto: [
      "Scaling ADCs that need passive early waves.",
      "Lanes where his support can start trades.",
      "Short windows where burst beats sustained DPS.",
    ],
    weakInto: [
      "Long-range poke that denies his dash range.",
      "Hard disengage after he uses (E).",
      "Late-game hypercarries if he does not build a lead.",
    ],
  },
  mobilityLevel: "medium",
  name: "Lucian",
  offMetaRoles: ["mid"],
  powerSpikes: {
    major: [
      {
        timing: "Level 2",
        reason: "Early dash and passive burst can force lane control",
        changesGameplay: "Lucian can punish ADCs that concede the first waves too slowly.",
        playerAction: "Contest level 2 with support cover and trade before the enemy stabilizes.",
        enemyResponse: "Avoid early HP losses that let him snowball the wave.",
      },
      {
        timing: "First completed marksman item",
        reason: "Burst trades become strong enough to threaten kills",
        changesGameplay: "Short trades can force recalls or dragon priority if he is ahead.",
        playerAction: "Use item timing to force short trades before range disadvantages matter.",
        enemyResponse: "Keep distance and punish (E) before accepting all-ins.",
      },
    ],
  },
  primaryRoles: ["adc"],
  secondaryRoles: ["mid"],
  primaryTradingPattern:
    "Dash or step in only after support setup or enemy cooldowns, burst quickly with passive shots, then exit before longer-range DPS answers.",
  punishProfile: {
    canPunish: [
      "Scaling ADCs before first item.",
      "Enemies that miss poke or disengage cooldowns.",
      "Passive lanes where support setup is available.",
      "ADC players lining up behind low-health minions for CS.",
      "Supports who stand too far back to punish his quick dash trade.",
    ],
    strugglesToPunish: ["Long-range ADCs with wave control.", "Hard disengage after (E) is used."],
  },
  shields: [],
  softCrowdControl: [],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "snowball",
    preferredGameLength: "short",
    scalingProfile: "early",
    winMethod: ["early lane pressure", "burst trades", "mid-game tempo"],
  },
  supportSynergy: {
    excellentWith: ["Nami", "Milio", "Braum"],
    goodWith: ["Leona", "Thresh", "Rakan"],
    strugglesWith: ["Yuumi", "Soraka", "passive scaling supports"],
    notes: [
      "Nami's (E) and Lucian's passive create one of his strongest short-trade burst patterns.",
      "Milio extends Lucian's dash-forward trading range while protecting him after the trade.",
      "Braum applies passive quickly with Lucian's double-hit patterns.",
      "Passive scaling supports can leave Lucian without enough lane pressure to justify the pick.",
    ],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "(E) is needed defensively but used forward.",
      "The enemy ADC can kite outside his range.",
      "Support cannot help start or protect the trade.",
    ],
    goodTradeConditions: [
      "Support setup enables passive burst.",
      "Enemy disengage or poke cooldowns are down.",
      "He can trade quickly before sustained DPS ramps.",
      "The enemy ADC is lined up for (Q) through minions.",
      "The wave is small enough that his dash forward does not create a losing minion trade.",
    ],
    primaryPattern:
      "Win fast burst trades with support setup; avoid slow fights where range and scaling carries can free-hit.",
  },
  punishWindows: [
    "After (E), he is much easier to punish.",
    "If early pressure fails, short range becomes more costly.",
    "When support cannot enable him, his lane threat is easier to space.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
