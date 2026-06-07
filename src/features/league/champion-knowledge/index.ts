import type { LeagueChampionKnowledgeProfile } from "./types";
import { aatroxCombatProfile } from "./aatrox";
import { ahriCombatProfile } from "./ahri";
import { akaliCombatProfile } from "./akali";
import { akshanCombatProfile } from "./akshan";
import { apheliosCombatProfile } from "./aphelios";
import { asheCombatProfile } from "./ashe";
import { azirCombatProfile } from "./azir";
import { caitlynCombatProfile } from "./caitlyn";
import { cassiopeiaCombatProfile } from "./cassiopeia";
import { corkiCombatProfile } from "./corki";
import { dianaCombatProfile } from "./diana";
import { dravenCombatProfile } from "./draven";
import { ekkoCombatProfile } from "./ekko";
import { ezrealCombatProfile } from "./ezreal";
import { fizzCombatProfile } from "./fizz";
import { galioCombatProfile } from "./galio";
import { hweiCombatProfile } from "./hwei";
import { ireliaCombatProfile } from "./irelia";
import { jhinCombatProfile } from "./jhin";
import { jinxCombatProfile } from "./jinx";
import { kalistaCombatProfile } from "./kalista";
import { kaisaCombatProfile } from "./kaisa";
import { kogMawCombatProfile } from "./kogmaw";
import { kassadinCombatProfile } from "./kassadin";
import { katarinaCombatProfile } from "./katarina";
import { leblancCombatProfile } from "./leblanc";
import { lissandraCombatProfile } from "./lissandra";
import { lucianCombatProfile } from "./lucian";
import { luxCombatProfile } from "./lux";
import { malzaharCombatProfile } from "./malzahar";
import { melCombatProfile } from "./mel";
import { missFortuneCombatProfile } from "./miss-fortune";
import { naafiriCombatProfile } from "./naafiri";
import { nilahCombatProfile } from "./nilah";
import { neekoCombatProfile } from "./neeko";
import { oriannaCombatProfile } from "./orianna";
import { qiyanaCombatProfile } from "./qiyana";
import { ryzeCombatProfile } from "./ryze";
import { samiraCombatProfile } from "./samira";
import { sivirCombatProfile } from "./sivir";
import { smolderCombatProfile } from "./smolder";
import { sylasCombatProfile } from "./sylas";
import { syndraCombatProfile } from "./syndra";
import { taliyahCombatProfile } from "./taliyah";
import { talonCombatProfile } from "./talon";
import { twistedFateCombatProfile } from "./twisted-fate";
import { twitchCombatProfile } from "./twitch";
import { tristanaCombatProfile } from "./tristana";
import { veigarCombatProfile } from "./veigar";
import { varusCombatProfile } from "./varus";
import { vexCombatProfile } from "./vex";
import { viktorCombatProfile } from "./viktor";
import { vladimirCombatProfile } from "./vladimir";
import { xerathCombatProfile } from "./xerath";
import { xayahCombatProfile } from "./xayah";
import { yasuoCombatProfile } from "./yasuo";
import { yoneCombatProfile } from "./yone";
import { ziggsCombatProfile } from "./ziggs";
import { zoeCombatProfile } from "./zoe";
import { zedCombatProfile } from "./zed";
import { aniviaCombatProfile } from "./anivia";
import { annieCombatProfile } from "./annie";
import { aurelionSolCombatProfile } from "./aurelion-sol";
import { auroraCombatProfile } from "./aurora";
import { camilleCombatProfile } from "./camille";
import { chogathCombatProfile } from "./chogath";
import { dariusCombatProfile } from "./darius";
import { drMundoCombatProfile } from "./dr-mundo";
import { fioraCombatProfile } from "./fiora";
import { gangplankCombatProfile } from "./gangplank";
import { garenCombatProfile } from "./garen";
import { gnarCombatProfile } from "./gnar";
import { gragasCombatProfile } from "./gragas";
import { gwenCombatProfile } from "./gwen";
import { heimerdingerCombatProfile } from "./heimerdinger";
import { illaoiCombatProfile } from "./illaoi";
import { jayceCombatProfile } from "./jayce";
import { jaxCombatProfile } from "./jax";
import { kayleCombatProfile } from "./kayle";
import { kennenCombatProfile } from "./kennen";
import { kledCombatProfile } from "./kled";
import { ksanteCombatProfile } from "./ksante";
import { malphiteCombatProfile } from "./malphite";
import { mordekaiserCombatProfile } from "./mordekaiser";
import { nasusCombatProfile } from "./nasus";
import { olafCombatProfile } from "./olaf";
import { ornnCombatProfile } from "./ornn";
import { pantheonCombatProfile } from "./pantheon";
import { poppyCombatProfile } from "./poppy";
import { quinnCombatProfile } from "./quinn";
import { renektonCombatProfile } from "./renekton";
import { rivenCombatProfile } from "./riven";
import { rumbleCombatProfile } from "./rumble";
import { settCombatProfile } from "./sett";
import { shenCombatProfile } from "./shen";
import { singedCombatProfile } from "./singed";
import { sionCombatProfile } from "./sion";
import { tahmKenchCombatProfile } from "./tahm-kench";
import { teemoCombatProfile } from "./teemo";
import { trundleCombatProfile } from "./trundle";
import { tryndamereCombatProfile } from "./tryndamere";
import { urgotCombatProfile } from "./urgot";
import { vayneCombatProfile } from "./vayne";
import { volibearCombatProfile } from "./volibear";
import { warwickCombatProfile } from "./warwick";
import { yorickCombatProfile } from "./yorick";
import { zeriCombatProfile } from "./zeri";
import {
  belvethCombatProfile,
  jarvanIvCombatProfile,
  karthusCombatProfile,
  khazixCombatProfile,
  leeSinCombatProfile,
  masterYiCombatProfile,
  nunuCombatProfile,
  remainingJungleCombatProfiles,
  sejuaniCombatProfile,
  viegoCombatProfile,
  xinZhaoCombatProfile,
} from "./jungle";

export type {
  LeagueChampionAbilityKey,
  LeagueChampionAbilityMap,
  LeagueChampionDangerProfile,
  LeagueChampionDamageType,
  LeagueChampionJungleProfile,
  LeagueChampionJungleProfileCategory,
  LeagueChampionJungleProfileLevel,
  LeagueChampionKnowledgeProfile,
  LeagueChampionLaneIdentity,
  LeagueChampionLaneIdentityLevel,
  LeagueChampionLanePlan,
  LeagueChampionMasteryDifficulty,
  LeagueChampionMatchupPreferences,
  LeagueChampionMobilityLevel,
  LeagueChampionPowerSpike,
  LeagueChampionPowerSpikeProfile,
  LeagueChampionProfileQuality,
  LeagueChampionPunishProfile,
  LeagueChampionStrategicGameLength,
  LeagueChampionStrategicIdentity,
  LeagueChampionStrategicLaneGoal,
  LeagueChampionStrategicScalingProfile,
  LeagueChampionSupportSynergy,
  LeagueChampionTradingProfile,
} from "./types";

export { ahriCombatProfile } from "./ahri";
export { aatroxCombatProfile } from "./aatrox";
export { akaliCombatProfile } from "./akali";
export { akshanCombatProfile } from "./akshan";
export { apheliosCombatProfile } from "./aphelios";
export { asheCombatProfile } from "./ashe";
export { azirCombatProfile } from "./azir";
export { caitlynCombatProfile } from "./caitlyn";
export { cassiopeiaCombatProfile } from "./cassiopeia";
export { corkiCombatProfile } from "./corki";
export { dianaCombatProfile } from "./diana";
export { dravenCombatProfile } from "./draven";
export { ekkoCombatProfile } from "./ekko";
export { ezrealCombatProfile } from "./ezreal";
export { fizzCombatProfile } from "./fizz";
export { galioCombatProfile } from "./galio";
export { hweiCombatProfile } from "./hwei";
export { ireliaCombatProfile } from "./irelia";
export { jhinCombatProfile } from "./jhin";
export { jinxCombatProfile } from "./jinx";
export { kalistaCombatProfile } from "./kalista";
export { kaisaCombatProfile } from "./kaisa";
export { kogMawCombatProfile } from "./kogmaw";
export { kassadinCombatProfile } from "./kassadin";
export { katarinaCombatProfile } from "./katarina";
export { leblancCombatProfile } from "./leblanc";
export { lissandraCombatProfile } from "./lissandra";
export { lucianCombatProfile } from "./lucian";
export { luxCombatProfile } from "./lux";
export { malzaharCombatProfile } from "./malzahar";
export { melCombatProfile } from "./mel";
export { missFortuneCombatProfile } from "./miss-fortune";
export { naafiriCombatProfile } from "./naafiri";
export { nilahCombatProfile } from "./nilah";
export { neekoCombatProfile } from "./neeko";
export { oriannaCombatProfile } from "./orianna";
export { qiyanaCombatProfile } from "./qiyana";
export { ryzeCombatProfile } from "./ryze";
export { samiraCombatProfile } from "./samira";
export { sivirCombatProfile } from "./sivir";
export { smolderCombatProfile } from "./smolder";
export { sylasCombatProfile } from "./sylas";
export { syndraCombatProfile } from "./syndra";
export { taliyahCombatProfile } from "./taliyah";
export { talonCombatProfile } from "./talon";
export { twistedFateCombatProfile } from "./twisted-fate";
export { twitchCombatProfile } from "./twitch";
export { tristanaCombatProfile } from "./tristana";
export { veigarCombatProfile } from "./veigar";
export { varusCombatProfile } from "./varus";
export { vexCombatProfile } from "./vex";
export { viktorCombatProfile } from "./viktor";
export { vladimirCombatProfile } from "./vladimir";
export { xerathCombatProfile } from "./xerath";
export { xayahCombatProfile } from "./xayah";
export { yasuoCombatProfile } from "./yasuo";
export { yoneCombatProfile } from "./yone";
export { ziggsCombatProfile } from "./ziggs";
export { zoeCombatProfile } from "./zoe";
export { zedCombatProfile } from "./zed";
export { aniviaCombatProfile } from "./anivia";
export { annieCombatProfile } from "./annie";
export { aurelionSolCombatProfile } from "./aurelion-sol";
export { auroraCombatProfile } from "./aurora";
export { camilleCombatProfile } from "./camille";
export { chogathCombatProfile } from "./chogath";
export { dariusCombatProfile } from "./darius";
export { drMundoCombatProfile } from "./dr-mundo";
export { fioraCombatProfile } from "./fiora";
export { gangplankCombatProfile } from "./gangplank";
export { garenCombatProfile } from "./garen";
export { gnarCombatProfile } from "./gnar";
export { gragasCombatProfile } from "./gragas";
export { gwenCombatProfile } from "./gwen";
export { heimerdingerCombatProfile } from "./heimerdinger";
export { illaoiCombatProfile } from "./illaoi";
export { jayceCombatProfile } from "./jayce";
export { jaxCombatProfile } from "./jax";
export { kayleCombatProfile } from "./kayle";
export { kennenCombatProfile } from "./kennen";
export { kledCombatProfile } from "./kled";
export { ksanteCombatProfile } from "./ksante";
export { malphiteCombatProfile } from "./malphite";
export { mordekaiserCombatProfile } from "./mordekaiser";
export { nasusCombatProfile } from "./nasus";
export { olafCombatProfile } from "./olaf";
export { ornnCombatProfile } from "./ornn";
export { pantheonCombatProfile } from "./pantheon";
export { poppyCombatProfile } from "./poppy";
export { quinnCombatProfile } from "./quinn";
export { renektonCombatProfile } from "./renekton";
export { rivenCombatProfile } from "./riven";
export { rumbleCombatProfile } from "./rumble";
export { settCombatProfile } from "./sett";
export { shenCombatProfile } from "./shen";
export { singedCombatProfile } from "./singed";
export { sionCombatProfile } from "./sion";
export { tahmKenchCombatProfile } from "./tahm-kench";
export { teemoCombatProfile } from "./teemo";
export { trundleCombatProfile } from "./trundle";
export { tryndamereCombatProfile } from "./tryndamere";
export { urgotCombatProfile } from "./urgot";
export { vayneCombatProfile } from "./vayne";
export { volibearCombatProfile } from "./volibear";
export { warwickCombatProfile } from "./warwick";
export { yorickCombatProfile } from "./yorick";
export { zeriCombatProfile } from "./zeri";
export {
  belvethCombatProfile,
  jarvanIvCombatProfile,
  karthusCombatProfile,
  khazixCombatProfile,
  leeSinCombatProfile,
  masterYiCombatProfile,
  nunuCombatProfile,
  remainingJungleCombatProfiles,
  sejuaniCombatProfile,
  viegoCombatProfile,
  xinZhaoCombatProfile,
} from "./jungle";

const dianaCombatProfileWithJungle = {
  ...dianaCombatProfile,
  jungleProfile: remainingJungleCombatProfiles.Diana.jungleProfile,
} satisfies LeagueChampionKnowledgeProfile;
const ekkoCombatProfileWithJungle = {
  ...ekkoCombatProfile,
  jungleProfile: remainingJungleCombatProfiles.Ekko.jungleProfile,
} satisfies LeagueChampionKnowledgeProfile;
const gragasCombatProfileWithJungle = {
  ...gragasCombatProfile,
  jungleProfile: remainingJungleCombatProfiles.Gragas.jungleProfile,
} satisfies LeagueChampionKnowledgeProfile;
const poppyCombatProfileWithJungle = {
  ...poppyCombatProfile,
  jungleProfile: remainingJungleCombatProfiles.Poppy.jungleProfile,
} satisfies LeagueChampionKnowledgeProfile;
const taliyahCombatProfileWithJungle = {
  ...taliyahCombatProfile,
  jungleProfile: remainingJungleCombatProfiles.Taliyah.jungleProfile,
} satisfies LeagueChampionKnowledgeProfile;
const trundleCombatProfileWithJungle = {
  ...trundleCombatProfile,
  jungleProfile: remainingJungleCombatProfiles.Trundle.jungleProfile,
} satisfies LeagueChampionKnowledgeProfile;
const volibearCombatProfileWithJungle = {
  ...volibearCombatProfile,
  jungleProfile: remainingJungleCombatProfiles.Volibear.jungleProfile,
} satisfies LeagueChampionKnowledgeProfile;
const warwickCombatProfileWithJungle = {
  ...warwickCombatProfile,
  jungleProfile: remainingJungleCombatProfiles.Warwick.jungleProfile,
} satisfies LeagueChampionKnowledgeProfile;

export const leagueChampionKnowledgeProfiles = {
  ...remainingJungleCombatProfiles,
  Aatrox: aatroxCombatProfile,
  Ahri: ahriCombatProfile,
  Akali: akaliCombatProfile,
  Akshan: akshanCombatProfile,
  Aphelios: apheliosCombatProfile,
  Ashe: asheCombatProfile,
  Azir: azirCombatProfile,
  Caitlyn: caitlynCombatProfile,
  Cassiopeia: cassiopeiaCombatProfile,
  Corki: corkiCombatProfile,
  Diana: dianaCombatProfileWithJungle,
  Draven: dravenCombatProfile,
  Ekko: ekkoCombatProfileWithJungle,
  Ezreal: ezrealCombatProfile,
  Fizz: fizzCombatProfile,
  Galio: galioCombatProfile,
  Hwei: hweiCombatProfile,
  Irelia: ireliaCombatProfile,
  Jhin: jhinCombatProfile,
  Jinx: jinxCombatProfile,
  Kalista: kalistaCombatProfile,
  Kaisa: kaisaCombatProfile,
  KogMaw: kogMawCombatProfile,
  Kassadin: kassadinCombatProfile,
  Katarina: katarinaCombatProfile,
  Leblanc: leblancCombatProfile,
  Lissandra: lissandraCombatProfile,
  Lucian: lucianCombatProfile,
  Lux: luxCombatProfile,
  Malzahar: malzaharCombatProfile,
  Mel: melCombatProfile,
  MissFortune: missFortuneCombatProfile,
  Naafiri: naafiriCombatProfile,
  Nilah: nilahCombatProfile,
  Neeko: neekoCombatProfile,
  Orianna: oriannaCombatProfile,
  Qiyana: qiyanaCombatProfile,
  Ryze: ryzeCombatProfile,
  Samira: samiraCombatProfile,
  Sivir: sivirCombatProfile,
  Smolder: smolderCombatProfile,
  Sylas: sylasCombatProfile,
  Syndra: syndraCombatProfile,
  Taliyah: taliyahCombatProfileWithJungle,
  Talon: talonCombatProfile,
  TwistedFate: twistedFateCombatProfile,
  Veigar: veigarCombatProfile,
  Vex: vexCombatProfile,
  Viktor: viktorCombatProfile,
  Vladimir: vladimirCombatProfile,
  Xerath: xerathCombatProfile,
  Yasuo: yasuoCombatProfile,
  Yone: yoneCombatProfile,
  Ziggs: ziggsCombatProfile,
  Zoe: zoeCombatProfile,
  Zed: zedCombatProfile,
  Anivia: aniviaCombatProfile,
  Annie: annieCombatProfile,
  AurelionSol: aurelionSolCombatProfile,
  Aurora: auroraCombatProfile,
  Camille: camilleCombatProfile,
  Chogath: chogathCombatProfile,
  Darius: dariusCombatProfile,
  DrMundo: drMundoCombatProfile,
  Fiora: fioraCombatProfile,
  Gangplank: gangplankCombatProfile,
  Garen: garenCombatProfile,
  Gnar: gnarCombatProfile,
  Gragas: gragasCombatProfileWithJungle,
  Gwen: gwenCombatProfile,
  Heimerdinger: heimerdingerCombatProfile,
  Illaoi: illaoiCombatProfile,
  Jayce: jayceCombatProfile,
  Jax: jaxCombatProfile,
  Kayle: kayleCombatProfile,
  Kennen: kennenCombatProfile,
  Kled: kledCombatProfile,
  KSante: ksanteCombatProfile,
  Malphite: malphiteCombatProfile,
  Mordekaiser: mordekaiserCombatProfile,
  Nasus: nasusCombatProfile,
  Olaf: olafCombatProfile,
  Ornn: ornnCombatProfile,
  Pantheon: pantheonCombatProfile,
  Poppy: poppyCombatProfileWithJungle,
  Quinn: quinnCombatProfile,
  Renekton: renektonCombatProfile,
  Riven: rivenCombatProfile,
  Rumble: rumbleCombatProfile,
  Sett: settCombatProfile,
  Shen: shenCombatProfile,
  Singed: singedCombatProfile,
  Sion: sionCombatProfile,
  TahmKench: tahmKenchCombatProfile,
  Teemo: teemoCombatProfile,
  Trundle: trundleCombatProfileWithJungle,
  Tristana: tristanaCombatProfile,
  Twitch: twitchCombatProfile,
  Tryndamere: tryndamereCombatProfile,
  Urgot: urgotCombatProfile,
  Vayne: vayneCombatProfile,
  Varus: varusCombatProfile,
  Volibear: volibearCombatProfileWithJungle,
  Warwick: warwickCombatProfileWithJungle,
  Xayah: xayahCombatProfile,
  Zeri: zeriCombatProfile,
  Yorick: yorickCombatProfile,
  Belveth: belvethCombatProfile,
  JarvanIV: jarvanIvCombatProfile,
  Karthus: karthusCombatProfile,
  Khazix: khazixCombatProfile,
  LeeSin: leeSinCombatProfile,
  MasterYi: masterYiCombatProfile,
  Nunu: nunuCombatProfile,
  Sejuani: sejuaniCombatProfile,
  Viego: viegoCombatProfile,
  XinZhao: xinZhaoCombatProfile,
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
