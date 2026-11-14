import { defineConfig, devices } from '@playwright/test'

/**
 * Browser tests of the two built playgrounds: the Nuxt gallery, generated as a static site, and
 * the page of the plain Vue setup. "pnpm test:browser" builds both first.
 */
export default defineConfig({
  testDir: 'tests/browser',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  // The gallery hydrates hundreds of components, which takes longer than an assertion's usual
  // five seconds while the tests run side by side, and a test waits for it after every load.
  expect: { timeout: 15_000 },
  use: {
    ...devices['Desktop Chrome'],
    colorScheme: 'dark',
  },
  projects: [
    { name: 'nuxt', use: { baseURL: 'http://127.0.0.1:4310' } },
    { name: 'vue', use: { baseURL: 'http://127.0.0.1:4311' } },
  ],
  webServer: [
    {
      command: 'node tests/browser/serve.ts playgrounds/nuxt/.output/public 4310',
      url: 'http://127.0.0.1:4310',
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'node tests/browser/serve.ts playgrounds/vue/dist 4311',
      url: 'http://127.0.0.1:4311',
      reuseExistingServer: !process.env.CI,
    },
  ],
})
