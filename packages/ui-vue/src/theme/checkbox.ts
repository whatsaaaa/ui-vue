import {
  cardFocus,
  cardHover,
  checked,
  checkedCard,
  choiceFocus,
  choiceSizes,
  highlight,
  highlightCard,
} from './choice.ts'
import { byColor, transition } from './shared.ts'

/* A box with the smallest radius and a tick. */
export default {
  slots: {
    base: `rounded-xs ring-field-border bg-bg cursor-pointer hover:ring-text-secondary ${transition}`,
    indicator: 'flex items-center justify-center size-full',
    label: 'font-sans font-normal text-text cursor-pointer',
    description: 'text-text-secondary text-body-sm',
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
      card: { root: `border border-border rounded-lg ${cardHover}bg-raised/50 ${transition}` },
    },
    indicator: {
      start: { wrapper: 'ms-2.5' },
      end: { wrapper: 'me-2.5' },
    },
    size: {
      xs: { ...choiceSizes.xs, icon: 'size-2.5' },
      sm: { ...choiceSizes.sm, icon: 'size-3' },
      md: { ...choiceSizes.md, icon: 'size-3' },
      lg: { ...choiceSizes.lg, icon: 'size-3.5' },
      xl: { ...choiceSizes.xl, icon: 'size-4' },
    },
    required: {
      true: { label: "after:content-['*'] after:ms-0.5 after:text-brand" },
    },
    disabled: {
      true: {
        root: 'opacity-100',
        base: 'cursor-not-allowed ring-text-faint hover:ring-text-faint',
        label: 'cursor-not-allowed text-text-faint',
        description: 'cursor-not-allowed text-text-faint',
      },
    },
  },
  compoundVariants: [
    { variant: 'list', indicator: ['start', 'end'], class: { base: choiceFocus } },
    { variant: 'card', class: { root: cardFocus } },
    { variant: 'list', indicator: 'hidden', class: { root: cardFocus } },
    { variant: 'card', highlight: false, class: { root: `${cardHover}border-field-border` } },
    { size: 'xs', variant: 'card', class: { root: 'p-2.5' } },
    { size: 'sm', variant: 'card', class: { root: 'p-3' } },
    { size: ['md', 'lg'], variant: 'card', class: { root: 'p-4' } },
    { size: 'xl', variant: 'card', class: { root: 'p-5' } },
    ...byColor(checkedCard, { variant: 'card' }, 'root'),
    ...byColor(highlight, { highlight: true }, 'base'),
    ...byColor(highlightCard, { indicator: 'hidden', highlight: true }, 'root'),
    // A disabled box that is checked keeps its tick, in the faint color.
    { disabled: true, checked: true, class: { indicator: 'bg-text-faint text-bg' } },
  ],
}
