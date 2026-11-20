import { expect, test, type Locator, type Page } from '@playwright/test'
import { open, playground } from './pages.ts'

/*
 * A table with pinned columns: a pinned cell is filled, to hide what scrolls under it, and lies
 * over its row, so the ring of a row with the focus has to show over it too. These read the ring
 * as the browser paints it, pixel by pixel, in both themes and in forced colors, where a fill
 * and an outline are not what the styles say.
 */

/** A point of the page, in CSS pixels. */
interface Point {
  x: number
  y: number
}

/** The colors the browser paints at points of the page, each as "r g b". */
async function painted(page: Page, points: Point[]): Promise<string[]> {
  const png = await page.screenshot({ animations: 'disabled', scale: 'css' })
  return page.evaluate(
    async ([png, points]) => {
      const bytes = Uint8Array.from(atob(png), (character) => character.charCodeAt(0))
      const image = await createImageBitmap(new Blob([bytes], { type: 'image/png' }))
      const canvas = new OffscreenCanvas(image.width, image.height).getContext('2d')!
      canvas.drawImage(image, 0, 0)
      return points.map(({ x, y }) => canvas.getImageData(x, y, 1, 1).data.slice(0, 3).join(' '))
    },
    [png.toString('base64'), points] as const,
  )
}

/** Where a row and its cells are in the page, and the part of the row its table shows. */
function measure(row: Locator) {
  return row.evaluate((row: HTMLTableRowElement) => {
    const frame = row.closest<HTMLElement>('[data-slot=root]')!
    const shown = frame.getBoundingClientRect()
    const box = (element: Element) => {
      const { left, right, top, bottom } = element.getBoundingClientRect()
      return {
        left: Math.round(left),
        right: Math.round(right),
        top: Math.round(top),
        bottom: Math.round(bottom),
      }
    }
    return {
      ...box(row),
      shownLeft: Math.round(shown.left) + frame.clientLeft,
      shownRight: Math.round(shown.left) + frame.clientLeft + frame.clientWidth,
      cells: [...row.cells].map((cell) => ({ pinned: cell.dataset.pinned, ...box(cell) })),
    }
  })
}

/**
 * The ring of a row is whole: over each pinned cell its lines above and below are painted as
 * over a cell that is not pinned, and it ends at both ends of what the table shows of the row.
 */
async function expectWholeRing(page: Page, row: Locator): Promise<void> {
  const at = await measure(row)
  const start = at.cells.find((cell) => cell.pinned === 'left')!
  const end = at.cells.find((cell) => cell.pinned === 'right')!
  // a column of pixels that crosses the row's edge: the line between the rows, then the ring
  const across = (x: number, edge: number) =>
    [-2, -1, 0, 1, 2, 3].map((offset) => ({ x, y: edge + offset }))
  // in the room around a cell's content, so no text is in the way: of a cell between the pinned
  // ones, which scrolls, and of each pinned one
  const [between, first, last] = [start.right + 2, start.left + 4, end.right - 4]
  // in the room over the content, clear of the ring's lines above and below
  const inside = at.top + 6
  // a column of pixels down an end of the ring, from the row's first pixel to its last
  const down = (x: number) =>
    Array.from({ length: at.bottom - at.top }, (_, offset) => ({ x, y: at.top + offset }))
  const points = [
    ...[between, first, last].flatMap((x) => [...across(x, at.top), ...across(x, at.bottom - 2)]),
    { x: between, y: inside },
    ...[0, 1, 2].map((offset) => ({ x: at.shownLeft + offset, y: inside })),
    ...[1, 2, 3].map((offset) => ({ x: at.shownRight - offset, y: inside })),
    ...down(at.shownLeft),
    ...down(at.shownLeft + 1),
    ...down(at.shownRight - 1),
    ...down(at.shownRight - 2),
  ]
  const colors = await painted(page, points)
  const strip = (from: number) => colors.slice(from, from + 12)
  const [scrolling, pinnedFirst, pinnedLast] = [strip(0), strip(12), strip(24)]
  const fill = colors[36]!
  // the ring where no cell is pinned: two pixels inside the row, in a color other than its fill
  const ring = scrolling[2]!
  expect(ring, 'the row is ringed').not.toBe(fill)
  expect(scrolling.slice(2, 4), 'the ring is two pixels wide').toEqual([ring, ring])
  // Which pixels are the ring's. A pinned cell's fill is not compared: in forced colors the
  // browser may paint a chosen row's, the system's Highlight, see-through, and a pinned cell's
  // lies over its row's.
  const ringed = (colors: string[]) => colors.map((color) => color === ring)
  expect(ringed(pinnedFirst), 'the ring over the cell pinned at the start').toEqual(
    ringed(scrolling),
  )
  expect(ringed(pinnedLast), 'the ring over the cell pinned at the end').toEqual(ringed(scrolling))
  // each end is two pixels wide, and unbroken from the line above to the line below
  expect(ringed(colors.slice(37, 40)), "the ring's start").toEqual([true, true, false])
  expect(ringed(colors.slice(40, 43)), "the ring's end").toEqual([true, true, false])
  expect(new Set(colors.slice(43)), 'the ends are whole').toEqual(new Set([ring]))
}

const systems = [
  { name: 'on a dark system', use: { colorScheme: 'dark' } },
  { name: 'on a light system', use: { colorScheme: 'light' } },
  { name: 'in forced colors', use: { colorScheme: 'dark', forcedColors: 'active' } },
] as const

for (const { name, use } of systems) {
  test.describe(name, () => {
    test.use(use)

    test("a row's focus ring shows over its pinned cells, as the columns scroll under them", async ({
      page,
    }, testInfo) => {
      test.skip(playground(testInfo) !== 'nuxt', 'The tables are in the gallery')
      await open(page)
      const table = page.getByTestId('table-pinned')
      await table.scrollIntoViewIfNeeded()
      // narrower than its columns: they scroll under the pinned ones
      expect(
        await table.evaluate((frame) => frame.scrollWidth - frame.clientWidth),
      ).toBeGreaterThan(0)

      // the focus the gallery draws on the first row
      const shown = table.locator('tbody tr').first()
      await expectWholeRing(page, shown)

      // and the focus of the keyboard, on the second row
      const row = table.locator('tbody tr').nth(1)
      const checkbox = row.getByRole('checkbox', { name: 'Choose Daniel Brooks' })
      await table.getByRole('button', { name: 'Edit Maya Collins' }).focus()
      await page.keyboard.press('Tab')
      await expect(checkbox).toBeFocused()
      await expect(row).toHaveCSS('outline-style', 'solid')
      await expectWholeRing(page, row)

      // with the columns scrolled to their end, under the cell pinned at the start
      await table.evaluate((frame) => frame.scrollTo({ left: frame.scrollWidth }))
      await expectWholeRing(page, row)

      // once chosen, on the row's selection color
      await page.keyboard.press('Space')
      await expect(row).toHaveAttribute('data-selected', 'true')
      await expectWholeRing(page, row)

      // a row without the focus has no ring, and its pinned cells draw none
      const other = table.locator('tbody tr').nth(2)
      const [x, y] = await measure(other).then((at) => [at.cells[0]!.left + 4, at.top + 6])
      const column = Array.from({ length: 30 }, (_, down) => ({ x: x!, y: y! - 6 + down }))
      const colors = await painted(page, [{ x: x!, y: y! }, ...column])
      // from under the line between the rows down, the cell is its fill alone
      expect(new Set(colors.slice(3))).toEqual(new Set([colors[0]]))
    })
  })
}
