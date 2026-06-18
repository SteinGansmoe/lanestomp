# Homepage Counter Pick Entry

Issue 258 moves the homepage from broad platform messaging to a product-first entry point.

## Hierarchy

1. Counter Pick hero with champion search and role selection.
2. Matchup Guides as the secondary live tool.
3. Three concise value cards.
4. Compact platform progress metrics.
5. Lower-priority planned tools.

Counter Pick is presented as available now. Matchup Guides remain prominent, but they no longer compete with the hero.

## Shared Behavior

The homepage Counter Pick form uses the public Counter Pick champion search utilities and League role definitions. It routes to:

```text
/league/counters?champion=<championId>&role=<role>
```

The Counter Pick page reads those query params and initializes the existing selector with the selected champion and role.

## Future Artwork

The homepage uses a reusable `ThemedHeroBackground` layer for atmospheric champion art. It supports:

- a wide background image
- responsive focal positioning
- dark overlays
- cyan and gold lighting
- a soft fade into the page

Text is never baked into artwork, so future champion images can be swapped without restructuring the page.
