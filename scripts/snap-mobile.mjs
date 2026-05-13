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
  { slug: 'developers', path: '/developers' },
  { slug: 'tokenomics', path: '/tokenomics' },
  { slug: 'security', path: '/security' },
  { slug: 'updates', path: '/updates' },
  { slug: 'roadmap', path: '/roadmap' },
  { slug: 'start', path: '/start' },
  { slug: 'faq', path: '/faq' },
];

const OUT = process.argv[2] || '/tmp/snaps/mobile';
mkdirSync(OUT, { recursive: true });

const WIDTHS = [320, 375, 414, 768];

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  headless: true,
});

const findings = [];
for (const W of WIDTHS) {
  const ctx = await browser.newContext({
    viewport: { width: W, height: 740 },
    deviceScaleFactor: 1,
    isMobile: W < 700,
    hasTouch: W < 700,
  });
  const page = await ctx.newPage();
  for (const P of PAGES) {
    try {
      await page.goto(BASE + P.path, { waitUntil: 'networkidle', timeout: 15000 });
    } catch (e) {}
    await page.waitForTimeout(400);
    const overflow = await page.evaluate(() => {
      const docW = document.documentElement.clientWidth;
      const scrollW = document.documentElement.scrollWidth;
      const offenders = [];
      const all = document.querySelectorAll('body *');
      for (const el of all) {
        let p = el;
        let fixed = false;
        while (p && p !== document.body) {
          const cs = getComputedStyle(p);
          if (cs.position === 'fixed') { fixed = true; break; }
          p = p.parentElement;
        }
        if (fixed) continue;
        const r = el.getBoundingClientRect();
        if (r.right > docW + 1) {
          const cs = getComputedStyle(el);
          if (cs.visibility === 'hidden' || cs.display === 'none') continue;
          offenders.push({ tag: el.tagName, cls: ((el.className && el.className.baseVal) || el.className || '').toString().slice(0, 80), id: el.id, right: Math.round(r.right), width: Math.round(r.width), x: Math.round(r.x) });
        }
        if (offenders.length >= 14) break;
      }
      return { docW, scrollW, offenders };
    });
    findings.push({ page: P.slug, width: W, docW: overflow.docW, scrollW: overflow.scrollW, overflowX: overflow.scrollW - overflow.docW, offenders: overflow.offenders });
    await page.screenshot({ path: `${OUT}/${P.slug}-w${W}.png`, fullPage: true });
  }
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(findings, null, 2));
