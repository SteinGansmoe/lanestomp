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
  primaryRoles: LeagueRole[];
  primaryTradingPattern: string;
  shields: string[];
  softCrowdControl: string[];
  stealthOrInvisibility: string | null;
  sustain: string[];
};

export const leagueChampionKnowledgeProfiles = {
  Ahri: {
    archetype: ["mobile mage", "pick", "roam"],
    commonWeaknesses: [
      "Needs Charm threat for reliable kill pressure.",
      "Can be punished when Spirit Rush or Charm is unavailable.",
      "Waveclear is weaker before enough AP and mana access.",
    ],
    damageType: "magic",
    hardCrowdControl: ["E Charm"],
    id: "Ahri",
    importantAbilityNotes: [
      "Charm is her key punish and peel tool.",
      "Spirit Rush gives repeated dashes at level 6.",
      "Orb of Deception return damage rewards clean spacing.",
    ],
    laneIdentity:
      "Safe mid mage who looks for Charm picks, short trades, and roam windows after wave control.",
    majorPowerSpikes: [
      "Level 3 full basic ability access.",
      "Level 6 Spirit Rush.",
      "First completed mage item.",
    ],
    mobilityLevel: "high",
    name: "Ahri",
    primaryRoles: ["mid"],
    primaryTradingPattern:
      "Poke with Orb of Deception and threaten Charm when the enemy commits or loses cover.",
    shields: [],
    softCrowdControl: [],
    stealthOrInvisibility: null,
    sustain: ["Passive healing from minion or champion takedown stacks."],
  },
  Akali: {
    archetype: ["assassin", "skirmisher"],
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
      "Melee AP assassin who gives ground early, then uses Shroud and mobility to force extended trades.",
    majorPowerSpikes: [
      "Level 3 full basic ability access.",
      "Level 6 Perfect Execution.",
      "First completed AP assassin item.",
    ],
    mobilityLevel: "very_high",
    name: "Akali",
    primaryRoles: ["mid", "top"],
    primaryTradingPattern:
      "Look for Q poke into passive autos, then commit harder with Shroud or E when the opponent is exposed.",
    shields: [],
    softCrowdControl: [],
    stealthOrInvisibility: "W Twilight Shroud obscures Akali and enables trades.",
    sustain: [],
  },
  Akshan: {
    archetype: ["marksman", "roam", "lane bully"],
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
    primaryRoles: ["mid"],
    primaryTradingPattern:
      "Use autos and Avengerang for short ranged pressure, then reposition with Heroic Swing.",
    shields: [],
    softCrowdControl: [],
    stealthOrInvisibility: "W Going Rogue grants camouflage outside direct combat.",
    sustain: [],
  },
  Diana: {
    archetype: ["assassin", "diver", "skirmisher"],
    commonWeaknesses: [
      "Can be punished before she lands Crescent Strike.",
      "Commits forward to trade or all-in.",
      "Vulnerable when Pale Cascade and dash access are down.",
    ],
    damageType: "magic",
    hardCrowdControl: ["R Moonfall"],
    id: "Diana",
    importantAbilityNotes: [
      "Lunar Rush resets when used on a Moonlight-marked target.",
      "Moonfall is her level 6 teamfight and all-in threat.",
      "Pale Cascade gives a shield, not sustain.",
    ],
    laneIdentity:
      "AP diver who farms into level 6 threat and punishes enemies marked by Crescent Strike.",
    majorPowerSpikes: [
      "Level 3 full basic ability access.",
      "Level 6 Moonfall.",
      "First completed AP skirmish item.",
    ],
    mobilityLevel: "high",
    name: "Diana",
    primaryRoles: ["mid", "jungle"],
    primaryTradingPattern:
      "Land Crescent Strike, dash with Lunar Rush, absorb return damage with Pale Cascade, then decide whether to extend.",
    shields: ["W Pale Cascade"],
    softCrowdControl: [],
    stealthOrInvisibility: null,
    sustain: [],
  },
  Ekko: {
    archetype: ["assassin", "skirmisher", "scaling"],
    commonWeaknesses: [
      "Needs setup time for Parallel Convergence.",
      "Can be pressured before level 6.",
      "Vulnerable when Phase Dive or Chronobreak is unavailable.",
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
    primaryRoles: ["mid", "jungle"],
    primaryTradingPattern:
      "Use Timewinder and Phase Dive for quick burst, then disengage before the enemy can extend.",
    shields: ["W Parallel Convergence shield if Ekko enters the zone"],
    softCrowdControl: ["Q Timewinder slow"],
    stealthOrInvisibility: null,
    sustain: ["R Chronobreak heal on cast."],
  },
  Fizz: {
    archetype: ["assassin", "melee burst"],
    commonWeaknesses: [
      "Can be punished when Playful / Trickster is down.",
      "Struggles into controlled wave states before level 6.",
      "Must commit into range to deal damage.",
    ],
    damageType: "magic",
    hardCrowdControl: ["R Chum the Waters knockup"],
    id: "Fizz",
    importantAbilityNotes: [
      "Playful / Trickster is his main dodge, engage, and escape tool.",
      "Chum the Waters creates his level 6 kill threat.",
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
    primaryRoles: ["mid"],
    primaryTradingPattern:
      "Dash in for burst, use Playful / Trickster to dodge the key answer, then exit or finish.",
    shields: [],
    softCrowdControl: ["E Playful / Trickster slow"],
    stealthOrInvisibility: null,
    sustain: [],
  },
  Hwei: {
    archetype: ["artillery mage", "control mage"],
    commonWeaknesses: [
      "Immobile and vulnerable when crowd control is down.",
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
    primaryRoles: ["mid"],
    primaryTradingPattern:
      "Control space with long-range spells and hold defensive E choices for enemy engage timing.",
    shields: ["W spellbook can provide shielding depending on spell choice"],
    softCrowdControl: ["Several E and R effects can slow or disrupt"],
    stealthOrInvisibility: null,
    sustain: [],
  },
  Leblanc: {
    archetype: ["assassin", "poke", "mobility"],
    commonWeaknesses: [
      "Waveclear and threat suffer when Distortion is down.",
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
    primaryRoles: ["mid"],
    primaryTradingPattern:
      "Use Distortion for burst and repositioning, then threaten Chains if the opponent cannot answer.",
    shields: [],
    softCrowdControl: [],
    stealthOrInvisibility: "Passive Mirror Image briefly makes her harder to identify at low health.",
    sustain: [],
  },
  Lux: {
    archetype: ["artillery mage", "pick", "poke"],
    commonWeaknesses: [
      "Immobile and punishable when Light Binding is down.",
      "Skillshot reliant.",
      "Can be all-inned if she loses range control.",
    ],
    damageType: "magic",
    hardCrowdControl: ["Q Light Binding root"],
    id: "Lux",
    importantAbilityNotes: [
      "Light Binding is her key defensive and pick tool.",
      "Prismatic Barrier shields allies and herself.",
      "Final Spark creates level 6 burst and waveclear threat.",
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
    primaryRoles: ["mid", "support"],
    primaryTradingPattern:
      "Poke with Lucent Singularity and punish oversteps with Light Binding into burst.",
    shields: ["W Prismatic Barrier"],
    softCrowdControl: ["E Lucent Singularity slow"],
    stealthOrInvisibility: null,
    sustain: [],
  },
  Malzahar: {
    archetype: ["control mage", "anti-carry", "push"],
    commonWeaknesses: [
      "Weak if his passive shield is broken before trades.",
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
    primaryRoles: ["mid"],
    primaryTradingPattern:
      "Push with Malefic Visions and Voidlings, then threaten silence or ultimate when the enemy steps forward.",
    shields: ["Passive Void Shift spell shield"],
    softCrowdControl: [],
    stealthOrInvisibility: null,
    sustain: [],
  },
  Orianna: {
    archetype: ["control mage", "teamfight", "scaling"],
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
    primaryRoles: ["mid"],
    primaryTradingPattern:
      "Use ball placement to zone and poke, then shield or speed herself through return trades.",
    shields: ["E Command: Protect"],
    softCrowdControl: ["W Command: Dissonance slow/speed zone"],
    stealthOrInvisibility: null,
    sustain: [],
  },
  Sylas: {
    archetype: ["skirmisher", "bruiser mage", "assassin"],
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
    primaryRoles: ["mid"],
    primaryTradingPattern:
      "Use E to enter or threaten, trade with passive autos and Kingslayer, then disengage if cooldowns are down.",
    shields: [],
    softCrowdControl: ["Q Chain Lash slow"],
    stealthOrInvisibility: null,
    sustain: ["W Kingslayer heal"],
  },
  Syndra: {
    archetype: ["burst mage", "control mage"],
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
    primaryRoles: ["mid"],
    primaryTradingPattern:
      "Poke with Dark Sphere, hold Scatter the Weak to punish commits, and burst when stun lands.",
    shields: [],
    softCrowdControl: ["W Force of Will slow"],
    stealthOrInvisibility: null,
    sustain: [],
  },
  Talon: {
    archetype: ["assassin", "roam", "burst"],
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
    primaryRoles: ["mid"],
    primaryTradingPattern:
      "Land Rake, threaten Q follow-up and passive bleed, then use roam pressure when the wave allows.",
    shields: [],
    softCrowdControl: ["W Rake slow on return"],
    stealthOrInvisibility: "R Shadow Assault grants stealth during the burst window.",
    sustain: ["Q Noxian Diplomacy heals on unit kill."],
  },
  Veigar: {
    archetype: ["scaling mage", "control", "burst"],
    commonWeaknesses: [
      "Immobile and vulnerable when Event Horizon is down.",
      "Weak early if denied farm and stacks.",
      "Skillshot and cage placement dependent.",
    ],
    damageType: "magic",
    hardCrowdControl: ["E Event Horizon stun"],
    id: "Veigar",
    importantAbilityNotes: [
      "Event Horizon is his key defensive and pick tool.",
      "Phenomenal Evil stacks are his scaling engine.",
      "Primordial Burst is level 6 execute-style burst.",
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
    primaryRoles: ["mid"],
    primaryTradingPattern:
      "Farm stacks safely, punish movement with Event Horizon, then burst trapped targets.",
    shields: [],
    softCrowdControl: [],
    stealthOrInvisibility: null,
    sustain: [],
  },
  Vex: {
    archetype: ["anti-dash mage", "burst", "control"],
    commonWeaknesses: [
      "Immobile outside ultimate reset windows.",
      "Fear timing can be baited or forced out.",
      "Can be outranged by artillery mages.",
    ],
    damageType: "magic",
    hardCrowdControl: ["Passive Doom fear"],
    id: "Vex",
    importantAbilityNotes: [
      "Her fear comes from passive Doom, not every spell by default.",
      "Shadow Surge is her level 6 engage/reset tool.",
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
    primaryRoles: ["mid"],
    primaryTradingPattern:
      "Hold fear threat for enemy dash or commit, then burst with passive-enhanced spell windows.",
    shields: ["W Personal Space shield"],
    softCrowdControl: ["E Looming Darkness slow"],
    stealthOrInvisibility: null,
    sustain: [],
  },
  Viktor: {
    archetype: ["control mage", "scaling", "zone control"],
    commonWeaknesses: [
      "Immobile and vulnerable to hard engage.",
      "Needs upgrades and items to fully control fights.",
      "Can be punished when Gravity Field is down.",
    ],
    damageType: "magic",
    hardCrowdControl: ["W Gravity Field stun after delay"],
    id: "Viktor",
    importantAbilityNotes: [
      "Gravity Field is delayed zone control, not instant CC.",
      "Siphon Power gives a shield.",
      "Chaos Storm is level 6 sustained zone damage.",
    ],
    laneIdentity:
      "Scaling control mage who farms, pokes with laser, and controls choke points.",
    majorPowerSpikes: [
      "Level 3 full basic ability access.",
      "Level 6 Chaos Storm.",
      "First completed mage item and evolution progress.",
    ],
    mobilityLevel: "none",
    name: "Viktor",
    primaryRoles: ["mid"],
    primaryTradingPattern:
      "Trade with Death Ray and Siphon Power shield while keeping Gravity Field for disengage.",
    shields: ["Q Siphon Power"],
    softCrowdControl: ["W Gravity Field slow before stun"],
    stealthOrInvisibility: null,
    sustain: [],
  },
  Xerath: {
    archetype: ["artillery mage", "poke", "siege"],
    commonWeaknesses: [
      "Immobile and vulnerable to flank or all-in pressure.",
      "Skillshot reliant.",
      "Struggles when enemies dodge poke and force close fights.",
    ],
    damageType: "magic",
    hardCrowdControl: ["E Shocking Orb stun"],
    id: "Xerath",
    importantAbilityNotes: [
      "Shocking Orb is his key self-peel tool.",
      "Rite of the Arcane gives long-range level 6 follow-up.",
      "He has no dash or stealth.",
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
    primaryRoles: ["mid", "support"],
    primaryTradingPattern:
      "Charge long-range poke, use Eye of Destruction for slow setup, and hold Shocking Orb for engage.",
    shields: [],
    softCrowdControl: ["W Eye of Destruction slow"],
    stealthOrInvisibility: null,
    sustain: [],
  },
  Yasuo: {
    archetype: ["skirmisher", "melee carry", "mobility"],
    commonWeaknesses: [
      "Needs minion waves or targets for mobility.",
      "Vulnerable when Wind Wall and passive shield are down.",
      "Can be punished by controlled wave states and point-and-click CC.",
    ],
    damageType: "physical",
    hardCrowdControl: ["Q tornado knockup", "R Last Breath follow-up on airborne targets"],
    id: "Yasuo",
    importantAbilityNotes: [
      "Sweeping Blade requires targets and cannot freely dash without them.",
      "Wind Wall blocks many projectiles but not all abilities.",
      "Last Breath requires an airborne target.",
    ],
    laneIdentity:
      "Melee AD skirmisher who uses waves for mobility, short trades, and all-ins off knockups.",
    majorPowerSpikes: [
      "Level 2 access to Q plus E mobility.",
      "Level 6 Last Breath if knockup access exists.",
      "First completed crit item.",
    ],
    mobilityLevel: "very_high",
    name: "Yasuo",
    primaryRoles: ["mid", "top"],
    primaryTradingPattern:
      "Stack Q, dash through wave targets, use Wind Wall against key projectiles, and commit on knockup threat.",
    shields: ["Passive Way of the Wanderer flow shield"],
    softCrowdControl: [],
    stealthOrInvisibility: null,
    sustain: [],
  },
  Yone: {
    archetype: ["skirmisher", "assassin", "melee carry"],
    commonWeaknesses: [
      "Can be punished when Soul Unbound is down or badly timed.",
      "Needs Q setup for knockup threat.",
      "Vulnerable before he can reliably enter and exit trades.",
    ],
    damageType: "mixed",
    hardCrowdControl: ["Q3 knockup", "R Fate Sealed knockup/displacement"],
    id: "Yone",
    importantAbilityNotes: [
      "Soul Unbound is his main trade extension and snapback tool.",
      "Mortal Steel third cast creates knockup threat.",
      "Fate Sealed is level 6 engage and follow-up threat.",
    ],
    laneIdentity:
      "Scaling melee carry who uses Q setup and Soul Unbound to force trades with a planned exit.",
    majorPowerSpikes: [
      "Level 2 access to Q plus E or W trading.",
      "Level 6 Fate Sealed.",
      "First completed crit item.",
    ],
    mobilityLevel: "high",
    name: "Yone",
    primaryRoles: ["mid", "top"],
    primaryTradingPattern:
      "Stack Q, use Soul Unbound to extend a trade, then snap back before the return punish lands.",
    shields: ["W Spirit Cleave shield"],
    softCrowdControl: ["Q after gaining 2 stacks of Gathering Storm, makes enemies airborne, R blinking behind the last enemy hit and knocking everyone airborne towards him."],
    stealthOrInvisibility: null,
    sustain: [],
  },
  Zoe: {
    archetype: ["poke mage", "pick", "burst"],
    commonWeaknesses: [
      "Vulnerable when Sleepy Trouble Bubble is down.",
      "Skillshot reliant and punishable after missed bubble.",
      "Portal Jump returns her to a predictable position.",
    ],
    damageType: "magic",
    hardCrowdControl: ["E Sleepy Trouble Bubble sleep"],
    id: "Zoe",
    importantAbilityNotes: [
      "Sleepy Trouble Bubble is her key pick and damage amp setup.",
      "Portal Jump is temporary repositioning, not a full escape.",
      "Spell Thief can create volatile summoner or item windows.",
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
    primaryRoles: ["mid"],
    primaryTradingPattern:
      "Fish for Sleepy Trouble Bubble, then use Paddle Star angles and Portal Jump for burst.",
    shields: [],
    softCrowdControl: ["E drowsy before sleep"],
    stealthOrInvisibility: null,
    sustain: [],
  },
} satisfies Record<string, LeagueChampionKnowledgeProfile>;

export function getLeagueChampionKnowledgeProfile(championId: string) {
  const profiles: Record<string, LeagueChampionKnowledgeProfile> =
    leagueChampionKnowledgeProfiles;

  return profiles[championId] ?? null;
}
