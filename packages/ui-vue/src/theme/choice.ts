import type { ByColor } from './shared.ts'

/*
 * What a checkbox and a radio group share: the controls of the sample apps. Twenty pixels, an
 * outline in the field border on the page color, the interactive fill when checked. The label
 * of an option is in Inter, on the line the control sits on. Disabled, all of it is faint.
 */

/** The fill of a checked control and the color of its mark: the solid fills of the buttons. */
export const checked: ByColor = {
  primary: 'bg-interactive text-on-interactive',
  success: 'bg-tip-text text-bg',
  info: 'bg-note-text text-bg',
  warning: 'bg-warning-text text-bg',
  error: 'bg-danger-text text-bg',
  neutral: 'bg-text text-bg',
}

/**
 * A card under the pointer, under the conditions Nuxt UI hovers it with, so these replace its
 * classes: the fill, and the border.
 */
export const cardHoverFill =
  'hover:not-has-disabled:not-has-aria-disabled:not-has-focus-visible:not-has-data-[state=checked]:bg-raised/50'
export const cardHoverBorder =
  'hover:not-has-disabled:not-has-aria-disabled:not-has-focus-visible:not-has-data-[state=checked]:border-field-border'

/** A checked card: the border in the color, on the color's tint. */
export const checkedCard: ByColor = {
  primary: 'has-data-[state=checked]:border-interactive has-data-[state=checked]:bg-tag-bg',
  success: 'has-data-[state=checked]:border-tip has-data-[state=checked]:bg-tip-tint',
  info: 'has-data-[state=checked]:border-note has-data-[state=checked]:bg-note-tint',
  warning: 'has-data-[state=checked]:border-warning has-data-[state=checked]:bg-warning-tint',
  error: 'has-data-[state=checked]:border-danger has-data-[state=checked]:bg-danger-tint',
  neutral: 'has-data-[state=checked]:border-text has-data-[state=checked]:bg-raised',
}

/** A highlighted control, as with an error, takes its color as the outline. */
export const highlight: ByColor = {
  primary: 'ring-interactive hover:ring-interactive',
  success: 'ring-tip hover:ring-tip',
  info: 'ring-note hover:ring-note',
  warning: 'ring-warning hover:ring-warning',
  error: 'ring-danger hover:ring-danger',
  neutral: 'ring-text hover:ring-text',
}

export const highlightCard: ByColor = {
  primary: 'not-has-disabled:not-has-aria-disabled:border-interactive',
  success: 'not-has-disabled:not-has-aria-disabled:border-tip',
  info: 'not-has-disabled:not-has-aria-disabled:border-note',
  warning: 'not-has-disabled:not-has-aria-disabled:border-warning',
  error: 'not-has-disabled:not-has-aria-disabled:border-danger',
  neutral: 'not-has-disabled:not-has-aria-disabled:border-text',
}

/**
 * The control and the label beside it. The container is as tall as the label's first line, so
 * the control sits centered on it.
 */
export const choiceSizes = {
  xs: { base: 'size-3.5', container: 'h-6', wrapper: 'text-body-sm' },
  sm: { base: 'size-4', container: 'h-6', wrapper: 'text-body-sm' },
  md: { base: 'size-5', container: 'h-6', wrapper: 'text-body leading-normal' },
  lg: { base: 'size-5.5', container: 'h-7', wrapper: 'text-lead leading-7' },
  xl: { base: 'size-6', container: 'h-7', wrapper: 'text-lead leading-7' },
}

/** The focus ring of the control, three pixels out from it, and of a card, out from the card. */
export const choiceFocus =
  'outline-interactive focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-3 focus-visible:ring-field-border'
export const cardFocus =
  'outline-interactive has-focus-visible:outline-2 has-focus-visible:outline-solid has-focus-visible:outline-offset-3 not-has-disabled:has-focus-visible:border-border'
