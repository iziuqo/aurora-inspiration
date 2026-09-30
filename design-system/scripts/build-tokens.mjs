// Builds every token output from the DTCG source in /tokens.
// One source, three consumers: CSS for the browser, TypeScript for code, JSON for Figma.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => JSON.parse(readFileSync(join(root, 'tokens', f), 'utf8'));
const primitives = read('primitives.json');
const semantic = read('semantic.json');

// ---- flatten -------------------------------------------------------------
function flatten(tree, layer, path = [], inheritedType, out = []) {
  for (const [key, node] of Object.entries(tree)) {
    if (key.startsWith('$')) continue;
    const type = node.$type ?? inheritedType;
    if (node && typeof node === 'object' && '$value' in node) {
      out.push({ path: [...path, key], type, value: node.$value, description: node.$description, layer });
    } else if (node && typeof node === 'object') {
      flatten(node, layer, [...path, key], type, out);
    }
  }
  return out;
}
const tokens = [...flatten(primitives, 'primitive'), ...flatten(semantic, 'semantic')];
const byPath = new Map(tokens.map((t) => [t.path.join('.'), t]));

// ---- resolve references --------------------------------------------------
const REF = /^\{([^}]+)\}$/;
function resolve(value) {
  if (typeof value === 'string') {
    const m = value.match(REF);
    if (!m) return value;
    const target = byPath.get(m[1]);
    if (!target) throw new Error(`Unresolved reference ${value}`);
    return resolve(target.value);
  }
  if (Array.isArray(value)) return value.map(resolve);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolve(v)]));
  }
  return value;
}
const aliasOf = (value) => (typeof value === 'string' && REF.test(value) ? value.match(REF)[1] : null);
for (const t of tokens) {
  t.resolved = resolve(t.value);
  t.alias = aliasOf(t.value);
}

// ---- naming --------------------------------------------------------------
// color.bg.ground -> bg-ground, color.night.950 -> night-950, space.0.5 -> space-0_5
function cssName(path) {
  const p = [...path];
  if (p[0] === 'color') p.shift();
  if (p[0] === 'font' && p[1] === 'family') p.splice(0, 2, 'font');
  if (p[0] === 'font' && p[1] === 'weight') p.splice(0, 2, 'weight');
  if (p[0] === 'easing') p[0] = 'ease';
  if (p[0] === 'duration') p[0] = 'dur';
  return '--au-' + p.join('-').replace(/\./g, '_');
}
const fontStack = (arr) => arr.map((f) => (/\s/.test(f) && !/^(serif|sans-serif|monospace|system-ui|ui-monospace)$/.test(f) ? `'${f}'` : f)).join(', ');
const bezier = (a) => `cubic-bezier(${a.join(', ')})`;

function cssValue(t) {
  const v = t.resolved;
  switch (t.type) {
    case 'fontFamily': return fontStack(v);
    case 'cubicBezier': return bezier(v);
    case 'transition': return `${v.duration} ${bezier(v.timingFunction)}`;
    default: return String(v);
  }
}
function cssRef(t) {
  // Semantic tokens point at primitives by var(), so overriding a primitive cascades.
  if (t.alias) return `var(${cssName(t.alias.split('.'))})`;
  return cssValue(t);
}

// ---- guard: two tokens must never share a CSS name ------------------------
const seen = new Map();
for (const t of tokens) {
  if (t.type === 'typography') continue;
  const n = cssName(t.path);
  if (seen.has(n)) throw new Error(`${t.path.join('.')} and ${seen.get(n)} both compile to ${n}`);
  seen.set(n, t.path.join('.'));
}

// ---- CSS -----------------------------------------------------------------
const lines = [];
const typeClasses = [];
const section = (title) => lines.push('', `  /* ${title} */`);
let lastGroup = '';
for (const t of tokens) {
  if (t.type === 'typography') {
    const n = t.path.at(-1);
    const v = t.resolved;
    const base = `--au-type-${n}`;
    section(`type · ${n}`);
    lines.push(`  ${base}-family: ${fontStack(v.fontFamily)};`);
    lines.push(`  ${base}-weight: ${v.fontWeight};`);
    lines.push(`  ${base}-size: ${v.fontSize};`);
    lines.push(`  ${base}-leading: ${v.lineHeight};`);
    lines.push(`  ${base}-tracking: ${v.letterSpacing};`);
    typeClasses.push(
      `.au-type-${n} {\n  font-family: var(${base}-family);\n  font-weight: var(${base}-weight);\n  font-size: var(${base}-size);\n  line-height: var(${base}-leading);\n  letter-spacing: var(${base}-tracking);${n === 'label' ? '\n  text-transform: uppercase;' : ''}${n === 'figure' ? '\n  font-variant-numeric: tabular-nums lining-nums;' : ''}\n}`
    );
    continue;
  }
  const group = `${t.layer} · ${t.path.slice(0, t.path[0] === 'color' ? 2 : 1).join('.')}`;
  if (group !== lastGroup) { section(group); lastGroup = group; }
  const desc = t.description ? `  /* ${t.description.replace(/\*\//g, '')} */` : '';
  lines.push(`  ${cssName(t.path)}: ${cssRef(t)};${desc}`);
}
lines.push('', '  /* the aurora, as one gradient */', '  --au-light: linear-gradient(90deg, var(--au-light-lo), var(--au-light-hi));');

const header = '/* Generated by scripts/build-tokens.mjs from tokens/*.json. Do not edit by hand. */';
const css = `${header}\n:root {${lines.join('\n')}\n}\n\n${typeClasses.join('\n\n')}\n`;

// ---- TypeScript ----------------------------------------------------------
const tree = {};
for (const t of tokens) {
  let node = tree;
  const p = t.path;
  for (const k of p.slice(0, -1)) node = node[k] ??= {};
  node[p.at(-1)] = t.type === 'typography' ? t.resolved : { value: cssValue(t), cssVar: cssName(t.path) };
}
const ts = `${header.replace('/*', '//').replace(' */', '')}\nexport const tokens = ${JSON.stringify(tree, null, 2)} as const;\n\nexport type Tokens = typeof tokens;\n\n/** Every token as a flat list, for docs tables. */\nexport const tokenList = ${JSON.stringify(
  tokens.map((t) => ({
    path: t.path.join('.'),
    layer: t.layer,
    type: t.type,
    cssVar: t.type === 'typography' ? `.au-type-${t.path.at(-1)}` : cssName(t.path),
    value: t.type === 'typography' ? t.resolved : cssValue(t),
    alias: t.alias,
    description: t.description ?? null,
  })),
  null,
  2
)} as const;\n`;

// ---- Figma variables -----------------------------------------------------
// Shape consumed by the Figma build in M7: two collections, semantic values alias primitives.
const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255, a: 1 };
};
const figmaVar = (t) => {
  const name = t.path.filter((p) => p !== 'color' || t.path[0] !== 'color').join('/');
  if (t.type === 'color') return { name, type: 'COLOR', value: hexToRgb(t.resolved), alias: t.alias ? t.alias.split('.').slice(1).join('/') : null, description: t.description ?? '' };
  if (t.type === 'dimension') return { name, type: 'FLOAT', value: parseFloat(t.resolved), alias: null, description: t.description ?? '', scopes: t.path[0] === 'radius' ? ['CORNER_RADIUS'] : t.path[0] === 'space' ? ['GAP', 'WIDTH_HEIGHT'] : ['STROKE_FLOAT'] };
  if (t.type === 'duration') return { name, type: 'FLOAT', value: parseFloat(t.resolved), alias: null, description: t.description ?? '' };
  if (t.type === 'fontWeight') return { name, type: 'FLOAT', value: t.resolved, alias: null, description: '', scopes: ['FONT_WEIGHT'] };
  return null;
};
const figma = {
  collections: [
    { name: 'Primitives', variables: tokens.filter((t) => t.layer === 'primitive').map(figmaVar).filter(Boolean) },
    { name: 'Semantic', variables: tokens.filter((t) => t.layer === 'semantic').map(figmaVar).filter(Boolean) },
  ],
  textStyles: tokens.filter((t) => t.type === 'typography').map((t) => ({ name: t.path.at(-1), ...t.resolved, fontFamily: t.resolved.fontFamily[1] })),
};

// ---- resolved DTCG for download -----------------------------------------
const resolvedTree = {};
for (const t of tokens) {
  let node = resolvedTree;
  for (const k of t.path.slice(0, -1)) node = node[k] ??= {};
  node[t.path.at(-1)] = { $type: t.type, $value: t.resolved, ...(t.description ? { $description: t.description } : {}) };
}

// ---- write ---------------------------------------------------------------
const write = (rel, content) => {
  const f = join(root, rel);
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, content);
};
write('src/styles/tokens.css', css);
write('public/tokens/aurora.css', css);
write('src/lib/tokens.ts', ts);
write('public/tokens/aurora.tokens.json', JSON.stringify(resolvedTree, null, 2) + '\n');
write('public/tokens/figma-variables.json', JSON.stringify(figma, null, 2) + '\n');
write('src/lib/figma-variables.json', JSON.stringify(figma, null, 2) + '\n');
console.log(`tokens: ${tokens.length} built → css, ts, figma`);
