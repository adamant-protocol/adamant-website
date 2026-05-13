import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 375, height: 740 }, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
await page.goto('http://127.0.0.1:14321/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
const r = await page.evaluate(() => {
  const wrap = document.querySelector('.dive-globe-wrap');
  const canvas = document.querySelector('.globe-canvas');
  const stage = document.querySelector('.dive-stage');
  return {
    stage: stage ? { ...stage.getBoundingClientRect().toJSON(), overflow: getComputedStyle(stage).overflow } : null,
    wrap: wrap ? { ...wrap.getBoundingClientRect().toJSON(), transform: getComputedStyle(wrap).transform } : null,
    canvas: canvas ? { ...canvas.getBoundingClientRect().toJSON(), attrW: canvas.width, attrH: canvas.height, cssW: getComputedStyle(canvas).width, cssH: getComputedStyle(canvas).height } : null,
  };
});
console.log(JSON.stringify(r, null, 2));
await browser.close();
