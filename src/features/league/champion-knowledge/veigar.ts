import type { LeagueChampionKnowledgeProfile } from "./types";

export const veigarCombatProfile = {
    profileQuality: "reviewed",
    abilities: {
      Q: "Baleful Strike",
      W: "Dark Matter",
      E: "Event Horizon",
      R: "Primordial Burst",
    },
    archetype: ["scaling mage", "control", "burst"],
    primaryWinCondition: ["Farm stacks with (Q) to become an unstoppable late-game burst threat."],
    dangerAbilities: ["(E) stun"],
    dangerProfile: {
      dangerousWhen: [
        "(E) is available and can trap or zone the enemy into burst.",
        "He reaches level 6 and can threaten execute-style burst after poke or cage.",
        "He is allowed to farm stacks safely without lane pressure.",
      ],
      mustRespect: [
        "(E) changes the lane from poke pressure into forced summoner or lethal threat.",
        "His scaling makes a calm lane increasingly favorable for Veigar.",
        "Veigar must respect most champion matchups at least before level 6 as he is quite weak early game.",
      ],
    },
    commonWeaknesses: [
      "Immobile and vulnerable when (E) is down.",
      "Weak early if denied farm and stacks.",
      "Skillshot and cage placement dependent.",
    ],
    damageType: "magic",
    hardCrowdControl: ["(E) stun"],
    id: "Veigar",
    importantAbilityNotes: [
      "(E) is his key defensive and pick tool.",
      "Phenomenal Evil scales endlessly.",
      "(R) is level 6 execute-style burst.",
      "The longer the game goes on, the stronger Veigar becomes.",
    ],
    lanePlan: {
      avoids: [
        "Being forced to trade before he has enough stacks and mana.",
        "Holding wave far from safety while (E) is unavailable.",
        "Letting mobile enemies bait cage and re-engage before it returns.",
      ],
      idealLaneState:
        "A safe, controlled lane where Veigar can farm (Q) stacks near safety and use (E) to stop commits.",
      wants: [
        "Quiet early waves where he can farm stacks.",
        "Enemy movement through predictable choke points or minion paths for (E).",
        "Time to reach level 6 and first mage item without losing too much health or tempo.",
      ],
    },
    laneIdentity:
      {
      earlyGameAgency: "low",
      scalingPriority: "very_high",
      lanePressure: "low",
      preferredGameState: [
        "Quiet early waves where he can farm (Q) stacks safely.",
        "A controlled lane near safety while (E) is available.",
        "Time to reach level 6 and item spikes without losing too much tempo.",
      ],
      winLaneBy: [
        "Surviving early pressure and preserving health for scaling windows.",
        "Using (E) to stop commits or punish predictable movement.",
        "Reaching stack and item thresholds where his burst becomes decisive.",
      ],
    },
    majorPowerSpikes: [
      "Level 6 (R).",
      "First completed mage item plus stack growth.",
    ],
    matchupPreferences: {
      strongInto: [
        "Champions who must walk into (E) range to trade.",
        "Low-mobility champions that cannot quickly punish him after cage is used.",
        "Champions that are not strong early game",
        "Champions that cannot get close to him easily to all-in or punish him after cage.",
      ],
      weakInto: [
        "Champions who can pressure early waves and deny calm stacking.",
        "Mobile champions that can bait (E) and punish while it is down.",
        "Champions with high waveclear as Veigar is not the best at farming waves under turret early game.",
        "Champions that can make themselves untargetable or dodge his skillshots easily.",
      ],
    },
    mobilityLevel: "none",
    name: "Veigar",
    offMetaRoles: ["adc", "support"],
    strategicIdentity: {
      laneGoal: "scale",
      scalingProfile: "late",
      preferredGameLength: "long",
      winMethod: ["stack scaling", "zone control", "late game burst"],
    },
    powerSpikes: {
      major: [
        {
          timing: "Level 6",
          reason: "Level 6 (R)",
          changesGameplay: "Level 6 makes trapped targets far more punishable if they are already low",
          playerAction: "Track (R) availability and use the window for verified all-ins, picks, roams, or defensive resets rather than forcing blind.",
          enemyResponse: "Respect (R) window, hold key defensive tools for the commit, and punish after (R) is spent.",
        },
        {
          timing: "First completed mage item plus stack growth",
          reason: "First completed mage item plus stack growth",
          changesGameplay: "His threat grows with stacks, so denying free farm matters as much as dodging cage",
          playerAction: "After the item, pressure waves and trades more confidently while still tracking the enemy's main answer.",
          enemyResponse: "Do not treat pre-item trades as still safe once Veigar's first item threshold is completed.",
        },
      ],
      minor: [
        {
          timing: "Level 3",
          reason: "Level 3 improves defensive options, but his meaningful spike is (R) plus stack and item growth",
          changesGameplay: "(E) is his key defensive and pick tool, and can be used to stop engages or trap enemies for burst windows",
          playerAction: "Use (E) mainly to deny commits or punish trapped movement while continuing to build stacks safely.",
          enemyResponse: "Track (E) cooldown carefully; pressure is much safer after cage is unavailable.",
        },
      ],
    },
    primaryRoles: ["mid"],
    secondaryRoles: ["adc", "support"],
    primaryTradingPattern:
      "Farm stacks safely, punish movement with (E), then burst trapped targets.",
    punishProfile: {
      canPunish: [
        "Enemies who dash or walk predictably into (E) range.",
        "Opponents who let him farm (Q) stacks without contesting wave tempo.",
        "Targets already low enough for (R) after cage or poke.",
      ],
      strugglesToPunish: [
        "Champions who outrange him and never commit into cage range.",
        "Mobile champions who can gap close or dash close to all-in him.",
      ],
    },
    shields: [],
    softCrowdControl: [],
    stealthOrInvisibility: null,
    sustain: [],
    trading: {
      badTradeConditions: [
        "(E) is on cooldown.",
        "The enemy has enough mobility to dodge cage and force an all-in.",
        "The wave is pushed too far for his immobility.",
      ],
      goodTradeConditions: [
        "The enemy must step forward for minions while (E) is ready.",
        "The wave is close enough to safety that Veigar can farm and retreat.",
        "The target is low enough that cage pressure threatens (R).",
      ],
      primaryPattern:
        "Farm stacks safely, use (E) to stop commits or punish predictable movement, then burst only when the target is trapped or already low.",
    },
    punishWindows: [
  "If Veigar is caught without (E).",
  "If Veigar pushes wave to far he can be punished as hes only peel is (E)."
]
  } satisfies LeagueChampionKnowledgeProfile;
