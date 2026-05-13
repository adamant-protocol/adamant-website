import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true });

// 1) Operator at desktop (rewards twin-cell, role-tabs)
const ctx1 = await browser.newContext({ viewport: { width: 1600, height: 900 } });
const p1 = await ctx1.newPage();
await p1.goto('http://127.0.0.1:14321/operator', { waitUntil: 'networkidle' });
await p1.waitForTimeout(1500);
await p1.evaluate(() => window.scrollTo(0, 300));
await p1.waitForTimeout(500);
await p1.screenshot({ path: '/tmp/snaps/op-desktop.png', fullPage: false });
await ctx1.close();

// 2) AprDemo on a page that uses it (developers/...)
const ctx2 = await browser.newContext({ viewport: { width: 1400, height: 900 } });
const p2 = await ctx2.newPage();
// AprDemo lives in /developers/economics or /tokenomics
const tryUrls = ['/tokenomics', '/developers/economics', '/network', '/developers'];
for (const u of tryUrls) {
  try { await p2.goto('http://127.0.0.1:14321' + u, { waitUntil: 'networkidle', timeout: 15000 }); } catch (e) {}
  await p2.waitForTimeout(1000);
  const hasApr = await p2.evaluate(() => !!document.querySelector('.apr-demo, .apr-field, [class*="apr"]'));
  if (hasApr) {
    const aprY = await p2.evaluate(() => {
      const el = document.querySelector('.apr-demo, .apr-field, [class*="apr"]');
      return el ? el.getBoundingClientRect().top + window.scrollY - 50 : 0;
    });
    await p2.evaluate(y => window.scrollTo(0, y), aprY);
    await p2.waitForTimeout(300);
    await p2.screenshot({ path: `/tmp/snaps/apr-${u.replace(/\//g, '_')}.png`, clip: { x: 0, y: 0, width: 1400, height: 900 } });
    console.log('apr found on', u);
    break;
  }
}
await ctx2.close();

await browser.close();
