// Daylight: the sky above every Aurora page follows the reader's local time.
// Four moods live in tokens/semantic.json (sky.*). This file blends them by the hour
// and paints them with one small WebGL shader: soft folds of light, no rays, no glow.
import { tokens } from './tokens';

export type MoodName = 'night' | 'dawn' | 'day' | 'dusk';
export interface Mood { hour: number; intensity: number; height: number; mint: number }

const n = (t: { value: string }) => parseFloat(t.value);
export const moods: Record<MoodName, Mood> = Object.fromEntries(
  (['night', 'dawn', 'day', 'dusk'] as const).map((k) => {
    const s = tokens.sky[k];
    return [k, { hour: n(s.hour), intensity: n(s.intensity), height: n(s.height), mint: n(s.mint) }];
  })
) as Record<MoodName, Mood>;

const order: MoodName[] = ['night', 'dawn', 'day', 'dusk'];
const smooth = (x: number) => x * x * (3 - 2 * x);

/** The sky for any hour (0–24), blended between the two nearest moods. */
export function skyAt(hour: number): Mood & { name: MoodName; blend: number } {
  const h = ((hour % 24) + 24) % 24;
  const stops = order.map((k) => ({ k, ...moods[k] }));
  stops.push({ ...stops[0], hour: 24 });
  let i = 0;
  while (i < stops.length - 1 && h >= stops[i + 1].hour) i++;
  const a = stops[i], b = stops[i + 1];
  const t = smooth((h - a.hour) / (b.hour - a.hour));
  const mix = (x: number, y: number) => x + (y - x) * t;
  return {
    hour: h,
    intensity: mix(a.intensity, b.intensity),
    height: mix(a.height, b.height),
    mint: mix(a.mint, b.mint),
    name: (t < 0.5 ? a.k : b.k) as MoodName,
    blend: t,
  };
}

export const moodLabel: Record<MoodName, string> = { night: 'night', dawn: 'first light', day: 'the open day', dusk: 'the evening' };

export function localHour(d = new Date()) { return d.getHours() + d.getMinutes() / 60; }
export function clock(hour: number) {
  const h = Math.floor(((hour % 24) + 24) % 24), m = Math.floor((hour - Math.floor(hour)) * 60);
  return `${String(h).padStart(2, '0')}.${String(m).padStart(2, '0')}`;
}

const hex = (h: string) => {
  const v = parseInt(h.replace('#', ''), 16);
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
};

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;
// Domain-warped value noise, kept to low frequencies so the light folds rather than streaks.
const FRAG = `
precision mediump float;
uniform vec2 res; uniform float time; uniform float intensity; uniform float height; uniform float mintShare;
uniform vec3 lo; uniform vec3 hi; uniform vec3 ground; uniform float seed;
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1,0)), u.x), mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++){ v += a * noise(p); p = p * 2.02 + 17.1; a *= 0.5; } return v; }
float band(vec2 uv, float y0, float w, float t, float off){
  float x = uv.x + off;
  float warp = fbm(vec2(x * 0.7 + t * 0.03, t * 0.015 + off));
  float crest = y0 + (warp - 0.5) * 0.55 + sin(x * 1.25 + t * 0.04 + off) * 0.09;
  float d = uv.y - crest;
  // brightest at the lower edge, then a long soft fall upward, like a curtain lit from below
  float tail = exp(-max(d, 0.0) / (w * 1.6)) * step(0.0, d);
  float edge = exp(-d * d / (w * w * 0.1));
  float under = exp(-min(d, 0.0) * min(d, 0.0) / (w * w * 0.2)) * (1.0 - step(0.0, d));
  float body = tail * 0.7 + edge * 0.55 + under * 0.5;
  // the light gathers in patches along its length and thins between them
  float patchy = smoothstep(0.22, 0.78, fbm(vec2(x * 0.85 - t * 0.025, off * 1.3)));
  return body * (0.18 + 0.82 * patchy);
}
void main(){
  vec2 uv = gl_FragCoord.xy / res; float aspect = res.x / res.y; uv.x *= max(aspect, 1.6) * 0.55;
  float t = time + seed * 40.0;
  float a = band(uv, height, 0.16, t, 0.0);
  float b = band(uv, height + 0.13, 0.11, t * 0.8, 5.3) * 0.5;
  float vx = gl_FragCoord.x / res.x;
  float vig = smoothstep(0.0, 0.35, vx) * smoothstep(1.0, 0.6, vx) * 0.5 + 0.5;
  float light = (a + b) * intensity * vig;
  float hue = clamp((uv.y - height) * 1.4 + (1.0 - mintShare) * 0.95 - 0.1 + (fbm(vec2(uv.x * 0.6, t * 0.01)) - 0.5) * 0.6, 0.0, 1.0);
  vec3 col = mix(lo, hi, smoothstep(0.15, 0.85, hue));
  vec3 c = ground + col * (1.0 - exp(-light * 0.75)) * 0.95;
  c += (hash(gl_FragCoord.xy + fract(t)) - 0.5) / 255.0 * 1.5; // dither so the blacks never band
  gl_FragColor = vec4(c, 1.0);
}`;

export interface SkyOptions { scale?: number; strength?: number; seed?: number; still?: boolean }

/** Paint a sky into a canvas. Returns a controller for setting the hour and tearing down. */
export function paintSky(canvas: HTMLCanvasElement, opts: SkyOptions = {}) {
  const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false, preserveDrawingBuffer: true });
  if (!gl) return null;
  const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const u = (k: string) => gl.getUniformLocation(prog, k);
  const U = { res: u('res'), time: u('time'), intensity: u('intensity'), height: u('height'), mint: u('mintShare'), lo: u('lo'), hi: u('hi'), ground: u('ground'), seed: u('seed') };
  gl.uniform3fv(U.lo, hex(tokens.color.aurora.mint.value));
  gl.uniform3fv(U.hi, hex(tokens.color.aurora.violet.value));
  gl.uniform3fv(U.ground, hex(tokens.color.night['950'].value));
  gl.uniform1f(U.seed, opts.seed ?? 0.37);

  const scale = opts.scale ?? 0.5; // painted small and upscaled: the browser's resample is the blur
  const strength = opts.strength ?? 1;
  let target = skyAt(localHour());
  let cur = { ...target };
  let raf = 0, last = performance.now(), clockT = 20 + Math.random() * 30, visible = true;
  const reduced = opts.still || matchMedia('(prefers-reduced-motion: reduce)').matches;

  const size = () => {
    const r = canvas.getBoundingClientRect();
    const w = Math.max(2, Math.round(r.width * scale)), h = Math.max(2, Math.round(r.height * scale));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
    gl.uniform2f(U.res, w, h);
  };
  const draw = () => {
    gl.uniform1f(U.time, clockT);
    gl.uniform1f(U.intensity, cur.intensity * strength);
    gl.uniform1f(U.height, cur.height);
    gl.uniform1f(U.mint, cur.mint);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!reduced) clockT += dt;
    const k = 1 - Math.exp(-dt * 2.4); // settle toward the target hour without overshoot
    cur.intensity += (target.intensity - cur.intensity) * k;
    cur.height += (target.height - cur.height) * k;
    cur.mint += (target.mint - cur.mint) * k;
    draw();
    const settled = Math.abs(target.height - cur.height) < 0.001 && Math.abs(target.intensity - cur.intensity) < 0.001;
    raf = visible && (!reduced || !settled) ? requestAnimationFrame(frame) : 0;
  };
  const start = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } };
  const ro = new ResizeObserver(() => { size(); draw(); });
  ro.observe(canvas);
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); });
  io.observe(canvas);
  size(); draw(); start();
  canvas.dataset.ready = 'true';

  return {
    setHour(h: number, instant = false) { target = skyAt(h); if (instant) cur = { ...target }; start(); },
    destroy() { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); },
  };
}
