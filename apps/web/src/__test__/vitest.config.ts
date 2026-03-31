import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const srcRoot = fileURLToPath(new URL('..', import.meta.url))

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
  },
  oxc: false,
  root: fileURLToPath(new URL('../..', import.meta.url)),
  resolve: {
    alias: {
      '@': srcRoot,
    },
  },
  test: {
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        url: 'http://localhost:3001',
      },
    },
    globals: false,
    include: ['src/__test__/**/*.test.ts', 'src/__test__/**/*.test.tsx'],
    setupFiles: [fileURLToPath(new URL('./setup.ts', import.meta.url))],
  },
})
