# Adamant — Website

The website for the Adamant protocol — [adamantprotocol.com](https://adamantprotocol.com).

Static [Astro](https://astro.build) site, pure CSS, no client-side framework. Deployed to Vercel. Apache 2.0.

---

## Quick start

```bash
npm install
npm run dev
```

Then open `http://localhost:4321`. Edits hot-reload.

To preview a production build locally:

```bash
npm run build
npm run preview
```

---

## Project structure

```
public/
├── adm-mark.svg          The Adamant mark — transparent-bg black A
├── home-og.png           Fallback OG image
├── llms.txt              AI / LLM crawler-friendly summary
├── og/{slug}.png         Per-page OG images (overwritten by `npm run gen-og`)
└── robots.txt            Search + AI crawler allowlist

scripts/
└── gen-og.mjs            Playwright OG screenshot generator (opt-in)

src/
├── components/
│   ├── HubFooter.astro   Footer with brand block + 4-column nav
│   ├── PhaseSwitcher.astro  Floating "Preview phase" panel
│   ├── StatusStrip.astro Six-cell chain status header
│   └── Topbar.astro      Logo + 8-page nav + phase pill
├── data/
│   └── chain.ts          Phase definitions, properties, mechanisms, tiers
├── layouts/
│   └── HubLayout.astro   Page shell + inline phase + reveal scripts
├── pages/
│   ├── index.astro       Home (hero, properties, mechanisms, cohort grid)
│   ├── about.astro       Properties, tiers, principles, framings, negation
│   ├── genesis.astro     Pool drain, burn-to-mint, cohort register, stake floors
│   ├── network.astro     Operational view (validator set, mempool, throughput)
│   ├── operator.astro    Operator dashboard, four roles
│   ├── spec.astro        Whitepaper sections parsed inline at build time
│   ├── updates.astro     Project journal, live from GitHub commits
│   └── wallet.astro      Reference wallet preview
└── styles/
    └── global.css        "Public Record" — pure CSS, no Tailwind

whitepaper/                Canonical protocol specification (markdown)
```

---

## Commands

| Command            | What it does                                              |
| ------------------ | --------------------------------------------------------- |
| `npm run dev`      | Astro dev server with HMR at `http://localhost:4321`      |
| `npm run build`    | Static build → `dist/`                                     |
| `npm run preview`  | Serve the production build locally                        |
| `npm run gen-og`   | Boot preview, screenshot each page hero, write `/og/*.png`. Requires `npm install` then `npx playwright install chromium`. |

---

## Editing content

**Whitepaper.** All thirteen sections live in `/whitepaper/*.md`. The `/spec` page parses these at build time — edit a markdown file, rebuild, and the spec index updates automatically.

**Updates / journal.** No CMS. The `/updates` page fetches the last 20 commits from this repository's `main` branch at build time and renders them as journal entries. Write a useful commit message; it shows up.

**Site copy.** Each page is a single `.astro` file. Page-specific data (seven properties, four tiers, etc.) lives in `src/data/chain.ts`.

---

## Phase preview

The chain is pre-launch. The floating bottom-right "Preview phase" panel lets reviewers visualise how the hub looks at each operational state — testnet (early/mature), mainnet, halted. Selection persists in `localStorage`. It is purely visual: no real chain is running.

---

## Deployment

Vercel — `astro build` produces a static `dist/` directory. Security headers (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) live in `vercel.json`. CSP is intentionally omitted; an earlier attempt broke an embedded prototype.

---

## License

Apache 2.0. The whitepaper, the website source, and the eventual reference implementation are all released under the same licence.
