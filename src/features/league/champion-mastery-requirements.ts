import type { LeagueChampion } from "./champions";

export type ChampionMasteryRequirementLevel = "high" | "low" | "moderate" | "very_high";

export type ChampionMasteryRequirement = {
  description: readonly string[];
  label: string;
  level: ChampionMasteryRequirementLevel;
  shortLabel: string;
};

type ChampionMasteryRequirementCopy = Omit<ChampionMasteryRequirement, "level">;

const fallbackChampionMasteryRequirementLevel: ChampionMasteryRequirementLevel = "moderate";

export const championMasteryRequirementCopy = {
  low: {
    description: [
      "This champion is relatively easy to pick up and can usually provide value without extensive prior experience.",
      "You should still understand the basic matchup plan, but this is generally a safe counter pick even if you have not played many games on the champion.",
    ],
    label: "Low",
    shortLabel: "Low",
  },
  moderate: {
    description: [
      "This champion can perform well in the matchup, but some familiarity is recommended.",
      "A basic understanding of the champion's trading patterns, ability timings, and power spikes will help you get full value from the counter pick.",
    ],
    label: "Moderate",
    shortLabel: "Moderate",
  },
  high: {
    description: [
      "This champion can perform well in the matchup, but requires strong mechanical execution and matchup knowledge.",
      "If you are not already comfortable on the champion, consider choosing another counter from the list. First-timing a high-mastery champion can easily outweigh the matchup advantage.",
    ],
    label: "High",
    shortLabel: "High",
  },
  very_high: {
    description: [
      "This champion can be a strong counter in experienced hands, but requires extensive mechanical familiarity, matchup knowledge, and consistent execution.",
      "This pick is best suited to players who already have meaningful experience on the champion. First-timing it in ranked is not recommended, as champion difficulty can easily outweigh the matchup advantage.",
    ],
    label: "Very High",
    shortLabel: "Very High",
  },
} as const satisfies Record<ChampionMasteryRequirementLevel, ChampionMasteryRequirementCopy>;

const championMasteryRequirementIdsByLevel = {
  low: [
    "Amumu",
    "Annie",
    "Ashe",
    "ChoGath",
    "DrMundo",
    "Garen",
    "Malphite",
    "MissFortune",
    "Morgana",
    "Nasus",
    "Nunu",
    "Rammus",
    "Sona",
    "Soraka",
    "Trundle",
    "Warwick",
    "Yuumi",
  ],
  moderate: [
    "Aatrox",
    "Ahri",
    "Akshan",
    "Alistar",
    "Anivia",
    "AurelionSol",
    "Blitzcrank",
    "Brand",
    "Braum",
    "Briar",
    "Caitlyn",
    "Corki",
    "Darius",
    "Diana",
    "Ekko",
    "Fiddlesticks",
    "Galio",
    "Graves",
    "Illaoi",
    "Ivern",
    "Janna",
    "JarvanIV",
    "Jhin",
    "Jinx",
    "Karma",
    "Karthus",
    "Kayle",
    "KogMaw",
    "Leona",
    "Lissandra",
    "Lucian",
    "Lulu",
    "Lux",
    "Malzahar",
    "Maokai",
    "MasterYi",
    "Mel",
    "Milio",
    "Mordekaiser",
    "Nami",
    "Nautilus",
    "Neeko",
    "Nocturne",
    "Olaf",
    "Orianna",
    "Ornn",
    "Pantheon",
    "Poppy",
    "Quinn",
    "Rakan",
    "RekSai",
    "Rell",
    "Renata",
    "Renekton",
    "Sejuani",
    "Seraphine",
    "Sett",
    "Shyvana",
    "Sion",
    "Sivir",
    "Skarner",
    "Smolder",
    "Swain",
    "Syndra",
    "TahmKench",
    "Taric",
    "Teemo",
    "Tristana",
    "Tryndamere",
    "TwistedFate",
    "Udyr",
    "Urgot",
    "Varus",
    "Veigar",
    "Velkoz",
    "Vex",
    "Vi",
    "Viktor",
    "Volibear",
    "Xayah",
    "XinZhao",
    "Yorick",
    "Zac",
    "Ziggs",
    "Zilean",
    "Zyra",
  ],
  high: [
    "Akali",
    "Aurora",
    "Bard",
    "Belveth",
    "Camille",
    "Cassiopeia",
    "Draven",
    "Elise",
    "Evelynn",
    "Ezreal",
    "Fiora",
    "Fizz",
    "Gnar",
    "Gragas",
    "Gwen",
    "Hecarim",
    "Heimerdinger",
    "Jax",
    "Jayce",
    "Kaisa",
    "Kassadin",
    "Katarina",
    "Kayn",
    "Kennen",
    "Khazix",
    "Kindred",
    "Kled",
    "Leblanc",
    "LeeSin",
    "Lillia",
    "Naafiri",
    "Nidalee",
    "Nilah",
    "Pyke",
    "Riven",
    "Rumble",
    "Samira",
    "Senna",
    "Shaco",
    "Shen",
    "Singed",
    "Sylas",
    "Taliyah",
    "Talon",
    "Thresh",
    "Twitch",
    "Vayne",
    "Viego",
    "Vladimir",
    "MonkeyKing",
    "Xerath",
    "Yasuo",
    "Yone",
    "Zed",
    "Zeri",
    "Zoe",
  ],
  very_high: [
    "Ambessa",
    "Aphelios",
    "Azir",
    "Gangplank",
    "Hwei",
    "Irelia",
    "Kalista",
    "KSante",
    "Qiyana",
    "Rengar",
  ],
} as const satisfies Record<ChampionMasteryRequirementLevel, readonly string[]>;

const championMasteryAliases = {
  nunuwillump: "Nunu",
  wukong: "MonkeyKing",
} as const satisfies Record<string, string>;

const championMasteryRequirementLevelByLookupKey = new Map<
  string,
  ChampionMasteryRequirementLevel
>();

for (const [level, championIds] of Object.entries(championMasteryRequirementIdsByLevel) as Array<
  [ChampionMasteryRequirementLevel, readonly string[]]
>) {
  for (const championId of championIds) {
    championMasteryRequirementLevelByLookupKey.set(normalizeChampionMasteryKey(championId), level);
  }
}

for (const [alias, championId] of Object.entries(championMasteryAliases)) {
  const level = championMasteryRequirementLevelByLookupKey.get(
    normalizeChampionMasteryKey(championId),
  );

  if (level) {
    championMasteryRequirementLevelByLookupKey.set(alias, level);
  }
}

export function getChampionMasteryRequirement(
  champion: string | Pick<LeagueChampion, "id" | "name" | "riot_data_key"> | null | undefined,
): ChampionMasteryRequirement {
  const level = getChampionMasteryRequirementLevel(champion);
  const copy = championMasteryRequirementCopy[level];

  return {
    ...copy,
    level,
  };
}

export function getChampionMasteryRequirementLevel(
  champion: string | Pick<LeagueChampion, "id" | "name" | "riot_data_key"> | null | undefined,
): ChampionMasteryRequirementLevel {
  const lookupValues =
    typeof champion === "string"
      ? [champion]
      : [champion?.id ?? "", champion?.riot_data_key ?? "", champion?.name ?? ""];

  for (const value of lookupValues) {
    const level = championMasteryRequirementLevelByLookupKey.get(
      normalizeChampionMasteryKey(value),
    );

    if (level) {
      return level;
    }
  }

  return fallbackChampionMasteryRequirementLevel;
}

export function normalizeChampionMasteryKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}
