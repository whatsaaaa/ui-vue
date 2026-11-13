import { expect, test } from '@playwright/test'
import {
  colorModeOption,
  designSystemSwitch,
  open,
  pageColor,
  playground,
  resolveColor,
  themeState,
} from './pages.ts'

/*
 * The design system's theme (data-theme on <html>, and the system's setting) and Nuxt UI's
 * color mode (the dark class on <html>) are one: switching either moves the other.
 */

test.describe('on a dark system', () => {
  test.use({ colorScheme: 'dark' })

  test("the design system's switch moves Nuxt UI's color mode", async ({ page }, testInfo) => {
    await open(page)
    await expect(colorModeOption(page, 'sistem')).toBeChecked()

    await designSystemSwitch(page, playground(testInfo)).click()
    await expect
      .poll(() => themeState(page))
      .toEqual({
        theme: 'light',
        dark: false,
        light: true,
        stored: 'light',
      })
    await expect(colorModeOption(page, 'svetla')).toBeChecked()
    expect(await pageColor(page)).toBe(await resolveColor(page, 'var(--ws-color-bg)', 'light'))

    await designSystemSwitch(page, playground(testInfo)).click()
    await expect
      .poll(() => themeState(page))
      .toEqual({
        theme: 'dark',
        dark: true,
        light: false,
        stored: 'dark',
      })
    await expect(colorModeOption(page, 'tamna')).toBeChecked()
  })

  test("Nuxt UI's color mode moves the design system's theme", async ({ page }) => {
    await open(page)

    await colorModeOption(page, 'svetla').click()
    await expect
      .poll(() => themeState(page))
      .toEqual({
        theme: 'light',
        dark: false,
        light: true,
        stored: 'light',
      })
    expect(await pageColor(page)).toBe(await resolveColor(page, 'var(--ws-color-bg)', 'light'))

    // The choice is remembered, and applies again on the next visit.
    await page.reload()
    await expect(colorModeOption(page, 'svetla')).toBeChecked()
    expect((await themeState(page)).theme).toBe('light')

    // Following the system again takes the choice away: the system is dark.
    await colorModeOption(page, 'sistem').click()
    await expect
      .poll(() => themeState(page))
      .toMatchObject({ theme: null, dark: true, light: false })
    expect(await pageColor(page)).toBe(await resolveColor(page, 'var(--ws-color-bg)', 'dark'))
  })
})

test.describe('on a light system', () => {
  test.use({ colorScheme: 'light' })

  test('a dark class put on <html> by hand chooses the dark theme', async ({ page }) => {
    await open(page)
    await page.evaluate(() => document.documentElement.classList.replace('light', 'dark'))
    await expect
      .poll(() => themeState(page))
      .toEqual({
        theme: 'dark',
        dark: true,
        light: false,
        stored: 'dark',
      })
    await expect(colorModeOption(page, 'tamna')).toBeChecked()
    expect(await pageColor(page)).toBe(await resolveColor(page, 'var(--ws-color-bg)', 'dark'))
  })

  test('a remembered choice applies before any script of the app runs', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('ws-theme', 'dark'))
    // only the head scripts, which are inline, run: every script file is refused
    await page.route('**/*.js', (route) => route.abort())
    await page.goto('/')
    expect(await themeState(page)).toEqual({
      theme: 'dark',
      dark: true,
      light: false,
      stored: 'dark',
    })
    expect(await pageColor(page)).toBe(await resolveColor(page, 'var(--ws-color-bg)', 'dark'))
  })
})
