import type { LeagueChampionKnowledgeProfile } from "./types";

export const veigarCombatProfile = {
    archetype: ["scaling mage", "control", "burst"],
    primaryWinCondition: ["Farm stacks with Q to become an unstoppable late-game burst threat."],
    dangerAbilities: ["E Event Horizon stun"],
    dangerProfile: {
      dangerousWhen: [
        "Event Horizon is available and can trap or zone the enemy into burst.",
        "He reaches level 6 and can threaten execute-style burst after poke or cage.",
        "He is allowed to farm stacks safely without lane pressure.",
      ],
      mustRespect: [
        "Event Horizon changes the lane from poke pressure into forced summoner or lethal threat.",
        "His scaling makes a calm lane increasingly favorable for Veigar.",
      ],
    },
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
    lanePlan: {
      avoids: [
        "Being forced to trade before he has enough stacks and mana.",
        "Holding wave far from safety while Event Horizon is unavailable.",
        "Letting mobile enemies bait cage and re-engage before it returns.",
      ],
      idealLaneState:
        "A safe, controlled lane where Veigar can farm Q stacks near safety and use Event Horizon to stop commits.",
      wants: [
        "Quiet early waves where he can farm stacks.",
        "Enemy movement through predictable choke points or minion paths for Event Horizon.",
        "Time to reach level 6 and first mage item without losing too much health or tempo.",
      ],
    },
    laneIdentity:
      "Scaling control mage who farms stacks, controls space with cage, and becomes a burst threat.",
    majorPowerSpikes: [
      "Level 3 full basic ability access.",
      "Level 6 Primordial Burst.",
      "First completed mage item plus stack growth.",
    ],
    matchupPreferences: {
      strongInto: [
        "Champions who must walk into Event Horizon range to trade.",
        "Low-mobility champions that cannot quickly punish him after cage is used.",
      ],
      weakInto: [
        "Champions who can pressure early waves and deny calm stacking.",
        "Mobile champions that can bait Event Horizon and punish while it is down.",
      ],
    },
    mobilityLevel: "none",
    name: "Veigar",
    offMetaRoles: ["adc", "support"],
    powerSpikes: {
      major: [
        "Level 3 full basic ability access.",
        "Level 6 Primordial Burst.",
        "First completed mage item plus stack growth.",
      ],
      notes: [
        "Level 6 makes trapped targets far more punishable if they are already low.",
        "His threat grows with stacks, so denying free farm matters as much as dodging cage.",
      ],
    },
    primaryRoles: ["mid"],
    secondaryRoles: [],
    primaryTradingPattern:
      "Farm stacks safely, punish movement with Event Horizon, then burst trapped targets.",
    punishProfile: {
      canPunish: [
        "Enemies who dash or walk predictably into Event Horizon range.",
        "Opponents who let him farm Q stacks without contesting wave tempo.",
        "Targets already low enough for Primordial Burst after cage or poke.",
      ],
      strugglesToPunish: [
        "Champions who outrange him and never commit into cage range.",
        "Mobile champions who hold dashes until after Event Horizon is used.",
      ],
    },
    shields: [],
    softCrowdControl: [],
    stealthOrInvisibility: null,
    sustain: [],
    trading: {
      badTradeConditions: [
        "Event Horizon is on cooldown.",
        "The enemy has enough mobility to dodge cage and force an all-in.",
        "The wave is pushed too far for his immobility.",
      ],
      goodTradeConditions: [
        "The enemy must step forward for minions while Event Horizon is ready.",
        "The wave is close enough to safety that Veigar can farm and retreat.",
        "The target is low enough that cage pressure threatens Primordial Burst.",
      ],
      primaryPattern:
        "Farm stacks safely, use Event Horizon to stop commits or punish predictable movement, then burst only when the target is trapped or already low.",
    },
    punishWindows: [
  "If Veigar is caught without Event Horizon.",
  "If Veigar pushes wave to far he can be punished as hes only peel is E."
]
  } satisfies LeagueChampionKnowledgeProfile;
