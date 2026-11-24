import { defineConfig, devices } from '@playwright/test'

/**
 * Browser tests of the two built playgrounds: the Nuxt gallery, generated as a static site, and
 * the page of the plain Vue setup. "pnpm test:browser" builds both first.
 *
 * Screenshots are compared on Linux only, in the Playwright container, where they are taken.
 * On another system the screenshot tests skip and the rest runs.
 *
 * Every run serves both playgrounds itself, on ports of its own, and never takes a server that is
 * already running for its own: that could be another copy of the repository with another build.
 * PLAYGROUND_NUXT_URL and PLAYGROUND_VUE_URL name a server to test instead:
 *
 *   node tests/browser/serve.ts playgrounds/nuxt/.output/public 4310
 *   PLAYGROUND_NUXT_URL=http://127.0.0.1:4310 pnpm test:browser:run --project=nuxt
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
  // set by then: every worker reads this file again, after the servers below have started
  projects: [
    { name: 'nuxt', use: { baseURL: process.env.PLAYGROUND_NUXT_URL } },
    { name: 'vue', use: { baseURL: process.env.PLAYGROUND_VUE_URL } },
  ],
  webServer: [
    process.env.PLAYGROUND_NUXT_URL
      ? undefined
      : {
          command: 'node tests/browser/serve.ts playgrounds/nuxt/.output/public',
          // the address the server prints, which goes to the environment as PLAYGROUND_NUXT_URL
          wait: { stdout: /served at (?<playground_nuxt_url>\S+)/ },
        },
    process.env.PLAYGROUND_VUE_URL
      ? undefined
      : {
          command: 'node tests/browser/serve.ts playgrounds/vue/dist',
          // the address the server prints, which goes to the environment as PLAYGROUND_VUE_URL
          wait: { stdout: /served at (?<playground_vue_url>\S+)/ },
        },
  ].filter((server) => server !== undefined),
})
