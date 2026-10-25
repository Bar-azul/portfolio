# Bar Azulay – Portfolio

Bilingual (Hebrew / English) portfolio built with Next.js 16, Tailwind CSS 4 and Motion.
Every page is statically generated: `/he`, `/en`, and `/[locale]/projects/[slug]`.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000 → redirects to /he
npm run build    # production build
```

## Add a new project

All projects live in **`src/content/projects.ts`**. Copy an existing object and edit it:

| Field | What it does |
|---|---|
| `slug` | URL of the project page (`/he/projects/<slug>`) |
| `kind` | `"paz"`, `"personal"` or `"client"` – the main tabs |
| `topics` | Any of `agents`, `automation`, `documents`, `web`, `mobile`, `product` – the chips and the hero diagram counts |
| `tech` | Shown on the card; names that also appear in `profile.ts` skills become clickable in the Stack section |
| `status` | `production`, `live`, `building`, `prototype` |
| `metric` | Optional big number on the card, e.g. `{ value: "10K", label: { he: "שיחות בחודש", en: "calls a month" } }` |
| `featured` | `true` = double-width card |
| `links` | Optional buttons on the project page |

Every text field takes `{ he: "...", en: "..." }`. Order in the array = order on the site.

## Edit personal details

`src/content/profile.ts` – name, intro, contact links, experience timeline and skills.
**Set your real `github` and `linkedin` URLs there before publishing.**

## Deploy to Vercel

1. Push this folder to a new GitHub repo.
2. In Vercel: **Add New → Project → Import** the repo. No settings needed.
3. Optional: add a custom domain in the project's Domains tab.

## Structure

```
src/
  app/[locale]/              layout, home page, project pages
  components/AgentGraph.tsx  the interactive system diagram in the hero
  components/ProjectExplorer tabs + topic filters + grid
  content/                   projects.ts, profile.ts, types.ts  ← edit these
  lib/i18n.ts                UI strings and labels in both languages
```
