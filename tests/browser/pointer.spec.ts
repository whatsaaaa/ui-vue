import { expect, test, type Locator } from '@playwright/test'
import { open, playground, resolveColor } from './pages.ts'

/** The fill and the border of an element, as computed. */
function colors(element: Locator) {
  return element.evaluate((element) => {
    const style = getComputedStyle(element)
    return { fill: style.backgroundColor, border: style.borderTopColor }
  })
}

test('a checkbox card and a radio card or table option raise under the pointer', async ({
  page,
}, testInfo) => {
  test.skip(playground(testInfo) !== 'nuxt', 'The cards are in the gallery')
  await open(page)
  // the design system's color of a hovered item, at half, as on a hovered row of a table, and
  // the outline of a field
  const raised = {
    fill: await resolveColor(page, 'color-mix(in oklab, var(--ws-color-raised) 50%, transparent)'),
    border: await resolveColor(page, 'var(--ws-color-field-border)'),
  }
  // An option drawn as a card is a label around its control.
  const cards = [
    page.locator('label', {
      has: page.getByRole('checkbox', { name: 'Workshop: accessibility' }),
    }),
    ...(await page
      .locator('label', { has: page.getByRole('radio', { name: 'Bank transfer' }) })
      .all()),
  ]
  expect(cards).toHaveLength(3)
  for (const card of cards) {
    expect(await colors(card)).not.toEqual(raised)
    await card.hover()
    await expect.poll(() => colors(card)).toEqual(raised)
  }
})

test('a loading button keeps its look under the pointer, the look of the kind at rest', async ({
  page,
}, testInfo) => {
  test.skip(playground(testInfo) !== 'nuxt', 'The buttons are in the gallery')
  // no transition: what the pointer changes, it changes at once
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await open(page)
  for (const kind of ['primary', 'secondary', 'ghost', 'danger']) {
    const rest = await colors(page.locator(`[data-spec="button.${kind}.rest"]`).first())
    const loading = page.locator(`[data-spec="button.${kind}.loading"]`)
    await loading.hover()
    expect(await colors(loading), kind).toEqual(rest)
  }
})
