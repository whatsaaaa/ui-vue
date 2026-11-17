import { expect, test, type Page } from '@playwright/test'
import { open, playground, resolveColor } from './pages.ts'

/** The length a CSS value resolves to, in pixels. */
function resolveLength(page: Page, value: string) {
  return page.evaluate((value) => {
    const probe = document.createElement('div')
    probe.style.width = value
    document.body.append(probe)
    const width = probe.getBoundingClientRect().width
    probe.remove()
    return width
  }, value)
}

/**
 * The contrast of an element's text against what is behind it, by WCAG's formula: the colors are
 * drawn on a canvas to have them in sRGB, whatever space the stylesheet gives them in.
 */
function contrastOf(page: Page, selector: string) {
  return page.locator(selector).evaluateAll((elements) => {
    const canvas = document.createElement('canvas').getContext('2d', { willReadFrequently: true })!
    const rgb = (color: string) => {
      canvas.clearRect(0, 0, 1, 1)
      canvas.fillStyle = color
      canvas.fillRect(0, 0, 1, 1)
      return canvas
        .getImageData(0, 0, 1, 1)
        .data.slice(0, 3)
        .map((channel) => channel / 255)
    }
    const luminance = (color: string) => {
      const [r, g, b] = rgb(color).map((c) =>
        c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
      )
      return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!
    }
    return elements.map((element) => {
      let behind: Element | null = element
      while (behind && getComputedStyle(behind).backgroundColor === 'rgba(0, 0, 0, 0)')
        behind = behind.parentElement
      const [lighter, darker] = [
        luminance(getComputedStyle(element).color),
        luminance(getComputedStyle(behind ?? document.body).backgroundColor),
      ].sort((a, b) => b - a)
      return (lighter! + 0.05) / (darker! + 0.05)
    })
  })
}

test("a checkbox's tick is drawn at the system's icon size, and at four fifths of each box", async ({
  page,
}, testInfo) => {
  test.skip(playground(testInfo) !== 'nuxt', 'The checkboxes are in the gallery')
  await open(page)
  const icon = await resolveLength(page, 'var(--ws-size-icon)')
  const check = await resolveLength(page, 'var(--ws-size-check)')
  // every checked box of the gallery, of every size
  const sizes = await page
    .locator('#checkbox [data-slot="base"][data-state="checked"]')
    .evaluateAll((boxes) =>
      boxes.map((box) => ({
        box: box.getBoundingClientRect().width,
        tick: box.querySelector('[data-slot="icon"]')!.getBoundingClientRect().width,
      })),
    )
  expect(sizes.filter(({ box }) => box === check).length).toBeGreaterThan(1)
  for (const { box, tick } of sizes) {
    if (box === check) expect(tick).toBe(icon)
    expect(Math.abs(tick - box * 0.8)).toBeLessThanOrEqual(1)
  }
})

for (const colorScheme of ['dark', 'light'] as const) {
  test.describe(`on a ${colorScheme} system`, () => {
    test.use({ colorScheme })

    test("a select's placeholder is the secondary text, at 4.5:1 or more", async ({
      page,
    }, testInfo) => {
      test.skip(playground(testInfo) !== 'nuxt', 'The selects are in the gallery')
      await open(page)
      const placeholders = page.locator('#select [data-slot="placeholder"]')
      // a select and a select menu
      await expect(placeholders).toHaveCount(2)
      const secondary = await resolveColor(page, 'var(--ws-color-text-secondary)')
      for (const placeholder of await placeholders.all())
        await expect(placeholder).toHaveCSS('color', secondary)
      for (const contrast of await contrastOf(page, '#select [data-slot="placeholder"]'))
        expect(contrast).toBeGreaterThanOrEqual(4.5)
    })
  })
}
