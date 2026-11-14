// @vitest-environment happy-dom
import { setTheme, toggleTheme } from '@whatsaaaa/design-system/theme'
import { afterEach, describe, expect, test } from 'vitest'
import { nextTick, reactive } from 'vue'
import {
  bindThemeModule,
  colorModeInitScript,
  vueColorModeInitScript,
} from '../packages/ui-vue/src/color-mode.ts'

const html = document.documentElement

afterEach(() => {
  localStorage.clear()
  html.removeAttribute('class')
  html.removeAttribute('data-theme')
})

/** Runs a head script, as the browser does before the first paint. */
function run(script: string) {
  new Function(script)()
  return { theme: html.dataset.theme ?? null, class: html.className }
}

describe('the head script', () => {
  test('forgets a theme the design system remembered, which would win over the class', () => {
    localStorage.setItem('ws-theme', 'dark')
    expect(run(colorModeInitScript)).toEqual({ theme: null, class: '' })
    expect(localStorage.getItem('ws-theme')).toBeNull()
  })

  test("on Vue, puts VueUse's remembered choice on <html> as the class", () => {
    localStorage.setItem('vueuse-color-scheme', 'light')
    localStorage.setItem('ws-theme', 'dark')
    expect(run(vueColorModeInitScript)).toEqual({ theme: null, class: 'light' })
    expect(localStorage.getItem('ws-theme')).toBeNull()
  })

  test('on Vue, leaves the theme to the system while VueUse follows it', () => {
    expect(run(vueColorModeInitScript)).toEqual({ theme: null, class: '' })
    localStorage.setItem('vueuse-color-scheme', 'auto')
    expect(run(vueColorModeInitScript)).toEqual({ theme: null, class: '' })
  })
})

describe("the theme module's switch", () => {
  /** A color mode's preference, bound to the theme module. */
  function colorMode(preference: string) {
    const mode = reactive({ preference })
    const stop = bindThemeModule(mode)
    return { mode, stop }
  }

  /** Lets the observer and the watcher run. */
  const settle = async () => {
    await new Promise((resolve) => setTimeout(resolve))
    await nextTick()
  }

  test("data-theme names the color mode's choice, and none while it follows the system", async () => {
    const { mode, stop } = colorMode('dark')
    expect(html.dataset.theme).toBe('dark')

    mode.preference = 'light'
    await settle()
    expect(html.dataset.theme).toBe('light')
    expect(mode.preference).toBe('light')

    mode.preference = 'system'
    await settle()
    expect(html.dataset.theme).toBeUndefined()
    expect(mode.preference).toBe('system')
    stop()
  })

  test('setTheme and toggleTheme move the color mode', async () => {
    const { mode, stop } = colorMode('system')

    setTheme('light')
    await settle()
    expect(mode.preference).toBe('light')

    expect(toggleTheme()).toBe('dark')
    await settle()
    expect(mode.preference).toBe('dark')

    setTheme('system')
    await settle()
    expect(mode.preference).toBe('system')
    expect(html.dataset.theme).toBeUndefined()
    stop()
  })

  test("setTheme('system') reaches a choice made with the color mode", async () => {
    const { mode, stop } = colorMode('system')
    mode.preference = 'dark'
    await settle()

    setTheme('system')
    await settle()
    expect(mode.preference).toBe('system')
    stop()
  })

  test('stops', async () => {
    const { mode, stop } = colorMode('dark')
    stop()
    setTheme('light')
    await settle()
    expect(mode.preference).toBe('dark')
  })
})
