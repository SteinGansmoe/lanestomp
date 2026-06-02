import type { LeagueChampionKnowledgeProfile } from "./types";

export const heimerdingerCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "high",
  abilities: { Q: "H-28 G Evolution Turret", W: "Hextech Micro-Rockets", E: "CH-2 Electron Storm Grenade", R: "UPGRADE!!!" },
  archetype: ["control mage", "turret zone", "lane bully", "anti-engage"],
  primaryWinCondition: ["Build turret zones that punish melee approaches, control waves, and use upgraded abilities to deny dives or win objective setups."],
  dangerAbilities: ["(Q) turret zone", "(E) stun", "(R) upgraded ability"],
  dangerProfile: {
    dangerousWhen: ["Multiple turrets are set before the fight.", "(E) lands and activates turret beams.", "(R) upgrades the correct spell for burst, control, or survivability."],
    mustRespect: ["His lane is strongest when he has time to set up.", "Walking through turret zones turns short trades into extended damage.", "Dives are risky if (E), turrets, and (R) are ready."],
  },
  commonWeaknesses: ["Vulnerable when turrets are cleared.", "Low mobility.", "Can overpush and become gankable."],
  damageType: "magic",
  hardCrowdControl: ["(E) stun"],
  id: "Heimerdinger",
  importantAbilityNotes: ["(Q) turrets define his lane zone.", "(W) is poke and burst.", "(E) stuns in the center and slows around it.", "(R) upgrades the next basic ability."],
  lanePlan: {
    avoids: ["Fighting away from turrets.", "Pushing without vision against ganks.", "Using (E) for poke when divers can engage."],
    idealLaneState: "A pushed or controlled top lane where Heimerdinger has turrets placed and can punish champions who walk into his setup.",
    wants: ["Turrets established before trades.", "Enemies forced to last-hit inside turret range.", "Objective or tower setups where his zone control is already active."],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    lanePressure: "high",
    preferredGameState: ["Pre-set zones.", "Anti-dive lanes.", "Objective setups where enemies must enter turret control."],
    scalingPriority: "medium",
    winLaneBy: ["Maintaining turret control.", "Landing (E) inside turret range.", "Forcing enemies to farm under pressure."],
  },
  majorPowerSpikes: ["Level 3 full zone pattern.", "Level 6 (R).", "First AP item."],
  matchupPreferences: {
    strongInto: ["Melee champions that must walk into turrets.", "Dive patterns he can stun with (E).", "Lanes with limited turret clear."],
    weakInto: ["Long-range waveclear.", "Reliable ganks after he pushes.", "Champions that clear turrets safely."],
  },
  mobilityLevel: "low",
  name: "Heimerdinger",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      { timing: "Level 6", reason: "(R) gives upgraded burst, turret, or control options", changesGameplay: "Heimerdinger can adapt the same setup into anti-dive, kill pressure, or teamfight zoning.", playerAction: "Choose the upgrade based on whether the fight needs damage, control, or a stronger zone.", enemyResponse: "Force him to use (R) defensively or fight away from turrets." },
      { timing: "First AP item", reason: "Turret and spell damage become harder to ignore", changesGameplay: "Walking into his setup becomes much more punishing.", playerAction: "Keep turrets alive and force enemies through them before trading.", enemyResponse: "Clear turrets before committing." },
    ],
    minor: [{ timing: "Level 3", reason: "Turrets, rockets, and grenade are all available", changesGameplay: "His full anti-engage pattern is online.", playerAction: "Hold (E) for enemy commit rather than throwing it casually.", enemyResponse: "Bait (E) before entering turret range." }],
  },
  primaryRoles: ["top"],
  primaryTradingPattern: "Set turrets first, use (E) to punish approaches, and layer (W) or upgraded spells when enemies are trapped in the turret zone.",
  punishProfile: {
    canPunish: ["Melee champions entering turret zones.", "Divers after (E) lands.", "Enemies who ignore turret beams."],
    strugglesToPunish: ["Long-range champions that clear turrets.", "Gank pressure when overextended."],
  },
  secondaryRoles: [],
  shields: [],
  softCrowdControl: ["(E) slow"],
  stealthOrInvisibility: null,
  strategicIdentity: { laneGoal: "control", preferredGameLength: "medium", scalingProfile: "mid", winMethod: ["lane zone control", "anti-dive damage", "objective setup"] },
  sustain: [],
  trading: {
    badTradeConditions: ["Turrets are cleared.", "(E) is down.", "The wave is pushed without vision."],
    goodTradeConditions: ["Multiple turrets are active.", "The enemy must walk forward for minions.", "(E) can land inside turret range."],
    primaryPattern: "Let turret setup define the lane, then punish enemies who enter it with (E), (W), and the correct (R) upgrade.",
  },
  punishWindows: ["After turrets are cleared, his zone control drops.", "When (E) is down, dives are easier.", "He is vulnerable to ganks when permanently pushed."],
} satisfies LeagueChampionKnowledgeProfile;

