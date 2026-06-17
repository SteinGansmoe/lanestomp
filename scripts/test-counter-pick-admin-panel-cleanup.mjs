import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const panelSource = readFileSync(
  new URL("../src/components/admin/league/riot-match-scanner-panel.tsx", import.meta.url),
  "utf8",
);
const actionsSource = readFileSync(
  new URL("../src/app/admin/league/counter-picks/actions.ts", import.meta.url),
  "utf8",
);

testResolverPanelRemoved();
testCoverageQueueLazyLoaded();
testSeedCandidateAccordionControlled();

console.log("Counter Pick admin panel cleanup regression tests passed.");

function testResolverPanelRemoved() {
  assert.equal(panelSource.includes("function RiotIdResolverPanel"), false);
  assert.equal(panelSource.includes("Riot ID to PUUID Resolver"), false);
  assert.equal(panelSource.includes("ResolverResultRow"), false);
  assert.equal(panelSource.includes("resolveRiotIdsToPuuids"), false);
  assert.equal(actionsSource.includes("export async function resolveRiotIdsToPuuids"), false);
  assert.equal(actionsSource.includes("RiotIdResolverResult"), false);
}

function testCoverageQueueLazyLoaded() {
  assert.equal(panelSource.includes("const [isExpanded, setIsExpanded] = useState(false);"), true);
  assert.equal(
    panelSource.includes("const [hasLoadedQueue, setHasLoadedQueue] = useState(false);"),
    true,
  );
  assert.equal(panelSource.includes('const [limit, setLimit] = useState("20");'), true);
  assert.equal(panelSource.includes("aria-expanded={isExpanded}"), true);
  assert.equal(
    panelSource.includes("if (nextExpanded && !hasLoadedQueue && !status.isLoading)"),
    true,
  );
  assert.equal(
    panelSource.includes(
      "void loadQueue();\n    // eslint-disable-next-line react-hooks/exhaustive-deps",
    ),
    false,
  );
  assert.equal(actionsSource.includes("limit = 20"), true);
  assert.equal(actionsSource.includes("maxMatchupRankCoverageLimit"), true);
}

function testSeedCandidateAccordionControlled() {
  assert.equal(panelSource.includes("function toggleRankGroupSection"), true);
  assert.equal(panelSource.includes("onToggle={() => toggleRankGroupSection(rankGroup.id)}"), true);
  assert.equal(panelSource.includes("onToggle={() => void loadCandidateGroups"), false);
  assert.equal(panelSource.includes("aria-expanded={groupState.isExpanded}"), true);
  assert.equal(panelSource.includes("isExpanded: true,"), false);
  assert.equal(panelSource.includes('isExpanded: group.id === "master-plus"'), true);
}
