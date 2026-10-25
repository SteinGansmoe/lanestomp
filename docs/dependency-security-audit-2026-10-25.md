# Dependency security audit — issue #368

Audit date: 25 October 2026. Local branch: `fix/dependency-security`.

The dependency remediation is ready for owner review. Both final npm audits report **zero known vulnerabilities**. Nothing was committed, pushed, merged, or deployed.

## Results

| Audit | Initial critical | Initial high | Initial moderate | Initial total | Final total |
| --- | ---: | ---: | ---: | ---: | ---: |
| `npm audit` | 2 | 13 | 5 | 20 | 0 |
| `npm audit --omit=dev` | 2 | 13 | 5 | 20 | 0 |

Counts are affected package entries, not individual advisories. The production audit includes the shadcn CLI dependency tree because shadcn is a production dependency. This does not mean its Express/MCP server is running in the application.

## Targeted changes

| Direct dependency | Before | After | Reason |
| --- | --- | --- | --- |
| next | 16.2.6 | 16.4.3 | Security fixes through the October release; patched PostCSS and sharp dependencies |
| eslint-config-next | 16.2.6 | 16.4.3 | Keep framework lint configuration aligned |
| shadcn | 4.7.0 | 4.22.1 | Replace vulnerable Zod 3 dependency and update the affected CLI dependency tree |

The Next.js and ESLint configuration pins remain exact. The shadcn range changes from `^4.7.0` to `^4.22.1`; the lockfile resolves 4.22.1. React and React DOM remain 19.2.4. Supabase and authentication dependencies were not upgraded without an audit finding.

After these updates, only brace-expansion, js-yaml, source-map-js, and Zod remained flagged. Targeted `npm update` commands refreshed those within their existing parent constraints. No overrides, forced audit fixes, or application refactors were used.

One compatibility change was necessary: removed `experimental.viewTransition` from `next.config.ts`. Next.js 16.4.3 rejects that key. The installed guide at `node_modules/next/dist/docs/01-app/02-guides/view-transitions.md` documents App Router transitions without configuration. The existing admin transition component was retained. The production build and typecheck pass without changing React versions.

shadcn remains a production dependency because `src/app/globals.css` imports `shadcn/tailwind.css`. Its update also changes the supplied CSS variants; a visual check of admin transitions and UI states in preview remains appropriate.

## Production reachability

This assessment uses checked-in code and configuration. This checkout has no `.env` files; the deployed Vercel configuration, production credentials, database policies currently applied, and provider mitigations were not available to inspect.

| Surface | Assessment before remediation |
| --- | --- |
| App Router Server Actions | **Relevant runtime exposure.** Both admin action modules use `use server`. The July and October Server Action DoS advisories apply to framework request processing; application authorization is not a sufficient mitigation. Patched by the Next.js update. |
| Admin authentication | Reviewed helpers in both action modules verify the supplied token with `supabase.auth.getUser(accessToken)` and require the database `is_admin` RPC. Counter-pick operations using the service client authorize first, including shared pause/cancel helpers. Client `getSession` and email fallback checks control UI and are not the server authorization boundary. Live authenticated/unauthorized database access was not exercised. |
| Middleware / proxy bypass | No middleware or proxy implementation found. Authorization does not rely on middleware. The July bypass advisory therefore has no matching configuration in this checkout. |
| Image optimization | Enabled; `/images/lanestomp-logo.png` uses the optimizer. Remote images are limited to HTTPS on `ddragon.leagueoflegends.com`. Many champion images use `unoptimized`, but that does not disable the endpoint globally. No attacker-controlled upload facility, AVIF asset, or `dangerouslyAllowSVG` setting was found. Restricting the host reduces exposure; malicious allowed content or upstream compromise cannot be excluded. The SVG/native library RCE specifically concerns glibc Linux, which must be considered for hosted deployment despite local Windows testing. sharp now resolves to 0.35.5. |
| Image SSRF | A remote allowlist exists, but it contains Riot's CDN rather than a user-controlled DNS host. The documented attacker-controlled allowed-host condition was not demonstrated. Updated framework contains the fix. |
| `next/og` RCE | No `ImageResponse` or `next/og` use found. Open Graph and Twitter images are static PNG files. No matching application entry point found. |
| Cache Components RCE / cache leaks | No `cacheComponents` configuration or `use cache` functions found. The typed-array condition for the October RCE is absent. Still updated as advised by Next.js. |
| Windows server RCE | Relevant to an exposed Windows-hosted server running the old version; deployment on Windows is not established. Vercel is the documented hosting target. Updated locally as well. |
| Custom server / rewrites / Edge Actions | Standard `next start` / Vercel model; no custom server, rewrites, or Edge runtime action configuration found. No matching custom-server SSRF / rewrite SSRF / Edge payload entry point found. |
| SSG / ISR cache poisoning | Static routes and dynamic public pages exist. Self-hosted/CDN behavior and production cache configuration were not verified, so exploitation is not claimed or ruled out solely from source. Updated framework covers the findings. |
| Development MCP disclosure | Development-server issue, not a `next build` / `next start` production endpoint. Patched by the framework update. |
| Express / proxy-addr / Hono / MCP / IP parsing | Transitive shadcn tooling. No application imports or Express/Hono/MCP listener found. The critical proxy-addr IP-trust issue and MCP authentication/OAuth issues do not represent the app's Supabase authorization path. Updated nonetheless. |
| PostCSS / browser mapping / YAML / selector parsing / source maps / brace expansion / Zod | Mostly build, lint, and CLI paths; no application facility to submit arbitrary CSS, YAML, source maps, or schema payloads was found. Some remain production-installed because of framework/tool dependencies. Targeted compatible updates clear their advisories. |

## Advisory review and patched version choice

Next.js 16.4.1 is the first 16.x release covering the October 14 fixes. Selected 16.4.3 is a stable same-major release reported by npm audit as the compatible fix, with PostCSS 8.5.23 and sharp `^0.35.5`. Its peers accept the existing React 19.2.4; its Node requirement remains `>=20.9.0`. The updated shadcn requires Node `>=20.18.1`; validation used Node 24.19.0 and npm 11.17.0. Confirm the deployment Node version meets the tooling requirement.

Primary sources reviewed:

- [Next.js October 14 security update](https://nextjs.org/blog/nextjs-security-update-october-14-2026).
- [Server Actions CPU denial of service; fixed in 16.4.1](https://github.com/vercel/next.js/security/advisories/GHSA-p3m5-59mp-jv5r).
- [SVG image optimization RCE; fixed in 16.4.1 / sharp 0.35.5](https://github.com/vercel/next.js/security/advisories/GHSA-2464-fhr4-w9xw).
- [Cache Components typed-array RCE; fixed in 16.4.1](https://github.com/vercel/next.js/security/advisories/GHSA-673q-mjm6-r5xr).
- [next/og ImageResponse RCE; fixed in 16.3.6](https://github.com/vercel/next.js/security/advisories/GHSA-vcvr-r3jv-pc5j).
- [Windows-hosted RCE; fixed in 16.3.3](https://github.com/vercel/next.js/security/advisories/GHSA-p293-qw3h-jr36).
- [AVIF image optimization RCE; fixed in 16.3.3](https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4).
- [Image optimizer SSRF](https://github.com/vercel/next.js/security/advisories/GHSA-cjq9-62q9-8jv4). This advisory page has placeholder version text; the npm audit range identifies 16.3.8 as the fix boundary.

The complete initial advisory inventory and exact dependency changes follow below. Zero remaining audit findings is not a guarantee against undisclosed vulnerabilities.

## Install scripts

All modifying installs and updates used `--ignore-scripts`. No dependency lifecycle script was approved or executed. The original lockfile marked msw, sharp, and unrs-resolver as requiring install scripts. The updated tree removes msw and no longer marks sharp as requiring an install script. The remaining unrs-resolver 1.11.1 postinstall calls `napi-postinstall ... check`; review showed native-binding checking with an npm download/install fallback when missing. It was left disabled. Native unrs-resolver and sharp 0.35.5 both loaded successfully, and the optimized image request succeeded without a rebuild script.

## Verification

| Check | Result |
| --- | --- |
| `npm run typecheck` | Pass after build regenerated route types and obsolete config key was removed |
| `npm run lint` | Pass |
| `npm run build` | Pass, Next.js 16.4.3 Turbopack; 29 static pages generated |
| `npm audit` | Pass, zero findings |
| `npm audit --omit=dev` | Pass, zero findings |
| `git diff --check` | Pass |
| All 36 existing `test:*` commands | 34 pass; two unchanged source assertion failures described below |
| Local production HTTP checks | `/`, `/login`, `/admin`, `/league/matchups`, `/league/counters`, `/champions`: HTTP 200 |
| Image optimizer | Local PNG: HTTP 200 image/png; non-allowlisted example.com remote image: HTTP 400 |

The initial sandbox build could not fetch Google Fonts. A network-enabled attempt encountered a stale-cache Turbopack subprocess failure; removing only generated `.next` output and rebuilding succeeded. No font substitutions or bundler changes were made. Initial parallel typecheck saw missing generated route types; the final post-build typecheck passes.

Existing test failures:

- `test:champion-knowledge-profiles`: expects `profileQuality: "draft"` in Locke's unchanged profile. The profile currently uses `profileQuality: "reviewed"`. Test and input files match HEAD.
- `test:muted-primary-button-actions`: an exact multiline string assumes LF line endings. This Windows checkout uses CRLF. The same assertion passes after in-memory CRLF-to-LF normalization. Test and input files match HEAD. No unrelated test edits were made.

The HTTP checks used a local production build without Supabase credentials. HTTP 200 on `/admin` confirms the UI shell renders, not successful admin authentication. Login, live data, database authorization, write operations, visual transitions, and external service integrations require a configured preview and owner accounts.

Evidence: `artifacts/audit-initial.json`, `artifacts/audit-production-initial.json`, `artifacts/audit-final.json`, `artifacts/audit-production-final.json`, `artifacts/dependency-chains-initial.json`, `artifacts/security-dependency-diff.json`, `artifacts/security-test-results.json`, `artifacts/security-runtime-smoke.json`, and `artifacts/security-*.log`. Logs contain no environment dump or credentials.

## Recommendation before deployment

Review this local dependency/configuration diff and the two existing test exceptions. Then validate a preview on the intended Node version with real environment configuration: public matchup/counter pages, login/logout/password reset, non-admin rejection, admin draft and collection access, image loading, and admin transition/UI states. Confirm deployed database policies and service-client authorization with the preview environment. Once owner review and preview checks pass, deploy the security update promptly because Server Actions are present. No production exploitation was attempted.


## Initial affected packages and chains

| Package | Severity | Initial installed versions | Final installed versions |
| --- | --- | --- | --- |
| @hono/node-server | moderate | 1.19.14 | 2.1.5 |
| @modelcontextprotocol/sdk | high | 1.29.0 | 1.32.2 |
| baseline-browser-mapping | moderate | 2.10.29 | 2.11.33 |
| body-parser | high | 2.2.2 | 2.4.0 |
| brace-expansion | high | 5.0.6, 1.1.14 | 5.0.12, 1.1.21 |
| browserslist | high | 4.28.2 | 4.29.4 |
| fast-uri | high | 3.1.2 | 3.1.9 |
| hono | moderate | 4.12.26 | 4.13.14 |
| ip-address | high | 10.2.0 | 10.7.5 |
| js-yaml | high | 4.2.0 | 4.3.2 |
| nanoid | high | 3.3.12 | 3.3.20 |
| next | critical | 16.2.6 | 16.4.3 |
| postcss | high | 8.4.31, 8.5.14 | 8.5.23 |
| postcss-selector-parser | moderate | 7.1.1 | 7.1.7 |
| proxy-addr | critical | 2.0.7 | 2.0.8 |
| qs | moderate | 6.15.2 | 6.16.1 |
| shadcn | high | 4.7.0 | 4.22.1 |
| sharp | high | 0.34.5 | 0.35.5 |
| source-map-js | high | 1.2.1 | 1.2.2 |
| zod | high | 3.25.76, 4.4.3 | 4.6.7 |

source-map-js:

- @tailwindcss/postcss@4.3.0 → @tailwindcss/node@4.3.0 → source-map-js@1.2.1
- @tailwindcss/postcss@4.3.0 → postcss@8.5.14 → source-map-js@1.2.1
- next@16.2.6 → postcss@8.4.31 → source-map-js@1.2.1

postcss:

- @tailwindcss/postcss@4.3.0 → postcss@8.5.14
- next@16.2.6 → postcss@8.4.31
- shadcn@4.7.0 → postcss@8.5.14

nanoid:

- @tailwindcss/postcss@4.3.0 → postcss@8.5.14 → nanoid@3.3.12
- next@16.2.6 → postcss@8.4.31 → nanoid@3.3.12

zod:

- eslint-config-next@16.2.6 → eslint-plugin-react-hooks@7.1.1 → zod-validation-error@4.0.2 → zod@4.4.3
- eslint-config-next@16.2.6 → eslint-plugin-react-hooks@7.1.1 → zod@4.4.3
- shadcn@4.7.0 → @modelcontextprotocol/sdk@1.29.0 → zod@4.4.3
- shadcn@4.7.0 → zod-to-json-schema@3.25.2 → zod@4.4.3
- shadcn@4.7.0 → zod@3.25.76

brace-expansion:

- eslint-config-next@16.2.6 → typescript-eslint@8.59.3 → @typescript-eslint/typescript-estree@8.59.3 → minimatch@10.2.5 → brace-expansion@5.0.6
- eslint@9.39.4 → minimatch@3.1.5 → brace-expansion@1.1.14
- shadcn@4.7.0 → ts-morph@26.0.0 → @ts-morph/common@0.27.0 → minimatch@10.2.5 → brace-expansion@5.0.6

js-yaml:

- eslint@9.39.4 → @eslint/eslintrc@3.3.5 → js-yaml@4.2.0
- shadcn@4.7.0 → cosmiconfig@9.0.1 → js-yaml@4.2.0

next:

- next@16.2.6

baseline-browser-mapping:

- next@16.2.6 → baseline-browser-mapping@2.10.29
- shadcn@4.7.0 → browserslist@4.28.2 → baseline-browser-mapping@2.10.29

sharp:

- next@16.2.6 → sharp@0.34.5

shadcn:

- shadcn@4.7.0

browserslist:

- shadcn@4.7.0 → @babel/core@7.29.7 → @babel/helper-compilation-targets@7.29.7 → browserslist@4.28.2
- shadcn@4.7.0 → browserslist@4.28.2
- shadcn@4.7.0 → browserslist@4.28.2 → update-browserslist-db@1.2.3 → browserslist@4.28.2

@modelcontextprotocol/sdk:

- shadcn@4.7.0 → @modelcontextprotocol/sdk@1.29.0

@hono/node-server:

- shadcn@4.7.0 → @modelcontextprotocol/sdk@1.29.0 → @hono/node-server@1.19.14

hono:

- shadcn@4.7.0 → @modelcontextprotocol/sdk@1.29.0 → @hono/node-server@1.19.14 → hono@4.12.26
- shadcn@4.7.0 → @modelcontextprotocol/sdk@1.29.0 → hono@4.12.26

fast-uri:

- shadcn@4.7.0 → @modelcontextprotocol/sdk@1.29.0 → ajv-formats@3.0.1 → ajv@8.20.0 → fast-uri@3.1.2
- shadcn@4.7.0 → @modelcontextprotocol/sdk@1.29.0 → ajv@8.20.0 → fast-uri@3.1.2

ip-address:

- shadcn@4.7.0 → @modelcontextprotocol/sdk@1.29.0 → express-rate-limit@8.5.2 → ip-address@10.2.0

body-parser:

- shadcn@4.7.0 → @modelcontextprotocol/sdk@1.29.0 → express@5.2.1 → body-parser@2.2.2

qs:

- shadcn@4.7.0 → @modelcontextprotocol/sdk@1.29.0 → express@5.2.1 → body-parser@2.2.2 → qs@6.15.2
- shadcn@4.7.0 → @modelcontextprotocol/sdk@1.29.0 → express@5.2.1 → qs@6.15.2

proxy-addr:

- shadcn@4.7.0 → @modelcontextprotocol/sdk@1.29.0 → express@5.2.1 → proxy-addr@2.0.7

postcss-selector-parser:

- shadcn@4.7.0 → postcss-selector-parser@7.1.1

## Advisories cleared

These are the distinct direct advisory records in the initial audit. All affected package entries are absent from the final full and production audit reports. References are the advisory URLs supplied by npm.

- **@hono/node-server (moderate)**: [Node.js Adapter for Hono: Path traversal in `serve-static` on Windows via encoded backslash (`%5C`)](https://github.com/advisories/GHSA-frvp-7c67-39w9).
- **@modelcontextprotocol/sdk (high)**: [MCP TypeScript SDK: OAuth client could send credentials to an authorization server chosen by the MCP server](https://github.com/advisories/GHSA-6qxp-vccf-f47h).
- **@modelcontextprotocol/sdk (high)**: [MCP TypeScript SDK: Experimental tasks were not tied to the session that created them](https://github.com/advisories/GHSA-22jm-h49p-29qw).
- **@modelcontextprotocol/sdk (moderate)**: [MCP TypeScript client SDK: HTTP client transports and OAuth requests followed cross-origin redirects and re-sent custom headers and request bodies](https://github.com/advisories/GHSA-6prh-2h8m-c8cw).
- **@modelcontextprotocol/sdk (high)**: [MCP TypeScript SDK: One HTTP request within the default size limit could exhaust server memory during validation](https://github.com/advisories/GHSA-46jr-4wx8-v453).
- **@modelcontextprotocol/sdk (moderate)**: [MCP TypeScript SDK: Server bearer authentication accepted tokens issued for another service](https://github.com/advisories/GHSA-rvq5-wwqv-78pq).
- **baseline-browser-mapping (moderate)**: [baseline-browser-mapping process termination on invalid input causes denial of service](https://github.com/advisories/GHSA-w5vr-8v7q-w6rv).
- **body-parser (low)**: [body-parser vulnerable to denial of service when invalid limit value silently disables size enforcement](https://github.com/advisories/GHSA-v422-hmwv-36x6).
- **body-parser (high)**: [body-parser vulnerable to Denial of Service via trailing bytes after a compressed request body](https://github.com/advisories/GHSA-27r3-jxmh-p828).
- **brace-expansion (high)**: [brace-expansion: DoS via exponential-time expansion of consecutive non-expanding {} groups](https://github.com/advisories/GHSA-3jxr-9vmj-r5cp).
- **brace-expansion (high)**: [brace-expansion: DoS via unbounded expansion length causing an out-of-memory process crash](https://github.com/advisories/GHSA-mh99-v99m-4gvg).
- **brace-expansion (high)**: [brace-expansion: DoS via unbounded intermediate arrays, bypassing the CVE-2026-14257 mitigation](https://github.com/advisories/GHSA-rgw5-rvv9-x895).
- **brace-expansion (moderate)**: [brace-expansion: Quadratic-time expansion of the `{a},b}` rewrite causes CPU denial of service](https://github.com/advisories/GHSA-q2hr-2g5m-vwhr).
- **brace-expansion (high)**: [brace-expansion: DoS via uncontrolled recursion on nested brace groups causing stack exhaustion](https://github.com/advisories/GHSA-qhr7-859c-m2p7).
- **brace-expansion (high)**: [brace-expansion: DoS via uncontrolled recursion in parseCommaParts causing stack exhaustion](https://github.com/advisories/GHSA-6j4f-fj2g-mc7p).
- **browserslist (high)**: [Browserslist: Unbounded memory growth (no cache eviction) via distinct query results, leading to eventual OOM](https://github.com/advisories/GHSA-c83g-rgw3-j3cx).
- **browserslist (high)**: [Browserslist: Uncaught crash / prototype write via untrusted browserslist-stats.json custom stats (normalizeStats)](https://github.com/advisories/GHSA-73wf-gq98-2v4g).
- **fast-uri (high)**: [fast-uri vulnerable to host confusion via literal backslash authority delimiter](https://github.com/advisories/GHSA-v2hh-gcrm-f6hx).
- **fast-uri (high)**: [fast-uri vulnerable to host confusion via backslash authority introducer](https://github.com/advisories/GHSA-7p8r-x3mc-p8w7).
- **fast-uri (high)**: [fast-uri vulnerable to server-side request forgery via malformed IPv6 normalization](https://github.com/advisories/GHSA-f65p-4m7j-42xc).
- **fast-uri (high)**: [fast-uri vulnerable to server-side request forgery via repeated hostname percent-decoding](https://github.com/advisories/GHSA-fph4-wmhf-6fwf).
- **fast-uri (high)**: [fast-uri vulnerable to host confusion via percent-encoded scheme normalization](https://github.com/advisories/GHSA-jqff-g426-hqxp).
- **fast-uri (high)**: [fast-uri vulnerable to host confusion via failed IDN canonicalization](https://github.com/advisories/GHSA-4c8g-83qw-93j6).
- **fast-uri (high)**: [fast-uri vulnerable to authority injection via an unvalidated port in serialize](https://github.com/advisories/GHSA-qw65-cvwx-89v3).
- **fast-uri (moderate)**: [fast-uri vulnerable to inconsistent host case normalization via percent-encoded octets](https://github.com/advisories/GHSA-hrr3-gc8f-f4qj).
- **fast-uri (moderate)**: [fast-uri vulnerable to URI scheme spoofing via percent-encoded scheme decoding](https://github.com/advisories/GHSA-w74x-v6f9-j3xg).
- **fast-uri (low)**: [fast-uri vulnerable to improper path equivalence in relative reference normalization](https://github.com/advisories/GHSA-xhq7-xmqj-769h).
- **fast-uri (low)**: [fast-uri vulnerable to scheme injection via an unescaped first-segment colon in suffix references](https://github.com/advisories/GHSA-333x-w4r6-6crp).
- **hono (moderate)**: [Hono: API Gateway v1 adapter can drop a distinct repeated request header value during de-duplication](https://github.com/advisories/GHSA-xgm2-5f3f-mvvc).
- **hono (moderate)**: [hono/jsx does not isolate context per request, leading to cross-request data disclosure](https://github.com/advisories/GHSA-hvrm-45r6-mjfj).
- **hono (moderate)**: [Hono: Server-Side XSS via JSX Escaping Bypass in cx() Utility](https://github.com/advisories/GHSA-w62v-xxxg-mg59).
- **hono (moderate)**: [Hono: ReDoS in CORS middleware via Access-Control-Request-Headers](https://github.com/advisories/GHSA-8j4g-w8fx-2239).
- **hono (moderate)**: [Hono: `memo()` retains SSR output across requests, leading to cross-user data disclosure](https://github.com/advisories/GHSA-f23p-vx2j-j53r).
- **hono (low)**: [Hono: Proxy Helper does not remove response headers listed in the `Connection` header](https://github.com/advisories/GHSA-79qm-7rj5-m7r9).
- **hono (moderate)**: [Hono: Algorithmic Complexity DoS in Language Middleware](https://github.com/advisories/GHSA-54fx-42gc-7vw4).
- **hono (moderate)**: [Hono: Incomplete fix for CVE-2026-39408: `toSSG()` still writes files outside the output directory](https://github.com/advisories/GHSA-gqvv-2mrq-wpjv).
- **hono (moderate)**: [Hono: Unbounded dot-notation nesting in `parseBody()` can cause memory exhaustion](https://github.com/advisories/GHSA-g6gw-c38x-mqfc).
- **hono (moderate)**: [Hono: Query parser reads parameters after the URL fragment, causing cache-key and proxy interpretation differentials](https://github.com/advisories/GHSA-crvj-82cr-hjcx).
- **hono (moderate)**: [hono/jsx renders plain strings unescaped in boundary components, leading to XSS](https://github.com/advisories/GHSA-hxh3-vqpv-xpqv).
- **hono (moderate)**: [Hono: `serveStatic` decodes the request path a second time, leading to bypass of middleware on static paths](https://github.com/advisories/GHSA-5r4p-p66f-jhc7).
- **ip-address (high)**: [ip-address: Address4 decodes leading-zero octets as decimal while resolvers decode them as octal, allowing SSRF and trust-boundary bypass](https://github.com/advisories/GHSA-mwp4-54f8-5fhr).
- **ip-address (moderate)**: [ip-address: a CIDR suffix on the parsed address suppresses special-use classification and can bypass SSRF and trust-boundary checks](https://github.com/advisories/GHSA-4xrf-jv44-h6hh).
- **ip-address (moderate)**: [ip-address: misclassification of IPv4-mapped/NAT64 IPv6 addresses can bypass SSRF and trust-boundary checks](https://github.com/advisories/GHSA-22jq-vg5j-6vgg).
- **ip-address (moderate)**: [ip-address: Address6.isLinkLocal() recognizes fe80::/64 rather than fe80::/10, allowing SSRF and trust-boundary bypass to on-link hosts](https://github.com/advisories/GHSA-rpw4-54j3-4h4q).
- **ip-address (moderate)**: [ip-address: no classifier recognizes the NAT64 local-use range 64:ff9b:1::/48, allowing SSRF and trust-boundary bypass](https://github.com/advisories/GHSA-2vr4-cq9g-pvrc).
- **ip-address (moderate)**: [ip-address: isInSubnet() and isHostInSubnet() compare addresses of different families as if they shared an address space, allowing an allowlist check to admit an address outside its range](https://github.com/advisories/GHSA-j6r3-76f7-8jcv).
- **ip-address (moderate)**: [ip-address: Address6 builds a parse diagnostic proportional to the input with no length bound, allowing a single long string to stall or crash the process](https://github.com/advisories/GHSA-h3mg-xc3c-68pw).
- **ip-address (moderate)**: [ip-address: Address6 matches a zone identifier in quadratic time ahead of its length limit, allowing a single long string to stall the process](https://github.com/advisories/GHSA-rxp7-6hxx-x8q5).
- **js-yaml (high)**: [js-yaml: YAML merge-key chains can force quadratic CPU consumption](https://github.com/advisories/GHSA-52cp-r559-cp3m).
- **js-yaml (high)**: [JS-YAML: Quadratic CPU consumption in !!omap resolution (3.x and 4.x) — CVE-2026-59870 fix not backported](https://github.com/advisories/GHSA-5p4m-2wfm-xmqj).
- **js-yaml (high)**: [js-yaml: maxTotalMergeKeys does not limit CPU use for empty merge sources](https://github.com/advisories/GHSA-2883-xcg3-v3hh).
- **nanoid (high)**: [nanoid: non-secure generators can loop indefinitely with negative size](https://github.com/advisories/GHSA-28wg-ghj8-5hjv).
- **nanoid (high)**: [nanoid: custom generators can loop indefinitely when size is zero](https://github.com/advisories/GHSA-2v37-7h3g-55p8).
- **next (high)**: [Next.js: Middleware / Proxy bypass in App Router applications using Turbopack and single locale](https://github.com/advisories/GHSA-6gpp-xcg3-4w24).
- **next (high)**: [Next.js: Denial of Service in App Router using Server Actions](https://github.com/advisories/GHSA-m99w-x7hq-7vfj).
- **next (high)**: [Next.js: Server-Side Request Forgery in Server Actions on custom servers](https://github.com/advisories/GHSA-89xv-2m56-2m9x).
- **next (moderate)**: [Next.js: Cache confusion of response bodies for requests with bodies](https://github.com/advisories/GHSA-68g3-v927-f742).
- **next (moderate)**: [Next.js: Cache confusion of response bodies for requests with bodies containing invalid UTF-8 byte sequences](https://github.com/advisories/GHSA-4633-3j49-mh5q).
- **next (moderate)**: [Next.js: Unbounded Server Action payload in Edge runtime](https://github.com/advisories/GHSA-4c39-4ccg-62r3).
- **next (high)**: [Next.js: Server-Side Request Forgery in rewrites via attacker-controlled destination hostname](https://github.com/advisories/GHSA-p9j2-gv94-2wf4).
- **next (moderate)**: [Next.js: Denial of Service in the Image Optimization API using SVGs](https://github.com/advisories/GHSA-q8wf-6r8g-63ch).
- **next (moderate)**: [Next.js: Unauthenticated disclosure of internal Server Function endpoints](https://github.com/advisories/GHSA-955p-x3mx-jcvp).
- **next (critical)**: [Next.js: Unauthenticated Remote Code Execution on windows-hosted servers](https://github.com/advisories/GHSA-p293-qw3h-jr36).
- **next (critical)**: [Next.js: Unauthenticated Remote Code Execution in Image Optimization API when AVIF files are used](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4).
- **next (critical)**: [Next.js: Remote Code Execution in next/og ImageResponse](https://github.com/advisories/GHSA-vcvr-r3jv-pc5j).
- **next (moderate)**: [Next.js has cache poisoning of SSG and ISR pages in self-hosted applications](https://github.com/advisories/GHSA-4jqv-mc3x-m676).
- **next (low)**: [Next.js has information disclosure in development server's Model Context Protocol endpoint](https://github.com/advisories/GHSA-39w2-rjm5-chcv).
- **next (moderate)**: [Next.js has information disclosure in App Router metadata image routes via dynamicParams bypass](https://github.com/advisories/GHSA-f87g-xv8r-7p7x).
- **next (moderate)**: [Next.js has cache poisoning in SSG/ISR rendering that leads to cross-user content substitution and persistent denial of service](https://github.com/advisories/GHSA-mcj8-r9mp-w47p).
- **next (high)**: [Next.js has Server-Side Request Forgery in Image Optimization](https://github.com/advisories/GHSA-cjq9-62q9-8jv4).
- **next (critical)**: [Next.js: Unauthenticated Remote Code Execution in Image Optimization API when SVG files are used](https://github.com/advisories/GHSA-2464-fhr4-w9xw).
- **next (high)**: [Next.js: Denial of Service in App Router using Server Actions](https://github.com/advisories/GHSA-p3m5-59mp-jv5r).
- **next (critical)**: [Next.js: Unauthenticated Remote Code Execution in `use cache` functions returning typed arrays](https://github.com/advisories/GHSA-673q-mjm6-r5xr).
- **postcss (moderate)**: [PostCSS has XSS via Unescaped </style> in its CSS Stringify Output](https://github.com/advisories/GHSA-qx2v-qp2m-jg93).
- **postcss (high)**: [PostCSS: Arbitrary file read and information disclosure via attacker-controlled sourceMappingURL in CSS comments](https://github.com/advisories/GHSA-6g55-p6wh-862q).
- **postcss (moderate)**: [PostCSS: incomplete fix of GHSA-6g55-p6wh-862q — attacker-controlled sourceMappingURL reads arbitrary .map files when `from` is unset](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp).
- **postcss (high)**: [PostCSS: Path Traversal in Previous Source Map Auto-Loading (sourceMappingURL) leads to Arbitrary .map File Disclosure](https://github.com/advisories/GHSA-r28c-9q8g-f849).
- **postcss-selector-parser (low)**: [postcss-selector-parser allows denial of service through uncontrolled AST recursion](https://github.com/advisories/GHSA-w9m9-85wc-3x92).
- **postcss-selector-parser (moderate)**: [PostCSS: Quadratic complexity in flat selector parsing allows CPU exhaustion](https://github.com/advisories/GHSA-rj75-hqrm-r3gf).
- **proxy-addr (critical)**: [proxy-addr vulnerable to IP spoofing via IPv4-mapped IPv6 trust subnet](https://github.com/advisories/GHSA-jqcg-44mw-7w3h).
- **qs (moderate)**: [qs array-limit bypass via bracket-key comma parsing](https://github.com/advisories/GHSA-x5fp-wj9c-mxmx).
- **qs (moderate)**: [qs: Denial of Service via Attacker Controlled isBuffer](https://github.com/advisories/GHSA-4mjr-xmp4-gh2g).
- **sharp (high)**: [sharp inherited vulnerabilities in libvips: CVE-2026-33327, CVE-2026-33328, CVE-2026-35590, CVE-2026-35591](https://github.com/advisories/GHSA-f88m-g3jw-g9cj).
- **sharp (high)**: [sharp: Vulnerabilities in libheif: GHSA-g89c-p67h-r497 and GHSA-2jg2-4ch7-h545](https://github.com/advisories/GHSA-rgj7-g3m4-5g8c).
- **sharp (high)**: [sharp : Vulnerability in librsvg dependency CVE-2026-96889](https://github.com/advisories/GHSA-wq5f-xc86-pv6w).
- **source-map-js (high)**: [source-map-js allows event-loop denial of service through indexed source-map section offsets](https://github.com/advisories/GHSA-68fv-2mgg-jv7q).
- **zod (high)**: [Zod can exhaust memory while validating oversized constrained collections](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5).

## Complete dependency version diff

83 lockfile package paths changed version, 13 were added, and 69 were removed. Path changes can represent deduplication or relocation as well as new packages. Only three direct dependency declarations changed. Many removals come from the updated shadcn CLI; native Next.js/sharp platform packages also account for multiple paths.

| Lockfile package path | Before | After |
| --- | --- | --- |
| node_modules/@emnapi/runtime | 1.10.0 | 1.11.3 |
| node_modules/@hono/node-server | 1.19.14 | 2.1.5 |
| node_modules/@img/sharp-darwin-arm64 | 0.34.5 | 0.35.5 |
| node_modules/@img/sharp-darwin-x64 | 0.34.5 | 0.35.5 |
| node_modules/@img/sharp-freebsd-wasm32 | — | 0.35.5 |
| node_modules/@img/sharp-libvips-darwin-arm64 | 1.2.4 | 1.3.4 |
| node_modules/@img/sharp-libvips-darwin-x64 | 1.2.4 | 1.3.4 |
| node_modules/@img/sharp-libvips-linux-arm | 1.2.4 | 1.3.4 |
| node_modules/@img/sharp-libvips-linux-arm64 | 1.2.4 | 1.3.4 |
| node_modules/@img/sharp-libvips-linux-ppc64 | 1.2.4 | 1.3.4 |
| node_modules/@img/sharp-libvips-linux-riscv64 | 1.2.4 | 1.3.4 |
| node_modules/@img/sharp-libvips-linux-s390x | 1.2.4 | 1.3.4 |
| node_modules/@img/sharp-libvips-linux-x64 | 1.2.4 | 1.3.4 |
| node_modules/@img/sharp-libvips-linuxmusl-arm64 | 1.2.4 | 1.3.4 |
| node_modules/@img/sharp-libvips-linuxmusl-x64 | 1.2.4 | 1.3.4 |
| node_modules/@img/sharp-linux-arm | 0.34.5 | 0.35.5 |
| node_modules/@img/sharp-linux-arm64 | 0.34.5 | 0.35.5 |
| node_modules/@img/sharp-linux-ppc64 | 0.34.5 | 0.35.5 |
| node_modules/@img/sharp-linux-riscv64 | 0.34.5 | 0.35.5 |
| node_modules/@img/sharp-linux-s390x | 0.34.5 | 0.35.5 |
| node_modules/@img/sharp-linux-x64 | 0.34.5 | 0.35.5 |
| node_modules/@img/sharp-linuxmusl-arm64 | 0.34.5 | 0.35.5 |
| node_modules/@img/sharp-linuxmusl-x64 | 0.34.5 | 0.35.5 |
| node_modules/@img/sharp-wasm32 | 0.34.5 | 0.35.5 |
| node_modules/@img/sharp-webcontainers-wasm32 | — | 0.35.5 |
| node_modules/@img/sharp-win32-arm64 | 0.34.5 | 0.35.5 |
| node_modules/@img/sharp-win32-ia32 | 0.34.5 | 0.35.5 |
| node_modules/@img/sharp-win32-x64 | 0.34.5 | 0.35.5 |
| node_modules/@inquirer/ansi | 2.0.5 | — |
| node_modules/@inquirer/confirm | 6.0.13 | — |
| node_modules/@inquirer/core | 11.1.10 | — |
| node_modules/@inquirer/figures | 2.0.5 | — |
| node_modules/@inquirer/type | 4.0.5 | — |
| node_modules/@modelcontextprotocol/sdk | 1.29.0 | 1.32.2 |
| node_modules/@mswjs/interceptors | 0.41.9 | — |
| node_modules/@mswjs/interceptors/node_modules/@open-draft/deferred-promise | 2.2.0 | — |
| node_modules/@next/env | 16.2.6 | 16.4.3 |
| node_modules/@next/eslint-plugin-next | 16.2.6 | 16.4.3 |
| node_modules/@next/swc-darwin-arm64 | 16.2.6 | 16.4.3 |
| node_modules/@next/swc-darwin-x64 | 16.2.6 | 16.4.3 |
| node_modules/@next/swc-linux-arm64-gnu | 16.2.6 | 16.4.3 |
| node_modules/@next/swc-linux-arm64-musl | 16.2.6 | 16.4.3 |
| node_modules/@next/swc-linux-x64-gnu | 16.2.6 | 16.4.3 |
| node_modules/@next/swc-linux-x64-musl | 16.2.6 | 16.4.3 |
| node_modules/@next/swc-win32-arm64-msvc | 16.2.6 | 16.4.3 |
| node_modules/@next/swc-win32-x64-msvc | 16.2.6 | 16.4.3 |
| node_modules/@open-draft/deferred-promise | 3.0.0 | — |
| node_modules/@open-draft/logger | 0.3.0 | — |
| node_modules/@open-draft/until | 2.1.0 | — |
| node_modules/@shadcn/registry | — | 0.2.0 |
| node_modules/@shadcn/registry/node_modules/fast-glob | — | 3.3.3 |
| node_modules/@shadcn/registry/node_modules/glob-parent | — | 5.1.2 |
| node_modules/@shadcn/registry/node_modules/tsconfig-paths | — | 4.2.0 |
| node_modules/@swc/helpers | 0.5.15 | 0.5.23 |
| node_modules/@ts-morph/common/node_modules/brace-expansion | 5.0.6 | 5.0.12 |
| node_modules/@types/set-cookie-parser | 2.4.10 | — |
| node_modules/@types/statuses | 2.0.6 | — |
| node_modules/@typescript-eslint/typescript-estree/node_modules/brace-expansion | 5.0.6 | 5.0.12 |
| node_modules/agent-base | 7.1.4 | — |
| node_modules/baseline-browser-mapping | 2.10.29 | 2.11.33 |
| node_modules/body-parser | 2.2.2 | 2.4.0 |
| node_modules/body-parser/node_modules/content-type | — | 2.1.0 |
| node_modules/brace-expansion | 1.1.14 | 1.1.21 |
| node_modules/browserslist | 4.28.2 | 4.29.4 |
| node_modules/bundle-name | 4.1.0 | 4.1.1 |
| node_modules/caniuse-lite | 1.0.30001792 | 1.0.30001819 |
| node_modules/cli-width | 4.1.0 | — |
| node_modules/cliui | 8.0.1 | — |
| node_modules/cliui/node_modules/ansi-regex | 5.0.1 | — |
| node_modules/cliui/node_modules/emoji-regex | 8.0.0 | — |
| node_modules/cliui/node_modules/string-width | 4.2.3 | — |
| node_modules/cliui/node_modules/strip-ansi | 6.0.1 | — |
| node_modules/cn | — | 0.2.6 |
| node_modules/content-disposition | 1.1.0 | 2.0.1 |
| node_modules/cosmiconfig | 9.0.1 | — |
| node_modules/data-uri-to-buffer | 4.0.1 | — |
| node_modules/default-browser | 5.5.0 | 5.5.1 |
| node_modules/electron-to-chromium | 1.5.355 | 1.5.464 |
| node_modules/env-paths | 2.2.1 | — |
| node_modules/error-ex | 1.3.4 | — |
| node_modules/eslint-config-next | 16.2.6 | 16.4.3 |
| node_modules/eventsource-parser | 3.0.8 | 3.1.1 |
| node_modules/express | 5.2.1 | 5.3.0 |
| node_modules/express-rate-limit | 8.5.2 | 8.7.1 |
| node_modules/express/node_modules/content-type | — | 2.1.0 |
| node_modules/fast-string-truncated-width | 3.0.3 | — |
| node_modules/fast-string-width | 3.0.2 | — |
| node_modules/fast-uri | 3.1.2 | 3.1.9 |
| node_modules/fast-wrap-ansi | 0.2.0 | — |
| node_modules/fetch-blob | 3.2.0 | — |
| node_modules/formdata-polyfill | 4.0.10 | — |
| node_modules/get-caller-file | 2.0.5 | — |
| node_modules/graphql | 16.14.0 | — |
| node_modules/headers-polyfill | 5.0.1 | — |
| node_modules/hono | 4.12.26 | 4.13.14 |
| node_modules/https-proxy-agent | 7.0.6 | — |
| node_modules/iconv-lite | 0.7.2 | 0.7.3 |
| node_modules/ip-address | 10.2.0 | 10.7.5 |
| node_modules/is-arrayish | 0.2.1 | — |
| node_modules/is-fullwidth-code-point | 3.0.0 | — |
| node_modules/is-node-process | 1.2.0 | — |
| node_modules/jose | 6.2.3 | 6.2.13 |
| node_modules/js-yaml | 4.2.0 | 4.3.2 |
| node_modules/json-parse-even-better-errors | 2.3.1 | — |
| node_modules/lines-and-columns | 1.2.4 | — |
| node_modules/media-typer | 1.1.0 | 1.1.1 |
| node_modules/msw | 2.14.6 | — |
| node_modules/msw/node_modules/cookie | 1.1.1 | — |
| node_modules/mute-stream | 3.0.0 | — |
| node_modules/nanoid | 3.3.12 | 3.3.20 |
| node_modules/negotiator | 1.0.0 | 1.1.0 |
| node_modules/negotiator/node_modules/content-type | — | 2.1.0 |
| node_modules/next | 16.2.6 | 16.4.3 |
| node_modules/next/node_modules/postcss | 8.4.31 | — |
| node_modules/node-domexception | 1.0.0 | — |
| node_modules/node-fetch | 3.3.2 | — |
| node_modules/node-releases | 2.0.44 | 2.0.60 |
| node_modules/on-finished | 2.4.1 | 2.4.2 |
| node_modules/open | 11.0.0 | 11.0.4 |
| node_modules/outvariant | 1.4.3 | — |
| node_modules/parse-json | 5.2.0 | — |
| node_modules/path-to-regexp | 6.3.0 | 8.4.2 |
| node_modules/postcss | 8.5.14 | 8.5.23 |
| node_modules/postcss-selector-parser | 7.1.1 | 7.1.7 |
| node_modules/powershell-utils | 0.1.0 | 0.2.1 |
| node_modules/proxy-addr | 2.0.7 | 2.0.8 |
| node_modules/qs | 6.15.2 | 6.16.1 |
| node_modules/range-parser | 1.2.1 | 1.3.0 |
| node_modules/require-directory | 2.1.1 | — |
| node_modules/rettime | 0.11.11 | — |
| node_modules/router/node_modules/path-to-regexp | 8.4.2 | — |
| node_modules/set-cookie-parser | 3.1.0 | — |
| node_modules/shadcn | 4.7.0 | 4.22.1 |
| node_modules/shadcn/node_modules/zod | 3.25.76 | — |
| node_modules/sharp | 0.34.5 | 0.35.5 |
| node_modules/sharp/node_modules/semver | 7.8.0 | 7.8.5 |
| node_modules/side-channel | 1.1.0 | 1.1.1 |
| node_modules/smart-buffer | — | 4.2.0 |
| node_modules/socks | — | 2.8.10 |
| node_modules/source-map-js | 1.2.1 | 1.2.2 |
| node_modules/strict-event-emitter | 0.5.1 | — |
| node_modules/tagged-tag | 1.0.0 | — |
| node_modules/tldts | 7.0.30 | — |
| node_modules/tldts-core | 7.0.30 | — |
| node_modules/tough-cookie | 6.0.1 | — |
| node_modules/type-fest | 5.6.0 | 4.41.0 |
| node_modules/type-is/node_modules/content-type | 2.0.0 | 2.1.0 |
| node_modules/undici | — | 7.30.1 |
| node_modules/until-async | 3.0.2 | — |
| node_modules/update-browserslist-db | 1.2.3 | 1.3.4 |
| node_modules/web-streams-polyfill | 3.3.3 | — |
| node_modules/wrap-ansi | 7.0.0 | — |
| node_modules/wrap-ansi/node_modules/ansi-regex | 5.0.1 | — |
| node_modules/wrap-ansi/node_modules/emoji-regex | 8.0.0 | — |
| node_modules/wrap-ansi/node_modules/string-width | 4.2.3 | — |
| node_modules/wrap-ansi/node_modules/strip-ansi | 6.0.1 | — |
| node_modules/wsl-utils | 0.3.1 | 1.0.1 |
| node_modules/y18n | 5.0.8 | — |
| node_modules/yargs | 17.7.2 | — |
| node_modules/yargs-parser | 21.1.1 | — |
| node_modules/yargs/node_modules/ansi-regex | 5.0.1 | — |
| node_modules/yargs/node_modules/emoji-regex | 8.0.0 | — |
| node_modules/yargs/node_modules/string-width | 4.2.3 | — |
| node_modules/yargs/node_modules/strip-ansi | 6.0.1 | — |
| node_modules/zod | 4.4.3 | 4.6.7 |
