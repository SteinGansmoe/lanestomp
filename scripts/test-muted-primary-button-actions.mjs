import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const accountSettingsSource = readFileSync(
  new URL("../src/components/account-settings-form.tsx", import.meta.url),
  "utf8",
);
const counterPickSelectorSource = readFileSync(
  new URL("../src/components/league/counter-pick-selector.tsx", import.meta.url),
  "utf8",
);

assert.equal(accountSettingsSource.includes("counterPickPrimaryCtaClassName"), true);
assert.equal(accountSettingsSource.includes("accountSettingsActionButtonClassName"), true);
assert.equal(accountSettingsSource.includes("h-11 rounded-none px-4 font-semibold"), true);
assert.equal(accountSettingsSource.includes("className=\"h-11 bg-cyan-300"), false);
assert.equal(accountSettingsSource.includes("className=\"h-11 bg-cyan-400/80"), false);

assert.equal(counterPickSelectorSource.includes("Open Full Matchup Guide"), true);
assert.equal(
  counterPickSelectorSource.includes(
    'variant="secondary"\n      className={cn("h-12 w-fit rounded-none px-5 font-semibold", counterPickPrimaryCtaClassName)}',
  ),
  true,
);
assert.equal(counterPickSelectorSource.includes("hover:bg-[#09515F]"), false);
assert.equal(counterPickSelectorSource.includes("h-12 w-fit bg-cyan-200"), false);

console.log("Muted primary button action regression tests passed.");
