import { expect, test, type Page } from '@playwright/test'
import {
  COLOR_MODE_STORAGE_KEY,
  colorModeOption,
  open,
  pageColor,
  playground,
  resolveColor,
  themeState,
  themeSwitch,
  waitForApp,
} from './pages.ts'

/*
 * Nuxt UI's color mode owns the theme: it puts a dark or light class on <html>, which the
 * design system's tokens follow, and remembers the choice. The page's theme switch chooses with
 * it too, and nothing sets a data-theme over its class.
 */

/** The page's color is the theme's: its --ws-color-bg. */
async function expectPageIn(page: Page, theme: 'dark' | 'light') {
  expect(await pageColor(page)).toBe(await resolveColor(page, 'var(--ws-color-bg)', theme))
}

/**
 * The page that forces dark is in it: the tokens, the dark: and light: variants and Nuxt UI's
 * colors.
 */
async function expectDarkPage(page: Page) {
  await expect.poll(() => themeState(page)).toEqual({ theme: null, dark: true, light: false })
  await expectPageIn(page, 'dark')
  await expect(page.getByTestId('page-theme')).toHaveText("colorMode: 'dark', in the dark theme", {
    useInnerText: true,
  })
  expect(await resolveColor(page, 'var(--ui-primary)')).toBe(
    await resolveColor(page, 'var(--ui-primary)', 'dark'),
  )
}

test.describe('on a dark system', () => {
  test.use({ colorScheme: 'dark' })

  test("the theme switch chooses the other theme with Nuxt UI's color mode", async ({
    page,
  }, testInfo) => {
    await open(page)
    await expect(colorModeOption(page, 'system')).toBeChecked()

    await themeSwitch(page, playground(testInfo)).click()
    await expect(colorModeOption(page, 'light')).toBeChecked()
    expect(await themeState(page)).toEqual({ theme: null, dark: false, light: true })
    await expectPageIn(page, 'light')

    await themeSwitch(page, playground(testInfo)).click()
    await expect(colorModeOption(page, 'dark')).toBeChecked()
    expect(await themeState(page)).toEqual({ theme: null, dark: true, light: false })
    await expectPageIn(page, 'dark')

    // The color mode remembers the choice, and the next visit opens in it.
    await page.reload()
    await waitForApp(page)
    await expect(colorModeOption(page, 'dark')).toBeChecked()
    await expectPageIn(page, 'dark')
  })

  test("Nuxt UI's color mode chooses light over the system, with its class", async ({ page }) => {
    await open(page)

    await colorModeOption(page, 'light').click()
    await expect.poll(() => themeState(page)).toMatchObject({ dark: false, light: true })
    await expectPageIn(page, 'light')

    await page.reload()
    await waitForApp(page)
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
    await waitForApp(page)
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
    expect(await themeState(page)).toEqual({ theme: null, dark: true, light: false })
    await expectPageIn(page, 'dark')
  })

  test('a page that forces dark is dark, though the visitor chose light', async ({
    page,
  }, testInfo) => {
    test.skip(playground(testInfo) !== 'nuxt', 'The gallery has the page')
    // the gallery is drawn twice
    test.slow()
    const tab = (name: string) =>
      page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name, exact: true })

    await open(page)
    await colorModeOption(page, 'light').click()
    await expect.poll(() => themeState(page)).toEqual({ theme: null, dark: false, light: true })
    await expectPageIn(page, 'light')
    await expect
      .poll(() => page.evaluate((key) => localStorage.getItem(key), COLOR_MODE_STORAGE_KEY.nuxt))
      .toBe('light')

    // opened from the gallery, and again as the first page of a visit
    await tab('dark').click()
    await expect(tab('dark')).toHaveAttribute('aria-current', 'page')
    await expectDarkPage(page)
    await page.reload()
    await expectDarkPage(page)

    // the visitor's choice holds on the other pages
    await tab('gallery').click()
    await waitForApp(page)
    await expect(colorModeOption(page, 'light')).toBeChecked()
    await expect.poll(() => themeState(page)).toEqual({ theme: null, dark: false, light: true })
    await expectPageIn(page, 'light')
  })
})
