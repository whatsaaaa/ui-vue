import { expect, test, type Locator, type Page } from '@playwright/test'
import { edges, icons, openWithSystemColors } from './forced.ts'
import { playground, waitForNoFindings } from './pages.ts'

/*
 * The parts of the pages in forced colors that the theme draws again in the system's colors: a
 * field keeps the border it draws its edge with, a checked control and the current tab are in
 * the selection color. Every part with a ring keeps an edge and every icon is painted, which
 * forced.ts reads.
 */

/** What is wrong, one line for each part. */
type Findings = string[]

/**
 * Every field has an edge: a text field, and the trigger of a select or a select menu. A field
 * draws it as a border, not a ring, so the parts with a ring leave it out.
 */
function fieldEdges(within: Locator): Promise<Findings> {
  return within.evaluate((root) => {
    const findings: string[] = []
    const fields = root.querySelectorAll<HTMLElement>(
      'input:not([type=checkbox], [type=radio], [type=hidden]), button[role=combobox], button[aria-haspopup=listbox]',
    )
    for (const field of fields) {
      const box = field.getBoundingClientRect()
      if (box.width <= 2 || box.height <= 2 || !field.checkVisibility({ opacityProperty: true }))
        continue
      if (!window.hasBorder(field)) {
        const style = getComputedStyle(field)
        findings.push(
          `${field.localName} ${field.id}: border ${style.borderWidth} ${style.borderStyle} ${style.borderColor}`,
        )
      }
    }
    return findings
  })
}

/**
 * A checkbox or a radio that is checked, or a checkbox that is indeterminate, is filled with the
 * selection color, gray when it is disabled, its mark in the selection's text color, the page
 * color when it is disabled. One that is not has no fill. A card without its control shows the
 * state by its border, in the selection color.
 */
function checked(page: Page): Promise<Findings> {
  return page.evaluate(() => {
    const findings: string[] = []
    for (const control of document.querySelectorAll<HTMLElement>('[role=checkbox], [role=radio]')) {
      if (!control.checkVisibility()) continue
      const disabled = control.hasAttribute('disabled')
      const label = `${control.getAttribute('role')} ${control.id} ${control.dataset.state}${disabled ? ', disabled' : ''}`
      const on = ['checked', 'indeterminate'].includes(control.dataset.state ?? '')
      const highlight = window.systemColor(control, 'Highlight')

      // a control that is not shown, as sr-only hides it: clipped away, whatever its size
      if (getComputedStyle(control).clipPath === 'inset(50%)') {
        const card = control.closest<HTMLElement>('[data-slot=root], [data-slot=item]')!
        const border = getComputedStyle(card).borderTopColor
        if ((border === highlight) !== on) findings.push(`${label}: the card's border is ${border}`)
        continue
      }

      const indicator = control.querySelector<HTMLElement>('[data-slot=indicator]')
      const fill = indicator && getComputedStyle(indicator).backgroundColor
      if (!on) {
        if (fill && fill !== 'rgba(0, 0, 0, 0)' && fill !== window.systemColor(control, 'Canvas'))
          findings.push(`${label}: filled ${fill}`)
        continue
      }
      if (fill !== (disabled ? window.systemColor(control, 'GrayText') : highlight))
        findings.push(`${label}: filled ${fill}`)
      // the mark, a checkbox's icon or a radio's dot, in the fill's text color
      const icon = indicator?.querySelector('[data-slot=icon]')
      const mark = !icon
        ? getComputedStyle(indicator!, '::after').backgroundColor
        : icon instanceof SVGElement
          ? getComputedStyle(icon).color
          : getComputedStyle(icon).backgroundColor
      if (mark !== window.systemColor(control, disabled ? 'Canvas' : 'HighlightText'))
        findings.push(`${label}: its mark is ${mark}`)
    }
    return findings
  })
}

/**
 * Every row of tabs marks its current tab in the selection color, over the tab: a pill's outline
 * or a link's line.
 */
function currentTabs(page: Page): Promise<Findings> {
  return page.evaluate(() => {
    const findings: string[] = []
    for (const list of document.querySelectorAll<HTMLElement>('[role=tablist]')) {
      if (!list.checkVisibility()) continue
      const current = list.querySelector<HTMLElement>('[role=tab][data-state=active]')
      const indicator = list.querySelector<HTMLElement>('[data-slot=indicator]')
      const label = `the tabs of ${current?.innerText}`
      if (!current || !indicator) {
        findings.push(`${label}: no current tab or no indicator`)
        continue
      }
      const style = getComputedStyle(indicator)
      const highlight = window.systemColor(indicator, 'Highlight')
      if (![style.backgroundColor, style.borderTopColor].includes(highlight))
        findings.push(
          `${label}: the indicator is ${style.backgroundColor}, ${style.borderTopColor}`,
        )
      const tab = current.getBoundingClientRect()
      const marker = indicator.getBoundingClientRect()
      const over =
        list.getAttribute('aria-orientation') === 'vertical'
          ? Math.abs(marker.top - tab.top) < 2 && Math.abs(marker.height - tab.height) < 2
          : Math.abs(marker.left - tab.left) < 2 && Math.abs(marker.width - tab.width) < 2
      if (!over) findings.push(`${label}: the indicator is not over the current tab`)
    }
    return findings
  })
}

/**
 * The contrast of a text as the browser paints it, by WCAG's formula: between the lightest and
 * the darkest pixels inside the box of its characters, a pixel in from its edges. Forced colors
 * draw a backplate in the page color behind text; text in that color on it has none.
 */
async function paintedContrast(page: Page, text: Locator): Promise<number> {
  const box = await text.evaluate((element) => {
    const range = document.createRange()
    range.selectNodeContents(element)
    return range.getBoundingClientRect().toJSON() as DOMRect
  })
  const png = await page.screenshot({
    clip: { x: box.x + 1, y: box.y + 1, width: box.width - 2, height: box.height - 2 },
  })
  return page.evaluate(async (png) => {
    const bytes = Uint8Array.from(atob(png), (character) => character.charCodeAt(0))
    const image = await createImageBitmap(new Blob([bytes], { type: 'image/png' }))
    const canvas = new OffscreenCanvas(image.width, image.height).getContext('2d')!
    canvas.drawImage(image, 0, 0)
    const pixels = canvas.getImageData(0, 0, image.width, image.height).data
    const linear = (channel: number) =>
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
    let [lightest, darkest] = [0, 1]
    for (let i = 0; i < pixels.length; i += 4) {
      const [r, g, b] = [pixels[i]!, pixels[i + 1]!, pixels[i + 2]!].map((c) => linear(c / 255))
      const luminance = 0.2126 * r! + 0.7152 * g! + 0.0722 * b!
      lightest = Math.max(lightest, luminance)
      darkest = Math.min(darkest, luminance)
    }
    return (lightest + 0.05) / (darkest + 0.05)
  }, png.toString('base64'))
}

for (const colorScheme of ['dark', 'light'] as const) {
  test.describe(`in forced colors, on a ${colorScheme} system`, () => {
    test.use({ colorScheme, forcedColors: 'active' })

    test('every part with a ring and every field has an edge, and every icon is painted', async ({
      page,
    }) => {
      await openWithSystemColors(page)
      const body = page.locator('body')
      expect(await edges(body)).toEqual([])
      expect(await fieldEdges(body)).toEqual([])
      expect(await icons(body)).toEqual([])
    })

    test('a checked control and the current tab are in the selection color', async ({ page }) => {
      await openWithSystemColors(page)
      expect(await checked(page)).toEqual([])
      expect(await currentTabs(page)).toEqual([])
    })

    test('a chosen row of a table is in the selection colors, and its text reads on them', async ({
      page,
    }, testInfo) => {
      test.skip(playground(testInfo) !== 'nuxt', 'The tables are in the gallery')
      await openWithSystemColors(page)
      const row = page.locator('[data-spec="table.selectable.selected"] tbody tr').first()
      await row.scrollIntoViewIfNeeded()
      // the table spec's chosen row in forced colors: Highlight under HighlightText
      await expect(row).toHaveCSS(
        'background-color',
        await row.evaluate((row) => window.systemColor(row, 'Highlight')),
      )
      // the line under it in the text color, as under every other row, not in its HighlightText,
      // which is the page's color
      await expect(row).toHaveCSS(
        'border-block-end-color',
        await row.evaluate((row) => window.systemColor(row, 'CanvasText')),
      )
      // its fields and its status, a tag, at the WCAG's 4.5:1 for text
      for (const text of ['Maya Collins', 'Lisbon', 'All three days', '€420.00', 'paid'])
        expect(
          await paintedContrast(page, row.getByText(text, { exact: true })),
          `${text} reads on the row`,
        ).toBeGreaterThanOrEqual(4.5)

      // a row's action, a button, once its row is chosen
      const withAction = page.getByTestId('table-action').locator('tbody tr').first()
      const edit = withAction.getByRole('button', { name: 'Edit Maya Collins' })
      await withAction.getByRole('checkbox', { name: 'Choose Maya Collins' }).click()
      await expect(withAction).toHaveAttribute('data-selected', 'true')
      expect(await paintedContrast(page, edit), 'Edit reads on the row').toBeGreaterThanOrEqual(4.5)
    })

    test('two chosen rows together keep the line between them, in the selection colors', async ({
      page,
    }, testInfo) => {
      test.skip(playground(testInfo) !== 'nuxt', 'The tables are in the gallery')
      await openWithSystemColors(page)
      // the table spec's chosen row, and the row under it chosen too
      const rows = page.locator('[data-spec="table.selectable.selected"] tbody tr')
      const [first, second] = [rows.nth(0), rows.nth(1)]
      await second.getByRole('checkbox', { name: 'Choose Daniel Brooks' }).click()
      await expect(second).toHaveAttribute('data-selected', 'true')
      // the line between them on their Highlight, in its HighlightText, not in the text color,
      // which is near Highlight
      await expect(first).toHaveCSS(
        'border-block-end-color',
        await first.evaluate((row) => window.systemColor(row, 'HighlightText')),
      )
      // the line under the second, over a row that is not chosen, in the text color
      await expect(second).toHaveCSS(
        'border-block-end-color',
        await second.evaluate((row) => window.systemColor(row, 'CanvasText')),
      )
    })

    test('a card without its control shows it is checked, in an error and with the focus', async ({
      page,
    }, testInfo) => {
      test.skip(playground(testInfo) !== 'nuxt', 'The gallery has the cards with an error')
      await openWithSystemColors(page)
      // An option drawn as a card is a label around its control.
      const morning = page.getByRole('radio', { name: 'Morning' })
      const afternoon = page.getByRole('radio', { name: 'Afternoon' })

      await page.locator('label', { has: morning }).click()
      await expect(morning).toBeChecked()
      // once its colors have changed
      await waitForNoFindings(() => checked(page))

      // An arrow checks the next option while the key is down, as a hand presses it.
      await page.keyboard.down('ArrowRight')
      await expect(afternoon).toBeChecked()
      await page.keyboard.up('ArrowRight')
      expect(await afternoon.evaluate((element) => element.matches(':focus-visible'))).toBe(true)
      await waitForNoFindings(() => checked(page))
    })

    test('an open list and a modal have their edges, and the hovered option its own', async ({
      page,
    }, testInfo) => {
      test.skip(playground(testInfo) !== 'nuxt', 'The gallery has the modal and the menus')
      await openWithSystemColors(page)

      // a select, and a select menu, with its search
      for (const trigger of [
        page.locator('#select [role=combobox]').first(),
        page.getByTestId('select-menu'),
      ]) {
        await trigger.click()
        const list = page.locator('[data-slot=content]:is([role=listbox], :has([role=listbox]))')
        await expect(list).toHaveCount(1)
        await page.keyboard.press('ArrowDown')
        expect(await edges(list)).toEqual([])
        expect(await icons(list)).toEqual([])
        const hovered = list.locator('[role=option][data-highlighted]')
        await expect(hovered).toHaveCount(1)
        // once its colors have changed
        await expect
          .poll(() =>
            hovered.evaluate(
              (option) =>
                getComputedStyle(option, '::before').borderTopColor ===
                window.systemColor(option, 'Highlight'),
            ),
          )
          .toBe(true)
        await page.keyboard.press('Escape')
        await expect(list).toHaveCount(0)
      }

      await page.getByRole('button', { name: 'Edit registration' }).click()
      const modal = page.getByRole('dialog')
      await expect(modal).toBeVisible()
      expect(await edges(modal)).toEqual([])
      expect(await fieldEdges(modal)).toEqual([])
      expect(await icons(modal)).toEqual([])
      expect(await checked(page)).toEqual([])
    })
  })
}
