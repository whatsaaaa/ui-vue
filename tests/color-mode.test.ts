// @vitest-environment happy-dom
import { afterEach, describe, expect, test } from 'vitest'
import { colorModeInitScript, vueColorModeInitScript } from '../packages/ui-vue/src/color-mode.ts'

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
