import { fieldCompoundVariants, fieldSizes, fieldVariants } from './field.ts'
import { transition } from './shared.ts'

/*
 * The trigger is a field. The list opens on a panel: the surface, its border and no shadow,
 * the hovered option raised, the chosen one marked in the interactive color. Options are values,
 * so they are in Inter; a group's name is an overline.
 */

/** What a select and a select menu share. */
export const selectSlots = {
  base: `font-sans cursor-pointer disabled:text-text-faint disabled:opacity-100 ${transition}`,
  placeholder: 'truncate text-text-faint',
  leadingIcon: 'text-text-secondary',
  trailingIcon: 'text-text-secondary',
  arrow: 'fill-surface stroke-border',
  viewport: 'divide-y divide-border',
  empty: 'text-center text-text-secondary',
  label: 'font-mono font-bold uppercase text-text-secondary',
  separator: '-mx-1 my-1 h-px bg-border',
  item: `cursor-pointer before:rounded-sm data-disabled:opacity-100 data-disabled:text-text-faint text-text data-highlighted:not-data-disabled:text-text data-highlighted:not-data-disabled:before:bg-raised ${transition} motion-reduce:before:transition-none`,
  itemLeadingIcon: `text-text-secondary group-data-highlighted:not-group-data-disabled:text-text ${transition}`,
  // the chosen option's tick, centered on the option's first line
  itemTrailing: 'h-lh',
  itemTrailingIcon: 'text-interactive',
  itemDescription: 'truncate text-text-secondary text-body-sm',
}

/** An open list fades in and grows a little, unless the reader asks for less motion. */
export const listMotion =
  'data-[state=open]:animate-[fade-in_var(--ws-motion-duration-fast)_var(--ws-motion-easing-out)] data-[state=closed]:animate-[fade-out_var(--ws-motion-duration-fast)_var(--ws-motion-easing-in)] motion-safe:data-[state=open]:animate-[scale-in_var(--ws-motion-duration-fast)_var(--ws-motion-easing-out)] motion-safe:data-[state=closed]:animate-[scale-out_var(--ws-motion-duration-fast)_var(--ws-motion-easing-in)]'

/** An option's icon is centered on its first line, as the tick is, whatever lines follow. */
export const selectVariants = {
  size: {
    xs: {
      ...fieldSizes.xs,
      label: 'px-1.5 py-1 text-overline',
      item: 'px-1.5 py-1 gap-1.5 text-body-sm',
      itemLeadingIcon: 'size-icon my-[calc((1lh-var(--ws-size-icon))/2)]',
      itemTrailingIcon: 'size-icon',
      empty: 'p-2 text-body-sm',
    },
    sm: {
      ...fieldSizes.sm,
      label: 'px-2 py-1 text-overline',
      item: 'px-2 py-1 gap-1.5 text-body-sm',
      itemLeadingIcon: 'size-icon my-[calc((1lh-var(--ws-size-icon))/2)]',
      itemTrailingIcon: 'size-icon',
      empty: 'p-2.5 text-body-sm',
    },
    md: {
      ...fieldSizes.md,
      label: 'px-2 py-1.5 text-overline',
      item: 'px-2 py-1.5 gap-2 text-body',
      itemLeadingIcon: 'size-icon my-[calc((1lh-var(--ws-size-icon))/2)]',
      itemTrailingIcon: 'size-icon',
      empty: 'p-3 text-body-sm',
    },
    lg: {
      ...fieldSizes.lg,
      label: 'px-2.5 py-1.5 text-overline',
      item: 'px-2.5 py-2 gap-2 text-body',
      itemLeadingIcon: 'size-5 my-[calc((1lh-1.25rem)/2)]',
      itemTrailingIcon: 'size-5',
      empty: 'p-3 text-body',
    },
    xl: {
      ...fieldSizes.xl,
      label: 'px-3 py-2 text-overline',
      item: 'px-3 py-2 gap-2.5 text-body',
      itemLeadingIcon: 'size-5 my-[calc((1lh-1.25rem)/2)]',
      itemTrailingIcon: 'size-5',
      empty: 'p-3 text-body',
    },
  },
  variant: {
    ...fieldVariants,
    outline: `${fieldVariants.outline} hover:bg-bg disabled:bg-transparent`,
    subtle: `${fieldVariants.subtle} hover:bg-raised disabled:bg-transparent`,
  },
  position: {
    popper: { content: listMotion },
  },
}

export default {
  slots: {
    ...selectSlots,
    content: 'bg-surface ring-border',
  },
  variants: selectVariants,
  compoundVariants: fieldCompoundVariants,
}
