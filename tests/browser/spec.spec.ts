import { test } from '@playwright/test'
import { expectSpec } from '@whatsaaaa/design-system/testing'
import { open, playground } from './pages.ts'

/*
 * The gallery against the design system's component specs: each example of a spec's gallery
 * contract is marked with its id in data-spec, and the helper measures each part of it, by the
 * slot ui-vue's entry in the spec maps it to, against the spec's tokens, in both themes and in
 * forced colors. A spec a release of the design system changes fails here until the theme
 * follows it.
 */

/**
 * The specs the gallery is held to, and the page of each one's examples. An open list or modal
 * holds the page it is on, so the select's, the select menu's and the modal's are on a page of
 * their own.
 */
const specs = {
  button: '/',
  checkbox: '/',
  input: '/',
  'radio-group': '/',
  select: '/open',
  'select-menu': '/open',
  modal: '/open',
}

for (const [name, path] of Object.entries(specs))
  test(`the gallery meets the ${name} spec`, async ({ page }, testInfo) => {
    test.skip(playground(testInfo) !== 'nuxt', 'The examples are in the gallery')
    await open(page, path)
    await expectSpec(page, name, { implementation: 'ui-vue' })
  })
