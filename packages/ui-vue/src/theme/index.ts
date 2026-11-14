import badge from './badge.ts'
import button from './button.ts'
import card from './card.ts'
import checkbox from './checkbox.ts'
import formField from './form-field.ts'
import input from './input.ts'
import modal from './modal.ts'
import radioGroup from './radio-group.ts'
import selectMenu from './select-menu.ts'
import select from './select.ts'
import { colors } from './shared.ts'
import table from './table.ts'
import tabs from './tabs.ts'

/**
 * The text styles of the Tailwind entry. tailwind-merge, which Nuxt UI resolves conflicting
 * classes with, has to know them as font sizes: otherwise it takes text-label for a color, and
 * drops it next to text-text, or keeps it next to Tailwind's text-sm.
 */
const textStyles = [
  'display',
  'display-compact',
  'h1',
  'h1-compact',
  'h2',
  'h2-compact',
  'h3',
  'h4',
  'lead',
  'body',
  'body-sm',
  'label',
  'label-sm',
  'caption',
  'overline',
  'code',
]

/**
 * The module options: the theme's colors, without secondary. Nuxt UI's transitions stay on:
 * the component themes take them off for a reader who asks for less motion. Turned off here,
 * Nuxt UI's generated theme types would no longer take a variant's classes slot by slot.
 */
export const theme = {
  colors: [...colors],
}

/**
 * The app config: what app.config.ts gives defineAppConfig as ui on Nuxt, and the Vite plugin
 * takes as ui on Vue.
 */
export const ui = {
  tv: {
    twMergeConfig: {
      extend: {
        theme: { text: textStyles },
      },
    },
  },
  badge,
  button,
  card,
  checkbox,
  formField,
  input,
  modal,
  radioGroup,
  select,
  selectMenu,
  table,
  tabs,
}
