import type { LeagueAbilityVarMetadata, LeagueChampionAbilityMetadata } from "./abilities";

export type CompactAbilityTooltipDetail = {
  label: "Damage breakdown" | "Effect";
  values: string[];
};

export type CompactAbilityTooltip = {
  description: string;
  details: CompactAbilityTooltipDetail[];
  metaText: string;
};

const damageTagLabels: Record<string, string> = {
  magicdamage: "Magic",
  physicaldamage: "Physical",
  truedamage: "True",
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
        ? { label: "Damage breakdown", values: damageBreakdown.lines }
        : null,
      effectSummary ? { label: "Effect", values: [effectSummary] } : null,
    ].filter((detail): detail is CompactAbilityTooltipDetail => Boolean(detail)),
    metaText: getAbilityMetaText(ability),
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
  return [
    ability.cooldownBurn ? `${ability.cooldownBurn}s` : null,
    ability.costBurn && ability.costBurn !== "0"
      ? [ability.costBurn, cleanDataDragonText(ability.costType ?? "")].filter(Boolean).join(" ")
      : null,
  ]
    .filter(Boolean)
    .join(" / ");
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
  const components = getTaggedValues(rawTooltip)
    .filter(({ tag }) => damageTagLabels[tag])
    .map(({ tag, text }) => ({
      breakdown: getResolvedDamageText(text, ability),
      type: damageTagLabels[tag],
    }))
    .filter(({ type }) => Boolean(type));

  const resolvedComponents = components.filter(({ breakdown }) => breakdown);

  if (resolvedComponents.length > 0) {
    const lines = unique(
      resolvedComponents.map(({ breakdown, type }) =>
        resolvedComponents.length > 1
          ? `${type}: ${breakdown}`
          : `${breakdown} ${type.toLowerCase()} damage`,
      ),
    );

    return {
      lines,
      summary: unique(components.map(({ type }) => `${type} Damage`)).join(" + "),
    };
  }

  const fallbackTypes = unique(components.map(({ type }) => `${type} Damage`));

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
  return Array.from(rawTooltip.matchAll(/<([a-zA-Z]+)>(.*?)<\/\1>/g), (match) => ({
    tag: match[1]?.toLowerCase() ?? "",
    text: cleanDataDragonMarkup(match[2] ?? "")
      .replace(/\s+/g, " ")
      .trim(),
  }));
}

function getResolvedDamageText(text: string, ability: LeagueChampionAbilityMetadata) {
  const resolvedText = resolveDataDragonPlaceholders(text, ability);
  const numericBreakdown = getNumericBreakdown(resolvedText);

  if (numericBreakdown) {
    return numericBreakdown;
  }

  return "";
}

function resolveDataDragonPlaceholders(value: string, ability: LeagueChampionAbilityMetadata) {
  return cleanDataDragonMarkup(value).replace(
    /\{\{\s*([^}]+?)\s*\}\}/g,
    (_match, rawExpression) => {
      const resolvedValue = resolveDataDragonExpression(String(rawExpression), ability);

      return resolvedValue || "";
    },
  );
}

function resolveDataDragonExpression(
  rawExpression: string,
  ability: LeagueChampionAbilityMetadata,
) {
  const expression = rawExpression.trim();
  const variableValue = resolveDataDragonVariable(expression, ability);

  if (variableValue) {
    return variableValue;
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

  const effectIndex = normalizedKey.match(/^(?:e|effect)(\d+)$/)?.[1];

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
