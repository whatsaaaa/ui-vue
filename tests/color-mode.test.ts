import { Window } from 'happy-dom'
import { describe, expect, test } from 'vitest'
import { colorModeInitScript } from '../packages/ui-vue/src/color-mode.ts'

interface Page {
  system: 'dark' | 'light'
  stored?: string
  markup?: { theme?: string; class?: string }
}

/** Runs the head script in a page, as the browser does before the first paint. */
function headScript({ system, stored, markup = {} }: Page) {
  const window = new Window({ settings: { device: { prefersColorScheme: system } } })
  const html = window.document.documentElement
  if (stored) window.localStorage.setItem('ws-theme', stored)
  if (markup.theme) html.dataset.theme = markup.theme
  if (markup.class) html.className = markup.class
  new Function('document', 'localStorage', 'matchMedia', colorModeInitScript)(
    window.document,
    window.localStorage,
    window.matchMedia.bind(window),
  )
  return { theme: html.dataset.theme ?? null, class: html.className }
}

describe('the head script', () => {
  test('with nothing chosen, follows the system', () => {
    expect(headScript({ system: 'dark' })).toEqual({ theme: null, class: 'dark' })
    expect(headScript({ system: 'light' })).toEqual({ theme: null, class: 'light' })
  })

  test("reads @nuxtjs/color-mode's system as nothing chosen", () => {
    expect(headScript({ system: 'light', stored: 'system' })).toEqual({
      theme: null,
      class: 'light',
    })
  })

  test('applies a remembered choice over the system', () => {
    expect(headScript({ system: 'dark', stored: 'light' })).toEqual({
      theme: 'light',
      class: 'light',
    })
    expect(headScript({ system: 'light', stored: 'dark' })).toEqual({
      theme: 'dark',
      class: 'dark',
    })
  })

  test('takes a data-theme in the markup, and gives it its class', () => {
    expect(headScript({ system: 'dark', markup: { theme: 'light' } })).toEqual({
      theme: 'light',
      class: 'light',
    })
  })

  test('takes a dark or light class in the markup as the choice', () => {
    expect(headScript({ system: 'light', markup: { class: 'dark' } })).toEqual({
      theme: 'dark',
      class: 'dark',
    })
    // a remembered choice is the visitor's, and wins over the markup's
    expect(headScript({ system: 'light', stored: 'light', markup: { class: 'dark' } })).toEqual({
      theme: 'light',
      class: 'light',
    })
  })
})
