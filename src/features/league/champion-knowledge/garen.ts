import type { LeagueChampionKnowledgeProfile } from "./types";

export const garenCombatProfile = {
  profileQuality: "draft",
  abilities: {
    Q: "Decisive Strike",
    W: "Courage",
    E: "Judgment",
    R: "Demacian Justice",
  },
  archetype: ["juggernaut", "simple all-in", "silence", "execute"],
  primaryWinCondition: [
    "Use durable short trades around (Q), preserve health through passive, and look for level 6 execute windows after chip damage.",
  ],
  dangerAbilities: ["(Q) silence", "(E) sustained spin damage", "(R) execute"],
  dangerProfile: {
    dangerousWhen: [
      "(Q) lets him silence and start a short trade.",
      "(W) can absorb burst or crowd control timing.",
      "Level 6 makes damaged targets vulnerable to (R).",
    ],
    mustRespect: [
      "Silence can deny defensive or mobility spells.",
      "His passive rewards him for spacing out after trades.",
      "Execute threshold becomes the main danger after level 6.",
    ],
  },
  commonWeaknesses: [
    "Predictable engage pattern.",
    "Limited range and no dash.",
    "Can be kited if (Q) speed is baited.",
  ],
  damageType: "physical",
  hardCrowdControl: [],
  id: "Garen",
  importantAbilityNotes: [
    "(Q) gives movement speed, cleanses slows, and silences.",
    "(W) reduces incoming damage and helps absorb burst.",
    "(E) is his main sustained trade damage.",
    "(R) executes low-health targets.",
  ],
  lanePlan: {
    avoids: [
      "Taking repeated poke without passive reset time.",
      "Using (Q) where the enemy can simply disengage.",
      "Fighting extended trades into stronger duelists after (E) ends.",
    ],
    idealLaneState:
      "A stable top wave where Garen can step in for short (Q) plus (E) trades, then back out long enough for passive to recover health.",
    wants: [
      "Short trades that end before the opponent's extended damage wins.",
      "Health advantages that create (R) pressure.",
      "Bush or fog angles that reduce his predictable approach.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Short trade lanes with recovery time.",
      "Side lane where he can threaten silence into execute.",
      "Simple front-to-back fights where durability matters.",
    ],
    scalingPriority: "medium",
    winLaneBy: [
      "Using passive to outlast poke.",
      "Silencing key spells with (Q).",
      "Converting level 6 chip damage into (R) kills.",
    ],
  },
  majorPowerSpikes: ["Level 6 (R).", "First bruiser/tank item.", "Mid-game side-lane durability."],
  matchupPreferences: {
    strongInto: [
      "Squishy champions vulnerable to silence.",
      "Melee lanes where short trades are available.",
      "Opponents who cannot stop passive recovery.",
    ],
    weakInto: [
      "Ranged poke and kiting.",
      "Champions with stronger extended duels.",
      "Disengage that prevents (Q) contact.",
    ],
  },
  counters: [
    {
      champion: "Yasuo",
      reasons: [
        "Garen can silence Yasuo before he dashes out and win short trades before Yasuo's item spikes.",
      ],
    },
    {
      champion: "Riven",
      reasons: [
        "Garen can use silence to interrupt Riven's combo timing and disengage before extended trades get messy.",
      ],
    },
    {
      champion: "Irelia",
      reasons: [
        "Garen can punish Irelia when her stun or reset setup is down and convert chip damage into execute pressure.",
      ],
    },
    {
      champion: "Akali",
      reasons: [
        "Garen can survive Akali's short burst windows and threaten silence if she commits too close.",
      ],
    },
  ],
  counteredBy: [
    {
      champion: "Darius",
      reasons: [
        "Darius can extend trades past Garen's short-trade pattern and punish him before passive recovery matters.",
      ],
    },
    {
      champion: "Vayne",
      reasons: [
        "Vayne can kite Garen's predictable approach and punish him every time (Q) fails to connect.",
      ],
    },
    {
      champion: "Quinn",
      reasons: [
        "Quinn can keep Garen out of silence range and disengage his only reliable engage pattern.",
      ],
    },
    {
      champion: "Kayle",
      reasons: [
        "Kayle can survive early pressure with spacing and later outrange Garen's short-trade execute plan.",
      ],
    },
  ],
  mobilityLevel: "low",
  name: "Garen",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "(R) creates execute threat",
        changesGameplay:
          "Any health lead becomes much more dangerous once Garen can finish with (R).",
        playerAction:
          "Use short trades to set up execute range instead of forcing full-health fights.",
        enemyResponse: "Avoid staying in lane low after taking (Q) and (E) chip.",
      },
      {
        timing: "First defensive or bruiser item",
        reason: "Garen becomes harder to burst during short trades",
        changesGameplay: "He can absorb more return damage before resetting with passive.",
        playerAction: "Repeat controlled trades and preserve health advantage.",
        enemyResponse: "Punish him before passive resets and avoid isolated execute windows.",
      },
    ],
  },
  primaryRoles: ["top"],
  primaryTradingPattern:
    "Use (Q) to silence, spin with (E) for short damage, then disengage before the opponent's extended trade pattern overtakes him.",
  punishProfile: {
    canPunish: [
      "Enemies who cannot stop (Q) approach.",
      "Targets holding key spells that silence can deny.",
      "Low-health enemies staying in (R) range.",
    ],
    strugglesToPunish: [
      "Ranged champions who maintain spacing.",
      "Duelists who outdamage him after (E) ends.",
    ],
  },
  secondaryRoles: ["mid"],
  shields: [],
  softCrowdControl: ["(Q) silence"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "survive",
    preferredGameLength: "medium",
    scalingProfile: "mid",
    winMethod: ["short trades", "execute pressure", "durable side-lane play"],
  },
  sustain: ["Passive health regeneration"],
  trading: {
    badTradeConditions: [
      "(Q) is baited and the target stays out of range.",
      "The enemy can extend after (E) ends.",
      "Passive has not had time to recover health.",
    ],
    goodTradeConditions: [
      "The enemy's main disengage is down.",
      "A short silence denies the enemy's trade spell.",
      "The target is near (R) execute range.",
    ],
    primaryPattern:
      "Take a short (Q) silence trade into (E), then leave the fight before stronger extended duel patterns can punish him.",
  },
  punishWindows: [
    "After Garen uses (Q), he has little reach until it returns.",
    "If passive is interrupted repeatedly, his sustain plan collapses.",
    "Before level 6, his finishing power is much lower.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
