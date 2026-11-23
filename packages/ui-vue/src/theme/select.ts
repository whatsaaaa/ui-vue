import { fieldCompoundVariants, fieldSizes, fieldVariants } from './field.ts'
import { forcedIcon, transition } from './shared.ts'

/*
 * The design system's select spec, specs/select.spec.json, and its select menu spec. The trigger
 * is a field. The list opens on a panel of the overlay, --ws-overlay-*: the surface in the field
 * border's edge, which reads at 3:1, and no shadow; the highlighted option raised, the chosen one
 * ticked in the interactive color. Options are values, so they are in Inter; a group's name is an
 * overline. The edge and the line between groups are borders, so forced colors keep them; there
 * the highlighted option is outlined in the selection color.
 */

/** What a select and a select menu share. */
export const selectSlots = {
  base: `rounded-(--ws-control-radius) font-sans cursor-pointer disabled:text-(--ws-field-text-disabled) disabled:opacity-100 ${transition}`,
  // often the only words in the trigger, so in the secondary text color, which reads at 4.5:1;
  // faint with the rest of a disabled trigger
  placeholder: 'truncate text-text-secondary group-disabled:text-(--ws-field-text-disabled)',
  leadingIcon: `text-(--ws-field-icon-rest) ${forcedIcon}`,
  trailingIcon: `text-(--ws-field-icon-rest) ${forcedIcon}`,
  content:
    'bg-(--ws-overlay-bg-rest) rounded-(--ws-overlay-list-radius) border-(length:--ws-overlay-border-width) border-(--ws-overlay-border-rest) ring-0 [box-shadow:none]',
  arrow: 'fill-(--ws-overlay-bg-rest) stroke-(--ws-overlay-border-rest)',
  viewport: 'divide-y divide-border',
  group: 'p-(--ws-overlay-list-padding)',
  empty: 'text-center text-text-secondary',
  // an overline: mono, in capitals
  label: 'font-mono font-(--ws-text-overline-font-weight) uppercase text-text-secondary',
  // Nuxt UI's line is a fill a pixel high, which forced colors paint over: no height and no fill,
  // or the border and the fill would draw a line of two
  separator:
    '-mx-(--ws-overlay-list-padding) my-(--ws-overlay-list-padding) h-0 bg-transparent border-b-thin border-border',
  item: `cursor-pointer font-sans before:rounded-(--ws-radius-sm) data-disabled:opacity-100 data-disabled:text-text-faint text-text data-highlighted:not-data-disabled:text-text data-highlighted:not-data-disabled:before:bg-raised forced-colors:data-highlighted:not-data-disabled:before:border forced-colors:data-highlighted:not-data-disabled:before:border-[Highlight] ${transition} motion-reduce:before:transition-none`,
  itemLeadingIcon: `text-text-secondary group-data-highlighted:not-group-data-disabled:text-text ${forcedIcon} ${transition}`,
  // the chosen option's tick, centered on the option's first line
  itemTrailing: 'h-lh',
  itemTrailingIcon: `text-interactive ${forcedIcon}`,
  itemDescription: 'truncate text-text-secondary text-body-sm',
}

/** An open list fades in and grows a little, unless the reader asks for less motion. */
export const listMotion =
  'data-[state=open]:animate-[fade-in_var(--ws-motion-duration-fast)_var(--ws-motion-easing-out)] data-[state=closed]:animate-[fade-out_var(--ws-motion-duration-fast)_var(--ws-motion-easing-in)] motion-safe:data-[state=open]:animate-[scale-in_var(--ws-motion-duration-fast)_var(--ws-motion-easing-out)] motion-safe:data-[state=closed]:animate-[scale-out_var(--ws-motion-duration-fast)_var(--ws-motion-easing-in)]'

/**
 * A select's icons sit inside its edge, as its value does. In the list an option's icon and its
 * tick are the control's icon of the size, the icon centered on the option's first line, as the
 * tick is, whatever lines follow.
 */
export const selectVariants = {
  size: {
    xs: {
      ...fieldSizes.xs,
      leading: 'ps-[calc(var(--ws-space-8)-var(--field-edge-extra,0px))]',
      trailing: 'pe-[calc(var(--ws-space-8)-var(--field-edge-extra,0px))]',
      label: 'px-(--ws-space-6) py-(--ws-space-4) text-overline',
      item: 'px-(--ws-space-6) py-(--ws-space-4) gap-(--ws-control-gap-xs) text-body-sm',
      itemLeadingIcon:
        'size-(--ws-control-icon-size-xs) my-[calc((1lh-var(--ws-control-icon-size-xs))/2)]',
      itemTrailingIcon: 'size-(--ws-control-icon-size-xs)',
      empty: 'p-(--ws-space-8) text-body-sm',
    },
    sm: {
      ...fieldSizes.sm,
      leading: 'ps-[calc(var(--ws-space-10)-var(--field-edge-extra,0px))]',
      trailing: 'pe-[calc(var(--ws-space-10)-var(--field-edge-extra,0px))]',
      label: 'px-(--ws-space-8) py-(--ws-space-4) text-overline',
      item: 'px-(--ws-space-8) py-(--ws-space-4) gap-(--ws-control-gap-sm) text-body-sm',
      itemLeadingIcon:
        'size-(--ws-control-icon-size-sm) my-[calc((1lh-var(--ws-control-icon-size-sm))/2)]',
      itemTrailingIcon: 'size-(--ws-control-icon-size-sm)',
      empty: 'p-(--ws-space-10) text-body-sm',
    },
    md: {
      ...fieldSizes.md,
      leading: 'ps-[calc(var(--ws-space-12)-var(--field-edge-extra,0px))]',
      trailing: 'pe-[calc(var(--ws-space-12)-var(--field-edge-extra,0px))]',
      label: 'px-(--ws-space-8) py-(--ws-space-6) text-overline',
      item: 'px-(--ws-space-8) py-(--ws-space-6) gap-(--ws-control-gap-md) text-body',
      itemLeadingIcon:
        'size-(--ws-control-icon-size-md) my-[calc((1lh-var(--ws-control-icon-size-md))/2)]',
      itemTrailingIcon: 'size-(--ws-control-icon-size-md)',
      empty: 'p-(--ws-space-12) text-body-sm',
    },
    lg: {
      ...fieldSizes.lg,
      leading: 'ps-[calc(var(--ws-space-14)-var(--field-edge-extra,0px))]',
      trailing: 'pe-[calc(var(--ws-space-14)-var(--field-edge-extra,0px))]',
      label: 'px-(--ws-space-10) py-(--ws-space-6) text-overline',
      item: 'px-(--ws-space-10) py-(--ws-space-8) gap-(--ws-control-gap-lg) text-body',
      itemLeadingIcon:
        'size-(--ws-control-icon-size-lg) my-[calc((1lh-var(--ws-control-icon-size-lg))/2)]',
      itemTrailingIcon: 'size-(--ws-control-icon-size-lg)',
      empty: 'p-(--ws-space-12) text-body',
    },
    xl: {
      ...fieldSizes.xl,
      leading: 'ps-[calc(var(--ws-space-16)-var(--field-edge-extra,0px))]',
      trailing: 'pe-[calc(var(--ws-space-16)-var(--field-edge-extra,0px))]',
      label: 'px-(--ws-space-12) py-(--ws-space-8) text-overline',
      item: 'px-(--ws-space-12) py-(--ws-space-8) gap-(--ws-control-gap-xl) text-body',
      itemLeadingIcon:
        'size-(--ws-control-icon-size-xl) my-[calc((1lh-var(--ws-control-icon-size-xl))/2)]',
      itemTrailingIcon: 'size-(--ws-control-icon-size-xl)',
      empty: 'p-(--ws-space-12) text-body',
    },
  },
  variant: {
    ...fieldVariants,
    outline: `${fieldVariants.outline} hover:bg-(--ws-field-bg-rest) disabled:bg-(--ws-field-bg-rest)`,
    subtle: `${fieldVariants.subtle} hover:bg-raised disabled:bg-transparent`,
  },
  position: {
    popper: { content: listMotion },
  },
}

export default {
  slots: selectSlots,
  variants: selectVariants,
  compoundVariants: fieldCompoundVariants,
}
