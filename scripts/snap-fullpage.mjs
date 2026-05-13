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

const OUT = process.argv[2] || '/tmp/snaps/full';
mkdirSync(OUT, { recursive: true });
const W = Number(process.argv[3] || 1280);
const H = Number(process.argv[4] || 900);

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: W, height: H } });
const page = await ctx.newPage();

for (const P of PAGES) {
  try {
    await page.goto(BASE + P.path, { waitUntil: 'networkidle', timeout: 25000 });
  } catch (e) {}
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/${P.slug}-w${W}.png`, fullPage: true });
}
await ctx.close();
await browser.close();
