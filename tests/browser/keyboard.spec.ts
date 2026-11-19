import { expect, test, type Locator, type Page } from '@playwright/test'
import {
  COLOR_MODE_STORAGE_KEY,
  colorModeOption,
  open,
  playground,
  resolveColor,
  themeSwitch,
  waitForApp,
} from './pages.ts'

/**
 * The ring of the element with the focus: the design system's is two pixels of interactive,
 * three pixels out. Where the window or a bar would cut it off, as on a tab, it is drawn inside
 * the element instead. A control drawn as a card, such as a checkbox card, draws it on the card
 * around it. Its color is the interactive color of the theme where it is, which in a part of the
 * page kept in the other theme is that theme's.
 */
function focusRing(page: Page) {
  return page.evaluate(() => {
    const element = document.activeElement
    if (!element || element === document.body) return null
    let ringed: Element = element
    for (let parent = element.parentElement, depth = 0; parent && depth < 3; depth++) {
      if (getComputedStyle(ringed).outlineStyle !== 'none') break
      if (getComputedStyle(parent).outlineStyle !== 'none') ringed = parent
      parent = parent.parentElement
    }
    const style = getComputedStyle(ringed)
    const probe = document.createElement('span')
    probe.style.color = style.getPropertyValue('--ws-color-interactive')
    document.body.append(probe)
    const interactive = getComputedStyle(probe).color
    probe.remove()
    return {
      element: `${element.tagName.toLowerCase()} ${element.getAttribute('aria-label') ?? element.textContent?.trim().slice(0, 30) ?? ''}`,
      style: style.outlineStyle,
      width: parseFloat(style.outlineWidth),
      color: style.outlineColor,
      offset: parseFloat(style.outlineOffset),
      interactive,
    }
  })
}

test('every control the Tab key reaches shows the focus ring', async ({ page }) => {
  await open(page)
  const seen = new Set<string>()
  let stops = 0
  // Tab through the whole page, until the focus comes round to where it started.
  for (; stops < 400; stops++) {
    await page.keyboard.press('Tab')
    const ring = await focusRing(page)
    if (!ring) continue
    const id = await page.evaluate(() => {
      const element = document.activeElement!
      return [...document.querySelectorAll('*')].indexOf(element).toString()
    })
    if (seen.has(id)) break
    seen.add(id)
    expect(ring.style, `${ring.element} has a ring`).toBe('solid')
    expect(ring.width, `${ring.element} has a ring two pixels wide`).toBe(2)
    expect(ring.color, `${ring.element} has a ring in the interactive color`).toBe(ring.interactive)
    expect([3, -2], `${ring.element} has a ring three pixels out, or inside itself`).toContain(
      ring.offset,
    )
  }
  // all of the gallery, and the eight stops of the Vue page
  expect(seen.size).toBeGreaterThanOrEqual(playground(test.info()) === 'nuxt' ? 100 : 8)
  expect(stops).toBeLessThan(400)
})

test.describe('the gallery', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(playground(testInfo) !== 'nuxt', 'The controls below are in the gallery')
    await open(page)
  })

  test('a select opens, moves and chooses with the keyboard', async ({ page }) => {
    const select = page.getByTestId('select-days')
    const option = (name: string) => page.getByRole('option', { name, exact: true })
    await select.focus()
    // The list opens on the chosen option, and the arrow keys move from it.
    await page.keyboard.press('Enter')
    await expect(option('Day one, May 10')).toBeFocused()
    await page.keyboard.press('ArrowDown')
    await expect(option('Day two, May 11')).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('listbox')).toBeHidden()
    await expect(select).toHaveText('Day two, May 11')
    await expect(select).toBeFocused()

    // The disabled option is passed over.
    await page.keyboard.press('Enter')
    await expect(option('Day two, May 11')).toBeFocused()
    await page.keyboard.press('ArrowDown')
    await expect(option('Day three, May 12')).toBeFocused()
    await page.keyboard.press('ArrowDown')
    await expect(option('Day three, May 12')).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(select).toHaveText('Day two, May 11')
  })

  test('a select menu searches and chooses with the keyboard', async ({ page }) => {
    const menu = page.getByTestId('select-menu')
    await menu.focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('combobox').and(page.locator('input'))).toBeFocused()
    await page.keyboard.type('Pra')
    const options = page.getByRole('option')
    await expect(options).toHaveCount(1)
    await page.keyboard.press('Enter')
    await expect(menu).toHaveText('Prague')
  })

  test('a modal opens with the keyboard, keeps the focus and gives it back', async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Delete registration' })
    await trigger.focus()
    await page.keyboard.press('Enter')
    const dialog = page.getByRole('dialog', { name: 'Delete registration' })
    await expect(dialog).toBeVisible()
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab')
      expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(
        true,
      )
    }
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  test('tabs move with the arrow keys and pass over a disabled tab', async ({ page }) => {
    const tabs = page.getByRole('tablist').first()
    await tabs.getByRole('tab', { name: 'Overview' }).focus()
    await page.keyboard.press('ArrowRight')
    await expect(tabs.getByRole('tab', { name: 'Settings' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')
    await expect(tabs.getByRole('tab', { name: 'Overview' })).toBeFocused()
  })

  test("a table's rows are chosen by their checkboxes, and a row is no stop of its own", async ({
    page,
  }) => {
    const table = page.locator('[data-spec="table.selectable.rest"]')
    const all = table.getByRole('checkbox', { name: 'Choose every registration' })
    const maya = table.getByRole('checkbox', { name: 'Choose Maya Collins' })
    await all.focus()
    await page.keyboard.press('Tab')
    await expect(maya).toBeFocused()
    await page.keyboard.press('Space')
    await expect(maya).toHaveAttribute('aria-checked', 'true')
    await expect(table.locator('tbody tr').first()).toHaveAttribute('data-selected', 'true')
    await expect(all).toHaveAttribute('aria-checked', 'mixed')
    await page.keyboard.press('Tab')
    await expect(table.getByRole('checkbox', { name: 'Choose Daniel Brooks' })).toBeFocused()
    // the head's checkbox chooses every row, and lets them all go
    await all.focus()
    await page.keyboard.press('Space')
    for (const checkbox of await table.getByRole('checkbox').all())
      await expect(checkbox).toHaveAttribute('aria-checked', 'true')
    await page.keyboard.press('Space')
    for (const checkbox of await table.getByRole('checkbox').all())
      await expect(checkbox).toHaveAttribute('aria-checked', 'false')
  })

  test('a row is ringed inside while its checkbox has the focus, not while another control in it has', async ({
    page,
  }) => {
    const table = page
      .getByRole('table')
      .filter({ has: page.getByRole('button', { name: 'Edit Maya Collins' }) })
    const row = table.locator('tbody tr').first()
    await table.getByRole('checkbox', { name: 'Choose every registration' }).focus()
    await page.keyboard.press('Tab')
    await expect(row.getByRole('checkbox', { name: 'Choose Maya Collins' })).toBeFocused()
    // the table spec's ring of a row: two pixels of the interactive color, inside the row
    await expect(row).toHaveCSS('outline-style', 'solid')
    await expect(row).toHaveCSS('outline-width', '2px')
    await expect(row).toHaveCSS(
      'outline-color',
      await resolveColor(page, 'var(--ws-color-interactive)'),
    )
    await expect(row).toHaveCSS('outline-offset', '-2px')
    // the row's action rings itself alone
    await page.keyboard.press('Tab')
    await expect(row.getByRole('button', { name: 'Edit Maya Collins' })).toBeFocused()
    await expect(row).toHaveCSS('outline-style', 'none')
  })

  test('a row Nuxt UI makes a stop of its own, with a handler for its rows, is ringed inside and keeps its selection color under the pointer', async ({
    page,
  }) => {
    const table = page.locator('[data-spec="table.selectable.selected"]')
    // what Nuxt UI puts on each row of a table with a handler for its rows, such as @select
    await table.locator('tbody tr').evaluateAll((rows: HTMLElement[]) => {
      for (const row of rows) {
        row.dataset.selectable = 'true'
        row.tabIndex = 0
      }
    })
    const chosen = table.locator('tbody tr').first()
    await table.getByRole('checkbox', { name: 'Choose every registration' }).focus()
    await page.keyboard.press('Tab')
    await expect(chosen).toBeFocused()
    await expect(chosen).toHaveCSS('outline-style', 'solid')
    await expect(chosen).toHaveCSS('outline-width', '2px')
    await expect(chosen).toHaveCSS(
      'outline-color',
      await resolveColor(page, 'var(--ws-color-interactive)'),
    )
    await expect(chosen).toHaveCSS('outline-offset', '-2px')
    await chosen.getByText('Lisbon').hover()
    await expect(chosen).toHaveCSS(
      'background-color',
      await resolveColor(page, 'var(--ws-table-row-bg-selected)'),
    )
  })

  test('a card keeps the border of its state with the focus: checked, or in error', async ({
    page,
  }) => {
    const interactive = await resolveColor(page, 'var(--ws-color-interactive)')
    const danger = await resolveColor(page, 'var(--ws-color-danger)')
    // An option drawn as a card is a label around its control.
    const card = (control: Locator) => page.locator('label', { has: control })
    const cards: [Locator, string][] = [
      [card(page.getByRole('checkbox', { name: 'Workshop: Vue in practice' })), interactive],
      ...(await card(page.getByRole('radio', { name: 'Card' })).all()).map(
        (checked) => [checked, interactive] as [Locator, string],
      ),
      [card(page.getByRole('radio', { name: 'Morning' })), danger],
    ]
    expect(cards).toHaveLength(4)
    // the border once its transition is over
    const border = (card: Locator) =>
      card.evaluate(async (element) => {
        await Promise.all(element.getAnimations().map((animation) => animation.finished))
        return getComputedStyle(element).borderTopColor
      })
    for (const [card, color] of cards) {
      expect(await border(card)).toBe(color)
      const control = card.getByRole('checkbox').or(card.getByRole('radio'))
      await control.focus()
      expect(await control.evaluate((element) => element.matches(':focus-visible'))).toBe(true)
      expect(await border(card)).toBe(color)
    }
  })

  test('a checkbox and a radio group answer the keyboard', async ({ page }) => {
    const news = page.getByRole('checkbox', { name: 'Send me news' }).first()
    await news.focus()
    await page.keyboard.press('Space')
    await expect(news).toBeChecked()

    const payment = page.locator('#radio-group').getByRole('radiogroup').first()
    await payment.getByRole('radio', { name: 'Card' }).focus()
    // An arrow moves to the next option and checks it while the key is down, as a hand presses it.
    await page.keyboard.down('ArrowDown')
    await expect(payment.getByRole('radio', { name: 'Bank transfer' })).toBeChecked()
    await page.keyboard.up('ArrowDown')
    await expect(payment.getByRole('radio', { name: 'Bank transfer' })).toBeFocused()
  })

  test('the number of a tab opens it, and the keys stay on there', async ({ page }) => {
    await page.keyboard.press('2')
    await expect(page).toHaveURL(/\/dark$/)
    await expect(page.getByRole('switch', { name: 'Shortcut keys' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    await expect(page.getByRole('button', { name: 'Switch theme', exact: true })).toBeVisible()

    await page.keyboard.press('1')
    await expect(page).toHaveURL(/\/$/)
    await waitForApp(page)
    await expect(page.getByRole('switch', { name: 'Shortcut keys' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
  })

  test('a page that forces its theme disables the theme switch, and t changes nothing', async ({
    page,
  }) => {
    const hint = page.getByRole('button', { name: 'Switch theme', exact: true })
    const stored = () =>
      page.evaluate((key) => localStorage.getItem(key), COLOR_MODE_STORAGE_KEY.nuxt)
    const boxes = () =>
      Promise.all([hint, themeSwitch(page, 'nuxt')].map((control) => control.boundingBox()))
    await colorModeOption(page, 'dark').click()
    await expect.poll(stored).toBe('dark')
    const gallery = await boxes()

    await page.keyboard.press('2')
    await expect(page).toHaveURL(/\/dark$/)
    await expect(hint).toBeDisabled()
    await expect(themeSwitch(page, 'nuxt')).toBeDisabled()
    // in the same places as on the gallery
    expect(await boxes()).toEqual(gallery)
    await page.keyboard.press('t')

    // back in the gallery the choice is the one made there, and the switch works again
    await page.keyboard.press('1')
    await expect(page).toHaveURL(/\/$/)
    await waitForApp(page)
    await expect(colorModeOption(page, 'dark')).toBeChecked()
    expect(await stored()).toBe('dark')
    await expect(themeSwitch(page, 'nuxt')).toBeEnabled()
  })
})
