import type { LeagueAbilityVarMetadata, LeagueChampionAbilityMetadata } from "./abilities";

export type CompactAbilityTooltipDetail = {
  label: "Damage" | "Effect";
  values: string[];
};

export type CompactAbilityTooltipStat = {
  label: "Cooldown" | "Cost";
  value: string;
};

export type CompactAbilityTooltip = {
  description: string;
  details: CompactAbilityTooltipDetail[];
  metaText: string;
  stats: CompactAbilityTooltipStat[];
};

const damageTagLabels: Record<string, string> = {
  magicdamage: "Magic",
  physicaldamage: "Physical",
  truedamage: "True",
};

const genericDamagePlaceholders = new Set([
  "damage",
  "tooltipdamage",
  "tooltiptotaldamage",
  "totaldamage",
  "totaldamagetooltip",
  "totaldamagett",
]);

const damageValueOverrides: Record<string, Record<string, string>> = {
  AhriE: {
    totaldamage: "80 / 110 / 140 / 170 / 200 (+60% AP)",
  },
  AhriQ: {
    totaldamage: "35 / 60 / 85 / 110 / 135 (+50% AP)",
  },
};

const effectTagLabels: Record<string, string> = {
  healing: "heal",
  shield: "shield",
  speed: "move speed",
  status: "",
};

const statusNormalizations: Array<[RegExp, string]> = [
  [/\bcharms?\b/i, "Charm"],
  [/\bknocking up\b|\bknocked up\b|\bknock up\b/i, "Knock Up"],
  [/\bslowing\b|\bslowed\b|\bslow\b/i, "Slow"],
  [/\bstunning\b|\bstunned\b|\bstun\b/i, "Stun"],
  [/\brooting\b|\brooted\b|\broot\b/i, "Root"],
  [/\bsilencing\b|\bsilenced\b|\bsilence\b/i, "Silence"],
  [/\bfearing\b|\bfeared\b|\bfear\b/i, "Fear"],
  [/\bpulling\b|\bpulled\b|\bpull\b/i, "Pull"],
  [/\bdisarming\b|\bdisarmed\b|\bdisarm\b/i, "Disarm"],
  [/\bblinding\b|\bblinded\b|\bblind\b/i, "Blind"],
  [/\bsuppression\b|\bsuppressed\b|\bsuppress\b/i, "Suppression"],
];

export function getCompactAbilityTooltip(
  ability: LeagueChampionAbilityMetadata,
  championId: string,
): CompactAbilityTooltip {
  const rawTooltip = stripUnusedDataDragonFragments(ability.tooltip || ability.description);
  const damageBreakdown = getDamageBreakdown(rawTooltip, ability);
  const damageSummary = damageBreakdown.summary;
  const effectSummary = getEffectSummary(rawTooltip);
  const description = getGameplayDescription({
    championId,
    damageSummary,
    effectSummary,
    fallbackText: ability.description || ability.tooltip,
    rawTooltip,
  });

  return {
    description,
    details: [
      damageBreakdown.lines.length > 0
        ? { label: "Damage", values: damageBreakdown.lines }
        : null,
      effectSummary ? { label: "Effect", values: [effectSummary] } : null,
    ].filter((detail): detail is CompactAbilityTooltipDetail => Boolean(detail)),
    metaText: getAbilityMetaText(ability),
    stats: getAbilityStats(ability),
  };
}

export function cleanDataDragonText(value: string) {
  return cleanDataDragonMarkup(value)
    .replace(/\{\{[^}]+\}\}/g, "")
    .replace(/\s+([.,;:!?])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function getAbilityMetaText(ability: LeagueChampionAbilityMetadata) {
  return getAbilityStats(ability)
    .map((stat) => `${stat.label}: ${stat.value}`)
    .join(" / ");
}

function getAbilityStats(ability: LeagueChampionAbilityMetadata): CompactAbilityTooltipStat[] {
  return [
    ability.cooldownBurn
      ? { label: "Cooldown" as const, value: formatCooldown(ability.cooldownBurn) }
      : null,
    { label: "Cost" as const, value: formatCost(ability) },
  ].filter((stat): stat is CompactAbilityTooltipStat => Boolean(stat?.value));
}

function formatCooldown(value: string) {
  return `${formatRankedNumberText(value)}s`;
}

function formatCost(ability: LeagueChampionAbilityMetadata) {
  const cleanedCost = formatRankedNumberText(cleanDataDragonText(ability.costBurn ?? ""));
  const cleanedCostType = getAbilityResourceType(ability);

  if (!cleanedCost || cleanedCost === "0") {
    return cleanedCostType && /no\s*cost/i.test(cleanedCostType) ? "No cost" : "";
  }

  return [cleanedCost, cleanedCostType].filter(Boolean).join(" ");
}

function getGameplayDescription({
  championId,
  damageSummary,
  effectSummary,
  fallbackText,
  rawTooltip,
}: {
  championId: string;
  damageSummary: string;
  effectSummary: string;
  fallbackText: string;
  rawTooltip: string;
}) {
  const primaryEffect = effectSummary.split(", ")[0] ?? "";
  const targetText = getTargetText(rawTooltip);
  const timingDescription = getDamageTimingDescription(fallbackText, championId);

  if (primaryEffect === "Shield" && damageSummary) {
    return `Grants a shield and deals ${damageSummary.toLowerCase()}.`;
  }

  if (primaryEffect === "Shield") {
    return "Grants a shield.";
  }

  if (primaryEffect === "Heal" && damageSummary) {
    return `Heals and deals ${damageSummary.toLowerCase()}.`;
  }

  if (primaryEffect === "Heal") {
    return "Heals.";
  }

  if (primaryEffect === "Move Speed" && damageSummary) {
    return `Deals ${damageSummary.toLowerCase()} and grants move speed.`;
  }

  if (primaryEffect === "Move Speed") {
    return "Grants move speed.";
  }

  if (primaryEffect && damageSummary) {
    return `${toEffectVerb(primaryEffect)} ${targetText} and deals ${damageSummary.toLowerCase()}.`;
  }

  if (primaryEffect) {
    return `${toEffectVerb(primaryEffect)} ${targetText}.`;
  }

  if (timingDescription) {
    return timingDescription;
  }

  if (damageSummary) {
    return `Deals ${damageSummary.toLowerCase()}.`;
  }

  return shortenDescription(
    removeChampionLead(cleanDataDragonText(rawTooltip || fallbackText), championId),
    150,
  );
}

function getDamageBreakdown(rawTooltip: string, ability: LeagueChampionAbilityMetadata) {
  const damageTaggedValues = getTaggedValues(rawTooltip).filter(({ tag }) => damageTagLabels[tag]);
  const shouldAllowGenericEffectBurnMatch = damageTaggedValues.length === 1;
  const components = damageTaggedValues
    .map(({ afterText, tag, text }) => {
      const breakdown = getResolvedDamageText(text, ability, {
        allowGenericEffectBurnMatch: shouldAllowGenericEffectBurnMatch,
      });

      return {
        breakdown,
        componentLabel: getDamageComponentLabel(afterText),
        text,
        type: damageTagLabels[tag],
      };
    })
    .filter(({ type }) => Boolean(type));

  const resolvedComponents = components.filter(({ breakdown }) => breakdown);

  if (resolvedComponents.length > 0) {
    const lines = unique(
      resolvedComponents.map(({ breakdown, componentLabel, type }) =>
        formatDamageLine({
          breakdown,
          componentLabel,
          includeComponentLabel: resolvedComponents.length > 1,
          type,
        }),
      ),
    );

    return {
      lines,
      summary: unique(components.map(({ type }) => `${type} Damage`)).join(" + "),
    };
  }

  const fallbackTypes = unique(components.map(({ type }) => `${type.toLowerCase()} damage`));

  warnAboutMissingDamageExtraction(ability, components);

  return {
    lines: fallbackTypes,
    summary: fallbackTypes.join(" + "),
  };
}

function getEffectSummary(rawTooltip: string) {
  const values = getTaggedValues(rawTooltip)
    .filter(({ tag }) => tag === "status" || Boolean(effectTagLabels[tag]))
    .map(({ tag, text }) => getEffectText(tag, text))
    .filter(Boolean);

  return unique(values).join(", ");
}

function getTaggedValues(rawTooltip: string) {
  const matches = Array.from(rawTooltip.matchAll(/<([a-zA-Z]+)>(.*?)<\/\1>/g));

  return matches.map((match) => ({
    afterText: rawTooltip.slice(
      (match.index ?? 0) + match[0].length,
      matches.find((candidate) => (candidate.index ?? 0) > (match.index ?? 0))?.index,
    ),
    tag: match[1]?.toLowerCase() ?? "",
    text: cleanDataDragonMarkup(match[2] ?? "")
      .replace(/\s+/g, " ")
      .trim(),
  }));
}

function getResolvedDamageText(
  text: string,
  ability: LeagueChampionAbilityMetadata,
  options: { allowGenericEffectBurnMatch: boolean },
) {
  const resolvedText = resolveDataDragonPlaceholders(text, ability, options);
  const numericBreakdown = getNumericBreakdown(resolvedText);

  if (numericBreakdown) {
    return numericBreakdown;
  }

  return "";
}

function resolveDataDragonPlaceholders(
  value: string,
  ability: LeagueChampionAbilityMetadata,
  options: { allowGenericEffectBurnMatch: boolean },
) {
  return cleanDataDragonMarkup(value).replace(
    /\{\{\s*([^}]+?)\s*\}\}/g,
    (_match, rawExpression) => {
      const resolvedValue = resolveDataDragonExpression(String(rawExpression), ability, options);

      return resolvedValue || "";
    },
  );
}

function resolveDataDragonExpression(
  rawExpression: string,
  ability: LeagueChampionAbilityMetadata,
  options: { allowGenericEffectBurnMatch: boolean },
) {
  const expression = rawExpression.trim();
  const normalizedExpression = expression.toLowerCase();
  const variableValue = resolveDataDragonVariable(expression, ability);

  if (variableValue) {
    return variableValue;
  }

  const overrideValue = damageValueOverrides[ability.id]?.[normalizedExpression];

  if (overrideValue) {
    return overrideValue;
  }

  const multipliedExpression = expression.match(/^([a-zA-Z0-9_]+)\s*\*\s*(\d+(?:\.\d+)?)$/);

  if (multipliedExpression) {
    const baseNumber = resolveDataDragonVariableNumber(multipliedExpression[1] ?? "", ability);
    const multiplier = Number(multipliedExpression[2]);

    if (typeof baseNumber === "number") {
      return formatNumber(baseNumber * multiplier);
    }

    const baseValue = resolveDataDragonVariable(multipliedExpression[1] ?? "", ability);

    return multiplyFormattedNumbers(baseValue, multiplier);
  }

  if (options.allowGenericEffectBurnMatch && genericDamagePlaceholders.has(normalizedExpression)) {
    return getBestGenericDamageValue(ability, normalizedExpression);
  }

  return "";
}

function resolveDataDragonVariable(
  key: string,
  ability: LeagueChampionAbilityMetadata,
) {
  const normalizedKey = key.trim().toLowerCase();
  const variable = ability.vars?.find((candidate) => candidate.key.toLowerCase() === normalizedKey);
  const variableValue = variable ? formatDataDragonVariable(variable) : "";

  if (variableValue) {
    return variableValue;
  }

  const dataValue = ability.datavalues?.[normalizedKey];

  if (typeof dataValue === "number") {
    return formatNumber(dataValue);
  }

  if (typeof dataValue === "string") {
    return formatRankedNumberText(dataValue);
  }

  const effectIndex = normalizedKey.match(/^(?:e|effect)(\d+)(?:amount)?$/)?.[1];

  if (effectIndex) {
    return getEffectBurnValue(ability, Number(effectIndex));
  }

  return "";
}

function resolveDataDragonVariableNumber(
  key: string,
  ability: LeagueChampionAbilityMetadata,
) {
  const normalizedKey = key.trim().toLowerCase();
  const variable = ability.vars?.find((candidate) => candidate.key.toLowerCase() === normalizedKey);

  return typeof variable?.coeff === "number" ? variable.coeff : null;
}

function formatDataDragonVariable(variable: LeagueAbilityVarMetadata) {
  if (Array.isArray(variable.coeff)) {
    return formatNumberList(variable.coeff);
  }

  if (typeof variable.coeff === "number") {
    const linkLabel = getScalingLabel(variable.link);

    if (linkLabel) {
      return `+${formatPercent(variable.coeff)} ${linkLabel}`;
    }

    return formatNumber(variable.coeff);
  }

  return "";
}

function getEffectBurnValue(ability: LeagueChampionAbilityMetadata, index: number) {
  const burnValue = ability.effectBurn?.[index];

  if (burnValue && burnValue !== "0") {
    return burnValue;
  }

  const effectValue = ability.effect?.[index];

  if (Array.isArray(effectValue)) {
    return formatNumberList(effectValue);
  }

  if (typeof effectValue === "number" && effectValue !== 0) {
    return formatNumber(effectValue);
  }

  return "";
}

function getNumericBreakdown(value: string) {
  const cleanedValue = cleanDamageText(value);
  const numericMatch = cleanedValue.match(
    /(?:\d+(?:\.\d+)?(?:\s*\/\s*\d+(?:\.\d+)?)*|\+\d+(?:\.\d+)?%?\s+[A-Za-z ]+)(?:\s*\([^)]+\))?/,
  );

  if (!numericMatch) {
    return "";
  }

  return cleanedValue
    .replace(/\b(?:magic|physical|true|mixed)?\s*damage\b/gi, "")
    .replace(/\s*\/\s*/g, " / ")
    .replace(/\(\s*\+/g, "(+")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanDamageText(value: string) {
  return cleanDataDragonText(value)
    .replace(/\s*\+\s*([A-Z]{1,8})\b/g, " (+$1")
    .replace(/\)\s*\)/g, ")")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDamageLine({
  breakdown,
  componentLabel,
  includeComponentLabel,
  type,
}: {
  breakdown: string;
  componentLabel: string;
  includeComponentLabel: boolean;
  type: string;
}) {
  const damageText = `${breakdown} ${type.toLowerCase()} damage`;

  return includeComponentLabel ? `${componentLabel || type}: ${damageText}` : damageText;
}

function getDamageComponentLabel(afterText: string) {
  const cleanContext = cleanDataDragonText(afterText).toLowerCase();

  if (/\bon the way out\b|\boutgoing\b/.test(cleanContext)) {
    return "Outgoing";
  }

  if (/\bon the way back\b|\breturn(?:ing)?\b/.test(cleanContext)) {
    return "Return";
  }

  if (/\bper second\b|\beach second\b/.test(cleanContext)) {
    return "Per second";
  }

  if (/\bon arrival\b|\bupon arrival\b/.test(cleanContext)) {
    return "On arrival";
  }

  return "";
}

function getBestGenericDamageValue(ability: LeagueChampionAbilityMetadata, placeholder: string) {
  const baseDamage = getBestNumericEffectBurnValue(ability, placeholder);

  if (!baseDamage) {
    return "";
  }

  const scalingText = getDamageScalingText(ability);

  return [baseDamage, scalingText ? `(${scalingText})` : null].filter(Boolean).join(" ");
}

function getBestNumericEffectBurnValue(ability: LeagueChampionAbilityMetadata, placeholder: string) {
  const candidates = (ability.effectBurn ?? [])
    .map((value) => ({
      value: typeof value === "string" ? formatRankedNumberText(value) : "",
    }))
    .filter(({ value }) => isPlausibleDamageEffectBurnValue(value, ability.maxrank))
    .map((value) => ({
      score: getRankedNumberScore(value.value, placeholder),
      value: value.value,
    }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score);

  return candidates[0]?.value ?? "";
}

function isPlausibleDamageEffectBurnValue(value: string, maxrank = 0) {
  if (!value || value === "0" || !/\d/.test(value) || /-/.test(value)) {
    return false;
  }

  const numbers = value.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  const expectedRankCount = maxrank > 0 ? maxrank : numbers.length;

  if (numbers.length < 3 || numbers.length !== expectedRankCount) {
    return false;
  }

  const highestValue = Math.max(...numbers);
  const averageValue = numbers.reduce((sum, number) => sum + number, 0) / numbers.length;

  return highestValue <= 500 && (highestValue >= 20 || averageValue >= 10);
}

function getRankedNumberScore(value: string, placeholder: string) {
  const numbers = value.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];

  if (numbers.length === 0 || numbers.every((number) => number === 0)) {
    return 0;
  }

  const placeholderBonus = /damage|dmg/.test(placeholder) ? 1000 : 0;

  return placeholderBonus + numbers.reduce((sum, number) => sum + number, 0);
}

function getDamageScalingText(ability: LeagueChampionAbilityMetadata) {
  const scalingValues = unique(
    (ability.vars ?? [])
      .map((variable) =>
        typeof variable.coeff === "number" && getScalingLabel(variable.link)
          ? formatDataDragonVariable(variable)
          : "",
      )
      .filter(Boolean),
  );

  return scalingValues.join(" + ");
}

function warnAboutMissingDamageExtraction(
  ability: LeagueChampionAbilityMetadata,
  components: Array<{ breakdown: string; text: string; type: string }>,
) {
  if (process.env.NODE_ENV === "production" || components.length === 0) {
    return;
  }

  const unresolvedComponents = components.filter(({ breakdown }) => !breakdown);

  if (unresolvedComponents.length === 0) {
    return;
  }

  const effectBurnCandidates = (ability.effectBurn ?? []).filter(
    (value): value is string => Boolean(value && value !== "0" && /\d/.test(value)),
  );
  const vars = ability.vars ?? [];

  console.warn("AbilityHover could not extract numeric damage values", {
    abilityId: ability.id,
    abilityName: ability.name,
    damageTypes: unique(unresolvedComponents.map(({ type }) => `${type.toLowerCase()} damage`)),
    effectBurnCandidates,
    unresolvedText: unresolvedComponents.map(({ text }) => text),
    vars,
  });
}

function formatRankedNumberText(value: string) {
  return value.replace(/\s*\/\s*/g, " / ").trim();
}

function getAbilityResourceType(ability: LeagueChampionAbilityMetadata) {
  const costType = ability.costType ?? "";
  const cleanedCostType = cleanDataDragonText(costType);

  if (!cleanedCostType || /\{\{\s*abilityresourcename\s*\}\}/i.test(costType)) {
    return cleanDataDragonText(ability.resourceType ?? "");
  }

  if (/\{\{/.test(costType) && /%/.test(cleanedCostType)) {
    return cleanDataDragonText(ability.resourceType ?? "") || cleanedCostType.replace(/\s*%\s*/g, " ");
  }

  return cleanedCostType;
}

function multiplyFormattedNumbers(value: string, multiplier: number) {
  if (!value) {
    return "";
  }

  return value.replace(/\d+(?:\.\d+)?/g, (match) => formatNumber(Number(match) * multiplier));
}

function getScalingLabel(value = "") {
  const normalizedValue = value.toLowerCase();

  if (normalizedValue.includes("spelldamage") || normalizedValue.includes("ap")) {
    return "AP";
  }

  if (normalizedValue.includes("bonusattackdamage") || normalizedValue.includes("bonusad")) {
    return "bonus AD";
  }

  if (normalizedValue.includes("attackdamage") || normalizedValue.includes("totalad")) {
    return "AD";
  }

  if (normalizedValue.includes("health")) {
    return "health";
  }

  return "";
}

function formatNumberList(values: number[]) {
  return values.map(formatNumber).join(" / ");
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

function formatPercent(value: number) {
  return `${formatNumber(value * 100)}%`;
}

function getEffectText(tag: string, text: string) {
  if (tag !== "status") {
    return titleCase(effectTagLabels[tag] ?? "");
  }

  return normalizeStatusText(text);
}

function normalizeStatusText(value: string) {
  for (const [pattern, label] of statusNormalizations) {
    if (pattern.test(value)) {
      return label;
    }
  }

  return titleCase(value);
}

function getTargetText(rawTooltip: string) {
  const cleanTooltip = cleanDataDragonText(rawTooltip).toLowerCase();

  if (cleanTooltip.includes("first enemy hit")) {
    return "the first enemy hit";
  }

  if (cleanTooltip.includes("nearby enemies")) {
    return "nearby enemies";
  }

  if (cleanTooltip.includes("all enemies")) {
    return "enemies hit";
  }

  return "enemies hit";
}

function getDamageTimingDescription(value: string, championId: string) {
  const cleanedDescription = removeChampionLead(cleanDataDragonText(value), championId);
  const damageTiming = cleanedDescription.match(/\bdealing\s+([^.!?]+?back)\b/i)?.[1];

  if (
    damageTiming &&
    /\b(?:magic|physical|true|mixed) damage\b/i.test(damageTiming) &&
    /\bon the way\b/i.test(damageTiming)
  ) {
    return `Deals ${damageTiming}.`;
  }

  return "";
}

function toEffectVerb(effect: string) {
  switch (effect) {
    case "Charm":
      return "Charms";
    case "Knock Up":
      return "Knocks up";
    case "Slow":
      return "Slows";
    case "Stun":
      return "Stuns";
    case "Root":
      return "Roots";
    case "Silence":
      return "Silences";
    case "Fear":
      return "Fears";
    case "Pull":
      return "Pulls";
    default:
      return `Applies ${effect.toLowerCase()} to`;
  }
}

function stripUnusedDataDragonFragments(value: string) {
  return value.replace(/\{\{\s*spellmodifierdescriptionappend\s*\}\}/gi, "");
}

function removeChampionLead(value: string, championId: string) {
  const championPattern = championId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return value
    .replace(new RegExp(`^${championPattern}\\s+`, "i"), "")
    .replace(/^(?:active|passive):\s*/i, "")
    .trim();
}

function shortenDescription(value: string, maxLength: number) {
  const firstSentence = value.match(/.*?[.!?](?:\s|$)/)?.[0]?.trim() || value.trim();

  if (firstSentence.length <= maxLength) {
    return firstSentence;
  }

  return `${firstSentence.slice(0, maxLength - 3).trimEnd()}...`;
}

function titleCase(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1).toLowerCase()}`)
    .join(" ");
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function cleanDataDragonMarkup(value: string) {
  return decodeHtmlEntities(value)
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ");
}
