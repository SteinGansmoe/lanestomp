import type {
  LeagueChampionJungleProfileCategory,
  LeagueChampionJungleProfileLevel,
  LeagueChampionKnowledgeProfile,
} from "./types";

type JungleCombatProfileSeed = {
  archetype: string[];
  damageType: NonNullable<LeagueChampionKnowledgeProfile["damageType"]>;
  dangerAbilities?: string[];
  hardCrowdControl?: string[];
  id: string;
  jungleProfile: NonNullable<LeagueChampionKnowledgeProfile["jungleProfile"]>;
  masteryDifficulty: NonNullable<
    LeagueChampionKnowledgeProfile["masteryDifficulty"]
  >;
  mobilityLevel: NonNullable<LeagueChampionKnowledgeProfile["mobilityLevel"]>;
  name: string;
  primaryWinCondition: string;
  strategicIdentity: LeagueChampionKnowledgeProfile["strategicIdentity"];
};

function jungleCategory(
  rating: LeagueChampionJungleProfileLevel,
  notes: string[]
): LeagueChampionJungleProfileCategory {
  return { notes, rating };
}

function createJungleCombatProfile({
  archetype,
  damageType,
  dangerAbilities,
  hardCrowdControl = [],
  id,
  jungleProfile,
  masteryDifficulty,
  mobilityLevel,
  name,
  primaryWinCondition,
  strategicIdentity,
}: JungleCombatProfileSeed): LeagueChampionKnowledgeProfile {
  return {
    archetype,
    damageType,
    dangerAbilities,
    hardCrowdControl,
    id,
    jungleProfile,
    masteryDifficulty,
    mobilityLevel,
    name,
    primaryRoles: ["jungle"],
    primaryWinCondition: [primaryWinCondition],
    profileQuality: "draft",
    strategicIdentity,
  };
}

export const leeSinCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "high",
  abilities: {
    Q: "Sonic Wave / Resonating Strike",
    W: "Safeguard / Iron Will",
    E: "Tempest / Cripple",
    R: "Dragon's Rage",
  },
  archetype: ["early skirmisher", "playmaker", "mobile fighter"],
  primaryWinCondition: [
    "Use early invade threat, river control, and creative gank angles to create tempo before scaling junglers stabilize.",
  ],
  dangerAbilities: ["(Q) gap close", "(W) mobility", "(R) displacement"],
  dangerProfile: {
    dangerousWhen: [
      "He reaches level 3 with enough health to invade or fight river.",
      "(Q) connects before a river skirmish or gank.",
      "(R) is available to isolate a target or force a fight-winning displacement.",
    ],
    mustRespect: [
      "His first river move and early invade timing are among his strongest windows.",
      "His impact drops if early plays fail and the game slows down.",
    ],
  },
  damageType: "physical",
  hardCrowdControl: ["(R) knockback"],
  id: "LeeSin",
  importantAbilityNotes: [
    "(Q) gives target access after landing the skillshot.",
    "(W) gives ward-hop and ally-hop mobility.",
    "(R) can kick a target into the team or peel a diver away.",
  ],
  jungleProfile: {
    clearSpeed: jungleCategory("medium", [
      "Can clear efficiently enough to reach early fights, but does not outpace farming specialists.",
      "Uses early tempo best when he mixes camps with pressure instead of full-clearing passively.",
    ]),
    dueling: jungleCategory("very_high", [
      "Level 3 skirmishes are a major strength when (Q) lands.",
      "Can chase, disengage, or reposition with (W).",
    ]),
    earlyGamePressure: jungleCategory("very_high", [
      "Strong invade and counter-invade threat from level 3.",
      "Can influence lanes early with mobility and burst.",
    ]),
    gankThreat: jungleCategory("high", [
      "Threatens creative ward-hop angles and strong follow-up if (Q) lands.",
      "Can turn small lane CC into lethal pressure with (R).",
    ]),
    invadeResistance: jungleCategory("high", [
      "Mobile enough to escape many invades if wards or teammates cover entrances.",
      "Can punish invaders who commit into his early cooldowns.",
    ]),
    matchupFocus: [
      "Force early river fights before scaling junglers finish repeated full clears.",
      "Track enemy starts and invade when lane priority can move first.",
      "Avoid low-value ganks that cost camps without creating tempo.",
    ],
    objectiveControl: jungleCategory("medium", [
      "Can start early objectives after lane pressure, but prefers winning the fight before flipping.",
      "(R) can disrupt enemy access to dragon or Herald.",
    ]),
    pathingNotes: [
      "Look for level 3 invade, countergank, or scuttle contest paths.",
      "Use tempo resets after successful ganks to keep camps from falling behind.",
    ],
    scaling: jungleCategory("low", [
      "Needs early impact to avoid being outscaled by farming carries.",
      "Later value comes more from picks and displacement than raw damage scaling.",
    ]),
  },
  majorPowerSpikes: ["Level 3", "Level 6 (R)", "Early damage item"],
  mobilityLevel: "very_high",
  name: "Lee Sin",
  powerSpikes: {
    major: [
      {
        timing: "Level 3",
        reason: "Full basic kit gives invade, duel, and gank access",
        changesGameplay:
          "Lee Sin can contest river and punish weaker first clears before they reset.",
        playerAction:
          "Path toward the enemy jungler when nearby lanes can move and force a river or camp fight.",
        enemyResponse:
          "Avoid isolated river fights and ward entrances before first scuttle.",
      },
      {
        timing: "Level 6",
        reason: "(R) unlocks displacement and pick setup",
        changesGameplay:
          "Ganks and objective fights become much more punishing if Lee Sin reaches the backline angle.",
        playerAction:
          "Use (R) to isolate a priority target or deny the enemy jungler's objective access.",
        enemyResponse:
          "Respect kick angles and avoid standing between Lee Sin and his team.",
      },
    ],
  },
  primaryRoles: ["jungle"],
  primaryTradingPattern:
    "Force early river duels around (Q), use (W) to reposition, and disengage if the first burst does not create a health lead.",
  punishProfile: {
    canPunish: [
      "Weak full clear junglers before first reset.",
      "Enemy junglers face-checking river without lane priority.",
      "Objective starts where he can enter with (Q) or displace with (R).",
    ],
    strugglesToPunish: [
      "Compositions that track his pathing and avoid early river fights.",
      "Scaling junglers who cross-map instead of accepting invades.",
    ],
  },
  strategicIdentity: {
    laneGoal: "snowball",
    preferredGameLength: "short",
    scalingProfile: "early",
    winMethod: ["early invade pressure", "river skirmishes", "gank tempo"],
  },
} satisfies LeagueChampionKnowledgeProfile;

export const xinZhaoCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: {
    Q: "Three Talon Strike",
    W: "Wind Becomes Lightning",
    E: "Audacious Charge",
    R: "Crescent Guard",
  },
  archetype: ["early duelist", "skirmisher", "diver"],
  primaryWinCondition: [
    "Use strong early dueling to contest river, protect first objectives, and punish scaling junglers before they reach item spikes.",
  ],
  dangerAbilities: ["(E) gap close", "(Q) knockup", "(R) zone control"],
  dangerProfile: {
    dangerousWhen: [
      "He meets the enemy jungler early with (E) and (Q) available.",
      "Nearby lanes can move first into river.",
      "(R) is ready to deny ranged follow-up in a skirmish.",
    ],
    mustRespect: [
      "His level 3 duel is strong and direct.",
      "He is less threatening if kited or forced to enter without follow-up.",
    ],
  },
  damageType: "physical",
  hardCrowdControl: ["(Q) knockup"],
  id: "XinZhao",
  importantAbilityNotes: [
    "(E) gives target access and attack speed.",
    "(Q) adds knockup after repeated attacks.",
    "(R) zones out enemies outside the circle.",
  ],
  jungleProfile: {
    clearSpeed: jungleCategory("medium", [
      "Clear is stable enough to contest early, but his value comes from fighting.",
      "Best paths usually preserve health for river or gank pressure.",
    ]),
    dueling: jungleCategory("very_high", [
      "One of the strongest early 1v1 junglers when he can stick to the target.",
      "(Q) and sustained autos make extended river fights favorable.",
    ]),
    earlyGamePressure: jungleCategory("very_high", [
      "Can contest scuttle, invade, or countergank from level 3.",
      "Punishes greedy full clears from weaker early junglers.",
    ]),
    gankThreat: jungleCategory("high", [
      "(E) gives reliable access when the target is in range.",
      "(Q) knockup is strong with lane follow-up.",
    ]),
    invadeResistance: jungleCategory("high", [
      "Can turn invades into favorable duels if he is healthy.",
      "Struggles more when collapsed on by multiple lanes.",
    ]),
    matchupFocus: [
      "Contest early river unless lane states make collapse impossible.",
      "Force fights before hypercarries reach item and level scaling.",
      "Do not chase through fog when the enemy can kite or collapse.",
    ],
    objectiveControl: jungleCategory("high", [
      "Strong early dueling makes first dragon or Herald easier after lane priority.",
      "(R) can buy space in objective fights.",
    ]),
    pathingNotes: [
      "Path toward first scuttle or a lane with reliable setup.",
      "Use counterganks aggressively against junglers that must gank to keep pace.",
    ],
    scaling: jungleCategory("medium", [
      "Mid-game skirmishing remains strong, but late-game carry scaling is limited.",
      "Needs decisive engages rather than slow front-to-back damage races.",
    ]),
  },
  majorPowerSpikes: ["Level 3", "Level 6 (R)", "First fighter item"],
  mobilityLevel: "medium",
  name: "Xin Zhao",
  powerSpikes: {
    major: [
      {
        timing: "Level 3",
        reason: "Full basic kit gives access, damage, and knockup",
        changesGameplay:
          "Xin Zhao can force direct river fights into most weaker early junglers.",
        playerAction:
          "Path to contest scuttle or invade when nearby lanes can move first.",
        enemyResponse:
          "Avoid extended 1v1s and trade camps cross-map when lanes cannot help.",
      },
      {
        timing: "Level 6",
        reason: "(R) gives zone control and survivability",
        changesGameplay:
          "Objective fights become easier to force because Xin Zhao can block ranged follow-up.",
        playerAction:
          "Use (R) to isolate the enemy jungler or protect your objective setup.",
        enemyResponse:
          "Kite out (R) duration and avoid committing carries into his circle.",
      },
    ],
  },
  primaryRoles: ["jungle"],
  primaryTradingPattern:
    "Take direct river fights when (E) can stick, extend with (Q), and back off if the enemy can kite beyond your cooldowns.",
  punishProfile: {
    canPunish: [
      "Scaling junglers on first scuttle.",
      "Enemies who start objectives without lane cover.",
      "Invaders who enter his jungle without burst or escape.",
    ],
    strugglesToPunish: [
      "Mobile junglers who refuse extended fights.",
      "Control comps that kite him after (E).",
    ],
  },
  strategicIdentity: {
    laneGoal: "snowball",
    preferredGameLength: "medium",
    scalingProfile: "early",
    winMethod: ["early duels", "objective fights", "counterganks"],
  },
} satisfies LeagueChampionKnowledgeProfile;

export const jarvanIvCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: {
    Q: "Dragon Strike",
    W: "Golden Aegis",
    E: "Demacian Standard",
    R: "Cataclysm",
  },
  archetype: ["engage jungler", "ganker", "frontline diver"],
  primaryWinCondition: [
    "Use early gank pressure and reliable engage to create lane leads, then convert numbers advantage into dragons, Heralds, and dives.",
  ],
  dangerAbilities: ["(E)+(Q) engage", "(R) lockdown"],
  dangerProfile: {
    dangerousWhen: [
      "He can path to lanes that have setup or overextended targets.",
      "(E)+(Q) is available from fog.",
      "(R) is ready to trap immobile carries or force objective fights.",
    ],
    mustRespect: [
      "His gank angles are stronger than his raw farming pace.",
      "Missing (E)+(Q) leaves his engage and escape much weaker.",
    ],
  },
  damageType: "physical",
  hardCrowdControl: ["(E)+(Q) knockup", "(R) terrain trap"],
  id: "JarvanIV",
  importantAbilityNotes: [
    "(E)+(Q) creates his main dash and knockup.",
    "(R) traps targets in terrain and forces committed fights.",
    "(W) gives a shield and slow but is not his main threat.",
  ],
  jungleProfile: {
    clearSpeed: jungleCategory("medium", [
      "Clear is functional, but he is not a pure farming jungler.",
      "Tempo is best generated by ganks and objective setups.",
    ]),
    dueling: jungleCategory("medium", [
      "Can fight early with cooldowns up, but extended duels are not his main strength.",
      "Missing (E)+(Q) often loses the skirmish.",
    ]),
    earlyGamePressure: jungleCategory("high", [
      "Strong level 2 or level 3 gank options depending on lane states.",
      "Can force early flashes and convert them into repeat ganks.",
    ]),
    gankThreat: jungleCategory("very_high", [
      "(E)+(Q) gives long-range engage from fog.",
      "(R) makes post-6 ganks and dives difficult to escape.",
    ]),
    invadeResistance: jungleCategory("medium", [
      "Can escape with (E)+(Q) if it is available.",
      "Can be punished if invaded while engage combo is down.",
    ]),
    matchupFocus: [
      "Create lane leads before farming junglers outscale his clear tempo.",
      "Track flashes and repeat gank lanes that cannot escape (R).",
      "Avoid isolated duels against stronger skirmishers unless lanes can collapse.",
    ],
    objectiveControl: jungleCategory("high", [
      "Reliable engage creates strong objective-start and objective-turn threat.",
      "Can trap the enemy jungler with (R) to deny smite access.",
    ]),
    pathingNotes: [
      "Path toward lanes with crowd control or immobile carries.",
      "Use early gank tempo to secure first dragon or Herald instead of handshaking full clears.",
    ],
    scaling: jungleCategory("medium", [
      "Later value comes from engage and frontline utility rather than carry damage.",
      "Falls behind if early ganks do not create map control.",
    ]),
  },
  majorPowerSpikes: ["Level 2 or 3 gank", "Level 6 (R)", "First tank or fighter item"],
  mobilityLevel: "medium",
  name: "Jarvan IV",
  powerSpikes: {
    major: [
      {
        timing: "Level 2-3",
        reason: "(E)+(Q) gank access",
        changesGameplay:
          "Jarvan IV can pressure lanes before many junglers finish a full clear.",
        playerAction:
          "Path to an overextended lane or lane with setup and force flash early.",
        enemyResponse:
          "Ward early river entrances and avoid pushing without tracking his start.",
      },
      {
        timing: "Level 6",
        reason: "(R) adds lockdown for ganks and objective fights",
        changesGameplay:
          "Immobile targets and enemy junglers become much easier to trap.",
        playerAction:
          "Use (R) to lock the enemy jungler out of smite range or secure a dive.",
        enemyResponse:
          "Hold mobility for (R) and avoid objective pits without vision.",
      },
    ],
  },
  primaryRoles: ["jungle"],
  primaryTradingPattern:
    "Skirmish around (E)+(Q); commit when it lands, but disengage or wait for lane collapse if the combo misses.",
  punishProfile: {
    canPunish: [
      "Lanes without flash after early ganks.",
      "Enemy junglers starting objectives without vision.",
      "Immobile carries near objective pits after level 6.",
    ],
    strugglesToPunish: [
      "Mobile junglers who dodge (E)+(Q).",
      "Fast clearers who avoid lanes and trade objectives cross-map.",
    ],
  },
  strategicIdentity: {
    laneGoal: "snowball",
    preferredGameLength: "medium",
    scalingProfile: "mid",
    winMethod: ["gank setup", "objective engage", "frontline initiation"],
  },
} satisfies LeagueChampionKnowledgeProfile;

export const khazixCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "high",
  abilities: {
    Q: "Taste Their Fear",
    W: "Void Spike",
    E: "Leap",
    R: "Void Assault",
  },
  archetype: ["assassin jungler", "isolation duelist", "pick"],
  primaryWinCondition: [
    "Use isolation damage, fog control, and objective-side picks to punish separated targets and snowball skirmishes.",
  ],
  dangerAbilities: ["Isolated (Q)", "(E) reset", "(R) stealth"],
  dangerProfile: {
    dangerousWhen: [
      "Targets are isolated in river, jungle entrances, or side lanes.",
      "He can enter from fog with (R) or (E).",
      "Objective setups split the enemy team and create isolated targets.",
    ],
    mustRespect: [
      "Isolation changes his damage and objective threat dramatically.",
      "Grouped enemies reduce his pick value.",
    ],
  },
  damageType: "physical",
  hardCrowdControl: [],
  id: "Khazix",
  importantAbilityNotes: [
    "(Q) deals much more damage to isolated targets.",
    "(E) can reset after takedowns when evolved.",
    "(R) gives stealth for repositioning and picks.",
  ],
  jungleProfile: {
    clearSpeed: jungleCategory("medium", [
      "Clear is serviceable, but his pressure comes from isolation picks and invades.",
      "Can take objectives quickly when isolation is available.",
    ]),
    dueling: jungleCategory("high", [
      "Very strong into isolated targets.",
      "Much weaker when enemies group or lane collapse arrives quickly.",
    ]),
    earlyGamePressure: jungleCategory("medium", [
      "Can skirmish early, but wants clean isolation or health advantage.",
      "Usually spikes harder once early damage and evolution choices come online.",
    ]),
    gankThreat: jungleCategory("medium", [
      "Ganks are strongest from fog against overextended or isolated targets.",
      "Lacks reliable crowd control, so lane setup matters.",
    ]),
    invadeResistance: jungleCategory("medium", [
      "Can punish isolated invaders, but weak if collapsed on.",
      "Needs vision control to choose fights rather than be forced into them.",
    ]),
    matchupFocus: [
      "Track isolated camp and river fights instead of forcing grouped skirmishes.",
      "Use objective vision to create picks before starting dragon or Herald.",
      "Avoid flipping early fights when nearby lanes can collapse first.",
    ],
    objectiveControl: jungleCategory("high", [
      "Isolation gives strong single-target objective damage.",
      "Best objective control comes after removing vision or picking a separated target.",
    ]),
    pathingNotes: [
      "Path toward lanes or jungle entrances where targets can be isolated.",
      "Use fog and sweeper before objective setups instead of walking in first.",
    ],
    scaling: jungleCategory("high", [
      "Assassin threat grows with damage items and evolution choices.",
      "Late fights require patience because grouped targets limit isolation.",
    ]),
  },
  majorPowerSpikes: ["First damage item", "Level 6 (R)", "Evolved abilities"],
  mobilityLevel: "high",
  name: "Kha'Zix",
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "(R) unlocks stealth and first evolution",
        changesGameplay:
          "Kha'Zix can choose stronger pick, duel, or mobility patterns.",
        playerAction:
          "Play through fog and look for isolated jungle or river targets before objectives.",
        enemyResponse:
          "Group around vision and deny isolated paths into the river.",
      },
      {
        timing: "First damage item",
        reason: "Isolation burst becomes much more lethal",
        changesGameplay:
          "Separated targets can die before help arrives.",
        playerAction:
          "Invade with vision support and punish enemy camps when lanes cannot collapse.",
        enemyResponse:
          "Avoid checking jungle entrances alone and collapse as a group.",
      },
    ],
  },
  primaryRoles: ["jungle"],
  primaryTradingPattern:
    "Fight only when isolation or fog gives burst advantage; disengage from grouped river fights that remove isolation value.",
  punishProfile: {
    canPunish: [
      "Isolated junglers on camps.",
      "Supports or carries face-checking objective vision.",
      "Enemy objective starts where isolation damage can threaten smite control.",
    ],
    strugglesToPunish: [
      "Grouped teams that deny isolation.",
      "Reliable hard CC that catches him after (E) or (R).",
    ],
  },
  strategicIdentity: {
    laneGoal: "snowball",
    preferredGameLength: "medium",
    scalingProfile: "mid",
    winMethod: ["isolation picks", "fog control", "objective-side assassinations"],
  },
} satisfies LeagueChampionKnowledgeProfile;

export const nunuCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: {
    Q: "Consume",
    W: "Biggest Snowball Ever!",
    E: "Snowball Barrage",
    R: "Absolute Zero",
  },
  archetype: ["objective controller", "ganking tank", "utility jungler"],
  primaryWinCondition: [
    "Use fast objective control and repeated ganks to build map leads before carry junglers outscale his damage.",
  ],
  dangerAbilities: ["(W) gank engage", "(Q) objective secure", "(R) zone control"],
  dangerProfile: {
    dangerousWhen: [
      "He can roll (W) from fog into overextended lanes.",
      "He starts dragon or Herald with lane priority.",
      "(Q) and Smite combine for strong objective secure.",
    ],
    mustRespect: [
      "His ganks and objective speed are stronger than his isolated dueling.",
      "He loses threat when entrances are warded and lanes avoid snowball angles.",
    ],
  },
  damageType: "magic",
  hardCrowdControl: ["(W) knockup", "(E) root"],
  id: "Nunu",
  importantAbilityNotes: [
    "(Q) gives strong monster damage and healing.",
    "(W) creates long-range gank engage.",
    "(R) zones and punishes enemies stuck in crowd control.",
  ],
  jungleProfile: {
    clearSpeed: jungleCategory("high", [
      "(Q) makes camps healthy and objective transitions fast.",
      "Can maintain tempo while threatening frequent ganks.",
    ]),
    dueling: jungleCategory("low", [
      "Weak isolated duelist compared with early fighters or assassins.",
      "Prefers numbers advantage, CC chains, and objective control.",
    ]),
    earlyGamePressure: jungleCategory("high", [
      "Can gank early and repeatedly with (W).",
      "Forces lanes to ward deeper than normal gank paths.",
    ]),
    gankThreat: jungleCategory("very_high", [
      "(W) creates powerful lane access from fog.",
      "(E) can extend CC after the snowball connects.",
    ]),
    invadeResistance: jungleCategory("medium", [
      "(Q) sustain helps survive, but he does not want isolated fights.",
      "Can escape or stall if lanes move, but strong duelists can punish him.",
    ]),
    matchupFocus: [
      "Trade isolated fights for ganks, objective starts, and cross-map tempo.",
      "Use early dragon or Herald pressure when the enemy jungler shows opposite side.",
      "Avoid walking into assassins or duelists without lane support.",
    ],
    objectiveControl: jungleCategory("very_high", [
      "(Q) plus Smite gives excellent secure power.",
      "Can start early objectives quickly after successful ganks.",
    ]),
    pathingNotes: [
      "Path to gank lanes with follow-up and convert flashes into objectives.",
      "Use fogged (W) angles instead of predictable river entries.",
    ],
    scaling: jungleCategory("medium", [
      "Utility and engage remain useful, but damage scaling is limited.",
      "Needs teammates to convert CC and objective leads.",
    ]),
  },
  majorPowerSpikes: ["Early gank paths", "First objective spawn", "Level 6 (R)"],
  mobilityLevel: "medium",
  name: "Nunu & Willump",
  powerSpikes: {
    major: [
      {
        timing: "First dragon or Herald spawn",
        reason: "(Q) plus Smite gives strong secure power",
        changesGameplay:
          "Nunu can force early objectives if lanes have priority or the enemy jungler shows away.",
        playerAction:
          "Convert successful ganks into immediate dragon or Herald starts.",
        enemyResponse:
          "Ward objectives early and contest before Nunu starts them for free.",
      },
      {
        timing: "Level 6",
        reason: "(R) adds zone control and burst follow-up",
        changesGameplay:
          "Ganks and objective fights punish enemies stuck in his CC chain.",
        playerAction:
          "Layer (R) after (W) or ally CC instead of channeling in open space.",
        enemyResponse:
          "Save interrupts or disengage before the full channel lands.",
      },
    ],
  },
  primaryRoles: ["jungle"],
  primaryTradingPattern:
    "Avoid isolated duels; fight when (W) or lane CC creates numbers advantage and use (Q) sustain to secure camps or objectives.",
  punishProfile: {
    canPunish: [
      "Enemy junglers showing opposite side of early objectives.",
      "Lanes without deep vision against (W) angles.",
      "Objective flips where (Q) plus Smite gives secure advantage.",
    ],
    strugglesToPunish: [
      "Strong duelists invading before lanes can move.",
      "Teams that ward deep and deny snowball approach angles.",
    ],
  },
  strategicIdentity: {
    laneGoal: "control",
    preferredGameLength: "medium",
    scalingProfile: "mid",
    winMethod: ["objective control", "repeat ganks", "utility engage"],
  },
} satisfies LeagueChampionKnowledgeProfile;

export const sejuaniCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: {
    Q: "Arctic Assault",
    W: "Winter's Wrath",
    E: "Permafrost",
    R: "Glacial Prison",
  },
  archetype: ["tank jungler", "engage", "frontline"],
  primaryWinCondition: [
    "Use reliable CC, melee-lane synergy, and teamfight engage to create picks and secure objectives with numbers advantage.",
  ],
  dangerAbilities: ["(Q) engage", "(E) stun", "(R) long-range engage"],
  dangerProfile: {
    dangerousWhen: [
      "Nearby melee allies can help stack (E).",
      "(R) is available before an objective fight.",
      "She can enter river first and threaten CC from fog.",
    ],
    mustRespect: [
      "Her ganks are strongest with melee lane partners.",
      "Her early isolated dueling is weaker than dedicated fighters.",
    ],
  },
  damageType: "magic",
  hardCrowdControl: ["(Q) knockup", "(E) stun", "(R) stun"],
  id: "Sejuani",
  importantAbilityNotes: [
    "(Q) gives dash engage and knockup.",
    "(E) stuns after frost stacks, especially with melee allies.",
    "(R) is long-range engage or pick setup.",
  ],
  jungleProfile: {
    clearSpeed: jungleCategory("medium", [
      "Clear is stable and healthy, but not a pure tempo-farming strength.",
      "Wants to balance camps with gank windows for melee lanes.",
    ]),
    dueling: jungleCategory("medium", [
      "Can survive many fights, but does not want isolated damage races.",
      "Skirmishes improve heavily when allies help stack crowd control.",
    ]),
    earlyGamePressure: jungleCategory("medium", [
      "Can gank early, especially for melee lanes with setup.",
      "Usually prefers controlled pathing over risky invades.",
    ]),
    gankThreat: jungleCategory("high", [
      "(Q), (E), and later (R) create reliable CC chains.",
      "Melee lane partners make her ganks much more threatening.",
    ]),
    invadeResistance: jungleCategory("high", [
      "Tankiness and CC make her hard to kill quickly.",
      "Can stall invades until lanes collapse, but may lose camps to faster duelists.",
    ]),
    matchupFocus: [
      "Path toward melee lanes that can stack (E).",
      "Avoid isolated early duels against stronger fighters.",
      "Use level 6 and objective timers to force grouped fights.",
    ],
    objectiveControl: jungleCategory("high", [
      "Strong engage and peel help control objective entrances.",
      "(R) can start fights before dragon or Baron setup.",
    ]),
    pathingNotes: [
      "Full clear or controlled clear toward melee setup lanes.",
      "Arrive first to objectives when (R) is available and vision can be established.",
    ],
    scaling: jungleCategory("high", [
      "Teamfight engage and frontline value scale well.",
      "Damage does not scale like carry junglers, so she needs teammates to follow CC.",
    ]),
  },
  majorPowerSpikes: ["Level 6 (R)", "First tank item", "Grouped objective fights"],
  mobilityLevel: "medium",
  name: "Sejuani",
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "(R) gives long-range engage",
        changesGameplay:
          "Sejuani can start ganks and objective fights without needing to walk into melee first.",
        playerAction:
          "Use (R) around objective timers or on lanes with follow-up damage.",
        enemyResponse:
          "Respect fog angles and avoid grouping in narrow objective entrances.",
      },
      {
        timing: "First tank item",
        reason: "Durability lets her front line objective fights",
        changesGameplay:
          "She can absorb more cooldowns while setting up CC chains.",
        playerAction:
          "Control river entrances and force fights where allies can hit stunned targets.",
        enemyResponse:
          "Avoid hitting the tank first if her carries are free to follow up.",
      },
    ],
  },
  primaryRoles: ["jungle"],
  primaryTradingPattern:
    "Skirmish when allies can help stack CC; avoid isolated early duels where damage junglers can kite or out-DPS her.",
  punishProfile: {
    canPunish: [
      "Enemies face-checking objective entrances after level 6.",
      "Overextended lanes with melee allied setup.",
      "Junglers forced to contest objectives through narrow choke points.",
    ],
    strugglesToPunish: [
      "Fast farming junglers who avoid grouped fights.",
      "Mobile carries who hold dashes for (R).",
    ],
  },
  strategicIdentity: {
    laneGoal: "teamfight",
    preferredGameLength: "long",
    scalingProfile: "late",
    winMethod: ["teamfight engage", "objective control", "frontline CC"],
  },
} satisfies LeagueChampionKnowledgeProfile;

export const viegoCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "high",
  abilities: {
    Q: "Blade of the Ruined King",
    W: "Spectral Maw",
    E: "Harrowed Path",
    R: "Heartbreaker",
  },
  archetype: ["reset fighter", "skirmisher", "carry jungler"],
  primaryWinCondition: [
    "Use strong skirmishing and reset threat to win river fights, then snowball takedowns into objective control.",
  ],
  dangerAbilities: ["(W) stun", "(E) camouflage", "(R) reset execute"],
  dangerProfile: {
    dangerousWhen: [
      "A skirmish creates the first takedown for possession resets.",
      "(E) gives fogged approach into river or lane.",
      "(R) is ready to execute or reposition after a reset.",
    ],
    mustRespect: [
      "One takedown can turn a losing fight into a cleanup.",
      "He is more punishable before resets begin.",
    ],
  },
  damageType: "physical",
  hardCrowdControl: ["(W) stun"],
  id: "Viego",
  importantAbilityNotes: [
    "(W) stuns and starts many ganks or duels.",
    "(E) gives camouflage and attack speed zone.",
    "(R) executes, repositions, and refreshes through takedowns.",
  ],
  jungleProfile: {
    clearSpeed: jungleCategory("medium", [
      "Clear is stable and lets him reach skirmishes on time.",
      "Not as fast as dedicated power farmers without tempo leads.",
    ]),
    dueling: jungleCategory("high", [
      "Strong sustained duels if he can land (W) and keep attacking.",
      "Becomes much stronger when fights create a reset.",
    ]),
    earlyGamePressure: jungleCategory("medium", [
      "Can contest early skirmishes but does not need to coin-flip invades.",
      "Wants river fights where lanes can help secure the first takedown.",
    ]),
    gankThreat: jungleCategory("medium", [
      "(W) gives setup, but it is more reliable with lane CC or fog.",
      "(E) can hide approach angles.",
    ]),
    invadeResistance: jungleCategory("medium", [
      "Can fight back if healthy and cooldowns are ready.",
      "Can be punished if invaded before he has lane support or reset threat.",
    ]),
    matchupFocus: [
      "Play for skirmishes where the first takedown is realistic.",
      "Avoid isolated fights against stronger early duelists before item progress.",
      "Use objective fights to trigger resets rather than flipping raw smite races.",
    ],
    objectiveControl: jungleCategory("medium", [
      "Objective fights are strong when reset threat forces enemies to back off.",
      "Raw secure is normal, so vision and fight setup matter.",
    ]),
    pathingNotes: [
      "Path toward lanes that can help secure the first takedown.",
      "Shadow volatile lanes for counterganks instead of only farming.",
    ],
    scaling: jungleCategory("high", [
      "Carry potential grows with items and reset opportunities.",
      "Teamfight impact depends on finding the first takedown safely.",
    ]),
  },
  majorPowerSpikes: ["First fighter item", "Level 6 (R)", "Reset fights"],
  mobilityLevel: "medium",
  name: "Viego",
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "(R) adds execute and reset mobility",
        changesGameplay:
          "Viego can finish low targets and reposition through takedowns.",
        playerAction:
          "Look for skirmishes where one low target can start a reset chain.",
        enemyResponse:
          "Deny the first takedown and avoid fighting while split in river.",
      },
      {
        timing: "First fighter item",
        reason: "Sustained dueling and reset cleanup become stronger",
        changesGameplay:
          "Viego can contest longer fights without relying only on teammates.",
        playerAction:
          "Fight around lanes that can move and use resets to convert into objectives.",
        enemyResponse:
          "Burst or disengage before he gets repeated autos and possession value.",
      },
    ],
  },
  primaryRoles: ["jungle"],
  primaryTradingPattern:
    "Take skirmishes where (W) can start a focus target and disengage if no reset target is realistic.",
  punishProfile: {
    canPunish: [
      "Low-health river fights where a reset starts the cleanup.",
      "Enemy junglers committing without lane collapse.",
      "Objective fights where carries step into (W) range.",
    ],
    strugglesToPunish: [
      "Comps that disengage before the first takedown.",
      "Early duelists who invade before Viego has item progress.",
    ],
  },
  strategicIdentity: {
    laneGoal: "snowball",
    preferredGameLength: "medium",
    scalingProfile: "mid",
    winMethod: ["skirmish resets", "carry cleanup", "objective fight resets"],
  },
} satisfies LeagueChampionKnowledgeProfile;

export const belvethCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "high",
  abilities: {
    Q: "Void Surge",
    W: "Above and Below",
    E: "Royal Maelstrom",
    R: "Endless Banquet",
  },
  archetype: ["scaling carry jungler", "power farmer", "skirmisher"],
  primaryWinCondition: [
    "Use fast clears and objective conversions to reach scaling windows, then turn Herald, Baron, or takedowns into map pressure.",
  ],
  dangerAbilities: ["(Q) mobility", "(W) knockup", "(E) damage reduction", "(R) true form"],
  dangerProfile: {
    dangerousWhen: [
      "She reaches item and stack thresholds without being disrupted.",
      "Herald or Baron creates empowered pushing pressure.",
      "(E) is available to survive burst in a skirmish.",
    ],
    mustRespect: [
      "Her scaling and objective conversions can take over the map.",
      "Early disruption matters before she completes repeated clears.",
    ],
  },
  damageType: "physical",
  hardCrowdControl: ["(W) knockup"],
  id: "Belveth",
  importantAbilityNotes: [
    "(Q) gives repeated directional dashes.",
    "(W) knocks up and can reset a (Q) direction.",
    "(E) reduces damage and executes low-health targets.",
    "(R) converts takedowns and void objectives into true form pressure.",
  ],
  jungleProfile: {
    clearSpeed: jungleCategory("very_high", [
      "Strong farming tempo and repeated camp cycling.",
      "Uses clear speed to reach item and stack scaling quickly.",
    ]),
    dueling: jungleCategory("high", [
      "Strong sustained duelist once she has space to auto and use (E).",
      "Can be punished early if crowd control interrupts her setup.",
    ]),
    earlyGamePressure: jungleCategory("medium", [
      "Can skirmish, but does not need to force risky early invades.",
      "Prefers efficient clears unless a high-value fight is available.",
    ]),
    gankThreat: jungleCategory("medium", [
      "(Q) and (W) give access and setup, but ganks are less reliable than dedicated CC junglers.",
      "Follow-up improves when lanes provide crowd control.",
    ]),
    invadeResistance: jungleCategory("medium", [
      "Mobility and (E) help survive, but early disruption can slow scaling.",
      "Needs lane awareness before fighting early invades.",
    ]),
    matchupFocus: [
      "Protect first clears and avoid wasting time on low-value ganks.",
      "Trade cross-map when early fighters invade with lane priority.",
      "Prioritize Herald and Baron conversions when true form can break the map.",
    ],
    objectiveControl: jungleCategory("high", [
      "Objective takedowns can convert into major pressure through (R).",
      "Herald and Baron are especially valuable because they unlock pushing power.",
    ]),
    pathingNotes: [
      "Full clear efficiently and only detour for high-percentage skirmishes.",
      "Track invaders and use cross-map camps or objectives when early fights are bad.",
    ],
    scaling: jungleCategory("very_high", [
      "Major carry potential with items, stacks, and true form.",
      "Becomes harder to match if she farms uninterrupted.",
    ]),
  },
  majorPowerSpikes: ["First item", "Void objective with (R)", "Baron or Herald conversion"],
  mobilityLevel: "high",
  name: "Bel'Veth",
  powerSpikes: {
    major: [
      {
        timing: "First item",
        reason: "Sustained damage and dueling improve sharply",
        changesGameplay:
          "Bel'Veth can contest longer fights instead of only farming around them.",
        playerAction:
          "Use item timing to fight around objectives or invade with lane support.",
        enemyResponse:
          "Punish her before the item or force fights where CC interrupts her uptime.",
      },
      {
        timing: "Herald, Baron, or void objective takedown",
        reason: "(R) true form creates map pressure",
        changesGameplay:
          "Objective wins can quickly turn into tower pressure and jungle control.",
        playerAction:
          "Convert objective wins into camps, towers, and deep vision immediately.",
        enemyResponse:
          "Contest setup early and avoid giving free Herald or Baron conversions.",
      },
    ],
  },
  primaryRoles: ["jungle"],
  primaryTradingPattern:
    "Take extended skirmishes when (E) can absorb burst and (Q) keeps contact; avoid early fights that only delay scaling.",
  punishProfile: {
    canPunish: [
      "Junglers who cannot disrupt her first clears.",
      "Teams giving free Herald or Baron setup.",
      "Extended fights where she gets repeated autos and (E) value.",
    ],
    strugglesToPunish: [
      "Early invaders with lane priority.",
      "Hard CC chains that stop her from using mobility and (E).",
    ],
  },
  strategicIdentity: {
    laneGoal: "scale",
    preferredGameLength: "long",
    scalingProfile: "late",
    winMethod: ["power farming", "objective conversions", "carry skirmishing"],
  },
} satisfies LeagueChampionKnowledgeProfile;

export const karthusCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: {
    Q: "Lay Waste",
    W: "Wall of Pain",
    E: "Defile",
    R: "Requiem",
  },
  archetype: ["power farmer", "scaling mage", "global damage"],
  primaryWinCondition: [
    "Full clear efficiently, avoid early disruption, and scale into global damage windows that influence fights across the map.",
  ],
  dangerAbilities: ["Repeated (Q)", "(W) slow", "(R) global damage"],
  dangerProfile: {
    dangerousWhen: [
      "He is allowed to full clear and reach item spikes on tempo.",
      "(R) can finish low-health enemies after skirmishes.",
      "Objective fights force enemies to stand in repeated (Q) and (E) damage.",
    ],
    mustRespect: [
      "His first clear and farming speed are core strengths.",
      "He is vulnerable to early invades and collapsed river fights.",
    ],
  },
  damageType: "magic",
  hardCrowdControl: [],
  id: "Karthus",
  importantAbilityNotes: [
    "(Q) is his main single-target and camp damage.",
    "(W) slows and reduces magic resistance.",
    "(R) damages all enemy champions globally.",
  ],
  jungleProfile: {
    clearSpeed: jungleCategory("very_high", [
      "One of his biggest strengths is fast, efficient full clearing.",
      "Tempo advantage comes from cycling camps and reaching item spikes quickly.",
    ]),
    dueling: jungleCategory("low", [
      "Can deal damage if enemies stand in (Q), but early forced fights are risky.",
      "Struggles when invaded before he has room to kite.",
    ]),
    earlyGamePressure: jungleCategory("low", [
      "Usually wants to full clear rather than force early ganks.",
      "Early map influence comes more from tracking and avoiding disruption.",
    ]),
    gankThreat: jungleCategory("low", [
      "Limited reliable crowd control for ganks.",
      "Can assist lanes with damage, but setup is weak before enemies are low.",
    ]),
    invadeResistance: jungleCategory("low", [
      "Vulnerable to early invades if lanes cannot move.",
      "Can lose tempo hard when forced off camps.",
    ]),
    matchupFocus: [
      "Protect first clear with wards and path away from early duelists.",
      "Trade camps cross-map instead of accepting bad river fights.",
      "Use (R) after fights start or when enemies are already low.",
    ],
    objectiveControl: jungleCategory("medium", [
      "High sustained damage helps objectives when he has setup.",
      "Weak face-checking makes objective access risky without vision.",
    ]),
    pathingNotes: [
      "Full clear toward safe lanes and avoid predictable low-health river entries.",
      "Track invaders early and ping lanes before contesting scuttle.",
    ],
    scaling: jungleCategory("very_high", [
      "High carry impact with items and global damage.",
      "Can decide fights without being physically present once (R) is available.",
    ]),
  },
  majorPowerSpikes: ["First full clear reset", "Level 6 (R)", "First AP item"],
  mobilityLevel: "none",
  name: "Karthus",
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "(R) adds global damage",
        changesGameplay:
          "Karthus can influence fights and finish kills without leaving his path.",
        playerAction:
          "Keep farming tempo and use (R) after enemies commit or drop low.",
        enemyResponse:
          "Track his level 6 and avoid extended low-health fights across the map.",
      },
      {
        timing: "First AP item",
        reason: "Clear speed and global damage become more punishing",
        changesGameplay:
          "His farming lead converts into stronger objective and teamfight damage.",
        playerAction:
          "Use item tempo to cycle camps, arrive to objectives first, and avoid blind face-checks.",
        enemyResponse:
          "Invade before the item or force fights before he sets up vision.",
      },
    ],
  },
  primaryRoles: ["jungle"],
  primaryTradingPattern:
    "Avoid early isolated duels; kite through camps and river with repeated (Q), then punish overcommits with damage and passive value.",
  punishProfile: {
    canPunish: [
      "Enemies who fight too long in objective areas.",
      "Low-health lanes after skirmishes with (R).",
      "Junglers who cannot interrupt his full clear tempo.",
    ],
    strugglesToPunish: [
      "Early invaders with strong level 3 fights.",
      "Mobile junglers who dodge repeated (Q) and force him off camps.",
    ],
  },
  strategicIdentity: {
    laneGoal: "scale",
    preferredGameLength: "long",
    scalingProfile: "late",
    winMethod: ["power farming", "global damage", "objective-area DPS"],
  },
} satisfies LeagueChampionKnowledgeProfile;

export const masterYiCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: {
    Q: "Alpha Strike",
    W: "Meditate",
    E: "Wuju Style",
    R: "Highlander",
  },
  archetype: ["scaling carry jungler", "reset fighter", "power farmer"],
  primaryWinCondition: [
    "Farm toward item spikes, avoid early CC-heavy fights, and clean up skirmishes once reset windows become available.",
  ],
  dangerAbilities: ["(Q) untargetability", "(W) damage reduction", "(R) reset chase"],
  dangerProfile: {
    dangerousWhen: [
      "He reaches item spikes without losing too much jungle tempo.",
      "Enemies use key crowd control before he enters.",
      "(R) is active and a low-health target can start reset chains.",
    ],
    mustRespect: [
      "His early fights are much weaker into reliable crowd control.",
      "His cleanup threat rises sharply with items.",
    ],
  },
  damageType: "physical",
  hardCrowdControl: [],
  id: "MasterYi",
  importantAbilityNotes: [
    "(Q) dodges targeted moments and follows enemies.",
    "(W) reduces damage and can stall cooldowns.",
    "(R) gives chase power and reset threat.",
  ],
  jungleProfile: {
    clearSpeed: jungleCategory("high", [
      "Efficient farming is central to reaching carry spikes.",
      "Tempo is lost when forced into low-value early fights.",
    ]),
    dueling: jungleCategory("medium", [
      "Can win some extended duels, but struggles against early CC and burst.",
      "Becomes much stronger after item progress.",
    ]),
    earlyGamePressure: jungleCategory("low", [
      "Usually prefers farming over forcing early ganks or invades.",
      "Early pressure is limited without enemy mistakes or strong lane setup.",
    ]),
    gankThreat: jungleCategory("low", [
      "No hard CC and needs targets to overextend.",
      "Ganks improve when lanes provide setup or enemies are already low.",
    ]),
    invadeResistance: jungleCategory("low", [
      "Can be disrupted by early duelists and CC-heavy invades.",
      "Needs tracking and cross-map decisions to avoid losing tempo.",
    ]),
    matchupFocus: [
      "Avoid early river fights against stronger duelists unless lanes can move first.",
      "Trade camps cross-map and keep item tempo intact.",
      "Enter fights after enemy CC is used and look for reset cleanup.",
    ],
    objectiveControl: jungleCategory("medium", [
      "Can take objectives with damage once he has tempo.",
      "Objective fights are risky if he must enter first into CC.",
    ]),
    pathingNotes: [
      "Full clear toward safe reset timing and item progress.",
      "Track invade threats and choose cross-map camps over bad scuttle fights.",
    ],
    scaling: jungleCategory("very_high", [
      "Strong carry potential with items and reset access.",
      "Can take over fights if enemies lack CC or use it too early.",
    ]),
  },
  majorPowerSpikes: ["First item", "Level 6 (R)", "Two-item carry window"],
  mobilityLevel: "medium",
  name: "Master Yi",
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "(R) unlocks chase and reset threat",
        changesGameplay:
          "Master Yi can clean up low-health fights if CC is unavailable.",
        playerAction:
          "Enter after key crowd control is used and chase reset targets with (R).",
        enemyResponse:
          "Hold CC for Yi and avoid giving the first reset.",
      },
      {
        timing: "First item",
        reason: "Sustained damage and objective speed improve",
        changesGameplay:
          "He can farm faster and punish messy skirmishes more reliably.",
        playerAction:
          "Keep camp tempo high and only join fights with reset potential.",
        enemyResponse:
          "Force him before item completion or collapse with reliable CC.",
      },
    ],
  },
  primaryRoles: ["jungle"],
  primaryTradingPattern:
    "Avoid front-starting fights; wait for enemy CC to be committed, then use (Q) and (R) to chase resets.",
  punishProfile: {
    canPunish: [
      "Messy low-health skirmishes after CC is used.",
      "Junglers who let him full clear into item spikes.",
      "Objective fights where enemies split and cannot chain CC.",
    ],
    strugglesToPunish: [
      "Early invaders with reliable CC.",
      "Teams that hold point-and-click lockdown for his entry.",
    ],
  },
  strategicIdentity: {
    laneGoal: "scale",
    preferredGameLength: "long",
    scalingProfile: "late",
    winMethod: ["power farming", "reset cleanup", "late-game carry damage"],
  },
} satisfies LeagueChampionKnowledgeProfile;

const remainingJungleProfileSeeds = [
  {
    archetype: ["tank jungler", "engage", "teamfight lockdown"],
    damageType: "magic",
    dangerAbilities: ["(Q) bandage engage", "(R) area lockdown"],
    hardCrowdControl: ["(Q) stun", "(R) area stun"],
    id: "Amumu",
    jungleProfile: {
      clearSpeed: jungleCategory("medium", [
        "Clear is stable, but early tempo is not as fast as farming specialists.",
      ]),
      dueling: jungleCategory("low", [
        "Is vulnerable in isolated early fights before tank stats and teammates arrive.",
      ]),
      earlyGamePressure: jungleCategory("medium", [
        "Can gank early if lanes have setup, but usually prefers controlled first clears.",
      ]),
      gankThreat: jungleCategory("high", [
        "(Q) gives long-range engage, and double-bandage angles make lanes respect fog.",
      ]),
      invadeResistance: jungleCategory("low", [
        "Strong early invaders can force him off camps if lanes cannot move.",
      ]),
      matchupFocus: [
        "Protect the first clear against duelists and path toward lanes that can follow (Q).",
        "Do not flip early river fights without lane priority.",
        "Convert level 6 into dragon, Void Grubs, or grouped objective fights.",
      ],
      objectiveControl: jungleCategory("high", [
        "(R) makes objective turns strong when enemies walk into choke points.",
      ]),
      pathingNotes: [
        "Full clear or three-camp toward a lane with crowd control.",
        "Use defensive wards on entrances when facing level 3 invaders.",
      ],
      scaling: jungleCategory("high", [
        "Teamfight value rises sharply once he can force grouped fights with (R).",
      ]),
    },
    masteryDifficulty: "low",
    mobilityLevel: "low",
    name: "Amumu",
    primaryWinCondition:
      "Survive early jungle pressure, then force grouped fights with (Q) and (R) around objectives.",
    strategicIdentity: {
      laneGoal: "teamfight",
      preferredGameLength: "long",
      scalingProfile: "late",
      winMethod: ["teamfight engage", "objective turns", "frontline lockdown"],
    },
  },
  {
    archetype: ["frenzy duelist", "diver", "carry skirmisher"],
    damageType: "physical",
    dangerAbilities: ["(Q) point access", "(E) disengage", "(R) long-range dive"],
    hardCrowdControl: ["(Q) stun", "(E) knockback", "(R) fear"],
    id: "Briar",
    jungleProfile: {
      clearSpeed: jungleCategory("high", [
        "Healthy clears let her keep tempo while looking for fights.",
      ]),
      dueling: jungleCategory("high", [
        "Wins many extended fights if she can stay attached and avoid being kited.",
      ]),
      earlyGamePressure: jungleCategory("high", [
        "Can punish isolated junglers early, but failed commits are costly.",
      ]),
      gankThreat: jungleCategory("high", [
        "(Q) and (R) create sticky engage when lanes can follow.",
      ]),
      invadeResistance: jungleCategory("medium", [
        "Can fight back hard, but forced frenzy can be punished by collapse.",
      ]),
      matchupFocus: [
        "Fight around lanes that can move first so frenzy commits are protected.",
        "Invade weaker early junglers only with exit information or lane priority.",
        "Avoid starting objectives if the enemy can kite her away from her target.",
      ],
      objectiveControl: jungleCategory("medium", [
        "Objective speed is solid, but fight control matters more than raw secure.",
      ]),
      pathingNotes: [
        "Path toward volatile lanes and countergank windows.",
        "Keep tracking information before using (R) into fog or river.",
      ],
      scaling: jungleCategory("high", [
        "Carry threat scales through sustained damage and cleanup fights.",
      ]),
    },
    masteryDifficulty: "medium",
    mobilityLevel: "high",
    name: "Briar",
    primaryWinCondition:
      "Use healthy tempo and protected skirmishes to snowball into objective fights and cleanup dives.",
    strategicIdentity: {
      laneGoal: "snowball",
      preferredGameLength: "medium",
      scalingProfile: "mid",
      winMethod: ["extended skirmishes", "counterganks", "dive cleanup"],
    },
  },
  {
    archetype: ["AP diver", "power clearer", "teamfight engage"],
    damageType: "magic",
    dangerAbilities: ["(E) dash reset", "(R) pull"],
    hardCrowdControl: ["(R) pull"],
    id: "Diana",
    jungleProfile: {
      clearSpeed: jungleCategory("high", [
        "Fast AoE clear lets her reach level 6 and item spikes on tempo.",
      ]),
      dueling: jungleCategory("medium", [
        "Can fight when (Q)+(E) connects, but early isolated duels are not her best use.",
      ]),
      earlyGamePressure: jungleCategory("medium", [
        "Usually values efficient clearing before forcing high-risk ganks.",
      ]),
      gankThreat: jungleCategory("medium", [
        "Ganks improve when lanes provide setup or after level 6 unlocks (R).",
      ]),
      invadeResistance: jungleCategory("medium", [
        "Can escape or trade with (E), but early invaders can punish missed (Q).",
      ]),
      matchupFocus: [
        "Protect farming tempo and avoid bad scuttle flips before level 6.",
        "Use level 6 to force objective fights where (R) can hit multiple targets.",
        "Cross-map when early duelists invade with stronger lane priority.",
      ],
      objectiveControl: jungleCategory("high", [
        "High sustained magic damage helps secure dragons, Void Grubs, and Herald.",
      ]),
      pathingNotes: [
        "Full clear toward the safest first reset unless a lane has reliable setup.",
        "Sequence camps toward objective timers after level 6.",
      ],
      scaling: jungleCategory("high", [
        "Mid-game teamfight impact becomes strong with AP items and (R).",
      ]),
    },
    masteryDifficulty: "medium",
    mobilityLevel: "medium",
    name: "Diana",
    primaryWinCondition:
      "Keep clear tempo high, reach level 6 on time, and convert AP engage into objective fights.",
    strategicIdentity: {
      laneGoal: "teamfight",
      preferredGameLength: "medium",
      scalingProfile: "mid",
      winMethod: ["fast clears", "level 6 engage", "objective teamfights"],
    },
  },
  {
    archetype: ["AP assassin", "scaling skirmisher", "mobile diver"],
    damageType: "magic",
    dangerAbilities: ["(W) zone stun", "(E) dash", "(R) reset escape"],
    hardCrowdControl: ["(W) stun"],
    id: "Ekko",
    jungleProfile: {
      clearSpeed: jungleCategory("high", [
        "Efficient clears let him reach AP item and level 6 windows cleanly.",
      ]),
      dueling: jungleCategory("medium", [
        "Can win short skirmishes with passive procs, but hates being locked down early.",
      ]),
      earlyGamePressure: jungleCategory("medium", [
        "Has early gank angles, but usually becomes much safer after level 6.",
      ]),
      gankThreat: jungleCategory("medium", [
        "(W) can force strong ganks when cast from fog or with lane setup.",
      ]),
      invadeResistance: jungleCategory("high", [
        "Mobility and (R) make him difficult to punish once level 6 is available.",
      ]),
      matchupFocus: [
        "Farm toward level 6 while covering lanes that can set up (W).",
        "Avoid early river fights that deny passive procs or chain CC him.",
        "Use tempo resets to arrive first and threaten backline angles.",
      ],
      objectiveControl: jungleCategory("medium", [
        "Objective control is strongest after he can threaten a pick or zoning (W).",
      ]),
      pathingNotes: [
        "Full clear or five-camp into a lane with setup rather than forcing raw duels.",
        "Use fogged (W) before dragon or Void Grubs to control entrances.",
      ],
      scaling: jungleCategory("high", [
        "AP items and (R) make him a strong mid-game and late-game threat.",
      ]),
    },
    masteryDifficulty: "high",
    mobilityLevel: "high",
    name: "Ekko",
    primaryWinCondition:
      "Farm into level 6 and AP tempo, then use fogged (W) and mobility to win objective-side picks.",
    strategicIdentity: {
      laneGoal: "scale",
      preferredGameLength: "medium",
      scalingProfile: "mid",
      winMethod: ["AP scaling", "fog picks", "objective flank angles"],
    },
  },
  {
    archetype: ["early ganker", "AP diver", "tower-dive specialist"],
    damageType: "magic",
    dangerAbilities: ["(E) cocoon", "(E) rappel", "Spider form execute"],
    hardCrowdControl: ["(E) stun"],
    id: "Elise",
    jungleProfile: {
      clearSpeed: jungleCategory("medium", [
        "Clear is functional, but she wins by pressuring lanes instead of farming.",
      ]),
      dueling: jungleCategory("high", [
        "Strong early burst and form swapping can punish weaker first clears.",
      ]),
      earlyGamePressure: jungleCategory("very_high", [
        "One of the strongest early gank and dive junglers before scaling picks stabilize.",
      ]),
      gankThreat: jungleCategory("very_high", [
        "(E) cocoon and rappel create lethal early gank and dive patterns.",
      ]),
      invadeResistance: jungleCategory("high", [
        "Can punish invaders if cocoon lands, but falls off if early tempo fails.",
      ]),
      matchupFocus: [
        "Path toward lanes that can snowball from early ganks or dives.",
        "Invade scaling junglers before their first reset when lanes can collapse.",
        "Do not handshake full clears into champions that outscale her.",
      ],
      objectiveControl: jungleCategory("medium", [
        "Can start objectives after kills, but prefers winning the lane fight first.",
      ]),
      pathingNotes: [
        "Three-camp into gank, invade, or dive is often higher value than full clear.",
        "Use early wards to track where a scaling jungler can be punished.",
      ],
      scaling: jungleCategory("low", [
        "Needs early leads because late teamfight value is lower than scaling junglers.",
      ]),
    },
    masteryDifficulty: "high",
    mobilityLevel: "medium",
    name: "Elise",
    primaryWinCondition:
      "Use early ganks, dives, and invades to create lane leads before farming junglers outscale.",
    strategicIdentity: {
      laneGoal: "snowball",
      preferredGameLength: "short",
      scalingProfile: "early",
      winMethod: ["early dives", "level 3 pressure", "invade punish"],
    },
  },
  {
    archetype: ["stealth assassin", "AP scaler", "pick jungler"],
    damageType: "magic",
    dangerAbilities: ["Camouflage", "(W) charm", "(R) execute escape"],
    hardCrowdControl: ["(W) charm"],
    id: "Evelynn",
    jungleProfile: {
      clearSpeed: jungleCategory("medium", [
        "Needs clean early clears to reach level 6 without being disrupted.",
      ]),
      dueling: jungleCategory("low", [
        "Early forced duels are weak before camouflage and AP items.",
      ]),
      earlyGamePressure: jungleCategory("low", [
        "Pre-6 pressure is limited and mostly defensive.",
      ]),
      gankThreat: jungleCategory("high", [
        "Post-6 camouflage creates constant flank and pick pressure.",
      ]),
      invadeResistance: jungleCategory("low", [
        "Strong invaders can punish her early camps if lanes cannot cover.",
      ]),
      matchupFocus: [
        "Protect the first two clears and track invaders carefully.",
        "Cross-map instead of contesting early scuttle into strong duelists.",
        "After level 6, path through fog to punish pushed lanes and isolated carries.",
      ],
      objectiveControl: jungleCategory("medium", [
        "Objective setup improves after she can threaten picks before starting.",
      ]),
      pathingNotes: [
        "Full clear safely and avoid predictable low-health river paths.",
        "Use control wards and sweeper to create post-6 flank routes.",
      ],
      scaling: jungleCategory("high", [
        "AP items and stealth picks make her very threatening in mid and late game.",
      ]),
    },
    masteryDifficulty: "high",
    mobilityLevel: "medium",
    name: "Evelynn",
    primaryWinCondition:
      "Survive early invade pressure, reach level 6, and use camouflage to create picks before objectives.",
    strategicIdentity: {
      laneGoal: "scale",
      preferredGameLength: "long",
      scalingProfile: "late",
      winMethod: ["stealth picks", "AP burst scaling", "objective-side flanks"],
    },
  },
  {
    archetype: ["power farmer", "AP teamfighter", "ambush engager"],
    damageType: "magic",
    dangerAbilities: ["(Q) fear", "(R) channel ambush"],
    hardCrowdControl: ["(Q) fear", "(E) silence"],
    id: "Fiddlesticks",
    jungleProfile: {
      clearSpeed: jungleCategory("very_high", [
        "Very efficient multi-camp clearing is the core of his early tempo.",
      ]),
      dueling: jungleCategory("low", [
        "Dislikes direct early fights and invades before setup is ready.",
      ]),
      earlyGamePressure: jungleCategory("low", [
        "Usually wants level 6 and vision control before forcing plays.",
      ]),
      gankThreat: jungleCategory("high", [
        "Post-6 fog angles can decide lanes and objective fights instantly.",
      ]),
      invadeResistance: jungleCategory("low", [
        "Can be disrupted hard if enemies invade early with lane priority.",
      ]),
      matchupFocus: [
        "Hide first clear pathing and avoid direct river fights.",
        "Reach level 6 on tempo, then set up darkness before dragon or Herald.",
        "Trade cross-map camps when early duelists invade with priority.",
      ],
      objectiveControl: jungleCategory("high", [
        "(R) threat makes enemies respect objective entrances and choke points.",
      ]),
      pathingNotes: [
        "Full clear efficiently while tracking invade timers.",
        "Reset for control wards and sweepers before objective fights.",
      ],
      scaling: jungleCategory("high", [
        "Teamfight impact scales heavily with levels, items, and vision denial.",
      ]),
    },
    masteryDifficulty: "high",
    mobilityLevel: "low",
    name: "Fiddlesticks",
    primaryWinCondition:
      "Power farm to level 6, deny vision, and win objective fights with fogged (R) engages.",
    strategicIdentity: {
      laneGoal: "teamfight",
      preferredGameLength: "long",
      scalingProfile: "late",
      winMethod: ["fast clears", "vision denial", "ultimate ambushes"],
    },
  },
  {
    archetype: ["AP bruiser", "engage jungler", "disruptor"],
    damageType: "magic",
    dangerAbilities: ["(E) body slam", "(R) displacement"],
    hardCrowdControl: ["(E) stun", "(R) displacement"],
    id: "Gragas",
    jungleProfile: {
      clearSpeed: jungleCategory("medium", [
        "Clear is flexible and healthy, but not usually the fastest on the map.",
      ]),
      dueling: jungleCategory("medium", [
        "Can trade well around (E), but long isolated fights are not always ideal.",
      ]),
      earlyGamePressure: jungleCategory("medium", [
        "Can gank early with (E) angles and lane follow-up.",
      ]),
      gankThreat: jungleCategory("high", [
        "(E) flash and (R) displacement create strong engage and peel ganks.",
      ]),
      invadeResistance: jungleCategory("medium", [
        "Can disengage invades with (E), but is punishable if cooldowns are down.",
      ]),
      matchupFocus: [
        "Path toward lanes where (E) can force flash or setup kills.",
        "Use (R) to break enemy objective formations or deny smite access.",
        "Avoid slow full-clear handshakes against faster farming junglers.",
      ],
      objectiveControl: jungleCategory("high", [
        "(R) can separate the enemy jungler from dragon, Herald, or Baron.",
      ]),
      pathingNotes: [
        "Three-camp or full-clear depending on lane setup and invade threat.",
        "Hold flank angles before objectives instead of walking in front first.",
      ],
      scaling: jungleCategory("medium", [
        "Utility remains valuable, but damage depends on build and tempo.",
      ]),
    },
    masteryDifficulty: "medium",
    mobilityLevel: "medium",
    name: "Gragas",
    primaryWinCondition:
      "Use flexible gank paths and displacement to create picks, then control objective entrances.",
    strategicIdentity: {
      laneGoal: "control",
      preferredGameLength: "medium",
      scalingProfile: "mid",
      winMethod: ["gank disruption", "objective displacement", "frontline utility"],
    },
  },
  {
    archetype: ["ranged skirmisher", "invader", "tempo carry"],
    damageType: "physical",
    dangerAbilities: ["(E) dash", "(W) smoke screen", "(R) burst"],
    hardCrowdControl: [],
    id: "Graves",
    jungleProfile: {
      clearSpeed: jungleCategory("high", [
        "Fast, healthy clears let him keep tempo and fight over camps.",
      ]),
      dueling: jungleCategory("high", [
        "Strong early skirmisher when he can kite and stack armor.",
      ]),
      earlyGamePressure: jungleCategory("high", [
        "Can invade, counter-jungle, and punish weak early clears.",
      ]),
      gankThreat: jungleCategory("medium", [
        "Ganks rely more on damage, red buff, and lane setup than hard CC.",
      ]),
      invadeResistance: jungleCategory("high", [
        "Can kite invaders and contest camps with strong early damage.",
      ]),
      matchupFocus: [
        "Use clear health and tempo to invade weaker duelists or steal camps.",
        "Avoid wasting time on low-setup ganks that slow camp cycling.",
        "Use lane priority to control river entrances before objectives.",
      ],
      objectiveControl: jungleCategory("medium", [
        "Objective damage is solid, but he prefers arriving with tempo and vision.",
      ]),
      pathingNotes: [
        "Sequence camps toward invade windows and lane priority.",
        "Counter-jungle when the enemy shows on predictable gank paths.",
      ],
      scaling: jungleCategory("high", [
        "Item scaling makes him a strong carry if he keeps farm and tempo leads.",
      ]),
    },
    masteryDifficulty: "medium",
    mobilityLevel: "medium",
    name: "Graves",
    primaryWinCondition:
      "Use healthy clear tempo and ranged dueling to control camps, river, and objective entrances.",
    strategicIdentity: {
      laneGoal: "snowball",
      preferredGameLength: "medium",
      scalingProfile: "mid",
      winMethod: ["counter-jungling", "tempo leads", "ranged skirmishes"],
    },
  },
  {
    archetype: ["speed ganker", "diver", "teamfight initiator"],
    damageType: "physical",
    dangerAbilities: ["(E) charge", "(R) fear engage"],
    hardCrowdControl: ["(E) fear", "(R) fear"],
    id: "Hecarim",
    jungleProfile: {
      clearSpeed: jungleCategory("high", [
        "Fast camp cycling lets him reach level and item spikes while threatening lanes.",
      ]),
      dueling: jungleCategory("medium", [
        "Can fight with speed and sustained (Q), but hates being stopped by hard CC.",
      ]),
      earlyGamePressure: jungleCategory("medium", [
        "Ganks are threatening when lanes are extended, but he also values farming tempo.",
      ]),
      gankThreat: jungleCategory("high", [
        "High movement speed creates long-range gank and countergank angles.",
      ]),
      invadeResistance: jungleCategory("medium", [
        "Can escape many invades with speed, but can be punished if collapsed on.",
      ]),
      matchupFocus: [
        "Keep camp tempo high while punishing lanes that overextend.",
        "Use speed to countergank predictable early gank junglers.",
        "Force objective fights when (R) can reach carries from fog.",
      ],
      objectiveControl: jungleCategory("medium", [
        "Objective control depends on tempo and engage threat more than raw secure.",
      ]),
      pathingNotes: [
        "Full clear toward lanes that are likely to push forward.",
        "Reset on tempo before dragon or Herald so speed can control entry.",
      ],
      scaling: jungleCategory("high", [
        "Becomes a strong mid-game diver with items and ultimate threat.",
      ]),
    },
    masteryDifficulty: "medium",
    mobilityLevel: "very_high",
    name: "Hecarim",
    primaryWinCondition:
      "Cycle camps quickly, punish overextended lanes, and convert speed into objective-side engages.",
    strategicIdentity: {
      laneGoal: "snowball",
      preferredGameLength: "medium",
      scalingProfile: "mid",
      winMethod: ["fast clears", "speed ganks", "ultimate engages"],
    },
  },
  {
    archetype: ["utility jungler", "enchanter", "counter-jungler"],
    damageType: "magic",
    dangerAbilities: ["(Q) root", "(E) shield slow", "(R) Daisy knockup"],
    hardCrowdControl: ["(Q) root", "(R) knockup"],
    id: "Ivern",
    jungleProfile: {
      clearSpeed: jungleCategory("medium", [
        "Unique camp marking gives route flexibility but limited direct duel tempo.",
      ]),
      dueling: jungleCategory("low", [
        "Avoids isolated early fights unless lanes can collapse quickly.",
      ]),
      earlyGamePressure: jungleCategory("medium", [
        "Can create unusual invade and buff-share paths with team support.",
      ]),
      gankThreat: jungleCategory("medium", [
        "(Q) and (E) enable strong ally follow-up rather than solo burst.",
      ]),
      invadeResistance: jungleCategory("medium", [
        "Can avoid direct fights with pathing tricks, but loses hard if caught alone.",
      ]),
      matchupFocus: [
        "Use unusual routing to deny camps without accepting direct duels.",
        "Path toward lanes that can use shields, roots, and Daisy setup.",
        "Trade objectives and camps cross-map when duelists invade.",
      ],
      objectiveControl: jungleCategory("low", [
        "Raw objective damage is low, so setup and teammate access are required.",
      ]),
      pathingNotes: [
        "Mark camps safely and use priority lanes to protect delayed camp pickups.",
        "Play around buff sharing and counter-jungle timings rather than raw fights.",
      ],
      scaling: jungleCategory("high", [
        "Utility scaling becomes strong with teammates who can use shields and Daisy.",
      ]),
    },
    masteryDifficulty: "high",
    mobilityLevel: "low",
    name: "Ivern",
    primaryWinCondition:
      "Use creative routing and utility to deny camps, protect carries, and win grouped objective setups.",
    strategicIdentity: {
      laneGoal: "control",
      preferredGameLength: "long",
      scalingProfile: "late",
      winMethod: ["utility scaling", "counter-jungle routing", "shielded carries"],
    },
  },
  {
    archetype: ["transforming skirmisher", "wall-path diver", "scaling assassin"],
    damageType: "physical",
    dangerAbilities: ["Wall walk", "(W) knockup or slow", "(R) untargetability"],
    hardCrowdControl: ["Red Kayn (W) knockup"],
    id: "Kayn",
    jungleProfile: {
      clearSpeed: jungleCategory("high", [
        "Fast clearing and wall movement let him cycle camps efficiently.",
      ]),
      dueling: jungleCategory("medium", [
        "Early dueling is average before form, then depends heavily on form choice.",
      ]),
      earlyGamePressure: jungleCategory("low", [
        "Needs orbs and form progress more than risky early fights.",
      ]),
      gankThreat: jungleCategory("medium", [
        "Wall paths create unusual gank angles, especially into pushed lanes.",
      ]),
      invadeResistance: jungleCategory("medium", [
        "Can escape through terrain, but early duelists can delay form and camps.",
      ]),
      matchupFocus: [
        "Path for form progress without losing too many camps.",
        "Cross-map away from stronger early duelists and use terrain to trade camps.",
        "After form, force fights that match the chosen win condition.",
      ],
      objectiveControl: jungleCategory("medium", [
        "Objective fights improve once form and item progress are online.",
      ]),
      pathingNotes: [
        "Full clear efficiently while choosing lanes that give needed form progress.",
        "Use wall routes to avoid wards and punish predictable enemy pathing.",
      ],
      scaling: jungleCategory("high", [
        "Form transformation gives strong mid-game and late-game identity.",
      ]),
    },
    masteryDifficulty: "medium",
    mobilityLevel: "very_high",
    name: "Kayn",
    primaryWinCondition:
      "Maintain clear tempo, collect form safely, and use terrain angles to take over after transformation.",
    strategicIdentity: {
      laneGoal: "scale",
      preferredGameLength: "medium",
      scalingProfile: "mid",
      winMethod: ["form timing", "terrain ganks", "carry skirmishing"],
    },
  },
  {
    archetype: ["ranged marksman jungler", "mark scaler", "skirmisher"],
    damageType: "physical",
    dangerAbilities: ["(Q) mobility", "(E) execute", "(R) fight reset"],
    hardCrowdControl: [],
    id: "Kindred",
    jungleProfile: {
      clearSpeed: jungleCategory("medium", [
        "Clear is stable, but tempo often revolves around mark access.",
      ]),
      dueling: jungleCategory("high", [
        "Strong ranged kiting and sustained damage when space is available.",
      ]),
      earlyGamePressure: jungleCategory("high", [
        "Can contest early marks and river fights with lane priority.",
      ]),
      gankThreat: jungleCategory("medium", [
        "Ganks rely on damage and red buff rather than hard CC.",
      ]),
      invadeResistance: jungleCategory("medium", [
        "Can kite invaders, but collapses are dangerous without escape routes.",
      ]),
      matchupFocus: [
        "Contest marks only when nearby lanes can move first.",
        "Use ranged dueling to punish melee junglers in river with space.",
        "Do not sacrifice camp tempo for impossible marks.",
      ],
      objectiveControl: jungleCategory("high", [
        "Ranged DPS and (R) can control extended objective fights.",
      ]),
      pathingNotes: [
        "Path with expected mark spawns and lane priority in mind.",
        "Set vision before entering enemy jungle for marks.",
      ],
      scaling: jungleCategory("high", [
        "Marks and items create strong carry scaling if early access is protected.",
      ]),
    },
    masteryDifficulty: "high",
    mobilityLevel: "high",
    name: "Kindred",
    primaryWinCondition:
      "Use lane priority to secure marks, kite river fights, and scale into ranged objective control.",
    strategicIdentity: {
      laneGoal: "scale",
      preferredGameLength: "long",
      scalingProfile: "late",
      winMethod: ["mark scaling", "ranged skirmishing", "objective DPS"],
    },
  },
  {
    archetype: ["AP skirmisher", "power farmer", "teamfight sleeper"],
    damageType: "magic",
    dangerAbilities: ["Movement speed", "(E) sleep setup", "(R) global sleep trigger"],
    hardCrowdControl: ["(E) sleep", "(R) sleep"],
    id: "Lillia",
    jungleProfile: {
      clearSpeed: jungleCategory("very_high", [
        "Fast AoE clear and movement speed make camp cycling a major strength.",
      ]),
      dueling: jungleCategory("medium", [
        "Can kite melee junglers, but direct early burst or CC can punish her.",
      ]),
      earlyGamePressure: jungleCategory("medium", [
        "Can pressure with speed, but often prefers tempo farming into AP spikes.",
      ]),
      gankThreat: jungleCategory("medium", [
        "Ganks improve when (E) connects or lanes provide setup.",
      ]),
      invadeResistance: jungleCategory("medium", [
        "Speed helps escape, but early invades can disrupt low-health clears.",
      ]),
      matchupFocus: [
        "Use clear speed to out-tempo slower junglers and arrive first to objectives.",
        "Avoid being pinned in river before movement stacks are active.",
        "Use (E) and (R) setup before grouped objective fights.",
      ],
      objectiveControl: jungleCategory("high", [
        "High DPS and sleep threat can control objective entrances.",
      ]),
      pathingNotes: [
        "Full clear quickly and reset on tempo for item spikes.",
        "Path around lanes that can enable (E) or follow sleep engage.",
      ],
      scaling: jungleCategory("high", [
        "AP item scaling and sleep engage make her strong in later fights.",
      ]),
    },
    masteryDifficulty: "medium",
    mobilityLevel: "very_high",
    name: "Lillia",
    primaryWinCondition:
      "Out-clear slower junglers, keep tempo high, and use sleep setup to win objective fights.",
    strategicIdentity: {
      laneGoal: "scale",
      preferredGameLength: "long",
      scalingProfile: "late",
      winMethod: ["fast clears", "AP scaling", "sleep teamfights"],
    },
  },
  {
    archetype: ["AD bruiser", "teamfight diver", "clone engage"],
    damageType: "physical",
    dangerAbilities: ["(E) dash", "(R) cyclone knockup"],
    hardCrowdControl: ["(R) knockup"],
    id: "MonkeyKing",
    jungleProfile: {
      clearSpeed: jungleCategory("medium", [
        "Clear is solid enough to reach fights, but not a pure farming identity.",
      ]),
      dueling: jungleCategory("high", [
        "Can win skirmishes with clone deception and sustained damage.",
      ]),
      earlyGamePressure: jungleCategory("medium", [
        "Can gank early, but becomes much stronger with level 6 engage.",
      ]),
      gankThreat: jungleCategory("high", [
        "(E), clone positioning, and (R) create strong lane and river engage.",
      ]),
      invadeResistance: jungleCategory("medium", [
        "Clone can dodge key moments, but he can be punished if tracked early.",
      ]),
      matchupFocus: [
        "Farm efficiently toward level 6 unless a lane has easy setup.",
        "Fight around lanes that can follow (R) knockups.",
        "Use clone to bait cooldowns before committing to river fights.",
      ],
      objectiveControl: jungleCategory("medium", [
        "Objective fights are strong when (R) can disrupt multiple enemies.",
      ]),
      pathingNotes: [
        "Path toward teamfight lanes and first objective setup.",
        "Avoid low-value invades that delay level 6.",
      ],
      scaling: jungleCategory("high", [
        "Teamfight engage remains valuable through mid and late game.",
      ]),
    },
    masteryDifficulty: "medium",
    mobilityLevel: "medium",
    name: "Wukong",
    primaryWinCondition:
      "Reach level 6 on tempo and turn cyclone engage into river, dragon, and Herald wins.",
    strategicIdentity: {
      laneGoal: "teamfight",
      preferredGameLength: "medium",
      scalingProfile: "mid",
      winMethod: ["level 6 engage", "river skirmishes", "teamfight disruption"],
    },
  },
  {
    archetype: ["high-skill invader", "poke ganker", "tempo jungler"],
    damageType: "magic",
    dangerAbilities: ["(Q) spear", "(W) pounce", "(E) heal"],
    hardCrowdControl: [],
    id: "Nidalee",
    jungleProfile: {
      clearSpeed: jungleCategory("high", [
        "Fast, technical clears can create early tempo leads.",
      ]),
      dueling: jungleCategory("high", [
        "Strong early if spear hits and she can use cougar execute damage.",
      ]),
      earlyGamePressure: jungleCategory("very_high", [
        "Can invade and punish weak clears from level 2 or 3.",
      ]),
      gankThreat: jungleCategory("medium", [
        "Ganks are dangerous when (Q) lands, but unreliable without lane setup.",
      ]),
      invadeResistance: jungleCategory("high", [
        "Mobility, traps, and early damage make her hard to invade cleanly.",
      ]),
      matchupFocus: [
        "Use early tempo to invade slower or weaker first clears.",
        "Contest river only when spears or lane priority create health advantage.",
        "Do not fall behind by missing repeated low-percentage ganks.",
      ],
      objectiveControl: jungleCategory("medium", [
        "Objective setup is strongest after poke lands or enemy camps are denied.",
      ]),
      pathingNotes: [
        "Track enemy starts and path for early camp steals or counter-jungle.",
        "Use traps and spears to control river entrances before Scuttle.",
      ],
      scaling: jungleCategory("medium", [
        "Needs tempo and execution because late grouped fights reduce spear reliability.",
      ]),
    },
    masteryDifficulty: "very_high",
    mobilityLevel: "high",
    name: "Nidalee",
    primaryWinCondition:
      "Use fast clears, spears, and early invades to build tempo before grouped fights reduce her pick value.",
    strategicIdentity: {
      laneGoal: "snowball",
      preferredGameLength: "short",
      scalingProfile: "early",
      winMethod: ["early invades", "poke pressure", "camp denial"],
    },
  },
  {
    archetype: ["spell-shield diver", "level 6 ganker", "duelist"],
    damageType: "physical",
    dangerAbilities: ["(W) spell shield", "(E) fear", "(R) global darkness"],
    hardCrowdControl: ["(E) fear"],
    id: "Nocturne",
    jungleProfile: {
      clearSpeed: jungleCategory("high", [
        "Efficient full clears help him reach level 6 on schedule.",
      ]),
      dueling: jungleCategory("high", [
        "Strong sustained duelist when (W) blocks a key spell.",
      ]),
      earlyGamePressure: jungleCategory("medium", [
        "Can fight early, but his map threat spikes heavily at level 6.",
      ]),
      gankThreat: jungleCategory("high", [
        "(R) turns side lanes and low-vision targets into constant pressure.",
      ]),
      invadeResistance: jungleCategory("medium", [
        "Can fight invaders with fear and spell shield, but hates multi-lane collapse.",
      ]),
      matchupFocus: [
        "Full clear to level 6 without losing objective access.",
        "Use (R) to punish overextended lanes before starting objectives.",
        "Fight around spell shield value instead of blind river brawls.",
      ],
      objectiveControl: jungleCategory("high", [
        "Strong DPS and pick threat help secure dragons and Herald after level 6.",
      ]),
      pathingNotes: [
        "Sequence camps toward level 6 and first ultimate target.",
        "Track enemy jungler so (R) can convert into cross-map objective trades.",
      ],
      scaling: jungleCategory("medium", [
        "Mid-game pick threat is high, but late grouped fights can reduce access.",
      ]),
    },
    masteryDifficulty: "medium",
    mobilityLevel: "medium",
    name: "Nocturne",
    primaryWinCondition:
      "Full clear into level 6, then use darkness picks to create objective numbers advantages.",
    strategicIdentity: {
      laneGoal: "snowball",
      preferredGameLength: "medium",
      scalingProfile: "mid",
      winMethod: ["level 6 picks", "objective DPS", "spell-shield duels"],
    },
  },
  {
    archetype: ["anti-dash tank", "ganking bruiser", "peel jungler"],
    damageType: "physical",
    dangerAbilities: ["(W) anti-dash zone", "(E) wall stun", "(R) displacement"],
    hardCrowdControl: ["(E) stun", "(R) knockup"],
    id: "Poppy",
    jungleProfile: {
      clearSpeed: jungleCategory("medium", [
        "Clear is stable but not usually faster than dedicated farmers.",
      ]),
      dueling: jungleCategory("high", [
        "Very strong into dash champions and terrain-heavy river fights.",
      ]),
      earlyGamePressure: jungleCategory("high", [
        "Can gank and invade early when walls or dash denial matter.",
      ]),
      gankThreat: jungleCategory("high", [
        "(E) wall stun and (W) dash denial create reliable punishment angles.",
      ]),
      invadeResistance: jungleCategory("high", [
        "Can turn many invades with (W) and wall stun threat.",
      ]),
      matchupFocus: [
        "Path toward lanes where wall stun or dash denial creates kills.",
        "Invade mobile junglers when nearby lanes can collapse.",
        "Use (R) to remove enemy jungler from objective contests.",
      ],
      objectiveControl: jungleCategory("high", [
        "(R) can deny smite access and reset bad objective fights.",
      ]),
      pathingNotes: [
        "Three-camp into gank or invade is strong when terrain angles are available.",
        "Defend river entrances against dash-reliant skirmishers.",
      ],
      scaling: jungleCategory("medium", [
        "Utility remains strong, but carry damage does not scale like farming junglers.",
      ]),
    },
    masteryDifficulty: "medium",
    mobilityLevel: "medium",
    name: "Poppy",
    primaryWinCondition:
      "Punish dash-heavy junglers and lanes with wall-stun ganks, then deny objective access with (R).",
    strategicIdentity: {
      laneGoal: "control",
      preferredGameLength: "medium",
      scalingProfile: "mid",
      winMethod: ["anti-dash control", "wall-stun ganks", "objective denial"],
    },
  },
  {
    archetype: ["anti-AD tank", "speed ganker", "taunt engager"],
    damageType: "magic",
    dangerAbilities: ["(Q) rolling engage", "(E) taunt"],
    hardCrowdControl: ["(Q) knockup", "(E) taunt", "(R) knockup"],
    id: "Rammus",
    jungleProfile: {
      clearSpeed: jungleCategory("low", [
        "Clear speed is modest, so tempo usually comes from ganks.",
      ]),
      dueling: jungleCategory("medium", [
        "Strong into auto attackers, weak into magic damage and kite-heavy fights.",
      ]),
      earlyGamePressure: jungleCategory("medium", [
        "Can gank early with (Q), but needs lanes to capitalize.",
      ]),
      gankThreat: jungleCategory("high", [
        "(Q) speed and (E) taunt punish pushed lanes and immobile carries.",
      ]),
      invadeResistance: jungleCategory("low", [
        "Can be invaded by magic damage or fast clear junglers before armor value matters.",
      ]),
      matchupFocus: [
        "Path toward AD-heavy lanes and punish overextended carries.",
        "Avoid handshaking farm against faster junglers without gank payoff.",
        "Use cross-map ganks instead of fighting AP duelists in river.",
      ],
      objectiveControl: jungleCategory("low", [
        "Raw objective speed is low without teammate damage.",
      ]),
      pathingNotes: [
        "Three-camp or four-camp toward an overextended lane is often best.",
        "Defensive ward against invades when facing fast AP junglers.",
      ],
      scaling: jungleCategory("high", [
        "Armor and taunt value can become game-changing into AD-heavy teams.",
      ]),
    },
    masteryDifficulty: "low",
    mobilityLevel: "high",
    name: "Rammus",
    primaryWinCondition:
      "Use fast gank angles and anti-AD scaling to punish carries before faster junglers take over camps.",
    strategicIdentity: {
      laneGoal: "teamfight",
      preferredGameLength: "long",
      scalingProfile: "late",
      winMethod: ["taunt ganks", "anti-AD scaling", "carry lockdown"],
    },
  },
  {
    archetype: ["early tunnel ganker", "burrow diver", "snowball fighter"],
    damageType: "physical",
    dangerAbilities: ["Tunnel paths", "(W) knockup", "(R) execute chase"],
    hardCrowdControl: ["(W) knockup"],
    id: "RekSai",
    jungleProfile: {
      clearSpeed: jungleCategory("high", [
        "Fast early clears and tunnels create strong first-map tempo.",
      ]),
      dueling: jungleCategory("high", [
        "Strong early fighter when she reaches targets from burrowed angles.",
      ]),
      earlyGamePressure: jungleCategory("very_high", [
        "One of the best early gank and invade junglers before scaling picks stabilize.",
      ]),
      gankThreat: jungleCategory("very_high", [
        "Tunnel angles and knockup make early ganks difficult to respect.",
      ]),
      invadeResistance: jungleCategory("high", [
        "Can fight or tunnel out early if tracking information is good.",
      ]),
      matchupFocus: [
        "Attack lanes and camps before scaling junglers reach safe clears.",
        "Use tunnels to repeat-gank flashless lanes.",
        "Avoid slow games where her early tempo loses value.",
      ],
      objectiveControl: jungleCategory("medium", [
        "Objective control comes from early numbers advantages more than scaling DPS.",
      ]),
      pathingNotes: [
        "Three-camp into gank, invade, or countergank is a core plan.",
        "Place tunnels to revisit volatile lanes and objective entrances.",
      ],
      scaling: jungleCategory("low", [
        "Falls off compared to carry junglers if early plays do not snowball.",
      ]),
    },
    masteryDifficulty: "high",
    mobilityLevel: "high",
    name: "Rek'Sai",
    primaryWinCondition:
      "Use early tunnel ganks and invades to create a tempo lead before scaling junglers stabilize.",
    strategicIdentity: {
      laneGoal: "snowball",
      preferredGameLength: "short",
      scalingProfile: "early",
      winMethod: ["early ganks", "repeat pressure", "camp denial"],
    },
  },
  {
    archetype: ["brush assassin", "invader", "pick jungler"],
    damageType: "physical",
    dangerAbilities: ["Brush leap", "(E) root", "(R) stealth hunt"],
    hardCrowdControl: ["Empowered (E) root"],
    id: "Rengar",
    jungleProfile: {
      clearSpeed: jungleCategory("medium", [
        "Clear is solid, but brush control and invade angles define his tempo.",
      ]),
      dueling: jungleCategory("high", [
        "Very strong early near brush or with empowered ability management.",
      ]),
      earlyGamePressure: jungleCategory("high", [
        "Can invade and fight early when lane priority protects entrances.",
      ]),
      gankThreat: jungleCategory("high", [
        "Post-6 pick threat from (R) forces carries to respect fog.",
      ]),
      invadeResistance: jungleCategory("high", [
        "Can punish invaders near brush, but open river fights are less favorable.",
      ]),
      matchupFocus: [
        "Control river brush before contesting Scuttle or objectives.",
        "Invade farming junglers when lanes can cover his exit.",
        "Use (R) to create picks before starting dragon or Baron.",
      ],
      objectiveControl: jungleCategory("medium", [
        "Objective setup is strongest after a pick or brush-controlled river fight.",
      ]),
      pathingNotes: [
        "Path through brush-heavy routes and track enemy camp timers.",
        "Use lane priority to move into enemy jungle before objectives.",
      ],
      scaling: jungleCategory("high", [
        "Pick threat scales well with damage, but grouped enemies reduce access.",
      ]),
    },
    masteryDifficulty: "high",
    mobilityLevel: "high",
    name: "Rengar",
    primaryWinCondition:
      "Use brush control, invades, and ultimate picks to deny camps and create objective numbers advantages.",
    strategicIdentity: {
      laneGoal: "snowball",
      preferredGameLength: "medium",
      scalingProfile: "mid",
      winMethod: ["brush skirmishes", "invades", "ultimate picks"],
    },
  },
  {
    archetype: ["deceptive assassin", "early ganker", "trap controller"],
    damageType: "mixed",
    dangerAbilities: ["(Q) invisibility", "(W) box", "(R) clone"],
    hardCrowdControl: ["(W) fear"],
    id: "Shaco",
    jungleProfile: {
      clearSpeed: jungleCategory("high", [
        "Box setup can create fast and healthy early clears.",
      ]),
      dueling: jungleCategory("medium", [
        "Wins through deception, boxes, and ambushes rather than honest front fights.",
      ]),
      earlyGamePressure: jungleCategory("high", [
        "Level 2 and level 3 gank or invade cheese can break lanes early.",
      ]),
      gankThreat: jungleCategory("high", [
        "(Q) invisibility creates unusual gank paths and backstab pressure.",
      ]),
      invadeResistance: jungleCategory("high", [
        "Boxes and (Q) make invading him risky when he has setup.",
      ]),
      matchupFocus: [
        "Use early uncertainty to steal camps, gank unexpectedly, or punish weak starts.",
        "Avoid predictable routes once enemies track box setup.",
        "Control objective entrances with boxes before starting fights.",
      ],
      objectiveControl: jungleCategory("medium", [
        "Objective control is strongest when boxes and clone disrupt enemy entry.",
      ]),
      pathingNotes: [
        "Choose first route to hide information and create surprise pressure.",
        "Set boxes around river entrances before dragon or Void Grubs.",
      ],
      scaling: jungleCategory("medium", [
        "Pick and disruption remain useful, but raw teamfight scaling varies by build.",
      ]),
    },
    masteryDifficulty: "high",
    mobilityLevel: "high",
    name: "Shaco",
    primaryWinCondition:
      "Use deceptive early paths, camp steals, and trap control to create chaos before grouped fights reduce surprise value.",
    strategicIdentity: {
      laneGoal: "snowball",
      preferredGameLength: "short",
      scalingProfile: "early",
      winMethod: ["cheese ganks", "counter-jungling", "trap control"],
    },
  },
  {
    archetype: ["power farmer", "dragon-form fighter", "objective scaler"],
    damageType: "mixed",
    dangerAbilities: ["(W) speed", "(E) mark damage", "(R) dragon engage"],
    hardCrowdControl: ["(R) displacement"],
    id: "Shyvana",
    jungleProfile: {
      clearSpeed: jungleCategory("very_high", [
        "Fast farming and camp cycling are core strengths.",
      ]),
      dueling: jungleCategory("medium", [
        "Can fight around fury and (E), but early CC-heavy invades are dangerous.",
      ]),
      earlyGamePressure: jungleCategory("low", [
        "Usually wants to farm and reach dragon-form and item windows.",
      ]),
      gankThreat: jungleCategory("low", [
        "Pre-6 ganks lack reliable CC; post-6 angles are stronger.",
      ]),
      invadeResistance: jungleCategory("medium", [
        "Can clear away quickly, but early disruption can delay key spikes.",
      ]),
      matchupFocus: [
        "Use clear speed to trade camps and objectives instead of forcing bad ganks.",
        "Prioritize dragon windows when lane priority allows safe setup.",
        "Avoid early river fights against stronger duelists without fury or lane help.",
      ],
      objectiveControl: jungleCategory("high", [
        "Strong sustained damage and dragon focus make objective trades valuable.",
      ]),
      pathingNotes: [
        "Full clear on tempo and track enemy ganks for cross-map objective trades.",
        "Sequence toward dragon when bot and mid priority are available.",
      ],
      scaling: jungleCategory("high", [
        "Item and form scaling can take over mid-game fights.",
      ]),
    },
    masteryDifficulty: "low",
    mobilityLevel: "medium",
    name: "Shyvana",
    primaryWinCondition:
      "Power farm, trade cross-map objectives, and use dragon-form spikes to control mid-game fights.",
    strategicIdentity: {
      laneGoal: "scale",
      preferredGameLength: "medium",
      scalingProfile: "mid",
      winMethod: ["fast clears", "dragon control", "form-based teamfights"],
    },
  },
  {
    archetype: ["tank engager", "terrain controller", "objective frontliner"],
    damageType: "mixed",
    dangerAbilities: ["Terrain grab", "(E) wall pin", "(R) suppression"],
    hardCrowdControl: ["(E) stun", "(R) suppression"],
    id: "Skarner",
    jungleProfile: {
      clearSpeed: jungleCategory("medium", [
        "Clear is reliable enough to reach early objective setups.",
      ]),
      dueling: jungleCategory("medium", [
        "Can fight around terrain and shields, but does not want pure DPS races.",
      ]),
      earlyGamePressure: jungleCategory("medium", [
        "Can gank with wall angles and objective-side control.",
      ]),
      gankThreat: jungleCategory("high", [
        "(E) wall pin and (R) suppression punish lanes without escape routes.",
      ]),
      invadeResistance: jungleCategory("high", [
        "Terrain control and tankiness make careless invades risky.",
      ]),
      matchupFocus: [
        "Path toward lanes where walls make (E) reliable.",
        "Control river terrain before objectives and punish face-checks.",
        "Avoid chasing into open space where his terrain tools lose value.",
      ],
      objectiveControl: jungleCategory("high", [
        "Frontline control and suppression can deny enemy objective access.",
      ]),
      pathingNotes: [
        "Sequence camps toward wall-heavy gank lanes.",
        "Hold river chokes before dragon, Herald, or Baron.",
      ],
      scaling: jungleCategory("high", [
        "Tank utility and suppression remain valuable in later grouped fights.",
      ]),
    },
    masteryDifficulty: "medium",
    mobilityLevel: "medium",
    name: "Skarner",
    primaryWinCondition:
      "Use wall-based ganks and tank control to secure objective setups and isolate priority targets.",
    strategicIdentity: {
      laneGoal: "teamfight",
      preferredGameLength: "long",
      scalingProfile: "late",
      winMethod: ["terrain ganks", "frontline control", "suppression picks"],
    },
  },
  {
    archetype: ["AP control jungler", "roaming mage", "objective controller"],
    damageType: "magic",
    dangerAbilities: ["(W) displacement", "(E) worked ground burst", "(R) wall"],
    hardCrowdControl: ["(W) displacement"],
    id: "Taliyah",
    jungleProfile: {
      clearSpeed: jungleCategory("high", [
        "Clear becomes efficient when she manages worked ground and camp spacing.",
      ]),
      dueling: jungleCategory("medium", [
        "Can punish dashes and narrow paths, but struggles when jumped directly.",
      ]),
      earlyGamePressure: jungleCategory("medium", [
        "Can gank early with lane setup and gains map reach with (R).",
      ]),
      gankThreat: jungleCategory("high", [
        "(W)+(E) punishes predictable movement and (R) creates long-range plays.",
      ]),
      invadeResistance: jungleCategory("medium", [
        "Can deter invades through choke points, but hates being collapsed on.",
      ]),
      matchupFocus: [
        "Use clear tempo to arrive early to river and punish dash junglers in chokes.",
        "Path toward lanes with setup for (W).",
        "Use (R) to create numbers advantages before objectives.",
      ],
      objectiveControl: jungleCategory("high", [
        "Zone control around pits and entrances makes objective setup strong.",
      ]),
      pathingNotes: [
        "Sequence camps while preserving worked ground movement options.",
        "Play river chokes instead of open-space duels.",
      ],
      scaling: jungleCategory("high", [
        "AP damage and map control remain strong into grouped objective fights.",
      ]),
    },
    masteryDifficulty: "high",
    mobilityLevel: "medium",
    name: "Taliyah",
    primaryWinCondition:
      "Use AP clear tempo, anti-dash zones, and (R) map reach to control river and objective fights.",
    strategicIdentity: {
      laneGoal: "control",
      preferredGameLength: "long",
      scalingProfile: "late",
      winMethod: ["river control", "anti-dash zones", "map-wall picks"],
    },
  },
  {
    archetype: ["duelist", "anti-tank bruiser", "objective brawler"],
    damageType: "physical",
    dangerAbilities: ["(Q) bite", "(E) pillar", "(R) stat drain"],
    hardCrowdControl: [],
    id: "Trundle",
    jungleProfile: {
      clearSpeed: jungleCategory("medium", [
        "Clear is steady and healthy, though not as fast as power farmers.",
      ]),
      dueling: jungleCategory("very_high", [
        "Elite early and mid-game duelist, especially into tanks and melee junglers.",
      ]),
      earlyGamePressure: jungleCategory("high", [
        "Can contest river and invade weaker duelists early.",
      ]),
      gankThreat: jungleCategory("medium", [
        "(E) pillar creates strong gank setup when lanes can follow.",
      ]),
      invadeResistance: jungleCategory("high", [
        "Very difficult to invade directly because he can stat-check many junglers.",
      ]),
      matchupFocus: [
        "Contest Scuttle and camps against weaker duelists when lanes can move.",
        "Use pillar to trap enemy junglers near objectives or narrow exits.",
        "Avoid getting kited by mobile ranged champions without flank angles.",
      ],
      objectiveControl: jungleCategory("high", [
        "Strong sustained damage and dueling make early objectives realistic.",
      ]),
      pathingNotes: [
        "Path toward first river fight or a lane where pillar creates a kill.",
        "Invade tank junglers after tracking lane priority.",
      ],
      scaling: jungleCategory("medium", [
        "Remains strong into tanks, but can be kited in late grouped fights.",
      ]),
    },
    masteryDifficulty: "low",
    mobilityLevel: "low",
    name: "Trundle",
    primaryWinCondition:
      "Use superior dueling and pillar control to win river fights, steal camps, and secure early objectives.",
    strategicIdentity: {
      laneGoal: "snowball",
      preferredGameLength: "medium",
      scalingProfile: "mid",
      winMethod: ["early duels", "pillar picks", "objective brawls"],
    },
  },
  {
    archetype: ["stance fighter", "power clearer", "tempo bruiser"],
    damageType: "mixed",
    dangerAbilities: ["Empowered stance", "(E) stun", "(R) AoE damage"],
    hardCrowdControl: ["(E) stun"],
    id: "Udyr",
    jungleProfile: {
      clearSpeed: jungleCategory("very_high", [
        "Excellent clear speed lets him control tempo and repeat camp cycles.",
      ]),
      dueling: jungleCategory("high", [
        "Strong early and mid-game duelist with empowered stance choices.",
      ]),
      earlyGamePressure: jungleCategory("high", [
        "Can invade, counter-jungle, or gank early through movement speed.",
      ]),
      gankThreat: jungleCategory("medium", [
        "(E) stun is reliable if he reaches the target, but he lacks long-range engage.",
      ]),
      invadeResistance: jungleCategory("high", [
        "Fast clears, durability, and dueling make invades difficult to execute.",
      ]),
      matchupFocus: [
        "Use clear speed to take camps before slower junglers can respond.",
        "Invade when lane priority covers entrances and exit routes.",
        "Convert tempo into objectives rather than chasing low-value ganks.",
      ],
      objectiveControl: jungleCategory("high", [
        "Strong sustained damage and tempo make objectives a major strength.",
      ]),
      pathingNotes: [
        "Full clear quickly, then choose invade, Scuttle, or objective based on lane priority.",
        "Track enemy camp respawns and punish slow rotations.",
      ],
      scaling: jungleCategory("medium", [
        "Mid-game tempo is excellent, but late fights require good target access.",
      ]),
    },
    masteryDifficulty: "medium",
    mobilityLevel: "high",
    name: "Udyr",
    primaryWinCondition:
      "Use elite clear tempo and stance dueling to control camps, river, and early objectives.",
    strategicIdentity: {
      laneGoal: "control",
      preferredGameLength: "medium",
      scalingProfile: "mid",
      winMethod: ["fast clears", "counter-jungling", "objective tempo"],
    },
  },
  {
    archetype: ["lockdown diver", "pick jungler", "objective enforcer"],
    damageType: "physical",
    dangerAbilities: ["(Q) dash knockback", "(R) point-and-click lockdown"],
    hardCrowdControl: ["(Q) knockback", "(R) knockup"],
    id: "Vi",
    jungleProfile: {
      clearSpeed: jungleCategory("high", [
        "Clear is efficient enough to keep pace while looking for ganks.",
      ]),
      dueling: jungleCategory("high", [
        "Strong early skirmisher when (Q) connects and she can keep attacking.",
      ]),
      earlyGamePressure: jungleCategory("high", [
        "Can gank early and threaten direct river fights.",
      ]),
      gankThreat: jungleCategory("high", [
        "(Q) gives early access, and (R) makes post-6 picks reliable.",
      ]),
      invadeResistance: jungleCategory("medium", [
        "Can fight back, but missed (Q) or lane collapse can punish her.",
      ]),
      matchupFocus: [
        "Path toward lanes where (Q) ganks can force flash.",
        "Use level 6 to create guaranteed picks before objectives.",
        "Avoid starting fights into stronger duelists without lane help.",
      ],
      objectiveControl: jungleCategory("high", [
        "Good objective damage and (R) lockdown help deny enemy smite access.",
      ]),
      pathingNotes: [
        "Three-camp or full-clear depending on early lane gank quality.",
        "Track enemy flashes and repeat gank with (R).",
      ],
      scaling: jungleCategory("medium", [
        "Reliable lockdown remains valuable, but she is not a late hypercarry.",
      ]),
    },
    masteryDifficulty: "medium",
    mobilityLevel: "medium",
    name: "Vi",
    primaryWinCondition:
      "Use early ganks and level 6 lockdown to create picks that convert into dragons and Heralds.",
    strategicIdentity: {
      laneGoal: "snowball",
      preferredGameLength: "medium",
      scalingProfile: "mid",
      winMethod: ["lockdown ganks", "pick setup", "objective conversion"],
    },
  },
  {
    archetype: ["AP bruiser", "tower-dive tank", "early skirmisher"],
    damageType: "mixed",
    dangerAbilities: ["(Q) stun", "(E) dash", "(R) tower disable"],
    hardCrowdControl: ["(Q) stun"],
    id: "Volibear",
    jungleProfile: {
      clearSpeed: jungleCategory("high", [
        "Clear is healthy and fast enough to pressure early lanes or objectives.",
      ]),
      dueling: jungleCategory("high", [
        "Strong early duelist with stun, shield, and sustained damage.",
      ]),
      earlyGamePressure: jungleCategory("high", [
        "Can invade, countergank, or dive early when lanes can follow.",
      ]),
      gankThreat: jungleCategory("high", [
        "(Q) stun and (R) tower disable make dives very threatening.",
      ]),
      invadeResistance: jungleCategory("high", [
        "Durability and early fighting make direct invades risky.",
      ]),
      matchupFocus: [
        "Force early river fights when lanes can move first.",
        "Dive lanes after level 6 and convert plates or objectives.",
        "Do not let faster scaling farmers avoid all early interaction.",
      ],
      objectiveControl: jungleCategory("high", [
        "Strong early fighting and sustained damage make objective starts reliable.",
      ]),
      pathingNotes: [
        "Path toward lanes with dive potential or early CC follow-up.",
        "Use priority to start dragon or Void Grubs before scaling junglers arrive.",
      ],
      scaling: jungleCategory("medium", [
        "Mid-game threat is strong, but late value depends on engage quality.",
      ]),
    },
    masteryDifficulty: "low",
    mobilityLevel: "medium",
    name: "Volibear",
    primaryWinCondition:
      "Use early dueling, tower dives, and objective tempo to snowball before hard scalers stabilize.",
    strategicIdentity: {
      laneGoal: "snowball",
      preferredGameLength: "medium",
      scalingProfile: "mid",
      winMethod: ["early duels", "tower dives", "objective tempo"],
    },
  },
  {
    archetype: ["early duelist", "sustain ganker", "skirmish hunter"],
    damageType: "physical",
    dangerAbilities: ["(Q) follow", "(E) fear", "(R) suppression"],
    hardCrowdControl: ["(E) fear", "(R) suppression"],
    id: "Warwick",
    jungleProfile: {
      clearSpeed: jungleCategory("medium", [
        "Clear is healthy, though not as fast as elite power farmers.",
      ]),
      dueling: jungleCategory("very_high", [
        "Extremely strong early duelist with sustain and fear.",
      ]),
      earlyGamePressure: jungleCategory("high", [
        "Can punish low-health lanes and contest early river fights.",
      ]),
      gankThreat: jungleCategory("high", [
        "Blood trail, fear, and (R) create strong chase and lockdown.",
      ]),
      invadeResistance: jungleCategory("high", [
        "Sustain and dueling make direct invades dangerous for enemies.",
      ]),
      matchupFocus: [
        "Fight early around low-health targets and lanes that can move.",
        "Use sustain to contest Scuttle and punish greedy full clears.",
        "Avoid being kited in late fights without flank or (R) angle.",
      ],
      objectiveControl: jungleCategory("high", [
        "Sustain allows early objective attempts when lanes can cover.",
      ]),
      pathingNotes: [
        "Path toward volatile lanes where blood trail can create early kills.",
        "Use early river pressure before farming junglers reach item spikes.",
      ],
      scaling: jungleCategory("medium", [
        "Pick and suppression remain useful, but late teamfights can kite him.",
      ]),
    },
    masteryDifficulty: "low",
    mobilityLevel: "medium",
    name: "Warwick",
    primaryWinCondition:
      "Use elite early sustain dueling to control river, punish low-health lanes, and secure first objectives.",
    strategicIdentity: {
      laneGoal: "snowball",
      preferredGameLength: "medium",
      scalingProfile: "early",
      winMethod: ["early duels", "sustain objectives", "lockdown ganks"],
    },
  },
  {
    archetype: ["long-range tank ganker", "engage", "scaling frontline"],
    damageType: "magic",
    dangerAbilities: ["(E) elastic engage", "(Q) pull", "(R) disruption"],
    hardCrowdControl: ["(E) knockup", "(Q) pull", "(R) knockup"],
    id: "Zac",
    jungleProfile: {
      clearSpeed: jungleCategory("medium", [
        "Clear is stable but early tempo is slower than fast farming junglers.",
      ]),
      dueling: jungleCategory("low", [
        "Weak in early isolated duels before tank stats and team follow-up.",
      ]),
      earlyGamePressure: jungleCategory("medium", [
        "Can gank early from unusual angles, but hates being invaded.",
      ]),
      gankThreat: jungleCategory("very_high", [
        "(E) creates long-range fog ganks that bypass normal ward lines.",
      ]),
      invadeResistance: jungleCategory("low", [
        "Strong invaders can punish him before he has levels and vision.",
      ]),
      matchupFocus: [
        "Protect early camps and path toward lanes vulnerable to long-range (E).",
        "Avoid early river duels unless lanes collapse first.",
        "Use tank scaling and engage angles to start objective fights later.",
      ],
      objectiveControl: jungleCategory("high", [
        "Engage range and frontline durability make objective turns strong.",
      ]),
      pathingNotes: [
        "Full clear or defensive path away from early invaders.",
        "Use lane fog and wall angles for ganks rather than predictable river walks.",
      ],
      scaling: jungleCategory("high", [
        "Tank engage and disruption scale well into grouped fights.",
      ]),
    },
    masteryDifficulty: "medium",
    mobilityLevel: "high",
    name: "Zac",
    primaryWinCondition:
      "Survive early invades, then use long-range engage to create gank tempo and objective fights.",
    strategicIdentity: {
      laneGoal: "teamfight",
      preferredGameLength: "long",
      scalingProfile: "late",
      winMethod: ["long-range ganks", "frontline engage", "objective turns"],
    },
  },
] satisfies readonly JungleCombatProfileSeed[];

export const remainingJungleCombatProfiles = Object.fromEntries(
  remainingJungleProfileSeeds.map((profile) => [
    profile.id,
    createJungleCombatProfile(profile),
  ])
) as Record<string, LeagueChampionKnowledgeProfile>;
