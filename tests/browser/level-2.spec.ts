import { AxeBuilder } from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { type ComponentLevels, components } from '../../packages/ui-vue/levels.ts'
import { alike, openWithSystemColors } from './forced.ts'
import { open, playground } from './pages.ts'

/*
 * Level 2 of packages/ui-vue/levels.ts, as tests over the gallery, for every component at level 2
 * today: it has a section of the gallery with its kinds, sizes and states, axe finds nothing on
 * it in either theme, in forced colors an example that is checked, current or selected is painted
 * unlike one at rest, and where it has keys, they work. The stored screenshot of its section is
 * visual.spec.ts's, which takes one of every section, and the test over its theme is
 * tests/level-2.test.ts. A component reaches level 2 by its entry in the levels file, its theme
 * and its section: the tests here follow the file.
 */

const entries = Object.entries(components) as [string, ComponentLevels][]
const levelTwo = entries.filter(([, { today }]) => today === 2).map(([name]) => name)

/** The section of the gallery a component has, by the name of its theme: #pin-input. */
const sectionOf = (name: string) =>
  `#${name
    .slice(1)
    .replaceAll(/(?<!^)([A-Z])/g, '-$1')
    .toLowerCase()}`

/** The pages that show a component's sections: the gallery, and the one of open lists. */
const PAGES = ['/', '/open']

test.beforeEach(() => {
  test.skip(playground(test.info()) !== 'nuxt', 'The gallery is the Nuxt playground')
})

test('the levels file has components at level 2', () => {
  expect(levelTwo.length).toBeGreaterThan(0)
})

test('the gallery has a section of each component at level 2, with a row of its states and one of its sizes', async ({
  page,
}) => {
  await open(page)
  const rows = await page.evaluate(
    (ids) =>
      Object.fromEntries(
        ids.map((id) => [
          id,
          [...(document.querySelector(id)?.querySelectorAll('h3') ?? [])].map(
            (heading) => heading.textContent?.trim() ?? '',
          ),
        ]),
      ),
    levelTwo.map(sectionOf),
  )
  for (const name of levelTwo)
    expect(rows[sectionOf(name)], name).toEqual(expect.arrayContaining(['states', 'sizes']))
})

for (const theme of ['dark', 'light'] as const) {
  test.describe(`in the ${theme} theme`, () => {
    test.use({ colorScheme: theme })

    for (const path of PAGES)
      test(`axe finds nothing on the sections of the components at level 2, on ${path}`, async ({
        page,
      }) => {
        await open(page, path)
        // the window grows with its content, as on a phone: axe takes what it scrolls out of
        // view for hidden. An open list held in place is checked as it would be open in an app.
        await page.addStyleTag({
          content:
            '.window { height: auto !important } .window__main { overflow: visible !important }',
        })
        await page
          .locator('.gallery-open')
          .evaluateAll((held) => held.forEach((open) => open.removeAttribute('inert')))
        const sections = levelTwo.map(sectionOf)
        const shown = await page.evaluate(
          (ids) => ids.filter((id) => document.querySelector(id)),
          sections,
        )
        if (path === '/') expect(shown).toEqual(sections)
        for (const section of shown) {
          const { violations } = await new AxeBuilder({ page }).include(section).analyze()
          const found = await page.evaluate(
            (violations) =>
              violations.flatMap(({ id, nodes }) =>
                nodes
                  .map(({ target }) => String(target.at(-1)))
                  // the text of a disabled control or option, which WCAG leaves out of contrast
                  .filter(
                    (selector) =>
                      id !== 'color-contrast' ||
                      !document
                        .querySelector(selector)
                        ?.closest(':disabled, [aria-disabled=true], [data-disabled]'),
                  )
                  .map((selector) => `${id}: ${selector}`),
              ),
            violations.map(({ id, nodes }) => ({
              id,
              nodes: nodes.map(({ target }) => ({ target: target.map(String) })),
            })),
          )
          expect(found, section).toEqual([])
        }
      })
  })

  test.describe(`in forced colors, on a ${theme} system`, () => {
    test.use({ colorScheme: theme, forcedColors: 'active' })

    for (const path of PAGES)
      test(`an example that is checked, current or selected is painted unlike one at rest, on ${path}`, async ({
        page,
      }) => {
        await openWithSystemColors(page, path)
        const pairs = await statePairs(page, levelTwo.map(sectionOf))
        if (path === '/') expect(pairs.length).toBeGreaterThan(0)
        const alikePairs: string[] = []
        for (const { name, on, off } of pairs) {
          const [one, other] = [on, off].map((mark) => page.locator(`[data-level-state="${mark}"]`))
          if (await alike(page, one!, other!)) alikePairs.push(name)
        }
        expect(alikePairs).toEqual([])
      })
  })
}

/**
 * Pairs each part of the sections given that is checked, current or selected with one of its
 * kind at rest, of the same size: a tag the arrow keys are on, a chosen option of an open list.
 * Where their words differ, as two options' do, the words of both are hidden, so that only the
 * state can differ. Each is marked by data-level-state.
 */
function statePairs(page: Page, sections: string[]) {
  return page.evaluate((sections) => {
    const states = [
      ['aria-checked', 'true'],
      ['aria-pressed', 'true'],
      ['aria-selected', 'true'],
      ['aria-current', 'true'],
      ['data-state', 'active'],
    ] as const
    const kindOf = (part: Element) =>
      part.getAttribute('role') ?? (part as HTMLElement).dataset.slot ?? part.localName
    const sizeOf = (part: Element) => {
      const { width, height } = part.getBoundingClientRect()
      return `${Math.round(width)} ${Math.round(height)}`
    }
    const words = (part: Element) =>
      part.querySelector<HTMLElement>(
        '[data-slot=itemLabel], [data-slot=itemText], [data-slot=tagsItemText]',
      )
    const pairs: { name: string; on: string; off: string }[] = []
    let count = 0
    for (const marked of document.querySelectorAll<HTMLElement>('[data-level-state]'))
      delete marked.dataset.levelState
    for (const id of sections)
      for (const section of document.querySelectorAll(id))
        for (const [attribute, value] of states) {
          const parts = [...section.querySelectorAll(`[${attribute}]`)].filter(
            (part) =>
              part.checkVisibility() &&
              !part.matches(':disabled, [data-disabled], [aria-disabled=true]'),
          )
          // each part in one pair at most
          const free = (part: Element) => !(part as HTMLElement).dataset.levelState
          for (const on of parts.filter((part) => part.getAttribute(attribute) === value)) {
            const off = parts.find(
              (part) =>
                free(part) &&
                part.getAttribute(attribute) !== value &&
                kindOf(part) === kindOf(on) &&
                sizeOf(part) === sizeOf(on),
            )
            if (!off || !free(on)) continue
            // words that differ are hidden in both, as the list reads its options' words
            if (off.textContent !== on.textContent)
              for (const part of [on, off]) {
                const label = words(part)
                if (label) label.style.opacity = '0'
              }
            ;(on as HTMLElement).dataset.levelState = `${++count}-on`
            ;(off as HTMLElement).dataset.levelState = `${count}-off`
            pairs.push({
              name: `${id} ${kindOf(on)} ${attribute}=${value}`,
              on: `${count}-on`,
              off: `${count}-off`,
            })
          }
        }
    return pairs
  }, sections)
}

/**
 * The keys of each component at level 2, tested on its first example in the gallery, or none:
 * a component that only lays out others has no keys of its own.
 */
const keys: Record<string, ((page: Page) => Promise<void>) | 'none'> = {
  UFieldGroup: 'none',

  async UPinInput(page) {
    const cells = page.getByTestId('pin-input').locator('input')
    await cells.nth(2).focus()
    // a character fills the cell and moves to the next one
    await page.keyboard.type('7')
    await expect(cells.nth(2)).toHaveValue('7')
    await expect(cells.nth(3)).toBeFocused()
    await page.keyboard.type('1')
    await expect(cells.nth(3)).toHaveValue('1')
    // Backspace empties the cell, and moves back from an empty one
    await page.keyboard.press('Backspace')
    await expect(cells.nth(3)).toHaveValue('')
    await page.keyboard.press('Backspace')
    await expect(cells.nth(2)).toBeFocused()
    // the arrows move from cell to cell
    await page.keyboard.press('ArrowLeft')
    await expect(cells.nth(1)).toBeFocused()
  },

  async UInputTags(page) {
    const input = page.getByTestId('input-tags')
    const tags = page.locator('#input-tags [data-slot=root]').first().locator('[data-slot=item]')
    await expect(tags).toHaveText(['Forms', 'Accessibility'])
    await input.focus()
    // Enter adds what is typed as a tag
    await page.keyboard.type('Tooling')
    await page.keyboard.press('Enter')
    await expect(tags).toHaveText(['Forms', 'Accessibility', 'Tooling'])
    // the arrow keys move onto the tags, and Backspace takes out the one they are on
    await page.keyboard.press('ArrowLeft')
    await expect(tags.last()).toHaveAttribute('data-state', 'active')
    await page.keyboard.press('ArrowLeft')
    await expect(tags.nth(1)).toHaveAttribute('data-state', 'active')
    await page.keyboard.press('Backspace')
    await expect(tags).toHaveText(['Forms', 'Tooling'])
  },

  async UInputMenu(page) {
    const input = page.getByTestId('input-menu')
    await input.focus()
    await page.keyboard.press('ControlOrMeta+a')
    // typing opens the list on the cities it finds, and Enter chooses the one highlighted
    await page.keyboard.type('Sub')
    await expect(page.getByRole('option')).toHaveText(['Subotica'])
    await page.keyboard.press('Enter')
    await expect(page.getByRole('listbox')).toBeHidden()
    await expect(input).toHaveValue('Subotica')
    // the arrow keys open it and move through it, and Escape closes it as it was
    await page.keyboard.press('ArrowDown')
    await expect(page.getByRole('listbox')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('listbox')).toBeHidden()
    await expect(input).toHaveValue('Subotica')
  },

  async UInputDate(page) {
    const segments = page.getByTestId('input-date').getByRole('spinbutton')
    await expect(segments).toHaveText(['5', '10', '2027'])
    await segments.first().focus()
    // the arrows up and down change the segment with the focus, left and right move between them
    await page.keyboard.press('ArrowUp')
    await page.keyboard.press('ArrowRight')
    await expect(segments.nth(1)).toBeFocused()
    await page.keyboard.press('ArrowDown')
    await expect(segments).toHaveText(['6', '9', '2027'])
    // figures typed fill a segment and move on to the next
    await page.keyboard.type('12')
    await expect(segments.nth(1)).toHaveText('12')
    await expect(segments.nth(2)).toBeFocused()
  },

  async UInputTime(page) {
    const segments = page.getByTestId('input-time').getByRole('spinbutton')
    await expect(segments).toHaveText(['9', '30', 'AM'])
    await segments.first().focus()
    await page.keyboard.press('ArrowUp')
    await page.keyboard.press('ArrowRight')
    await expect(segments.nth(1)).toBeFocused()
    await page.keyboard.press('ArrowDown')
    await expect(segments).toHaveText(['10', '29', 'AM'])
  },

  async UFileUpload(page) {
    // the area is a button: Enter and Space open the browser's file chooser
    const area = page.locator('#file-upload [role=button]').first()
    await area.focus()
    await expect(area).toBeFocused()
    for (const key of ['Enter', 'Space']) {
      const chooser = page.waitForEvent('filechooser')
      await page.keyboard.press(key)
      // closed with no file, so that the next can open
      await (await chooser).setFiles([])
    }
  },
}

test('every component at level 2 has a test of its keys, or has none of its own', () => {
  expect(Object.keys(keys).sort()).toEqual([...levelTwo].sort())
})

for (const [name, run] of Object.entries(keys))
  if (run !== 'none')
    test(`${name} answers the keyboard`, async ({ page }) => {
      test.skip(!levelTwo.includes(name), `${name} is not at level 2`)
      await open(page)
      await run(page)
    })
