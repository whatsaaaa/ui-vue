import badge from './badge.ts'
import button from './button.ts'
import card from './card.ts'
import checkbox from './checkbox.ts'
import formField from './form-field.ts'
import inputNumber from './input-number.ts'
import input from './input.ts'
import modal from './modal.ts'
import radioGroup from './radio-group.ts'
import selectMenu from './select-menu.ts'
import select from './select.ts'
import { colors } from './shared.ts'
import table from './table.ts'
import tabs from './tabs.ts'
import textarea from './textarea.ts'

/*
 * The names the design system's Tailwind entry adds to Tailwind's. tailwind-merge, which Nuxt UI
 * resolves conflicting classes with, has to know each in its utility. Otherwise it keeps both of
 * h-control and h-12, or of ease-standard and ease-out, so that Tailwind's order of the two
 * decides and not which comes last; and it takes text-label or border-thick for a color, one
 * that drops text-text or border-border, or is dropped by them.
 */

/** The text styles, as font sizes. */
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
  'tagline',
  'tagline-compact',
  'body',
  'body-sm',
  'label',
  'label-sm',
  'caption',
  'overline',
  'code',
]

/** The sizes, as spacing: h-control, size-check, max-w-content. */
const sizes = [
  'check',
  'check-xs',
  'check-sm',
  'check-lg',
  'check-xl',
  'content',
  'control',
  'control-xs',
  'control-sm',
  'control-lg',
  'control-xl',
  'frame',
  'icon',
  'icon-lg',
  'outline',
  'sidebar',
  'status-line',
  'step',
  'tab-bar',
  'tick-sm',
  'tick-lg',
]

/**
 * The border widths, which Tailwind takes on every side of a border and on the dividers:
 * tailwind-merge has no theme key for them, but a class group for each.
 */
const borderWidths = ['thin', 'medium', 'thick']
const borderWidthGroups = {
  ...Object.fromEntries(
    ['', '-x', '-y', '-s', '-e', '-bs', '-be', '-t', '-r', '-b', '-l'].map((side) => [
      `border-w${side}`,
      [{ [`border${side}`]: borderWidths }],
    ]),
  ),
  'divide-x': [{ 'divide-x': borderWidths }],
  'divide-y': [{ 'divide-y': borderWidths }],
}

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
        theme: { text: textStyles, spacing: sizes, ease: ['standard'] },
        classGroups: borderWidthGroups,
      },
    },
  },
  badge,
  button,
  card,
  checkbox,
  formField,
  input,
  inputNumber,
  modal,
  radioGroup,
  select,
  selectMenu,
  table,
  tabs,
  textarea,
}
