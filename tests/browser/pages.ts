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

/** Opens the page and waits for the app: Nuxt UI's color mode control is drawn by the app. */
export async function open(page: Page): Promise<void> {
  await page.goto('/')
  await expect(colorMode(page)).toBeVisible()
}

/** Nuxt UI's color mode: a radio group bound to it, on both pages. */
export function colorMode(page: Page) {
  return page.getByTestId('color-mode')
}

export function colorModeOption(page: Page, label: 'sistem' | 'tamna' | 'svetla') {
  return colorMode(page).getByRole('radio', { name: label, exact: true })
}

/**
 * The design system's own theme switch: the theme's name in the status line of the gallery,
 * a button on the Vue page. Both call its theme module's toggleTheme.
 */
export function designSystemSwitch(page: Page, where: Playground) {
  return where === 'nuxt'
    ? page.getByRole('button', { name: /^Switch theme, now/ }).filter({ visible: true })
    : page.getByRole('button', { name: 'Tema', exact: true })
}

/**
 * The theme as <html> says it: data-theme and the classes, and the remembered choice as the
 * design system reads it. @nuxtjs/color-mode keeps "system" there while it follows the
 * system, which the design system reads as no choice.
 */
export function themeState(page: Page) {
  return page.evaluate(() => {
    const html = document.documentElement
    const stored = localStorage.getItem('ws-theme')
    return {
      theme: html.dataset.theme ?? null,
      dark: html.classList.contains('dark'),
      light: html.classList.contains('light'),
      stored: stored === 'dark' || stored === 'light' ? stored : null,
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
