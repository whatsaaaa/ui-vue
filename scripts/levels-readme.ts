/**
 * The README's coverage tables, drawn from the levels file: `node scripts/levels-readme.ts`
 * writes them between the two markers in README.md, and tests/levels.test.ts fails when the
 * README has other tables than these.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  type ComponentLevels,
  type Family,
  type Level,
  components,
  families,
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

/** One row for each family, and one for all of them. */
function summary(): string {
  const row = (title: string, of: ComponentLevels[]) => [
    title,
    String(of.length),
    count(of, 'today', 3),
    count(of, 'today', 2),
    count(of, 'today', 1),
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

/** Where the gallery shows a component, or that it does not. */
function shown({ shown }: ComponentLevels): string {
  if (shown === 'gallery') return 'Gallery'
  if (shown === 'others') return 'Others'
  return { nothing: 'No: draws nothing', part: 'No: an internal part' }[shown.unshown]
}

/** The level 1 checks a component fails, each once, with the theme where it is only one. */
function fails({ fails = [] }: ComponentLevels): string {
  return [...new Set(fails.map(({ check, theme }) => (theme ? `${check} (${theme})` : check)))]
    .sort()
    .join(', ')
}

/** One row for each component, by family. */
function all(): string {
  return table(
    ['Component', 'Family', 'Today', 'For 1.0.0', 'In the gallery', 'Known level 1 failures'],
    families.flatMap((family) =>
      entries
        .filter(([, component]) => component.family === family)
        .map(([name, component]) => [
          `\`${name}\``,
          titles[family],
          String(component.today),
          String(component.target),
          shown(component),
          fails(component),
        ]),
    ),
  )
}

/** What stands between the markers. */
export function levelsTables(): string {
  return [summary(), '<details>', '<summary>Every component</summary>', all(), '</details>'].join(
    '\n\n',
  )
}

/** The README given, with the tables between its markers. */
export function withLevelsTables(readme: string): string {
  const [start, end] = [readme.indexOf(START), readme.indexOf(END)]
  if (start < 0 || end < start) throw new Error(`README.md has no ${START} before ${END}`)
  return `${readme.slice(0, start + START.length)}\n\n${levelsTables()}\n\n${readme.slice(end)}`
}

if (import.meta.main) writeFileSync(README, withLevelsTables(readFileSync(README, 'utf8')))
