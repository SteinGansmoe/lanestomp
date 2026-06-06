# ADC Matchup Generation Preparation

## Recommendation

Use the hybrid ADC model for the first ADC coverage pass.

The matchup row remains `Champion A vs Champion B` with `role = adc`. The generated guidance should compare the two ADC champions directly while assuming neutral support conditions. Support influence is treated as a condition, such as support cooldowns being available or bot lane priority being secured, instead of adding a separate support champion dimension.

This keeps the current matchup architecture intact, avoids a full botlane combinatorial explosion, and leaves room for future support modifiers that can adjust the same ADC matchup without creating a new matchup row.

## Current Architecture

- Generation starts from admin server actions in `src/app/admin/league/matchups/actions.ts`.
- Draft wording is built in `src/features/league/matchup-draft-prompt.ts`.
- Champion profile and combat profile data are formatted into the prompt before the provider call.
- Matchups are stored in `league_matchups` by `champion_a_id`, `champion_b_id`, and `role`.
- A matchup direction is intentional: `Jinx vs Caitlyn` and `Caitlyn vs Jinx` are separate rows.
- Public matchup lookup reads reviewed rows for the requested role and champion direction.
- Admin generation tooling can already plan, queue, and regenerate role-specific directional matchups.

## Assumptions That Need Care For ADC

- Top, Mid, and Jungle can usually describe a single champion-vs-champion plan. ADC lane pressure is heavily shaped by support picks.
- Existing storage has no support champion dimension, so it cannot represent `Jinx + Lulu vs Caitlyn + Lux` as a separate matchup.
- Lane priority, all-in threat, sustain, and poke can flip based on supports, so ADC guidance must avoid exact 2v2 certainty.
- Existing non-jungle cards still work for ADC, but `trading_pattern` must be interpreted as ADC trading around range, CS, wave state, and support cooldown availability.
- Jungle-specific prompt language must not leak into ADC cards.

## ADC Prompt Rules

- Focus on range advantage, wave access, CS pressure, poke windows, all-in windows, reset timing, item spikes, dragon setup, turret pressure, scaling, and teamfight DPS role.
- Assume neutral supports unless admin notes provide a specific support context.
- Mention support dependency as a condition instead of a named matchup.
- Avoid specific support champion claims in generated text.
- Avoid jungle-only concepts such as invade, camp tracking, jungle pathing, clear speed, Smite, Scuttle, Herald, Void Grubs, counter-jungle, or first clear unless admin notes explicitly require them.

## Readiness Check

The admin matchup panel includes an ADC readiness check before full generation. It shows:

- ADC champion count from the existing role tagging logic.
- Expected directional ADC matchups.
- Existing ADC rows and missing rows.
- Estimated queue time.
- Rough OpenAI usage as one request per matchup, plus a retry-risk range.

Do not bulk generate ADC until the readiness numbers and first sample drafts are reviewed.
