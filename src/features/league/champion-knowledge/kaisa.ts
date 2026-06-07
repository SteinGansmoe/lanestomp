import type { LeagueChampionKnowledgeProfile } from "./types";

export const kaisaCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "high",
  abilities: {
    Q: "Icathian Rain",
    W: "Void Seeker",
    E: "Supercharge",
    R: "Killer Instinct",
  },
  archetype: ["marksman", "scaling assassin", "duelist", "dive follow-up"],
  primaryWinCondition: [
    "Reach evolve and item thresholds, then use isolated damage and (R) follow-up to punish marked targets.",
  ],
  dangerAbilities: ["(Q) isolated damage", "(W) mark", "(R) reposition"],
  dangerProfile: {
    dangerousWhen: [
      "A target is isolated enough for strong (Q) damage.",
      "Her team or support applies CC that lets her follow with (R).",
      "She reaches evolve thresholds that improve damage or repositioning.",
    ],
    mustRespect: [
      "Her all-in improves sharply when plasma stacks are already started.",
      "(R) can turn a small support or team setup into backline access.",
      "She scales into mixed damage that is hard to itemize against cleanly.",
    ],
  },
  commonWeaknesses: [
    "Short range before she can safely commit.",
    "Needs setup or isolated targets for best damage.",
    "Can be punished before evolve and item thresholds.",
  ],
  damageType: "mixed",
  hardCrowdControl: [],
  id: "Kaisa",
  lanePlan: {
    avoids: [
      "Trading into longer-range ADCs without support setup.",
      "Using (E) forward when enemy engage is ready.",
      "Taking fair poke lanes before first item access.",
    ],
    idealLaneState:
      "A stable bot lane where Kai'Sa preserves health, farms toward evolves, and all-ins only when support setup creates plasma access.",
    wants: [
      "Safe access to first item spike.",
      "Support can start plasma stacks or force a target to stand still.",
      "Short all-in windows after enemy poke or disengage is down.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Even lanes that reach item thresholds.",
      "Skirmishes where allies provide first CC.",
      "Fights with isolated targets she can dive onto.",
    ],
    scalingPriority: "high",
    winLaneBy: [
      "Avoiding range-based poke losses.",
      "Committing only after support setup.",
      "Using item and evolve spikes to change all-in threat.",
    ],
  },
  majorPowerSpikes: ["First completed item.", "Ability evolve thresholds.", "Level 6 (R)."],
  matchupPreferences: {
    strongInto: [
      "Short-range fights where she can commit fully.",
      "Supports or teams that provide reliable CC setup.",
      "Isolated targets vulnerable to burst and chase.",
    ],
    weakInto: [
      "Long-range poke lanes.",
      "Disengage that denies her commit.",
      "Bot lanes that punish her before item thresholds.",
    ],
  },
  mobilityLevel: "high",
  name: "Kai'Sa",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "First completed item",
        reason: "Her damage and evolve path start changing trade access",
        changesGameplay:
          "Kai'Sa can threaten all-ins more reliably once her item threshold is reached.",
        playerAction:
          "Look for support setup into isolated damage rather than raw poke trades.",
        enemyResponse:
          "Keep wave distance and avoid giving her a clean committed target.",
      },
      {
        timing: "Level 6",
        reason: "(R) gives long-range follow-up and repositioning",
        changesGameplay:
          "Any plasma mark can become a sudden commit if the target is isolated.",
        playerAction:
          "Use (R) only when the follow-up target can actually be finished or escaped from.",
        enemyResponse:
          "Respect marked targets and hold disengage for her commit.",
      },
    ],
  },
  primaryRoles: ["adc"],
  secondaryRoles: [],
  primaryTradingPattern:
    "Farm through early range pressure, then commit when support setup or plasma stacks make the all-in real.",
  punishProfile: {
    canPunish: [
      "Isolated ADCs after support CC.",
      "Poke lanes that miss their disengage.",
      "Targets marked by (W) or allied setup.",
    ],
    strugglesToPunish: [
      "Long-range wave control without engage support.",
      "Disengage supports that interrupt her commit.",
    ],
  },
  shields: ["(R) shield"],
  softCrowdControl: [],
  stealthOrInvisibility: "Evolved (E) gives brief invisibility.",
  strategicIdentity: {
    laneGoal: "scale",
    preferredGameLength: "medium",
    scalingProfile: "mid",
    winMethod: ["item thresholds", "isolated burst", "teamfight dive follow-up"],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "The enemy ADC outranges her and no support setup is available.",
      "She uses (E) forward before enemy engage is spent.",
      "She commits without plasma stacks or isolated (Q) damage.",
    ],
    goodTradeConditions: [
      "Support CC starts plasma stacks.",
      "The enemy ADC is isolated from minions or peel.",
      "Enemy disengage or poke cooldowns are down.",
    ],
    primaryPattern:
      "Avoid fair poke trades, then use support setup and item spikes to turn short windows into committed all-ins.",
  },
  punishWindows: [
    "Before item and evolve thresholds, her range disadvantage is easier to punish.",
    "If (E) is spent forward, she has less safety against engage.",
    "When support cannot start plasma stacks, her lane all-in is less reliable.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
