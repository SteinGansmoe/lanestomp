import type { LeagueChampionKnowledgeProfile } from "./types";

export const naafiriCombatProfile = {
  profileQuality: "draft",
  abilities: {
    Q: "Darkin Daggers",
    W: "Hounds' Pursuit",
    E: "Eviscerate",
    R: "The Call of the Pack",
  },
  archetype: ["assassin", "poke", "all-in", "pack"],
  primaryWinCondition: [
    "Chip targets with (Q), then use pack-enhanced all-ins to punish isolated or low-health enemies.",
  ],
  dangerAbilities: ["(W) targeted dash", "(Q) bleed", "(R) engage steroid"],
  dangerProfile: {
    dangerousWhen: [
      "The target is low from (Q) poke or bleed.",
      "(W) can connect without being blocked or interrupted.",
      "(R) is active and her pack makes the all-in harder to answer.",
    ],
    mustRespect: [
      "(W) is a committed targeted engage that can be body-blocked or interrupted.",
      "(Q) poke and second hit matter before she all-ins.",
      "(R) increases her chase and burst window.",
    ],
  },
  commonWeaknesses: [
    "Predictable engage path with (W).",
    "Can be punished if (W) is blocked or she commits into crowd control.",
    "Needs poke or isolation before all-ins are reliable.",
  ],
  damageType: "physical",
  hardCrowdControl: [],
  id: "Naafiri",
  importantAbilityNotes: [
    "(Q) applies bleed and rewards landing follow-up daggers.",
    "(W) is a targeted dash and primary commit tool.",
    "(E) gives repositioning and pack recall.",
    "(R) empowers chase and all-in pressure.",
  ],
  lanePlan: {
    avoids: [
      "Using (W) into crowd control or multiple blockers.",
      "All-inning before (Q) poke has lowered the target.",
      "Fighting when the wave makes her engage path predictable and unsafe.",
    ],
    idealLaneState:
      "A lane where Naafiri can land (Q) poke, keep the wave from trapping her, and threaten (W) all-ins when enemy answers are down.",
    wants: [
      "(Q) poke before committing.",
      "Enemy mobility or crowd control spent before (W).",
      "Isolated or low-health targets for (R)-enhanced chase.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Short poke trades before committed all-ins.",
      "Skirmishes where targets are already low.",
      "Lanes where enemy peel cooldowns can be tracked clearly.",
    ],
    scalingPriority: "medium",
    winLaneBy: [
      "Landing (Q) poke often enough to create lethal threat.",
      "Choosing (W) commits after enemy control is down.",
      "Snowballing picks through (R) chase windows.",
    ],
  },
  majorPowerSpikes: ["Level 6 (R).", "First completed lethality item."],
  matchupPreferences: {
    strongInto: [
      "Immobile squishy champions who can be chipped by (Q).",
      "Targets without reliable crowd control for her (W) commit.",
      "Skirmishes with isolated low-health enemies.",
    ],
    weakInto: [
      "Champions who can interrupt or punish (W).",
      "Strong waveclear that keeps her from finding angles.",
      "Durable champions who survive her first commit.",
    ],
  },
  mobilityLevel: "high",
  name: "Naafiri",
  offMetaRoles: [],
  strategicIdentity: {
    laneGoal: "snowball",
    scalingProfile: "mid",
    preferredGameLength: "medium",
    winMethod: ["target access", "roam pressure", "burst all-ins"],
  },
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "Level 6 (R)",
        changesGameplay: "Level 6 increases her chase and all-in reliability",
        playerAction:
          "Track (R) availability and use the window for verified all-ins, picks, roams, or defensive resets rather than forcing blind.",
        enemyResponse:
          "Respect (R) window, hold key defensive tools for the commit, and punish after (R) is spent.",
      },
      {
        timing: "First completed lethality item",
        reason: "First completed lethality item",
        changesGameplay: "Lethality spikes make (Q) poke and committed burst more threatening",
        playerAction:
          "After the item, pressure waves and trades more confidently while still tracking the enemy's main answer.",
        enemyResponse:
          "Do not treat pre-item trades as still safe once Naafiri's first item threshold is completed.",
      },
    ],
  },
  primaryRoles: ["mid"],
  secondaryRoles: [],
  primaryTradingPattern:
    "Poke with (Q) first, then use (W) only when the target is low or their interrupt tools are unavailable.",
  punishProfile: {
    canPunish: [
      "Squishy targets after (Q) poke.",
      "Enemies who spend mobility or crowd control early.",
      "Isolated targets during (R) windows.",
    ],
    strugglesToPunish: [
      "Champions who can interrupt or body-block (W).",
      "Durable mids that survive the initial burst.",
    ],
  },
  shields: ["(R) shield on champion combat trigger"],
  softCrowdControl: [],
  stealthOrInvisibility: null,
  sustain: [],
  trading: {
    badTradeConditions: [
      "(W) can be interrupted or blocked.",
      "The target is too healthy for her burst.",
      "(Q) has missed and no bleed pressure exists.",
    ],
    goodTradeConditions: [
      "(Q) poke has already landed.",
      "Enemy crowd control or mobility is down.",
      "(R) is active and the target is isolated.",
    ],
    primaryPattern:
      "Use (Q) to create health advantage, wait out defensive answers, then commit (W) and (E) during a clean all-in window.",
  },
  punishWindows: [
    "If Naafiri commits (W) into crowd control, she is easy to punish.",
    "If (Q) misses, her all-in threat is easier to absorb.",
    "Waveclear can force her to choose between farm and roam pressure.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
