/**
 * Rasterizes Agent360 light-background SVGs to presentation-ready PNGs.
 * Run from repo root: npm run export:agent360-logos
 */
import { promises as fs, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Resvg } from '@resvg/resvg-js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../..')
const PUBLIC = path.join(ROOT, 'public')
const SOURCES = path.join(__dirname, 'sources')

/** @param {string} svgPath @param {number} width @returns {Buffer} */
function renderWidth(svgPath, width) {
  const svg = readFileSync(svgPath)
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    font: { loadSystemFonts: true },
  })
  return Buffer.from(resvg.render().asPng())
}

/** @param {string} svgPath @param {number} size @returns {Buffer} */
function renderSquare(svgPath, size) {
  const svg = readFileSync(svgPath)
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: size },
    font: { loadSystemFonts: true },
  })
  return Buffer.from(resvg.render().asPng())
}

async function main() {
  const slideSrc = path.join(SOURCES, 'slide-light.svg')
  const horizSrc = path.join(SOURCES, 'horizontal-light.svg')
  const iconSrc = path.join(SOURCES, 'icon-light.svg')
  const outlineSrc = path.join(SOURCES, 'horizontal-outline.svg')

  const jobs = [
    { out: 'agent360-logo-light-bg.png', fn: () => renderWidth(slideSrc, 2048) },
    { out: 'agent360-logo-light-bg-1024.png', fn: () => renderWidth(slideSrc, 1024) },
    { out: 'agent360-horizontal-light-bg.png', fn: () => renderWidth(horizSrc, 2048) },
    { out: 'agent360-horizontal-light-bg-1024.png', fn: () => renderWidth(horizSrc, 1024) },
    { out: 'agent360-icon-light-bg.png', fn: () => renderSquare(iconSrc, 2048) },
    { out: 'agent360-icon-light-bg-1024.png', fn: () => renderSquare(iconSrc, 1024) },
    { out: 'agent360-icon-light-bg-512.png', fn: () => renderSquare(iconSrc, 512) },
    { out: 'agent360-logo-transparent.png', fn: () => renderWidth(horizSrc, 2048) },
    { out: 'agent360-logo-transparent-1024.png', fn: () => renderWidth(horizSrc, 1024) },
    { out: 'agent360-icon-transparent.png', fn: () => renderSquare(iconSrc, 2048) },
    { out: 'agent360-icon-transparent-1024.png', fn: () => renderSquare(iconSrc, 1024) },
    { out: 'agent360-icon-transparent-512.png', fn: () => renderSquare(iconSrc, 512) },
    { out: 'agent360-logo-outline.png', fn: () => renderWidth(outlineSrc, 2048) },
    { out: 'agent360-logo-outline-1024.png', fn: () => renderWidth(outlineSrc, 1024) },
  ]

  for (const { out, fn } of jobs) {
    const dest = path.join(PUBLIC, out)
    const buf = fn()
    await fs.writeFile(dest, buf)
    process.stdout.write(`Wrote ${path.relative(ROOT, dest)} (${buf.length} bytes)\n`)
  }

  process.stdout.write('\nDone. All PNGs use transparent backgrounds.\n')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
