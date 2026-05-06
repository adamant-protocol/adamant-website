# Adamant — Website

The website for the Adamant protocol — [adamantprotocol.com](https://adamantprotocol.com).

Built with [Astro](https://astro.build) + [Tailwind CSS](https://tailwindcss.com) + MDX. Deployed to Vercel. Apache 2.0.

---

## Quick start

```bash
npm install
npm run dev
```

The site will be at `http://localhost:4321`. Edits hot-reload.

To preview a production build locally:

```bash
npm run build
npm run preview
```

---

## Project structure

```
src/
├── components/        Astro components (Mark, Header, Footer, Starfield)
├── content/
│   ├── config.ts      Content collection schema
│   └── updates/       Blog posts as .md or .mdx files
├── layouts/
│   └── BaseLayout.astro
├── pages/
│   ├── index.astro    Home
│   ├── about.astro    Plain-English explainer
│   ├── genesis.astro  Genesis mechanism
│   ├── spec.astro     Whitepaper
│   ├── rss.xml.js     RSS feed endpoint
│   └── updates/
│       ├── index.astro       List of posts
│       └── [...slug].astro   Individual post
└── styles/
    └── global.css     Design system + atmospheric background
public/
├── adamant-mark.svg   Full logo
├── favicon.svg        Tab icon
└── og-image.png       Social preview card (1200×630)
```

---

## Writing an update post

1. Create a new file in `src/content/updates/` named like `2026-05-12-something.md`.
2. Add frontmatter:
   ```md
   ---
   title: "Your post title"
   date: 2026-05-12
   description: "One-sentence summary that shows on the list page and in RSS."
   draft: false   # set true to hide
   ---

   Your content here. Markdown or MDX.
   ```
3. Commit and push. Vercel rebuilds and deploys automatically.

That's it. No CMS. The list page auto-updates. The RSS feed auto-updates. Drafts are hidden until `draft: false` (or omitted).

---

## Design system

Tokens are in `tailwind.config.mjs`. Use them via Tailwind classes (`text-ember`, `bg-bg-2`, `border-rule`, etc.) or via the CSS custom utilities in `src/styles/global.css` (`.disp`, `.mono`, `.label`, `.eyebrow`, `.btn-link`, `.section-head`).

| Token        | Value          | Use                              |
|--------------|----------------|----------------------------------|
| `bg`         | `#000000`      | Page background                  |
| `bg-2`       | `#07080e`      | Cards, sections                  |
| `bg-3`       | `#0c0e16`      | Highlighted cards                |
| `ink`        | `#ece8df`      | Main text                        |
| `ink-2`      | `#a8aab5`      | Secondary text                   |
| `ink-3`      | `#5a5d6b`      | Tertiary text, labels            |
| `ink-4`      | `#2e3140`      | Borders, dividers                |
| `ember`      | `#ff7d4d`      | Primary accent                   |
| `cold`       | `#7da6ff`      | Secondary accent                 |
| `rule`       | `rgba(236,232,223,0.06)` | Subtle borders         |
| `rule-2`     | `rgba(236,232,223,0.12)` | Standard borders       |

Fonts are loaded from Google Fonts: **Unbounded** (display), **Geist** (sans), **JetBrains Mono** (mono).

---

## Deployment (Vercel)

1. Push this repo to GitHub.
2. Connect the repo at [vercel.com/new](https://vercel.com/new).
3. Vercel auto-detects Astro. No config needed.
4. Set the custom domain `adamantprotocol.com` under Project Settings → Domains.
5. Update DNS at your registrar:
   - `A` record `@` → `76.76.21.21`
   - `CNAME` `www` → `cname.vercel-dns.com`

That's the whole deployment.

---

## Editing the site

- **Header / Footer** — `src/components/Header.astro`, `src/components/Footer.astro`
- **Logo** — `src/components/Mark.astro` (used everywhere). The standalone files in `public/` are for browser tab + social cards.
- **Pages** — files in `src/pages/`
- **Global styles + atmospheric background** — `src/styles/global.css`

---

## Principles

- No CMS. Content is in the repo. Posts are commits.
- No tracking. No analytics. No third-party scripts beyond Google Fonts.
- No team page. By design.
- Everything Apache 2.0.
