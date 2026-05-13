import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = 'http://127.0.0.1:14321';
const PAGES = [
  { slug: 'home', path: '/' },
  { slug: 'about', path: '/about' },
  { slug: 'genesis', path: '/genesis' },
  { slug: 'network', path: '/network' },
  { slug: 'operator', path: '/operator' },
  { slug: 'wallet', path: '/wallet' },
  { slug: 'spec', path: '/spec' },
  { slug: 'tokenomics', path: '/tokenomics' },
  { slug: 'security', path: '/security' },
  { slug: 'updates', path: '/updates' },
];

const OUT = process.argv[2] || '/tmp/snaps/sections';
mkdirSync(OUT, { recursive: true });

const W = Number(process.argv[3] || 375);
const H = Number(process.argv[4] || 740);

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, isMobile: W < 700, hasTouch: W < 700 });
const page = await ctx.newPage();

for (const P of PAGES) {
  try {
    await page.goto(BASE + P.path, { waitUntil: 'networkidle', timeout: 20000 });
  } catch (e) {}
  await page.waitForTimeout(800);
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  let y = 0;
  let i = 1;
  while (y < total) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(150);
    await page.screenshot({ path: `${OUT}/${P.slug}-w${W}-p${String(i).padStart(2,'0')}.png`, clip: { x: 0, y: 0, width: W, height: H } });
    y += H - 80;
    i++;
    if (i > 22) break;
  }
}

await ctx.close();
await browser.close();
