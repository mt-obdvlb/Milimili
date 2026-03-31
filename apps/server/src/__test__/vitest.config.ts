import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

const testRoot = __dirname
const srcRoot = resolve(__dirname, '..')

export default defineConfig({
  root: resolve(__dirname, '../..'),
  resolve: {
    alias: {
      '@': srcRoot,
    },
  },
  test: {
    environment: 'node',
    globals: false,
    include: ['src/__test__/**/*.test.ts'],
    setupFiles: [resolve(testRoot, 'setup.ts')],
  },
})
