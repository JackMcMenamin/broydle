# Broydle

Prototype of a daily puzzle hub in the spirit of Daily Orbs: four tasks a day, 3 hearts per task, up to 3 stars for progress. Website-first, dark theme, everything fits one laptop screen with no scrolling. Each task slot has a pastel accent (pink, green, yellow, blue) used for its title, hearts, dots and primary button.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000. `npm run build` writes a fully static site to `out/`.

## Deploy

Live at https://broydle.online. Hosted on Vercel: import the GitHub repo, keep the defaults (framework Next.js), and every push to `main` deploys. The app is a static export, so it also works on any static host.

## Structure

- `src/templates/<template>/` – one folder per **template** (a mechanic). Each holds:
  - `types.ts` – the content schema for that template
  - `meta.ts` – default "how to play" text
  - `content.ts` – the editions (actual puzzle content)
  - `<Template>.tsx` – the React component
  - `elements/` – sub-components used by the template (canvas, map, silhouette...)
- `src/puzzles/days.ts` – the schedule: which editions appear on which day.
- `src/core/` – shared types (`TaskBase`, the `Task` union) and the registry (`taskMeta`, `taskTotal`, `taskSig`).
- `src/lib/engine.ts` – hearts, stars, locking, and localStorage persistence (`useTask`).
- `src/components/` – `AppFrame` (fixed header / play area / action bar), `TaskShell` (per-task chrome), `Hub`, `TaskView`.

Routes: `/day/{n}/` for a day, `/day/{n}/{slot}/` for a task (slot 1–4).

## Templates and the games built on them

| Template | Games (series) | Mechanic |
|---|---|---|
| `reveal` | Pixel Reveal, Zoomed In, Flag Frag, Shape Up | Catalog of 5 items. Type the answer. Wrong guesses reveal more (pixels sharpen, zoom out, hints unlock). Wrong on the last stage costs a heart. Jump between items freely. |
| `pindrop` | Pin Drop (themed: landmarks, natural wonders) | Click the map to drop a pin, confirm. Within `tolerance` km counts. |
| `ballpark` | Ballpark, Date the Photo | Slider estimate, absolute `within` tolerance. Optional image per question. |
| `thisorthat` | This or That | Drag each card left or right into a group (arrow keys and clicking work too). |
| `pairup` | Pair Up | Drag a left tile onto its match, or click one then the other. |
| `fillgap` | Fill the Gap | Type the missing member of a set. |

Stars: 1 at a third of units correct, 2 at two thirds, 3 for all. Losing all hearts locks the task but keeps stars earned. Saved progress is stamped with a task signature, so changing content never loads stale state.

## Adding a game

- New edition of an existing template: add it to that template's `content.ts` and schedule it in `days.ts`.
- New template: create `src/templates/<name>/` with the files above, add its type to the `Task` union in `src/core/types.ts`, add cases to `src/core/registry.ts` and `src/components/TaskView.tsx`.

## Theme

Colours are CSS variables in `src/app/globals.css` (`--paper`, `--ink`, `--raise`, `--faint`, `--muted`) mapped to Tailwind classes `bg-paper`, `text-ink`, `border-faint`, etc. Per-task accents live in `src/core/base.ts` (`ACCENTS`) and are exposed as `--accent` by `AppFrame`. A light theme is a matter of swapping the five variables.

## Assets

Images are from Wikimedia Commons (credits and licences are in each `content.ts` and shown on reveal). Flags come from the `flag-icons` package. Map and country outlines come from `world-atlas` (Natural Earth).
