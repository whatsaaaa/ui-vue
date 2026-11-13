import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { compile } from '@tailwindcss/node'
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
  })
})

test('the package has no hex color anywhere', async () => {
  const files = (await readdir(source, { recursive: true })).filter((file) =>
    /\.(ts|css)$/.test(file),
  )
  expect(files.length).toBeGreaterThan(10)
  for (const file of files) {
    const text = await readFile(join(source, file), 'utf8')
    expect(text.match(/#[\da-f]{3,8}\b/gi), file).toBeNull()
  }
})
