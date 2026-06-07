import type { LeagueChampionKnowledgeProfile } from "./types";

export const missFortuneCombatProfile = {
  profileQuality: "reviewed",
  masteryDifficulty: "low",
  abilities: {
    Q: "Double Up",
    W: "Strut",
    E: "Make It Rain",
    R: "Bullet Time",
  },
  archetype: ["marksman", "lane poke", "teamfight ultimate", "burst"],
  primaryWinCondition: [
    "Manage minion waves to set up (Q) poke and follow up on support CC with (E) and (R).",
  ],
  dangerAbilities: ["(Q) bounce poke", "(E) slow", "(R) teamfight channel"],
  dangerProfile: {
    dangerousWhen: [
      "(Q) bounce angles punish ADCs standing behind low minions.",
      "Her support can lock targets inside (R).",
      "She controls dragon or choke fights where enemies must walk through (R).",
    ],
    mustRespect: [
      "Her lane poke can create recall and wave advantages quickly.",
      "(R) is strongest with allied CC or narrow terrain.",
      "Her burst is front-loaded compared with many DPS carries.",
    ],
  },
  commonWeaknesses: [
    "No dash against hard engage.",
    "(R) can be interrupted or sidestepped without setup.",
    "Less reliable in messy fights where she cannot channel.",
  ],
  damageType: "physical",
  hardCrowdControl: [],
  id: "MissFortune",
  importantAbilityNotes: [
    "(Q) bounce is the core lane punish; low-health minions and enemy positioning behind the wave decide its value.",
    "(W) movement speed lets her take short poke windows, but damage removes the passive speed and makes engage more dangerous.",
    "(E) slows enemies for safer (Q) angles, support follow-up, or (R) channel setup.",
    "(R) needs CC, terrain, or committed enemies; raw channels are much easier to dodge or interrupt.",
  ],
  lanePlan: {
    avoids: [
      "Standing in engage range without support peel.",
      "Using (R) without CC, choke control, or enemy commitment.",
      "Letting minion waves remove (Q) bounce threat.",
      "Standing still for (R) while enemy interrupt or engage cooldowns are unspent.",
    ],
    idealLaneState:
      "A pressured bot lane where Miss Fortune uses (Q) bounce and support setup to force health leads before dragon fights.",
    wants: [
      "Support can lock targets inside (R).",
      "Wave states with clean (Q) bounce angles.",
      "Dragon fights where enemy movement is restricted.",
      "Low-health caster or melee minions that threaten bounce damage onto the enemy ADC.",
      "Support positioned to punish enemies slowed by (E) or chunked by (Q).",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    lanePressure: "high",
    preferredGameState: [
      "Lane poke that forces recalls.",
      "Grouped fights around chokepoints.",
      "Objective setups where (R) has support CC.",
    ],
    scalingPriority: "medium",
    winLaneBy: [
      "Landing (Q) bounce poke.",
      "Using wave pressure to control dragon setup.",
      "Pairing (R) with allied CC.",
      "Punishing enemy ADCs who stand behind low-health minions for last hits.",
      "Using (E) to make bounce, support CC, or (R) follow-up harder to dodge.",
    ],
  },
  majorPowerSpikes: ["Level 6 (R).", "First completed damage item.", "Objective choke setup."],
  matchupPreferences: {
    strongInto: [
      "Immobile ADCs vulnerable to poke.",
      "Supports that add reliable CC for (R).",
      "Teams that must fight through narrow objective entrances.",
    ],
    weakInto: [
      "Hard engage that interrupts her channel.",
      "Mobile ADCs that dodge (R).",
      "Long fights where sustained DPS outpaces her burst.",
    ],
  },
  mobilityLevel: "low",
  name: "Miss Fortune",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "(R) creates major grouped fight threat",
        changesGameplay:
          "Miss Fortune can turn support CC or dragon choke control into a fight-winning channel.",
        playerAction: "Hold (R) for CC, terrain, or committed enemies instead of forcing it raw.",
        enemyResponse: "Save interrupts or spread before fighting in narrow spaces.",
      },
      {
        timing: "First completed damage item",
        reason: "Lane poke and ultimate burst become harder to ignore",
        changesGameplay:
          "Her health leads convert more easily into recalls, plates, or dragon control.",
        playerAction: "Use (Q) bounce pressure to force the enemy ADC off CS before objectives.",
        enemyResponse:
          "Avoid standing behind low minions and force fights when (R) is unavailable.",
      },
    ],
  },
  primaryRoles: ["adc"],
  secondaryRoles: [],
  primaryTradingPattern:
    "Look for (Q) bounce poke through minions, preserve spacing against engage, and save (R) for support CC or objective chokepoints.",
  punishProfile: {
    canPunish: [
      "ADCs standing behind low minions.",
      "Grouped enemies locked by support CC.",
      "Objective fights through narrow entrances.",
      "Enemy ADCs trying to last-hit through a low-health minion line.",
      "Bot lanes that use mobility or cleanse before her support locks (R) targets.",
    ],
    strugglesToPunish: [
      "Mobile ADCs that sidestep her channel.",
      "Engage that cancels (R) before damage lands.",
    ],
  },
  shields: [],
  softCrowdControl: ["(E) slow"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "control",
    preferredGameLength: "medium",
    scalingProfile: "mid",
    winMethod: ["lane poke", "dragon setup", "teamfight ultimate"],
  },
  supportSynergy: {
    excellentWith: ["Leona", "Nautilus", "Nami"],
    goodWith: ["Morgana", "Seraphine", "Rell"],
    strugglesWith: ["Yuumi", "Janna", "low-lockdown supports"],
    notes: [
      "Leona, Nautilus, and Nami hold enemies inside Miss Fortune (R).",
      "Morgana binding and Seraphine CC create safe channels for Bullet Time.",
      "Rell gives Miss Fortune strong grouped-fight lockdown around dragon and turret dives.",
      "Supports with little lockdown can make Miss Fortune rely too much on raw lane poke.",
    ],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "The enemy can engage while (R) would be interrupted.",
      "No minion angle exists for (Q) bounce pressure.",
      "The fight spreads out before her channel lands.",
    ],
    goodTradeConditions: [
      "Low minions create (Q) bounce angles.",
      "Support CC can hold enemies inside (R).",
      "Dragon or turret terrain limits enemy movement.",
      "Use (E) slow to keep enemies in (R) or prevent disengage.",
      "Use (E) slow to create safer (Q) bounce angles or punish enemy movement.",
      "Enemy ADC is positioned behind a low-health minion and cannot answer the bounce without losing CS.",
    ],
    primaryPattern:
      "Win lane through bounce poke and wave pressure, then convert CC setup into decisive (R) damage.",
  },
  punishWindows: [
    "After (R), her teamfight threat drops sharply.",
    "No dash makes direct engage effective if support cannot peel.",
    "If she cannot find (Q) bounce angles, her lane pressure is easier to absorb.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
