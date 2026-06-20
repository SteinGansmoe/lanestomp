export type CounterPickBuildItemId = number;

export type CounterPickBuildPathKey = "ad-heavy" | "alternative-build" | "ap-heavy" | "build";

export type CounterPickBuildPath = {
  itemIds: CounterPickBuildItemId[];
  key: CounterPickBuildPathKey;
  note: string;
};

export type CounterPickBuildGuide = Record<CounterPickBuildPathKey, CounterPickBuildPath>;
export type CounterPickStoredBuildPath = Record<string, unknown>;
export type CounterPickAlternativeBuildSectionKey =
  | "ad-heavy"
  | "alternative-build"
  | "ap-heavy"
  | "behind"
  | "common"
  | "survivability";

export type CounterPickAlternativeBuildSection = {
  description?: string;
  itemIds: CounterPickBuildItemId[];
  key: CounterPickAlternativeBuildSectionKey;
  note: string;
  title: string;
};

export type CounterPickAlternativeBuildSectionsInput = {
  behindBuildPath?: CounterPickStoredBuildPath | null;
  commonBuildPath?: CounterPickStoredBuildPath | null;
  guide?: CounterPickBuildGuide | null;
  survivabilityBuildPath?: CounterPickStoredBuildPath | null;
};

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

export function getCounterPickAlternativeBuildSections({
  behindBuildPath = null,
  commonBuildPath = null,
  guide = null,
  survivabilityBuildPath = null,
}: CounterPickAlternativeBuildSectionsInput): CounterPickAlternativeBuildSection[] {
  const sections = [
    getCounterPickAlternativeBuildSectionFromStoredPath({
      buildPath: commonBuildPath,
      key: "common",
      title: "Against this matchup",
    }),
    getCounterPickAlternativeBuildSectionFromStaticPath({
      buildPath: guide?.["alternative-build"] ?? null,
      key: "alternative-build",
      title: "Flexible alternative",
    }),
    getCounterPickAlternativeBuildSectionFromStaticPath({
      buildPath: guide?.["ad-heavy"] ?? null,
      description:
        "Consider this when facing multiple AD threats, strong physical damage dealers, or heavy auto-attack champions.",
      key: "ad-heavy",
      title: "Against heavy AD",
    }),
    getCounterPickAlternativeBuildSectionFromStaticPath({
      buildPath: guide?.["ap-heavy"] ?? null,
      description:
        "Consider this when facing multiple AP threats, burst mages, or heavy magic damage compositions.",
      key: "ap-heavy",
      title: "Against heavy AP",
    }),
    getCounterPickAlternativeBuildSectionFromStoredPath({
      buildPath: behindBuildPath,
      key: "behind",
      title: "When behind",
    }),
    getCounterPickAlternativeBuildSectionFromStoredPath({
      buildPath: survivabilityBuildPath,
      key: "survivability",
      title: "When early survivability is needed",
    }),
  ].filter((section): section is CounterPickAlternativeBuildSection => Boolean(section));
  const seenItemPaths = new Set<string>();
  const uniqueSections: CounterPickAlternativeBuildSection[] = [];

  for (const section of sections) {
    const itemPathKey = section.itemIds.join(">");

    if (seenItemPaths.has(itemPathKey)) {
      continue;
    }

    seenItemPaths.add(itemPathKey);
    uniqueSections.push(section);
  }

  return uniqueSections;
}

function getCounterPickAlternativeBuildSectionFromStaticPath({
  buildPath,
  description,
  key,
  title,
}: {
  buildPath: CounterPickBuildPath | null;
  description?: string;
  key: CounterPickAlternativeBuildSectionKey;
  title: string;
}) {
  if (!buildPath || buildPath.itemIds.length === 0) {
    return null;
  }

  return {
    description,
    itemIds: buildPath.itemIds,
    key,
    note: buildPath.note,
    title,
  } satisfies CounterPickAlternativeBuildSection;
}

function getCounterPickAlternativeBuildSectionFromStoredPath({
  buildPath,
  key,
  title,
}: {
  buildPath: CounterPickStoredBuildPath | null;
  key: CounterPickAlternativeBuildSectionKey;
  title: string;
}) {
  if (!buildPath) {
    return null;
  }

  const itemIds = getStoredCounterPickBuildItemIds(buildPath);
  const note = getStoredCounterPickBuildNote(buildPath);

  if (itemIds.length === 0) {
    return null;
  }

  return {
    itemIds,
    key,
    note,
    title,
  } satisfies CounterPickAlternativeBuildSection;
}

function getStoredCounterPickBuildItemIds(buildPath: CounterPickStoredBuildPath) {
  const rawItemIds = buildPath.itemIds ?? buildPath.item_ids ?? buildPath.items;

  if (!Array.isArray(rawItemIds)) {
    return [];
  }

  return rawItemIds
    .map((item) => {
      if (typeof item === "number") {
        return item;
      }

      if (typeof item === "string") {
        const parsedItemId = Number.parseInt(item, 10);

        return Number.isFinite(parsedItemId) ? parsedItemId : null;
      }

      if (item && typeof item === "object" && "id" in item) {
        const parsedItemId =
          typeof item.id === "number" ? item.id : Number.parseInt(String(item.id), 10);

        return Number.isFinite(parsedItemId) ? parsedItemId : null;
      }

      return null;
    })
    .filter((itemId): itemId is CounterPickBuildItemId => itemId !== null);
}

function getStoredCounterPickBuildNote(buildPath: CounterPickStoredBuildPath) {
  for (const key of ["note", "description", "reason", "summary"]) {
    const value = buildPath[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function normalizeCounterPickBuildLookupKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}
