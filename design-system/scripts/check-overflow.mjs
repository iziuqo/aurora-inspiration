// Reports elements that overflow a 390px viewport on every page. Run against `npm run preview`.
import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
const pages = ['/', '/principles', '/getting-started', '/foundations/color', '/foundations/typography', '/foundations/spacing', '/foundations/hairlines', '/foundations/motion', '/foundations/light', '/foundations/voice', '/foundations/accessibility', '/components/button', '/components/hold-button', '/components/segmented-control', '/components/label', '/components/rule', '/components/timeline', '/components/gap', '/components/suggestion-card', '/components/reasoning-trace', '/components/execution-steps', '/components/ask-bar', '/components/tally', '/components/quote', '/components/quiet-state', '/patterns/hold-to-confirm', '/patterns/morph', '/patterns/leave-it-open', '/patterns/quiet-day', '/patterns/showcase', '/resources/tokens', '/resources/figma', '/resources/case-study', '/resources/changelog'];
for (const u of pages) {
  await p.goto('http://localhost:4321' + u); await p.waitForTimeout(400);
  const r = await p.evaluate(() => {
    const W = document.documentElement.clientWidth;
    const out = [];
    document.querySelectorAll('body *').forEach((e) => {
      const r = e.getBoundingClientRect();
      if (r.right > W + 1 && r.width > 0) {
        let a = e.parentElement, clipped = false;
        while (a) { const o = getComputedStyle(a).overflowX; if (o !== 'visible') { clipped = true; break; } a = a.parentElement; }
        if (!clipped) out.push(e.tagName.toLowerCase() + '.' + [...e.classList].join('.') + ' ' + Math.round(r.right));
      }
    });
    return { sw: document.documentElement.scrollWidth, W, out: out.slice(0, 4) };
  });
  if (r.sw > r.W || r.out.length) console.log(u, r.sw, r.out.join(' | '));
}
await b.close();
