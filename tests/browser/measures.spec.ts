import { expect, test, type Locator, type Page } from '@playwright/test'
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

/** A field of the gallery, by its help or its error: the form field around it. */
function example(page: Page, section: string, text: string) {
  return page
    .locator(`${section} [data-slot="root"]`)
    .filter({ has: page.getByText(text, { exact: true }) })
}

/**
 * Where a field lays out its value and its icons, in pixels in from its outer edges, to the
 * hundredth: the value from each side, past the edge and the padding, and each icon's near and far
 * side from its own side of the field. And the edge's width. An input's icons sit beside it, a
 * select's inside it.
 */
function layoutOf(field: Locator) {
  return field.evaluate((field) => {
    const round = (pixels: number) => Math.round(pixels * 100) / 100
    const box = field.getBoundingClientRect()
    const style = getComputedStyle(field)
    const around = field.localName === 'input' ? field.parentElement! : field
    const icon = (slot: string, side: 'leading' | 'trailing') => {
      const icon = around.querySelector(`[data-slot="${slot}"]`)?.getBoundingClientRect()
      if (!icon) return undefined
      return side === 'leading'
        ? { start: round(icon.left - box.left), end: round(icon.right - box.left) }
        : { start: round(box.right - icon.right), end: round(box.right - icon.left) }
    }
    return {
      edge: parseFloat(style.borderTopWidth),
      value: {
        start: round(parseFloat(style.borderLeftWidth) + parseFloat(style.paddingLeft)),
        end: round(parseFloat(style.borderRightWidth) + parseFloat(style.paddingRight)),
      },
      leadingIcon: icon('leadingIcon', 'leading'),
      trailingIcon: icon('trailingIcon', 'trailing'),
    }
  })
}

test("a field's icons start where a field's value does, the control's gap from its own value", async ({
  page,
}, testInfo) => {
  test.skip(playground(testInfo) !== 'nuxt', 'The fields are in the gallery')
  await open(page)
  for (const size of ['xs', 'sm', 'md', 'lg', 'xl']) {
    const gap = await resolveLength(page, `var(--ws-control-gap-${size})`)
    // a text field with an icon on each side, and a select with its chevron and no icon before
    const input = await layoutOf(example(page, '#input', `size ${size}`).getByRole('textbox'))
    const select = await layoutOf(example(page, '#select', `size ${size}`).getByRole('combobox'))
    expect(input.value.start - input.leadingIcon!.end, size).toBe(gap)
    expect(input.value.end - input.trailingIcon!.end, size).toBe(gap)
    expect(select.value.end - select.trailingIcon!.end, size).toBe(gap)
    expect(
      [input.leadingIcon!.start, input.trailingIcon!.start, select.trailingIcon!.start],
      size,
    ).toEqual([select.value.start, select.value.start, select.value.start])
  }
})

test("a field's value and its icons stay where they are when its edge widens in an error", async ({
  page,
}, testInfo) => {
  test.skip(playground(testInfo) !== 'nuxt', 'The fields are in the gallery')
  await open(page)
  const edges = [
    await resolveLength(page, 'var(--ws-control-border-width-rest)'),
    await resolveLength(page, 'var(--ws-control-border-width-invalid)'),
  ]
  for (const [section, role, rest, invalid] of [
    [
      '#input',
      'textbox',
      'As on your ID.',
      'Enter an email address with a domain, such as maya@example.com.',
    ],
    [
      '#select',
      'combobox',
      'Where the conference takes place.',
      'Choose the day you are registering for.',
    ],
  ] as const) {
    const atRest = await layoutOf(example(page, section, rest).getByRole(role))
    // the field of the states row, at the default size, before the sizes of the error
    const inError = await layoutOf(example(page, section, invalid).getByRole(role).first())
    expect([atRest.edge, inError.edge], section).toEqual(edges)
    expect({ ...inError, edge: undefined }, section).toEqual({ ...atRest, edge: undefined })
  }
})

test("a bare field's icon starts where its value would, the control's gap from its value", async ({
  page,
}, testInfo) => {
  test.skip(playground(testInfo) !== 'nuxt', 'The select menus are in the gallery')
  // a list that does not grow as it opens, to measure in
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await open(page)
  const gap = await resolveLength(page, 'var(--ws-control-gap-md)')
  // where a bare field's value starts: its padding, with no edge before it
  const padding = await resolveLength(page, 'var(--ws-space-12)')
  const list = page.locator('[data-slot="content"]:has([role="listbox"])')
  // a select menu's search, a field with no edge of its own: the default one, and one an app
  // passes with its placeholder and the icon
  for (const help of [
    "Search by the city's name.",
    'Several cities at once, the search naming what it searches.',
  ]) {
    await example(page, '#select', help).locator('button[aria-haspopup="listbox"]').click()
    const search = await layoutOf(list.locator('input'))
    expect(search.leadingIcon, help).toBeDefined()
    expect(search.leadingIcon!.start, help).toBe(padding)
    expect(search.value.start - search.leadingIcon!.end, help).toBe(gap)
    await page.keyboard.press('Escape')
    await expect(list).toHaveCount(0)
  }
})

test("a field's and a button's corners follow the tier's control radius as it changes", async ({
  page,
}, testInfo) => {
  test.skip(playground(testInfo) !== 'nuxt', 'The fields are in the gallery')
  await open(page)
  // a radius no token has, on the page's tier
  await page.evaluate(() =>
    document.documentElement.style.setProperty('--ws-control-radius', '7px'),
  )
  for (const control of [
    page.locator('#input').getByRole('textbox').first(),
    page.locator('#select').getByRole('combobox').first(),
    page.getByTestId('select-menu'),
    page.locator('[data-spec="button.primary.rest"]').first(),
  ])
    await expect(control).toHaveCSS('border-radius', '7px')
})

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

test('a card without its control centers its label in the card: the hidden control takes no room', async ({
  page,
}, testInfo) => {
  test.skip(playground(testInfo) !== 'nuxt', 'The cards are in the gallery')
  await open(page)
  // the cards of the radio group without the circle, each label's block from the card's padding
  const cards = page
    .locator('#radio-group fieldset')
    .filter({ has: page.getByText('Session', { exact: true }) })
    .locator('[data-slot="item"]')
  await expect(cards).toHaveCount(3)
  const insets = await cards.evaluateAll((cards) =>
    cards.map((card) => {
      const round = (pixels: number) => Math.round(pixels * 100) / 100
      const box = card.getBoundingClientRect()
      const style = getComputedStyle(card)
      const left = box.left + parseFloat(style.borderLeftWidth) + parseFloat(style.paddingLeft)
      const right = box.right - parseFloat(style.borderRightWidth) - parseFloat(style.paddingRight)
      const wrapper = card.querySelector('[data-slot="wrapper"]')!.getBoundingClientRect()
      return { start: round(wrapper.left - left), end: round(right - wrapper.right) }
    }),
  )
  expect(insets).toEqual(insets.map(() => ({ start: 0, end: 0 })))
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

    test("every required mark is the system's red: a field's, a checkbox's and a radio group's", async ({
      page,
    }, testInfo) => {
      test.skip(playground(testInfo) !== 'nuxt', 'The marks are in the gallery')
      await open(page)
      const red = await resolveColor(page, 'var(--ws-field-required-text)')
      for (const section of ['#input', '#select', '#checkbox', '#radio-group']) {
        // the asterisk after a label or a legend
        const marks = await page.locator(section).evaluate((section) =>
          [...section.querySelectorAll('*')]
            .map((element) => getComputedStyle(element, '::after'))
            .filter((after) => after.content === '"*"')
            .map((after) => after.color),
        )
        expect(marks.length, section).toBeGreaterThan(0)
        for (const mark of marks) expect(mark, section).toBe(red)
      }
    })
  })
}
