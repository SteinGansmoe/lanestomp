import type { LeagueChampionKnowledgeProfile } from "./types";

export const ahriCombatProfile = {
    archetype: ["mobile mage", "pick", "roam", "playmaker"],
    debugNote: "Ahri's charm does have a delay, but it is not a skillshot.",
    primaryWinCondition: ["Land E Charm to pick off targets and snowball leads."],
    dangerAbilities: ["E Charm"],
    dangerProfile: {
      dangerousWhen: [
        "Charm is available and the enemy has stepped into punish range.",
        "Spirit Rush is available to extend a pick or escape after committing.",
        "The wave is stable enough for Ahri to threaten a roam or river move.",
      ],
      mustRespect: [
        "She is much easier to punish before level 6 or while Spirit Rush is down.",
        "Missing Charm removes her strongest punish and peel threat.",
      ],
    },
    commonWeaknesses: [
      "Pre 6 or while ult is on cooldown, she is vulnerable.",
      "Skillshot reliant.",
      "Waveclear is weaker before Lost Chapter.",
    ],
    damageType: "magic",
    hardCrowdControl: ["E Charm"],
    id: "Ahri",
    importantAbilityNotes: [
      "E is her key punish and peel tool.",
      "R gives repeated dashes at level 6.",
      "W is very strong at lower levels to proc electrcute",
      "Q return damage rewards clean spacing.",
    ],
    lanePlan: {
      avoids: [
        "Using Charm without a clear punish window.",
        "Letting the enemy force extended trades after her cooldowns are spent.",
        "Being stuck under tower before her waveclear is online.",
      ],
      idealLaneState:
        "A controlled mid wave that lets Ahri threaten short trades, Charm angles, and river or roam timers without overcommitting.",
      wants: [
        "Short trades around Q return damage and W movement.",
        "Charm windows when the enemy commits forward or loses key mobility.",
        "Safe wave states that create roam or river pressure after level 6.",
      ],
    },
    laneIdentity:
      "One of the safest blind picks in the game, very hard to gank after level 6.",
    majorPowerSpikes: [
      "Level 3 full basic ability access.",
      "Level 6 Spirit Rush.",
      "First completed mage item.",
    ],
    matchupPreferences: {
      strongInto: [
        "Champions who must walk into Charm range to trade.",
        "Immobile targets that cannot easily dodge Q return damage or Charm pressure.",
      ],
      weakInto: [
        "Champions who outrange her and do not need to commit into Charm.",
        "Champions who can punish missed Charm before Spirit Rush is available.",
      ],
    },
    mobilityLevel: "high",
    name: "Ahri",
    offMetaRoles: [],
    powerSpikes: {
      major: [
        "Level 3 full basic ability access.",
        "Level 6 Spirit Rush.",
        "First completed mage item.",
      ],
      notes: [
        "Level 6 changes Ahri from punishable mage into a much safer pick and chase champion.",
        "First completed mage item improves her ability to clear waves and convert picks.",
      ],
    },
    primaryRoles: ["mid"],
    secondaryRoles: [],
    primaryTradingPattern:
      "Poke with Q and look for E opportunities when available. W to easily proc electrocute is especially strong in early trades.",
    punishProfile: {
      canPunish: [
        "Forward movement after the enemy spends mobility or defensive cooldowns.",
        "Roams that leave the enemy wave exposed to a hard push.",
        "Enemies who commit into Charm range without minion or cooldown advantage.",
      ],
      strugglesToPunish: [
        "Long-range champions who clear safely outside Charm threat.",
        "Enemies holding mobility specifically to dodge Charm.",
      ],
    },
    shields: [],
    softCrowdControl: [],
    stealthOrInvisibility: null,
    sustain: ["Passive healing from minion or champion takedown stacks."],
    trading: {
      badTradeConditions: [
        "Charm is on cooldown.",
        "Spirit Rush is unavailable and the enemy can force an extended all-in.",
        "The wave is too large to step forward safely.",
      ],
      goodTradeConditions: [
        "The enemy has used mobility or a key defensive cooldown.",
        "Ahri can land Q return damage without taking an extended trade.",
        "Charm is being held for the enemy's commit instead of thrown blindly.",
      ],
      primaryPattern:
        "Use Q and W for short trades, hold Charm for the enemy commit or exposed movement, then disengage unless Spirit Rush creates a clean extension.",
    },
    punishWindows: [
  "If Ahri misses charm, she can be punished hard.",
  "If Ahri is forced to ult away, she has to play very carefully until its back up again"
]
  } satisfies LeagueChampionKnowledgeProfile;


  
