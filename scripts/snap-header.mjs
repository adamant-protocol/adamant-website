import { chromium } from 'playwright';

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true });

// Desktop — open each dropdown and snap
const ctx1 = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page1 = await ctx1.newPage();
await page1.goto('http://127.0.0.1:14321/about', { waitUntil: 'networkidle' });
await page1.waitForTimeout(1500);
await page1.screenshot({ path: '/tmp/snaps/hdr-desktop-closed.png', clip: { x: 0, y: 0, width: 1280, height: 200 } });

// Open the Protocol dropdown
const proto = await page1.$('[data-trigger="protocol"]');
if (proto) {
  await proto.click();
  await page1.waitForTimeout(400);
  await page1.screenshot({ path: '/tmp/snaps/hdr-desktop-proto.png', clip: { x: 0, y: 0, width: 1280, height: 500 } });
}

const network = await page1.$('[data-trigger="network"]');
if (network) {
  await network.click();
  await page1.waitForTimeout(400);
  await page1.screenshot({ path: '/tmp/snaps/hdr-desktop-network.png', clip: { x: 0, y: 0, width: 1280, height: 500 } });
}
await ctx1.close();

// 980px width — tablet
const ctx2 = await browser.newContext({ viewport: { width: 980, height: 800 } });
const page2 = await ctx2.newPage();
await page2.goto('http://127.0.0.1:14321/about', { waitUntil: 'networkidle' });
await page2.waitForTimeout(1500);
await page2.screenshot({ path: '/tmp/snaps/hdr-980.png', clip: { x: 0, y: 0, width: 980, height: 200 } });
const proto2 = await page2.$('[data-trigger="protocol"]');
if (proto2) {
  await proto2.click();
  await page2.waitForTimeout(400);
  await page2.screenshot({ path: '/tmp/snaps/hdr-980-proto.png', clip: { x: 0, y: 0, width: 980, height: 500 } });
}
await ctx2.close();

// 1024 - 1080 range
const ctx3 = await browser.newContext({ viewport: { width: 1024, height: 800 } });
const page3 = await ctx3.newPage();
await page3.goto('http://127.0.0.1:14321/about', { waitUntil: 'networkidle' });
await page3.waitForTimeout(1500);
await page3.screenshot({ path: '/tmp/snaps/hdr-1024.png', clip: { x: 0, y: 0, width: 1024, height: 200 } });
const proto3 = await page3.$('[data-trigger="protocol"]');
if (proto3) {
  await proto3.click();
  await page3.waitForTimeout(400);
  await page3.screenshot({ path: '/tmp/snaps/hdr-1024-proto.png', clip: { x: 0, y: 0, width: 1024, height: 500 } });
}
await ctx3.close();

await browser.close();
console.log('done');
