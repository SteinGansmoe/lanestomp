import type {
  LeagueChampionKnowledgeProfile,
  LeagueChampionJungleProfileCategory,
  LeagueChampionPowerSpike,
} from "./champion-knowledge/types";

export type LeagueRole = "mid" | "top" | "jungle" | "adc" | "support";

export const matchupDraftSectionKeys = [
  "overview",
  "early_game",
  "trading_pattern",
  "power_spikes",
  "danger_windows",
  "win_conditions",
] as const;

export type MatchupDraftSectionKey = (typeof matchupDraftSectionKeys)[number];

export type MatchupDraftSections = Record<MatchupDraftSectionKey, string>;

export const matchupDraftSectionLabels = {
  danger_windows: "Danger windows",
  early_game: "Early game",
  overview: "Overview",
  power_spikes: "Power spikes",
  trading_pattern: "Trading pattern",
  win_conditions: "Win conditions",
} as const satisfies Record<MatchupDraftSectionKey, string>;

export function getMatchupDraftSectionLabel(
  sectionKey: MatchupDraftSectionKey,
  role?: LeagueRole | null,
) {
  if (role === "jungle" && sectionKey === "trading_pattern") {
    return "Jungle Plan";
  }

  return matchupDraftSectionLabels[sectionKey];
}

export const matchupDraftSchema = {
  type: "object",
  additionalProperties: false,
  properties: Object.fromEntries(
    matchupDraftSectionKeys.map((key) => [
      key,
      {
        type: "string",
      },
    ]),
  ),
  required: matchupDraftSectionKeys,
};

export function createMatchupDraftSchema(
  sectionKeys: readonly MatchupDraftSectionKey[] = matchupDraftSectionKeys,
) {
  return {
    type: "object",
    additionalProperties: false,
    properties: Object.fromEntries(
      sectionKeys.map((key) => [
        key,
        {
          type: "string",
        },
      ]),
    ),
    required: sectionKeys,
  };
}

export type LeagueMatchupDraftPromptInput = {
  adminNotes: string | null;
  enemyChampionProfile?: LeagueChampionKnowledgeProfile | null;
  enemyChampionName: string;
  existingSections?: Partial<MatchupDraftSections> | null;
  playerChampionProfile?: LeagueChampionKnowledgeProfile | null;
  playerChampionName: string;
  role: LeagueRole;
  targetSection?: MatchupDraftSectionKey | null;
};

export type LeagueMatchupDraftPrompt = {
  systemPrompt: string;
  userPrompt: string;
};

type SupportArchetype = "engage" | "enchanter" | "hook" | "hybrid" | "poke" | "roaming";

const leagueTerminologyRules = [
  "League Terminology Rules:",
  "- Use terms experienced League players use: free farm, CS, lane priority, wave control, crash wave, freeze, slow push, trade window, cooldown window, all-in, poke, spacing, punish, overextend, power spike, deny farm, and force off the wave.",
  "- Avoid AI-sounding phrases such as calm farming phase, calm laning phase, comfortable lane, safe farming environment, peaceful lane, relaxed laning, farming safely, or farm safely.",
  "- Replace deny a calm farming phase with deny free farm, punish CS attempts, force the opponent off the wave, or contest last hits.",
  "- Replace control lane tempo with lane priority, wave control, crash timing, reset timing, or roam timer when that is the actual gameplay idea.",
  "- Prefer exact lane actions over generic comfort language: crash the wave, hold a freeze, thin the wave, punish cooldowns, or step up when the opponent overextends.",
].join("\n");

const supportTerminologyRules = [
  "Support Terminology Rules:",
  "- Use support and bot-lane terms experienced League players use: ADC access, enemy ADC access denial, engage angle, hook angle, brush control, lane space, lane priority, wave crash, roam timer, river vision, vision line, peel window, follow-up window, all-in threat, disengage, reset timing, dragon setup, objective setup, and teamfight entry.",
  "- Treat wave state as context for ADC safety, engage access, roam timing, or objective setup.",
  "- Describe support decisions through access, protection, pressure, vision, roams, peel, and follow-up.",
  "- Avoid solo-lane economy framing for supports; supports create space and timers instead of playing like lane carries.",
].join("\n");

const writingStyleRules = [
  "Writing Style Rules:",
  "- Write like a high-ELO League coach giving champion-select advice.",
  "- Use authentic League terminology and avoid generic advice.",
  "- Write directly to the player: use you want to, you should, look to, hold, avoid, punish, thin the wave, do not trade when, or your goal is.",
  "- Avoid third-person champion phrasing such as Ahri wants to, Ahri should, Ahri needs to, the champion wants to, or the player should.",
  "- Prefer direct coaching like In this matchup, you want to keep the wave pushed so you can punish weak last-hitting under tower.",
  "- Avoid vague statements; name the cooldown, wave state, range edge, CS timing, or position mistake that creates the play.",
  "- Keep bullets short enough to scan in champion select: one decision, one timing, one matchup reason.",
  "- Prefer compact calls like Hold your dash until the enemy engage tool is down over long explanations.",
  "- Explain execution only when it changes the action: where to hold the wave, when to step forward, what to punish, or when to back off.",
  "- Do not say apply pressure, control the lane, play safe, or scale for free unless the bullet explains the concrete action that makes it true.",
  "- Write bullets as matchup guidance, not commands to a content writer.",
  "- Avoid writer-command openings such as Review, Analyze, List only, Keep broad notes, Re-check, or Instruction.",
  "- Prefer guide-style openings such as the matchup favors, this lane turns on, the first clear matters because, when the enemy controls river, or the player champion can punish.",
  "- Make bullets direct and practical, like advice from a player who understands the matchup.",
].join("\n");

const supportWritingStyleRules = [
  "Support Writing Style Rules:",
  "- Write like a high-ELO support coach giving champion-select advice.",
  "- Use authentic support terminology and avoid generic advice.",
  "- Write directly to the player: use you want to, you should, look to, hold, avoid, punish, deny brush, peel, crash with your ADC, or roam after the wave crashes.",
  "- Avoid third-person champion phrasing such as Lulu wants to, Thresh should, the champion needs to, or the player should.",
  "- Name the engage cooldown, hook angle, brush state, wave state, roam timer, vision line, peel cooldown, ADC follow-up, or position mistake that creates the play.",
  "- Keep bullets short enough to scan in champion select: one decision, one timing, one matchup reason.",
  "- Explain execution only when it changes the action: where to stand, when to hold peel, when to deny brush, when to roam, or when to back off.",
  "- Write bullets as matchup guidance, not commands to a content writer.",
  "- Avoid writer-command openings such as Review, Analyze, List only, Keep broad notes, Re-check, or Instruction.",
  "- Make bullets direct and practical, like advice from a support player who understands the matchup.",
].join("\n");

const junglePlanRules = [
  "Jungle Plan Rules:",
  "- For jungle matchups, the trading_pattern JSON key is displayed as Jungle Plan.",
  "- Jungle Plan must answer: what should this jungler try to do on the map?",
  "- Focus on pathing strategy, first clear goals, Scuttle contest conditions, river control, invade opportunities, counter-jungling, counter-gank timing, objective setup, dragon, Void Grubs, Rift Herald, tempo management, scaling denial, and lane priority requirements before invading or contesting.",
  "- Each Jungle Plan bullet should name a map action plus the condition that makes it correct.",
  "- Avoid writing Jungle Plan as duel instructions only, cooldown trading advice, lane-style spacing advice, or generic engage when cooldowns are down advice.",
  "- Do not use the phrases short trades, trading patterns, trade windows, use spacing, force extended fights, or engage when cooldowns are down in Jungle Plan.",
  "- Good Jungle Plan examples: Invade Karthus during his first clears and force him off camps before level 6.",
  "- Good Jungle Plan examples: Fight for first Scuttle only when nearby lanes can move first.",
  "- Good Jungle Plan examples: Track Jarvan IV's early pathing and be ready to counter-gank his first lane pressure.",
  "- Good Jungle Plan examples: Prioritize early dragon and objective control, then use vision to force Kha'Zix into team-based fights instead of isolated picks.",
].join("\n");

const richTextTokenRules = [
  "Ability and Item Token Rules:",
  "- When mentioning champion abilities, prefer the rich text token format {{ability:ChampionId:AbilityKey}} when it makes the advice clearer.",
  "- Valid ability keys are Q, W, E, R, and Passive. Examples: {{ability:Ahri:E}}, {{ability:Fizz:E}}, {{ability:Vex:W}}, {{ability:Yone:R}}, {{ability:Malzahar:Passive}}.",
  "- Use canonical champion ids from the profile name/id context when writing ability tokens.",
  "- Do not force ability tokens into every sentence; use them for important cooldowns, all-in triggers, defensive responses, or punish windows.",
  "- When recommending a specific item, prefer item token format {{item:ItemId}}. Examples: {{item:3157}} for Zhonya's Hourglass, {{item:3020}} for Sorcerer's Shoes, and {{item:3116}} for Rylai's Crystal Scepter.",
  "- Use item tokens only when the item recommendation is specific, useful, and compatible with the champion's role, damage type, and class.",
  "- Do not use item tokens for vague build advice, full builds, or items not supplied by admin notes/profile reasoning.",
].join("\n");

const antiGenericAdviceRules = [
  "Anti-Generic Advice Rules:",
  "- Hard avoid vague phrases such as vulnerable positions, safe scaling, free scaling, all-in combo is ready, engage setup, control wave tempo, create roam pressure, post-level 6, play around cooldowns, respect engage, take smart trades, position carefully, or avoid unnecessary fights.",
  "- Generic phrases are allowed only when the same bullet immediately ties them to a specific ability, cooldown window, level spike, first recall, first item timing, wave state, trade pattern, all-in trigger, defensive response, or item adaptation. Prefer replacing them entirely.",
  "- Each important bullet should usually mention at least one mechanical anchor: a specific ability, cooldown window, level spike, item breakpoint, wave state, trade pattern, all-in trigger, defensive response, or item adaptation.",
  "- Every section should answer why this matters, how to play it, what timing or window to punish, or what mistake to avoid.",
  "- Do not only describe that a champion has a tool; explain what the player should do because that tool exists.",
  "- Replace force Yone into vulnerable positions with punish Yone after he misses {{ability:Yone:Q}} knockup, trade while {{ability:Yone:E}} is down, keep the wave small so Yone cannot dash through minions for long trades, or hold {{ability:Ahri:E}} until Yone commits with {{ability:Yone:E}}.",
  "- Replace all-in combo is ready with before Yone has {{ability:Yone:Q}} stacked, while {{ability:Yone:E}} is on cooldown, before level 3, before level 6, or before Yone can combine {{ability:Yone:E}} with stacked {{ability:Yone:Q}}.",
  "- Replace deny safe/free scaling with deny free farm, deny free resets, stop him from stacking waves for free, force him to last-hit under pressure, or crash the wave before roaming so he cannot freely collect minions and plates.",
  "- Replace control wave tempo with thin the wave, slow push, crash the wave, hold the wave outside your tower, keep the wave small, bounce the wave, push before recall, or freeze near your side.",
  "- Do not give overly rigid waveclear advice such as never use Q on wave, only use Ahri Q on wave when R is ready, do not use Q on wave without R, or do not use {{ability:Ahri:Q}} on the wave unless {{ability:Ahri:R}} is ready.",
  "- For Ahri, {{ability:Ahri:Q}} is a normal poke and waveclear tool. In Ahri vs Yone, prefer: Use {{ability:Ahri:Q}} to thin the wave, but keep {{ability:Ahri:E}} available when Yone has {{ability:Yone:Q}} stacked or {{ability:Yone:E}} ready.",
  "- Any wave advice must include a concrete wave-state term or reason: thin, slow push, crash, freeze, hold wave, bounce, keep wave small, farm under tower, recall timing, minion wave size, or enemy dash-through-minions interaction.",
  "- If advice mentions engage, all-in, combo, punish window, defensive cooldown, or mobility, name the specific ability token or condition when possible.",
].join("\n");

const promptQualityExamples = [
  "Prompt quality examples:",
  "- Bad: Respect Fizz's engage and avoid bad trades.",
  "- Better: Hold {{ability:Ahri:E}} until Fizz uses {{ability:Fizz:E}}. If you throw charm first, Fizz can dodge it and force an all-in.",
  "- Bad: Vex should hold W for Yone's engage.",
  "- Better: Hold {{ability:Vex:W}} for Yone's engage instead of using it for poke.",
  "- Bad: Play safe until level 6.",
  "- Better: Before level 6, you should thin the wave and avoid trading into {{ability:Orianna:Q}} + {{ability:Orianna:W}} unless Orianna has used ball to clear.",
  "- Bad: Control the wave to create roam pressure.",
  "- Better: Thin the wave early so Yone cannot use minions to extend trades with stacked {{ability:Yone:Q}}.",
  "- Bad: Do not use {{ability:Ahri:Q}} on the wave without {{ability:Ahri:R}} ready.",
  "- Better: Use {{ability:Ahri:Q}} to thin the wave, but keep {{ability:Ahri:E}} available when Yone has {{ability:Yone:Q}} stacked or {{ability:Yone:E}} ready.",
  "- Bad: Control wave tempo to deny Yone free scaling and create roam pressure post-level 6.",
  "- Better: Crash the wave before roaming so Yone must choose between following you and losing minions.",
].join("\n");

const adcPromptRules = [
  "ADC Matchup Rules:",
  "- Treat ADC matchups as primary marksman-versus-marksman guidance under neutral support conditions.",
  "- Assume neither ADC has a specific support advantage unless admin notes provide one.",
  "- Focus on ADC agency: range advantage, wave access, CS pressure, poke windows, all-in threat, reset timing, item spikes, dragon setup, turret pressure, and teamfight role.",
  "- ADC trading_pattern must explain last-hit punishment: hit the enemy ADC when they walk up for CS or are locked into a last-hit animation.",
  "- Frame last-hit punishment through support context: take the punish only if the enemy support cannot zone, engage, hook, stun, or immediately trade back.",
  "- If the enemy support controls brush, river side, or the threat zone, tell the player to give up the CS-punish window instead of losing HP for one auto.",
  "- Use champion-specific tools for last-hit punishment when the profiles support it, such as range, auto + ability poke, slows, traps, or burst trades.",
  "- Prioritize concrete ability interactions over generic trading advice, especially in trading_pattern and danger_windows.",
  "- ADC bullets should teach an immediate lane action such as avoiding Lucian (Q) through minions, avoiding Miss Fortune (Q) bounce angles, tracking Caitlyn (W) traps, or respecting Jhin's fourth shot.",
  "- Prioritize matchup-specific interactions over champion-general advice.",
  "- Before writing an ADC bullet, ask: Would this advice still be correct against most ADCs? If yes, lower priority; if no, higher priority.",
  "- Prefer matchup-specific ability interactions, wave interactions, CS punishment windows, and support-position interactions.",
  "- Avoid generic champion guides disguised as matchup advice.",
  "- ADC overview should explain what specific lane interaction decides the matchup and which champion benefits from which wave state.",
  "- ADC overview must explain lane identity: who wins short trades, who wins extended trades, who controls wave priority, who scales better, who wants early aggression, and who wants time.",
  "- ADC early_game should focus on the first three waves, level 2 race, CS punish windows, support position, and wave decisions that create or deny all-ins.",
  "- ADC danger_windows should name the exact engage window, support-enabled kill threat, cooldown interaction, or ability combination that makes stepping forward dangerous.",
  "- ADC power_spikes should explain how the spike changes lane interactions, such as stronger auto + ability poke, harder CS punishment, safer all-ins, or better wave control.",
  "- ADC win_conditions should explain how lane interactions convert into CS leads, plates, dragon setup, forced recalls, item timing, or teamfight DPS access.",
  "- ADC bullets should include the why when possible: which cooldown matters, why it matters, and how it changes the lane.",
  "- Use minion-specific language when relevant: low-health minions, caster minions, cannon minions, large waves, thinned waves, crash timing, and recall timing.",
  "- Do not write generic ADC advice such as contest CS, trade aggressively, respect cooldowns, punish mistakes, avoid bad trades, maintain lane priority, control the wave, play around power spikes, or play around cooldowns unless the same bullet explains the concrete matchup interaction.",
  "- Mention support dependency as a condition, not a named support matchup; use phrases such as only when your support can walk up, when support cooldowns are available, or if bot prio is secured.",
  "- Avoid claiming exact 2v2 outcomes because support picks can flip lane pressure, all-in threat, and sustain.",
  "- Avoid jungle-only language such as invade, camp tracking, jungle pathing, clear speed, Smite, Scuttle, Herald, Void Grubs, counter-jungle, or first clear unless the admin notes directly require it.",
].join("\n");

const roamingSupportIdentities = [
  "Alistar",
  "Bard",
  "Blitzcrank",
  "Nautilus",
  "Pyke",
  "Rakan",
  "Thresh",
];

const supportArchetypeOrder: readonly SupportArchetype[] = [
  "engage",
  "hook",
  "roaming",
  "enchanter",
  "poke",
  "hybrid",
];

const supportArchetypeThemes = {
  engage: "engage timing, ADC follow-up, level 2 windows, cooldown tracking, brush control",
  enchanter: "ADC protection, sustain, shielding, peel, scaling, cooldown trading",
  hook: "fog-of-war pressure, hook threat, positioning mistakes, brush denial, pick potential",
  hybrid: "flexible engage and disengage, utility, follow-up, ADC enablement",
  poke: "wave pressure, lane control, HP advantages, mana management, range advantage",
  roaming: "roam timers, wave crashes, river control, mid pressure, vision setup, matching roams",
} as const satisfies Record<SupportArchetype, string>;

const supportChampionArchetypeOverrides: Record<string, readonly SupportArchetype[]> = {
  alistar: ["engage", "roaming"],
  bard: ["roaming", "hybrid"],
  blitzcrank: ["hook"],
  brand: ["poke"],
  janna: ["enchanter"],
  karma: ["hybrid", "poke", "enchanter"],
  leona: ["engage"],
  lulu: ["enchanter"],
  lux: ["poke", "hybrid"],
  milio: ["enchanter"],
  morgana: ["hybrid", "poke"],
  nami: ["enchanter"],
  nautilus: ["engage", "hook"],
  pyke: ["hook", "roaming"],
  rakan: ["roaming", "hybrid", "engage"],
  rell: ["engage"],
  seraphine: ["hybrid", "enchanter", "poke"],
  soraka: ["enchanter"],
  thresh: ["hook", "roaming", "hybrid"],
  velkoz: ["poke"],
  xerath: ["poke"],
  zyra: ["poke"],
};

const supportArchetypeSignals = {
  engage: ["engage", "all-in", "frontline", "initiator", "tank", "teamfight"],
  enchanter: ["attach", "enchanter", "heal", "peel", "protect", "shield", "sustain"],
  hook: ["catch", "hook", "pick"],
  hybrid: ["counter-engage", "disengage", "flexible", "hybrid", "utility"],
  poke: ["artillery", "burst", "lane control", "mage", "poke", "range", "zone"],
  roaming: ["fog", "mid pressure", "mobility", "mobile", "river", "roam", "roaming"],
} as const satisfies Record<SupportArchetype, readonly string[]>;

const supportPromptRules = [
  "Support Matchup Rules:",
  "- Treat support matchups as 2v2 bot-lane guidance, not isolated support-vs-support duels.",
  "- Every support bullet should explain how Champion A protects their ADC, enables their ADC, denies the enemy ADC, controls engage or disengage, controls brush and lane space, manages roam timers, or sets up vision and objectives.",
  "- Support card text must never frame supports as minion-income champions.",
  "- Replace solo-lane economy concepts with ADC access, engage access, brush control, hook pressure, roam windows, vision control, peel opportunities, and follow-up windows.",
  "- Do not tell supports to punish minion-income actions, trade aggressively into the enemy support, or fight the enemy support after a cooldown miss unless the sentence clearly explains ADC access, ADC follow-up, brush control, or lane-state control.",
  "- Avoid support 1v1 phrasing such as beats the enemy support, wins the duel, trade into the support, punish the support walking up to the wave, or kill the enemy support repeatedly.",
  "- Support overview should explain which side wants engage, which side wants disengage, which ADC benefits from extended fights, and who controls brush or lane space.",
  "- Support trading_pattern should focus on ADC follow-up, engage timing, cooldown synchronization, support positioning, peel timing, and whether to hold cooldowns for enemy engage instead of forcing first.",
  "- Support early_game should cover level 2 race, lane priority, brush control, wave crash, and ADC access to the wave.",
  "- Support danger_windows should name enemy ADC follow-up, enemy support engage range, brush or fog control, vision denial, and wave states that make the ADC vulnerable.",
  "- Support win_conditions should convert lane control into ADC access, denied enemy ADC positioning, vision around dragon, roam timers, objective setup, and favorable teamfight entry.",
  "- Brush control should appear when either profile has engage, hook, pick, melee threat, plant control, sapling control, or lane-zone identity.",
  "- For engage supports, explain when engage is correct only if the ADC can immediately follow and wave or brush state allows it.",
  "- For peel and enchanter supports, explain when to hold shields, polymorphs, disengage, slows, heals, or knockbacks to protect ADC access.",
  "- For poke supports, explain how poke creates ADC wave access denial, turret pressure, recall timing, or objective setup rather than isolated support damage.",
  "- For roaming supports, explain roam timers after wave crashes, ADC safety before leaving lane, vision setup, river control, mid-lane impact, and return timing before the ADC becomes vulnerable.",
  `- Treat these champions as roaming-capable supports when their supplied profile supports it: ${roamingSupportIdentities.join(", ")}.`,
  "- Roaming support bullets must not imply the support should permanently sit lane if profile fields mention roam, fog, pick, hook, mobility, or river control.",
  "- Use support_identity_archetypes before writing support guidance; make engage, hook, roaming, enchanter, poke, and hybrid matchups feel different.",
  "- Engage support matchups should emphasize engage timing, level 2 windows, ADC follow-up, cooldown tracking, and brush control.",
  "- Hook support matchups should emphasize hook angles, fog-of-war pressure, brush denial, positioning discipline, pick potential, and cooldown windows.",
  "- Roaming support matchups should emphasize wave crashes, roam timers, ADC safety while alone, river vision, mid pressure, missing support pings, and matching or punishing roams.",
  "- Enchanter matchups should emphasize ADC protection, peel, sustain, shielding, scaling, and forcing inefficient defensive cooldowns.",
  "- Poke support matchups should emphasize range advantage, wave pressure, HP leads, mana pressure, brush control, and converting lane control into dragon setup.",
  "- Hybrid support matchups should emphasize flexible engage or disengage choices, utility layering, follow-up, and ADC enablement.",
  "- Pyke matchups should frequently discuss roam timers, river control, missing support pings, vision denial, forcing Pyke to stay in lane, and punishing failed roams.",
  "- Bard matchups should frequently discuss roam windows, chime timing, portal angles, ADC isolation risk, river vision, and mid-lane pressure.",
  "- Blitzcrank matchups should frequently discuss hook angles, fog-of-war pressure, brush denial, and positioning discipline.",
].join("\n");

// This builder is the provider-facing prompt contract for League draft generation.
// Keep it independent from the OpenAI call so future provider swaps reuse the same quality bar.
export function buildLeagueMatchupDraftPrompt({
  adminNotes,
  enemyChampionProfile,
  enemyChampionName,
  existingSections,
  playerChampionProfile,
  playerChampionName,
  role,
  targetSection,
}: LeagueMatchupDraftPromptInput): LeagueMatchupDraftPrompt {
  const roleLabel = role === "adc" ? "ADC" : role;
  const outputKeys = targetSection ? [targetSection] : matchupDraftSectionKeys;
  const roleGuidance = getRolePromptGuidance(role);
  const sourceNotes = adminNotes?.trim() || "No admin notes supplied.";
  const existingSectionContext = formatExistingSections(existingSections);
  const playerChampionContext = formatChampionKnowledgeForPrompt(
    playerChampionName,
    playerChampionProfile,
  );
  const enemyChampionContext = formatChampionKnowledgeForPrompt(
    enemyChampionName,
    enemyChampionProfile,
  );
  const supportIdentityContext =
    role === "support"
      ? formatSupportIdentityMatchupContext({
          enemyChampionName,
          enemyChampionProfile,
          playerChampionName,
          playerChampionProfile,
        })
      : null;

  return {
    systemPrompt: [
      "You write League of Legends matchup draft notes for LaneStomp admins.",
      `Champion A is always ${playerChampionName}, the player champion.`,
      `Champion B is always ${enemyChampionName}, the opponent.`,
      `Every generated bullet must answer: what should ${playerChampionName} do?`,
      "The output is a coach for Champion A only, not neutral matchup analysis.",
      "Returned card text must contain only player-facing matchup guidance.",
      "Never echo generation rules, validation checks, JSON format wording, section requirements, admin-review language, or prompt wording in generated card text.",
      "Do not write bullets that sound like instructions to a writer; write matchup analysis for the player.",
      "Never switch perspective or write advice that helps Champion B pilot their champion.",
      "Use Champion B facts only to explain threats, respect windows, or punish windows for Champion A.",
      "If a fact describes a Champion B weakness, frame it as how Champion A should exploit that window.",
      "Return compact, matchup-specific coaching bullets, not long-form articles.",
      "Use at most 3 bullets per section.",
      "Every section must serve a distinct gameplay purpose and avoid repeating advice from another section.",
      "Make the card text fast to scan during champion select or loading screen.",
      "Use direct League player language with concrete matchup decisions.",
      "Follow the dedicated League Terminology Rules and Writing Style Rules in the user prompt.",
      "Prefer correct, limited advice over filling every section with weak guesses.",
      "Never claim winrates, exact patch facts, item/stat changes, or matchup certainty unless supplied by admin notes.",
      "Do not invent ability timing, cooldown interactions, item recommendations, or lane dynamics.",
      "Treat supplied champion combat profiles as the source of truth. If model memory conflicts with the profiles, follow the profiles.",
      "Draft-quality profiles may be incomplete. Use supplied fields when present, and avoid specific claims when a field says not supplied.",
      "Use the ability map to understand abilities, and prefer rich text ability tokens for important ability references.",
      "Use {{ability:ChampionId:AbilityKey}} for important ability references when the token improves clarity.",
      "Use {{item:ItemId}} only for specific, useful item adaptations.",
      "Do not prepend champion names to abilities when a rich text ability token already names the champion.",
      "Use danger abilities, primary win conditions, punish windows, damage type, class, and trading pattern from the profiles before relying on assumptions.",
      "Do not invent crowd control, stealth, sustain, shields, damage type, or power spikes that are absent from the supplied profiles.",
      "Do not recommend items that conflict with the champion damage type, class, role, or supplied profile facts.",
      "Mention uncertainty briefly only when matchup advice may vary by patch, skill bracket, build, or lane state.",
      "Avoid vague phrases like play safe, look for trades, or scale unless you name the exact timing, resource state, cooldown, or enemy mistake that creates the decision.",
      "Avoid awkward AI wording such as extended melee range, sustained poke after recall, or generic lane dominance.",
    ].join("\n"),
    userPrompt: [
      `Player champion: ${playerChampionName}`,
      `Enemy champion: ${enemyChampionName}`,
      `Champion A: ${playerChampionName} (player)`,
      `Champion B: ${enemyChampionName} (opponent)`,
      `Matchup direction: ${playerChampionName} into ${enemyChampionName}`,
      `Role: ${roleLabel}`,
      `Role-specific guidance:\n${roleGuidance}`,
      `Admin notes or source context: ${sourceNotes}`,
      "",
      role === "support" ? supportTerminologyRules : leagueTerminologyRules,
      "",
      role === "support" ? supportWritingStyleRules : writingStyleRules,
      "",
      antiGenericAdviceRules,
      "",
      richTextTokenRules,
      "",
      promptQualityExamples,
      ...(role === "jungle" ? ["", junglePlanRules, ""] : [""]),
      ...(role === "adc" ? ["", adcPromptRules, ""] : [""]),
      ...(role === "support" ? ["", supportPromptRules, ""] : [""]),
      ...(supportIdentityContext ? ["Support identity matchup:", supportIdentityContext, ""] : []),
      "Structured champion profiles:",
      `Player champion combat profile:\n${playerChampionContext}`,
      `Enemy champion combat profile:\n${enemyChampionContext}`,
      "",
      `Existing matchup context:\n${existingSectionContext}`,
      "",
      targetSection
        ? `Regenerate only the ${getMatchupDraftSectionLabel(
            targetSection,
            role,
          )} card. Preserve the intent of the other existing cards as context, but do not rewrite them.`
        : "Regenerate the full matchup draft.",
      `Write JSON for these exact keys: ${outputKeys.join(", ")}.`,
      "Each value must be a newline-separated bullet list.",
      "Use 1-3 bullets per key, never more.",
      "Each bullet must be one short actionable sentence, ideally 8-16 words and no more than 22 words.",
      "Do not add a second explanatory clause unless it changes the player's decision.",
      "Start every bullet with '- '.",
      "Do not use paragraphs.",
      `Every bullet must directly help a player piloting Champion A (${playerChampionName}) against Champion B (${enemyChampionName}).`,
      `Every bullet must be actionable coaching for ${playerChampionName}; it should name what ${playerChampionName} should do, avoid, respect, punish, play around, or play toward.`,
      "Every bullet should prioritize the action first, then only the shortest needed matchup reason.",
      "Do not start returned bullets with obvious prompt or fallback wording such as Review, Analyze, List only, Keep broad notes, Re-check, Instruction, or Generated matchup.",
      `Never write from ${enemyChampionName}'s point of view or tell ${enemyChampionName} what to do.`,
      `When using ${enemyChampionName}'s weaknesses or punish windows, translate them into concrete ${playerChampionName} actions.`,
      `When mentioning ${enemyChampionName}'s strengths, phrase them as respect windows, spacing rules, or lane-state choices for ${playerChampionName}.`,
      `Never leave ${enemyChampionName}'s weakness as a neutral observation; explain how ${playerChampionName} should exploit it.`,
      `If ${playerChampionName} following a bullet would not increase their chance of winning, rewrite or discard that bullet.`,
      "Do not repeat wave control, spacing, or cooldown tracking across sections unless that concept is uniquely relevant to the section.",
      "If a concept belongs in one section, do not restate it elsewhere.",
      "Use the structured champion profiles to decide damage type, crowd control, mobility, sustain, shields, stealth, jungle profile categories, role-appropriate patterns, lane identity, and real spikes.",
      ...getRoleProfileSourceRules(role),
      "Use strategicIdentity to infer high-level matchup identities such as snowball vs scale, roam vs scale, control vs roam, teamfight vs splitpush, or lane pressure vs scaling carry.",
      "Do not name a matchup identity unless it follows from the supplied strategicIdentity fields.",
      "Power spike objects include timing, reason, changesGameplay, playerAction, and sometimes enemyResponse.",
      "Do not echo power spike timing by itself; explain what changes in lane, who becomes more dangerous, and what the player should do differently.",
      "If a structured field is not supplied, fall back to the older summary field for that topic. If neither is supplied, stay conservative and avoid invented details.",
      "Use strategicIdentity to reason about each champion's lane goal, scaling curve, preferred game length, and general win method.",
      ...getRoleComparisonRules({
        enemyChampionName,
        playerChampionName,
        role,
      }),
      "Prefer supplied profile facts over model assumptions, especially for champion abilities, item direction, and class-specific build advice.",
      "Only reference abilities, crowd control, shields, sustain, stealth, or power spikes that appear in the profiles or admin notes.",
      "If a champion profile says a champion has no hard crowd control, do not describe that champion as having hard crowd control.",
      "If a champion profile is missing, avoid specific ability claims for that champion unless supplied by admin notes.",
      "If either profile is missing, make the draft more conservative and lower-confidence instead of inventing details.",
      ...getRoleTerminologyRules(role),
      "Use the ability_map as the canonical ability source for reasoning and token selection.",
      "Apply ability tokens consistently in overview, early_game, trading_pattern, power_spikes, danger_windows, and win_conditions when the ability is a key decision anchor.",
      `If source profile text names an important mapped ${playerChampionName} ability, prefer {{ability:${playerChampionName}:Q}}, {{ability:${playerChampionName}:W}}, {{ability:${playerChampionName}:E}}, or {{ability:${playerChampionName}:R}} with the correct key in the returned JSON.`,
      `If source profile text names an important mapped ${enemyChampionName} ability, prefer {{ability:${enemyChampionName}:Q}}, {{ability:${enemyChampionName}:W}}, {{ability:${enemyChampionName}:E}}, or {{ability:${enemyChampionName}:R}} with the correct key in the returned JSON.`,
      "Avoid top-lane-only concepts unless the selected role and champions clearly make them relevant.",
      "For mid lane, avoid long-freeze advice; use hold the wave on your side, crash, reset, roam timer, or punish roam only when the lane state supports it.",
      "If defensive adaptation matters, include it briefly in overview as a matchup need rather than naming full items or builds.",
      "",
      ...getPerspectiveExamples({
        enemyChampionName,
        playerChampionName,
        role,
      }),
      "",
      ...getSectionRequirements({
        enemyChampionName,
        playerChampionName,
        role,
      }),
      "",
      ...getNegativeExamples({
        enemyChampionName,
        playerChampionName,
        role,
      }),
      "",
      ...getFinalValidationChecks({
        enemyChampionName,
        playerChampionName,
        role,
      }),
    ].join("\n"),
  };
}

function getRoleProfileSourceRules(role: LeagueRole) {
  if (role === "jungle") {
    return [
      "For jungle matchups, treat jungle_profile fields as higher priority than lanePlan, laneIdentity, trading, or lane-focused summary fields.",
      "For jungle matchups, compare early_game_pressure, clear_speed, objective_control, dueling, gank_threat, invade_resistance, scaling, pathing_notes, and matchup_focus before writing any section.",
    ];
  }

  if (role === "adc") {
    return [
      "For ADC matchups, treat lanePlan, laneIdentity, trading, matchupPreferences, dangerProfile, punishProfile, powerSpikes, and strategicIdentity as the source of truth for ADC-versus-ADC guidance under neutral support conditions.",
    ];
  }

  if (role === "support") {
    return [
      "For support matchups, treat lanePlan, laneIdentity, trading, matchupPreferences, dangerProfile, punishProfile, powerSpikes, strategicIdentity, and supportSynergy as the source of truth for 2v2 support guidance.",
      "For support matchups, compare how both supports affect ADC access, ADC follow-up, engage or disengage, brush control, roam timers, vision control, and objective setup before writing any section.",
      "For support matchups, use support_identity_archetypes to decide the primary matchup lens before using generic support rules.",
      "For support matchups, make the card text reflect the interaction between Champion A's support identity and Champion B's support identity.",
      "For support matchups, never use solo-lane economy framing; translate those ideas into ADC access, engage access, brush control, hook pressure, roam windows, vision control, peel opportunities, or follow-up windows.",
    ];
  }

  return [
    "For non-jungle matchups, treat lanePlan, laneIdentity, strategicIdentity, trading, matchupPreferences, dangerProfile, punishProfile, or powerSpikes fields as higher priority than the older summary fields.",
  ];
}

function getRoleComparisonRules({
  enemyChampionName,
  playerChampionName,
  role,
}: {
  enemyChampionName: string;
  playerChampionName: string;
  role: LeagueRole;
}) {
  if (role === "jungle") {
    return [
      "For jungle matchups, use jungle_profile to reason about who can invade, who full clears faster, who wins river fights, who controls early objectives, who ganks better, and who scales harder.",
      `For jungle matchups, compare ${playerChampionName}'s jungle_profile against ${enemyChampionName}'s jungle_profile and explain what pathing, tempo, river, invade, objective, or scaling plan ${playerChampionName} should play toward.`,
      "For jungle matchups, use primary win conditions, jungle_profile, danger abilities, and punish windows as matchup facts for map plan, invade, counter-gank, objective, river, tempo, and danger window advice.",
    ];
  }

  if (role === "adc") {
    return [
      "For non-jungle matchups, use laneIdentity to reason about who controls early lane pace, who wants time to scale, who wants lane pressure, and who benefits from a passive lane state.",
      `For non-jungle matchups, compare ${playerChampionName}'s lanePlan.wants against ${enemyChampionName}'s lanePlan.wants and explain what ${playerChampionName} must deny.`,
      `For non-jungle matchups, compare ${playerChampionName}'s laneIdentity against ${enemyChampionName}'s laneIdentity before writing overview, early_game, trading_pattern, or win_conditions.`,
      `For ADC matchups, compare ${playerChampionName}'s range, wave access, poke, all-in risk, scaling curve, item spikes, and teamfight role against ${enemyChampionName}'s profile before writing any section.`,
      `Compare ${playerChampionName}'s strategicIdentity against ${enemyChampionName}'s strategicIdentity before writing overview or win_conditions.`,
      `For non-jungle matchups, compare ${playerChampionName}'s punishProfile.canPunish against ${enemyChampionName}'s dangerProfile.mustRespect and trading.badTradeConditions.`,
      `For non-jungle matchups, compare ${enemyChampionName}'s punishProfile.canPunish and dangerProfile.dangerousWhen against ${playerChampionName}'s trading.badTradeConditions.`,
      "For non-jungle matchups, use primary win conditions, danger abilities, and punish windows as matchup facts for all-ins, spacing, cooldown punish, and danger window advice.",
    ];
  }

  if (role === "support") {
    return [
      "For support matchups, use laneIdentity to reason about lane space, ADC safety, engage access, brush control, roam timing, and objective setup.",
      `For support matchups, compare ${playerChampionName}'s ADC setup, peel, engage, brush control, roam timers, and vision access against ${enemyChampionName}'s profile before writing any section.`,
      `For support matchups, if ${enemyChampionName} is a hook support, prioritize hook angles, fog pressure, brush denial, and ADC positioning safety over generic trade advice.`,
      `For support matchups, if ${enemyChampionName} is a roaming support, prioritize crash timers, missing pings, river vision, ADC isolation risk, and punishing failed roams.`,
      `For support matchups, if ${enemyChampionName} is an enchanter, prioritize forcing inefficient shields, denying ADC scaling comfort, and choosing engage or poke windows around peel cooldowns.`,
      `Compare ${playerChampionName}'s strategicIdentity against ${enemyChampionName}'s strategicIdentity before writing overview or win_conditions.`,
      `For support matchups, compare ${playerChampionName}'s punishProfile.canPunish against ${enemyChampionName}'s dangerProfile.mustRespect and trading.badTradeConditions only when it changes ADC access, engage safety, peel timing, or vision control.`,
      "For support matchups, use primary win conditions, danger abilities, and punish windows as matchup facts for ADC access, engage timing, peel, roams, vision, objective setup, and teamfight entry.",
    ];
  }

  return [
    "For non-jungle matchups, use laneIdentity to reason about who controls early lane pace, who wants time to scale, who wants lane pressure, and who benefits from a passive lane state.",
    `For non-jungle matchups, compare ${playerChampionName}'s lanePlan.wants against ${enemyChampionName}'s lanePlan.wants and explain what ${playerChampionName} must deny.`,
    `For non-jungle matchups, compare ${playerChampionName}'s laneIdentity against ${enemyChampionName}'s laneIdentity before writing overview, early_game, trading_pattern, or win_conditions.`,
    `Compare ${playerChampionName}'s strategicIdentity against ${enemyChampionName}'s strategicIdentity before writing overview or win_conditions.`,
    `For non-jungle matchups, compare ${playerChampionName}'s punishProfile.canPunish against ${enemyChampionName}'s dangerProfile.mustRespect and trading.badTradeConditions.`,
    `For non-jungle matchups, compare ${enemyChampionName}'s punishProfile.canPunish and dangerProfile.dangerousWhen against ${playerChampionName}'s trading.badTradeConditions.`,
    "For non-jungle matchups, use primary win conditions, danger abilities, and punish windows as matchup facts for all-ins, spacing, cooldown punish, and danger window advice.",
  ];
}

function getRoleTerminologyRules(role: LeagueRole) {
  if (role === "jungle") {
    return [
      "For jungle matchups, use natural jungle terms such as full clear, three-camp, level 3 invade, counter-invade, scuttle contest, river fight, objective setup, cross-map, counter-jungle, tempo reset, tracking, gank angle, and scaling window.",
    ];
  }

  if (role === "adc") {
    return [
      "For ADC matchups, use natural bot-lane terms such as range advantage, wave access, CS pressure, support cooldowns, bot prio, crash timing, reset, plates, dragon setup, all-in window, poke lane, and teamfight DPS.",
    ];
  }

  if (role === "support") {
    return [
      "For support matchups, use natural support terms such as level 2 race, brush control, hook angle, engage window, peel, ADC follow-up, lane prio, wave crash, roam timer, vision line, river control, dragon setup, and reset timer.",
    ];
  }

  return [
    "For non-jungle matchups, use natural League terms such as wave on your side, punish cooldowns, avoid all-in windows, short trades, spacing, roam timers, freeze, crash, slow push, and reset only when they fit the role and lane.",
  ];
}

function getPerspectiveExamples({
  enemyChampionName,
  playerChampionName,
  role,
}: {
  enemyChampionName: string;
  playerChampionName: string;
  role: LeagueRole;
}) {
  const commonExamples = [
    "Perspective examples:",
    `- Bad: Use (Q) to pressure ${playerChampionName}.`,
    `- Better: Respect ${enemyChampionName}'s (Q) range before stepping into lane space.`,
    `- Bad: ${enemyChampionName} wants to scale safely.`,
    `- Better: Deny ${enemyChampionName}'s scaling comfort by forcing action during supplied punish windows.`,
  ];

  if (role === "support") {
    return [
      ...commonExamples,
      `- Bad support framing: Treat ${enemyChampionName} like a solo-lane economy target.`,
      `- Better support framing: Deny ${enemyChampionName}'s engage angle by controlling brush before your ADC steps up.`,
      `- Better support framing: Hold peel until ${enemyChampionName}'s hook, dash, or lockdown tool is committed.`,
      `- Better support framing: Crash with your ADC before roaming so ${enemyChampionName} cannot isolate them.`,
      `- Better support framing: Place river vision when ${enemyChampionName}'s roam timer can threaten mid or dragon setup.`,
    ];
  }

  if (role === "jungle") {
    return [
      ...commonExamples,
      `- Bad jungle framing: ${enemyChampionName} has strong laning pressure.`,
      `- Better jungle framing: Track ${enemyChampionName}'s first clear before contesting river or invading.`,
      `- Better jungle framing: Trade the weak-side objective for camps, vision, or opposite-side pressure when nearby lanes cannot move.`,
    ];
  }

  return [
    ...commonExamples,
    `- Bad lane framing: ${enemyChampionName} has a weakness.`,
    `- Better lane framing: Punish ${enemyChampionName}'s exposed cooldown by taking wave space or forcing a reset.`,
    `- Better lane framing: Hit ${enemyChampionName} during the supplied minion, range, or cooldown window instead of forcing blind trades.`,
  ];
}

function getSectionRequirements({
  enemyChampionName,
  playerChampionName,
  role,
}: {
  enemyChampionName: string;
  playerChampionName: string;
  role: LeagueRole;
}) {
  const commonRequirements = [
    "Section requirements:",
    "- overview: 2-3 bullets that explain the matchup identity and the player's main plan.",
    "- danger_windows: 2-3 bullets naming the enemy timing, ability, position, or map state that makes the player vulnerable.",
    "- power_spikes: 2-3 bullets naming real breakpoints and what changes in the matchup.",
    "- win_conditions: 2-3 bullets explaining how the player converts the matchup plan into lane, map, or fight advantages.",
  ];

  if (role === "support") {
    return [
      ...commonRequirements,
      "- overview: explain lane space, ADC protection, ADC enablement, engage pressure, follow-up, brush control, and river access.",
      "- trading_pattern: focus on engage timing, peel timing, missed engage tools, brush denial, ADC follow-up, and cooldown synchronization.",
      "- early_game: cover the level 2 race, first three waves for ADC safety, brush control, lane pressure, crash timing, and roam timers.",
      "- danger_windows: name enemy engage cooldowns, hook angles, brush fog, enemy ADC follow-up, level 2/3/6 support spikes, and roam threat.",
      "- power_spikes: cover level 2, level 3 full-kit access, level 6 ultimates, and support item breakpoints that change peel, engage, or vision.",
      "- win_conditions: enable ADC damage, deny enemy ADC access, roam safely, set river vision, prepare dragon, and choose favorable 2v2 fights.",
      `- For ${playerChampionName}, describe when to protect, engage, deny brush, roam, ward, or create follow-up.`,
      `- Against ${enemyChampionName}, describe how their support identity changes your ADC safety and lane-space decisions.`,
    ];
  }

  if (role === "jungle") {
    return [
      ...commonRequirements,
      "- trading_pattern/Jungle Plan: explain pathing, first clear goals, Scuttle conditions, invade windows, counter-ganks, objective setup, and scaling denial.",
      "- early_game: cover first clear direction, first river move, invade safety, lane priority requirements, and cross-map alternatives.",
      "- danger_windows: include invade timing, isolated river fights, forced objective setups, low-health clears, and lanes that can move first.",
      "- win_conditions: convert jungle tempo into objectives, gank pressure, counter-jungle camps, scaling denial, or teamfight access.",
    ];
  }

  if (role === "adc") {
    return [
      ...commonRequirements,
      "- overview: identify the deciding ADC interaction: range, wave access, poke, all-in risk, scaling, item spikes, or teamfight role.",
      "- trading_pattern: prioritize matchup-specific ability, minion, range, ammo, support-position, and cooldown interactions over generic trades.",
      "- early_game: explain first-wave, level 2, CS punish, support position, wave-size, crash, and reset decisions.",
      "- danger_windows: name the enemy ability, support position, wave state, or spike that creates danger.",
      "- win_conditions: connect lane interactions into recalls, plates, dragon setup, item leads, or teamfight access.",
    ];
  }

  return [
    ...commonRequirements,
    "- trading_pattern: explain matchup-specific trades, spacing, cooldown windows, wave states, and punish windows.",
    "- early_game: cover first waves, level breakpoints, wave state, reset timing, jungle vulnerability, and early punish windows.",
    "- danger_windows: name enemy all-in windows, wave states, cooldowns, jungle timing, and positioning mistakes that create risk.",
  ];
}

function getNegativeExamples({
  enemyChampionName,
  playerChampionName,
  role,
}: {
  enemyChampionName: string;
  playerChampionName: string;
  role: LeagueRole;
}) {
  const commonExamples = [
    "Negative examples to avoid:",
    "- Do not say play safe unless you explain what cooldown, wave state, or enemy spike requires caution.",
    "- Do not say look for trades unless you explain what enemy cooldown, resource state, or positioning mistake creates the trade.",
    "- Do not say maintain lane priority or control the wave unless the bullet explains why the wave state matters for this matchup.",
    "- Do not say trade when cooldowns are down; name the exact ability and explain why that cooldown changes range, poke, dash access, root threat, or all-in safety.",
    "- Do not say scale into late game unless you explain how the player survives lane and what later condition improves.",
    "- Do not say control lane tempo unless lane priority, wave control, crash timing, reset timing, or roam timer would be more precise.",
    "- Do not start bullets with prompt or fallback wording such as Review, Analyze, List only, Keep broad notes, Re-check, Instruction, or Generated matchup.",
    "- Do not say use cross-map trades when direct river fights are not favorable; name the actual trade, side of the map, objective, camp, vision, or tempo window.",
    `- Do not write any bullet that is mainly useful for a ${enemyChampionName} player.`,
    "- Do not recommend Morellonomicon just because the enemy has minor healing.",
    "- Do not recommend AD items to AP champions, including Hexdrinker for a mage.",
    "- Do not invent ability timing or claim an ability spike that is not real.",
    "- Do not mention level 3 merely because a champion has all basic abilities; only mention level 3 if the supplied profile says it significantly changes threat, trading, or all-in access.",
    "- Do not invent crowd control, sustain, shields, stealth, or a combat use for utility-only abilities.",
    "- Do not write repeated long formats like (Q) Orb of Deception or (E) Scatter the Weak in generated card text.",
    "- Prefer {{ability:ChampionId:AbilityKey}} over long ability names when the ability is important to the advice.",
    `- Do not write ${playerChampionName}'s ${playerChampionName} (Q), ${playerChampionName}'s ${playerChampionName} (W), ${enemyChampionName}'s ${enemyChampionName} (E), or repeated champion names.`,
    `- Do not write ${playerChampionName} Q, ${playerChampionName} W, ${playerChampionName} E, or ${playerChampionName} R when a token such as {{ability:${playerChampionName}:E}} would be clearer.`,
    `- Do not write ${enemyChampionName}'s (Q) followed by the ability name; use {{ability:${enemyChampionName}:Q}} when that ability is the decision anchor.`,
    "- Do not say Twilight Shroud is Akali's level 6 spike.",
    "- Do not treat Lost Chapter sustain or recall timing as a power spike.",
    "- Do not claim Ahri E cooldown reduction as a core spike.",
  ];

  if (role === "support") {
    return [
      ...commonExamples,
      "- For support matchups, do not write isolated support duel advice; every bullet should affect ADC access, ADC follow-up, brush control, vision, roams, objective setup, or teamfight entry.",
      "- For support matchups, do not frame either support as a minion-income champion.",
      "- For support matchups, do not tell the support to trade aggressively into the enemy support without ADC follow-up, peel safety, brush state, wave state, or vision control.",
      "- For support matchups, do not recommend roaming without checking wave crash timing, ADC safety, vision setup, river control, or return timing.",
      "- For support matchups, do not make Pyke, Bard, Blitzcrank, Rakan, Alistar, Thresh, or Nautilus stay lane permanently when their profile supports roams, hooks, fog pressure, or mid pressure.",
    ];
  }

  if (role === "jungle") {
    return [
      ...commonExamples,
      "- For jungle matchups, do not force wave control, last hitting, laning pressure, lane priority, or trading patterns unless lane state directly changes pathing, invade, gank, or objective decisions.",
      "- For jungle matchups, do not say short trades, trading patterns, trade windows, use spacing, force extended fights, or engage when cooldowns are down; say Jungle Plan concepts such as pathing, first clear, Scuttle conditions, invade timing, counter-gank timing, objective setup, river control, tempo management, or scaling denial.",
    ];
  }

  if (role === "adc") {
    return [
      ...commonExamples,
      "- Do not say trade aggressively when cooldowns are down; name the CS, last-hit animation, range, support, or wave condition that creates the trade.",
      "- Do not say pressure farm or contest CS; say punish last-hit attempts, hit during last-hit animations, or force the enemy ADC off the wave.",
      "- Do not say respect enemy damage, avoid bad trades, or play around cooldowns; name the exact ability interaction, ammo state, minion angle, trap zone, or support threat.",
      "- Do not say punish mistakes; name the mistake, such as standing behind low-health minions, stepping over traps, using dash forward, or last-hitting inside support threat.",
      "- Do not say play around power spikes; name how the spike changes CS punishment, wave control, all-in access, plates, recalls, or dragon setup.",
      "- Do not say support cooldowns are available without explaining support position, brush control, who can move first, or who can immediately trade back.",
      "- Do not say calm farming phase, calm laning phase, comfortable lane, safe farming environment, peaceful lane, relaxed laning, farming safely, or farm safely.",
      "- For ADC matchups, do not use jungle-only concepts such as invade, camp tracking, jungle pathing, clear speed, Smite, Scuttle, Herald, Void Grubs, counter-jungle, or first clear unless admin notes explicitly require it.",
      "- For ADC matchups, do not name specific support champions or assume a support matchup unless admin notes explicitly provide that support context.",
      "- For ADC matchups, do not recommend last-hit punishment when the enemy support can zone, engage, hook, stun, or punish the step forward.",
    ];
  }

  return [
    ...commonExamples,
    "- Do not say calm farming phase, calm laning phase, comfortable lane, safe farming environment, peaceful lane, relaxed laning, farming safely, or farm safely.",
  ];
}

function getFinalValidationChecks({
  enemyChampionName,
  playerChampionName,
  role,
}: {
  enemyChampionName: string;
  playerChampionName: string;
  role: LeagueRole;
}) {
  const commonChecks = [
    "Final validation before returning JSON:",
    `- Does every bullet directly help ${playerChampionName} into ${enemyChampionName}?`,
    `- If ${playerChampionName} followed this bullet, would it increase their chance of winning?`,
    `- Is any bullet written for ${enemyChampionName}? If yes, rewrite or remove it.`,
    `- Are ${enemyChampionName}'s weaknesses framed as ${playerChampionName} actions?`,
    `- Did danger_windows avoid describing ${enemyChampionName}'s vulnerability windows?`,
    "- Does the draft use direct coaching language such as you want to, you should, look to, hold, avoid, punish, or your goal is?",
    `- Did the draft avoid third-person phrasing such as ${playerChampionName} wants to, ${playerChampionName} should, the champion wants to, or the player should?`,
    "- Does every generic phrase have a concrete anchor such as a tokenized ability, cooldown window, level spike, item breakpoint, wave state, all-in trigger, defensive response, or item adaptation?",
    "- Did the draft avoid vague phrases such as vulnerable positions, safe scaling, free scaling, all-in combo is ready, engage setup, control wave tempo, create roam pressure, post-level 6, play around cooldowns, respect engage, take smart trades, position carefully, or avoid unnecessary fights?",
    "- If the draft gives wave advice, does it name push, thin, freeze, slow push, crash, hold wave, farm under tower, bounce, recall timing, roam timing, minion wave size, or dash-through-minions interaction?",
    "- Did the draft avoid rigid waveclear claims such as never use Q on wave, only use Ahri Q on wave when R is ready, do not use Q on wave without R, or do not use {{ability:Ahri:Q}} on wave without {{ability:Ahri:R}}?",
    "- If the draft mentions engage, all-in, combo, punish window, defensive cooldown, or mobility, did it name the specific ability token or condition when possible?",
    "- Did important ability references use valid {{ability:ChampionId:AbilityKey}} tokens when useful?",
    "- Did specific item recommendations use valid {{item:ItemId}} tokens when useful?",
    "- Did the draft avoid long ability names and repeated champion-owned ability phrases?",
    "- Is this advice actually true for this role?",
    "- Could each bullet be understood within two seconds?",
    "- Does the wording sound like a high-ELO League coach rather than generic AI advice?",
    "- Did the draft use authentic League terms and avoid banned comfort phrases?",
    "- Is each power_spikes bullet a real power spike?",
    "- Does each power_spikes bullet include a breakpoint plus the impact it has on the matchup?",
    "- Did power_spikes name real breakpoints instead of prompt/process wording such as Re-check, Review, Analyze, or the matchup can flip?",
    "- Is each named item realistic for this champion?",
    "- Did every returned bullet avoid obvious prompt or fallback scaffolding?",
    "- Did every returned value avoid prompt-language phrases such as list only, keep broad notes, before publishing, the output should, instruction, JSON, schema, admin review, returned bullet, return JSON, or rewrite?",
    "- Did win_conditions avoid generic repeated objective-trading phrasing and name the relevant objective, tempo, lane priority, vision, scaling, or champion-strength reason?",
    "- Can a player use this in champion select within 15-20 seconds?",
  ];

  if (role === "support") {
    return [
      ...commonChecks,
      "- For support matchups, does the draft read like 2v2 support coaching rather than an isolated support duel?",
      "- For support matchups, did it prioritize ADC protection, ADC setup, enemy ADC denial, engage or disengage timing, brush or lane space, wave state, vision, roams, and objective setup?",
      "- For support matchups, did it avoid solo-lane economy assumptions and use support-specific access, vision, peel, roam, hook, brush, or follow-up language?",
      "- For support matchups, did roaming guidance mention crash timers, ADC safety, river or mid pressure, vision, or objective rotations when relevant?",
      "- For support matchups, does danger_windows explain how the player's ADC becomes vulnerable rather than only naming enemy support damage?",
    ];
  }

  if (role === "jungle") {
    return [
      ...commonChecks,
      "- For jungle matchups, does the draft talk like jungle coaching rather than lane coaching with renamed terms?",
      "- For jungle matchups, did it use pathing, tempo, objective, river, invade, counter-jungle, gank, and scaling concepts from jungle_profile?",
      "- For jungle matchups, does trading_pattern/Jungle Plan answer what this jungler should do on the map?",
      "- For jungle matchups, did trading_pattern/Jungle Plan avoid cooldown-only duel advice, lane spacing advice, and generic engage when cooldowns are down phrasing?",
    ];
  }

  if (role === "adc") {
    return [
      ...commonChecks,
      "- For ADC matchups, does the draft read like neutral-support ADC guidance rather than full botlane or jungle guidance?",
      "- For ADC matchups, did it focus on range, wave access, CS pressure, support cooldown conditions, all-in windows, scaling, item spikes, dragon setup, and teamfight DPS?",
      "- For ADC matchups, would this advice still be correct against most ADCs? If yes, replace it with a more matchup-specific interaction.",
      "- For ADC matchups, did it prioritize matchup-specific ability, wave, CS-punish, or support-position interactions over champion-general advice?",
      "- For ADC matchups, does trading_pattern teach last-hit punishment instead of generic farm pressure?",
      "- For ADC matchups, does last-hit punishment say when the player can step forward and when support threat means they should give it up?",
      "- For ADC matchups, does trading_pattern prioritize concrete ability interactions over generic trading advice?",
      "- For ADC matchups, would a player learn a specific lane action they can apply immediately?",
      "- For ADC matchups, does overview identify the lane's deciding interaction instead of generic matchup identity?",
      "- For ADC matchups, does overview explain who wins short trades, extended trades, wave priority, scaling, early aggression, or time?",
      "- For ADC matchups, does early_game explain first-wave, level 2, CS punish, support position, or wave-size decisions?",
      "- For ADC matchups, did it use low-health minions, caster minions, cannon minions, crash timing, recall timing, or wave size when relevant?",
      "- For ADC matchups, does danger_windows name the specific ability, support position, or wave state that creates danger?",
      "- For ADC matchups, do trade windows name the exact cooldown that matters and why it changes the lane?",
      "- For ADC matchups, does power_spikes explain how the spike changes lane interactions rather than saying damage increases?",
      "- For ADC matchups, does win_conditions explain how lane interactions convert into recalls, plates, dragon setup, item lead, or teamfight access?",
      "- For ADC matchups, does the guide explain why the lane works this way rather than only listing what to do?",
      "- For ADC matchups, did it avoid specific support-pick assumptions and jungle-only terminology?",
    ];
  }

  return commonChecks;
}

function getRolePromptGuidance(role: LeagueRole) {
  if (role === "jungle") {
    return [
      "Treat this as a jungle-vs-jungle matchup, not a lane matchup.",
      "Replace lane-wave advice with first-clear tempo, camp sequencing, invade and counter-invade windows, river control, scuttle setup, objective access, gank angles, countergank risk, and skirmish rules.",
      "Use jungle_profile categories as the main source of truth: early_game_pressure, scaling, clear_speed, objective_control, dueling, gank_threat, and invade_resistance.",
      "Use lane terms only when they explain which lanes create pathing, gank, countergank, or objective opportunities.",
      "Avoid wave control, last-hitting, trading patterns, and laning pressure unless they directly affect jungle pathing or objective choices.",
      "early_game should focus on first clear, first river move, early invade safety, and when the player should avoid contesting.",
      "The trading_pattern key is displayed as Jungle Plan for jungle matchups and must answer what this jungler should try to do on the map.",
      "Jungle Plan should describe pathing strategy, first clear goals, Scuttle contest conditions, river control, invade opportunities, counter-jungling, counter-gank timing, objective setup, dragon, Void Grubs, Rift Herald, tempo management, scaling denial, and lane priority requirements before invading or contesting.",
      "Jungle Plan should not become duel instructions only, cooldown trading advice, lane-style spacing advice, or generic engage when cooldowns are down advice.",
      "danger_windows should include invade timing, isolated river fights, objective setups, low-health clears, forced smite fights, and lanes that can move first.",
      "win_conditions should explain how the player converts jungle tempo into objectives, gank pressure, counterjungling, scaling denial, or teamfight access.",
    ].join("\n");
  }

  if (role === "mid") {
    return [
      "Treat this as a mid-lane matchup.",
      "Use wave states, level breakpoints, roam timers, reset timing, river vision, and jungle threat only when they change the player's decision.",
      "Avoid long-freeze advice unless the matchup and wave state clearly support it.",
    ].join("\n");
  }

  if (role === "top") {
    return [
      "Treat this as a top-lane matchup.",
      "Use wave control, side-lane pressure, all-in windows, jungle vulnerability, teleport timing, and splitpush or teamfight identity only when supported by profiles.",
    ].join("\n");
  }

  if (role === "adc") {
    return [
      "Treat this as an ADC-vs-ADC matchup, not a full botlane matchup.",
      "Use the hybrid ADC model: primary champion comparison under neutral support conditions, with support influence described only as conditional setup.",
      "Frame advice around range advantage, wave access, CS pressure, poke windows, all-in threat, support cooldown availability, reset timing, first item spikes, dragon setup, turret pressure, scaling safety, and teamfight DPS role.",
      "For trading_pattern, prioritize last-hit punishment: explain how to hit the enemy ADC when they walk up for CS, and when support threat makes that punish too expensive.",
      "Prioritize concrete ability interactions over generic trading advice, so the player learns what to dodge, track, punish, or avoid in lane.",
      "Every ADC section should teach a specific lane interaction: ability pattern, last-hit punish, wave state, support positioning, spacing mistake, spike conversion, or objective conversion.",
      "Before writing any ADC bullet, ask whether the advice would still be correct against most ADCs; if it would, make it more matchup-specific or lower its priority.",
      "Explain lane identity: who wins short trades, who wins extended trades, who controls wave priority, who scales better, and why the lane should unfold that way.",
      "Use minion-specific reasoning when relevant: low-health minions, caster minions, cannon minions, large waves, crash timing, and recall timing.",
      "For trade windows, name the exact ability or cooldown and explain why it changes range, poke pressure, dash access, root threat, all-in safety, or support follow-up.",
      "Avoid generic coaching such as contest CS, trade aggressively, punish mistakes, maintain lane priority, control wave, avoid bad trades, respect cooldowns, or play around power spikes unless the same sentence explains the matchup-specific reason.",
      "Do not name specific support champions, support-counter lanes, or exact 2v2 outcomes unless admin notes provide that support context.",
      "Avoid jungle-specific language such as invade, camp tracking, jungle pathing, clear speed, Smite, Scuttle, Herald, Void Grubs, counter-jungle, or first clear unless admin notes explicitly require it.",
    ].join("\n");
  }

  return [
    "Treat this as a 2v2 support matchup, not a support 1v1.",
    "Frame advice around ADC access and protection, ADC follow-up, engage and disengage timing, brush control, lane space, wave state, vision, roam timers, and objective setup.",
    "When describing enemy support threats, explain how they reach the ADC or enable enemy ADC damage.",
    "When describing punish windows, explain whether Champion A should peel, deny brush, crash the wave, roam, ward, or create ADC follow-up.",
    "Never frame supports around minion-income actions; use ADC access, engage access, brush control, hook pressure, roam windows, vision control, peel opportunities, or follow-up windows instead.",
    "Avoid isolated trade advice and duel language unless the sentence clearly connects to the 2v2 lane state.",
    "For roaming supports, mention wave crash timers, ADC safety before leaving, river vision, mid pressure, and return timing.",
  ].join("\n");
}

function formatSupportIdentityMatchupContext({
  enemyChampionName,
  enemyChampionProfile,
  playerChampionName,
  playerChampionProfile,
}: {
  enemyChampionName: string;
  enemyChampionProfile?: LeagueChampionKnowledgeProfile | null;
  playerChampionName: string;
  playerChampionProfile?: LeagueChampionKnowledgeProfile | null;
}) {
  const playerArchetypes = getSupportArchetypes(playerChampionName, playerChampionProfile);
  const enemyArchetypes = getSupportArchetypes(enemyChampionName, enemyChampionProfile);

  return [
    `player_support_identity_archetypes: ${formatSupportArchetypeList(playerArchetypes)}`,
    `player_support_identity_themes: ${formatSupportArchetypeThemes(playerArchetypes)}`,
    `enemy_support_identity_archetypes: ${formatSupportArchetypeList(enemyArchetypes)}`,
    `enemy_support_identity_themes: ${formatSupportArchetypeThemes(enemyArchetypes)}`,
    `support_identity_instruction: Make ${playerChampionName} into ${enemyChampionName} feel shaped by these exact identities, not by generic support advice.`,
    formatSupportChampionIdentityNotes(playerChampionName, "player"),
    formatSupportChampionIdentityNotes(enemyChampionName, "enemy"),
  ]
    .filter(Boolean)
    .join("\n");
}

function getSupportArchetypes(
  championName: string,
  profile?: LeagueChampionKnowledgeProfile | null,
): SupportArchetype[] {
  const archetypes = new Set<SupportArchetype>(
    supportChampionArchetypeOverrides[normalizeSupportIdentityName(championName)] ?? [],
  );
  const profileNameOverride = profile?.name
    ? (supportChampionArchetypeOverrides[normalizeSupportIdentityName(profile.name)] ?? [])
    : [];

  for (const archetype of profileNameOverride ?? []) {
    archetypes.add(archetype);
  }

  const profileText = formatSupportArchetypeSourceText(profile);

  for (const archetype of supportArchetypeOrder) {
    if (
      supportArchetypeSignals[archetype].some((signal) =>
        profileText.includes(signal.toLowerCase()),
      )
    ) {
      archetypes.add(archetype);
    }
  }

  return supportArchetypeOrder.filter((archetype) => archetypes.has(archetype));
}

function formatSupportArchetypeSourceText(profile?: LeagueChampionKnowledgeProfile | null) {
  if (!profile) {
    return "";
  }

  return [
    profile.archetype,
    profile.commonWeaknesses,
    profile.dangerAbilities,
    profile.dangerProfile?.dangerousWhen,
    profile.dangerProfile?.mustRespect,
    profile.hardCrowdControl,
    profile.importantAbilityNotes,
    profile.lanePlan?.avoids,
    profile.lanePlan?.wants,
    profile.matchupPreferences?.strongInto,
    profile.matchupPreferences?.weakInto,
    profile.primaryTradingPattern,
    profile.primaryWinCondition,
    profile.punishProfile?.canPunish,
    profile.punishWindows,
    profile.softCrowdControl,
    profile.strategicIdentity?.laneGoal,
    profile.strategicIdentity?.winMethod,
    profile.supportSynergy?.excellentWith,
    profile.supportSynergy?.goodWith,
    profile.supportSynergy?.notes,
    profile.supportSynergy?.strugglesWith,
    profile.trading?.badTradeConditions,
    profile.trading?.goodTradeConditions,
    profile.trading?.primaryPattern,
  ]
    .flat()
    .filter((value): value is string => typeof value === "string")
    .join(" ")
    .toLowerCase();
}

function formatSupportArchetypeList(archetypes: readonly SupportArchetype[]) {
  return archetypes.length > 0 ? archetypes.join("; ") : "not supplied";
}

function formatSupportArchetypeThemes(archetypes: readonly SupportArchetype[]) {
  if (archetypes.length === 0) {
    return "not supplied";
  }

  return archetypes
    .map((archetype) => `${archetype}: ${supportArchetypeThemes[archetype]}`)
    .join("; ");
}

function formatSupportChampionIdentityNotes(championName: string, perspective: "enemy" | "player") {
  const normalizedName = normalizeSupportIdentityName(championName);
  const subject = perspective === "player" ? "player champion" : "enemy champion";

  if (normalizedName === "pyke") {
    return `${subject}_identity_note: Pyke guidance should prioritize roam timers, river control, missing support pings, vision denial, forcing Pyke to stay lane, and punishing failed roams.`;
  }

  if (normalizedName === "bard") {
    return `${subject}_identity_note: Bard guidance should prioritize wave-crash roam windows, chime timing, portal angles, ADC isolation risk, river vision, and mid pressure.`;
  }

  if (normalizedName === "blitzcrank") {
    return `${subject}_identity_note: Blitzcrank guidance should prioritize hook angles, fog pressure, brush denial, and ADC positioning discipline.`;
  }

  return "";
}

function normalizeSupportIdentityName(championName: string) {
  return championName.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function formatChampionKnowledgeForPrompt(
  championName: string,
  profile?: LeagueChampionKnowledgeProfile | null,
) {
  if (!profile) {
    return [
      `name: ${championName}`,
      "profile_status: missing",
      "combat_profile_status: missing",
      "constraint: Avoid specific ability, crowd control, sustain, shield, stealth, item, or spike claims unless admin notes provide them.",
    ].join("\n");
  }

  return [
    `name: ${profile.name}`,
    "profile_status: supplied",
    "combat_profile_status: supplied",
    `profile_quality: ${profile.profileQuality}`,
    `mastery_difficulty: ${profile.masteryDifficulty ?? "not supplied"}`,
    `ability_map: ${formatAbilityMap(profile.abilities)}`,
    `primary_roles: ${formatOptionalList(profile.primaryRoles)}`,
    `secondary_roles: ${formatOptionalList(profile.secondaryRoles)}`,
    `off_meta_roles: ${formatOptionalList(profile.offMetaRoles)}`,
    `damage_type: ${profile.damageType ?? "not supplied"}`,
    `archetype: ${formatOptionalList(profile.archetype)}`,
    `support_identity_archetypes: ${formatSupportArchetypeList(
      getSupportArchetypes(profile.name, profile),
    )}`,
    `mobility_level: ${profile.mobilityLevel ?? "not supplied"}`,
    `hard_crowd_control: ${formatOptionalList(profile.hardCrowdControl)}`,
    `soft_crowd_control: ${formatOptionalList(profile.softCrowdControl)}`,
    `danger_abilities: ${formatOptionalList(profile.dangerAbilities)}`,
    `stealth_or_invisibility: ${formatOptionalText(profile.stealthOrInvisibility, "none")}`,
    `sustain: ${formatOptionalList(profile.sustain)}`,
    `shields: ${formatOptionalList(profile.shields)}`,
    `jungle_profile.early_game_pressure: ${formatJungleProfileCategory(
      profile.jungleProfile?.earlyGamePressure,
    )}`,
    `jungle_profile.scaling: ${formatJungleProfileCategory(profile.jungleProfile?.scaling)}`,
    `jungle_profile.clear_speed: ${formatJungleProfileCategory(profile.jungleProfile?.clearSpeed)}`,
    `jungle_profile.objective_control: ${formatJungleProfileCategory(
      profile.jungleProfile?.objectiveControl,
    )}`,
    `jungle_profile.dueling: ${formatJungleProfileCategory(profile.jungleProfile?.dueling)}`,
    `jungle_profile.gank_threat: ${formatJungleProfileCategory(profile.jungleProfile?.gankThreat)}`,
    `jungle_profile.invade_resistance: ${formatJungleProfileCategory(
      profile.jungleProfile?.invadeResistance,
    )}`,
    `jungle_profile.pathing_notes: ${formatOptionalList(profile.jungleProfile?.pathingNotes)}`,
    `jungle_profile.matchup_focus: ${formatOptionalList(profile.jungleProfile?.matchupFocus)}`,
    `lane_plan.wants: ${formatOptionalList(profile.lanePlan?.wants)}`,
    `lane_plan.avoids: ${formatOptionalList(profile.lanePlan?.avoids)}`,
    `lane_plan.ideal_lane_state: ${profile.lanePlan?.idealLaneState ?? "not supplied"}`,
    `lane_identity.early_game_agency: ${formatLaneIdentityField(
      profile.laneIdentity,
      "earlyGameAgency",
    )}`,
    `lane_identity.scaling_priority: ${formatLaneIdentityField(
      profile.laneIdentity,
      "scalingPriority",
    )}`,
    `lane_identity.lane_pressure: ${formatLaneIdentityField(profile.laneIdentity, "lanePressure")}`,
    `lane_identity.preferred_game_state: ${formatLaneIdentityList(
      profile.laneIdentity,
      "preferredGameState",
    )}`,
    `lane_identity.win_lane_by: ${formatLaneIdentityList(profile.laneIdentity, "winLaneBy")}`,
    `trading.primary_pattern: ${profile.trading?.primaryPattern ?? "not supplied"}`,
    `trading.good_trade_conditions: ${formatOptionalList(profile.trading?.goodTradeConditions)}`,
    `trading.bad_trade_conditions: ${formatOptionalList(profile.trading?.badTradeConditions)}`,
    `matchup_preferences.strong_into: ${formatOptionalList(
      profile.matchupPreferences?.strongInto,
    )}`,
    `matchup_preferences.weak_into: ${formatOptionalList(profile.matchupPreferences?.weakInto)}`,
    `counter_relationships.counters: ${formatCounterRelationships(profile.counters)}`,
    `counter_relationships.countered_by: ${formatCounterRelationships(profile.counteredBy)}`,
    `support_synergy.excellent_with: ${formatOptionalList(profile.supportSynergy?.excellentWith)}`,
    `support_synergy.good_with: ${formatOptionalList(profile.supportSynergy?.goodWith)}`,
    `support_synergy.struggles_with: ${formatOptionalList(profile.supportSynergy?.strugglesWith)}`,
    `support_synergy.notes: ${formatOptionalList(profile.supportSynergy?.notes)}`,
    `danger_profile.dangerous_when: ${formatOptionalList(profile.dangerProfile?.dangerousWhen)}`,
    `danger_profile.must_respect: ${formatOptionalList(profile.dangerProfile?.mustRespect)}`,
    `punish_profile.can_punish: ${formatOptionalList(profile.punishProfile?.canPunish)}`,
    `punish_profile.struggles_to_punish: ${formatOptionalList(
      profile.punishProfile?.strugglesToPunish,
    )}`,
    `power_spikes.major: ${formatPowerSpikes(profile.powerSpikes?.major)}`,
    `power_spikes.minor: ${formatPowerSpikes(profile.powerSpikes?.minor)}`,
    `strategic_identity.lane_goal: ${profile.strategicIdentity?.laneGoal ?? "not supplied"}`,
    `strategic_identity.scaling_profile: ${
      profile.strategicIdentity?.scalingProfile ?? "not supplied"
    }`,
    `strategic_identity.preferred_game_length: ${
      profile.strategicIdentity?.preferredGameLength ?? "not supplied"
    }`,
    `strategic_identity.win_method: ${formatOptionalList(profile.strategicIdentity?.winMethod)}`,
    `primary_trading_pattern: ${profile.primaryTradingPattern ?? "not supplied"}`,
    `primary_win_conditions: ${formatOptionalList(profile.primaryWinCondition)}`,
    `punish_windows: ${formatOptionalList(profile.punishWindows)}`,
    `lane_identity_summary: ${formatLaneIdentitySummary(profile.laneIdentity)}`,
    `major_power_spikes: ${formatOptionalList(profile.majorPowerSpikes)}`,
    `important_ability_notes: ${formatOptionalList(profile.importantAbilityNotes)}`,
    `common_weaknesses: ${formatOptionalList(profile.commonWeaknesses)}`,
  ].join("\n");
}

function formatList(values: readonly string[]) {
  return values.length > 0 ? values.join("; ") : "none";
}

function formatOptionalList(values?: readonly string[]) {
  return values && values.length > 0 ? formatList(values) : "not supplied";
}

function formatCounterRelationships(
  relationships?: readonly {
    champion: string;
    reasons: readonly string[];
  }[],
) {
  if (!relationships || relationships.length === 0) {
    return "not supplied";
  }

  return relationships
    .map((relationship) => {
      const reasons = relationship.reasons.length > 0 ? formatList(relationship.reasons) : "none";

      return `${relationship.champion}: ${reasons}`;
    })
    .join(" || ");
}

function formatExistingSections(existingSections?: Partial<MatchupDraftSections> | null) {
  if (!existingSections) {
    return "not supplied";
  }

  const lines = matchupDraftSectionKeys.map((key) => {
    const value = existingSections[key]?.trim();

    return `${key}: ${value || "not supplied"}`;
  });

  return lines.join("\n");
}

function formatPowerSpikes(spikes?: readonly LeagueChampionPowerSpike[]) {
  if (!spikes || spikes.length === 0) {
    return "not supplied";
  }

  return spikes
    .map((spike) =>
      [
        `timing=${spike.timing}`,
        `reason=${spike.reason}`,
        `changes_gameplay=${spike.changesGameplay}`,
        `player_action=${spike.playerAction}`,
        `enemy_response=${spike.enemyResponse ?? "not supplied"}`,
      ].join(" | "),
    )
    .join("; ");
}

function formatJungleProfileCategory(category?: LeagueChampionJungleProfileCategory) {
  if (!category) {
    return "not supplied";
  }

  return `rating=${category.rating} | notes=${formatList(category.notes)}`;
}

function formatAbilityMap(abilities: LeagueChampionKnowledgeProfile["abilities"]) {
  if (!abilities) {
    return "not supplied";
  }

  return [`Q=${abilities.Q}`, `W=${abilities.W}`, `E=${abilities.E}`, `R=${abilities.R}`].join(
    "; ",
  );
}

function formatOptionalText(value: string | null | undefined, nullFallback = "not supplied") {
  if (value === undefined) {
    return "not supplied";
  }

  return value ?? nullFallback;
}

function formatLaneIdentityField(
  laneIdentity: LeagueChampionKnowledgeProfile["laneIdentity"],
  field: "earlyGameAgency" | "lanePressure" | "scalingPriority",
) {
  if (!laneIdentity || typeof laneIdentity === "string") {
    return "not supplied";
  }

  return laneIdentity[field];
}

function formatLaneIdentityList(
  laneIdentity: LeagueChampionKnowledgeProfile["laneIdentity"],
  field: "preferredGameState" | "winLaneBy",
) {
  if (!laneIdentity || typeof laneIdentity === "string") {
    return "not supplied";
  }

  return formatOptionalList(laneIdentity[field]);
}

function formatLaneIdentitySummary(laneIdentity: LeagueChampionKnowledgeProfile["laneIdentity"]) {
  if (!laneIdentity) {
    return "not supplied";
  }

  if (typeof laneIdentity === "string") {
    return laneIdentity;
  }

  return [
    `early agency ${laneIdentity.earlyGameAgency}`,
    `scaling ${laneIdentity.scalingPriority}`,
    `lane pressure ${laneIdentity.lanePressure}`,
  ].join("; ");
}
