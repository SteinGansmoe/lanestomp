import type { LeagueChampionKnowledgeProfile } from "./types";

export const ahriCombatProfile = {
    profileQuality: "reviewed",
    abilities: {
      Q: "Orb of Deception",
      W: "Fox-Fire",
      E: "Charm",
      R: "Spirit Rush",
    },
    archetype: ["mobile mage", "pick", "roam", "playmaker"],
    debugNote: "(E) does have a delay, but it is not a skillshot.",
    primaryWinCondition: ["Land (E) to pick off targets and snowball leads."],
    dangerAbilities: ["(E)"],
    dangerProfile: {
      dangerousWhen: [
        "(E) is available and the enemy has stepped into punish range.",
        "(R) is available to extend a pick or escape after committing.",
        "The wave is stable enough for Ahri to threaten a roam or river move.",
      ],
      mustRespect: [
        "She is much easier to punish before level 6 or while (R) is down.",
        "Missing (E) removes her strongest punish and peel threat.",
      ],
    },
    commonWeaknesses: [
      "Pre 6 or while ult is on cooldown, she is vulnerable.",
      "Skillshot reliant.",
      "Waveclear is weaker before Lost Chapter.",
    ],
    damageType: "magic",
    hardCrowdControl: ["(E)"],
    id: "Ahri",
    importantAbilityNotes: [
      "(E) is her key punish and peel tool.",
      "(R) gives repeated dashes at level 6.",
      "(W) is very strong at lower levels to proc electrcute",
      "(Q) return damage rewards clean spacing.",
    ],
    lanePlan: {
      avoids: [
        "Using (E) without a clear punish window.",
        "Letting the enemy force extended trades after her cooldowns are spent.",
        "Being stuck under tower before her waveclear is online.",
      ],
      idealLaneState:
        "A controlled mid wave that lets Ahri threaten short trades, (E) angles, and river or roam timers without overcommitting.",
      wants: [
        "Short trades around (Q) return damage and (W) movement.",
        "(E) windows when the enemy commits forward or loses key mobility.",
        "Safe wave states that create roam or river pressure after level 6.",
      ],
    },
    laneIdentity:
      {
      earlyGameAgency: "high",
      scalingPriority: "medium",
      lanePressure: "high",
      preferredGameState: [
        "Controlling wave tempo before slower scaling champions stabilize.",
        "Creating roam and river movement opportunities after pushing safely.",
        "Forcing opponents to respect (E) pick threat when they farm or contest space.",
      ],
      winLaneBy: [
        "Building pressure through repeated short trades and (Q) return damage.",
        "Denying calm scaling lanes by contesting exposed farming windows.",
        "Using earlier tempo to impact the map before opponents reach stronger scaling spikes.",
      ],
    },
    majorPowerSpikes: [
      "Level 6 (R).",
      "First completed mage item.",
    ],
    matchupPreferences: {
      strongInto: [
        "Champions who must walk into (Q) range to farm.",
        "Immobile targets that cannot easily dodge (Q) return damage or (E) pressure.",
        "Champions that struggle to escape or punish when Ahri commits forward with (E).",
      ],
      weakInto: [
        "Champions who outrange her and do not need to commit into (Q) or (E) range.",
        "Champions who can punish missed (E) before (R) is available.",
        "Champions with lots of mobility who can dodge her skillshots",
      ],
    },
    mobilityLevel: "high",
    name: "Ahri",
    offMetaRoles: [],
    strategicIdentity: {
      laneGoal: "roam",
      scalingProfile: "mid",
      preferredGameLength: "medium",
      winMethod: ["pick setup", "roam pressure", "short trade tempo"],
    },
    powerSpikes: {
      major: [
        {
          timing: "Level 6",
          reason: "Level 6 (R)",
          changesGameplay: "Level 6 changes Ahri from punishable mage into a much safer pick and chase champion",
          playerAction: "Track (R) availability and use the window for verified all-ins, picks, roams, or defensive resets rather than forcing blind.",
          enemyResponse: "Respect (R) window, hold key defensive tools for the commit, and punish after (R) is spent.",
        },
        {
          timing: "First completed mage item",
          reason: "First completed mage item",
          changesGameplay: "First completed mage item improves her ability to clear waves and convert picks",
          playerAction: "After the item, pressure waves and trades more confidently while still tracking the enemy's main answer.",
          enemyResponse: "Do not treat pre-item trades as still safe once Ahri's first item threshold is completed.",
        },
      ],
      minor: [
        {
          timing: "Level 3",
          reason: "Level 3 improves short-trade flexibility, but her matchup-defining threat starts at (R) and item waveclear",
          changesGameplay: "Ahri has more short-trade options, but this is context for lane trading rather than her main kill spike.",
          playerAction: "Use the extra flexibility for short (Q) and (W) trades while saving (E) for real punish windows.",
          enemyResponse: "Do not overreact to level 3 alone; respect (E) angles and punish if she spends (E) carelessly.",
        },
      ],
    },
    primaryRoles: ["mid"],
    secondaryRoles: [],
    primaryTradingPattern:
      "Poke with (Q) and look for (E) opportunities when available. (W) to easily proc electrocute is especially strong in early trades.",
    punishProfile: {
      canPunish: [
        "Forward movement after the enemy spends mobility or defensive cooldowns.",
        "Roams that leave the enemy wave exposed to a hard push.",
        "Enemies who commit into (E) range without minion or cooldown advantage.",
      ],
      strugglesToPunish: [
        "Long-range champions who clear safely outside (E) threat.",
        "Enemies holding mobility specifically to dodge (E).",
      ],
    },
    shields: [],
    softCrowdControl: [],
    stealthOrInvisibility: null,
    sustain: ["Passive healing from minion or champion takedown stacks."],
    trading: {
      badTradeConditions: [
        "If minions block (E) options.",
        "(R) is unavailable and the enemy can force an extended all-in.",
        "The wave is too large to step forward safely.",
      ],
      goodTradeConditions: [
        "The enemy has used mobility or a key defensive cooldown.",
        "Ahri can land (Q) return damage without taking an extended trade.",
        "(E) is being held for the enemy's commit instead of thrown blindly.",
      ],
      primaryPattern:
        "Use (Q) and (W) for short trades, hold (E) for the enemy commit or exposed movement, then disengage unless (R) creates a clean extension.",
    },
    punishWindows: [
  "If Ahri misses (E), she can be punished hard.",
  "If Ahri is forced to ult away, she has to play very carefully until its back up again",
  "(Q) is her main damage spell, if she uses this on the wave its a good time to trade into her.",
]
  } satisfies LeagueChampionKnowledgeProfile;


  
