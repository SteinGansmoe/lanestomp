import type { LeagueChampionKnowledgeProfile } from "./types";

export const rivenCombatProfile = {
  profileQuality: "draft",
  abilities: {
    Q: "Broken Wings",
    W: "Ki Burst",
    E: "Valor",
    R: "Blade of the Exile",
  },
  archetype: ["fighter", "combo skirmisher", "high mobility", "snowball"],
  primaryWinCondition: [
    "Use cooldown sequencing and animation-cancel trades to create early leads, then snowball side-lane or skirmish pressure.",
  ],
  dangerAbilities: ["(Q) mobility and knockup", "(W) stun", "(R) execute wave"],
  dangerProfile: {
    dangerousWhen: [
      "She has all basic cooldowns available for a full combo.",
      "(E) shields the engage or retreat.",
      "(R) is active and low-health targets are in execute range.",
    ],
    mustRespect: [
      "Her short cooldown chains can rapidly change spacing.",
      "(W) and third (Q) create crowd control during trades.",
      "Level 6 adds burst and finishing power.",
    ],
  },
  commonWeaknesses: [
    "Punishable when cooldowns are spent.",
    "Needs clean execution and spacing.",
    "Can struggle into point-and-click control or durable champions that survive burst.",
  ],
  damageType: "physical",
  hardCrowdControl: ["(W) stun", "third (Q) knockup"],
  id: "Riven",
  importantAbilityNotes: [
    "(Q) has three casts and the third knocks up.",
    "(E) is a dash and shield.",
    "(W) stuns nearby targets.",
    "(R) increases damage and unlocks an execute projectile.",
  ],
  lanePlan: {
    avoids: [
      "Trading after using mobility just to farm.",
      "Committing into durable targets with no cooldown advantage.",
      "Letting the enemy hold crowd control for her third (Q) or (E) commit.",
    ],
    idealLaneState:
      "A flexible top wave with space for Riven to dash in and out, trade around cooldown advantages, and threaten lethal once (R) is ready.",
    wants: [
      "Cooldown advantage before short combo trades.",
      "Enemy key control or disengage spent first.",
      "Level 6 all-in windows after prior chip damage.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    lanePressure: "medium",
    preferredGameState: [
      "Short skirmishes where mobility resets spacing.",
      "Side lanes with room to outplay cooldowns.",
      "Snowball fights where she can burst and chase.",
    ],
    scalingPriority: "medium",
    winLaneBy: [
      "Punishing enemy cooldowns with fast combos.",
      "Using shield and dashes to take one-sided trades.",
      "Converting level 6 burst into kills.",
    ],
  },
  majorPowerSpikes: ["Level 3 full basic kit.", "Level 6 (R).", "First haste/damage item."],
  matchupPreferences: {
    strongInto: [
      "Champions with dodgeable skillshot control.",
      "Targets she can burst before extended durability matters.",
      "Lanes where cooldown advantage creates repeated trades.",
    ],
    weakInto: [
      "Point-and-click control.",
      "Durable champions that survive her combo.",
      "Matchups that punish her after cooldowns are spent.",
    ],
  },
  mobilityLevel: "very_high",
  name: "Riven",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "(R) increases damage and adds execute threat",
        changesGameplay: "Riven can turn prior chip damage into a full lethal combo.",
        playerAction: "Set up the all-in by baiting key cooldowns before activating (R).",
        enemyResponse: "Hold crowd control or disengage for her committed combo, not her first dash.",
      },
      {
        timing: "First haste/damage item",
        reason: "Cooldown access improves combo frequency",
        changesGameplay: "She can threaten repeated short trades and recover cooldowns faster.",
        playerAction: "Use item timing to contest wave and punish enemy cooldown windows.",
        enemyResponse: "Punish her immediately after a failed combo before cooldowns return.",
      },
    ],
  },
  primaryRoles: ["top"],
  primaryTradingPattern:
    "Chain (Q), (W), and (E) for short burst trades, then disengage before cooldown downtime is punished.",
  punishProfile: {
    canPunish: [
      "Enemies who spend crowd control first.",
      "Targets caught by third (Q) or (W).",
      "Low-health enemies after (R) is active.",
    ],
    strugglesToPunish: [
      "Champions holding point-and-click control.",
      "Tanks that absorb her combo and force extended fights.",
    ],
  },
  secondaryRoles: ["mid"],
  shields: ["(E) shield"],
  softCrowdControl: [],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "snowball",
    preferredGameLength: "medium",
    scalingProfile: "mid",
    winMethod: ["cooldown outplays", "side-lane pressure", "burst skirmishes"],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "Her dashes are spent and the enemy can retaliate.",
      "Enemy point-and-click control is still held.",
      "The target can survive the full combo and extend.",
    ],
    goodTradeConditions: [
      "Enemy control or disengage is down.",
      "She can use (E) to absorb return damage.",
      "(R) turns the combo into lethal.",
    ],
    primaryPattern:
      "Enter with a planned cooldown sequence, use (E) to shield the trade, weave crowd control through (W) or third (Q), then exit before downtime.",
  },
  punishWindows: [
    "After Riven spends (Q) and (E), her mobility and defense are lower.",
    "If (W) or third (Q) misses, her combo control is weaker.",
    "Before level 6, her finishing power is lower.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
