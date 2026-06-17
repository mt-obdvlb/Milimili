import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const webRootBarrel = resolve(process.cwd(), 'src/index.ts')
const testExportLine = "export * from './__test__/index'"

const current = readFileSync(webRootBarrel, 'utf8')
const next = current
  .split('\n')
  .filter((line) => line.trim() !== testExportLine)
  .join('\n')

if (next !== current) {
  writeFileSync(webRootBarrel, next)
}
