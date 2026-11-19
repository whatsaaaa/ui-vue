import {
  cardFocus,
  cardHoverBorder,
  cardHoverFill,
  checked,
  checkedCard,
  choiceFocus,
  choiceSizes,
  control,
  description,
  disabled,
  forcedCheckedCard,
  highlight,
  highlightCard,
  indicator,
  label,
} from './choice.ts'
import { byColor, forcedChecked, forcedControlEdge, transition } from './shared.ts'

/*
 * A box with the smallest radius and a tick, as the design system's checkbox spec draws it. The
 * fill shows only while the box is checked or indeterminate, so a disabled box takes the faint
 * fill from the disabled variant alone: Nuxt UI passes its theme no checked variant.
 */
export default {
  slots: {
    base: `rounded-xs ${control} ${forcedControlEdge} ${transition}`,
    indicator: `${indicator} flex items-center justify-center ${forcedChecked}`,
    label,
    description,
  },
  variants: {
    color: {
      primary: { indicator: checked.primary },
      success: { indicator: checked.success },
      info: { indicator: checked.info },
      warning: { indicator: checked.warning },
      error: { indicator: checked.error },
      neutral: { indicator: checked.neutral },
    },
    variant: {
      card: {
        root: `border border-border rounded-lg ${cardHoverFill} ${forcedCheckedCard} ${transition}`,
      },
    },
    // Hidden, the box takes no room: Nuxt UI hides it as sr-only, which keeps it out of the
    // row only while it is not relative.
    indicator: {
      start: { wrapper: 'ms-2.5' },
      end: { wrapper: 'me-2.5' },
      hidden: { base: 'absolute overflow-hidden' },
    },
    // The tick is drawn at the system's icon size in the twenty pixel box, four fifths of it; in
    // the other boxes at four fifths too, to the even pixel, so it stays centered in the box.
    size: {
      xs: { ...choiceSizes.xs, icon: 'size-tick-sm' },
      sm: { ...choiceSizes.sm, icon: 'size-tick-sm' },
      md: { ...choiceSizes.md, icon: 'size-icon' },
      lg: { ...choiceSizes.lg, icon: 'size-tick-lg' },
      xl: { ...choiceSizes.xl, icon: 'size-icon-lg' },
    },
    required: {
      true: { label: "after:content-['*'] after:ms-0.5 after:text-(--ws-field-required-text)" },
    },
    disabled: {
      true: {
        ...disabled,
        root: 'opacity-100',
        // A disabled box that is checked or indeterminate keeps its mark, on the faint fill.
        indicator:
          'bg-(--ws-choice-indicator-bg-disabled) text-(--ws-choice-indicator-icon-disabled)',
      },
    },
  },
  compoundVariants: [
    { variant: 'list', indicator: ['start', 'end'], class: { base: choiceFocus } },
    { variant: 'card', class: { root: cardFocus } },
    { variant: 'list', indicator: 'hidden', class: { root: cardFocus } },
    { variant: 'card', highlight: false, class: { root: cardHoverBorder } },
    { size: 'xs', variant: 'card', class: { root: 'p-2.5' } },
    { size: 'sm', variant: 'card', class: { root: 'p-3' } },
    { size: ['md', 'lg'], variant: 'card', class: { root: 'p-4' } },
    { size: 'xl', variant: 'card', class: { root: 'p-5' } },
    ...byColor(checkedCard, { variant: 'card' }, 'root'),
    ...byColor(highlight, { highlight: true }, 'base'),
    ...byColor(highlightCard, { indicator: 'hidden', highlight: true }, 'root'),
  ],
}
