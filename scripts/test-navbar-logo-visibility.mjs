import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const siteHeaderSource = readFileSync(
  new URL("../src/components/site-header.tsx", import.meta.url),
  "utf8",
);

assert.equal(siteHeaderSource.includes("aria-label=\"LaneStomp home\""), true);
assert.equal(
  siteHeaderSource.includes("flex min-h-16 items-center gap-4 py-2 sm:py-1.5"),
  true,
);
assert.equal(
  siteHeaderSource.includes("relative flex h-14 w-40 shrink-0 items-center overflow-visible"),
  true,
);
assert.equal(siteHeaderSource.includes("sm:h-[4.25rem] sm:w-48"), true);
assert.equal(siteHeaderSource.includes('sizes="(min-width: 640px) 192px, 160px"'), true);
assert.equal(siteHeaderSource.includes('src="/images/lanestomp-logo.png"'), true);
assert.equal(siteHeaderSource.includes('src="/images/lanestomp.png"'), false);

console.log("Navbar logo visibility regression tests passed.");
