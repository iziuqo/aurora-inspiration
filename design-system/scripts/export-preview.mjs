// Turns the PREVIEW=1 build (flat .html files) into a portable static bundle:
// every root-absolute URL becomes relative, so the site works from any sub-path.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, dirname, posix } from 'node:path';

const out = join(dirname(new URL(import.meta.url).pathname), '..', 'dist-preview');
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const files = walk(out).map((f) => relative(out, f).split('\\').join('/'));
const pages = new Set(files.filter((f) => f.endsWith('.html')).map((f) => '/' + f.replace(/\.html$/, '').replace(/^index$/, '')));

const rel = (from, target) => {
  const [path, hash = ''] = target.split('#');
  let file = path.replace(/^\//, '');
  if (pages.has(path)) file = path === '/' ? 'index.html' : `${file}.html`;
  else if (!files.includes(file)) return null;
  let r = posix.relative(posix.dirname(from) || '.', file) || file;
  if (!r.startsWith('.')) r = './' + r;
  return r + (hash ? '#' + hash : '');
};
const fix = (from, text) =>
  text.replace(/(["'(]|&quot;)(\/(?!\/)[^"'()\s&]*?)(?=["')]|&quot;)/g, (m, q, url) => {
    const r = rel(from, url);
    return r ? q + r : m;
  });

let n = 0;
for (const f of files) {
  if (!/\.(html|css|js)$/.test(f)) continue;
  const p = join(out, f);
  let t = readFileSync(p, 'utf8');
  t = fix(f, t);
  // the root page is wrapped in a document skeleton by the host, so it ships as a fragment
  if (f === 'index.html') t = t.replace(/<!DOCTYPE html>/i, '').replace(/<\/?(html|head|body)[^>]*>/gi, '');
  writeFileSync(p, t);
  n++;
}
console.log(`preview: rewrote ${n} files, ${pages.size} pages`);
