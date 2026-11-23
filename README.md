# Aurora

**A design system whose sky follows your clock.** Aurora is a calm, dark system for high-trust products. In 1.0 "Daylight", the soft aurora behind every screen moves with the reader's local time, and the same four moods ship as design tokens in code and as variable modes in Figma.

This repository holds the design system and the concept that started it.

| | |
|---|---|
| **Docs site** | [izaias.xyz/aurora/design](https://izaias.xyz/aurora/design) |
| **Figma Community** | [Aurora Design System 1.0](https://www.figma.com/community/file/1706693572283633614), free to duplicate |
| **Code** | [`design-system/`](design-system/): tokens, React components and the docs site |
| **Concept** | [izaias.xyz/aurora](https://izaias.xyz/aurora), and [`index.html`](index.html) here |
| **Launch post** | [LinkedIn](https://www.linkedin.com/feed/update/urn:li:activity:7530637292387090432/) |
| **License** | [MIT](LICENSE) |

The docs site, the Figma file and this repository all link to each other, so you can start from any of them. The design system's own README in [`design-system/`](design-system/) covers how to run it and how the pieces fit. The rest of this page is about the concept.

Designed by Izaias Cavalcanti, currently open to new work. Say hello on [LinkedIn](https://www.linkedin.com/in/izaias/).

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

## License

[MIT](LICENSE). Use the code, the tokens and the components in your own work, commercial or not. Keep the copyright notice.
