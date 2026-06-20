import type { LeagueChampionKnowledgeProfile } from "./types";

export const zoeCombatProfile = {
  profileQuality: "reviewed",
  abilities: {
    Q: "Paddle Star",
    W: "Spell Thief",
    E: "Sleepy Trouble Bubble",
    R: "Portal Jump",
  },
  archetype: ["poke mage", "pick", "burst"],
  primaryWinCondition: [
    "Can find very good angles for (E) and have incredible range with (R) + (Q).",
  ],
  commonWeaknesses: [
    "Vulnerable if (E) miss or is on cooldown.",
    "Skillshot reliant and punishable after missed (E).",
    "Easily punished by targeted CC.",
  ],
  damageType: "magic",
  hardCrowdControl: ["(E)"],
  id: "Zoe",
  importantAbilityNotes: [
    "(E) is her key pick and damage amp setup.",
    "(R) is her key dodge ability skill, she also use it to extend the range of her (Q).",
    "(W) can provide Zoe with great summoner abilities and items effects.",
  ],
  lanePlan: {
    avoids: [
      "Vulnerable if (E) miss or is on cooldown.",
      "Skillshot reliant and punishable after missed (E).",
      "Easily punished by targeted CC.",
    ],
    idealLaneState: "Pick-focused poke mage who threatens long-range burst after (E) connects.",
    wants: ["Can find very good angles for (E) and have incredible range with (R) + (Q)."],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    scalingPriority: "medium",
    lanePressure: "high",
    preferredGameState: [
      "Can find very good angles for (E) and have incredible range with (R) + (Q).",
    ],
    winLaneBy: ["Can find very good angles for (E) and have incredible range with (R) + (Q)."],
  },
  majorPowerSpikes: ["Level 6 (R) for extended poke angles.", "First completed AP burst item."],
  matchupPreferences: {
    strongInto: [
      "Short range champions who struggle to punish missed (E).",
      "Champions who rely on dodging skillshots to trade.",
    ],
    weakInto: [
      "Champions with reliable point-and-click CC",
      "Champions that can easily dodge (E) and punish the cooldown.",
    ],
  },
  counters: [
    {
      champion: "Corki",
      reasons: [
        "Zoe can punish Corki before he has enough rocket uptime by landing (E) through fog or walls.",
        "Sleep into paddle star threatens Corki whenever his (W) is down.",
        "Bubble control around objectives can deny Corki safe Package entry angles.",
      ],
    },
  ],
  counteredBy: [
    {
      champion: "Yasuo",
      reasons: [
        "Yasuo can block Zoe's key projectile damage or bubble follow-up with Wind Wall.",
        "Minion dash paths make it difficult for Zoe to land clean lane bubbles.",
        "If Zoe misses (E), Yasuo can punish her low mobility before the cooldown returns.",
      ],
    },
  ],
  mobilityLevel: "medium",
  name: "Zoe",
  offMetaRoles: [],
  strategicIdentity: {
    laneGoal: "control",
    scalingProfile: "mid",
    preferredGameLength: "medium",
    winMethod: ["long-range picks", "fog pressure", "poke setup"],
  },
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "Level 6 (R) for extended poke angles",
        changesGameplay:
          "Zoe's ultimate becomes available, so the matchup shifts around whether the commit, pick, roam, or escape threat is ready.",
        playerAction:
          "Track (R) availability and use the window for verified all-ins, picks, roams, or defensive resets rather than forcing blind.",
        enemyResponse:
          "Respect (R) window, hold key defensive tools for the commit, and punish after (R) is spent.",
      },
      {
        timing: "First completed AP burst item",
        reason: "First completed AP burst item",
        changesGameplay:
          "Zoe's damage, wave control, or trade reliability improves enough that earlier neutral trades can become losing trades.",
        playerAction:
          "After the item, pressure waves and trades more confidently while still tracking the enemy's main answer.",
        enemyResponse:
          "Do not treat pre-item trades as still safe once Zoe's first item threshold is completed.",
      },
    ],
  },
  primaryRoles: ["mid"],
  secondaryRoles: [],
  primaryTradingPattern: "Fish for (E), then use (Q) and (R) for burst.",
  punishProfile: {
    canPunish: [],
    strugglesToPunish: [
      "Vulnerable if (E) miss or is on cooldown.",
      "Skillshot reliant and punishable after missed (E).",
      "Easily punished by targeted CC.",
    ],
  },
  shields: [],
  softCrowdControl: [
    "(E) applies sleep after a short delay, and the next damaging hit wakes the target up.",
  ],
  stealthOrInvisibility: null,
  sustain: [],
  trading: {
    badTradeConditions: ["After (E) is missed.", "If (R) is used at bad timings."],
    goodTradeConditions: [],
    primaryPattern: "Fish for (E), then use (Q) and (R) for burst.",
  },
  dangerAbilities: ["(E) (Q)"],
  dangerProfile: {
    dangerousWhen: ["(E) (Q)"],
    mustRespect: [
      "(E) is her key pick and damage amp setup.",
      "(R) is her key dodge ability skill, she also use it to extend the range of her (Q).",
      "(W) can provide Zoe with great summoner abilities and items effects.",
    ],
  },
  punishWindows: ["After (E) is missed.", "If (R) is used at bad timings."],
} satisfies LeagueChampionKnowledgeProfile;
