/**
 * The README's coverage tables, and what it says of the fixes its known failures wait for, drawn
 * from the levels file: `node scripts/levels-readme.ts` writes them between the two markers in
 * README.md, and tests/levels.test.ts fails when the README has other ones than these.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  type ComponentLevels,
  type Family,
  type Level,
  components,
  families,
  shownOn,
} from '../packages/ui-vue/levels.ts'

export const README = join(import.meta.dirname, '../README.md')

const START = '<!-- levels:start -->'
const END = '<!-- levels:end -->'

/** The families as the README names them. */
const titles: Record<Family, string> = {
  element: 'Element',
  form: 'Form',
  data: 'Data',
  navigation: 'Navigation',
  overlay: 'Overlay',
  layout: 'Layout',
  page: 'Page',
  dashboard: 'Dashboard',
  chat: 'Chat',
  editor: 'Editor',
  content: 'Content',
  'color-mode': 'Color mode',
  locale: 'Locale',
  prose: 'Prose',
  internal: 'Internal parts',
}

const entries = Object.entries(components) as [string, ComponentLevels][]
const byName: Record<string, ComponentLevels> = components

/** A Markdown table as the formatter writes it: every column as wide as its widest cell. */
function table(head: string[], rows: string[][]): string {
  const widths = head.map((cell, column) =>
    Math.max(cell.length, 3, ...rows.map((row) => row[column]!.length)),
  )
  const line = (cells: string[]) =>
    `| ${cells.map((cell, column) => cell.padEnd(widths[column]!)).join(' | ')} |`
  return [line(head), line(widths.map((width) => '-'.repeat(width))), ...rows.map(line)].join('\n')
}

/** How many of the components given are at a level, today or for 1.0.0. */
const count = (of: ComponentLevels[], when: 'today' | 'target', level: Level) =>
  String(of.filter((component) => component[when] === level).length)

/**
 * One row for each family, and one for all of them. A component that fails a level 1 check is
 * counted apart from the ones that pass them all, whatever its level today, and one the gallery
 * does not show apart from both: no check runs on it on its own.
 */
function summary(): string {
  const row = (title: string, of: ComponentLevels[]) => [
    title,
    String(of.length),
    count(of, 'today', 3),
    count(of, 'today', 2),
    count(of, 'today', 1),
    String(of.filter((component) => !component.unshown && !component.fails).length),
    String(of.filter((component) => component.fails).length),
    String(of.filter((component) => component.unshown).length),
    count(of, 'target', 3),
    count(of, 'target', 2),
    count(of, 'target', 1),
  ]
  return table(
    [
      'Family',
      'Components',
      'Level 3 today',
      'Level 2 today',
      'Level 1 today',
      'Pass every level 1 check',
      'Fail a level 1 check',
      'Not in the gallery',
      'Level 3 for 1.0.0',
      'Level 2 for 1.0.0',
      'Level 1 for 1.0.0',
    ],
    [
      ...families.map((family) =>
        row(
          titles[family],
          entries.filter(([, component]) => component.family === family).map(([, c]) => c),
        ),
      ),
      row(
        '**All**',
        entries.map(([, component]) => component),
      ),
    ],
  )
}

/** Names as the README lists them: `A`, `B` and `C`. */
function listed(names: string[]): string {
  const quoted = names.map((name) => `\`${name}\``)
  return quoted.length < 2
    ? quoted.join('')
    : `${quoted.slice(0, -1).join(', ')} and ${quoted.at(-1)}`
}

/**
 * Where the fix of a known failure is to come from: with the restyling or the spec of the level a
 * component is to reach for 1.0.0. One whose level for 1.0.0 is the level it is at today has none
 * of these to come, so its fix is open work.
 */
function fixes(): string {
  const later = 'the fix comes with the restyling or the spec their level for 1.0.0 asks for'
  const open = entries.filter(([, { fails, today, target }]) => fails && today === target)
  if (open.length === 0) return `For each component that fails a level 1 check, ${later}.`
  const one = open.length === 1
  const levels = [...new Set(open.map(([, { today }]) => today))]
  const stay =
    levels.length === 1
      ? `${one ? 'it stays' : 'they stay'} at level ${levels[0]}`
      : 'they stay at the level they are at today'
  return [
    `For ${listed(open.map(([name]) => name))} the fix is open work, with no pull request planned`,
    `yet: ${stay} for 1.0.0. For the other components that fail a level 1 check, ${later}.`,
  ].join(' ')
}

/** One row for each known failure: the components that do not pass level 1 yet, by family. */
function failing(): string {
  return table(
    ['Component', 'Today', 'For 1.0.0', 'Check it fails', 'In', 'Parts', 'What fails'],
    families.flatMap((family) =>
      entries
        .filter(([, component]) => component.family === family)
        .flatMap(([name, { today, target, fails = [] }]) =>
          fails.map(({ check, themes, slots, note }) => [
            `\`${name}\``,
            String(today),
            String(target),
            check,
            themes.join(', '),
            slots.join(', '),
            note,
          ]),
        ),
    ),
  )
}

/** Where the gallery shows a component, or that it does not. */
function shown(component: ComponentLevels): string {
  if (component.unshown)
    return { nothing: 'No: draws nothing', part: 'No: an internal part' }[component.unshown.why]
  return { gallery: 'Gallery', others: 'Others' }[shownOn(component)!]
}

/**
 * Whether a component passes the level 1 checks, and the ones it fails where it does not. One
 * that draws nothing is not checked, and a part is checked through the component that draws it.
 */
function passes({ fails, unshown }: ComponentLevels): string {
  if (unshown?.why === 'nothing') return 'Not checked: draws nothing'
  if (unshown?.why === 'part')
    return `${passes(byName[unshown.drawnBy]!)} (checked through \`${unshown.drawnBy}\`)`
  if (!fails) return 'Yes'
  return `No: ${[...new Set(fails.map(({ check }) => check))].sort().join(', ')}`
}

/** One row for each component, by family. */
function all(): string {
  return table(
    ['Component', 'Family', 'Today', 'For 1.0.0', 'In the gallery', 'Passes level 1'],
    families.flatMap((family) =>
      entries
        .filter(([, component]) => component.family === family)
        .map(([name, component]) => [
          `\`${name}\``,
          titles[family],
          String(component.today),
          String(component.target),
          shown(component),
          passes(component),
        ]),
    ),
  )
}

/** What stands between the markers. */
export function levelsTables(): string {
  return [
    summary(),
    'A component that is not in the gallery is counted apart from the ones that pass or fail: one that draws nothing of its own is not checked, and an internal part is checked through the component that draws it.',
    fixes(),
    'The components that do not pass level 1 yet, with each check they fail:',
    failing(),
    '<details>',
    '<summary>Every component</summary>',
    all(),
    '</details>',
  ].join('\n\n')
}

/** The README given, with the tables between its markers. */
export function withLevelsTables(readme: string): string {
  const [start, end] = [readme.indexOf(START), readme.indexOf(END)]
  if (start < 0 || end < start) throw new Error(`README.md has no ${START} before ${END}`)
  return `${readme.slice(0, start + START.length)}\n\n${levelsTables()}\n\n${readme.slice(end)}`
}

if (import.meta.main) writeFileSync(README, withLevelsTables(readFileSync(README, 'utf8')))
