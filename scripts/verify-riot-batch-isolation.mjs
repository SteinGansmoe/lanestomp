import { runBatchIsolationScenarios } from "./test-riot-batch-isolation.mjs";

const result = await runBatchIsolationScenarios();

console.log(`Riot batch isolation valid: ${result.ok ? "Yes" : "No"}`);
console.log(`Scenarios tested: ${result.scenariosTested}`);
console.log(`Unexpected failures: ${result.unexpectedFailures}`);
console.log(`Rows lost: ${result.rowsLost}`);
console.log(`Duplicate final accounting: ${result.duplicateFinalAccounting}`);

if (!result.ok) {
  process.exit(1);
}
