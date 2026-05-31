import type { LeagueChampionKnowledgeProfile } from "./types";
import { ahriCombatProfile } from "./ahri";
import { akaliCombatProfile } from "./akali";
import { akshanCombatProfile } from "./akshan";
import { dianaCombatProfile } from "./diana";
import { ekkoCombatProfile } from "./ekko";
import { fizzCombatProfile } from "./fizz";
import { hweiCombatProfile } from "./hwei";
import { leblancCombatProfile } from "./leblanc";
import { luxCombatProfile } from "./lux";
import { malzaharCombatProfile } from "./malzahar";
import { oriannaCombatProfile } from "./orianna";
import { sylasCombatProfile } from "./sylas";
import { syndraCombatProfile } from "./syndra";
import { talonCombatProfile } from "./talon";
import { veigarCombatProfile } from "./veigar";
import { vexCombatProfile } from "./vex";
import { viktorCombatProfile } from "./viktor";
import { xerathCombatProfile } from "./xerath";
import { yasuoCombatProfile } from "./yasuo";
import { yoneCombatProfile } from "./yone";
import { zoeCombatProfile } from "./zoe";
import { zedCombatProfile } from "./zed";
import { aniviaCombatProfile } from "./anivia";
import { annieCombatProfile } from "./annie";
import { aurelionSolCombatProfile } from "./aurelion-sol";
import { auroraCombatProfile } from "./aurora";

export type {
  LeagueChampionDangerProfile,
  LeagueChampionDamageType,
  LeagueChampionKnowledgeProfile,
  LeagueChampionLanePlan,
  LeagueChampionMatchupPreferences,
  LeagueChampionMobilityLevel,
  LeagueChampionPowerSpikeProfile,
  LeagueChampionPunishProfile,
  LeagueChampionTradingProfile,
} from "./types";

export { ahriCombatProfile } from "./ahri";
export { akaliCombatProfile } from "./akali";
export { akshanCombatProfile } from "./akshan";
export { dianaCombatProfile } from "./diana";
export { ekkoCombatProfile } from "./ekko";
export { fizzCombatProfile } from "./fizz";
export { hweiCombatProfile } from "./hwei";
export { leblancCombatProfile } from "./leblanc";
export { luxCombatProfile } from "./lux";
export { malzaharCombatProfile } from "./malzahar";
export { oriannaCombatProfile } from "./orianna";
export { sylasCombatProfile } from "./sylas";
export { syndraCombatProfile } from "./syndra";
export { talonCombatProfile } from "./talon";
export { veigarCombatProfile } from "./veigar";
export { vexCombatProfile } from "./vex";
export { viktorCombatProfile } from "./viktor";
export { xerathCombatProfile } from "./xerath";
export { yasuoCombatProfile } from "./yasuo";
export { yoneCombatProfile } from "./yone";
export { zoeCombatProfile } from "./zoe";
export { zedCombatProfile } from "./zed";
export { aniviaCombatProfile } from "./anivia";
export { annieCombatProfile } from "./annie";
export { aurelionSolCombatProfile } from "./aurelion-sol";
export { auroraCombatProfile } from "./aurora";

export const leagueChampionKnowledgeProfiles = {
  Ahri: ahriCombatProfile,
  Akali: akaliCombatProfile,
  Akshan: akshanCombatProfile,
  Diana: dianaCombatProfile,
  Ekko: ekkoCombatProfile,
  Fizz: fizzCombatProfile,
  Hwei: hweiCombatProfile,
  Leblanc: leblancCombatProfile,
  Lux: luxCombatProfile,
  Malzahar: malzaharCombatProfile,
  Orianna: oriannaCombatProfile,
  Sylas: sylasCombatProfile,
  Syndra: syndraCombatProfile,
  Talon: talonCombatProfile,
  Veigar: veigarCombatProfile,
  Vex: vexCombatProfile,
  Viktor: viktorCombatProfile,
  Xerath: xerathCombatProfile,
  Yasuo: yasuoCombatProfile,
  Yone: yoneCombatProfile,
  Zoe: zoeCombatProfile,
  Zed: zedCombatProfile,
  Anivia: aniviaCombatProfile,
  Annie: annieCombatProfile,
  AurelionSol: aurelionSolCombatProfile,
  Aurora: auroraCombatProfile,
} satisfies Record<string, LeagueChampionKnowledgeProfile>;

const championProfilesByLookupKey = new Map<string, LeagueChampionKnowledgeProfile>();

for (const profile of Object.values(leagueChampionKnowledgeProfiles)) {
  championProfilesByLookupKey.set(normalizeChampionLookupKey(profile.id), profile);
  championProfilesByLookupKey.set(normalizeChampionLookupKey(profile.name), profile);
}

export function getChampionCombatProfile(championNameOrId: string) {
  const lookupKey = normalizeChampionLookupKey(championNameOrId);

  return championProfilesByLookupKey.get(lookupKey) ?? null;
}

export const getLeagueChampionKnowledgeProfile = getChampionCombatProfile;

function normalizeChampionLookupKey(value: string) {
  return value.trim().toLowerCase();
}
