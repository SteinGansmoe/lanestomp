import type { LeagueRole } from "./roles";

export type LeagueChampionDamageType = "magic" | "physical" | "mixed";
export type LeagueChampionMobilityLevel =
  | "high"
  | "low"
  | "medium"
  | "none"
  | "very_high";

export type LeagueChampionKnowledgeProfile = {
  archetype: string[];
  commonWeaknesses: string[];
  damageType: LeagueChampionDamageType;
  hardCrowdControl: string[];
  id: string;
  importantAbilityNotes: string[];
  laneIdentity: string;
  majorPowerSpikes: string[];
  mobilityLevel: LeagueChampionMobilityLevel;
  name: string;
  offMetaRoles: LeagueRole[];
  primaryRoles: LeagueRole[];
  primaryTradingPattern: string;
  secondaryRoles: LeagueRole[];
  shields: string[];
  softCrowdControl: string[];
  stealthOrInvisibility: string | null;
  sustain: string[];
  dangerAbilities: string[];
  primaryWinCondition: string[];
  punishWindows: string[];
};

export const leagueChampionKnowledgeProfiles = {
  Ahri: {
    archetype: ["mobile mage", "pick", "roam"],
    primaryWinCondition: ["Land E Charm to pick off targets and snowball leads."],
    dangerAbilities: ["E Charm"],
    commonWeaknesses: [
      "Pre 6 or while ult is on cooldown, she is vulnerable.",
      "Skillshot reliant.",
      "Waveclear is weaker before Lost Chapter.",
    ],
    damageType: "magic",
    hardCrowdControl: ["E Charm"],
    id: "Ahri",
    importantAbilityNotes: [
      "E is her key punish and peel tool.",
      "R gives repeated dashes at level 6.",
      "W is very strong at lower levels to proc electrcute",
      "Q return damage rewards clean spacing.",
    ],
    laneIdentity:
      "One of the safest blind picks in the game, very hard to gank after level 6.",
    majorPowerSpikes: [
      "Level 3 full basic ability access.",
      "Level 6 Spirit Rush.",
      "First completed mage item.",
    ],
    mobilityLevel: "high",
    name: "Ahri",
    offMetaRoles: [],
    primaryRoles: ["mid"],
    secondaryRoles: [],
    primaryTradingPattern:
      "Poke with Q and look for E opportunities when available. W to easily proc electrocute is especially strong in early trades.",
    shields: [],
    softCrowdControl: [],
    stealthOrInvisibility: null,
    sustain: ["Passive healing from minion or champion takedown stacks."],
    punishWindows: [
  "If Ahri misses charm, she can be punished hard.",
  "If Ahri is forced to ult away, she has to play very carefully until its back up again"
]
  },
  Akali: {
    archetype: ["assassin", "skirmisher"],
    primaryWinCondition: ["Use W Twilight Shroud to create safe windows for extended trades and all-ins."],
    dangerAbilities: ["W Twilight Shroud, E Shuriken Flip"],
    commonWeaknesses: [
      "Can be punished when Twilight Shroud is down.",
      "Early waveclear can be exploitable by ranged mids.",
      "Needs energy and ability access to extend trades.",
    ],
    damageType: "magic",
    hardCrowdControl: [],
    id: "Akali",
    importantAbilityNotes: [
      "Twilight Shroud is not a level 6 spike.",
      "Twilight Shroud creates her safest trading window.",
      "Shuriken Flip recast is a major commit point.",
    ],
    laneIdentity:
      "Melee AP assassin who gives ground early, becomes stronger after level 3.",
    majorPowerSpikes: [
      "Level 3 full basic ability access.",
      "Level 6 Perfect Execution.",
      "First completed AP assassin item.",
    ],
    mobilityLevel: "very_high",
    name: "Akali",
    offMetaRoles: [],
    primaryRoles: ["mid"],
    secondaryRoles: ["top"],
    primaryTradingPattern:
      "Look for Q poke into passive autos, then commit harder with Shroud or E when the opponent is exposed.",
    shields: [],
    softCrowdControl: ["Short slow on Q hit"],
    stealthOrInvisibility: "W Twilight Shroud obscures Akali and enables trades.",
    sustain: [],
    punishWindows: [
  "When Akali uses W, if the opponent can step out of the shroud or wait it out, she can be punished hard.",
]
  },
  Akshan: {
    archetype: ["marksman", "roam", "lane bully"],
    primaryWinCondition: ["Use E Heroic Swing to punish overextensions and create roam opportunities."],
    dangerAbilities: ["E Paddle Star", "R Comeuppance"],
    commonWeaknesses: [
      "Short range for a marksman makes positioning risky.",
      "Heroic Swing can be interrupted or punished if used forward.",
      "Falls behind if early pressure does not convert.",
    ],
    damageType: "physical",
    hardCrowdControl: [],
    id: "Akshan",
    importantAbilityNotes: [
      "W Going Rogue is camouflage and roaming utility, not a direct combat spell.",
      "Heroic Swing is his main mobility and commit tool.",
      "He should not be described as a crowd-control champion.",
    ],
    laneIdentity:
      "Ranged AD lane bully who pressures short trades, early push, and side movement.",
    majorPowerSpikes: [
      "Level 2 access to Q plus E or W utility.",
      "Level 6 Comeuppance.",
      "First completed AD marksman item.",
    ],
    mobilityLevel: "high",
    name: "Akshan",
    offMetaRoles: [],
    primaryRoles: ["mid"],
    secondaryRoles: [],
    primaryTradingPattern:
      "Use autos and Avengerang for short ranged pressure, then reposition with Heroic Swing.",
    shields: [],
    softCrowdControl: [],
    stealthOrInvisibility: "W Going Rogue grants camouflage outside direct combat.",
    sustain: [],
    punishWindows: [
  "After Akshan uses E to engage, if he misses or is interrupted he can be punished hard.",
]
  },
  Diana: {
    archetype: ["assassin", "diver", "skirmisher"],
    primaryWinCondition: ["Q + E + W combo does very high burst damage, look to land it when electrocute is up."],
    dangerAbilities: ["Q Crescent Strike, E Lunar Rush"],
    commonWeaknesses: [
      "Can be punished before she lands Crescent Strike.",
      "Commits forward to trade or all-in.",
      "If E is on cooldown, Diana loses alot of pressure.",
    ],
    damageType: "magic",
    hardCrowdControl: ["R Moonfall"],
    id: "Diana",
    importantAbilityNotes: [
      "E resets when used on a Moonlight-marked target.",
      "Moonfall is her level 6 teamfight and all-in threat.",
      "W Pale Cascade gives a shield, not sustain.",
    ],
    laneIdentity:
      "AP diver who wants short trades until target is in kill range.",
    majorPowerSpikes: [
      "Level 3 full basic ability access.",
      "Level 6 Moonfall.",
      "First completed AP skirmish item.",
    ],
    mobilityLevel: "high",
    name: "Diana",
    offMetaRoles: [],
    primaryRoles: ["jungle"],
    secondaryRoles: ["mid"],
    primaryTradingPattern:
      "While Q is travelling to the target you can use E to get reset.",
    shields: ["W Pale Cascade"],
    softCrowdControl: [],
    stealthOrInvisibility: null,
    sustain: [],
    punishWindows: ["If Diana misses Q, she can be punished hard.",
      "If Diana uses E without resetting cooldown, she will struggle.",
    "Diana's way of all inning is predictable"]
  },
  Ekko: {
    archetype: ["assassin", "skirmisher", "scaling"],
    primaryWinCondition: ["Short trades with Q and E, a well-times W stun can turn a fight in his favor, and R can be used to dodge key damage or reset fights."],
    dangerAbilities: ["W Parallel Convergence stun", "E Phase Dive", "R Chronobreak"],
    commonWeaknesses: [
      "Alot of CC champions will interrupt his setup.",
      "Can be pressured before level 6.",
      "Needs items to shine.",
    ],
    damageType: "magic",
    hardCrowdControl: ["W Parallel Convergence stun"],
    id: "Ekko",
    importantAbilityNotes: [
      "Parallel Convergence is delayed and requires setup.",
      "Chronobreak is his level 6 safety and burst reset.",
      "Phase Dive is his main trading mobility.",
    ],
    laneIdentity:
      "Scaling AP assassin who wants short trades, wave access, and explosive all-ins after setup.",
    majorPowerSpikes: [
      "Level 3 full basic ability access.",
      "Level 6 Chronobreak.",
      "First completed AP burst item.",
    ],
    mobilityLevel: "high",
    name: "Ekko",
    offMetaRoles: [],
    primaryRoles: ["jungle"],
    secondaryRoles: ["mid"],
    primaryTradingPattern:
      "Use Timewinder and Phase Dive for quick burst, then disengage after proccing passive for movement speed to back off.",
    shields: ["W Parallel Convergence shield if Ekko enters the zone"],
    softCrowdControl: ["Q Timewinder slow"],
    stealthOrInvisibility: null,
    sustain: ["R Chronobreak heal on cast."],
    punishWindows: [
  "W takes a while to activate, and if it misses he will take return damage in trades.",
  "If Ekko engages with E but misses with Q, he will often lose out in trades.",
  "Before level 6 Ekko is much easier to kill"
]
  },
  Fizz: {
    archetype: ["assassin", "melee burst"],
    primaryWinCondition: ["Short trades until target is in kill range."],
    dangerAbilities: [],
    commonWeaknesses: [
      "If enemy team is very tanky, Fizz might not be able to secure kills.",
      "Have to be very careful before level 3, give up minions to not lose hp.",
      "Is a melee champion.",
    ],
    damageType: "magic",
    hardCrowdControl: ["R Chum the Waters knockup"],
    id: "Fizz",
    importantAbilityNotes: [
      "E Playful / Trickster is his main dodge, engage, and escape tool.",
      "R Chum the Waters creates his level 6 kill threat.",
      "He has no reliable hard CC before ultimate.",
    ],
    laneIdentity:
      "Melee AP assassin who survives early pressure and looks for level 6 burst windows.",
    majorPowerSpikes: [
      "Level 3 full basic ability access.",
      "Level 6 Chum the Waters.",
      "First completed AP assassin item.",
    ],
    mobilityLevel: "high",
    name: "Fizz",
    offMetaRoles: [],
    primaryRoles: ["mid"],
    secondaryRoles: ["jungle"],
    primaryTradingPattern:
      "Dash in for burst, use Playful / Trickster to dodge the key answer, then exit or finish.",
    shields: [],
    softCrowdControl: ["E Playful / Trickster slow"],
    stealthOrInvisibility: null,
    sustain: [],
    punishWindows: [
  "If Fizz uses E recklessly, he will struggle.",
  "Before Fizz turns level 3 he is very weak, if he steps up attack him"
]
  },
  Hwei: {
    archetype: ["artillery mage", "control mage"],
    primaryWinCondition: ["Use long-range poke and E spellbook CC to control the lane and set up for level 6 all-in with Spiraling Despair."],
    dangerAbilities: ["E spellbook fear or root depending on spell choice"],
    commonWeaknesses: [
      "Has more ability options then any other champion, requires a lot of practice to master.",
      "Can be punished by fast all-ins.",
      "Requires correct spell choice under pressure.",
    ],
    damageType: "magic",
    hardCrowdControl: ["E spellbook fear or root depending on spell choice"],
    id: "Hwei",
    importantAbilityNotes: [
      "Hwei has multiple spellbook choices, but only some provide crowd control.",
      "His defensive answer depends on choosing the right E spell.",
      "He should not be framed as mobile.",
    ],
    laneIdentity:
      "Long-range control mage who uses spell variety to poke, waveclear, and punish predictable engages.",
    majorPowerSpikes: [
      "Level 3 access to all basic spellbooks.",
      "Level 6 Spiraling Despair.",
      "First completed mage item.",
    ],
    mobilityLevel: "none",
    name: "Hwei",
    offMetaRoles: [],
    primaryRoles: ["mid"],
    secondaryRoles: ["adc", "support"],
    primaryTradingPattern:
      "Control space with long-range spells and hold defensive E choices for enemy engage timing.",
    shields: ["W spellbook can provide shielding depending on spell choice"],
    softCrowdControl: ["Several E and R effects can slow or disrupt"],
    stealthOrInvisibility: null,
    sustain: [],
    punishWindows: [
  "If Hwei chooses the wrong E spell for the situation, he can be punished hard.",
  "Skillshot reliant champions can be punished by dodging their key abilities and forcing them into unfavorable trades."
]
  },
  Leblanc: {
    archetype: ["assassin", "poke", "mobility"],
    primaryWinCondition: ["Can be very hard to deal with in lane for other champions."],
    dangerAbilities: [],
    commonWeaknesses: [
      "Has low waveclear, if enemy pushes her she ends up farming under tower.",
      "Can be punished if her return pad is controlled.",
      "Needs clean ability chains to convert pressure.",
    ],
    damageType: "magic",
    hardCrowdControl: ["E Ethereal Chains root after tether completes"],
    id: "Leblanc",
    importantAbilityNotes: [
      "Distortion is both her main damage pattern and mobility.",
      "Ethereal Chains root is delayed and can be broken by distance.",
      "Mimic repeats a basic ability after level 6.",
    ],
    laneIdentity:
      "Mobile AP assassin who pressures with burst trades and punishes poor spacing.",
    majorPowerSpikes: [
      "Level 2 burst with Q plus W or E.",
      "Level 6 Mimic.",
      "First completed AP burst item.",
    ],
    mobilityLevel: "very_high",
    name: "LeBlanc",
    offMetaRoles: [],
    primaryRoles: ["mid"],
    secondaryRoles: [],
    primaryTradingPattern:
      "Use W Distortion for burst and repositioning, then threaten E Chains if the opponent cannot answer.",
    shields: [],
    softCrowdControl: [],
    stealthOrInvisibility: "Passive Mirror Image briefly makes her harder to identify at low health.",
    sustain: [],
    punishWindows: [
  "If LeBlanc uses W to engage and misses, she can be punished hard.",
  "Leblanc has very low waveclear, she can be pushed under tower and can easily be poked down, forcing her out of lane or into unfavorable trades if she tries to contest the push."
]
  },
  Lux: {
    archetype: ["artillery mage", "pick", "poke"],
    primaryWinCondition: [],
    dangerAbilities: [],
    commonWeaknesses: [
      "If Q is used recklessly, she can be punished.",
      "Skillshot reliant.",
      "Can be all-inned if she loses range control.",
    ],
    damageType: "magic",
    hardCrowdControl: ["Q Light Binding root"],
    id: "Lux",
    importantAbilityNotes: [
      "Light Binding is her key defensive and pick tool.",
      "Prismatic Barrier shields allies and herself.",
      "Q + E + R does significant damage.",
    ],
    laneIdentity:
      "Long-range mage who controls lane with poke, binding threat, and waveclear.",
    majorPowerSpikes: [
      "Level 3 full basic ability access.",
      "Level 6 Final Spark.",
      "First completed mage item.",
    ],
    mobilityLevel: "none",
    name: "Lux",
    offMetaRoles: [],
    primaryRoles: ["support"],
    secondaryRoles: ["mid"],
    primaryTradingPattern:
      "Poke with Lucent Singularity and punish oversteps with Light Binding into burst.",
    shields: ["W Prismatic Barrier"],
    softCrowdControl: ["E Lucent Singularity slow"],
    stealthOrInvisibility: null,
    sustain: [],
    punishWindows: [
  "If Lux misses Q she can be punished.",
  "Skillshot reliant champions like Lux can be punished by dodging their key abilities and forcing them into unfavorable trades."
]
  },
  Malzahar: {
    archetype: ["control mage", "anti-carry", "push"],
    primaryWinCondition: ["Keep midlane pushed permanently, eventually allowing Malzahar to have presence around the map."],
    dangerAbilities: ["R Nether Grasp suppression"],
    commonWeaknesses: [
      "He can be punished in the early levels by someone who can counter his push.",
      "Predictable lane pattern.",
      "Ultimate channel can be interrupted by external crowd control.",
    ],
    damageType: "magic",
    hardCrowdControl: ["R Nether Grasp suppression", "Q Call of the Void silence"],
    id: "Malzahar",
    importantAbilityNotes: [
      "Passive Void Shift is a spell shield, not sustain.",
      "Nether Grasp is his level 6 point-and-click lockdown.",
      "Voidlings help push but are vulnerable to area damage.",
    ],
    laneIdentity:
      "Push-focused control mage who neutralizes lane and threatens level 6 lockdown.",
    majorPowerSpikes: [
      "Level 3 full basic ability access.",
      "Level 6 Nether Grasp.",
      "First completed mana/AP item.",
    ],
    mobilityLevel: "none",
    name: "Malzahar",
    offMetaRoles: [],
    primaryRoles: ["mid"],
    secondaryRoles: ["top"],
    primaryTradingPattern:
      "Push with Malefic Visions and Voidlings, then threaten silence or ultimate when the enemy steps forward.",
    shields: ["Passive Void Shift spell shield"],
    softCrowdControl: [],
    stealthOrInvisibility: null,
    sustain: [],
    punishWindows: [
  "Early levels Malzahar can be pushed under tower if enemy focus on killing Voidlings as they spawn",
  "If Malzahar cannot maintain lane pressure, he does not have the tools to counter the push early."
]
  },
  Orianna: {
    archetype: ["control mage", "teamfight", "scaling"],
    primaryWinCondition: ["Control the lane with ball placement and create opportunities for teamfighting."],
    dangerAbilities: ["R Command: Shockwave displacement"],
    commonWeaknesses: [
      "Immobile and vulnerable to direct all-ins.",
      "Needs ball position to threaten or defend.",
      "Can be pressured before enough mana and AP.",
    ],
    damageType: "magic",
    hardCrowdControl: ["R Command: Shockwave displacement"],
    id: "Orianna",
    importantAbilityNotes: [
      "Ball position controls her threat zone.",
      "Command: Protect gives a shield.",
      "Shockwave is her level 6 teamfight spike.",
    ],
    laneIdentity:
      "Control mage who wins through spacing, ball control, wave management, and teamfight setup.",
    majorPowerSpikes: [
      "Level 3 full basic ability access.",
      "Level 6 Command: Shockwave.",
      "First completed mage item.",
    ],
    mobilityLevel: "none",
    name: "Orianna",
    offMetaRoles: [],
    primaryRoles: ["mid"],
    secondaryRoles: [],
    primaryTradingPattern:
      "Use ball placement to zone and poke, then shield or speed herself through return trades.",
    shields: ["E Command: Protect"],
    softCrowdControl: ["W Command: Dissonance slow/speed zone"],
    stealthOrInvisibility: null,
    sustain: [],
    punishWindows: [
  "Punish early while Q has a longer cooldown.",
  "She can be punished if she uses her abilities recklessly."
]
  },
  Sylas: {
    archetype: ["skirmisher", "bruiser mage", "assassin"],
    primaryWinCondition: ["Use E Abscond / Abduct to engage or threaten, then look for extended trades with W Kingslayer and stolen ultimates."],
    dangerAbilities: ["E Abduct knockup/stun on hit"],
    commonWeaknesses: [
      "Can be punished when Kingslayer or Abscond / Abduct is down.",
      "Melee range makes early lane risky into poke.",
      "Ultimate value depends on enemy ultimates.",
    ],
    damageType: "magic",
    hardCrowdControl: ["E Abduct knockup/stun on hit"],
    id: "Sylas",
    importantAbilityNotes: [
      "Kingslayer is his main combat heal.",
      "Hijack depends on available enemy ultimates.",
      "Abscond / Abduct is his main engage and escape pattern.",
    ],
    laneIdentity:
      "Melee AP skirmisher who looks for extended trades and strong stolen ultimate windows.",
    majorPowerSpikes: [
      "Level 3 full basic ability access.",
      "Level 6 Hijack if valuable ultimates are available.",
      "First completed AP skirmish item.",
    ],
    mobilityLevel: "high",
    name: "Sylas",
    offMetaRoles: ["top", "jungle"],
    primaryRoles: ["mid"],
    secondaryRoles: [],
    primaryTradingPattern:
      "Use E to enter or threaten, trade with passive autos and Kingslayer, then disengage if cooldowns are down.",
    shields: [],
    softCrowdControl: ["Q Chain Lash slow"],
    stealthOrInvisibility: null,
    sustain: ["W Kingslayer heal"],
    punishWindows: [
  "If Sylas uses E to engage and misses, he can be punished hard.",
  "An early healing cut item can significantly reduce his sustain in trades.",
  "Being shoved under turret is not ideal for Sylas as his waveclear is not the best and he can be punished by enemy laner."
]
  },
  Syndra: {
    archetype: ["burst mage", "control mage"],
    primaryWinCondition: ["Use Q and W to control space and poke, then look for E stun into R burst all-in windows."],
    dangerAbilities: ["E Scatter the Weak stun when knocking spheres"],
    commonWeaknesses: [
      "Immobile and punishable when Scatter the Weak is down.",
      "Needs sphere setup for strongest control.",
      "Can be pressured before scaling stacks and items.",
    ],
    damageType: "magic",
    hardCrowdControl: ["E Scatter the Weak stun when knocking spheres"],
    id: "Syndra",
    importantAbilityNotes: [
      "Scatter the Weak is her key disengage and stun tool.",
      "Unleashed Power is level 6 single-target burst.",
      "Sphere placement changes her stun threat.",
    ],
    laneIdentity:
      "Burst control mage who zones with spheres and punishes oversteps with stun into burst.",
    majorPowerSpikes: [
      "Level 3 full basic ability access.",
      "Level 6 Unleashed Power.",
      "First completed mage item.",
    ],
    mobilityLevel: "none",
    name: "Syndra",
    offMetaRoles: [],
    primaryRoles: ["mid"],
    secondaryRoles: [],
    primaryTradingPattern:
      "Poke with Dark Sphere, hold Scatter the Weak to punish commits, and burst when stun lands.",
    shields: [],
    softCrowdControl: ["W Force of Will slow"],
    stealthOrInvisibility: null,
    sustain: [],
    punishWindows: [
  "If E stun is missed, Syndra has no escape at all.",
  "If Syndra misses spells, she can be all-inned as she has no mobility or sustain."
]
  },
  Talon: {
    archetype: ["assassin", "roam", "burst"],
    primaryWinCondition: ["Push the wave to create roam opportunities, then use E to move around the map quickly."],
    dangerAbilities: ["E Assassin's Path terrain mobility, R Shadow Assault burst and stealth"],
    commonWeaknesses: [
      "Can be punished by ranged control before all-in access.",
      "Needs lane movement and flank angles to maximize pressure.",
      "Weaker when forced to stay visible in lane.",
    ],
    damageType: "physical",
    hardCrowdControl: [],
    id: "Talon",
    importantAbilityNotes: [
      "Assassin's Path gives terrain mobility, not combat crowd control.",
      "Shadow Assault gives level 6 burst and stealth.",
      "E is not a direct engage tool, can only be used on terrain and is best for roaming or repositioning.",
      "Rake return damage and passive bleed matter for trades.",
    ],
    laneIdentity:
      "AD assassin who pushes or trades for roam timers and burst windows.",
    majorPowerSpikes: [
      "Level 2 access to Q plus W pressure.",
      "Level 6 Shadow Assault.",
      "First completed lethality item.",
    ],
    mobilityLevel: "high",
    name: "Talon",
    offMetaRoles: [],
    primaryRoles: ["mid"],
    secondaryRoles: ["jungle"],
    primaryTradingPattern:
      "Land Rake, threaten Q follow-up and passive bleed, then use roam pressure when the wave allows.",
    shields: [],
    softCrowdControl: ["W Rake slow on return"],
    stealthOrInvisibility: "R Shadow Assault grants stealth during the burst window.",
    sustain: ["Q Noxian Diplomacy heals on unit kill."],
    punishWindows: [
  "When he uses Q he dashes towards the target.",
  "Talon has to wait a while to use E over the same terrain.",
  "Talon's waveclear is not the best, he can be shoved under turret and forced to farm"
]
  },
  Veigar: {
    archetype: ["scaling mage", "control", "burst"],
    primaryWinCondition: ["Farm stacks with Q to become an unstoppable late-game burst threat."],
    dangerAbilities: ["E Event Horizon stun"],
    commonWeaknesses: [
      "Immobile and vulnerable when Event Horizon is down.",
      "Weak early if denied farm and stacks.",
      "Skillshot and cage placement dependent.",
    ],
    damageType: "magic",
    hardCrowdControl: ["E Event Horizon stun"],
    id: "Veigar",
    importantAbilityNotes: [
      "E is his key defensive and pick tool.",
      "Phenomenal Evil scales endlessly.",
      "R is level 6 execute-style burst.",
      "The longer the game goes on, the stronger Veigar becomes.",
    ],
    laneIdentity:
      "Scaling control mage who farms stacks, controls space with cage, and becomes a burst threat.",
    majorPowerSpikes: [
      "Level 3 full basic ability access.",
      "Level 6 Primordial Burst.",
      "First completed mage item plus stack growth.",
    ],
    mobilityLevel: "none",
    name: "Veigar",
    offMetaRoles: ["adc", "support"],
    primaryRoles: ["mid"],
    secondaryRoles: [],
    primaryTradingPattern:
      "Farm stacks safely, punish movement with Event Horizon, then burst trapped targets.",
    shields: [],
    softCrowdControl: [],
    stealthOrInvisibility: null,
    sustain: [],
    punishWindows: [
  "If Veigar is caught without Event Horizon.",
  "If Veigar pushes wave to far he can be punished as hes only peel is E."
]
  },
  Vex: {
    archetype: ["anti-dash mage", "burst", "control"],
    primaryWinCondition: ["Utilize her passive to win trades in lane."],
    dangerAbilities: ["Passive Doom fear"],
    commonWeaknesses: [
      "Immobile outside ultimate reset windows.",
      "Fear timing can be baited or forced out.",
      "Can be outranged by artillery mages.",
    ],
    damageType: "magic",
    hardCrowdControl: ["Passive Doom fear"],
    id: "Vex",
    importantAbilityNotes: [
      "Using her passive correctly is key to winning lane.",
      "R is her level 6 engage/reset tool.",
      "She is strongest into champions that dash often.",
    ],
    laneIdentity:
      "Anti-mobility burst mage who controls dash champions with fear windows.",
    majorPowerSpikes: [
      "Level 3 full basic ability access.",
      "Level 6 Shadow Surge.",
      "First completed AP burst item.",
    ],
    mobilityLevel: "medium",
    name: "Vex",
    offMetaRoles: [],
    primaryRoles: ["mid"],
    secondaryRoles: [],
    primaryTradingPattern:
      "Use passive fear to win trades and easily proc electrocute.",
    shields: ["W Personal Space shield"],
    softCrowdControl: ["E Looming Darkness slow"],
    stealthOrInvisibility: null,
    sustain: [],
    punishWindows: [
  "If Vex fails to land her fear, she can be all-inned.",
  "While her R is down she has no way to reset."
]
  },
  Viktor: {
    archetype: ["control mage", "scaling", "zone control"],
    primaryWinCondition: ["Scale with item upgrades to control space and teamfights."],
    dangerAbilities: [],
    commonWeaknesses: [
      "Immobile and vulnerable to hard engage.",
      "Needs upgrades and items to fully control fights.",
      "Can be punished when W is down.",
    ],
    damageType: "magic",
    hardCrowdControl: ["W Gravity Field stun after delay"],
    id: "Viktor",
    importantAbilityNotes: [
      "W is delayed zone control, not instant CC.",
      "Q gives a shield, and bonus movement speed when evolved.",
      "E is his main poke tool, it can hit twice when evolved and should not be missed in trades.",
      "R is his ultimate ability, providing a powerful area-of-effect damage.",
      "Viktor wants to scale and evolve all his abilities",
    ],
    laneIdentity:
      "Scaling control mage who farms, pokes with laser, and controls choke points.",
    majorPowerSpikes: [
      "Level 3 full basic ability access.",
      "Level 6 Chaos Storm.",
      "First completed mage item and evolution progress.",
      "Can adapt to a more tankier build (Rod of Ages and Liandry's Torment) if enemy team has strong all-in or dive threats."
    ],
    mobilityLevel: "none",
    name: "Viktor",
    offMetaRoles: [],
    primaryRoles: ["mid"],
    secondaryRoles: ["top"],
    primaryTradingPattern:
      "Trade with Death Ray and Siphon Power shield while keeping Gravity Field for disengage.",
    shields: ["Q Siphon Power"],
    softCrowdControl: ["W Gravity Field slow before stun"],
    stealthOrInvisibility: null,
    sustain: [],
    punishWindows: [
  "If Viktor place W in a bad spot, he is vulnerable.",
  "If Viktor uses abilities on wave clear only he can be punished by enemy laner."
]
  },
  Xerath: {
    archetype: ["artillery mage", "poke", "siege"],
    primaryWinCondition: ["Use Q and W to control space and poke, can have decent map pressure post level 6 due to his ultimate."],
    dangerAbilities: ["E Shocking Orb stun"],
    commonWeaknesses: [
      "Immobile and vulnerable to flank or all-in pressure.",
      "Skillshot reliant.",
      "Struggles when enemies dodge poke and force close fights.",
      "Becomes incredibly strong after 2 items are completed."
    ],
    damageType: "magic",
    hardCrowdControl: ["E Shocking Orb stun"],
    id: "Xerath",
    importantAbilityNotes: [
      "E is his key self-peel tool.",
      "R gives long-range level 6 follow-up.",
      "Positioning is crucial for maximizing his damage potential and survival.",
    ],
    laneIdentity:
      "Long-range artillery mage who wins through poke, waveclear, and spacing.",
    majorPowerSpikes: [
      "Level 3 full basic ability access.",
      "Level 6 Rite of the Arcane.",
      "First completed mana/AP item.",
    ],
    mobilityLevel: "none",
    name: "Xerath",
    offMetaRoles: [],
    primaryRoles: ["support"],
    secondaryRoles: ["mid"],
    primaryTradingPattern:
      "Q for long range poke, use W for slow to hit Q easier, and hold E defensively or use if you're guaranteed to hit.",
    shields: [],
    softCrowdControl: ["W Eye of Destruction slow"],
    stealthOrInvisibility: null,
    sustain: [],
    punishWindows: [
  "If Xerath uses E and misses he has to play back.",
  "When charging his Q."
]
  },
  Yasuo: {
    archetype: ["skirmisher", "melee carry", "mobility"],
    primaryWinCondition: ["Use Q and E to create mobility and control space, wants to fight close to minions."],
    dangerAbilities: ["Second Q tornado knockup, R Last Breath follow-up on airborne targets"],
    commonWeaknesses: [
      "Needs minion waves or targets for mobility.",
      "Vulnerable when Wind Wall and passive shield are down.",
      "Can be punished by controlled wave states and point-and-click CC.",
    ],
    damageType: "physical",
    hardCrowdControl: ["Q tornado knockup", "R Last Breath follow-up on airborne targets"],
    id: "Yasuo",
    importantAbilityNotes: [
      "E requires targets and cannot freely dash without them.",
      "W blocks many projectiles but not all abilities.",
      "R requires an airborne target.",
    ],
    laneIdentity:
      "Melee AD skirmisher who uses waves for mobility, short trades, and all-ins off knockups.",
    majorPowerSpikes: [
      "Level 2 access to Q plus E mobility.",
      "Level 6 R if knockup access exists.",
      "First completed item.",
    ],
    mobilityLevel: "very_high",
    name: "Yasuo",
    offMetaRoles: ["adc"],
    primaryRoles: ["mid"],
    secondaryRoles: ["top"],
    primaryTradingPattern:
      "Stack Q, dash through wave targets, use W against key projectiles, and commit on knockup threat.",
    shields: ["Passive Way of the Wanderer flow shield"],
    softCrowdControl: [],
    stealthOrInvisibility: null,
    sustain: [],
    punishWindows: [
  "When W is down, Yasuo has no real way of dodging.",
  "When there isnt a minion wave to E back and forth from."
]
  },
  Yone: {
    archetype: ["skirmisher", "assassin", "melee carry"],
    primaryWinCondition: ["Use E + Q combo to force trades with a planned exit."],
    dangerAbilities: ["E Soul Unbound knockup/stun"],
    commonWeaknesses: [
      "When E is used the enemy knows where Yone will be when E is over.",
      "Needs Q setup for knockup threat.",
      "Vulnerable before he can reliably enter and exit trades.",
    ],
    damageType: "mixed",
    hardCrowdControl: ["Q3 knockup", "R Fate Sealed knockup/displacement"],
    id: "Yone",
    importantAbilityNotes: [
      "E is his main trade extension and snapback tool.",
      "Q third cast creates knockup threat.",
      "A well timed R can instantly turn a fight in his favour.",
    ],
    laneIdentity:
      "Scaling melee carry who uses E + Q combo to force trades with a planned exit.",
    majorPowerSpikes: [
      "Level 3 access to all basic abilities.",
      "First back for more attack speed.",
      "Bork is a great item for him.",
    ],
    mobilityLevel: "high",
    name: "Yone",
    offMetaRoles: [],
    primaryRoles: ["mid"],
    secondaryRoles: ["top"],
    primaryTradingPattern:
      "Stack Q, use E and second Q to gap close, snap back with E to avoid punishment.",
    shields: ["W Spirit Cleave shield"],
    softCrowdControl: ["Q after gaining 2 stacks of Gathering Storm, makes enemies airborne, R blinking behind the last enemy hit and knocking everyone airborne towards him."],
    stealthOrInvisibility: null,
    sustain: [],
    punishWindows: [
  "If E is used from a bad position.",
  "If Yone misses key abilities like Q knockup or R displacement."
]
  },
  Zoe: {
    archetype: ["poke mage", "pick", "burst"],
    primaryWinCondition: ["Can find very good angles for E and have incredible range with R + Q."],
    commonWeaknesses: [
      "Vulnerable if E miss or is on cooldown.",
      "Skillshot reliant and punishable after missed bubble.",
      "Easily punished by targeted CC.",
    ],
    damageType: "magic",
    hardCrowdControl: ["E"],
    id: "Zoe",
    importantAbilityNotes: [
      "E is her key pick and damage amp setup.",
      "R is her key dodge ability skill, she also use it to extend the range of her Q.",
      "W can provide Zoe with great summoner abilities and items effects.",
    ],
    laneIdentity:
      "Pick-focused poke mage who threatens long-range burst after bubble connects.",
    majorPowerSpikes: [
      "Level 3 full basic ability access.",
      "Level 6 Portal Jump for extended poke angles.",
      "First completed AP burst item.",
    ],
    mobilityLevel: "medium",
    name: "Zoe",
    offMetaRoles: [],
    primaryRoles: ["mid"],
    secondaryRoles: [],
    primaryTradingPattern:
      "Fish for E, then use Q and R for burst.",
    shields: [],
    softCrowdControl: ["E applies sleep after a short delay, and the next damaging hit wakes the target up."],
    stealthOrInvisibility: null,
    sustain: [],
    dangerAbilities: ["E Paddle Star"],
    punishWindows: [
  "After E is missed.",
  "If R is used at bad timings."
]
  },
  Zed: {
    archetype: ["skirmisher", "assassin", "melee carry"],
    primaryWinCondition: ["Take down enemy carries with his high burst and mobility."],
    dangerAbilities: ["W + E + Q combo, R Death Mark"],
    commonWeaknesses: [
      "Very weak from level 1-3, can be bullied by strong early laners.",
      "Falls off if he can't get on carries in fights.",
      "Hard to damage more then one target in fights due to his single-target focus.",
    ],
    damageType: "physical",
    hardCrowdControl: [],
    id: "Zed",
    importantAbilityNotes: [
      "Dodging Q is key to trading with Zed.",
      "R is his main all-in tool, it can be used to dodge key abilities or finish off targets.",
      "W + E is almost impossible to dodge, stay focused on dodging Q",
    ],
    laneIdentity:
      "Pick-focused AD assassin who looks to burst carries and dodge key abilities.",
    majorPowerSpikes: [
      "After level 3 he has access to his full combo.",
      "Level 6 Death Mark.",
      "First completed lethality item.",
    ],
    mobilityLevel: "high",
    name: "Zed",
    offMetaRoles: [],
    primaryRoles: ["mid"],
    secondaryRoles: ["jungle"],
    primaryTradingPattern:
      "W + E for guaranteed damage, use Q to poke and finish, then R for all-in.",
    shields: [],
    softCrowdControl: ["E Living Shadow slow"],
    stealthOrInvisibility: null,
    sustain: [""],
    punishWindows: [
      "Before level 3, Zed is very vulnerable to pressure and can be bullied out of lane.",
      "If Zed uses W to engage and misses combo, he can be punished hard.",
]
  },
} satisfies Record<string, LeagueChampionKnowledgeProfile>;

export function getLeagueChampionKnowledgeProfile(championId: string) {
  const profiles: Record<string, LeagueChampionKnowledgeProfile> =
    leagueChampionKnowledgeProfiles;

  return profiles[championId] ?? null;
}


/* COMBAT STATS MAL:
  Champion: {
    archetype: ["mobile mage", "pick", "roam"],
    primaryWinCondition: [""],
    dangerAbilities: [""],
    commonWeaknesses: [

    ],
    damageType: "",
    hardCrowdControl: [""],
    id: "",
    importantAbilityNotes: [
  
    ],
    laneIdentity:
      "",
    majorPowerSpikes: [

    ],
    mobilityLevel: "",
    name: "",
    offMetaRoles: [],
    primaryRoles: ["mid"],
    secondaryRoles: [],
    primaryTradingPattern:
      "",
    shields: [],
    softCrowdControl: [],
    stealthOrInvisibility: null,
    sustain: [""],
    punishWindows: [

]
  }, */