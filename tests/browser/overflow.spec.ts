import { expect, test } from '@playwright/test'
import { open, playground } from './pages.ts'

/**
 * How far the page scrolls sideways, and the elements that stick out of it without a scrolling
 * container around them, as the design system measures it. Both have to be nothing.
 */
const measure = () => {
  const width = document.documentElement.clientWidth
  const sticking: string[] = []
  for (const element of document.querySelectorAll('body *')) {
    const box = element.getBoundingClientRect()
    if (box.width === 0 || box.height === 0 || box.right <= width + 0.5) continue
    let parent = element.parentElement
    let contained = false
    while (parent) {
      const style = getComputedStyle(parent)
      if (['auto', 'scroll'].includes(style.overflowX) || style.position === 'fixed') {
        contained = true
        break
      }
      parent = parent.parentElement
    }
    if (!contained)
      sticking.push(`${element.tagName.toLowerCase()}.${element.getAttribute('class') ?? ''}`)
  }
  return { scroll: document.documentElement.scrollWidth - width, sticking: sticking.slice(0, 5) }
}

// From the width the content must reflow to (WCAG 1.4.10), and a phone's.
for (const width of [320, 390]) {
  for (const colorScheme of ['dark', 'light'] as const) {
    test.describe(`${width} px, ${colorScheme}`, () => {
      test.use({ viewport: { width, height: 800 }, colorScheme })

      test('nothing overflows sideways', async ({ page }) => {
        await open(page)
        expect(await page.evaluate(measure)).toEqual({ scroll: 0, sticking: [] })
      })

      test('nothing overflows sideways on the page of open lists and windows', async ({
        page,
      }, testInfo) => {
        test.skip(playground(testInfo) !== 'nuxt', 'The page is in the gallery')
        await open(page, '/open')
        expect(await page.evaluate(measure)).toEqual({ scroll: 0, sticking: [] })
        // the window scrolls its content inside itself here: an open list or window wider than
        // its column would scroll it sideways
        const main = page.locator('.window__main')
        expect(await main.evaluate((main) => main.scrollWidth - main.clientWidth)).toBe(0)
      })
    })
  }
}
