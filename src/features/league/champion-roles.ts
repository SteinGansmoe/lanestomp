import type { LeagueChampion } from "./champions";
import { getChampionCombatProfile } from "./champion-knowledge";
import type { LeagueRole } from "./roles";

export type LeagueChampionRoleTier = "off-meta" | "primary" | "secondary" | "unlisted";

type ChampionRoleFilterOptions = {
  includeOffMeta?: boolean;
};

const championRolesByRole = {
  adc: [
    "Aphelios",
    "Ashe",
    "Caitlyn",
    "Draven",
    "Ezreal",
    "Jhin",
    "Jinx",
    "Kaisa",
    "Kalista",
    "KogMaw",
    "Lucian",
    "MissFortune",
    "Nilah",
    "Samira",
    "Sivir",
    "Smolder",
    "Tristana",
    "Twitch",
    "Varus",
    "Vayne",
    "Xayah",
    "Zeri",
  ],
  jungle: [
    "Amumu",
    "Belveth",
    "Briar",
    "Diana",
    "Ekko",
    "Elise",
    "Evelynn",
    "Fiddlesticks",
    "Gragas",
    "Graves",
    "Hecarim",
    "Ivern",
    "JarvanIV",
    "Karthus",
    "Kayn",
    "Khazix",
    "Kindred",
    "LeeSin",
    "Lillia",
    "MasterYi",
    "MonkeyKing",
    "Nidalee",
    "Nocturne",
    "Nunu",
    "Poppy",
    "Rammus",
    "RekSai",
    "Rengar",
    "Sejuani",
    "Shaco",
    "Shyvana",
    "Skarner",
    "Taliyah",
    "Trundle",
    "Udyr",
    "Vi",
    "Viego",
    "Volibear",
    "Warwick",
    "XinZhao",
    "Zac",
  ],
  mid: [
    "Ahri",
    "Akali",
    "Akshan",
    "Anivia",
    "Annie",
    "AurelionSol",
    "Aurora",
    "Azir",
    "Cassiopeia",
    "Corki",
    "Diana",
    "Ekko",
    "Fizz",
    "Galio",
    "Hwei",
    "Irelia",
    "Kassadin",
    "Katarina",
    "Leblanc",
    "Lissandra",
    "Lux",
    "Malzahar",
    "Mel",
    "Naafiri",
    "Neeko",
    "Orianna",
    "Qiyana",
    "Ryze",
    "Sylas",
    "Syndra",
    "Taliyah",
    "Talon",
    "TwistedFate",
    "Veigar",
    "Vex",
    "Viktor",
    "Vladimir",
    "Xerath",
    "Yasuo",
    "Yone",
    "Zed",
    "Ziggs",
    "Zoe",
  ],
  support: [
    "Alistar",
    "Bard",
    "Blitzcrank",
    "Brand",
    "Braum",
    "Janna",
    "Karma",
    "Leona",
    "Lulu",
    "Lux",
    "Maokai",
    "Milio",
    "Morgana",
    "Nami",
    "Nautilus",
    "Neeko",
    "Pyke",
    "Rakan",
    "Rell",
    "Renata",
    "Senna",
    "Seraphine",
    "Sona",
    "Soraka",
    "Swain",
    "TahmKench",
    "Taric",
    "Thresh",
    "Velkoz",
    "Xerath",
    "Yuumi",
    "Zilean",
    "Zyra",
  ],
  top: [
    "Aatrox",
    "Akali",
    "Camille",
    "Chogath",
    "Darius",
    "DrMundo",
    "Fiora",
    "Gangplank",
    "Garen",
    "Gnar",
    "Gragas",
    "Gwen",
    "Heimerdinger",
    "Illaoi",
    "Irelia",
    "Jax",
    "Jayce",
    "Kayle",
    "Kennen",
    "Kled",
    "KSante",
    "Malphite",
    "Mordekaiser",
    "Nasus",
    "Olaf",
    "Ornn",
    "Pantheon",
    "Poppy",
    "Quinn",
    "Renekton",
    "Riven",
    "Rumble",
    "Sett",
    "Shen",
    "Singed",
    "Sion",
    "TahmKench",
    "Teemo",
    "Trundle",
    "Tryndamere",
    "Urgot",
    "Vayne",
    "Vladimir",
    "Volibear",
    "Warwick",
    "Yasuo",
    "Yone",
    "Yorick",
  ],
} satisfies Record<LeagueRole, readonly string[]>;

const championRolesById = new Map<string, LeagueRole[]>();

for (const [role, championIds] of Object.entries(championRolesByRole) as Array<
  [LeagueRole, readonly string[]]
>) {
  for (const championId of championIds) {
    championRolesById.set(championId, [...(championRolesById.get(championId) ?? []), role]);
  }
}

export function getChampionRoleTier(
  champion: Pick<LeagueChampion, "id">,
  role: LeagueRole,
): LeagueChampionRoleTier {
  const profile = getChampionCombatProfile(champion.id);

  if (profile) {
    if (profile.primaryRoles?.includes(role)) {
      return "primary";
    }

    if (profile.secondaryRoles?.includes(role)) {
      return "secondary";
    }

    if (profile.offMetaRoles?.includes(role)) {
      return "off-meta";
    }

    return "unlisted";
  }

  return championRolesById.get(champion.id)?.includes(role) ? "primary" : "unlisted";
}

export function getChampionRoles(champion: Pick<LeagueChampion, "id">) {
  const profile = getChampionCombatProfile(champion.id);

  if (profile) {
    return [
      ...(profile.primaryRoles ?? []),
      ...(profile.secondaryRoles ?? []),
      ...(profile.offMetaRoles ?? []),
    ];
  }

  return championRolesById.get(champion.id) ?? [];
}

export function isChampionInRole(
  champion: Pick<LeagueChampion, "id">,
  role: LeagueRole,
  { includeOffMeta = false }: ChampionRoleFilterOptions = {},
) {
  const tier = getChampionRoleTier(champion, role);

  return tier === "primary" || tier === "secondary" || (includeOffMeta && tier === "off-meta");
}

export function sortChampionsForRole<TChampion extends Pick<LeagueChampion, "id" | "name">>(
  champions: readonly TChampion[],
  role: LeagueRole,
) {
  return [...champions].sort((championA, championB) => {
    const roleDifference =
      getRoleTierSortValue(getChampionRoleTier(championA, role)) -
      getRoleTierSortValue(getChampionRoleTier(championB, role));

    return roleDifference || championA.name.localeCompare(championB.name);
  });
}

function getRoleTierSortValue(tier: LeagueChampionRoleTier) {
  switch (tier) {
    case "primary":
      return 0;
    case "secondary":
      return 1;
    case "off-meta":
      return 2;
    case "unlisted":
      return 3;
  }
}
