import type { LeagueChampionKnowledgeProfile } from "./types";

export const drMundoCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "low",
  abilities: { Q: "Infected Bonesaw", W: "Heart Zapper", E: "Blunt Force Trauma", R: "Maximum Dosage" },
  archetype: ["juggernaut", "health-scaling tank", "poke-resistant", "side-lane"],
  primaryWinCondition: ["Survive early pressure with (Q) farming and passive safety, then use health scaling and (R) to absorb damage in side lanes and front-to-back fights."],
  dangerAbilities: ["(Q) cleaver slow", "(R) healing and movement", "Passive crowd control block"],
  dangerProfile: {
    dangerousWhen: ["(Q) repeatedly lands and creates chase or disengage space.", "Passive blocks a key crowd control spell.", "(R) is active and he can keep walking at low-health targets."],
    mustRespect: ["He can farm from range with (Q) in hard lanes.", "His passive changes single-CC engage reliability.", "Health and item scaling make him harder to force out later."],
  },
  commonWeaknesses: ["Low hard crowd control.", "Weak early lane if cleavers miss.", "Healing reduction, % health damage, and kiting reduce his impact."],
  damageType: "mixed",
  hardCrowdControl: [],
  id: "DrMundo",
  importantAbilityNotes: ["(Q) is his main lane tool and slows.", "Passive blocks the next immobilizing effect and drops a canister.", "(W) stores and recovers damage if timed well.", "(R) gives healing and movement speed."],
  lanePlan: {
    avoids: ["Taking extended early trades before health scaling.", "Missing (Q) repeatedly and losing safe farm.", "Using (R) after the enemy has already disengaged."],
    idealLaneState: "A survivable top lane where Mundo farms with (Q), avoids forced all-ins, and reaches health-heavy item spikes.",
    wants: ["Safe cleaver farm.", "Enemies wasting crowd control into passive.", "Long fights where health, (W), and (R) matter."],
  },
  laneIdentity: {
    earlyGameAgency: "low",
    lanePressure: "low",
    preferredGameState: ["Low-interaction lanes that reach items.", "Side lanes where he can absorb pressure.", "Front-to-back fights where he soaks cooldowns."],
    scalingPriority: "high",
    winLaneBy: ["Farming safely with (Q).", "Outlasting poke with health regeneration.", "Becoming too durable to remove later."],
  },
  majorPowerSpikes: ["Level 6 (R).", "First health tank item.", "Mid-game durability scaling."],
  matchupPreferences: {
    strongInto: ["Low damage tanks.", "Single-CC engage patterns his passive can block.", "Lanes that cannot punish his early farming."],
    weakInto: ["Percent-health damage.", "Sustained ranged harass.", "Champions that kite him after (Q) misses."],
  },
  mobilityLevel: "low",
  name: "Dr. Mundo",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      { timing: "Level 6", reason: "(R) adds large healing and chase power", changesGameplay: "Mundo can stay in fights that previously forced him out.", playerAction: "Use (R) before lethal burst and keep moving through the fight.", enemyResponse: "Disengage the healing window or apply anti-heal and kite." },
      { timing: "Health item scaling", reason: "His damage and durability both improve with health", changesGameplay: "Side-lane trades become harder to win through simple burst.", playerAction: "Pressure side waves and force enemies to spend time cutting through health.", enemyResponse: "Use sustained damage and avoid giving free cleaver chains." },
    ],
  },
  primaryRoles: ["top"],
  primaryTradingPattern: "Farm and poke with (Q), absorb key crowd control through passive, then extend only when (R) and durability let him keep walking forward.",
  punishProfile: {
    canPunish: ["Enemies hit by repeated (Q).", "Champions relying on one immobilizing spell.", "Low-damage lanes that cannot stop his scaling."],
    strugglesToPunish: ["Mobile ranged champions.", "Targets with sustained % health damage."],
  },
  secondaryRoles: [],
  shields: [],
  softCrowdControl: ["(Q) slow"],
  stealthOrInvisibility: null,
  strategicIdentity: { laneGoal: "survive", preferredGameLength: "long", scalingProfile: "late", winMethod: ["health scaling", "side-lane durability", "front-line absorption"] },
  sustain: ["Passive health regeneration", "(W) gray health recovery", "(R) healing"],
  trading: {
    badTradeConditions: ["(Q) misses.", "Passive canister is unavailable against engage.", "The enemy has sustained damage and room to kite."],
    goodTradeConditions: ["(Q) lands repeatedly.", "Passive blocks a key crowd control tool.", "(R) is available before burst lands."],
    primaryPattern: "Use (Q) to manage spacing, take limited trades early, and rely on (R) plus health scaling for longer fights later.",
  },
  punishWindows: ["When passive is down, crowd control is more reliable.", "If (Q) misses, he has little way to force trades.", "Before level 6 and health items, he is easier to pressure."],
} satisfies LeagueChampionKnowledgeProfile;

