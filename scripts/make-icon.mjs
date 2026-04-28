import sharp from 'sharp'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const svgPath = resolve('public', 'favicon.svg')
const outPath = resolve('public', 'icon-512.png')

const svg = await readFile(svgPath)
await sharp(svg, { density: 384 })
  .resize(512, 512, { fit: 'contain', background: { r: 251, g: 246, b: 234, alpha: 1 } })
  .png({ compressionLevel: 9 })
  .toFile(outPath)

console.log('wrote', outPath)

