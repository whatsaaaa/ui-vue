import { expect, test, type Locator, type Page } from '@playwright/test'
import {
  COLOR_MODE_STORAGE_KEY,
  colorModeOption,
  open,
  playground,
  resolveColor,
  themeKey,
  themeSwitch,
  waitForApp,
  waitForPage,
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

/** How many stops the Tab key may make before the focus comes round: the gallery has some 500. */
const MAX_STOPS = 800

test('every control the Tab key reaches shows the focus ring', async ({ page }) => {
  // a stop takes a reading of the page
  test.slow()
  await open(page)
  const seen = new Set<string>()
  let stops = 0
  // Tab through the whole page, until the focus comes round to where it started.
  for (; stops < MAX_STOPS; stops++) {
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
  expect(stops).toBeLessThan(MAX_STOPS)
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
    // the search at the top of the list
    await expect(page.locator('[data-slot=content]').getByRole('combobox')).toBeFocused()
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

  test("the example of a tab with the focus rings one tab, with the ring of a tab's own focus", async ({
    page,
  }) => {
    const tabs = page.locator('[data-spec="tabs.link.focus"]').getByRole('tab')
    const ring = (tab: Locator) =>
      tab.evaluate((tab) => {
        const { outlineStyle, outlineWidth, outlineColor, outlineOffset } = getComputedStyle(tab)
        return { outlineStyle, outlineWidth, outlineColor, outlineOffset }
      })
    await expect(tabs).toHaveCount(2)
    const shown = await ring(tabs.first())
    expect(shown.outlineStyle).toBe('solid')
    expect((await ring(tabs.last())).outlineStyle).toBe('none')
    // the other tab, once the keyboard is on it, is ringed as the example shows
    await tabs.last().focus()
    expect(await ring(tabs.last())).toEqual(shown)
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
    const table = page.getByTestId('table-action')
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

  test('a number field steps with its arrow keys, and its step buttons are no stops of the Tab key', async ({
    page,
  }) => {
    const section = page.locator('#input-number')
    const tickets = section.getByRole('spinbutton').first()
    await tickets.focus()
    await page.keyboard.press('ArrowUp')
    await expect(tickets).toHaveValue('3')
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowDown')
    await expect(tickets).toHaveValue('1')
    // At the minimum the decrement is disabled, and the increment still steps.
    await expect(section.getByRole('button', { name: 'Decrease Tickets' }).first()).toBeDisabled()
    await expect(section.getByRole('button', { name: 'Increase Tickets' }).first()).toBeEnabled()
    // Tab goes on to the next field, past both buttons.
    await page.keyboard.press('Tab')
    await expect(section.getByRole('spinbutton').nth(1)).toBeFocused()
  })

  test('the number of a tab opens it, and the keys stay on there', async ({ page }) => {
    await page.keyboard.press('2')
    await waitForPage(page, /\/dark$/)
    await expect(page.getByRole('switch', { name: 'Shortcut keys' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    await expect(themeKey(page)).toBeVisible()

    await page.keyboard.press('1')
    await waitForPage(page, /\/$/)
    await waitForApp(page)
    await expect(page.getByRole('switch', { name: 'Shortcut keys' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
  })

  test('the status line names its controls by what they show, and the theme switch keeps the focus', async ({
    page,
  }) => {
    // a name that holds what the control shows, so speech input can press it by what is read
    const hint = themeKey(page)
    await expect(hint).toBeVisible()
    expect(await hint.getAttribute('aria-label')).toBeNull()

    // one button holds both themes' names, so it is still there once the theme has changed
    const control = themeSwitch(page, 'nuxt')
    await expect(control).toHaveCount(1)
    await expect(control).toHaveAccessibleName('Switch theme, now rose-pine')
    await control.focus()
    await page.keyboard.press('Enter')
    await expect(colorModeOption(page, 'light')).toBeChecked()
    await expect(control).toHaveAccessibleName('Switch theme, now rose-pine-dawn')
    await expect(control).toBeFocused()
  })

  test('a page that forces its theme disables the theme switch, and t changes nothing', async ({
    page,
  }) => {
    const hint = themeKey(page)
    const stored = () =>
      page.evaluate((key) => localStorage.getItem(key), COLOR_MODE_STORAGE_KEY.nuxt)
    const boxes = () =>
      Promise.all([hint, themeSwitch(page, 'nuxt')].map((control) => control.boundingBox()))
    await colorModeOption(page, 'dark').click()
    await expect.poll(stored).toBe('dark')
    const gallery = await boxes()

    await page.keyboard.press('2')
    await waitForPage(page, /\/dark$/)
    await expect(hint).toBeDisabled()
    await expect(themeSwitch(page, 'nuxt')).toBeDisabled()
    // in the same places as on the gallery
    expect(await boxes()).toEqual(gallery)
    await page.keyboard.press('t')

    // back in the gallery the choice is the one made there, and the switch works again
    await page.keyboard.press('1')
    await waitForPage(page, /\/$/)
    await waitForApp(page)
    await expect(colorModeOption(page, 'dark')).toBeChecked()
    expect(await stored()).toBe('dark')
    await expect(themeSwitch(page, 'nuxt')).toBeEnabled()
  })
})

test.describe('the page of the others', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(playground(testInfo) !== 'nuxt', 'The page of the others is in the gallery')
    await open(page, '/others')
  })

  test('each search opens alone, from the keys its button shows', async ({ page }) => {
    const windows = page.locator('[role=dialog]:not([inert] *)').filter({ visible: true })
    for (const [search, item] of [
      ['UDashboardSearch', 'Registrations'],
      ['UContentSearch', 'Install'],
    ] as const) {
      // as the key caps read: Ctrl, or ⌘ on a Mac, and a letter
      const keys = await page.getByTestId(`open-${search}`).locator('kbd').allInnerTexts()
      await page.keyboard.press(
        keys
          .map((key) => key.trim().toLowerCase())
          .map((key) => ({ ctrl: 'Control', '⌘': 'Meta' })[key] ?? key)
          .join('+'),
      )
      await expect(windows).toHaveCount(1)
      await expect(windows).toContainText(item)
      await page.keyboard.press('Escape')
      await expect(windows).toHaveCount(0)
    }
  })
})
