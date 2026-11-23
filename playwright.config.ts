import { defineConfig, devices } from '@playwright/test'

/**
 * Browser tests of the two built playgrounds: the Nuxt gallery, generated as a static site, and
 * the page of the plain Vue setup. "pnpm test:browser" builds both first.
 *
 * Screenshots are compared on Linux only, in the Playwright container, where they are taken.
 * On another system the screenshot tests skip and the rest runs.
 */
export default defineConfig({
  testDir: 'tests/browser',
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    ...devices['Desktop Chrome'],
    colorScheme: 'dark',
  },
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      // a few pixels of anti-aliasing may differ between machines. A real change moves far more.
      maxDiffPixels: 150,
    },
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
