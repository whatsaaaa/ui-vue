import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, test } from 'vitest'
import { type ComponentLevels, components, families } from '../packages/ui-vue/levels.ts'
import { ui } from '../packages/ui-vue/src/index.ts'
import { README, withLevelsTables } from '../scripts/levels-readme.ts'

const root = join(import.meta.dirname, '..')
const entries = Object.entries(components) as [string, ComponentLevels][]

/**
 * The components of the Nuxt UI the package pins, by the names an app writes: every file of its
 * components folder, with the U of Nuxt UI's prefix, and Prose for the ones in prose.
 */
function nuxtUiComponents(): string[] {
  const folder = join(root, 'packages/ui-vue/node_modules/@nuxt/ui/dist/runtime/components')
  return readdirSync(folder, { recursive: true, encoding: 'utf8' })
    .filter((file) => file.endsWith('.vue'))
    .map((file) => {
      const path = file.split(/[/\\]/)
      const name = path.at(-1)!.replace(/\.vue$/, '')
      return `${path.length > 1 && path[0] === 'prose' ? 'Prose' : 'U'}${name}`
    })
    .sort()
}

/**
 * The components of Nuxt UI that the Vue files of a folder of the gallery draw: the tags they
 * write, and the toast, which useToast draws.
 */
function drawnIn(folder: string): Set<string> {
  const drawn = new Set<string>()
  for (const file of readdirSync(join(root, folder))) {
    if (!file.endsWith('.vue')) continue
    const source = readFileSync(join(root, folder, file), 'utf8')
    for (const [, tag] of source.matchAll(/<((?:U|Prose)[A-Z][A-Za-z0-9]*)/g)) drawn.add(tag!)
    if (source.includes('useToast()')) drawn.add('UToast')
  }
  return drawn
}

describe('the levels file', () => {
  test('names every component of the Nuxt UI the package pins, and no other', () => {
    const has = nuxtUiComponents()
    expect(has.length).toBeGreaterThan(180)
    const named = Object.keys(components)
    expect({
      missing: has.filter((name) => !named.includes(name)),
      gone: named.filter((name) => !has.includes(name)),
    }).toEqual({ missing: [], gone: [] })
  })

  test('gives each component a family, and a level for 1.0.0 that is not under the one of today', () => {
    for (const [name, component] of entries) {
      expect(families, name).toContain(component.family)
      expect(component.target, name).toBeGreaterThanOrEqual(component.today)
    }
  })

  test('has at level 2 or 3 today exactly the components the package themes', () => {
    const themed = Object.keys(ui)
      .filter((key) => key !== 'tv')
      .map((key) => `U${key[0]!.toUpperCase()}${key.slice(1)}`)
    expect(themed.length).toBeGreaterThan(10)
    expect(
      entries
        .filter(([, component]) => component.today > 1)
        .map(([name]) => name)
        .sort(),
    ).toEqual(themed.sort())
  })

  test('names as the parts of a component only components it has', () => {
    for (const [name, component] of entries)
      for (const part of component.parts ?? []) expect(components, name).toHaveProperty(part)
  })

  test('shows a component where its level says: in the gallery from level 2, else with the others', () => {
    for (const [name, component] of entries)
      if (typeof component.shown === 'string')
        expect(component.shown, name).toBe(component.today > 1 ? 'gallery' : 'others')
  })

  test('says where the gallery shows each component, as its Vue files have it', () => {
    const gallery = drawnIn('playgrounds/nuxt/app/components/sections')
    const others = drawnIn('playgrounds/nuxt/app/components/others')
    const wrong: string[] = []
    for (const [name, { shown }] of entries) {
      if (shown === 'gallery' && !gallery.has(name)) wrong.push(`${name} is in no section`)
      if (shown === 'others' && !others.has(name)) wrong.push(`${name} has no example`)
      if (typeof shown === 'object' && (gallery.has(name) || others.has(name)))
        wrong.push(`${name} is shown`)
    }
    expect(wrong).toEqual([])
  })

  test('lists a known failure only with a component the gallery shows, with the parts that fail', () => {
    for (const [name, component] of entries)
      for (const failure of component.fails ?? []) {
        expect(component.shown, name).toBeTypeOf('string')
        expect(failure.slots.length, name).toBeGreaterThan(0)
        expect(failure.note, name).not.toBe('')
      }
  })
})

describe("the README's coverage tables", () => {
  test('are the ones scripts/levels-readme.ts draws from the levels file: pnpm levels', () => {
    const readme = readFileSync(README, 'utf8')
    expect(withLevelsTables(readme)).toBe(readme)
  })
})
