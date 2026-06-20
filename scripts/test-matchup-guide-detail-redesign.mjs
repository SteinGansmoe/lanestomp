import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const pageSource = readFileSync("src/app/league/matchups/[matchup]/page.tsx", "utf8");
const reviewPanelSource = readFileSync(
  "src/components/league/league-matchup-review-panel.tsx",
  "utf8",
);
const feedbackSource = readFileSync("src/components/league/matchup-feedback-controls.tsx", "utf8");
const changePanelSource = readFileSync("src/components/league/change-matchup-panel.tsx", "utf8");

assert.match(
  pageSource,
  /<HextechFrame/,
  "Matchup Guide detail hero should use the shared Hextech frame.",
);
assert.match(
  pageSource,
  /getChampionSplashUrl\(championA\)[\s\S]*getChampionSplashUrl\(championB\)/,
  "Detail hero should render both champion splash artworks.",
);
assert.match(pageSource, /Matchup guide/i, "Detail hero should include the Matchup Guide eyebrow.");
assert.match(pageSource, /Back to selector/, "Hero should include the selector return action.");
assert.match(pageSource, /Champion data/, "Hero should include the champion data action.");
assert.match(
  pageSource,
  /triggerClassName=\{matchupHeroActionClassName\}/,
  "Change Matchup should use the sharp hero action family.",
);
assert.match(
  pageSource,
  /TacticalSummaryStrip/,
  "Page should include the tactical start-here summary strip.",
);
assert.match(pageSource, /Start here/i, "Summary strip should tell users where to begin.");
assert.match(
  pageSource,
  /Tactical tip/i,
  "Bottom tip should use the upgraded tactical tip treatment.",
);
assert.match(
  pageSource,
  /rounded-none/,
  "Fallback states and hero actions should explicitly avoid structural rounding.",
);

assert.match(reviewPanelSource, /Admin review/i, "Admin review strip should remain available.");
assert.match(reviewPanelSource, /Edit guidance/, "Edit guidance control should remain available.");
assert.match(reviewPanelSource, /Mark reviewed/, "Mark reviewed control should remain available.");
assert.match(reviewPanelSource, /Regenerate/, "Regenerate controls should remain available.");
assert.match(
  reviewPanelSource,
  /getSectionPanelAccentClass/,
  "Guidance panels should use restrained section-specific accent edges.",
);
assert.match(
  reviewPanelSource,
  /grid items-stretch gap-3 md:grid-cols-2/,
  "Guidance grid should preserve the two-column desktop layout.",
);
for (const sectionTitle of [
  "Overview",
  "Trading pattern",
  "Danger windows",
  "Early game",
  "Power spikes",
  "Win conditions",
]) {
  assert.match(
    reviewPanelSource,
    new RegExp(sectionTitle, "i"),
    `${sectionTitle} section should remain.`,
  );
}

assert.match(feedbackSource, /Helpful/, "Helpful feedback action should remain.");
assert.match(feedbackSource, /Not helpful/, "Not helpful feedback action should remain.");
assert.match(feedbackSource, /Report/, "Report action should remain.");
assert.match(
  feedbackSource,
  /rounded-none/,
  "Feedback controls should use rectangular button styling.",
);
assert.match(
  feedbackSource,
  /submit_matchup_feedback/,
  "Feedback persistence should remain wired.",
);

assert.match(
  changePanelSource,
  /triggerClassName/,
  "Change Matchup trigger should support page-specific hero styling without changing behavior.",
);

const structuralSources = `${pageSource}\n${reviewPanelSource}\n${feedbackSource}`;
assert.doesNotMatch(
  structuralSources.replace(/rounded-full/g, ""),
  /rounded-(?:md|lg|xl|2xl|3xl)| rounded /,
  "Detail page redesign should not include rounded structural classes.",
);

console.log("Matchup Guide detail redesign regression tests passed.");
