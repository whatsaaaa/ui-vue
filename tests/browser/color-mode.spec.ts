import { expect, test, type Page } from '@playwright/test'
import {
  COLOR_MODE_STORAGE_KEY,
  colorModeOption,
  designSystemSwitch,
  open,
  pageColor,
  playground,
  resolveColor,
  themeState,
} from './pages.ts'

/*
 * Nuxt UI's color mode owns the theme: it puts a dark or light class on <html>, which the
 * design system's tokens follow, and remembers the choice. The design system's own switch, its
 * theme module's toggleTheme, moves the color mode.
 */

/** The page's color is the theme's: its --ws-color-bg. */
async function expectPageIn(page: Page, theme: 'dark' | 'light') {
  expect(await pageColor(page)).toBe(await resolveColor(page, 'var(--ws-color-bg)', theme))
}

test.describe('on a dark system', () => {
  test.use({ colorScheme: 'dark' })

  test("the design system's switch moves Nuxt UI's color mode", async ({ page }, testInfo) => {
    await open(page)
    await expect(colorModeOption(page, 'system')).toBeChecked()

    await designSystemSwitch(page, playground(testInfo)).click()
    await expect(colorModeOption(page, 'light')).toBeChecked()
    expect(await themeState(page)).toEqual({ theme: 'light', dark: false, light: true })
    await expectPageIn(page, 'light')

    await designSystemSwitch(page, playground(testInfo)).click()
    await expect(colorModeOption(page, 'dark')).toBeChecked()
    expect(await themeState(page)).toEqual({ theme: 'dark', dark: true, light: false })
    await expectPageIn(page, 'dark')

    // The color mode remembers the choice, and the next visit opens in it.
    await page.reload()
    await expect(colorModeOption(page, 'dark')).toBeChecked()
    await expectPageIn(page, 'dark')
  })

  test("Nuxt UI's color mode chooses light over the system, with its class", async ({ page }) => {
    await open(page)

    await colorModeOption(page, 'light').click()
    await expect.poll(() => themeState(page)).toMatchObject({ dark: false, light: true })
    await expectPageIn(page, 'light')

    await page.reload()
    await expect(colorModeOption(page, 'light')).toBeChecked()
    await expectPageIn(page, 'light')

    // Following the system again takes the choice away: the system is dark.
    await colorModeOption(page, 'system').click()
    await expect.poll(() => themeState(page)).toEqual({ theme: null, dark: true, light: false })
    await expectPageIn(page, 'dark')
  })
})

test.describe('on a light system', () => {
  test.use({ colorScheme: 'light' })

  test("Nuxt UI's color mode chooses dark over the system, with its class", async ({ page }) => {
    await open(page)
    await expectPageIn(page, 'light')

    await colorModeOption(page, 'dark').click()
    await expect.poll(() => themeState(page)).toMatchObject({ dark: true, light: false })
    await expectPageIn(page, 'dark')
  })

  test("a theme remembered under the design system's ws-theme gives way to the color mode", async ({
    page,
  }) => {
    // as the bridge of the first version left it, behind a page that follows the system
    await open(page)
    await page.evaluate(() => localStorage.setItem('ws-theme', 'dark'))
    await page.reload()
    await expect(colorModeOption(page, 'system')).toBeChecked()
    expect(await themeState(page)).toEqual({ theme: null, dark: false, light: true })
    expect(await page.evaluate(() => localStorage.getItem('ws-theme'))).toBeNull()
    await expectPageIn(page, 'light')
  })

  test('a remembered choice shows from the first paint, before any script of the app runs', async ({
    page,
  }, testInfo) => {
    const key = COLOR_MODE_STORAGE_KEY[playground(testInfo)]
    await page.addInitScript((key) => localStorage.setItem(key, 'dark'), key)

    // only the head scripts, which are inline, run: every script file is refused
    await page.route('**/*.js', (route) => route.abort())
    await page.goto('/')
    expect(await themeState(page)).toMatchObject({ dark: true, light: false })
    await expectPageIn(page, 'dark')
    // the design system's head script gives the browser's bars the theme's color
    await expect
      .poll(() =>
        page.evaluate(() =>
          document.querySelector('meta[name="theme-color"]')?.getAttribute('content'),
        ),
      )
      .toBe(
        await page.evaluate(() =>
          getComputedStyle(document.documentElement).getPropertyValue('--ws-color-bg').trim(),
        ),
      )

    // and the app, once it runs, keeps it
    await page.unrouteAll()
    await open(page)
    await expect(colorModeOption(page, 'dark')).toBeChecked()
    expect(await themeState(page)).toEqual({ theme: 'dark', dark: true, light: false })
    await expectPageIn(page, 'dark')
  })
})
