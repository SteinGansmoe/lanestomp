import { type LeagueItemMetadata } from "@/src/features/league/items";

export type CounterPickBuildPathKey = "ad-heavy" | "alternative-build" | "ap-heavy" | "build";

export type CounterPickBuildPath = {
  itemIds: Array<LeagueItemMetadata["id"]>;
  key: CounterPickBuildPathKey;
  note: string;
};

export type CounterPickBuildGuide = Record<CounterPickBuildPathKey, CounterPickBuildPath>;

const counterPickBuildGuides: Record<string, CounterPickBuildGuide> = {
  fiora: {
    build: {
      itemIds: [3078, 3074, 6610, 3053],
      key: "build",
      note: "Reliable side-lane dueling path with Sheen pressure, wave control, and enough durability to keep challenging vitals.",
    },
    "alternative-build": {
      itemIds: [3078, 6692, 3074, 6333],
      key: "alternative-build",
      note: "Higher burst option when Fiora can snowball short trades before committing to longer defensive purchases.",
    },
    "ad-heavy": {
      itemIds: [3047, 3078, 6333, 2502],
      key: "ad-heavy",
      note: "Armor-forward path for surviving physical burst while keeping enough damage to threaten side-lane all-ins.",
    },
    "ap-heavy": {
      itemIds: [3111, 3078, 3156, 3065],
      key: "ap-heavy",
      note: "Magic resist path for lanes or comps where Fiora needs to absorb AP damage before extended duels are playable.",
    },
  },
  lissandra: {
    build: {
      itemIds: [3020, 2503, 3157, 4645],
      key: "build",
      note: "Fast control-mage setup for waveclear, pick threat, and safe stasis windows after engaging.",
    },
    "alternative-build": {
      itemIds: [3020, 6653, 4629, 3089],
      key: "alternative-build",
      note: "More sustained fight value when Lissandra is playing into health stackers or slower front-to-back fights.",
    },
    "ad-heavy": {
      itemIds: [3020, 2420, 3157, 2503],
      key: "ad-heavy",
      note: "Early armor and stasis priority when physical burst can punish her engage or waveclear timings.",
    },
    "ap-heavy": {
      itemIds: [3111, 2503, 3102, 3137],
      key: "ap-heavy",
      note: "Magic-resist boot and spell-shield path for safer setup into heavy AP poke or pick tools.",
    },
  },
  yasuo: {
    build: {
      itemIds: [3006, 3153, 3031, 6673],
      key: "build",
      note: "Core Yasuo curve for attack speed, dueling sustain, and crit damage once he can repeatedly contest the wave.",
    },
    "alternative-build": {
      itemIds: [3006, 6672, 3046, 3031],
      key: "alternative-build",
      note: "Higher DPS option when Yasuo can safely keep hitting and does not need early defensive insurance.",
    },
    "ad-heavy": {
      itemIds: [3047, 3153, 6333, 3143],
      key: "ad-heavy",
      note: "Armor-focused route when the enemy team can punish Yasuo before he finishes extended trades.",
    },
    "ap-heavy": {
      itemIds: [3111, 3153, 3091, 3156],
      key: "ap-heavy",
      note: "Magic-resist route for playing into heavy AP lanes, crowd control, or burst windows.",
    },
  },
};

export function getCounterPickBuildGuide(championId: string, championName?: string) {
  return (
    counterPickBuildGuides[normalizeCounterPickBuildLookupKey(championId)] ??
    (championName
      ? counterPickBuildGuides[normalizeCounterPickBuildLookupKey(championName)]
      : null) ??
    null
  );
}

function normalizeCounterPickBuildLookupKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}
