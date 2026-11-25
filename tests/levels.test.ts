import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, test } from 'vitest'
import {
  type ComponentLevels,
  type KnownFailure,
  components,
  families,
} from '../packages/ui-vue/levels.ts'
import { ui } from '../packages/ui-vue/src/index.ts'
import { README, failures, withLevelsTables } from '../scripts/levels-readme.ts'

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

  test('names for an internal part the component that draws it, which the gallery shows', () => {
    const byName: Record<string, ComponentLevels> = components
    for (const [name, { unshown }] of entries)
      if (unshown?.why === 'part') {
        expect(Object.keys(components), name).toContain(unshown.drawnBy)
        expect(byName[unshown.drawnBy]!.unshown, name).toBeUndefined()
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

  describe('say where the fix of a known failure comes from, by the levels alone', () => {
    const failure: KnownFailure = {
      check: 'forced-state',
      themes: ['dark', 'light'],
      slots: ['radio'],
      note: 'A chosen star is the same icon as one that is not',
    }
    const restyled: ComponentLevels = { family: 'element', today: 1, target: 2, fails: [failure] }
    const staying: ComponentLevels = { family: 'form', today: 1, target: 1, fails: [failure] }
    const passing: ComponentLevels = { family: 'form', today: 3, target: 3 }
    const later =
      'For a component that fails a level 1 check and is to reach a higher level for 1.0.0, the fix comes with the restyling or the spec that level asks for.'

    test('the restyling or the spec for one to reach a higher level, and open work for one that stays', () => {
      const [fix, , rows] = failures({ UBanner: restyled, UInputRating: staying, UBadge: passing })
      expect(fix).toBe(
        `${later} For \`UInputRating\` the fix is open work: it stays at level 1 for 1.0.0, so no new level brings it.`,
      )
      expect(rows).toContain('`UBanner`')
      expect(rows).toContain('`UInputRating`')
      expect(rows).not.toContain('`UBadge`')
    })

    test('no other components when every failure left is open work', () => {
      expect(failures({ UInputRating: staying, UBadge: passing })[0]).toBe(
        'For `UInputRating` the fix is open work: it stays at level 1 for 1.0.0, so no new level brings it.',
      )
      expect(failures({ UBanner: restyled, UBadge: passing })[0]).toBe(later)
    })

    test('nothing of a failure when none fails', () => {
      expect(
        failures({ UBadge: passing, UColorPicker: { family: 'form', today: 1, target: 1 } }),
      ).toEqual([])
    })
  })

  test('say no component passes level 1 that no check ran on: a part has the result of the component that draws it', () => {
    const readme = readFileSync(README, 'utf8')
    // the table of every component: its name and whether it passes level 1
    const passes = new Map(
      readme
        .slice(readme.indexOf('<summary>Every component</summary>'), readme.indexOf('</details>'))
        .split('\n')
        .filter((line) => line.startsWith('| `'))
        .map((line) => line.split('|').map((cell) => cell.trim()))
        .map((cells): [string, string] => [cells[1]!.replaceAll('`', ''), cells[6]!]),
    )
    for (const [name, { unshown }] of entries) {
      if (unshown?.why === 'nothing')
        expect(passes.get(name), name).toBe('Not checked: draws nothing')
      if (unshown?.why === 'part')
        expect(passes.get(name), name).toBe(
          `${passes.get(unshown.drawnBy)} (checked through \`${unshown.drawnBy}\`)`,
        )
    }
    // the list the context menu draws fails where the menu does
    expect(passes.get('UContextMenuContent')).toBe(
      'No: forced-edge (checked through `UContextMenu`)',
    )
  })
})
