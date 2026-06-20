import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const siteHeaderSource = readFileSync(
  new URL("../src/components/site-header.tsx", import.meta.url),
  "utf8",
);
const accountMenuSource = readFileSync(
  new URL("../src/components/authenticated-account-menu.tsx", import.meta.url),
  "utf8",
);

assert.equal(siteHeaderSource.includes("createPortal("), true);
assert.equal(siteHeaderSource.includes("document.body"), true);
assert.equal(siteHeaderSource.includes("document.body.style.overflow = \"hidden\""), true);
assert.equal(siteHeaderSource.includes("event.key === \"Escape\""), true);
assert.equal(siteHeaderSource.includes("event.key !== \"Tab\""), true);
assert.equal(siteHeaderSource.includes("z-[140]"), true);
assert.equal(siteHeaderSource.includes("z-[150]"), true);
assert.equal(siteHeaderSource.includes("role=\"dialog\""), true);
assert.equal(accountMenuSource.includes("z-[170]"), true);

console.log("Mobile navigation stacking regression tests passed.");
