// Renders 3 brand-mark variants to /public/whfdev-{variant}.png
// Run with: pnpm tsx scripts/generate-logo.mjs   (tsx is already in devDeps)
//
// Variants:
//   dark    — canvas (#0A0A0B) bg, white W, coral dot, subtle coral glow
//   coral   — solid coral (#FF4D6D) bg, white W
//   light   — white bg, ink W, coral dot

import { Resvg } from '@resvg/resvg-js'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const SIZE = 1024
const RADIUS = 220 // squircle-ish rounded square

const COLORS = {
  canvas: '#0A0A0B',
  ink: '#0A0A0B',
  white: '#FFFFFF',
  coral: '#FF4D6D',
  coralSoft: '#FF80A6',
  coralOrange: '#FF8A4A',
}

/**
 * The W-mark path is the same geometry as src/assets/logo-white.svg, scaled
 * from the 32-unit viewBox up to ~70% of the canvas (centered).
 *
 * Original path in 32x32 viewBox:
 *   M7 10 L11 22 L14.5 14 L16 14 L19.5 22 L23.5 10
 * Bounding box of the path is x:7..23.5 y:10..22 (16.5 wide, 12 tall).
 * We scale uniformly so the path's width fits ~58% of the canvas, then
 * center it. The little coral dot at (25.5, 24) is rendered separately.
 */
function brandMark({ stroke, dot, dotR }) {
  // Path bbox: width 16.5, height 12. Path origin at (7, 10).
  const pathW = 16.5
  const targetW = SIZE * 0.5
  const scale = targetW / pathW
  const drawnW = pathW * scale
  const drawnH = 12 * scale
  // Translate so the visual center of the W is at canvas center.
  const tx = (SIZE - drawnW) / 2 - 7 * scale
  const ty = (SIZE - drawnH) / 2 - 10 * scale

  // Coral dot — keep the relative position from the original logo
  // (offset to bottom-right of the W).
  const dotX = tx + 25.5 * scale
  const dotY = ty + 24 * scale
  const r = dotR ?? scale * 2.6 // a touch larger relative to mark

  const strokeWidth = scale * 2.3
  return `
    <g transform="translate(${tx} ${ty}) scale(${scale})">
      <path
        d="M7 10 L11 22 L14.5 14 L16 14 L19.5 22 L23.5 10"
        fill="none"
        stroke="${stroke}"
        stroke-width="${2.3}"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
    ${dot ? `<circle cx="${dotX}" cy="${dotY}" r="${r}" fill="${dot}" />` : ''}
    <!-- strokeWidth ${strokeWidth} reserved -->
  `
}

/** Squircle-style rounded square clip + background fill */
function background(fill, glow) {
  return `
    <defs>
      ${
        glow
          ? `
        <radialGradient id="glow" cx="0.78" cy="0.18" r="0.7">
          <stop offset="0" stop-color="${COLORS.coral}" stop-opacity="0.35"/>
          <stop offset="0.6" stop-color="${COLORS.coralOrange}" stop-opacity="0.12"/>
          <stop offset="1" stop-color="${COLORS.coral}" stop-opacity="0"/>
        </radialGradient>`
          : ''
      }
      <clipPath id="rounded">
        <rect width="${SIZE}" height="${SIZE}" rx="${RADIUS}" ry="${RADIUS}" />
      </clipPath>
    </defs>
    <g clip-path="url(#rounded)">
      <rect width="${SIZE}" height="${SIZE}" fill="${fill}" />
      ${glow ? `<rect width="${SIZE}" height="${SIZE}" fill="url(#glow)" />` : ''}
    </g>
  `
}

function makeSvg(variant) {
  let bg, mark
  switch (variant) {
    case 'dark':
      bg = background(COLORS.canvas, true)
      mark = brandMark({ stroke: COLORS.white, dot: COLORS.coral })
      break
    case 'coral':
      bg = background(COLORS.coral, false)
      mark = brandMark({ stroke: COLORS.white, dot: null })
      break
    case 'light':
      bg = background(COLORS.white, false)
      mark = brandMark({ stroke: COLORS.ink, dot: COLORS.coral })
      break
    default:
      throw new Error(`unknown variant ${variant}`)
  }

  // Hairline inner border on dark variant — matches the site mark style.
  const border =
    variant === 'dark'
      ? `<rect x="6" y="6" width="${SIZE - 12}" height="${SIZE - 12}" rx="${RADIUS - 6}" ry="${RADIUS - 6}" fill="none" stroke="${COLORS.white}" stroke-opacity="0.10" stroke-width="2"/>`
      : ''

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
${bg}
${border}
${mark}
</svg>`
}

const outDir = resolve(process.cwd(), 'public')

for (const variant of ['dark', 'coral', 'light']) {
  const svg = makeSvg(variant)
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: SIZE },
    font: { loadSystemFonts: false },
  })
  const png = resvg.render().asPng()
  const filename = `whfdev-${variant}.png`
  writeFileSync(resolve(outDir, filename), png)
  process.stdout.write(`${filename}\n`)
}

process.stdout.write('done\n')
