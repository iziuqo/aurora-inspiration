// Visual QA: screenshots of pages at several widths. Usage: node scripts/shoot.mjs /path [/path...] [--w=1440,390] [--full]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const args = process.argv.slice(2);
const paths = args.filter((a) => a.startsWith('/'));
const widths = (args.find((a) => a.startsWith('--w='))?.slice(4) ?? '1440').split(',').map(Number);
const full = args.includes('--full');
const sel = args.find((a) => a.startsWith('--sel='))?.slice(6);
const base = process.env.BASE ?? 'http://localhost:4321';
mkdirSync('shots', { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
for (const w of widths) {
  const page = await browser.newPage({ viewport: { width: w, height: w < 600 ? 844 : 900 }, deviceScaleFactor: 1 });
  page.on('console', (m) => { if (m.type() === 'error') console.log('console error', m.text()); });
  page.on('pageerror', (e) => console.log('page error', e.message));
  for (const p of paths) {
    await page.goto(base + p, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2200);
    const name = `shots/${(p === '/' ? 'home' : p.slice(1).replace(/\//g, '_'))}-${w}.png`;
    if (sel) await page.locator(sel).first().screenshot({ path: name });
    else await page.screenshot({ path: name, fullPage: full });
    console.log(name);
  }
  await page.close();
}
await browser.close();
