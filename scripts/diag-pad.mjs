import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 375, height: 740 }, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
await page.goto('http://127.0.0.1:14321/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
const r = await page.evaluate(() => {
  const section = document.querySelector('#properties');
  const wrap = document.querySelector('.wrap');
  if (!section) return { no: 'no #properties' };
  const cs = getComputedStyle(section);
  return {
    sec: {
      cls: section.className,
      paddingLeft: cs.paddingLeft,
      paddingRight: cs.paddingRight,
      paddingTop: cs.paddingTop,
      paddingBottom: cs.paddingBottom,
      maxWidth: cs.maxWidth,
      width: cs.width,
    },
    pad: getComputedStyle(document.documentElement).getPropertyValue('--pad'),
  };
});
console.log(JSON.stringify(r, null, 2));
await browser.close();
