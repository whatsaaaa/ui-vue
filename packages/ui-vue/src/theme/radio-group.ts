import {
  cardFocus,
  cardHoverBorder,
  cardHoverFill,
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
import { type ByColor, byColor, forcedChecked, forcedControlEdge, transition } from './shared.ts'

/*
 * A round control with a dot, as the design system's radio group spec draws it. The group's name
 * is a field label, in mono, and its options are apart by the sample apps' gap.
 */

/**
 * The checked fill and the dot on it: the dot is the color of a checkbox's tick. The spec's color
 * is primary, which reads the tier.
 */
const checked: ByColor = {
  primary: 'bg-(--ws-choice-indicator-bg-checked) after:bg-(--ws-choice-indicator-icon-checked)',
  success: 'bg-tip-text after:bg-bg',
  info: 'bg-note-text after:bg-bg',
  warning: 'bg-warning-text after:bg-bg',
  error: 'bg-danger-text after:bg-bg',
  neutral: 'bg-text after:bg-bg',
}

export default {
  slots: {
    legend: 'font-mono font-normal text-(--ws-field-label-text)',
    item: 'group/choice',
    base: `rounded-(--ws-radius-full) ${control} ${forcedControlEdge} ${transition}`,
    indicator: `${indicator} ${forcedChecked} forced-colors:after:bg-[HighlightText] forced-colors:in-disabled:after:bg-[Canvas]`,
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
        item: `border border-border rounded-lg ${cardHoverFill} ${forcedCheckedCard} ${transition}`,
      },
      table: { item: `border border-border ${cardHoverFill} ${forcedCheckedCard} ${transition}` },
    },
    orientation: {
      horizontal: { fieldset: 'gap-x-6' },
    },
    indicator: {
      start: { wrapper: 'ms-2.5' },
      end: { wrapper: 'me-2.5' },
    },
    size: {
      xs: {
        ...choiceSizes.xs,
        legend: 'mb-2 text-label-sm',
        fieldset: 'gap-y-2',
        indicator: 'after:size-(--ws-space-6)',
      },
      sm: {
        ...choiceSizes.sm,
        legend: 'mb-2 text-label-sm',
        fieldset: 'gap-y-2',
        indicator: 'after:size-(--ws-space-6)',
      },
      md: {
        ...choiceSizes.md,
        legend: 'mb-2.5 text-label',
        fieldset: 'gap-y-2.5',
        indicator: 'after:size-(--ws-space-8)',
      },
      lg: {
        ...choiceSizes.lg,
        legend: 'mb-2.5 text-label',
        fieldset: 'gap-y-2.5',
        indicator: 'after:size-(--ws-space-8)',
      },
      xl: {
        ...choiceSizes.xl,
        legend: 'mb-3 text-label',
        fieldset: 'gap-y-3',
        indicator: 'after:size-(--ws-space-10)',
      },
    },
    required: {
      true: { legend: "after:content-['*'] after:ms-0.5 after:text-(--ws-field-required-text)" },
    },
    disabled: {
      true: {
        ...disabled,
        item: 'opacity-100',
        // A disabled group that has an answer keeps it: the dot, on the faint fill.
        indicator:
          'bg-(--ws-choice-indicator-bg-disabled) after:bg-(--ws-choice-indicator-icon-disabled)',
      },
    },
  },
  compoundVariants: [
    { variant: 'list', indicator: ['start', 'end'], class: { base: choiceFocus } },
    { variant: ['card', 'table'], class: { item: cardFocus } },
    { variant: 'list', indicator: 'hidden', class: { item: cardFocus } },
    { variant: ['card', 'table'], highlight: false, class: { item: cardHoverBorder } },
    { size: 'xs', variant: ['card', 'table'], class: { item: 'p-2.5' } },
    { size: 'sm', variant: ['card', 'table'], class: { item: 'p-3' } },
    { size: ['md', 'lg'], variant: ['card', 'table'], class: { item: 'p-4' } },
    { size: 'xl', variant: ['card', 'table'], class: { item: 'p-5' } },
    ...byColor(checkedCard, { variant: ['card', 'table'] }, 'item'),
    ...byColor(highlight, { highlight: true }, 'base'),
    ...byColor(highlightCard, { indicator: 'hidden', highlight: true }, 'item'),
  ],
}
