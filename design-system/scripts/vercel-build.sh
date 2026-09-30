#!/bin/sh
# One Vercel project, two sites:
#   /                the Aurora concept page (index.html at the repo root)
#   /aurora/design   the design system docs (Astro, base '/aurora/design')
# izaias.xyz/aurora proxies to this project, so the docs land at izaias.xyz/aurora/design.
set -e
rm -rf out
mkdir -p out/aurora
cp index.html out/index.html
npm run build --prefix design-system
cp -R design-system/dist out/aurora/design
