// scripts/gen-og.mjs
//
// Boot a local preview server, screenshot the hero of every page at 1200x630,
// write the result to /public/og/{slug}.png. Run after `astro build`.
//
//   npm install -D playwright    # one-time, downloads chromium (~80MB)
//   npx playwright install chromium
//   npm run build
//   npm run gen-og

import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const PAGES = [
  { slug: 'home',     path: '/' },
  { slug: 'about',    path: '/about' },
  { slug: 'genesis',  path: '/genesis' },
  { slug: 'network',  path: '/network' },
  { slug: 'operator', path: '/operator' },
  { slug: 'wallet',   path: '/wallet' },
  { slug: 'spec',     path: '/spec' },
  { slug: 'updates',  path: '/updates' },
];

const PORT = 14321;
const HOST = `http://127.0.0.1:${PORT}`;
const OUT = join(process.cwd(), 'public', 'og');
mkdirSync(OUT, { recursive: true });

const { chromium } = await import('playwright').catch(() => {
  console.error('\nPlaywright is not installed. Run:\n  npm install -D playwright\n  npx playwright install chromium\n');
  process.exit(1);
});

console.log('Spawning astro preview on', HOST);
const server = spawn('npx', ['astro', 'preview', '--port', String(PORT), '--host', '127.0.0.1'], {
  stdio: ['ignore', 'pipe', 'inherit'],
  shell: process.platform === 'win32',
});

await new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(new Error('preview did not start in 15s')), 15000);
  server.stdout.on('data', (chunk) => {
    const s = String(chunk);
    process.stdout.write(s);
    if (/localhost|127\.0\.0\.1/i.test(s)) { clearTimeout(t); resolve(); }
  });
  server.on('exit', (code) => reject(new Error('preview exited code=' + code)));
});

// give the server a moment to fully bind
await sleep(500);

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 2,
  reducedMotion: 'reduce',
});

try {
  for (const page of PAGES) {
    const tab = await ctx.newPage();
    const url = HOST + page.path;
    console.log('→', url);
    await tab.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
    // Suppress the floating switcher and any reveal anims
    await tab.addStyleTag({ content: `
      #phase-switch, .phase-switch { display: none !important; }
      [data-reveal] { opacity: 1 !important; transform: none !important; }
    ` });
    await sleep(300);
    const out = join(OUT, page.slug + '.png');
    await tab.screenshot({ path: out, fullPage: false, clip: { x: 0, y: 0, width: 1200, height: 630 } });
    console.log('   wrote', out);
    await tab.close();
  }
} finally {
  await browser.close();
  server.kill();
}

console.log('\nDone — regenerated', PAGES.length, 'OG images.');
process.exit(0);
