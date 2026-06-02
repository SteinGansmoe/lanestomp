import type { LeagueChampionKnowledgeProfile } from "./types";

export const illaoiCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: { Q: "Tentacle Smash", W: "Harsh Lesson", E: "Test of Spirit", R: "Leap of Faith" },
  archetype: ["juggernaut", "zone control", "anti-melee", "side-lane"],
  primaryWinCondition: ["Control tentacle zones, land (E) to force winning trades, and punish multi-target commits with (R)."],
  dangerAbilities: ["(E) spirit pull", "(R) multi-target tentacles", "Tentacle slams"],
  dangerProfile: {
    dangerousWhen: ["(E) lands in range of tentacles.", "Enemies fight her inside her tentacle setup.", "Multiple enemies commit into (R)."],
    mustRespect: ["Her strongest fights happen in prepared zones.", "(E) can win lane without direct all-ins.", "Ganking her after level 6 can backfire if (R) is ready."],
  },
  commonWeaknesses: ["Low mobility.", "Can be kited or disengaged.", "Threat drops sharply if (E) misses or tentacles are cleared."],
  damageType: "physical",
  hardCrowdControl: [],
  id: "Illaoi",
  importantAbilityNotes: ["(E) pulls a spirit and is her key lane threat.", "Tentacles slam around vessels and (W).", "(R) spawns tentacles per enemy hit and enables huge turnarounds.", "(W) makes tentacles slam."],
  lanePlan: {
    avoids: ["Fighting without tentacles nearby.", "Chasing mobile enemies away from her zone.", "Using (E) with no wave or tentacle pressure."],
    idealLaneState: "A side lane where Illaoi has tentacles established and enemies must walk into (E) threat to farm or contest.",
    wants: ["Tentacles around the wave.", "Enemies forced into (E) angles.", "Committed melee fights after level 6."],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "high",
    preferredGameState: ["Prepared side-lane zones.", "Melee opponents forced to approach.", "Enemy ganks that commit into (R)."],
    scalingPriority: "medium",
    winLaneBy: ["Landing (E).", "Maintaining tentacle control.", "Turning all-ins with (R)."],
  },
  majorPowerSpikes: ["Level 6 (R).", "First bruiser item.", "Side lane with multiple tentacles established."],
  matchupPreferences: {
    strongInto: ["Melee champions who must enter her zone.", "Multiple enemies who commit into (R).", "Low mobility targets hit by (E)."],
    weakInto: ["Ranged poke and disengage.", "Mobile champions that dodge (E).", "Teams that clear tentacles and refuse committed fights."],
  },
  mobilityLevel: "low",
  name: "Illaoi",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      { timing: "Level 6", reason: "(R) creates major turnaround threat", changesGameplay: "Ganks and melee all-ins can become Illaoi-favored if enemies stack near her.", playerAction: "Fight only inside tentacle zones and use (R) when enemies commit.", enemyResponse: "Disengage after (R) and re-enter when tentacles are gone." },
      { timing: "Prepared side lane", reason: "Multiple tentacles and (E) angles make her zone hard to contest", changesGameplay: "Opponents must choose between giving wave control or risking spirit pulls.", playerAction: "Set up tentacles before pressuring tower or wave.", enemyResponse: "Clear tentacles first and force her to move." },
    ],
  },
  primaryRoles: ["top"],
  primaryTradingPattern: "Control tentacle space, fish for (E), then use (W) and (R) only when enemies are forced to fight inside her zone.",
  punishProfile: {
    canPunish: ["Enemies hit by (E).", "Melee champions fighting near tentacles.", "Ganks that stack into (R)."],
    strugglesToPunish: ["Ranged champions who clear tentacles.", "Mobile targets that dodge (E) and disengage."],
  },
  secondaryRoles: [],
  shields: [],
  softCrowdControl: [],
  stealthOrInvisibility: null,
  strategicIdentity: { laneGoal: "splitpush", preferredGameLength: "medium", scalingProfile: "mid", winMethod: ["tentacle zoning", "side-lane pressure", "anti-gank turnarounds"] },
  sustain: ["Passive tentacle damage can heal through champion hits"],
  trading: {
    badTradeConditions: ["(E) misses.", "No tentacles are nearby.", "The enemy can kite away from (R)."],
    goodTradeConditions: ["The enemy must walk into (E).", "Tentacles are established around the wave.", "Multiple enemies commit after level 6."],
    primaryPattern: "Do not chase; make the enemy enter tentacle range, land (E), and punish committed fights with (R).",
  },
  punishWindows: ["After (E) misses, she has little lane threat.", "When tentacles are cleared, she must reset the zone.", "If (R) is down, ganks are much safer."],
} satisfies LeagueChampionKnowledgeProfile;

