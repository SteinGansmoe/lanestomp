import type { LeagueChampionKnowledgeProfile } from "./types";

export const jhinCombatProfile = {
  profileQuality: "reviewed",
  masteryDifficulty: "medium",
  abilities: {
    Q: "Dancing Grenade",
    W: "Deadly Flourish",
    E: "Captive Audience",
    R: "Curtain Call",
  },
  archetype: ["marksman", "pick setup", "lane control", "burst"],
  primaryWinCondition: [
    "Use fourth-shot threat, support CC follow-up, and controlled wave pressure to create lane health leads before converting picks around objectives.",
  ],
  dangerAbilities: ["Fourth shot", "(W) root follow-up", "(R) long-range execute"],
  dangerProfile: {
    dangerousWhen: [
      "Fourth shot is ready and the enemy ADC must walk up for a last hit.",
      "An allied support or trap has marked the target for (W) root follow-up.",
      "The wave is thin enough that (Q) can bounce through low-health minions onto the enemy ADC.",
      "Level 6 creates long-range execute pressure after bot lane trades or river skirmishes.",
    ],
    mustRespect: [
      "Fourth shot changes CS contests because Jhin can trade one empowered auto for a large health swing.",
      "(W) can convert allied poke, traps, or support CC into a root from outside normal ADC trade range.",
      "(R) punishes low-health recalls, dragon retreats, and enemies forced to path predictably.",
    ],
  },
  commonWeaknesses: [
    "Reload windows reduce his ability to answer sustained all-ins.",
    "Fixed attack cadence makes pure DPS races difficult into hypercarries.",
    "No dash means direct engage is dangerous if his support cannot peel.",
  ],
  damageType: "physical",
  hardCrowdControl: ["(W) root"],
  id: "Jhin",
  importantAbilityNotes: [
    "Fourth shot is the main last-hit punish and short-trade threat.",
    "(Q) can punish enemies standing near low-health minions because bounce damage increases after kills.",
    "(W) roots targets already damaged by Jhin, allies, or traps.",
    "(E) traps make brush, river, and retreat paths harder to walk through.",
    "(R) is strongest after enemies are already slowed, rooted, low, or forced through a choke.",
  ],
  lanePlan: {
    avoids: [
      "Taking extended auto-for-auto fights during reload windows.",
      "Letting high-DPS ADCs force long trades after fourth shot is spent.",
      "Using (W) blindly when support CC or prior damage has not marked a real target.",
      "Pushing without trap or support coverage against hard engage.",
    ],
    idealLaneState:
      "A controlled bot lane where Jhin keeps the wave thin, threatens fourth-shot CS punishment, and uses support setup or traps to make (W) roots reliable.",
    wants: [
      "Fourth shot available when the enemy ADC commits to cannon or melee last hits.",
      "Low-health minions that let (Q) bounce onto the enemy champion.",
      "Support CC, trap damage, or poke that marks targets for (W).",
      "Slow objective setups where (R) can punish retreat paths.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    lanePressure: "high",
    preferredGameState: [
      "Short burst trades where fourth shot ends the exchange.",
      "Wave states with low minions for (Q) bounce pressure.",
      "Support-led pick lanes where (W) follow-up roots convert poke into kills.",
      "Objective approaches where traps and (R) punish predictable movement.",
    ],
    scalingPriority: "medium",
    winLaneBy: [
      "Punishing CS attempts with fourth shot instead of taking long DPS races.",
      "Using (Q) bounce angles through low-health minions to create health leads.",
      "Holding (W) for marked targets after support CC, trap damage, or allied poke.",
      "Converting lane health leads into dragon control with traps and (R).",
    ],
  },
  majorPowerSpikes: [
    "Fourth-shot lane windows.",
    "Level 6 (R) execute and zone control.",
    "First completed damage item for stronger fourth-shot threat.",
  ],
  matchupPreferences: {
    strongInto: [
      "Immobile ADCs that must respect fourth shot when farming.",
      "Support lanes with reliable CC to mark targets for (W).",
      "Short trades where burst and movement speed matter more than sustained DPS.",
    ],
    weakInto: [
      "Hard engage that reaches him during reload or after (W) misses.",
      "Hypercarries that can force long front-to-back DPS fights.",
      "Long-range poke lanes that deny his fourth-shot spacing.",
    ],
  },
  mobilityLevel: "low",
  name: "Jhin",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Fourth shot ready",
        reason: "Fourth shot creates a direct CS punish and burst-trade window",
        changesGameplay:
          "Enemy ADCs cannot contest exposed last hits the same way while Jhin holds fourth shot.",
        playerAction:
          "Hold fourth shot for cannon, melee, or forward CS attempts rather than spending it into minions by default.",
        enemyResponse: "Give up low-value CS or force the shot into the wave before stepping up.",
      },
      {
        timing: "Level 6",
        reason: "(R) adds long-range execute and objective zoning",
        changesGameplay:
          "Low-health enemies can be denied recalls, dragon exits, or safe retreat paths after trades.",
        playerAction:
          "Use (R) after support CC, trap zones, or health leads force predictable movement.",
        enemyResponse:
          "Break line of sight, spread out, and avoid retreating through narrow corridors while low.",
      },
      {
        timing: "First completed damage item",
        reason: "Fourth shot and short burst trades become much harder to absorb",
        changesGameplay:
          "One CS punish can create a recall, plate, or dragon setup instead of just a small health lead.",
        playerAction:
          "Use item timing to threaten fourth-shot last-hit punishment and support-root follow-up.",
        enemyResponse: "Avoid trading one-for-one autos into fourth shot after his first item.",
      },
    ],
    minor: [
      {
        timing: "Level 2-3",
        reason: "(Q), (W), and trap setup create early pick patterns with support help",
        changesGameplay: "Jhin can turn allied CC or poke into root follow-up before level 6.",
        playerAction: "Pair support poke or CC with (W), and use traps to limit escape paths.",
        enemyResponse:
          "Respect marked-target windows and avoid walking through trap-controlled brush.",
      },
    ],
  },
  primaryRoles: ["adc"],
  secondaryRoles: [],
  primaryTradingPattern:
    "Threaten fourth-shot CS punishment, use (Q) bounce through low-health minions, and hold (W) for marked targets instead of taking long DPS races.",
  punishProfile: {
    canPunish: [
      "Enemy ADCs stepping up for CS while fourth shot is ready.",
      "Targets standing near low-health minions that enable (Q) bounce damage.",
      "Marked targets after support CC, trap damage, or allied poke.",
      "Low-health enemies retreating through river or dragon entrances into (R).",
    ],
    strugglesToPunish: [
      "Long all-ins after fourth shot is spent.",
      "High-DPS carries protected through his pick windows.",
      "Mobile ADCs that dodge (W) and do not offer clean fourth-shot trades.",
    ],
  },
  shields: [],
  softCrowdControl: ["(E) slow", "(R) slow"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "control",
    preferredGameLength: "medium",
    scalingProfile: "mid",
    winMethod: ["fourth-shot pressure", "pick setup", "objective zoning"],
  },
  supportSynergy: {
    excellentWith: ["Zyra", "Morgana", "Lux", "Leona"],
    goodWith: ["Thresh", "Nautilus", "Karma", "Seraphine", "Braum"],
    strugglesWith: ["Yuumi", "Sona", "low-setup enchanters"],
    notes: [
      "Zyra plants and roots make Jhin (W) follow-up easy to complete.",
      "Morgana and Lux create long-range CC chains that match Jhin's pick style.",
      "Thresh and Nautilus can start fights that Jhin converts with fourth shot and (W).",
      "Supports without poke or CC make it harder for Jhin to turn lane control into kills.",
      "Supports with enough CC to set up (W) roots and gives Jhin time to shoot his fourth shot are ideal",
    ],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "Fourth shot is spent and the enemy ADC can force sustained DPS.",
      "He is reloading while the enemy support has engage pressure.",
      "(W) is used before a target is marked by poke, support CC, or trap damage.",
      "The enemy wave is too large for clean (Q) bounce angles.",
    ],
    goodTradeConditions: [
      "Fourth shot is ready as the enemy ADC walks up for CS.",
      "Low-health minions create (Q) bounce pressure onto the enemy champion.",
      "Support CC or trap damage marks a target for (W).",
      "The enemy is low enough that (R) controls their retreat path.",
    ],
    primaryPattern:
      "Win short, prepared trades through fourth shot, bounce damage, and rooted follow-up; avoid fair extended DPS checks.",
  },
  punishWindows: [
    "After fourth shot is spent, his immediate trade threat drops until the next cycle.",
    "Reload windows are punishable if the enemy can force a long all-in.",
    "If (W) misses or is used without setup, he loses a major pick tool.",
    "No dash makes him vulnerable when traps and support peel are unavailable.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
