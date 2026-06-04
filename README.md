# LaneStomp

LaneStomp is a League of Legends learning platform focused on helping players understand matchups, champion identities, and lane decisions faster.

The current MVP is centered on matchup guidance for League of Legends, with future product areas planned around:

- Matchup Guides
- Counter Picks (planned)
- Champion Knowledge
- Track My Climb (planned)
- Patch Notes (planned)

## Features

- AI-powered matchup generation for League of Legends champion matchups
- Champion combat profiles used as structured source material for generation
- Role-based matchup generation for lane-specific advice
- Admin review workflow for generating, editing, reviewing, and publishing matchup drafts
- Matchup confidence system for tracking profile coverage and generation quality
- Player-facing matchup pages with champion-select-friendly guidance
- Feedback system for reporting matchup card quality issues
- League champion import workflow using Riot Data Dragon

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase
- OpenAI
- Vercel

## Project Structure

```text
src/app
  Next.js app routes for the public site, League matchup pages, auth pages,
  account settings, legal pages, and the admin panel.

src/components
  Shared UI and feature components, including admin tooling, League matchup
  components, game detail components, and reusable UI primitives.

src/features/league
  League-specific domain code, including champion data access, matchup routes,
  matchup fetching, role helpers, AI prompt construction, and draft generation.

src/features/league/champion-knowledge
  Structured champion combat profiles used by the matchup generation system.

src/lib
  Shared application utilities for Supabase, admin access, profile handling,
  and server-side data loading.

scripts
  Utility scripts, including the League champion importer for Riot Data Dragon.

supabase
  Supabase configuration, seed data, and database migrations.

public
  Static assets served by the app.
```

## Development

Install dependencies:

```bash
npm install
```

Create `.env.local` manually using the environment variables listed below.

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Run lint:

```bash
npm run lint
```

Run a production build:

```bash
npm run build
```

Run TypeScript checks:

```bash
npx tsc --noEmit
```

Import League champions from Riot Data Dragon:

```bash
npm run import:lol-champions
```

Dry-run the champion import without writing to Supabase:

```bash
npm run import:lol-champions -- --dry-run
```

## Environment Variables

Required for the app:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_ADMIN_EMAILS
OPENAI_API_KEY
```

Required for importing champion data into Supabase:

```text
SUPABASE_SERVICE_ROLE_KEY
```

Optional champion import configuration:

```text
SUPABASE_URL
RIOT_DDRAGON_LOCALE
RIOT_DDRAGON_VERSION
```

Notes:

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` connect the app to Supabase.
- `NEXT_PUBLIC_ADMIN_EMAILS` controls which authenticated users can access admin tooling.
- `OPENAI_API_KEY` enables AI matchup draft generation. Without it, the app falls back to placeholder drafts for admin review. Use this exact variable name locally and in Vercel.
- `SUPABASE_SERVICE_ROLE_KEY` should only be used in trusted server or script contexts. Do not expose it to the browser.

## Roadmap

Current MVP goals:

- Expand and refine champion combat profiles.
- Improve AI-generated matchup quality with more authentic League terminology.
- Build out reviewed matchup coverage across roles.
- Continue improving admin review speed and confidence tracking.
- Collect player feedback on matchup cards and use it to guide review priorities.
- Prepare future surfaces for counter picks, champion knowledge pages, patch notes, and climb tracking.

## Disclaimer

LaneStomp is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
