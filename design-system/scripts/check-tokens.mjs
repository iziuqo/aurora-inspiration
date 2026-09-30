// Guards the rules the system makes promises about.
// 1. Every text colour meant for reading passes WCAG AA (4.5:1) on every surface.
// 2. No component stylesheet uses a raw hex colour instead of a token.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { tokenList } = await import(join(root, 'src/lib/tokens.ts')).catch(() => ({ tokenList: null }));
const list = tokenList ?? JSON.parse(
  readFileSync(join(root, 'src/lib/tokens.ts'), 'utf8').split('export const tokenList = ')[1].replace(/ as const;\s*$/, '')
);
const value = (p) => list.find((t) => t.path === p).value;

const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

let failed = 0;
const readable = ['primary', 'secondary', 'tertiary', 'label', 'critical'].map((n) => `color.text.${n}`);
const surfaces = ['ground', 'raised', 'raised-hover', 'sunken'].map((n) => `color.bg.${n}`);
for (const t of readable) for (const s of surfaces) {
  const r = ratio(value(t), value(s));
  if (r < 4.5) { failed++; console.error(`✗ ${t} on ${s}: ${r.toFixed(2)}:1`); }
}

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
for (const f of walk(join(root, 'src/components/aurora')).filter((f) => extname(f) === '.css')) {
  readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
    if (/#[0-9a-fA-F]{3,8}\b/.test(line) && !line.includes('token-exempt')) {
      failed++; console.error(`✗ raw colour in ${f.replace(root + '/', '')}:${i + 1}`);
    }
  });
}

if (failed) { console.error(`\n${failed} token rule(s) broken`); process.exit(1); }
console.log('✓ contrast AA on all surfaces · ✓ no raw colours in components');
