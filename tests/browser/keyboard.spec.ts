import { expect, test, type Page } from '@playwright/test'
import { open, playground, resolveColor } from './pages.ts'

/**
 * The ring of the element with the focus: the design system's is two pixels of interactive.
 * A control drawn as a card, such as a checkbox card, draws it on the card around it.
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
    return {
      element: `${element.tagName.toLowerCase()} ${element.getAttribute('aria-label') ?? element.textContent?.trim().slice(0, 30) ?? ''}`,
      style: style.outlineStyle,
      width: parseFloat(style.outlineWidth),
      color: style.outlineColor,
    }
  })
}

test('every control the Tab key reaches shows the focus ring', async ({ page }) => {
  await open(page)
  const interactive = await resolveColor(page, 'var(--ws-color-interactive)')
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
    expect(ring.color, `${ring.element} has a ring in the interactive color`).toBe(interactive)
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
})
