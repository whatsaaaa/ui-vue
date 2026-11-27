import { AxeBuilder } from '@axe-core/playwright'
import { expect, test, type Locator, type Page } from '@playwright/test'
import {
  type Check,
  type ComponentLevels,
  type Theme,
  components,
  shownOn,
} from '../../packages/ui-vue/levels.ts'
import { type Finding, alike, edges, icons, openWithSystemColors, settle } from './forced.ts'
import { open, playground, reportsOf } from './pages.ts'

/*
 * Level 1 of packages/ui-vue/levels.ts, as tests over the gallery and its page of the others, in
 * both themes: axe finds no contrast failure, in forced colors every icon is painted, every part
 * with a ring keeps an edge and a control that is on differs from one that is off, the page logs
 * no error, and at 390 px no example reaches past the frame it is in.
 *
 * A check a component still fails is listed with it in the levels file: it does not pass level 1
 * yet. Each test holds what it finds to that list, both ways: a failure that is not listed fails
 * it, and so does a listed one that no longer fails, so the list only shrinks. A failure is one
 * check on one part of one component in one theme, and another check or theme on the same part
 * is another failure.
 */

const PAGE = '/others'
const entries = Object.entries(components) as [string, ComponentLevels][]

/** A failure, as the tests compare them: the check, the theme, the component and its part. */
const key = (check: Check, theme: Theme, { where, slot }: Pick<Finding, 'where' | 'slot'>) =>
  `${check}, ${theme}: ${where}, ${slot}`

/**
 * The failures of a check the levels file lists for a theme: of the components on the page of
 * the others, or of the ones in the gallery.
 */
function known(check: Check, theme: Theme, on: 'others' | 'gallery' = 'others'): string[] {
  return entries
    .filter(([, component]) => shownOn(component) === on)
    .flatMap(([name, { fails = [] }]) =>
      fails
        .filter((failure) => failure.check === check && failure.themes.includes(theme))
        .flatMap(({ slots }) => slots.map((slot) => key(check, theme, { where: name, slot }))),
    )
    .sort()
}

/**
 * The component a section of the gallery shows, by the section's id: URadioGroup for
 * radio-group.
 */
const inGallery = (finding: Finding): Finding => ({
  ...finding,
  where: `U${(finding.where ?? '').replaceAll(/(^|-)(\w)/g, (_, _dash, letter: string) => letter.toUpperCase())}`,
})

/** Holds what a check found in a theme to the failures the levels file lists for it. */
function expectKnown(
  findings: Finding[],
  check: Check,
  theme: Theme,
  on: 'others' | 'gallery' = 'others',
): void {
  const keys = [...new Set(findings.map((finding) => key(check, theme, finding)))].sort()
  const details = findings.map(({ where, slot, detail }) => `${where}, ${slot}: ${detail}`)
  expect(keys, details.join('\n')).toEqual(known(check, theme, on))
}

/**
 * The contrast failures axe finds: its color-contrast rule, WCAG's 4.5:1 for text and 3:1 for
 * large text. Within a part of the page, where one is given, which then belongs to the component
 * named.
 *
 * Two things hide a part of the pages from axe, and are taken away while it looks. On a wide
 * screen the window scrolls its content inside itself, and axe takes what is scrolled out of it
 * for hidden: the window grows with its content, as it does on a narrow screen. And axe leaves
 * out what is inert, as the lists, menus and windows held open in place are: they are checked as
 * they would be open in an app.
 *
 * The text of a disabled control or option is left out, as WCAG leaves out an inactive
 * component: axe knows a disabled control's label for one, but not the line about it, which
 * nothing ties to it, nor a disabled option of a list.
 */
async function contrast(page: Page, within?: { selector: string; where: string }) {
  await page.addStyleTag({
    content: '.window { height: auto !important } .window__main { overflow: visible !important }',
  })
  const held = page.locator('.gallery-open, .others-open')
  await held.evaluateAll((held) => held.forEach((open) => open.removeAttribute('inert')))
  await settle(page)
  const axe = new AxeBuilder({ page }).withRules(['color-contrast'])
  if (within) axe.include(within.selector)
  const { violations } = await axe.analyze()
  await held.evaluateAll((held) => held.forEach((open) => open.setAttribute('inert', '')))
  const nodes = violations.flatMap(({ nodes }) =>
    nodes.map(({ target, any }) => ({
      selector: String(target.at(-1)),
      detail: any.map(({ message }) => message).join(' '),
    })),
  )
  const findings = await page.evaluate(
    (nodes) =>
      nodes.flatMap(({ selector, detail }): Finding[] => {
        const element = document.querySelector(selector)!
        const disabled = ':disabled, [aria-disabled=true], [data-disabled]'
        const control = element
          .closest('[data-slot=item], [data-slot=root]')
          ?.querySelector('[role=checkbox], [role=radio], [role=switch]')
        if (element.closest(disabled) || control?.matches(disabled)) return []
        return [{ ...window.partOf(element), detail: `${element.textContent?.trim()}: ${detail}` }]
      }),
    nodes,
  )
  return within ? findings.map((finding) => ({ ...finding, where: within.where })) : findings
}

/**
 * A control that is on is painted unlike one that is off: a switch, a checkbox, a radio or a
 * pressed button. In each example, each control that is on is held to one of its kind that is
 * off, with the same content and of the same size, so only the state can differ. Forced colors
 * take a fill away, and a state drawn by a fill alone with it.
 */
async function states(page: Page): Promise<Finding[]> {
  const pairs = await page.evaluate(() => {
    const pairs: { where: string; slot: string; on: string; off: string }[] = []
    let count = 0
    for (const sample of document.querySelectorAll<HTMLElement>('[data-sample]')) {
      const controls = [
        ...sample.querySelectorAll<HTMLElement>('[aria-checked], [aria-pressed]'),
      ].filter((control) => control.checkVisibility() && !control.matches(':disabled'))
      const kindOf = (control: HTMLElement) =>
        control.getAttribute('role') ?? (control.hasAttribute('aria-pressed') ? 'pressed' : '')
      const isOn = (control: HTMLElement) =>
        (control.getAttribute('aria-checked') ?? control.getAttribute('aria-pressed')) === 'true'
      const sizeOf = (control: HTMLElement) => {
        const { width, height } = control.getBoundingClientRect()
        return `${Math.round(width)} ${Math.round(height)}`
      }
      const kinds = new Set<string>()
      for (const on of controls.filter(isOn)) {
        const kind = kindOf(on)
        if (kinds.has(kind)) continue
        const off = controls.find(
          (control) =>
            !isOn(control) &&
            kindOf(control) === kind &&
            control.textContent === on.textContent &&
            sizeOf(control) === sizeOf(on),
        )
        if (!off) continue
        kinds.add(kind)
        on.dataset.levelState = `${++count}-on`
        off.dataset.levelState = `${count}-off`
        pairs.push({
          where: sample.dataset.sample!,
          slot: kind,
          on: on.dataset.levelState,
          off: off.dataset.levelState,
        })
      }
    }
    return pairs
  })
  const findings: Finding[] = []
  for (const { where, slot, on, off } of pairs) {
    const [one, other] = [on, off].map((state) => page.locator(`[data-level-state="${state}"]`))
    if (await alike(page, one!, other!))
      findings.push({ where, slot, detail: 'on and off are painted alike' })
  }
  return findings
}

/**
 * The parts of the examples on the page of the others that reach past the box they are laid out
 * in, sideways: the content box of the gallery frame's content, inside its padding. The frame
 * hides what reaches past its window, so the page itself never scrolls sideways, and each example
 * is measured against that box instead.
 *
 * What an example draws is measured as it is drawn: the box of each element, and each line of
 * each text, which can reach past the element it is in. What a part of the component clips or
 * scrolls inside itself is measured as far as it shows. The box that stands for a screen, in
 * OthersScreen, clips too, but what reaches past it would reach past a phone's screen, so it is
 * measured through. What does not show is left out: a part that is hidden or transparent, and one
 * clipped to nothing, as a label kept for screen readers is.
 *
 * A finding is the outermost part that reaches past the box: what is in it reaches with it.
 */
async function overflows(page: Page): Promise<Finding[]> {
  await page.evaluate(() => document.fonts.ready)
  await settle(page)
  return page.evaluate(() => {
    const frame = document.querySelector('.window__main > div')!
    const style = getComputedStyle(frame)
    const { left, right } = frame.getBoundingClientRect()
    const box = {
      left: left + parseFloat(style.borderLeftWidth) + parseFloat(style.paddingLeft),
      right: right - parseFloat(style.borderRightWidth) - parseFloat(style.paddingRight),
    }
    function* ancestors(element: Element | null) {
      for (let at = element; at; at = at.parentElement) yield at
    }
    // a label kept for screen readers is clipped to nothing, by clip or by clip-path
    const unseen = (element: Element) =>
      !element.checkVisibility({ opacityProperty: true, visibilityProperty: true }) ||
      [...ancestors(element)].some((ancestor) => {
        const { clip, clipPath } = getComputedStyle(ancestor)
        return clip === 'rect(0px, 0px, 0px, 0px)' || clipPath === 'inset(50%)'
      })
    const lines = (text: Node) => {
      const range = document.createRange()
      range.selectNodeContents(text)
      return range.getClientRects()
    }
    const reaching = new Map<Element, string>()
    for (const sample of document.querySelectorAll<HTMLElement>('[data-sample]')) {
      const walker = document.createTreeWalker(
        sample,
        NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
      )
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const element = node instanceof Element ? node : node.parentElement!
        if (node instanceof Text && !node.data.trim()) continue
        if (unseen(element)) continue
        for (const rect of node instanceof Element ? [node.getBoundingClientRect()] : lines(node)) {
          if (rect.width === 0 || rect.height === 0) continue
          let [from, to] = [rect.left, rect.right]
          // as far as the parts of the component around it show it
          const start = node instanceof Element ? node.parentElement : element
          for (let at = start; at && at !== sample; at = at.parentElement) {
            const clips = getComputedStyle(at)
            if (clips.overflowX === 'visible' || at.matches('.others-screen')) continue
            const edges = at.getBoundingClientRect()
            from = Math.max(from, edges.left + parseFloat(clips.borderLeftWidth))
            to = Math.min(to, edges.right - parseFloat(clips.borderRightWidth))
          }
          if (to <= from) continue
          if (from < box.left - 0.5 || to > box.right + 0.5)
            reaching.set(
              element,
              `${element.localName} reaches from ${Math.round(from - box.left)} to ${Math.round(to - box.left)} px of the ${Math.round(box.right - box.left)} px the frame has`,
            )
        }
      }
    }
    return [...reaching]
      .filter(([element]) =>
        [...ancestors(element.parentElement)].every((ancestor) => !reaching.has(ancestor)),
      )
      .map(([element, detail]) => ({ ...window.partOf(element), detail }))
  })
}

/** A window over the page. The popover's example holds another open, in place. */
const DIALOG = '[role=dialog]:not([inert] *)'

/** A menu of the editor, which opens in the editor's example. */
const EDITOR_MENU = '[data-sample=UEditor] [role=listbox]'

/** Types at the end of the editor's text, after a space: a menu opens at the start of a word. */
async function typed(page: Page, text: string): Promise<void> {
  await page.locator('[data-sample=UEditor] [contenteditable=true] p').last().click()
  await page.keyboard.press('End')
  await page.keyboard.type(` ${text}`)
}

/**
 * What opens over the page from an example, and is not on the page until then: how it opens,
 * the part of the page it then is, and how it closes, where Escape does not close it.
 */
interface Opening {
  name: string
  open: (page: Page) => Promise<void>
  opened: string
  close?: (part: Locator) => Promise<void>
}

const openings: Opening[] = [
  {
    name: 'UContextMenu',
    open: (page) => page.getByTestId('open-UContextMenu').click({ button: 'right' }),
    // the dropdown menu's example holds another menu open, in place
    opened: '[role=menu]:not([inert] *)',
  },
  {
    name: 'UDrawer',
    open: (page) => page.getByTestId('open-UDrawer').click(),
    opened: DIALOG,
  },
  {
    // the one that opens: the other is held open in place
    name: 'UPopover',
    open: (page) => page.getByTestId('open-UPopover').click(),
    opened: DIALOG,
  },
  {
    name: 'USlideover',
    open: (page) => page.getByTestId('open-USlideover').click(),
    opened: DIALOG,
  },
  {
    name: 'UToast',
    open: (page) => page.getByTestId('open-UToast').click(),
    opened: 'ol[data-slot=viewport] > li',
    // Escape closes a toast only while the toasts have the focus
    close: (toast) => toast.getByRole('button', { name: 'Close' }).click(),
  },
  {
    name: 'UDashboardSearch',
    open: (page) => page.getByTestId('open-UDashboardSearch').click(),
    opened: DIALOG,
  },
  {
    name: 'UContentSearch',
    open: (page) => page.getByTestId('open-UContentSearch').click(),
    opened: DIALOG,
  },
  // the menus of the editor, each at the character that asks for it
  { name: 'UEditorSuggestionMenu', open: (page) => typed(page, '/'), opened: EDITOR_MENU },
  { name: 'UEditorMentionMenu', open: (page) => typed(page, '@'), opened: EDITOR_MENU },
  { name: 'UEditorEmojiMenu', open: (page) => typed(page, ':sm'), opened: EDITOR_MENU },
]

/** Opens one of them, and gives the part of the page it is once it has come. */
async function opened(page: Page, { open, opened }: Opening): Promise<Locator> {
  await open(page)
  const part = page.locator(opened).filter({ visible: true })
  await expect(part).toHaveCount(1)
  // once it has come in: it opens with an animation, which ends, unlike a spinner's
  await part.evaluate((part) =>
    Promise.all(
      part
        .getAnimations({ subtree: true })
        .filter((animation) => Number.isFinite(animation.effect?.getComputedTiming().endTime))
        .map(({ finished }) => finished),
    ),
  )
  return part
}

/**
 * Closes one of them, and waits until it is gone. Escape is pressed again where the first did
 * not reach it: a menu takes the keyboard a moment after it shows.
 */
async function closed(page: Page, part: Locator, { close }: Opening): Promise<void> {
  await expect(async () => {
    if (await part.count()) await (close ? close(part) : page.keyboard.press('Escape'))
    await expect(part).toHaveCount(0, { timeout: 2_000 })
  }).toPass()
}

test.beforeEach(() => {
  test.skip(playground(test.info()) !== 'nuxt', 'The gallery is the Nuxt playground')
})

test('the page of the others has an example of every component the levels file says it shows, and of no other', async ({
  page,
}) => {
  await open(page, PAGE)
  // an example is named after one component, and names the ones it shows with it
  const shown = await page.evaluate(() =>
    [...document.querySelectorAll('[data-sample], [data-sample] > header [id]')].map(
      (element) => element.id,
    ),
  )
  expect(shown.sort()).toEqual(
    entries
      .filter(([, component]) => shownOn(component) === 'others')
      .map(([name]) => name)
      .sort(),
  )
  // and every example draws something under its name
  const empty = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('[data-sample]')]
      .filter((sample) =>
        [...sample.querySelectorAll(':scope > div > *')].every(
          (drawn) => drawn.getBoundingClientRect().height === 0,
        ),
      )
      .map((sample) => sample.dataset.sample),
  )
  expect(empty).toEqual([])
})

test('the page of the others opens at its top, with no example holding the focus', async ({
  page,
}) => {
  await open(page, PAGE)
  // a control that takes the focus as it comes does so a moment after, and scrolls to itself
  await page.evaluate(() => new Promise((resolve) => setTimeout(resolve)))
  const landing = await page.evaluate(() => ({
    focus:
      document.activeElement?.closest<HTMLElement>('[data-sample]')?.dataset.sample ??
      document.activeElement?.localName,
    top: document.documentElement.scrollTop + document.querySelector('.window__main')!.scrollTop,
  }))
  expect(landing).toEqual({ focus: 'body', top: 0 })
})

for (const theme of ['dark', 'light'] as const) {
  test.describe(`in the ${theme} theme`, () => {
    test.use({ colorScheme: theme })

    test('axe finds no contrast failure on the gallery, but the known ones', async ({ page }) => {
      await openWithSystemColors(page)
      expectKnown((await contrast(page)).map(inGallery), 'contrast', theme, 'gallery')
    })

    test('axe finds no contrast failure on the page of open lists and windows', async ({
      page,
    }) => {
      await openWithSystemColors(page, '/open')
      expect(await contrast(page)).toEqual([])
    })

    test('axe finds no contrast failure on the page of the others, but the known ones', async ({
      page,
    }) => {
      // the whole page, and each thing that opens from it, one after another
      test.slow()
      await openWithSystemColors(page, PAGE)
      const findings = await contrast(page)
      for (const opening of openings) {
        const part = await opened(page, opening)
        await part.evaluate((part) => (part.dataset.levelOpened = ''))
        findings.push(
          ...(await contrast(page, { selector: '[data-level-opened]', where: opening.name })),
        )
        await part.evaluate((part) => delete part.dataset.levelOpened)
        await closed(page, part, opening)
      }
      expectKnown(findings, 'contrast', theme)
    })

    test('the page of the others logs no error', async ({ page }) => {
      // the whole page, and each thing that opens from it, one after another
      test.slow()
      const reports = reportsOf(page)
      await open(page, PAGE)
      for (const opening of openings) {
        await closed(page, await opened(page, opening), opening)
      }
      expect(reports).toEqual([])
    })

    test.describe('at 390 px, the width of a phone', () => {
      test.use({ viewport: { width: 390, height: 800 } })

      test('no example on the page of the others overflows the frame, but the known ones', async ({
        page,
      }) => {
        await openWithSystemColors(page, PAGE)
        expectKnown(await overflows(page), 'overflow', theme)
      })
    })
  })

  test.describe(`in forced colors, on a ${theme} system`, () => {
    test.use({ colorScheme: theme, forcedColors: 'active' })

    test('every icon is painted and every part with a ring has an edge, but the known ones', async ({
      page,
    }) => {
      // the whole page, and each thing that opens from it, one after another
      test.slow()
      await openWithSystemColors(page, PAGE)
      const body = page.locator('body')
      const [painted, edged] = [await icons(body), await edges(body)]
      for (const opening of openings) {
        const part = await opened(page, opening)
        const within = (finding: Finding) => ({ ...finding, where: opening.name })
        painted.push(...(await icons(part)).map(within))
        edged.push(...(await edges(part)).map(within))
        await closed(page, part, opening)
      }
      expectKnown(painted, 'forced-icon', theme)
      expectKnown(edged, 'forced-edge', theme)
    })

    test('a part with a ring keeps its edge while it has the focus itself', async ({ page }) => {
      await openWithSystemColors(page, PAGE)
      // a popover's window can have the focus itself, and Nuxt UI hides the outline the browser
      // draws for it: the ring's outline stays
      const popover = await opened(
        page,
        openings.find(({ name }) => name === 'UPopover')!,
      )
      await popover.focus()
      await expect(popover).toBeFocused()
      expect(await edges(popover)).toEqual([])
    })

    test('a control that is on is painted unlike one that is off, but the known ones', async ({
      page,
    }) => {
      await openWithSystemColors(page, PAGE)
      expectKnown(await states(page), 'forced-state', theme)
    })
  })
}
