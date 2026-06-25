import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const championKnowledgeIndexSource = readFileSync(
  "src/features/league/champion-knowledge/index.ts",
  "utf8",
);
const lockeProfileSource = readFileSync(
  "src/features/league/champion-knowledge/locke.ts",
  "utf8",
);

testLockeCombatProfile();

console.log("Champion knowledge profile regression tests passed.");

function testLockeCombatProfile() {
  assert.match(
    championKnowledgeIndexSource,
    /import \{ lockeCombatProfile \} from "\.\/locke";/,
    "Locke profile should be imported into the champion knowledge registry.",
  );
  assert.match(
    championKnowledgeIndexSource,
    /export \{ lockeCombatProfile \} from "\.\/locke";/,
    "Locke profile should be exported from the champion knowledge registry.",
  );
  assert.match(
    championKnowledgeIndexSource,
    /Locke: lockeCombatProfile,/,
    "Locke profile should be available through leagueChampionKnowledgeProfiles.",
  );
  assert.match(lockeProfileSource, /export const lockeCombatProfile = \{/);
  assert.match(lockeProfileSource, /profileQuality: "draft"/);
  assert.match(lockeProfileSource, /Q: "Ritual Nails"/);
  assert.match(lockeProfileSource, /W: "Soul Ignition"/);
  assert.match(lockeProfileSource, /E: "Ashen Pursuit"/);
  assert.match(lockeProfileSource, /R: "Purgatory"/);
  assert.match(lockeProfileSource, /primaryRoles: \["mid"\]/);
  assert.match(lockeProfileSource, /secondaryRoles: \["jungle"\]/);
}
