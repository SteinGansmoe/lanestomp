import type { LeagueChampionKnowledgeProfile } from "./types";

export const galioCombatProfile = {
  profileQuality: "draft",
  abilities: {
    Q: "Winds of War",
    W: "Shield of Durand",
    E: "Justice Punch",
    R: "Hero's Entrance",
  },
  archetype: ["anti-magic tank", "roam", "engage", "peel"],
  primaryWinCondition: [
    "Absorb magic pressure, control short trades with taunt and knock-up, then impact side fights with (R).",
  ],
  dangerAbilities: ["(W) taunt", "(E) knock-up", "(R) follow-up"],
  dangerProfile: {
    dangerousWhen: [
      "(W) and (E) are available for layered crowd control.",
      "A teammate can start a fight that Galio can join with (R).",
      "He can shove the wave and move first to river.",
    ],
    mustRespect: [
      "(W) taunt punishes enemies who stand too close.",
      "(E) can start or interrupt short-range commits.",
      "(R) is a map tool and follow-up, not a solo lane damage spell.",
    ],
  },
  commonWeaknesses: [
    "Can be kited by long-range champions.",
    "Less threatening if (W) or (E) are missed.",
    "Wave and roam reliant; quiet scaling lanes can reduce his impact.",
  ],
  damageType: "magic",
  hardCrowdControl: ["(W) taunt", "(E) knock-up", "(R) knock-up"],
  id: "Galio",
  importantAbilityNotes: [
    "(W) is his key defensive and engage threat.",
    "(E) gives engage and peel but can be dodged or baited.",
    "(R) lets him join allied fights and protect teammates.",
    "His passive helps short trades and wave control.",
  ],
  lanePlan: {
    avoids: [
      "Chasing long-range champions through poke.",
      "Spending (E) without a clear hit or escape plan.",
      "Staying in lane while (R) could affect a skirmish.",
    ],
    idealLaneState:
      "A pushed or neutral wave where Galio can threaten short CC trades and move first to river or side fights.",
    wants: [
      "Short-range enemies entering (W) and (E) threat.",
      "Skirmishes where (R) can turn the fight.",
      "Magic damage lanes where his defensive profile has value.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Mid waves that let him move first.",
      "River or side fights where his crowd control matters.",
      "Enemy magic damage threats he can absorb better than most mids.",
    ],
    scalingPriority: "medium",
    winLaneBy: [
      "Neutralizing magic poke and forcing short CC trades.",
      "Creating roam pressure after pushing.",
      "Using (R) to protect allies or punish overcommits.",
    ],
  },
  majorPowerSpikes: ["Level 6 (R).", "First durability or AP utility item."],
  matchupPreferences: {
    strongInto: [
      "Magic damage champions who must enter his CC range.",
      "Teams that want to skirmish around river.",
      "Allied engage compositions that use his (R) follow-up well.",
    ],
    weakInto: [
      "Long-range waveclear that denies his engage range.",
      "Physical damage lane bullies.",
      "Champions that can avoid (W) and (E) while scaling freely.",
    ],
  },
  mobilityLevel: "medium",
  name: "Galio",
  offMetaRoles: ["support"],
  strategicIdentity: {
    laneGoal: "roam",
    scalingProfile: "mid",
    preferredGameLength: "medium",
    winMethod: ["push and roam", "counter-engage", "teamfight setup"],
  },
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "Level 6 (R)",
        changesGameplay: "Level 6 increases his map impact more than his solo kill threat",
        playerAction:
          "Track (R) availability and use the window for verified all-ins, picks, roams, or defensive resets rather than forcing blind.",
        enemyResponse:
          "Respect (R) window, hold key defensive tools for the commit, and punish after (R) is spent.",
      },
      {
        timing: "First durability or AP utility item",
        reason: "First durability or AP utility item",
        changesGameplay: "Early durability makes his short trade and roam pattern safer",
        playerAction:
          "After the item, pressure waves and trades more confidently while still tracking the enemy's main answer.",
        enemyResponse:
          "Do not treat pre-item trades as still safe once Galio's first item threshold is completed.",
      },
    ],
  },
  primaryRoles: ["mid"],
  secondaryRoles: ["support"],
  primaryTradingPattern:
    "Use (Q) and passive for short wave trades, hold (W) and (E) to punish enemies who step too close, then move to fights with (R).",
  punishProfile: {
    canPunish: [
      "Enemies stepping into (W) taunt range.",
      "Predictable dashes or commits that (E) can interrupt.",
      "Side fights where he can arrive with (R).",
    ],
    strugglesToPunish: [
      "Long-range champions who clear safely.",
      "Enemies who refuse short-range trades and track his roam timers.",
    ],
  },
  shields: ["Passive magic shield", "(R) ally shield on arrival"],
  softCrowdControl: [],
  stealthOrInvisibility: null,
  sustain: [],
  trading: {
    badTradeConditions: [
      "(W) and (E) are unavailable.",
      "The enemy can kite outside taunt range.",
      "A physical damage bully can punish him before he reaches the wave.",
    ],
    goodTradeConditions: [
      "The enemy walks into (W) or (E) range.",
      "Galio can trade briefly with passive and disengage.",
      "A roam or (R) timer is available after shoving.",
    ],
    primaryPattern:
      "Take short trades around (Q), passive, (W), and (E), then use wave pressure to look for map impact.",
  },
  punishWindows: [
    "If Galio misses (E), he loses a major engage and peel tool.",
    "If (W) is down, short-range enemies can trade more freely.",
    "If (R) is unavailable, his map threat drops sharply.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
