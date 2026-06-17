#!/usr/bin/env node
/**
 * Converts the D3 SVG brand assets into all PNGs required by Expo.
 * Run: npm run generate:icons
 *
 * Outputs (all in assets/images/):
 *   icon.png                    1024×1024  iOS / Expo default icon
 *   favicon.png                   48×48   Web favicon
 *   splash-icon.png              512×512   Splash screen centre mark
 *   android-icon-foreground.png 1024×1024  Adaptive icon foreground (mark, transparent bg)
 *   android-icon-background.png 1024×1024  Adaptive icon background (blue gradient)
 *   android-icon-monochrome.png 1024×1024  Themed icon (Android 13+, greyscale mask)
 */

import sharp from 'sharp'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const ROOT   = join(dirname(fileURLToPath(import.meta.url)), '..')
const ASSETS = join(ROOT, 'assets', 'images')

// Simple blue gradient background SVG (for Android adaptive icon bg layer)
const GRADIENT_BG_SVG = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="g" x1="0.12" y1="0" x2="0.88" y2="1">
      <stop offset="0" stop-color="#2f6bff"/>
      <stop offset="1" stop-color="#1748d8"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" fill="url(#g)"/>
</svg>`)

async function fromSvg(svgInput, outPath, size) {
  const buf = Buffer.isBuffer(svgInput) ? svgInput : readFileSync(svgInput)
  await sharp(buf).resize(size, size).png().toFile(outPath)
  console.log(`  ✓  ${outPath.replace(ROOT + '/', '')}  (${size}×${size})`)
}

// Place markSvg centred on a transparent canvas of canvasSize
async function markOnTransparent(markSvgPath, outPath, canvasSize, markSize) {
  const markBuf = await sharp(readFileSync(markSvgPath))
    .resize(markSize, markSize)
    .png()
    .toBuffer()

  await sharp({
    create: {
      width: canvasSize,
      height: canvasSize,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: markBuf, gravity: 'center' }])
    .png()
    .toFile(outPath)

  console.log(
    `  ✓  ${outPath.replace(ROOT + '/', '')}  (${canvasSize}×${canvasSize}, mark ${markSize}px)`
  )
}

async function main() {
  console.log('\nGenerating PNG icons from SVG assets…\n')

  const iconSvg      = join(ASSETS, 'icon-app.svg')      // blue tile + full-colour mark
  const colorMarkSvg = join(ASSETS, 'mark-color.svg')    // mark only, transparent bg
  const monoMarkSvg  = join(ASSETS, 'mark-mono-white.svg') // white mark, transparent bg

  // ── iOS / web ──────────────────────────────────────────────────────────────
  await fromSvg(iconSvg, join(ASSETS, 'icon.png'),         1024)
  await fromSvg(iconSvg, join(ASSETS, 'favicon.png'),        48)
  await fromSvg(iconSvg, join(ASSETS, 'splash-icon.png'),   512)

  // ── Android adaptive icon ──────────────────────────────────────────────────
  // Foreground: mark centred on transparent canvas; mark at ~66 % = safe zone
  await markOnTransparent(colorMarkSvg, join(ASSETS, 'android-icon-foreground.png'), 1024, 676)

  // Background: solid blue gradient tile
  await fromSvg(GRADIENT_BG_SVG, join(ASSETS, 'android-icon-background.png'), 1024)

  // Monochrome: white-on-transparent mask (system tints it for themed icons)
  await markOnTransparent(monoMarkSvg, join(ASSETS, 'android-icon-monochrome.png'), 1024, 676)

  console.log('\nDone. Rebuild the Expo app (expo prebuild or EAS Build) to pick up the new icons.\n')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
