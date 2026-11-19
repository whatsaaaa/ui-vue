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
  // the design system's color of a hovered item, at half, and the outline of a field
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

test('a checkbox and a radio group take the choice colors from the tier as it changes, with the pointer on a label too', async ({
  page,
}, testInfo) => {
  test.skip(playground(testInfo) !== 'nuxt', 'The examples are in the gallery')
  // no transition: what the pointer changes, it changes at once
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await open(page)
  // colors no token has, on the page's tier
  const tier = {
    '--ws-choice-control-border-rest': 'rgb(1, 2, 3)',
    '--ws-choice-control-border-hover': 'rgb(4, 5, 6)',
    '--ws-choice-indicator-bg-checked': 'rgb(7, 8, 9)',
    '--ws-choice-indicator-bg-indeterminate': 'rgb(10, 11, 12)',
    '--ws-choice-indicator-bg-disabled': 'rgb(13, 14, 15)',
  }
  await page.evaluate((tier) => {
    for (const [name, value] of Object.entries(tier))
      document.documentElement.style.setProperty(name, value)
  }, tier)
  const example = (id: string) => page.locator(`[data-spec="${id}"]`).first()

  // The control and its label take the pointer as one: the edge lightens on either, and in a
  // group only the edge of the option under the pointer.
  const box = example('checkbox.list.rest').locator('[data-slot="base"]')
  await expect(box).toHaveCSS('border-color', tier['--ws-choice-control-border-rest'])
  await example('checkbox.list.rest').locator('[data-slot="label"]').hover()
  await expect(box).toHaveCSS('border-color', tier['--ws-choice-control-border-hover'])
  const group = example('radio-group.list.rest')
  await group.getByText('Bank transfer').hover()
  const circles = group.locator('[data-slot="base"]')
  await expect(circles.nth(1)).toHaveCSS('border-color', tier['--ws-choice-control-border-hover'])
  for (const other of [circles.nth(0), circles.nth(2)])
    await expect(other).toHaveCSS('border-color', tier['--ws-choice-control-border-rest'])

  // the fills, a disabled one too, whether checked or indeterminate
  const fills: [string, string][] = [
    ['checkbox.list.checked', tier['--ws-choice-indicator-bg-checked']],
    ['checkbox.list.indeterminate', tier['--ws-choice-indicator-bg-indeterminate']],
    ['radio-group.list.checked', tier['--ws-choice-indicator-bg-checked']],
    ['radio-group.list.disabled', tier['--ws-choice-indicator-bg-disabled']],
  ]
  for (const [id, fill] of fills)
    await expect(example(id).locator('[data-slot="indicator"]'), id).toHaveCSS(
      'background-color',
      fill,
    )
  const disabled = page.locator('[data-spec="checkbox.list.disabled"] [data-slot="indicator"]')
  await expect(disabled).toHaveCount(2)
  for (const indicator of await disabled.all())
    await expect(indicator).toHaveCSS('background-color', tier['--ws-choice-indicator-bg-disabled'])
})

test("a table's rows take the table colors from the tier as it changes: raised under the pointer, and chosen by their checkbox", async ({
  page,
}, testInfo) => {
  test.skip(playground(testInfo) !== 'nuxt', 'The tables are in the gallery')
  // no transition: what the pointer changes, it changes at once
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await open(page)
  // colors and a padding no token has, on the page's tier
  const tier = {
    '--ws-table-head-bg': 'rgb(1, 2, 3)',
    '--ws-table-row-bg-hover': 'rgb(4, 5, 6)',
    '--ws-table-row-bg-selected': 'rgb(7, 8, 9)',
    '--ws-table-cell-padding-inline': '13px',
  }
  await page.evaluate((tier) => {
    for (const [name, value] of Object.entries(tier))
      document.documentElement.style.setProperty(name, value)
  }, tier)
  const table = page.locator('[data-spec="table.selectable.rest"]')
  await expect(table.locator('th').first()).toHaveCSS(
    'background-color',
    tier['--ws-table-head-bg'],
  )
  await expect(table.locator('td').first()).toHaveCSS('padding-inline-start', '13px')
  const row = table.locator('tbody tr').first()
  await expect(row).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
  await row.getByText('Lisbon').hover()
  await expect(row).toHaveCSS('background-color', tier['--ws-table-row-bg-hover'])
  // chosen, the row keeps the selection color under the pointer
  await row.getByRole('checkbox').click()
  await row.getByText('Lisbon').hover()
  await expect(row).toHaveCSS('background-color', tier['--ws-table-row-bg-selected'])
})

test("a checkbox's box and a radio's circle lighten with the pointer on them or their label, not on the line about them", async ({
  page,
}, testInfo) => {
  test.skip(playground(testInfo) !== 'nuxt', 'The examples are in the gallery')
  // no transition: what the pointer changes, it changes at once
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await open(page)
  // the design system's edge of a control at rest and under the pointer
  const edge = {
    rest: await resolveColor(page, 'var(--ws-choice-control-border-rest)'),
    hover: await resolveColor(page, 'var(--ws-choice-control-border-hover)'),
  }
  expect(edge.hover).not.toEqual(edge.rest)
  // an option of each in the list: Send me news, and Bank transfer
  const options = [
    page.locator('[data-spec="checkbox.list.rest"]').first(),
    page
      .locator('[data-spec="radio-group.list.rest"]')
      .first()
      .locator('[data-slot="item"]')
      .nth(1),
  ]
  for (const option of options) {
    const control = option.locator('[data-slot="base"]')
    const label = option.locator('[data-slot="label"]')
    const description = option.locator('[data-slot="description"]')
    const pointer: [Locator, string][] = [
      [description, edge.rest],
      [label, edge.hover],
      [description, edge.rest],
      [control, edge.hover],
    ]
    for (const [target, color] of pointer) {
      await target.hover()
      await expect(control).toHaveCSS('border-color', color)
    }
  }
})

test("a select's trigger takes the field's colors from the tier as it changes, under the pointer too", async ({
  page,
}, testInfo) => {
  test.skip(playground(testInfo) !== 'nuxt', 'The selects are in the gallery')
  // no transition: what the pointer changes, it changes at once
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await open(page)
  // colors no token has, on the page's tier
  const tier = {
    '--ws-field-bg': 'rgb(1, 2, 3)',
    '--ws-field-icon': 'rgb(4, 5, 6)',
    '--ws-field-text-disabled': 'rgb(7, 8, 9)',
  }
  await page.evaluate((tier) => {
    for (const [name, value] of Object.entries(tier))
      document.documentElement.style.setProperty(name, value)
  }, tier)
  // a select and a select menu, at rest and under the pointer
  for (const trigger of [
    page.locator('#select').getByRole('combobox').first(),
    page.getByTestId('select-menu'),
  ]) {
    await expect(trigger).toHaveCSS('background-color', tier['--ws-field-bg'])
    await expect(trigger.locator('[data-slot="trailingIcon"]')).toHaveCSS(
      'color',
      tier['--ws-field-icon'],
    )
    await trigger.hover()
    await expect(trigger).toHaveCSS('background-color', tier['--ws-field-bg'])
  }
  await expect(page.locator('#select').getByRole('combobox', { disabled: true })).toHaveCSS(
    'color',
    tier['--ws-field-text-disabled'],
  )
})
