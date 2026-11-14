import { join } from 'node:path'
import { compile } from '@tailwindcss/node'
import stylelint from 'stylelint'
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

  test('uses only classes that Tailwind builds from the design system', async () => {
    // Nuxt UI's own names that the config uses, which its stylesheet defines
    const css = `@import './tailwind.css';
      @theme inline { --background-color-accented: var(--ui-bg-accented); }`
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
})
