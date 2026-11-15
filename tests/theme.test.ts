import { devNull } from 'node:os'
import { join } from 'node:path'
import { __unstable__loadDesignSystem, compile } from '@tailwindcss/node'
import { Scanner } from '@tailwindcss/oxide'
import stylelint from 'stylelint'
import { cnMerge } from 'tailwind-variants'
import { describe, expect, test } from 'vitest'
import { theme, ui } from '../packages/ui-vue/src/index.ts'

const source = join(import.meta.dirname, '../packages/ui-vue/src')

interface ComponentTheme {
  slots?: object
  variants?: object
  compoundVariants?: { class: unknown }[]
}

/**
 * Every class name in the components' config: in the slots, in the variants, whose keys are
 * names, and in the compound variants' classes, whose other keys are conditions.
 */
function classesOf(config: Record<string, unknown>): Set<string> {
  const names = new Set<string>()
  const add = (value: unknown) => {
    if (typeof value === 'string') for (const name of value.split(/\s+/)) if (name) names.add(name)
    if (value && typeof value === 'object') for (const item of Object.values(value)) add(item)
  }
  for (const [component, value] of Object.entries(config)) {
    if (component === 'tv') continue
    const theme = value as ComponentTheme
    add(theme.slots)
    add(theme.variants)
    for (const compound of theme.compoundVariants ?? []) add(compound.class)
  }
  return names
}

/** One layer of Tailwind's output, the at-rule and all it holds. */
function layerOf(css: string, name: string): string {
  const start = css.indexOf(`@layer ${name} {`)
  expect(start, `@layer ${name}`).toBeGreaterThanOrEqual(0)
  let depth = 0
  for (let end = start; end < css.length; end++) {
    if (css[end] === '{') depth++
    else if (css[end] === '}' && --depth === 0) return css.slice(start, end + 1)
  }
  throw new Error(`@layer ${name} does not close`)
}

describe('the components config', () => {
  test('survives JSON, as Nuxt UI writes it on Vue', () => {
    expect(JSON.parse(JSON.stringify(ui))).toEqual(ui)
  })

  test('has no secondary color, which the design system has no role for', () => {
    expect(theme.colors).toEqual(['primary', 'success', 'info', 'warning', 'error'])
  })

  test("writes every class out whole, where Tailwind's scan of the stylesheet's sources finds it", async () => {
    // Nuxt UI's #build/ui.css is the app's: the package alone has none
    const compiler = await compile(`@import './index.css';`, {
      base: source,
      onDependency: () => {},
      customCssResolver: async (id) => (id === '#build/ui.css' ? devNull : undefined),
    })
    const found = new Set(new Scanner({ sources: compiler.sources }).scan())
    const names = [...classesOf(ui)]
    expect(names.length).toBeGreaterThan(300)
    expect(names.filter((name) => !found.has(name))).toEqual([])
  })

  test('uses only classes that Tailwind builds from the design system', async () => {
    // The design system's Tailwind, building the utilities alone, and Nuxt UI's own names that
    // the config uses, which its stylesheet defines
    const css = `@reference '@whatsaaaa/design-system/tailwind.css';
      @theme inline { --background-color-accented: var(--ui-bg-accented); }
      @layer utilities { @tailwind utilities; }`
    const compiler = await compile(css, { base: source, onDependency: () => {} })
    let built = compiler.build([])
    // a class Tailwind does not know adds nothing
    expect(compiler.build(['bg-not-a-role']).length).toBe(built.length)
    const names = classesOf(ui)
    expect(names.size).toBeGreaterThan(300)
    const unknown: string[] = []
    for (const name of names) {
      const next = compiler.build([name])
      if (next.length === built.length) unknown.push(name)
      built = next
    }
    expect(unknown).toEqual([])

    // Every color the classes build is a design system role: the color rules of the stylesheets
    // hold for the utilities too, so a hex value, a named color or a color function is an error.
    const config = await stylelint.resolveConfig(join(source, 'index.css'))
    const rules = Object.fromEntries(
      ['color-no-hex', 'color-named', 'function-disallowed-list'].map((rule) => [
        rule,
        config?.rules?.[rule],
      ]),
    )
    const colorErrors = async (css: string) => {
      const { results } = await stylelint.lint({
        code: layerOf(css, 'utilities'),
        config: { rules },
      })
      return results[0]?.warnings.map((warning) => warning.text) ?? []
    }
    expect(await colorErrors(built)).toEqual([])
    // and a color written into a class is one
    const written = compiler.build(['bg-[#fff]', 'text-[rgb(0_0_0)]', 'border-[red]'])
    expect(await colorErrors(written)).toHaveLength(3)
  })

  test("has Nuxt UI's merge take the design system's names in their utilities, the later class staying", async () => {
    // Every name of a text style, a size, a border width and an easing in Tailwind's theme, as
    // Tailwind reads the design system's entry, against another class in each utility that takes it
    const system = await __unstable__loadDesignSystem(
      `@import '@whatsaaaa/design-system/tailwind.css';`,
      { base: source },
    )
    const sides = ['', '-x', '-y', '-s', '-e', '-bs', '-be', '-t', '-r', '-b', '-l']
    const conflicts: Record<string, (name: string) => [string, string][]> = {
      '--spacing': (name) =>
        ['h', 'w', 'size'].map((utility) => [`${utility}-${name} ${utility}-12`, `${utility}-12`]),
      // a font size, which keeps the color
      '--text': (name) =>
        ['text-sm', 'text-label'].map((size) => [
          `${size} text-text text-${name}`,
          `text-text text-${name}`,
        ]),
      '--border-width': (name) => [
        ...sides.map((side): [string, string] => [
          `border-border border${side}-2 border${side}-${name}`,
          `border-border border${side}-${name}`,
        ]),
        ...['x', 'y'].map((axis): [string, string] => [
          `divide-border divide-${axis}-2 divide-${axis}-${name}`,
          `divide-border divide-${axis}-${name}`,
        ]),
      ],
      '--ease': (name) => [[`ease-out ease-${name}`, `ease-${name}`]],
    }
    const wrong: string[] = []
    for (const [namespace, pairs] of Object.entries(conflicts)) {
      const names = [...system.theme.namespace(namespace).keys()].filter(
        (name): name is string => !!name && !name.includes('--'),
      )
      expect(names, namespace).not.toEqual([])
      for (const name of names)
        for (const [classes, merged] of pairs(name)) {
          const result = cnMerge(classes)(ui.tv)
          if (result !== merged) wrong.push(`${classes} -> ${result}`)
        }
    }
    expect(wrong).toEqual([])
  })
})
