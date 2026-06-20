import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const loadingFiles = [
  "src/app/loading.tsx",
  "src/app/league/counters/loading.tsx",
  "src/app/league/matchups/loading.tsx",
  "src/app/league/matchups/[matchup]/loading.tsx",
  "src/app/champions/loading.tsx",
  "src/app/account/settings/loading.tsx",
  "src/app/admin/loading.tsx",
];

for (const file of loadingFiles) {
  const source = readFileSync(new URL(`../${file}`, import.meta.url), "utf8");

  assert.equal(source.includes("lane-stomp-skeleton"), true, `${file} should use shared skeleton primitives.`);
  assert.equal(source.includes("rounded-xl"), false, `${file} should not use rounded-xl skeletons.`);
  assert.equal(source.includes("rounded-2xl"), false, `${file} should not use rounded-2xl skeletons.`);
  assert.equal(source.includes("animate-pulse"), false, `${file} should use shared reduced-motion-aware animation.`);
  assert.equal(source.includes("bg-white/10"), false, `${file} should avoid bright old placeholder fills.`);
  assert.equal(source.includes("bg-white/5"), false, `${file} should avoid bright old placeholder fills.`);
}

const sharedSkeletonSource = readFileSync(
  new URL("../src/components/lane-stomp-skeleton.tsx", import.meta.url),
  "utf8",
);

assert.equal(sharedSkeletonSource.includes("motion-reduce:animate-none"), true);
assert.equal(sharedSkeletonSource.includes("motion-safe:animate-pulse"), true);
assert.equal(sharedSkeletonSource.includes("rounded-xl"), false);
assert.equal(sharedSkeletonSource.includes("rounded-2xl"), false);

const counterPickSelectorSource = readFileSync(
  new URL("../src/components/league/counter-pick-selector.tsx", import.meta.url),
  "utf8",
);

assert.equal(counterPickSelectorSource.includes("SkeletonResultRow"), true);
assert.equal(counterPickSelectorSource.includes("CounterPickListSkeleton"), true);

console.log("LaneStomp loading skeleton regression tests passed.");
