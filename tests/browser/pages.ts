import { expect, type Page, type TestInfo } from '@playwright/test'

export type Playground = 'nuxt' | 'vue'

export function playground(testInfo: TestInfo): Playground {
  return testInfo.project.name as Playground
}

/** What the page reports while it runs: console errors and warnings, and uncaught errors. */
export function reportsOf(page: Page): string[] {
  const reports: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning')
      reports.push(`${message.type()}: ${message.text()}`)
  })
  page.on('pageerror', (error) => reports.push(String(error)))
  return reports
}

/** Opens the page and waits for the app. */
export async function open(page: Page): Promise<void> {
  await page.goto('/')
  await waitForApp(page)
}

/**
 * Waits for the app, after the page loads or the gallery comes back: Nuxt UI's color mode control
 * is drawn by the app, on the gallery once all of it is hydrated. The gallery has every component
 * in every variant, some nine thousand elements, which take seconds while the tests run side by
 * side.
 */
export async function waitForApp(page: Page): Promise<void> {
  await expect(colorMode(page)).toBeVisible({ timeout: 15_000 })
}

/** Nuxt UI's color mode: a radio group bound to it, on both pages. */
export function colorMode(page: Page) {
  return page.getByTestId('color-mode')
}

export function colorModeOption(page: Page, label: 'system' | 'dark' | 'light') {
  return colorMode(page).getByRole('radio', { name: label, exact: true })
}

/**
 * The page's theme switch: the theme's name in the status line of the gallery, a button on the
 * Vue page. Both choose the other theme with Nuxt UI's color mode.
 */
export function themeSwitch(page: Page, where: Playground) {
  return where === 'nuxt'
    ? page.getByRole('button', { name: /^Switch theme, now/ }).filter({ visible: true })
    : page.getByRole('button', { name: 'Theme', exact: true })
}

/** Where Nuxt UI's color mode remembers its preference: @nuxtjs/color-mode's key, and VueUse's. */
export const COLOR_MODE_STORAGE_KEY: Record<Playground, string> = {
  nuxt: 'nuxt-color-mode',
  vue: 'vueuse-color-scheme',
}

/** The theme as <html> says it: data-theme and the classes. */
export function themeState(page: Page) {
  return page.evaluate(() => {
    const html = document.documentElement
    return {
      theme: html.dataset.theme ?? null,
      dark: html.classList.contains('dark'),
      light: html.classList.contains('light'),
    }
  })
}

/** The color a CSS value resolves to on an element in the page, as computed. */
export function resolveColor(page: Page, value: string, theme?: 'dark' | 'light') {
  return page.evaluate(
    ([value, theme]) => {
      const probe = document.createElement('div')
      if (theme) probe.dataset.theme = theme
      probe.style.color = value
      document.body.append(probe)
      const color = getComputedStyle(probe).color
      probe.remove()
      return color
    },
    [value, theme] as const,
  )
}

/** The color of the page behind everything. */
export function pageColor(page: Page) {
  return page.evaluate(() => getComputedStyle(document.body).backgroundColor)
}
