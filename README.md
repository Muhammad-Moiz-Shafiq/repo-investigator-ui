# Autonomous Repository Investigator — Frontend

Frontend for a research project studying whether an AI agent investigating a software
repository's history does better with a small set of curated tools or open access to run
its own code. Full background is in `HANDOFF.md`.

Three views:

- `/ask` — pick a repo, model, and question, and watch the curated-tools agent
  investigate it live.
- `/compare` — replay saved traces from the study, curated-tools vs. open-sandbox,
  side by side.
- `/findings` — the study's headline quality and cost results.

## Stack

Next.js (App Router) with TypeScript, Tailwind CSS, and shadcn/ui. Light, dark, and
system theme support via `next-themes`.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The app talks to the backend over HTTP using `NEXT_PUBLIC_API_BASE_URL`. Set it in a
local `.env.local` file:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

If it's not set, it defaults to `http://localhost:8000`. If the backend is unreachable
or an endpoint isn't implemented yet, the Compare and Findings views fall back to
bundled mock data matching the real API shapes, so the UI stays usable during
development.

## Deployment

This repo deploys to Vercel as its own project, separate from the backend. See below
for the full procedure.

## Project structure

- `src/app` — pages (`/`, `/ask`, `/compare`, `/findings`)
- `src/components` — shared UI, including `trace-step.tsx` and `trace-view.tsx`,
  which render an agent's step-by-step reasoning trace
- `src/lib/api.ts` — backend API client
- `src/lib/types.ts` — API request/response types, matching the backend contract
- `src/lib/mock-data.ts` — fallback data used when the backend is unavailable
