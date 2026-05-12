// Sync the whitepaper from the canonical adamant-spec repo into
// adamant-website's working tree at build time.
//
// The website's spec page (src/pages/spec.astro) reads whitepaper
// markdown via import.meta.glob('../../whitepaper/*.md') at build
// time. The canonical source of those files is the adamant-spec
// repo at github.com/adamant-protocol/adamant-spec — the website
// does NOT carry whitepaper content in its own git history (per
// the prior "Remove whitepaper (moved to adamant-spec)" commit).
//
// This script populates the working-tree `whitepaper/` directory
// from one of two sources, preferring whichever is available:
//
//   1. A sibling clone of adamant-spec on the local filesystem
//      (../adamant-spec/whitepaper/). This is the development-time
//      fast path; no network round-trip.
//   2. A GitHub raw fetch from the adamant-spec repo's main branch.
//      Used in CI (Vercel / GitHub Actions) where the sibling clone
//      doesn't exist.
//
// The destination `whitepaper/` directory is .gitignored — its
// contents are derived from adamant-spec, never authored here.
//
// Usage: `node scripts/sync-spec.mjs`. Wired into `npm run dev`
// and `npm run build` via package.json scripts.

import { mkdir, copyFile, readdir, writeFile, access } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const destDir = join(repoRoot, 'whitepaper');
const siblingSpecDir = resolve(repoRoot, '..', 'adamant-spec', 'whitepaper');

const SPEC_REPO_RAW =
  'https://raw.githubusercontent.com/adamant-protocol/adamant-spec/main/whitepaper';

// The 14 canonical files in adamant-spec/whitepaper/.
const FILES = [
  '00-abstract.md',
  '01-introduction.md',
  '02-design-principles.md',
  '03-cryptographic-foundation.md',
  '04-identity-accounts.md',
  '05-object-model-state.md',
  '06-execution-vm.md',
  '07-privacy-layer.md',
  '08-consensus.md',
  '09-networking-mempool.md',
  '10-economics-incentives.md',
  '11-genesis-constitution.md',
  '12-conclusion.md',
  'adamant-whitepaper-complete.md',
];

async function syncFromSibling() {
  console.log(`[sync-spec] Source: sibling clone (${siblingSpecDir})`);
  await mkdir(destDir, { recursive: true });
  for (const file of FILES) {
    const src = join(siblingSpecDir, file);
    const dst = join(destDir, file);
    await copyFile(src, dst);
  }
  console.log(`[sync-spec] Copied ${FILES.length} files to ${destDir}`);
}

async function syncFromGitHub() {
  console.log(`[sync-spec] Source: GitHub raw (${SPEC_REPO_RAW})`);
  await mkdir(destDir, { recursive: true });
  for (const file of FILES) {
    const url = `${SPEC_REPO_RAW}/${file}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`[sync-spec] fetch ${url} failed: ${res.status} ${res.statusText}`);
    }
    const text = await res.text();
    await writeFile(join(destDir, file), text, 'utf8');
  }
  console.log(`[sync-spec] Fetched ${FILES.length} files to ${destDir}`);
}

async function main() {
  // Prefer sibling clone when present; fall back to GitHub raw.
  if (existsSync(siblingSpecDir)) {
    try {
      await syncFromSibling();
      return;
    } catch (err) {
      console.warn(`[sync-spec] sibling sync failed (${err.message}); falling back to GitHub raw`);
    }
  }
  await syncFromGitHub();
}

main().catch((err) => {
  console.error('[sync-spec] fatal:', err);
  process.exit(1);
});
