import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true });

const widths = [1280, 1100, 1024, 980, 900, 768, 414, 375];
for (const W of widths) {
  const ctx = await browser.newContext({ viewport: { width: W, height: 800 }, deviceScaleFactor: 1, isMobile: W < 700 });
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:14321/about', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `/tmp/snaps/hdr-${W}.png`, clip: { x: 0, y: 0, width: W, height: 220 } });

  // Try opening Protocol dropdown
  const proto = await page.$('[data-trigger="protocol"]');
  if (proto) {
    try {
      // Use JS click + ensure open class
      await page.evaluate(() => {
        const item = document.querySelector('[data-trigger="protocol"]').parentElement;
        item.classList.add('open');
        const pop = item.querySelector('.cmd-pop');
        if (pop) pop.setAttribute('aria-hidden', 'false');
      });
      await page.waitForTimeout(500);
      await page.screenshot({ path: `/tmp/snaps/hdr-${W}-proto.png`, clip: { x: 0, y: 0, width: W, height: 600 } });
    } catch (e) {}
  }
  await ctx.close();
}
await browser.close();
