import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true });

const pages = [
  { slug: 'home', path: '/' },
  { slug: 'about', path: '/about' },
  { slug: 'genesis', path: '/genesis' },
  { slug: 'updates', path: '/updates' },
  { slug: 'wallet', path: '/wallet' },
];

const widths = [375, 414];

for (const W of widths) {
  const ctx = await browser.newContext({ viewport: { width: W, height: 740 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  for (const P of pages) {
    const errs = [];
    page.on('pageerror', e => errs.push('PAGE: ' + e.message));
    page.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text()); });
    try {
      await page.goto('http://127.0.0.1:14321' + P.path, { waitUntil: 'networkidle', timeout: 20000 });
    } catch (e) { errs.push('GOTO: ' + e.message); }
    await page.waitForTimeout(W < 400 ? 1500 : 2000);
    const info = await page.evaluate(() => {
      const body = document.body;
      const main = document.querySelector('main');
      const status = document.querySelector('.status-strip');
      const intro = document.querySelector('.page-intro');
      return {
        bodyChildren: document.body.children.length,
        bodyBg: getComputedStyle(body).backgroundColor,
        bodyColor: getComputedStyle(body).color,
        mainExists: !!main,
        mainBg: main ? getComputedStyle(main).backgroundColor : null,
        statusExists: !!status,
        statusBg: status ? getComputedStyle(status).backgroundColor : null,
        introExists: !!intro,
        introTop: intro ? intro.getBoundingClientRect().top : null,
        firstTextNode: (() => {
          const t = document.querySelector('h1, h2, .title, p');
          if (!t) return null;
          const r = t.getBoundingClientRect();
          return { tag: t.tagName, text: t.textContent.trim().slice(0, 50), x: r.x, y: r.y, w: r.width, color: getComputedStyle(t).color };
        })(),
        scrollHeight: document.documentElement.scrollHeight,
        clientHeight: document.documentElement.clientHeight,
      };
    });
    console.log(`${P.slug} w${W}:`, JSON.stringify(info, null, 2));
    console.log(`  errors:`, errs);
    await page.screenshot({ path: `/tmp/snaps/mob-${P.slug}-w${W}.png`, clip: { x: 0, y: 0, width: W, height: 740 } });
  }
  await ctx.close();
}
await browser.close();
