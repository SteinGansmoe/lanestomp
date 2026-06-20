# Homepage Counter Pick Entry

Issue 259 redesigns the homepage around the approved visual reference in
`public/images/design/Homepage.png`.

## Hierarchy

1. Top navigation with real LaneStomp routes, auth state, and Counter Pick CTA.
2. Counter Pick hero with cinematic champion art and an integrated champion search.
3. Confidence Guide based on stored Riot game count.
4. Matchup Guide feature links.
5. Unified LaneStomp statistics strip.

The homepage should feel like the Counter Pick product surface, not a generic SaaS landing page.
Use sharp borders, dark navy surfaces, cyan accents, and minimal corner radius.

Issue 260 adds the final atmosphere and navigation polish layer:

- a layered navy background with faint grain, tactical linework, restrained glow, and vignette
- a larger, clearer LaneStomp logo in the homepage navbar
- a sharp authenticated account trigger aligned with the redesigned topbar
- a detached account dropdown for the topbar so opening the menu never changes navbar layout
- a mobile authenticated-only account entry that keeps signed-in actions reachable

Issue 261 promotes the approved homepage treatment into shared site foundations:

- `LaneStompPageBackground` owns the layered navy atmosphere, grain, tactical linework, glow, and
  vignette so public routes do not duplicate one-off background code.
- `LaneStompPageShell` standardizes the max width, gutters, page stacking, and dark base surface.
- `SiteHeader` is now the shared top navigation for homepage, Counter Pick, matchup, champion,
  auth/account, and admin shells.
- Shared `Button`, `Input`, and `Card` primitives use the sharp LaneStomp border, focus, and panel
  language by default instead of rounded shadcn-style surfaces.
- The old desktop sidebar page offset has been removed from the main shells and footer so the same
  top navigation geometry carries across the platform.

## Search Behavior

The homepage Counter Pick form uses the public Counter Pick champion search utilities and the
canonical active champion registry. It routes to:

```text
/league/counters?champion=<championId>&role=<role>
```

The search supports keyboard navigation, Enter selection, Escape close, outside-click close, and a
quick-access champion row. The `ALL` control opens the complete searchable selector, so the shortcut
row never replaces access to the full champion roster.

## Confidence Guide

Homepage confidence copy is sample-size based, not win-rate-tier based.

| Confidence | Stored games |
| --- | --- |
| Very high | 1000+ |
| High | 500-999 |
| Medium | 200-499 |
| Low | 50-199 |
| Very low | Under 50 / preliminary |

Avoid copy that suggests normal high-confidence matchup data has extreme win rates.

## Account Menu

The homepage topbar uses the existing `AuthenticatedAccountMenu` logic rather than a fake auth
control. The topbar variant renders its dropdown through a portal with fixed positioning, anchored
to the trigger. This keeps the dropdown out of navbar layout flow and preserves the closed navbar
height while supporting Escape and outside-click close behavior.
