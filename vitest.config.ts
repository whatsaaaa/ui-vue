import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // The browser tests are Playwright's, in tests/browser.
    include: ['tests/*.test.ts'],
  },
})
