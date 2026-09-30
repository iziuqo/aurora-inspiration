// Open Graph images: one 1200×630 card per docs page, plus one for the concept page.
// Each card is drawn inside the running docs site, so it uses the real tokens and fonts.
// Usage: npm run dev (or astro preview), then BASE=http://localhost:4321/aurora/design node scripts/build-og.mjs
// Output goes to public/og/<route>.png and is committed; Base.astro points og:image at it.
import { chromium } from 'playwright';
import { mkdirSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';

const base = process.env.BASE ?? 'http://localhost:4321/aurora/design';
const out = 'public/og';

const pages = [];
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (f.endsWith('.astro')) pages.push('/' + relative('src/pages', p).replace(/\.astro$/, '').replace(/(^|\/)index$/, ''));
  }
})('src/pages');

// The concept page lives outside Astro, at the repository root.
const concept = {
  file: 'concept',
  eyebrow: 'Inspiration · Concept',
  title: 'Inspiration isn’t a place you browse. It’s where Aurora <em>shows its work.</em>',
  lead: 'A design concept for Aurora’s inspiration surface: your day as a timeline, with the open time made valuable.',
  url: 'izaias.xyz/aurora',
  tag: 'Concept · Izaias',
  long: true,
};

const css = `
  html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; background: var(--au-bg-ground); }
  .og { position: relative; box-sizing: border-box; width: 1200px; height: 630px; padding: 76px 80px 72px; display: flex; flex-direction: column;
        color: var(--au-text-primary); font-family: var(--au-font-sans);
        background-image: radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--au-text-primary) 9%, transparent) 1px, transparent 0);
        background-size: 24px 24px; background-position: 12px 12px; }
  .og__top { display: flex; align-items: center; gap: 22px; }
  .og__mark { font-size: 15px; letter-spacing: 0.42em; font-weight: 600; margin-right: -0.42em; }
  .og__sep { width: 1px; height: 28px; background: var(--au-border-strong); }
  .og__eyebrow { font-size: 11.5px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--au-text-tertiary); font-weight: 600; }
  .og__body { margin-top: auto; }
  .og__title { font-family: var(--au-font-serif); font-weight: 400; margin: 0; font-size: 116px; line-height: 1.02; letter-spacing: -0.028em; max-width: 15ch; }
  .og__title[data-long] { font-size: 64px; line-height: 1.1; letter-spacing: -0.02em; max-width: 22ch; }
  .og__title em { font-style: italic; color: var(--au-text-secondary); }
  .og__lead { margin: 26px 0 0; max-width: 60ch; font-size: 21px; line-height: 1.5; color: var(--au-text-secondary);
              display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .og__rule { position: relative; height: 1px; margin-top: 52px; background: var(--au-border-hairline); }
  .og__rule::after { content: ''; position: absolute; top: 0; height: 1px; left: 32%; width: 26%;
                     background: linear-gradient(90deg, var(--au-light-lo), var(--au-light-hi)); }
  .og__rule::before { content: ''; position: absolute; left: 30%; bottom: 0; width: 30%; height: 44px;
                      background: radial-gradient(50% 100% at 50% 100%, color-mix(in srgb, var(--au-light-lo) 12%, transparent), transparent); }
  .og__foot { display: flex; justify-content: space-between; margin-top: 22px; font-size: 11.5px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--au-text-tertiary); font-weight: 600; }
`;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const browser = await chromium.launch({ executablePath: process.env.CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });

async function draw(card) {
  await page.evaluate(({ card, css }) => {
    document.querySelectorAll('script').forEach((s) => s.remove());
    const style = document.createElement('style');
    style.textContent = css;
    document.head.append(style);
    document.body.className = '';
    document.body.innerHTML = `
      <div class="og">
        <div class="og__top"><span class="og__mark">AURORA</span><i class="og__sep"></i><span class="og__eyebrow">${card.eyebrow}</span></div>
        <div class="og__body">
          <h1 class="og__title"${card.long ? ' data-long' : ''}>${card.title}</h1>
          ${card.lead ? `<p class="og__lead">${card.lead}</p>` : ''}
        </div>
        <div class="og__rule"></div>
        <div class="og__foot"><span>${card.url}</span><span>${card.tag ?? 'Design system · Figma · React'}</span></div>
      </div>`;
  }, { card, css });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
  const file = join(out, card.file + '.png');
  mkdirSync(dirname(file), { recursive: true });
  await page.screenshot({ path: file });
  console.log(file);
}

for (const route of pages) {
  if (route === '/') continue; // the home page keeps the hand-set public/og.png
  await page.goto(base + route, { waitUntil: 'networkidle' });
  const meta = await page.evaluate(() => ({
    eyebrow: document.querySelector('.d-head__eyebrow')?.textContent?.trim() ?? '',
    title: document.querySelector('h1')?.textContent?.trim() ?? document.title,
    lead: document.querySelector('.d-head__lead')?.textContent?.trim() ?? '',
  }));
  await draw({
    file: route.slice(1),
    eyebrow: esc(['Design system', meta.eyebrow].filter(Boolean).join(' · ')),
    title: esc(meta.title),
    lead: esc(meta.lead),
    url: 'izaias.xyz/aurora/design' + route,
    long: meta.title.length > 18,
  });
}

await page.goto(base + '/principles', { waitUntil: 'networkidle' });
await draw(concept);

await browser.close();
