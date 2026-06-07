import type { LeagueChampionKnowledgeProfile } from "./types";

export const kledCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "high",
  abilities: {
    Q: "Bear Trap on a Rope / Pocket Pistol",
    W: "Violent Tendencies",
    E: "Jousting",
    R: "Chaaaaaaaarge!!!",
  },
  archetype: ["early fighter", "all-in", "dive", "engage"],
  primaryWinCondition: [
    "Use early all-in pressure and remount threat to snowball lane, then force side-lane picks or team engages with (R).",
  ],
  dangerAbilities: ["(Q) pull", "(W) burst autos", "(R) engage"],
  dangerProfile: {
    dangerousWhen: [
      "(Q) lands and the pull completes.",
      "(W) is ready for burst autos.",
      "He is near remount and enemies misjudge his effective health.",
    ],
    mustRespect: [
      "His early levels are dangerous.",
      "Remount can reverse low-health fights.",
      "(R) creates long-range engage and dive pressure.",
    ],
  },
  commonWeaknesses: [
    "Falls off if early snowball fails.",
    "Predictable when (W) is forced at bad timing.",
    "Vulnerable while dismounted before remount.",
  ],
  damageType: "physical",
  hardCrowdControl: [],
  id: "Kled",
  importantAbilityNotes: [
    "(Q) pulls if tether is not broken.",
    "(W) triggers automatically when ready.",
    "(E) is a dash that can recast through marked champions.",
    "(R) charges with allies and grants shield.",
  ],
  lanePlan: {
    avoids: [
      "Trading when (W) is accidentally down.",
      "Fighting dismounted with no remount path.",
      "Using (R) with no follow-up.",
    ],
    idealLaneState:
      "A volatile top lane where Kled can threaten (Q), use (W) for burst, and keep the wave long enough to chase.",
    wants: [
      "Early melee contact.",
      "(Q) tethers that force enemies to walk backward.",
      "Remount opportunities in close fights.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    lanePressure: "high",
    preferredGameState: [
      "Early all-in lanes.",
      "Long lanes for chase.",
      "Skirmishes where (R) starts the fight.",
    ],
    scalingPriority: "medium",
    winLaneBy: ["Landing (Q).", "Timing (W) burst.", "Using remount to bait overcommit."],
  },
  majorPowerSpikes: ["Level 2-3 all-in access.", "Level 6 (R).", "First fighter item."],
  matchupPreferences: {
    strongInto: [
      "Squishy melee champions.",
      "Targets with weak disengage.",
      "Lanes that misjudge remount.",
    ],
    weakInto: [
      "Disengage and kiting.",
      "Champions that deny remount safely.",
      "Tanks that survive early burst.",
    ],
  },
  mobilityLevel: "medium",
  name: "Kled",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 2-3",
        reason: "(Q), (W), and (E) enable early all-ins",
        changesGameplay: "Kled can force lane before many scalers stabilize.",
        playerAction: "Trade aggressively when (W) is ready and (Q) can stick.",
        enemyResponse: "Break (Q) tether and avoid extending near remount.",
      },
      {
        timing: "Level 6",
        reason: "(R) unlocks long-range engage",
        changesGameplay: "Roams, dives, and side-lane collapses become stronger.",
        playerAction: "Use (R) with wave or team follow-up.",
        enemyResponse: "Respect fog and disengage the charge path.",
      },
    ],
  },
  primaryRoles: ["top"],
  primaryTradingPattern:
    "Force (Q) tether trades, burst during (W), and use remount threat to extend fights opponents think are already won.",
  punishProfile: {
    canPunish: [
      "Enemies hit by (Q).",
      "Targets without disengage during (W).",
      "Overcommits near remount.",
    ],
    strugglesToPunish: ["Kiting champions.", "Enemies who wait out (W)."],
  },
  secondaryRoles: [],
  shields: ["(R) shield"],
  softCrowdControl: ["(Q) pull and healing reduction"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "snowball",
    preferredGameLength: "medium",
    scalingProfile: "early",
    winMethod: ["early all-ins", "remount bait", "long-range engage"],
  },
  sustain: ["Remount restores Skaarl health"],
  trading: {
    badTradeConditions: ["(W) is down.", "(Q) misses.", "He is dismounted with no courage path."],
    goodTradeConditions: ["(Q) lands.", "(W) is ready.", "Enemy burst is spent before remount."],
    primaryPattern:
      "Start with (Q), commit when (W) is active, and use remount timing as the fight swing.",
  },
  punishWindows: [
    "After (W) is forced, his burst is predictable.",
    "Dismounted Kled is vulnerable before remount.",
    "If (Q) misses, his all-in loses reliability.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
