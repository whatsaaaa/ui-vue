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

/** The contrast of two painted colors, each as "r g b", by WCAG's formula. */
function contrast(one: string, other: string): number {
  const luminance = (color: string) => {
    const [r, g, b] = color
      .split(' ')
      .map((channel) => Number(channel) / 255)
      .map((channel) => (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4))
    return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!
  }
  const [lighter, darker] = [luminance(one), luminance(other)].sort((a, b) => b - a)
  return (lighter! + 0.05) / (darker! + 0.05)
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
 * The room around a row's content, where no text is in the way: a column of pixels of a cell
 * between the pinned ones, which scrolls, and of the row's first and last cell, both pinned, and
 * a row of pixels over the content, clear of the ring's lines above and below.
 */
function room(at: Awaited<ReturnType<typeof measure>>) {
  const starts = at.cells.filter((cell) => cell.pinned === 'left')
  const end = at.cells.find((cell) => cell.pinned === 'right')!
  return {
    between: starts.at(-1)!.right + 2,
    first: starts[0]!.left + 4,
    last: end.right - 4,
    inside: at.top + 6,
  }
}

/**
 * The colors painted where a row's ring is, when it has one: on its lines above and below, over a
 * cell that scrolls and over each pinned one, and down both of its ends. The row's first and last
 * pixels are left out: the line between two rows may be there, and the corners of a row that has
 * the focus itself, which the browser rounds. With them, the row's fill.
 */
async function ringColors(page: Page, row: Locator): Promise<{ fill: string; ring: string[] }> {
  const at = await measure(row)
  const { between, first, last, inside } = room(at)
  // the second pixel of the line above, and the first of the line below
  const [above, below] = [at.top + 1, at.bottom - 2]
  const down = (x: number) =>
    Array.from({ length: below - above + 1 }, (_, offset) => ({ x, y: above + offset }))
  const [fill, ...ring] = await painted(page, [
    { x: between, y: inside },
    ...[between, first, last].flatMap((x) => [
      { x, y: above },
      { x, y: below },
    ]),
    ...[at.shownLeft, at.shownLeft + 1, at.shownRight - 1, at.shownRight - 2].flatMap(down),
  ])
  return { fill: fill!, ring: [...new Set(ring)] }
}

/**
 * The ring of a row is whole: over each pinned cell its lines above and below are painted as
 * over a cell that is not pinned, and it ends at both ends of what the table shows of the row.
 */
async function expectWholeRing(page: Page, row: Locator): Promise<void> {
  const at = await measure(row)
  const { between, first, last, inside } = room(at)
  // a column of pixels that crosses the row's edge: the line between the rows, then the ring
  const across = (x: number, edge: number) =>
    [-2, -1, 0, 1, 2, 3].map((offset) => ({ x, y: edge + offset }))
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
  // the ring where no cell is pinned: two pixels inside the row, in a color that reads on its
  // fill, at the WCAG's 3:1 for a part of the interface
  const ring = scrolling[2]!
  expect(contrast(ring, fill), 'the row is ringed').toBeGreaterThanOrEqual(3)
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

/**
 * A pinned cell between a ringed row's first and last: the ring's lines show above and below it
 * as over a cell that scrolls, and it draws no end of the ring. Over its content it is one color
 * from side to side, a pixel in from its edges.
 */
async function expectNoEndBetween(page: Page, row: Locator): Promise<void> {
  const at = await measure(row)
  const { between, inside } = room(at)
  const cell = at.cells.filter((cell) => cell.pinned === 'left')[1]!
  // the second pixel of the line above, and the first of the line below
  const lines = (x: number) => [
    { x, y: at.top + 1 },
    { x, y: at.bottom - 2 },
  ]
  const colors = await painted(page, [
    ...lines(between),
    ...lines(cell.left + 4),
    ...Array.from({ length: cell.right - cell.left - 2 }, (_, offset) => ({
      x: cell.left + 1 + offset,
      y: inside,
    })),
  ])
  expect(colors.slice(2, 4), "the ring's lines over the cell").toEqual(colors.slice(0, 2))
  expect([...new Set(colors.slice(4))], 'the cell draws no end of the ring').toHaveLength(1)
}

/**
 * The ring of a row that has the focus itself: its lines and both of its ends are one color,
 * which reads on the row's fill, at the WCAG's 3:1 for a part of the interface.
 */
async function expectOneRing(page: Page, row: Locator): Promise<void> {
  const { fill, ring } = await ringColors(page, row)
  expect(ring, 'the lines and both ends are one color').toHaveLength(1)
  expect(contrast(ring[0]!, fill), 'the ring reads on the row').toBeGreaterThanOrEqual(3)
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

      // the second row, without the focus, has no ring, and its pinned cells draw none: where a
      // ring would be, the row is its fill alone
      const row = table.locator('tbody tr').nth(1)
      const rest = await ringColors(page, row)
      expect(rest.ring, 'a row without the focus has no ring').toEqual([rest.fill])

      // and the focus of the keyboard, on that row
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
    })

    test("a row that is a stop itself is ringed over its pinned cells, the ends in its lines' color", async ({
      page,
    }, testInfo) => {
      test.skip(playground(testInfo) !== 'nuxt', 'The tables are in the gallery')
      await open(page)
      const table = page.getByTestId('table-pinned')
      await table.scrollIntoViewIfNeeded()
      // what Nuxt UI puts on each row of a table with a handler for its rows, such as @select
      await table.locator('tbody tr').evaluateAll((rows: HTMLElement[]) => {
        for (const row of rows) {
          row.dataset.selectable = 'true'
          row.tabIndex = 0
        }
      })
      const row = table.locator('tbody tr').nth(1)
      await table.getByRole('button', { name: 'Edit Maya Collins' }).focus()
      await page.keyboard.press('Tab')
      await expect(row).toBeFocused()
      await expect(row).toHaveCSS('outline-style', 'solid')
      // in forced colors the browser draws the outline of what has the focus in a color of its
      // own, not in the text color
      await expectOneRing(page, row)

      // once chosen, by its checkbox, and with the focus again: in forced colors the browser's
      // color for the outline is the color of the chosen row's fill
      await page.keyboard.press('Tab')
      await page.keyboard.press('Space')
      await expect(row).toHaveAttribute('data-selected', 'true')
      await page.keyboard.press('Shift+Tab')
      await expect(row).toBeFocused()
      await expectOneRing(page, row)
    })

    test("a pinned cell between a ringed row's first and last shows the ring's lines, and draws no end of it", async ({
      page,
    }, testInfo) => {
      test.skip(playground(testInfo) !== 'nuxt', 'The tables are in the gallery')
      await open(page)
      const table = page.getByTestId('table-pinned')
      await table.scrollIntoViewIfNeeded()
      // The gallery pins one column at each end: a third would leave its narrowest page no room
      // for the columns that scroll. So a second column is pinned at the start here, with what
      // Nuxt UI gives its cells: the classes of a pinned cell, and its place after the first.
      await table.locator('tbody tr').evaluateAll((rows: HTMLTableRowElement[]) => {
        for (const row of rows) {
          const [first, second] = [...row.cells]
          second!.className = first!.className
          second!.dataset.pinned = 'left'
          second!.style.left = `${first!.getBoundingClientRect().width}px`
        }
      })
      const row = table.locator('tbody tr').nth(1)
      await table.getByRole('button', { name: 'Edit Maya Collins' }).focus()
      await page.keyboard.press('Tab')
      await expect(row.getByRole('checkbox', { name: 'Choose Daniel Brooks' })).toBeFocused()
      await expect(row).toHaveCSS('outline-style', 'solid')
      await expectWholeRing(page, row)
      await expectNoEndBetween(page, row)

      // with the columns scrolled to their end, under the pinned cells
      await table.evaluate((frame) => frame.scrollTo({ left: frame.scrollWidth }))
      await expectWholeRing(page, row)
      await expectNoEndBetween(page, row)
    })
  })
}
