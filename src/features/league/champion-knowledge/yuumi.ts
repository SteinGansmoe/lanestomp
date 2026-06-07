import type { LeagueChampionKnowledgeProfile } from "./types";

export const yuumiCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: { Q: "Prowling Projectile", W: "You and Me!", E: "Zoomies", R: "Final Chapter" },
  archetype: ["support", "enchanter", "attach", "scaling"],
  primaryWinCondition: [
    "Attach to a carry, sustain and speed them through trades, then use (R) to lock targets during extended fights.",
  ],
  dangerAbilities: ["Attached (Q)", "(E) sustain", "(R) root waves"],
  dangerProfile: {
    dangerousWhen: [
      "Her host can safely trade forward.",
      "Enemy cannot punish weak early lane.",
      "Level 6 root can chase or disengage.",
  ],
    mustRespect: [
      "Yuumi gives up lane presence for scaling attachment.",
      "Her value depends heavily on host quality.",
      "Detach timing is risky but needed for passive value.",
  ],
  },
  commonWeaknesses: [
    "Very low early pressure.",
    "Weak if host is behind.",
    "Can be punished when detached or before scaling.",
  ],
  damageType: "magic",
  hardCrowdControl: ["(R) root"],
  id: "Yuumi",
  importantAbilityNotes: [
    "Yuumi gives up lane presence for scaling attachment.",
    "Her value depends heavily on host quality.",
    "Detach timing is risky but needed for passive value.",
  ],
  lanePlan: {
    avoids: [
      "Detaching into CC.",
      "Pairing with ADCs that need early engage.",
      "Letting wave get frozen with no pressure.",
  ],
    idealLaneState: "A defensive scaling lane where Yuumi keeps her ADC healthy, pokes with guided (Q), and avoids unnecessary detach risks.",
    wants: [
      "Safe scaling ADC.",
      "Host that can reposition aggressively.",
      "Low all-in pressure enemy lane.",
  ],
  },
  laneIdentity: {
    earlyGameAgency: "low",
    lanePressure: "low",
    preferredGameState: [
      "Scaling lanes.",
      "Host-carry fights.",
      "Extended chase or kite fights.",
  ],
    scalingPriority: "high",
    winLaneBy: [
      "Sustaining trades.",
      "Enhancing a fed host.",
      "Landing (R) through enemy path.",
  ],
  },
  majorPowerSpikes: ["Level 2 attach sustain.", "Level 3 guided poke plus speed.", "Level 6 Final Chapter."],
  matchupPreferences: {
    strongInto: [
      "Scaling carries.",
      "Mobile hosts.",
      "Lanes that cannot hard engage early.",
  ],
    weakInto: [
      "Hard engage lanes.",
      "Lane bullies.",
      "Comps that punish her ADC before scaling.",
  ],
  },
  mobilityLevel: "none",
  name: "Yuumi",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 2",
        reason: "Level 2 attach sustain.",
        changesGameplay: "The first real bot-lane interaction changes once this support can pair two early abilities.",
        playerAction: "Track the level 2 race and only contest the wave if the ADC can follow the support's threat.",
        enemyResponse: "Respect the level 2 timer and back up before the support reaches the wave first.",
      },
      {
        timing: "Level 3",
        reason: "Level 3 guided poke plus speed.",
        changesGameplay: "The full basic kit unlocks the support's main trade, peel, or poke pattern.",
        playerAction: "Use the complete kit around brush control, ADC follow-up, and the enemy support's key cooldown.",
        enemyResponse: "Punish the support after their main cooldown is spent or when the wave blocks their angle.",
      },
      {
        timing: "Level 6",
        reason: "Level 6 Final Chapter.",
        changesGameplay: "The ultimate changes all-in, peel, roam, or objective threat for the bot lane.",
        playerAction: "Use level 6 around confirmed ADC follow-up, river setup, or defensive reset value.",
        enemyResponse: "Track the ultimate cooldown and avoid giving a clean engage or counter-engage angle.",
      },
    ],
  },
  primaryRoles: ["support"],
  secondaryRoles: [],
  primaryTradingPattern: "Stay attached for safety, poke with guided (Q), heal speed-ups for trade exits, and detach only when CC is tracked.",
  punishProfile: {
    canPunish: [
      "Overextended enemies chasing her host.",
      "Low-health targets slowed by (Q).",
      "Teams grouped in (R) path.",
  ],
    strugglesToPunish: [
      "Early all-in lanes.",
      "Host losing wave control.",
      "Enemies with point-and-click CC when she detaches.",
  ],
  },
  shields: ["Passive shield"],
  softCrowdControl: ["(Q) slow"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "survive",
    preferredGameLength: "long",
    scalingProfile: "late",
    winMethod: ["Sustaining trades.", "Enhancing a fed host.", "Landing (R) through enemy path."],
  },
  supportSynergy: {
    excellentWith: ["Zeri", "Twitch", "Kaisa"],
    goodWith: ["Ezreal", "Sivir", "Vayne"],
    strugglesWith: ["Draven", "Samira", "Kalista"],
    notes: [
      "Zeri, Twitch, Kaisa convert Yuumi's strongest lane pattern especially well.",
      "Ezreal, Sivir, Vayne fit Yuumi when the lane can play around the same tempo window.",
      "Draven, Samira, Kalista can struggle with Yuumi when they need a different lane pace or protection pattern.",
  ],
  },
  sustain: ["(E) healing."],
  trading: {
    badTradeConditions: [
      "Host is chunked.",
      "(E) is down.",
      "Yuumi detaches near CC.",
  ],
    goodTradeConditions: [
      "Host can trade safely.",
      "Enemy engage is down.",
      "(R) can root along chase path.",
  ],
    primaryPattern: "Stay attached for safety, poke with guided (Q), heal speed-ups for trade exits, and detach only when CC is tracked.",
  },
  punishWindows: [
    "Punish her ADC early.",
    "Freeze waves against low pressure.",
    "Hold CC for detach windows.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
