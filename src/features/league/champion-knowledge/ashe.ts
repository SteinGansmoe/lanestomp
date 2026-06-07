import type { LeagueChampionKnowledgeProfile } from "./types";

export const asheCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "low",
  abilities: {
    Q: "Ranger's Focus",
    W: "Volley",
    E: "Hawkshot",
    R: "Enchanted Crystal Arrow",
  },
  archetype: ["marksman", "utility carry", "poke", "pick setup"],
  primaryWinCondition: [
    "Use range, slows, and (R) pick threat to control lane tempo and start fights before higher-DPS ADCs outscale her damage.",
  ],
  dangerAbilities: ["(W) poke", "(R) stun", "(Q) sustained DPS"],
  dangerProfile: {
    dangerousWhen: [
      "(R) is available and her support or team can follow.",
      "She controls space with slows before dragon or turret setups.",
      "She can kite short-range ADCs with repeated autos and (W).",
    ],
    mustRespect: [
      "Her utility can start fights from long range.",
      "Slows make retreating from bad trades difficult.",
      "(E) can protect her lane from unseen pressure.",
    ],
  },
  commonWeaknesses: [
    "No dash against direct engage.",
    "Can be out-DPSed by hypercarries later.",
    "Needs team or support follow-up to convert picks reliably.",
  ],
  damageType: "physical",
  hardCrowdControl: ["(R) stun"],
  id: "Ashe",
  importantAbilityNotes: [
    "(W) is strongest when enemy ADC movement is restricted by the wave or they must step up for CS.",
    "Passive slows turn one auto during a last-hit window into repeated follow-up autos if Ashe can keep spacing.",
    "(E) does not win trades directly, but it protects push or dragon setup by checking jungle pathing.",
    "(R) changes support-positioning rules because long-range arrow can start a fight before the enemy bot lane is ready.",
  ],
  lanePlan: {
    avoids: [
      "Standing in engage range without (R) or support peel.",
      "Taking pure DPS races against late-game carries.",
      "Using (R) when allies cannot follow the pick.",
      "Letting the enemy ADC last-hit freely when her auto slow can tag them during the animation lock.",
    ],
    idealLaneState:
      "A controlled bot lane where Ashe uses (W), autos, and support follow-up to keep enemies slowed and punish oversteps.",
    wants: [
      "Support can follow (R) or slow-based trades.",
      "Wave control that lets her poke without being all-in'd.",
      "Dragon setups where vision and (R) threaten picks.",
      "Enemy ADCs forced to last-hit melee or cannon minions inside her auto range.",
      "A support positioned beside or slightly ahead of her so slow chains become real chase windows.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    lanePressure: "medium",
    preferredGameState: [
      "Lanes where slows control spacing.",
      "Pick setups around dragon or river.",
      "Front-to-back fights where utility starts the engage.",
    ],
    scalingPriority: "medium",
    winLaneBy: [
      "Poking with (W) and autos.",
      "Using slows to deny enemy disengage.",
      "Converting (R) into support or jungle follow-up.",
      "Punishing CS lock-in windows with auto slow into a second hit or (W).",
      "Keeping the wave just outside enemy tower so slow pressure matters without overextending.",
    ],
  },
  majorPowerSpikes: ["Level 6 (R).", "First completed marksman item.", "Two-item utility DPS."],
  matchupPreferences: {
    strongInto: [
      "Short-range ADCs she can slow and kite.",
      "Immobile lanes vulnerable to (R) picks.",
      "Teams that need clean engage paths through her slows.",
    ],
    weakInto: [
      "Hard engage that reaches her before slows matter.",
      "High burst ADCs with support lockdown.",
      "Late hypercarries if fights become pure DPS races.",
    ],
  },
  mobilityLevel: "none",
  name: "Ashe",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "(R) unlocks long-range pick and engage threat",
        changesGameplay: "Ashe can punish ADCs who step up without respecting support follow-up.",
        playerAction: "Use (R) when allies can convert the stun into damage or objective control.",
        enemyResponse: "Respect arrow angles and avoid standing away from peel.",
      },
      {
        timing: "First completed marksman item",
        reason: "Her sustained slow pressure and DPS become more reliable",
        changesGameplay: "She can kite longer trades better if the enemy cannot hard engage.",
        playerAction:
          "Take extended trades only when slows and support peel keep the enemy at range.",
        enemyResponse: "Force fast engage before she stacks slows and spacing advantage.",
      },
    ],
  },
  primaryRoles: ["adc"],
  secondaryRoles: ["support"],
  primaryTradingPattern:
    "Use (W) and autos to slow from range, then commit only when support follow-up or (R) can lock the target.",
  punishProfile: {
    canPunish: [
      "Immobile ADCs stepping up without cleanse or peel.",
      "Short-range carries trying to walk through slows.",
      "Objective setups where (R) can start a pick.",
      "Enemy last hits on exposed melee or cannon minions.",
      "Bot lanes whose support stands too far back to break Ashe's slow chain.",
    ],
    strugglesToPunish: [
      "Hard engage that bypasses her slows.",
      "High-DPS carries protected through her pick attempts.",
    ],
  },
  shields: [],
  softCrowdControl: ["Passive slow", "(W) slow"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "control",
    preferredGameLength: "medium",
    scalingProfile: "mid",
    winMethod: ["utility picks", "lane control", "objective setup"],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "The enemy can engage directly before she creates distance.",
      "(R) is down and support peel is unavailable.",
      "The fight becomes a late-game DPS race against a stronger hypercarry.",
    ],
    goodTradeConditions: [
      "She can apply slows before the enemy reaches her.",
      "Support follow-up is ready for (R).",
      "The enemy ADC lacks mobility or cleanse for the pick.",
      "The enemy ADC must step up for a last hit and cannot immediately return damage from equal range.",
      "The wave is stable enough that Ashe can chase one extra auto without walking into support engage.",
    ],
    primaryPattern:
      "Control trades with slows and range, then use (R) or support setup to turn poke into a real catch.",
  },
  punishWindows: [
    "When (R) is down, her pick threat drops sharply.",
    "No dash makes her vulnerable to direct engage.",
    "If support cannot follow, long-range arrows are less reliable.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
