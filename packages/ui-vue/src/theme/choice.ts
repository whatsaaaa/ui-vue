import type { ByColor } from './shared.ts'

/*
 * What a checkbox and a radio group share: the control of the design system's checkbox and radio
 * group specs, specs/checkbox.spec.json and specs/radio-group.spec.json. Twenty pixels at md, an
 * edge in the field border on the page color, the interactive fill when checked. The label of an
 * option is in Inter, on the line the control sits on. Disabled, all of it is faint. They read the
 * component tier by name, --ws-choice-*, so a change of the tier reaches them.
 *
 * The edge is a border, not Nuxt UI's ring, so that forced colors keep it. The fill of a checked
 * control covers the control, its edge too: it is laid over the control's border box. The control
 * and its label take the pointer as one: HTML has a label's control under the pointer while the
 * label is, so the control's own hover lightens the edge on either, and not on the line about it.
 */

/** The control at rest: its edge, its fill, and the edge under the pointer. */
export const control =
  'relative overflow-visible ring-0 border-thin border-(--ws-choice-control-border-rest) bg-(--ws-choice-control-bg-rest) cursor-pointer hover:border-(--ws-choice-control-border-hover)'

/** The fill of a checked control, over the control and its edge, in the control's shape. */
export const indicator = 'absolute -inset-(--ws-border-width-thin) size-auto rounded-[inherit]'

/** The label of an option, and the line about it. */
export const label = 'font-sans font-normal text-(--ws-choice-label-text-rest) cursor-pointer'
export const description = 'font-sans text-(--ws-choice-description-text-rest) text-body-sm'

/** A disabled control, its label and its line: faint, and the same under the pointer. */
export const disabled = {
  base: 'cursor-not-allowed border-(--ws-choice-control-border-disabled) hover:border-(--ws-choice-control-border-disabled)',
  label: 'cursor-not-allowed text-(--ws-choice-label-text-disabled)',
  description: 'cursor-not-allowed text-(--ws-choice-description-text-disabled)',
}

/**
 * The fill of a checked control and the color of its mark: the solid fills of the buttons. The
 * spec's color is primary, which reads the tier, the indeterminate box's too. The state picks the
 * tokens into --choice-fill and --choice-mark, not the fill itself, so that a fill a variant gives
 * in forced colors or to a disabled box still wins over the indeterminate one.
 */
export const checked: ByColor = {
  primary:
    'bg-(--choice-fill) text-(--choice-mark) [--choice-fill:var(--ws-choice-indicator-bg-checked)] [--choice-mark:var(--ws-choice-indicator-icon-checked)] data-[state=indeterminate]:[--choice-fill:var(--ws-choice-indicator-bg-indeterminate)] data-[state=indeterminate]:[--choice-mark:var(--ws-choice-indicator-icon-indeterminate)]',
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
 * control shows its state by alone. It wins over every other border of the card, as a
 * highlighted or a focused card has, whose colors forced colors would replace.
 */
export const forcedCheckedCard = 'forced-colors:has-data-[state=checked]:border-[Highlight]!'

/**
 * A highlighted control takes its color as the edge, and keeps it under the pointer. A control in
 * error is highlighted in the error color: the tier's invalid edge.
 */
export const highlight: ByColor = {
  primary: 'border-interactive hover:border-interactive',
  success: 'border-tip hover:border-tip',
  info: 'border-note hover:border-note',
  warning: 'border-warning hover:border-warning',
  error:
    'border-(--ws-choice-control-border-invalid) hover:border-(--ws-choice-control-border-invalid)',
  neutral: 'border-text hover:border-text',
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
  xs: { base: 'size-(--ws-choice-control-size-xs)', container: 'h-6', wrapper: 'text-body-sm' },
  sm: { base: 'size-(--ws-choice-control-size-sm)', container: 'h-6', wrapper: 'text-body-sm' },
  md: {
    base: 'size-(--ws-choice-control-size-md)',
    container: 'h-6',
    wrapper: 'text-body leading-normal',
  },
  lg: {
    base: 'size-(--ws-choice-control-size-lg)',
    container: 'h-7',
    wrapper: 'text-lead leading-7',
  },
  xl: {
    base: 'size-(--ws-choice-control-size-xl)',
    container: 'h-7',
    wrapper: 'text-lead leading-7',
  },
}

/** The focus ring of the control, three pixels out from it, and of a card, out from the card. */
export const choiceFocus =
  'outline-interactive focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-3'
export const cardFocus =
  'outline-interactive has-focus-visible:outline-2 has-focus-visible:outline-solid has-focus-visible:outline-offset-3 not-has-disabled:has-focus-visible:border-border'
