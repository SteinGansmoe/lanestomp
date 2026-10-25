# Legacy artifact cleanup — issue #370

Inventory completed before deletion on 25 October 2026. All 61 files were tracked at the start of this task. Reference searches covered every tracked text file outside artifacts, using both each basename and its artifact path; a separate repository-wide artifacts-path search found only the prior security report. No application or automated-test dependency was found.

The historical screenshots came from the Counter Pick/redesign work introduced in commit 63ab5db. The generated security files came from issue #368 / commit 0664c0a. Security results, affected versions, reachability assessment, advisory links, dependency changes, and test exceptions remain in [the security audit](dependency-security-audit-2026-10-25.md).

Retain `artifacts/issue270-reference.png`: visual inspection identifies a standalone Counter Pick design mockup rather than a browser test capture. It is unreferenced, but could still be useful as a design reference. Its continued value is uncertain; leave owner review of that one file for later. No other artifact needs manual review.

## Inventory

| File | Bytes | Classification | References outside artifacts | Decision |
| --- | ---: | --- | --- | --- |
| audit-final.json | 387 | generated security output | docs/dependency-security-audit-2026-10-25.md | remove: historical development screenshot or generated security output; findings preserved in docs |
| audit-initial.json | 59692 | generated security output | docs/dependency-security-audit-2026-10-25.md | remove: historical development screenshot or generated security output; findings preserved in docs |
| audit-production-final.json | 387 | generated security output | docs/dependency-security-audit-2026-10-25.md | remove: historical development screenshot or generated security output; findings preserved in docs |
| audit-production-initial.json | 55929 | generated security output | docs/dependency-security-audit-2026-10-25.md | remove: historical development screenshot or generated security output; findings preserved in docs |
| counter-pick-result-hextech-hero-ahri.png | 1430544 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| counter-pick-result-hextech-hero-desktop.png | 1011441 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| dependency-chains-initial.json | 12652 | generated security output | docs/dependency-security-audit-2026-10-25.md | remove: historical development screenshot or generated security output; findings preserved in docs |
| homepage-hextech-hero-desktop.png | 1403911 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| homepage-hextech-hero-narrow.png | 509754 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| homepage-issue259-desktop.png | 986594 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| homepage-issue259-mobile.png | 290229 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue262-champion-data.png | 693064 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue262-footer-refresh.png | 83235 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue262-footer.png | 2553387 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue262-login-placeholder.png | 1025279 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue262-matchup-guides-mobile.png | 254496 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue262-matchup-guides.png | 962442 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue263-navbar-mobile.png | 37005 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue263-navbar-unauth-desktop.png | 106472 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue264-bad-into-rows.png | 80710 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue264-change-champion-panel.png | 123015 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue264-entry-page.png | 69937 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue264-mobile-result.png | 45797 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue264-result-page.png | 99945 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue264-result-rows.png | 98690 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue264-selector-open.png | 74041 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue265-home-dropdown.png | 100440 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue265-home-initial.png | 105595 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue265-home-mobile-dropdown.png | 54983 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue265-home-mobile.png | 50856 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue265-home-selected.png | 112698 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue266-counter-pick-start.png | 1203782 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue266-jinx-adc.png | 1427283 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue266-start-after-back.png | 1203782 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue266-twitch-adc.png | 1411721 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue270-counter-pick-desktop.png | 1310444 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue270-counter-pick-mobile.png | 296611 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue270-counter-pick-narrow.png | 386091 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue270-counter-pick-tablet.png | 762350 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue270-reference.png | 1658580 | screenshot/reference | None | retain: reusable design reference; continued value uncertain |
| issue271-counter-entry-cta.png | 1311350 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue271-homepage-cta-hover.png | 1405532 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue271-homepage-navbar-cta.png | 1403474 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue271-homepage-selected-cta.png | 1403422 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue271-homepage-selected-mobile.png | 507265 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue272-matchups-desktop.png | 1580087 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue272-matchups-mobile.png | 412522 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue273-detail-desktop.png | 1020101 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue273-detail-mobile.png | 429396 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue274-brighter-hero-desktop.png | 1159302 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue274-detail-hero-desktop.png | 882091 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue274-detail-hero-mobile.png | 359554 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue274-detail-hero-tablet.png | 582149 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| issue274-no-purple-hero-desktop.png | 1051392 | screenshot/reference | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| security-build.log | 1470 | generated security output | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| security-dependency-diff.json | 17366 | generated security output | docs/dependency-security-audit-2026-10-25.md | remove: historical development screenshot or generated security output; findings preserved in docs |
| security-lint.log | 38 | generated security output | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| security-runtime-smoke.json | 1021 | generated security output | docs/dependency-security-audit-2026-10-25.md | remove: historical development screenshot or generated security output; findings preserved in docs |
| security-test-results.json | 4222 | generated security output | docs/dependency-security-audit-2026-10-25.md | remove: historical development screenshot or generated security output; findings preserved in docs |
| security-tests.log | 38538 | generated security output | None | remove: historical development screenshot or generated security output; findings preserved in docs |
| security-typecheck.log | 49 | generated security output | None | remove: historical development screenshot or generated security output; findings preserved in docs |

## Cleanup outcome

Reviewed 61 files (35,724,592 bytes): 49 PNG screenshots/reference assets and 12 generated security outputs. Removed 60 tracked files: 48 obsolete screenshots and all 12 generated outputs. Retained the single design reference (1,658,580 bytes).

Artifact storage fell by **34,066,012 bytes (32.49 MiB; 95.36%)**. These are working-tree/current-snapshot file sizes, not a claim that existing Git history shrank. No history was rewritten. This inventory and the small documentation/ignore updates add a little text overhead.

The deleted files appear as Git deletions for owner review. No commit, push, merge, deployment, or staging was performed. Work is on the requested `chore/artifacts-cleanup` branch.

## Preventing future clutter

`.gitignore` now reserves `/artifacts/codex-screenshots/` for disposable browser captures and `/artifacts/generated-audits/` for generated evidence. Future tasks should put temporary outputs in these directories and preserve durable findings in `docs/`.

Root-level ignore rules cover audit JSON (`audit-*.json`), security logs (`security-*.log`), and the exact known generated dependency-chain, dependency-diff, runtime-smoke, and test-results JSON filenames. The entire artifacts directory is not ignored. Reference images, nested fixtures, other JSON, and application assets remain eligible for tracking. Nine positive/negative `git check-ignore --no-index` cases confirmed this behavior.

Only the evidence-location paragraph in the existing security report changed, replacing removed-file references with a link to this inventory and the recovery commit. Its findings and detailed dependency/advisory tables remain intact. No unrelated documentation was rewritten.

## Validation

- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed with Next.js 16.4.3; all 29 static pages generated. Network access was used for the existing Google Fonts configuration.
- `git diff --check`: passed.
- Reference searches found no application/test/config dependency on deleted artifacts. Remaining filename mentions are historical inventory, evidence-recovery documentation, and ignore rules.
- `git diff --exit-code HEAD -- src public scripts package.json package-lock.json next.config.ts`: passed. All 1,596 tracked public/application image asset paths remain intact and unchanged.
- All 49 initial PNG files had readable image metadata; the retained mockup was visually inspected.

Manual review uncertainty: whether to keep `artifacts/issue270-reference.png` long term. It remains tracked and available; no decision is required to review the rest of this cleanup.
