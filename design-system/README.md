# Aurora Design System

A design system for calm, high-trust products. Aurora uses a black ground, draws its structure in hairlines, and uses light only where something deserves attention.

This design system was extracted from the [Aurora inspiration concept](https://izaias.xyz/aurora) at the root of this repository, which was designed by Izaias Cavalcanti.

| | |
|---|---|
| **Docs site** | [izaias.xyz/aurora/design](https://izaias.xyz/aurora/design) |
| **Figma library** | [Aurora Design System](https://www.figma.com/design/8yACQWbJrGKKR9o2Igqubw/Aurora-Design-System) |
| **Tokens** | 96, in W3C DTCG format under `tokens/` |
| **Components** | 14 in React, each paired with a CSS file that uses tokens only |
| **Patterns** | Hold to confirm, morph, leave it open, the quiet day, and a full showcase |

## Principles

1. **Light is earned.** The aurora gradient appears in exactly four places: open time, focus, commitment, and the one figure that is ours.
2. **Hairlines, not shadows.** Depth comes from a change of surface, never from a blur beneath it.
3. **Two voices.** Aurora speaks in a serif. The machinery around it uses a sans.
4. **Nothing overshoots.** The system uses three decelerating curves and no springs. A box changes shape rather than being swapped for another.
5. **The reason before the thing.** Anything that proposes an action shows why first.
6. **Restraint is a feature.** An empty state is designed on purpose, and the system is allowed to show nothing.

## One source, three outputs

```
tokens/primitives.json ─┐                         ┌─ src/styles/tokens.css      the browser
tokens/semantic.json  ──┴─ scripts/build-tokens ──┼─ src/lib/tokens.ts         the components
                                                  └─ public/tokens/*.json      the Figma library
```

Semantic tokens point at primitives, and components read only semantic tokens. The Figma variables use the same paths (`text/secondary` becomes `--au-text-secondary`) and carry the CSS name as their code syntax.

## Guardrails

- `scripts/build-tokens.mjs` fails the build if two tokens compile to the same CSS name.
- `scripts/check-tokens.mjs` fails if any readable ink drops below WCAG AA (4.5:1) on any of the four surfaces, or if component CSS contains a raw hex value.
- `scripts/check-overflow.mjs` reports any page that scrolls horizontally at 390px.

## Develop

```bash
npm install
npm run dev        # build tokens, then start the docs at localhost:4321/aurora/design
npm run build      # tokens + static site in dist/
npm run check      # contrast and raw-colour checks
npx astro check    # types
```

The docs deploy with the concept page, from the same Vercel project. `vercel.json` at the repository root runs `scripts/vercel-build.sh`, which puts the concept page at `/` and the docs at `/aurora/design`, so they are served at izaias.xyz/aurora/design. Astro's `base` is `/aurora/design`, so the dev server runs at `localhost:4321/aurora/design`, and every internal link goes through `url()` in `src/lib/nav.ts`.

To build a portable preview that works from any sub-path, run `PREVIEW=1 npx astro build && node scripts/export-preview.mjs`. The output goes to `dist-preview/`.

## Structure

```
design-system/
├─ tokens/                  source of truth (DTCG JSON)
├─ scripts/                 token build, checks, preview export
├─ src/components/aurora/   the components (TSX + CSS)
├─ src/components/docs/     docs chrome: anatomy, stage, code, tables
├─ src/components/demos/    live demos and the day prototype
└─ src/pages/               foundations, components, patterns, resources
```
