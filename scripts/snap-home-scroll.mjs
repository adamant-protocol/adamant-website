import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 375, height: 740 }, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
await page.goto('http://127.0.0.1:14321/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
const total = await page.evaluate(() => document.documentElement.scrollHeight);
console.log('total height:', total);
let y = 0; let i = 1;
while (y < total) {
  await page.evaluate(v => window.scrollTo(0, v), y);
  await page.waitForTimeout(200);
  await page.screenshot({ path: `/tmp/snaps/home-mob-${String(i).padStart(2,'0')}.png`, clip: { x: 0, y: 0, width: 375, height: 740 } });
  y += 660;
  i++;
  if (i > 28) break;
}
await browser.close();
