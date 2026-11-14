import { join } from 'node:path'
import { compile } from '@tailwindcss/node'
import { expect, test } from '@playwright/test'
import { playground } from './pages.ts'

type Theme = 'dark' | 'light'

interface Case {
  /** What sets the theme: data-theme, a dark or light class, or the system. */
  by: 'the system' | 'data-theme' | 'the class'
  system: Theme
  /** The attributes of <html>. */
  html?: Record<string, string>
  /** The page, with the element that takes the theme marked #probe. */
  body: string
  theme: Theme
}

const CASES: Case[] = [
  { by: 'the system', system: 'dark', body: '<p id="probe"></p>', theme: 'dark' },
  { by: 'the system', system: 'light', body: '<p id="probe"></p>', theme: 'light' },

  // on <html>, as the head script and the color mode set it
  {
    by: 'data-theme',
    system: 'light',
    html: { 'data-theme': 'dark' },
    body: '<p id="probe"></p>',
    theme: 'dark',
  },
  {
    by: 'data-theme',
    system: 'dark',
    html: { 'data-theme': 'light' },
    body: '<p id="probe"></p>',
    theme: 'light',
  },

  // on the element itself
  {
    by: 'data-theme',
    system: 'light',
    body: '<p id="probe" data-theme="dark"></p>',
    theme: 'dark',
  },
  {
    by: 'data-theme',
    system: 'dark',
    body: '<p id="probe" data-theme="light"></p>',
    theme: 'light',
  },

  // in a part of the page kept in the other theme
  {
    by: 'data-theme',
    system: 'dark',
    html: { 'data-theme': 'dark' },
    body: '<div data-theme="light"><p id="probe"></p></div>',
    theme: 'light',
  },
  {
    by: 'data-theme',
    system: 'light',
    html: { 'data-theme': 'light' },
    body: '<div data-theme="dark"><p id="probe"></p></div>',
    theme: 'dark',
  },
  {
    by: 'data-theme',
    system: 'dark',
    body: '<div data-theme="light"><p id="probe"></p></div>',
    theme: 'light',
  },
  {
    by: 'data-theme',
    system: 'light',
    body: '<div data-theme="dark"><p id="probe"></p></div>',
    theme: 'dark',
  },

  // a data-theme wins over the class, on the same element
  {
    by: 'data-theme',
    system: 'dark',
    html: { class: 'dark', 'data-theme': 'light' },
    body: '<p id="probe"></p>',
    theme: 'light',
  },
  {
    by: 'data-theme',
    system: 'light',
    body: '<p id="probe" class="light" data-theme="dark"></p>',
    theme: 'dark',
  },

  // the class alone, on <html>, as Nuxt UI's color mode puts it, against the system both ways
  {
    by: 'the class',
    system: 'light',
    html: { class: 'dark' },
    body: '<p id="probe"></p>',
    theme: 'dark',
  },
  {
    by: 'the class',
    system: 'dark',
    html: { class: 'light' },
    body: '<p id="probe"></p>',
    theme: 'light',
  },

  // both classes choose nothing
  {
    by: 'the system',
    system: 'light',
    html: { class: 'dark light' },
    body: '<p id="probe"></p>',
    theme: 'light',
  },

  // the class on a part of the page or on the element: the nearest choice holds, made either way
  {
    by: 'the class',
    system: 'dark',
    body: '<div class="light"><p id="probe"></p></div>',
    theme: 'light',
  },
  { by: 'the class', system: 'light', body: '<p id="probe" class="dark"></p>', theme: 'dark' },
  {
    by: 'the class',
    system: 'dark',
    html: { class: 'dark' },
    body: '<div class="light"><p id="probe"></p></div>',
    theme: 'light',
  },
  {
    by: 'the class',
    system: 'dark',
    html: { class: 'dark', 'data-theme': 'dark' },
    body: '<div class="light"><p id="probe"></p></div>',
    theme: 'light',
  },
  {
    by: 'the class',
    system: 'light',
    html: { class: 'light', 'data-theme': 'light' },
    body: '<div class="dark"><p id="probe"></p></div>',
    theme: 'dark',
  },
  {
    by: 'data-theme',
    system: 'dark',
    html: { class: 'light' },
    body: '<div data-theme="dark"><p id="probe"></p></div>',
    theme: 'dark',
  },
  {
    by: 'data-theme',
    system: 'dark',
    html: { class: 'dark' },
    body: '<div data-theme="light"><p id="probe"></p></div>',
    theme: 'light',
  },

  // a part inside a part, back in the page's theme
  {
    by: 'the class',
    system: 'light',
    html: { class: 'dark' },
    body: '<div class="light"><div class="dark"><p id="probe"></p></div></div>',
    theme: 'dark',
  },
  {
    by: 'the class',
    system: 'dark',
    html: { class: 'light' },
    body: '<div class="dark"><div data-theme="light"><p id="probe"></p></div></div>',
    theme: 'light',
  },
]

/**
 * index.css as the gallery builds it, Nuxt UI's generated stylesheet included, with a class of
 * each variant: dark:underline and light:italic.
 */
async function stylesheet(): Promise<string> {
  const root = join(import.meta.dirname, '../..')
  const compiler = await compile(`@import './index.css';`, {
    base: join(root, 'packages/ui-vue/src'),
    onDependency: () => {},
    customCssResolver: async (id) =>
      id === '#build/ui.css' ? join(root, 'playgrounds/nuxt/.nuxt/ui.css') : undefined,
  })
  return compiler.build(['dark:underline', 'light:italic'])
}

test("dark:, light: and Nuxt UI's colors follow the theme of the element, as the tokens do", async ({
  page,
}, testInfo) => {
  test.skip(playground(testInfo) !== 'nuxt', "The gallery's stylesheet, the same on both pages")
  // two elements in each theme, to read the tokens of a theme from
  await page.setContent(
    `<style>${await stylesheet()}</style>
    <div id="dark" data-theme="dark"></div>
    <div id="light" data-theme="light"></div>
    <main></main>`,
  )
  for (const { by, system, html = {}, body, theme } of CASES) {
    await page.emulateMedia({ colorScheme: system })
    const shown = await page.evaluate(
      ([html, body]) => {
        const root = document.documentElement
        root.removeAttribute('class')
        root.removeAttribute('data-theme')
        for (const [name, value] of Object.entries(html)) root.setAttribute(name, value)
        document.querySelector('main')!.innerHTML = body
        const probe = document.getElementById('probe')!
        probe.classList.add('dark:underline', 'light:italic')
        const background = (id: string) =>
          getComputedStyle(document.getElementById(id)!).getPropertyValue('--ws-color-bg')
        const style = getComputedStyle(probe)
        return {
          dark: style.textDecorationLine === 'underline',
          light: style.fontStyle === 'italic',
          tokens: [background('dark'), background('light')].indexOf(background('probe')),
          nuxtUi: style.getPropertyValue('--ui-bg') === style.getPropertyValue('--ws-color-bg'),
        }
      },
      [html, body] as const,
    )
    const where = `${by} on a ${system} system: <html ${JSON.stringify(html)}> ${body}`
    expect({ dark: shown.dark, light: shown.light }, where).toEqual({
      dark: theme === 'dark',
      light: theme === 'light',
    })
    expect(shown.nuxtUi, `Nuxt UI's page color is the tokens', ${where}`).toBe(true)
    expect(shown.tokens, `the tokens, ${where}`).toBe(theme === 'dark' ? 0 : 1)
  }
})
