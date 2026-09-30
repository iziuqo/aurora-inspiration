import { tokenList } from './tokens';

type T = (typeof tokenList)[number];
export const token = (path: string): T => {
  const t = tokenList.find((x) => x.path === path);
  if (!t) throw new Error(`No token ${path}`);
  return t;
};
export const hex = (path: string): string => {
  let t: T | undefined = token(path);
  while (t?.alias) t = tokenList.find((x) => x.path === t!.alias);
  return String(t?.value);
};
const lum = (h: string) => {
  const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
export const contrast = (a: string, b: string) => {
  const x = lum(a), y = lum(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
export const grade = (r: number) => (r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'AA large' : 'Decorative');
