import { expect, test, type Page } from '@playwright/test'
import { open, playground } from './pages.ts'

/**
 * Every section of every page of the gallery against its stored screenshot, in both themes at
 * desktop width. The tests of the tokens, the levels and axe miss a change that moves pixels
 * without changing a token: spacing inside Nuxt UI, an icon's drawing, a clipped focus ring.
 *
 * The sections are read from each page as it is drawn, so a new one has its screenshot without
 * a change here. A page with no sections is one screenshot of its content.
 *
 * Text is drawn differently on every system, so the screenshots are taken and compared in one
 * place: the Playwright container, on Linux. Update them with pnpm test:browser:update.
 */

/** The pages of the gallery, by the name of their tab. */
const PAGES = [
  { name: 'gallery', path: '/' },
  { name: 'dark', path: '/dark' },
  { name: 'open', path: '/open' },
  { name: 'others', path: '/others' },
]

const DESKTOP = { width: 1440, height: 900 }

/**
 * The time the pages are drawn at, so that what shows today's date shows the same day on every
 * run. Out of the months the examples show, so that none marks it.
 */
const NOW = new Date('2027-01-04T10:00:00Z')

test.beforeEach(() => {
  test.skip(playground(test.info()) !== 'nuxt', 'The gallery is the Nuxt playground')
})

test('every tab of the gallery has its screenshots', async ({ page }) => {
  await open(page)
  const tabs = await page
    .getByRole('navigation', { name: 'Main' })
    .getByRole('link')
    .evaluateAll((links) =>
      links.map((link) => ({
        name: link.textContent!.trim(),
        path: new URL((link as HTMLAnchorElement).href).pathname,
      })),
    )
  expect(tabs).toEqual(PAGES)
})

/**
 * The parts of a page that have a screenshot, by name: each section that is not in another,
 * or the page's content where it has none.
 */
function parts(page: Page) {
  return page.evaluate(() => {
    const main = document.querySelector('main')!
    const sections = [...main.querySelectorAll('section[id]')].filter(
      (section) => !section.parentElement!.closest('section'),
    )
    return sections.length
      ? sections.map((section) => ({ name: section.id, selector: `#${CSS.escape(section.id)}` }))
      : [{ name: 'content', selector: 'main > *' }]
  })
}

/**
 * Makes the screen as tall as the tallest part, at the same width, so that every part is
 * captured inside it. For a part taller than the screen, Chromium also changes the page's
 * preferences for the capture, to hide the scrollbars and draw the whole document, and puts them
 * back once the capture's frame is copied; now and then that frame never comes, the capture never
 * returns and the page draws nothing again, so every later part times out. A part inside the
 * screen is captured without that.
 *
 * A part is scrolled into view with its scroll margins, so they count in its height: without
 * them, a section as tall as the screen would end below it, its last lines undrawn.
 */
async function holdTallest(page: Page, shown: Awaited<ReturnType<typeof parts>>): Promise<void> {
  const tallest = await page.evaluate(
    (selectors) =>
      Math.max(
        ...selectors.map((selector) => {
          const part = document.querySelector(selector)!
          const style = getComputedStyle(part)
          return (
            part.getBoundingClientRect().height +
            parseFloat(style.scrollMarginTop) +
            parseFloat(style.scrollMarginBottom)
          )
        }),
      ),
    shown.map((part) => part.selector),
  )
  await page.setViewportSize({
    width: DESKTOP.width,
    height: Math.max(DESKTOP.height, Math.ceil(tallest)),
  })
}

/**
 * Opens a page of the gallery and waits for the app: the status line's switch of the shortcut
 * keys, on every page, shows once the app has mounted it. The page that keeps the dark theme has
 * no color mode control to wait for, as the others do. The switch is found by its attribute: the
 * page of open lists and windows hides the rest of the page from assistive technology.
 */
async function openPage(page: Page, path: string): Promise<void> {
  await page.goto(path)
  await expect(page.locator('[data-ws-keys-switch]')).toBeVisible({ timeout: 30_000 })
}

/**
 * Waits until the page is still: its fonts loaded, its images decoded and its icons painted,
 * which Nuxt UI styles as each is first drawn, a moment after it.
 */
async function settle(page: Page): Promise<void> {
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all(
      [...document.images].map((image) =>
        image.complete ? undefined : image.decode().catch(() => undefined),
      ),
    )
  })
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          [...document.querySelectorAll<HTMLElement>('.iconify:not(svg)')].filter((icon) => {
            const style = getComputedStyle(icon)
            return (
              icon.checkVisibility() &&
              style.maskImage === 'none' &&
              style.backgroundImage === 'none'
            )
          }).length,
      ),
    )
    .toBe(0)
  // two frames, so what reacts to a new layout has reacted and is painted
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  )
}

for (const colorScheme of ['dark', 'light'] as const) {
  test.describe(`desktop, ${colorScheme}`, () => {
    test.use({ viewport: DESKTOP, colorScheme, locale: 'en-US', timezoneId: 'UTC' })

    for (const { name, path } of PAGES) {
      test(`the sections of the ${name} page look as stored`, async ({ page }) => {
        test.skip(
          process.platform !== 'linux',
          'screenshots are compared on Linux, in the Playwright container',
        )
        // a long page has many sections, and a screenshot of one takes a few seconds
        test.setTimeout(5 * 60_000)
        await page.clock.setFixedTime(NOW)
        await openPage(page, path)
        // On a wide screen the window scrolls its content inside itself, which would cut a
        // section taller than the screen: it grows with its content instead, as on a phone.
        await page.addStyleTag({
          content:
            '.window { height: auto !important } .window__main { overflow: visible !important }',
        })
        await settle(page)
        const shown = await parts(page)
        await holdTallest(page, shown)
        await settle(page)
        for (const part of shown) {
          // a section of a long page takes a few seconds to come still, and two in a row agree
          await expect
            .soft(page.locator(part.selector), part.name)
            .toHaveScreenshot(`${name}-${part.name}-${colorScheme}.png`, { timeout: 30_000 })
        }
      })
    }
  })
}
