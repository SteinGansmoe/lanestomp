import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

if (!process.env.ABILITY_DAMAGE_COVERAGE_CHILD) {
  const result = spawnSync(
    process.execPath,
    [
      "--experimental-strip-types",
      "--experimental-specifier-resolution=node",
      fileURLToPath(import.meta.url),
    ],
    {
      env: { ...process.env, ABILITY_DAMAGE_COVERAGE_CHILD: "1" },
      stdio: "inherit",
    },
  );

  process.exit(result.status ?? 1);
}

const { getCompactAbilityTooltip } = await import(
  "../src/features/league/ability-tooltip-formatting.ts"
);

const abilityCache = JSON.parse(
  readFileSync("src/features/league/data-dragon/champion-abilities.json", "utf8"),
);

const damageTagPattern = /<(?:magicDamage|physicalDamage|trueDamage)>/i;
const placeholderPattern = /\{\{\s*([^}]+?)\s*\}\}/g;
const originalWarn = console.warn;
const unresolvedPlaceholderCounts = new Map();
const unresolvedSamples = [];
const summary = {
  noDamage: 0,
  numericDamageRows: 0,
  onlyDamageTypeFallback: 0,
  spellsWithDamageText: 0,
  totaldamagePlaceholders: 0,
  totaldamageResolved: 0,
  totaldamageUnresolved: 0,
  totalSpellsChecked: 0,
};
const unresolvedTotaldamageSamples = [];

console.warn = () => {};

for (const champion of Object.values(abilityCache.champions ?? {})) {
  for (const [abilityKey, ability] of Object.entries(champion.abilities ?? {})) {
    summary.totalSpellsChecked += 1;

    const tooltipText = String(ability.tooltip || ability.description || "");
    const hasDamageText = damageTagPattern.test(tooltipText);
    const hasTotaldamagePlaceholder = /\{\{\s*totaldamage\s*\}\}/i.test(tooltipText);
    const tooltip = getCompactAbilityTooltip(ability, champion.id);
    const damageDetail = tooltip.details.find((detail) => detail.label === "Damage");
    const damageValues = damageDetail?.values ?? [];
    const hasNumericDamageRow = damageValues.some((value) => /\d/.test(value));

    if (!hasDamageText) {
      summary.noDamage += 1;
      continue;
    }

    summary.spellsWithDamageText += 1;

    if (hasTotaldamagePlaceholder) {
      summary.totaldamagePlaceholders += 1;
    }

    if (hasNumericDamageRow) {
      summary.numericDamageRows += 1;

      if (hasTotaldamagePlaceholder) {
        summary.totaldamageResolved += 1;
      }

      continue;
    }

    summary.onlyDamageTypeFallback += 1;

    if (hasTotaldamagePlaceholder) {
      summary.totaldamageUnresolved += 1;
    }

    const placeholders = Array.from(
      new Set(
        Array.from(tooltipText.matchAll(placeholderPattern), (match) =>
          String(match[1] ?? "").trim(),
        ).filter((placeholder) => placeholder && placeholder !== "spellmodifierdescriptionappend"),
      ),
    );

    for (const placeholder of placeholders) {
      unresolvedPlaceholderCounts.set(
        placeholder,
        (unresolvedPlaceholderCounts.get(placeholder) ?? 0) + 1,
      );
    }

    if (unresolvedSamples.length < 12) {
      unresolvedSamples.push({
        abilityId: ability.id,
        abilityKey,
        championId: champion.id,
        damageValues,
        effectBurn: (ability.effectBurn ?? []).filter((value) => value && value !== "0"),
        name: ability.name,
        placeholders,
        vars: ability.vars ?? [],
      });
    }

    if (hasTotaldamagePlaceholder && unresolvedTotaldamageSamples.length < 10) {
      unresolvedTotaldamageSamples.push({
        abilityId: ability.id,
        abilityKey,
        championId: champion.id,
        damageValues,
        effectBurn: (ability.effectBurn ?? []).filter((value) => value && value !== "0"),
        name: ability.name,
        placeholders,
        vars: ability.vars ?? [],
      });
    }
  }
}

console.warn = originalWarn;

const topUnresolvedPlaceholders = Array.from(unresolvedPlaceholderCounts.entries())
  .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
  .slice(0, 20)
  .map(([placeholder, count]) => ({ count, placeholder }));

console.log(
  JSON.stringify(
    {
      patch: abilityCache.patch,
      ...summary,
      numericDamageCoverage:
        summary.spellsWithDamageText > 0
          ? `${Math.round((summary.numericDamageRows / summary.spellsWithDamageText) * 100)}%`
          : "0%",
      topUnresolvedPlaceholders,
      unresolvedTotaldamageSamples,
      unresolvedSamples,
    },
    null,
    2,
  ),
);

if (summary.totalSpellsChecked <= 0 || summary.spellsWithDamageText <= 0) {
  throw new Error("Ability damage coverage report did not find local spell data.");
}
