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
const adminNavSource = readFileSync(
  new URL("../src/components/admin/admin-nav.tsx", import.meta.url),
  "utf8",
);
const counterPickSectionSource = readFileSync(
  new URL("../src/components/admin/league/league-counter-pick-section.tsx", import.meta.url),
  "utf8",
);
const counterPickOverviewPageSource = readFileSync(
  new URL("../src/app/admin/counter-picks/page.tsx", import.meta.url),
  "utf8",
);
const counterPickCollectPageSource = readFileSync(
  new URL("../src/app/admin/counter-picks/collect/page.tsx", import.meta.url),
  "utf8",
);
const counterPickShadowPageSource = readFileSync(
  new URL("../src/app/admin/counter-picks/shadow-ranking/page.tsx", import.meta.url),
  "utf8",
);

testResolverPanelRemoved();
testCoverageQueueLazyLoaded();
testSeedCandidateAccordionControlled();
testCollectionPollingIsPassive();
testCounterPickDomainRoutes();
testCounterRankingV2ShadowProfileSelection();
testCounterRankingV2ShadowCandidateAccordion();

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

function testCollectionPollingIsPassive() {
  assert.equal(panelSource.includes("function refreshCollection"), true);
  assert.equal(panelSource.includes("getRiotCollectionJob"), true);
  assert.equal(
    panelSource.includes("void refreshCollection(activeJob.id, { silent: true });"),
    true,
  );
  assert.equal(
    panelSource.includes("void resumeCollection(activeJob.id, { silent: true });"),
    false,
  );
  assert.equal(panelSource.includes('label="Child stage"'), true);
  assert.equal(panelSource.includes('label="Matches scanned"'), true);
}

function testCounterPickDomainRoutes() {
  assert.equal(adminNavSource.includes('label: "Platform"'), false);
  assert.equal(adminNavSource.includes('label: "Counter Pick"'), true);
  assert.equal(adminNavSource.includes('href: "/admin/counter-picks"'), true);
  assert.equal(adminNavSource.includes('href: "/admin/counter-picks/collect"'), true);
  assert.equal(adminNavSource.includes('href: "/admin/counter-picks/shadow-ranking"'), true);
  assert.equal(counterPickOverviewPageSource.includes('section="counter-picks-overview"'), true);
  assert.equal(counterPickCollectPageSource.includes('section="counter-picks-collect"'), true);
  assert.equal(
    counterPickShadowPageSource.includes('section="counter-picks-shadow-ranking"'),
    true,
  );
  assert.equal(counterPickSectionSource.includes('view === "collect"'), true);
  assert.equal(counterPickSectionSource.includes('view === "shadow-ranking"'), true);
  assert.equal(counterPickSectionSource.includes("<RiotMatchScannerPanel"), true);
  assert.equal(counterPickSectionSource.includes("<CounterRankingV2ShadowPanel"), true);
}

function testCounterRankingV2ShadowProfileSelection() {
  assert.equal(
    counterPickSectionSource.includes("const counterRankingV2DefaultChampionId = useMemo"),
    true,
  );
  assert.equal(
    counterPickSectionSource.includes(
      'view === "shadow-ranking"\n      ? hasResolvedInitialSelection',
    ),
    true,
  );
  assert.equal(
    counterPickSectionSource.includes(
      'text="This champion does not have a Counter Ranking V2 profile yet."',
    ),
    true,
  );
  assert.match(
    counterPickSectionSource,
    /async function loadCounterRankingV2Reviews\(\)[\s\S]*if \(!effectiveSelectedChampionId \|\| !hasSelectedCounterRankingV2Profile\)[\s\S]*setCounterRankingV2ReviewsByCandidateId\(new Map\(\)\);[\s\S]*return;/,
    "Missing V2 profiles should clear review state without querying review rows.",
  );
  assert.match(
    counterPickSectionSource,
    /async function loadCounterRankingV2ObservedStats\(\)[\s\S]*if \(!effectiveSelectedChampionId \|\| !hasSelectedCounterRankingV2Profile\)[\s\S]*setCounterRankingV2ObservedByChampionId\(new Map\(\)\);[\s\S]*return;/,
    "Missing V2 profiles should clear observed state without fetching observed stats.",
  );
  assert.equal(counterPickSectionSource.includes("formatCounterRankingV2ProfileAvailability"), true);
  assert.equal(counterPickSectionSource.includes("No V2 profile"), true);
  assert.equal(counterPickSectionSource.includes("Reviewed v${profile.version}"), true);
  assert.equal(counterPickSectionSource.includes("Needs review profile v${profile.version}"), true);
  assert.equal(counterPickSectionSource.includes("No observed stats are available"), true);
  assert.equal(counterPickSectionSource.includes("No review rows have been saved"), true);
  assert.equal(
    counterPickSectionSource.includes("includeSelectedChampionOption(championOptions, selectedChampion)"),
    true,
  );
  assert.equal(counterPickSectionSource.includes("const canonicalCounterChampionId"), true);
  assert.equal(counterPickSectionSource.includes("const canonicalEnemyChampionId"), true);
  assert.equal(counterPickSectionSource.includes("counterChampionId: canonicalCounterChampionId"), true);
  assert.equal(counterPickSectionSource.includes("enemyChampionId: canonicalEnemyChampionId"), true);
  assert.equal(counterPickSectionSource.includes("sortCounterRankingV2RowsByReviewPriority"), true);
  assert.equal(counterPickSectionSource.includes("Sorted by review priority"), true);
}

function testCounterRankingV2ShadowCandidateAccordion() {
  assert.equal(counterPickSectionSource.includes("function CounterRankingV2ShadowRows"), true);
  assert.equal(
    counterPickSectionSource.includes("const [expandedCandidateId, setExpandedCandidateId] = useState"),
    true,
  );
  assert.equal(
    counterPickSectionSource.includes("() => rows[0]?.candidateChampionId ?? null"),
    true,
  );
  assert.equal(
    counterPickSectionSource.includes("isExpanded={expandedCandidateId === row.candidateChampionId}"),
    true,
  );
  assert.match(
    counterPickSectionSource,
    /setExpandedCandidateId\(\(currentCandidateId\) =>[\s\S]*currentCandidateId === row\.candidateChampionId \? null : row\.candidateChampionId/,
    "Candidate rows should be controlled so only one row expands at a time.",
  );
  assert.equal(counterPickSectionSource.includes("aria-expanded={isExpanded}"), true);
  assert.equal(counterPickSectionSource.includes("aria-controls={panelId}"), true);
  assert.equal(counterPickSectionSource.includes("<ChevronDown"), true);
  assert.equal(counterPickSectionSource.includes("<ChevronRight"), true);
  assert.equal(counterPickSectionSource.includes('label="Final reviewed"'), true);
  assert.equal(counterPickSectionSource.includes('label="Final reviewed score"'), true);
  assert.equal(counterPickSectionSource.includes("Save review"), true);
  assert.equal(counterPickSectionSource.includes("hasLowObservedSample"), true);
  assert.equal(counterPickSectionSource.includes("No observed data"), true);
}
