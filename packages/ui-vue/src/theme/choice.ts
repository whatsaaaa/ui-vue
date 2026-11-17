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

/**
 * A checked card: the border in the color, on the color's tint. The border is given again for a
 * focused card, where it wins over the plain border of cardFocus.
 */
export const checkedCard: ByColor = {
  primary:
    'has-data-[state=checked]:border-interactive has-data-[state=checked]:bg-tag-bg not-has-disabled:has-focus-visible:has-data-[state=checked]:border-interactive',
  success:
    'has-data-[state=checked]:border-tip has-data-[state=checked]:bg-tip-tint not-has-disabled:has-focus-visible:has-data-[state=checked]:border-tip',
  info: 'has-data-[state=checked]:border-note has-data-[state=checked]:bg-note-tint not-has-disabled:has-focus-visible:has-data-[state=checked]:border-note',
  warning:
    'has-data-[state=checked]:border-warning has-data-[state=checked]:bg-warning-tint not-has-disabled:has-focus-visible:has-data-[state=checked]:border-warning',
  error:
    'has-data-[state=checked]:border-danger has-data-[state=checked]:bg-danger-tint not-has-disabled:has-focus-visible:has-data-[state=checked]:border-danger',
  neutral:
    'has-data-[state=checked]:border-text has-data-[state=checked]:bg-raised not-has-disabled:has-focus-visible:has-data-[state=checked]:border-text',
}

/**
 * A checked card in forced colors: the border in the selection color, which a card without its
 * control shows its state by alone.
 */
export const forcedCheckedCard = 'forced-colors:has-data-[state=checked]:border-[Highlight]'

/** A highlighted control, as with an error, takes its color as the outline. */
export const highlight: ByColor = {
  primary: 'ring-interactive hover:ring-interactive',
  success: 'ring-tip hover:ring-tip',
  info: 'ring-note hover:ring-note',
  warning: 'ring-warning hover:ring-warning',
  error: 'ring-danger hover:ring-danger',
  neutral: 'ring-text hover:ring-text',
}

/** A highlighted card: the border in its color, focused too, as with checkedCard. */
export const highlightCard: ByColor = {
  primary:
    'not-has-disabled:not-has-aria-disabled:border-interactive not-has-disabled:not-has-aria-disabled:has-focus-visible:border-interactive',
  success:
    'not-has-disabled:not-has-aria-disabled:border-tip not-has-disabled:not-has-aria-disabled:has-focus-visible:border-tip',
  info: 'not-has-disabled:not-has-aria-disabled:border-note not-has-disabled:not-has-aria-disabled:has-focus-visible:border-note',
  warning:
    'not-has-disabled:not-has-aria-disabled:border-warning not-has-disabled:not-has-aria-disabled:has-focus-visible:border-warning',
  error:
    'not-has-disabled:not-has-aria-disabled:border-danger not-has-disabled:not-has-aria-disabled:has-focus-visible:border-danger',
  neutral:
    'not-has-disabled:not-has-aria-disabled:border-text not-has-disabled:not-has-aria-disabled:has-focus-visible:border-text',
}

/**
 * The control and the label beside it. The container is as tall as the label's first line, so
 * the control sits centered on it.
 */
export const choiceSizes = {
  xs: { base: 'size-3.5', container: 'h-6', wrapper: 'text-body-sm' },
  sm: { base: 'size-4', container: 'h-6', wrapper: 'text-body-sm' },
  md: { base: 'size-check', container: 'h-6', wrapper: 'text-body leading-normal' },
  lg: { base: 'size-5.5', container: 'h-7', wrapper: 'text-lead leading-7' },
  xl: { base: 'size-6', container: 'h-7', wrapper: 'text-lead leading-7' },
}

/** The focus ring of the control, three pixels out from it, and of a card, out from the card. */
export const choiceFocus =
  'outline-interactive focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-3 focus-visible:ring-field-border'
export const cardFocus =
  'outline-interactive has-focus-visible:outline-2 has-focus-visible:outline-solid has-focus-visible:outline-offset-3 not-has-disabled:has-focus-visible:border-border'
