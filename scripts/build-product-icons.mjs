// Regenerates lib/productIcons.ts from the SVGs in assets/icons/.
// Run after dropping new icons into assets/icons/:
//   node scripts/build-product-icons.mjs

import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, join } from 'node:path'

const dir = 'assets/icons'
const files = readdirSync(dir).filter((f) => f.endsWith('.svg')).sort()

const entries = files.map((f) => {
  const slug = basename(f, '.svg')
  const xml = readFileSync(join(dir, f), 'utf8')
    .replace(/\r?\n/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .replace(/`/g, '\\`')
    .replace(/\${/g, '\\${')
  return `  ${slug}: \`${xml}\`,`
}).join('\n')

const out = `// Auto-generated from assets/icons/*.svg via scripts/build-product-icons.mjs.
// Each entry is the inlined SVG XML string for a curated thumbnail.
// Keys correspond to ProductAnimation::IMAGE_KEY_TO_FILE / CATEGORY_TO_FILE values
// returned by the backend in ApiProduct.image_file.

export const PRODUCT_ICONS: Record<string, string> = {
${entries}
}

export const FALLBACK_ICON = "bag"
`

writeFileSync('lib/productIcons.ts', out)
console.log(`wrote lib/productIcons.ts (${files.length} icons, ${Buffer.byteLength(out)} bytes)`)
