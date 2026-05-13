import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:14321/operator', { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
// scroll to rewards section
await p.evaluate(() => {
  const r = document.querySelector('[data-spec="true"]');
  // find the rewards twin-cell specifically — first 'data-spec' inside op-grid
  const opGrid = document.querySelector('.op-grid');
  const items = opGrid ? opGrid.querySelectorAll('[data-spec="true"]') : null;
  // pending-rewards = first data-spec in op-grid right col
  if (items && items.length) {
    items[0].scrollIntoView({ block: 'center' });
  }
});
await p.waitForTimeout(500);
await p.screenshot({ path: '/tmp/snaps/op-rewards.png', clip: { x: 0, y: 0, width: 1600, height: 900 } });
await browser.close();
