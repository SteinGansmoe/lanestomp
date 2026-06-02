import type { LeagueChampionKnowledgeProfile } from "./types";

export const gnarCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "high",
  abilities: { Q: "Boomerang Throw / Boulder Toss", W: "Hyper / Wallop", E: "Hop / Crunch", R: "GNAR!" },
  archetype: ["ranged harasser", "form-shift tank", "teamfight engage", "side-lane"],
  primaryWinCondition: ["Use mini form range to chip and kite, manage Rage carefully, and convert mega form into crowd control, dives, or teamfight engage."],
  dangerAbilities: ["Mega (R) wall stun", "Mega (W) stun", "(E) hop engage or escape"],
  dangerProfile: {
    dangerousWhen: ["Rage is close to mega form and he can jump forward.", "Mega form has wall angles for (R).", "Mini form can kite melee champions with repeated (Q) and (W) procs."],
    mustRespect: ["His threat changes dramatically with Rage.", "Mega form gives real hard CC and durability.", "Mini form is vulnerable if caught without (E)."],
  },
  commonWeaknesses: ["Form timing can be played around.", "Mini form is fragile.", "Mega form loses ranged pressure after the engage window."],
  damageType: "physical",
  hardCrowdControl: ["Mega (W) stun", "Mega (R) stun"],
  id: "Gnar",
  importantAbilityNotes: ["Mini (Q) pokes and slows.", "Mini (W) rewards repeated hits.", "(E) changes with form and can transform mid-jump.", "Mega (R) is strongest near terrain."],
  lanePlan: {
    avoids: ["Fighting mini form with (E) down.", "Transforming at bad wave timings.", "Wasting mega form before objectives or crash windows."],
    idealLaneState: "A top lane where Gnar controls spacing in mini form and times mega form for crashes, dives, or river fights.",
    wants: ["Melee targets he can kite.", "Rage timed before major fights.", "Terrain angles for mega (R)."],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: ["Kiting melee lanes.", "Wave crashes with mega form ready.", "Teamfights around terrain."],
    scalingPriority: "medium",
    winLaneBy: ["Using mini range to stack chip damage.", "Timing mega form before enemy commit.", "Landing mega CC near walls."],
  },
  majorPowerSpikes: ["Level 6 (R) in mega form.", "First bruiser item.", "Objective fights with controlled Rage."],
  matchupPreferences: {
    strongInto: ["Melee champions he can kite.", "Teams that fight near terrain.", "Lanes that cannot punish mini form cooldowns."],
    weakInto: ["Hard engage during mini form.", "Sustain that absorbs poke.", "Champions that disengage mega form and re-engage after."],
  },
  mobilityLevel: "medium",
  name: "Gnar",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      { timing: "Level 6 with mega form", reason: "(R) adds wall stun and teamfight engage", changesGameplay: "Gnar can turn wave or river fights if Rage is prepared.", playerAction: "Manage Rage before fights and look for terrain angles.", enemyResponse: "Back away before mega form or fight after it expires." },
      { timing: "Controlled Rage objective setup", reason: "Mega form provides durable engage and layered CC", changesGameplay: "His teamfight value spikes when he transforms on time.", playerAction: "Enter fights with Rage nearly full rather than randomly transforming in lane.", enemyResponse: "Delay the fight until mega form falls off." },
    ],
  },
  primaryRoles: ["top"],
  primaryTradingPattern: "Harass in mini form with range and (Q), kite with (E), and commit harder only when Rage will provide mega form durability and crowd control.",
  punishProfile: {
    canPunish: ["Melee champions stuck in mini-form poke range.", "Enemies grouped near walls during mega form.", "Targets that engage as he transforms."],
    strugglesToPunish: ["Champions that force on mini form with (E) down.", "Enemies who wait out mega form."],
  },
  secondaryRoles: [],
  shields: [],
  softCrowdControl: ["Mini (Q) slow", "Mega (Q) slow"],
  stealthOrInvisibility: null,
  strategicIdentity: { laneGoal: "control", preferredGameLength: "medium", scalingProfile: "mid", winMethod: ["ranged lane pressure", "Rage-timed engage", "side-lane kiting"] },
  sustain: [],
  trading: {
    badTradeConditions: ["Mini form (E) is down.", "Rage is mistimed and mega expires before the fight.", "The enemy can sustain through poke."],
    goodTradeConditions: ["Mini form has range advantage.", "Rage is near mega before an all-in.", "Terrain gives mega (R) angles."],
    primaryPattern: "Use mini range for chip damage, preserve (E), and convert Rage into decisive mega-form crowd control.",
  },
  punishWindows: ["Mini Gnar is fragile when (E) is down.", "After mega form expires, he loses hard CC.", "Bad Rage timing can leave him weak for the next wave or fight."],
} satisfies LeagueChampionKnowledgeProfile;

