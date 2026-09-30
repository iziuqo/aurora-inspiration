# Aurora — Inspiration

A design concept for Aurora's in-app inspiration surface, plus the written rationale
behind it, on a single self-contained page.

**Live:** [izaias.xyz/aurora](https://izaias.xyz/aurora)

**Design system:** the concept, extracted into tokens, components, documentation and a Figma library, lives in [`design-system/`](design-system/).

## The idea

The brief asks for an "inspiration page". Aurora's own writing argues against feeds —
*"prompting is for losers"*, a product that should pull you toward real experiences
"rather than keeping you stuck comparing options on a screen". So this isn't a page of
things you might want. It's your day, with the open space made valuable.

Committed time is printed grey and held together by hairline rules. Where the day opens,
the rule breaks and light fills the break — and Aurora writes into it. The gaps are
finite, so the surface cannot become infinite.

## Interactions worth trying

- **Open a suggestion** to see the reasoning trace: why this, why now, why you.
- **Hold to confirm** rather than tap. The light charges while you hold; let go early and
  nothing is spent. Hold it through and the block morphs — its height glides while the
  reasoning dissolves into the work Aurora is doing, struck as points down the beam.
- **Push a card left** to leave the hour open.
- **A quiet day** — some days there's nothing worth moving, and that's a first-class screen.

## Stack

One static `index.html`. No build step, no dependencies, no external assets — every style,
script and asset is inline. Vercel Web Analytics is loaded via `/_vercel/insights/script.js`.

## Running it

Open `index.html` in a browser, or serve the directory:

```bash
python3 -m http.server 4488
```
