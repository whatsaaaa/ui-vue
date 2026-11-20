import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { resolver } from '@whatsaaaa/design-system/tokens'
import { type Selector, transform } from 'lightningcss'
import { describe, expect, it } from 'vitest'

const source = join(import.meta.dirname, '../packages/ui-vue/src')

const SHEET = 'nuxt-ui.css'

/**
 * A selector as CSS writes it, where it is one that chooses a theme: a class, an attribute that
 * is there, :root or :host. Any other part is written as lightningcss reads it.
 */
const written = (selector: Selector) =>
  selector
    .map((part) => {
      if (part.type === 'class') return `.${part.name}`
      if (part.type === 'attribute' && !part.operation) return `[${part.name}]`
      if (
        part.type === 'pseudo-class' &&
        (part.kind === 'root' || (part.kind === 'host' && !part.selectors))
      )
        return `:${part.kind}`
      return JSON.stringify(part)
    })
    .join('')

/**
 * What the stylesheet given has: the kind of each rule, at any depth, the selectors of its style
 * rules, each custom property it declares with the variable it is, where it is just one, each
 * variable it reads, and what it imports, in order.
 */
function parse(file: string) {
  const rules: string[] = []
  const selectors: string[] = []
  const declared = new Map<string, string | undefined>()
  const reads = new Set<string>()
  const imports: string[] = []
  transform({
    filename: file,
    code: readFileSync(join(source, file)),
    // Tailwind's at-rules, in index.css
    errorRecovery: true,
    visitor: {
      Rule(rule) {
        rules.push(rule.type)
        if (rule.type === 'import') imports.push(rule.value.url)
      },
      Selector(selector) {
        selectors.push(written(selector))
      },
      Declaration: {
        custom({ name, value: [first, ...rest] }) {
          const only = first?.type === 'var' && !first.value.fallback && rest.length === 0
          declared.set(name, only ? first.value.name.ident : undefined)
        },
      },
      Variable(variable) {
        reads.add(variable.name.ident)
      },
    },
  })
  return { rules, selectors, declared, reads, imports }
}

describe("the Nuxt UI colors, the stylesheet that points Nuxt UI's variables at the roles", () => {
  it("is imported last by index.css, after Nuxt UI's stylesheet, and from the package", () => {
    const { imports } = parse('index.css')
    expect(imports.at(-1)).toBe(`./${SHEET}`)
    expect(imports.indexOf('@nuxt/ui')).toBeGreaterThanOrEqual(0)
    expect(imports.filter((url) => url.endsWith('/nuxt-ui.css'))).toEqual([`./${SHEET}`])
  })

  it('points the variables the usage guide names at their roles, and leaves out secondary', () => {
    const { declared } = parse(SHEET)
    expect(Object.fromEntries(declared)).toMatchObject({
      '--ui-primary': '--ws-color-interactive',
      '--ui-success': '--ws-color-tip',
      '--ui-info': '--ws-color-note',
      '--ui-warning': '--ws-color-warning',
      '--ui-error': '--ws-color-danger',
      // the faint text color is under 4.5:1 on the page, and Nuxt UI sets text in its dimmed one
      '--ui-text-dimmed': '--ws-color-text-secondary',
      '--ui-text-muted': '--ws-color-text-secondary',
      '--ui-radius': '--ws-radius-sm',
      '--ui-header-height': '--ws-size-tab-bar',
    })
    expect(declared.has('--ui-secondary')).toBe(false)
  })

  it("reads only the design system's tokens", () => {
    const { reads } = parse(SHEET)
    const variables = new Set(
      resolver
        .listPermutations()
        .flatMap((input) =>
          Object.keys(resolver.apply(input)).map((id) => `--ws-${id.replaceAll('.', '-')}`),
        ),
    )
    expect([...reads]).toEqual(
      expect.arrayContaining(['--ws-color-interactive', '--ws-color-bg', '--ws-color-text']),
    )
    expect([...reads].filter((name) => !variables.has(name))).toEqual([])
  })

  it('keeps every rule outside a layer, so it wins over the values Nuxt UI keeps in its own', () => {
    expect(parse(SHEET).rules).toEqual(['style'])
  })

  it('declares the variables on the root and on every element that chooses a theme', () => {
    expect(parse(SHEET).selectors).toEqual([':root', ':host', '[data-theme]', '.dark', '.light'])
  })
})
