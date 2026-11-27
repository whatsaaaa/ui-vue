import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { createTV } from 'tailwind-variants'
import { describe, expect, test } from 'vitest'
import { type ComponentLevels, components } from '../packages/ui-vue/levels.ts'
import { ui } from '../packages/ui-vue/src/index.ts'

/*
 * Level 2 of packages/ui-vue/levels.ts, over the theme config: a component at level 2 today is
 * drawn on the system's tiers, so none of its parts keeps a class of Nuxt UI's own look. Its
 * classes are the ones Nuxt UI gives it, from Nuxt UI's theme with the package's merged onto it,
 * as Nuxt UI merges them, in every variant and every compound variant either theme has.
 *
 * Nuxt UI's theme of a component is the one `nuxt prepare` writes for the gallery, which
 * pnpm install runs: playgrounds/nuxt/.nuxt/ui, with the package's colors.
 */

const NUXT_UI_THEMES = join(import.meta.dirname, '../playgrounds/nuxt/.nuxt/ui')

const entries = Object.entries(components) as [string, ComponentLevels][]
const levelTwo = entries.filter(([, { today }]) => today === 2).map(([name]) => name)

/** The key of a component in the config, and the file of its theme: pinInput, pin-input. */
const keyOf = (name: string) => `${name[1]!.toLowerCase()}${name.slice(2)}`
const fileOf = (name: string) =>
  name
    .slice(1)
    .replaceAll(/(?<!^)([A-Z])/g, '-$1')
    .toLowerCase()

/**
 * A class with its modifiers taken off: md:focus-visible:text-sm is text-sm, and so is
 * data-[state=active]:text-sm. A modifier ends at a colon outside brackets and parentheses: the
 * colons of has-[:focus] and border-(length:--width) are inside them.
 */
function utility(name: string) {
  let depth = 0
  let rest = ''
  for (const character of name) {
    rest = character === ':' && depth === 0 ? '' : rest + character
    if (character === '[' || character === '(') depth += 1
    else if (character === ']' || character === ')') depth -= 1
  }
  return rest.replace(/^!|!$/g, '')
}

/** The classes that draw Nuxt UI's look instead of the system's, by what each draws. */
const forbidden = [
  // the system's text styles are text-body, text-label and the others: Tailwind's sizes are not
  { what: 'a Tailwind type size', is: /^text-(xs|sm|base|lg|xl|[2-9]xl|\[\d[^\]]*\])(\/.+)?$/ },
  // an edge drawn as a box shadow, which forced colors take away: ring-0 takes one off
  { what: 'a ring as an edge', is: /^(inset-)?ring(-(?!0$)\d+|-\[[^\]]+\]|-\(length:[^)]+\))?$/ },
  { what: 'a shadow', is: /^(drop-)?shadow(-(2xs|xs|sm|md|lg|xl|2xl|inner|\[[^\]]+\]))?$/ },
  // a shade of a color, primary-600, which the bridge mixes: the system has roles
  { what: 'a color shade', is: /-[a-z]+-(50|[1-9]00|950)(\/[\d.]+)?$/ },
]

/**
 * Whether a shadow is taken off: box-shadow: none, written as it is, wins over a shadow written
 * as it is, and leaves the color of Tailwind's shadow-none out of the stylesheet.
 */
const unshadowed = (classes: string[], name: string) =>
  classes.includes('[box-shadow:none]') && utility(name) === name

interface Theme {
  slots?: Record<string, unknown>
  variants?: Record<string, Record<string, unknown>>
  compoundVariants?: Record<string, unknown>[]
}

/** A variant's value as a prop: true and false are booleans. */
const prop = (value: unknown) => (value === 'true' ? true : value === 'false' ? false : value)

/**
 * The props that put each class of the two themes on its part at least once: none, each value of
 * each variant, and the conditions of each compound variant, the first value where it lists
 * several, and each of them in turn.
 */
function propsOf(themes: Theme[]): Record<string, unknown>[] {
  const all: Record<string, unknown>[] = [{}]
  for (const theme of themes) {
    for (const [variant, values] of Object.entries(theme.variants ?? {}))
      for (const value of Object.keys(values)) all.push({ [variant]: prop(value) })
    for (const compound of theme.compoundVariants ?? []) {
      const conditions = Object.entries(compound).filter(([key]) => key !== 'class')
      const lists = conditions.filter(([, value]) => Array.isArray(value)) as [string, unknown[]][]
      const first = Object.fromEntries(
        conditions.map(([key, value]) => [key, prop(Array.isArray(value) ? value[0] : value)]),
      )
      all.push(first)
      for (const [key, values] of lists)
        for (const value of values.slice(1)) all.push({ ...first, [key]: prop(value) })
    }
  }
  return all
}

/** Nuxt UI's theme of the component, and the package's. */
async function themesOf(name: string) {
  const file = join(NUXT_UI_THEMES, `${fileOf(name)}.ts`)
  const nuxtUi = ((await import(file)) as { default: Theme }).default
  const ours = (ui as unknown as Record<string, Theme | undefined>)[keyOf(name)] ?? {}
  return { nuxtUi, ours }
}

/** Every class a part of the component has, with the props given, as Nuxt UI merges them. */
function classesOf(nuxtUi: Theme, ours: Theme, props: Record<string, unknown>) {
  const component = createTV(ui.tv)({ extend: createTV(ui.tv)(nuxtUi as never), ...ours } as never)
  const result = (component as (props: object) => unknown)(props)
  // a theme with slots gives a function for each, one without its classes for the one part
  const parts: Record<string, () => string> =
    typeof result === 'string' ? { base: () => result } : (result as Record<string, () => string>)
  return Object.entries(parts).map(([slot, classes]) => ({
    slot,
    classes: (classes() ?? '').split(/\s+/).filter(Boolean),
  }))
}

describe('a class of a theme', () => {
  test.each([
    ['md:focus-visible:text-sm', 'text-sm'],
    ['data-[state=active]:text-xs', 'text-xs'],
    ['group-data-[orientation=vertical]:shadow-lg', 'shadow-lg'],
    ['has-[:focus-visible]:ring-2', 'ring-2'],
    [
      'first:not-nth-last-[1_of_:not(input[aria-hidden],select[aria-hidden])]:rounded-e-none',
      'rounded-e-none',
    ],
    ['[&>*]:ring', 'ring'],
    ['text-xs!', 'text-xs'],
    [
      'border-(length:--ws-control-border-width-rest)',
      'border-(length:--ws-control-border-width-rest)',
    ],
    ['hover:bg-[url(a:b)]', 'bg-[url(a:b)]'],
  ])('%s is checked as %s', (name, checked) => {
    expect(utility(name)).toBe(checked)
  })
})

describe('a component at level 2', () => {
  test('is listed: the levels file has some', () => {
    expect(levelTwo.length).toBeGreaterThan(0)
  })

  describe.each(levelTwo)('%s', (name) => {
    test('has a theme in the package, merged onto the one Nuxt UI has for it', async () => {
      expect(Object.keys(ui), name).toContain(keyOf(name))
      const file = join(NUXT_UI_THEMES, `${fileOf(name)}.ts`)
      expect(existsSync(file), `${file}: pnpm install writes it, with nuxt prepare`).toBe(true)
    })

    // A variant that is one class string in one theme and classes by part in the other is merged
    // into a string with the object written in it: its classes by part are lost.
    test('gives no part an object as a class, in any of its variants', async () => {
      const { nuxtUi, ours } = await themesOf(name)
      const found = new Set<string>()
      for (const props of propsOf([nuxtUi, ours]))
        for (const { slot, classes } of classesOf(nuxtUi, ours, props))
          if (classes.includes('[object') || classes.includes('Object]'))
            found.add(`${slot}: ${JSON.stringify(props)}`)
      expect([...found].sort()).toEqual([])
    })

    test('draws no part with a Tailwind type size, a ring as an edge, a shadow or a color shade, in any of its variants', async () => {
      const { nuxtUi, ours } = await themesOf(name)
      const found = new Set<string>()
      for (const props of propsOf([nuxtUi, ours]))
        for (const { slot, classes } of classesOf(nuxtUi, ours, props))
          for (const name of classes)
            for (const { what, is } of forbidden)
              if (is.test(utility(name)) && !(what === 'a shadow' && unshadowed(classes, name)))
                found.add(`${slot}: ${name}, ${what}`)
      expect([...found].sort()).toEqual([])
    })
  })
})
