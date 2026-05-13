import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto('http://127.0.0.1:14321/', { waitUntil: 'networkidle', timeout: 20000 });
await page.waitForTimeout(2500);
const h = await page.evaluate(() => document.documentElement.scrollHeight);
let y = 0, i = 1;
while (y < h && i < 14) {
  await page.evaluate(v => window.scrollTo(0, v), y);
  await page.waitForTimeout(150);
  await page.screenshot({ path: `/tmp/snaps/home-desktop-${String(i).padStart(2,'0')}.png`, clip: { x:0, y:0, width:1280, height:800 } });
  y += 740;
  i++;
}
await browser.close();
