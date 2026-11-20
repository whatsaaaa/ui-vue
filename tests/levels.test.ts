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

  test('gives a reason for a component the gallery does not show, which is then at level 1', () => {
    for (const [name, { today, unshown }] of entries)
      if (unshown) {
        expect(today, name).toBe(1)
        expect(unshown.note, name).not.toBe('')
      }
  })

  test('lists a known failure only with a component the gallery shows, with its themes and parts', () => {
    for (const [name, component] of entries)
      for (const failure of component.fails ?? []) {
        expect(component.unshown, name).toBeUndefined()
        expect(failure.themes.length, name).toBeGreaterThan(0)
        expect(failure.slots.length, name).toBeGreaterThan(0)
        expect(failure.note, name).not.toBe('')
      }
  })

  test('lists no failure twice: one check on one part of a component in one theme', () => {
    const listed = entries.flatMap(([name, { fails = [] }]) =>
      fails.flatMap(({ check, themes, slots }) =>
        themes.flatMap((theme) => slots.map((slot) => `${name} ${slot} ${check} ${theme}`)),
      ),
    )
    expect(listed.filter((failure, index) => listed.indexOf(failure) !== index)).toEqual([])
  })
})

describe("the README's coverage tables", () => {
  test('are the ones scripts/levels-readme.ts draws from the levels file: pnpm levels', () => {
    const readme = readFileSync(README, 'utf8')
    expect(withLevelsTables(readme)).toBe(readme)
  })
})
