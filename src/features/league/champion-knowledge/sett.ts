import type { LeagueChampionKnowledgeProfile } from "./types";

export const settCombatProfile = {
  profileQuality: "draft",
  abilities: {
    Q: "Knuckle Down",
    W: "Haymaker",
    E: "Facebreaker",
    R: "The Show Stopper",
  },
  archetype: ["juggernaut", "brawler", "anti-melee", "teamfight engage"],
  primaryWinCondition: [
    "Win close-range trades with autos, (E), and grit-backed (W), then use level 6 and side-lane pressure to force enemies into brawls.",
  ],
  dangerAbilities: ["(E) stun/pull", "true-damage (W)", "(R) displacement"],
  dangerProfile: {
    dangerousWhen: [
      "He has built grit and can land centered (W).",
      "(E) can pull from both sides and stun.",
      "Level 6 lets him reposition a target into a stronger fight.",
    ],
    mustRespect: [
      "Trading into Sett builds grit for a stronger (W).",
      "Standing near minions or allies can enable (E) stun.",
      "He is strongest when enemies are forced into melee range.",
    ],
  },
  commonWeaknesses: [
    "Low mobility and kiteable.",
    "(W) can be sidestepped if telegraphed.",
    "Short poke trades can avoid giving him a good grit payoff.",
  ],
  damageType: "physical",
  hardCrowdControl: ["(E) stun when pulling from both sides", "(R) suppression/displacement"],
  id: "Sett",
  importantAbilityNotes: [
    "(Q) empowers autos and speeds him toward enemies.",
    "(W) spends grit for shield and center true damage.",
    "(E) pulls enemies and can stun if targets are on both sides.",
    "(R) grabs and slams a target.",
  ],
  lanePlan: {
    avoids: [
      "Chasing ranged champions with no wave or cooldown setup.",
      "Using (W) into enemies who can sidestep the center.",
      "Letting poke lanes chip him without forcing melee trades.",
    ],
    idealLaneState:
      "A close top-lane wave where Sett can threaten (E), take controlled damage to build grit, and land (W) before the enemy exits.",
    wants: [
      "Melee trades where grit stacks up.",
      "Enemies positioned near minions for (E) stun angles.",
      "Level 6 brawls where (R) can disrupt positioning.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    lanePressure: "high",
    preferredGameState: [
      "Close-range brawls.",
      "Wave states where opponents must approach him.",
      "Clustered fights where (E), (W), and (R) hit multiple targets.",
    ],
    scalingPriority: "medium",
    winLaneBy: [
      "Forcing melee trades.",
      "Landing grit-backed (W).",
      "Using (E) stun angles around wave positioning.",
    ],
  },
  majorPowerSpikes: ["Level 1-3 brawling.", "Level 6 (R).", "First bruiser item."],
  matchupPreferences: {
    strongInto: [
      "Melee champions who must trade in close range.",
      "Tanks or bruisers that let grit stack.",
      "Enemies that cannot dodge centered (W).",
    ],
    weakInto: ["Ranged kiting.", "Mobility that dodges (W).", "Poke that avoids all-in range."],
  },
  mobilityLevel: "low",
  name: "Sett",
  offMetaRoles: ["support", "jungle"],
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "(R) adds displacement and all-in setup",
        changesGameplay: "Sett can turn enemy positioning into a forced brawl or teamfight engage.",
        playerAction:
          "Use (R) after the enemy commits or when the slam creates a guaranteed follow-up.",
        enemyResponse: "Keep spacing so Sett cannot start a favorable slam angle.",
      },
      {
        timing: "First bruiser item",
        reason: "Sett becomes harder to burst and better at forcing brawls",
        changesGameplay:
          "His close-range trades become more reliable and his (W) payoff is harder to ignore.",
        playerAction:
          "Use wave pressure to make the enemy choose between losing farm or entering (E) range.",
        enemyResponse: "Take short trades and sidestep the (W) center.",
      },
    ],
  },
  primaryRoles: ["top"],
  primaryTradingPattern:
    "Force close-range autos, use (E) to keep the enemy nearby, then spend grit with centered (W) before they disengage.",
  punishProfile: {
    canPunish: [
      "Melee champions standing near wave for (E).",
      "Enemies who trade into his grit bar.",
      "Targets without mobility to dodge (W).",
    ],
    strugglesToPunish: [
      "Ranged champions with reliable disengage.",
      "Mobile targets that never stand in (W) center.",
    ],
  },
  secondaryRoles: ["mid"],
  shields: ["(W) shield"],
  softCrowdControl: ["(E) pull"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "control",
    preferredGameLength: "medium",
    scalingProfile: "early",
    winMethod: ["melee brawls", "grit trades", "teamfight disruption"],
  },
  sustain: ["Passive health regeneration"],
  trading: {
    badTradeConditions: [
      "Enemy can kite outside (E) range.",
      "(W) center will miss.",
      "He has no grit built for the shield or true damage.",
    ],
    goodTradeConditions: [
      "Enemy must stand near minions.",
      "Grit is high.",
      "The target has no dash to dodge (W).",
    ],
    primaryPattern:
      "Start brawls with autos and (E), let grit build during return damage, then land centered (W) as the trade peak.",
  },
  punishWindows: [
    "After Sett misses (E), his catch threat drops.",
    "If (W) is spent or sidestepped, his biggest swing tool is gone.",
    "He is vulnerable to repeated ranged poke before he can force melee.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
