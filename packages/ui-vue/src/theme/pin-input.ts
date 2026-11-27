import { fieldCompoundVariants, fieldVariants } from './field.ts'
import { transition } from './shared.ts'

/*
 * A code typed a character to a cell: each cell is a field, square at the control height, with
 * the field's edge, colors and focus ring, and its character centered in Inter, the field's
 * value. The cells are the control's gap apart, the gap between an icon and its value.
 */

export default {
  slots: {
    base: `rounded-(--ws-control-radius) font-sans tabular-nums placeholder:text-text-secondary disabled:text-(--ws-field-text-disabled) disabled:opacity-100 ${transition}`,
    separator: 'text-text-secondary',
  },
  variants: {
    size: {
      xs: {
        root: 'gap-(--ws-control-gap-xs)',
        base: 'size-(--ws-control-height-xs) p-0 text-body-sm',
      },
      sm: {
        root: 'gap-(--ws-control-gap-sm)',
        base: 'size-(--ws-control-height-sm) p-0 text-body-sm',
      },
      md: {
        root: 'gap-(--ws-control-gap-md)',
        base: 'size-(--ws-control-height-md) p-0 text-body',
      },
      lg: {
        root: 'gap-(--ws-control-gap-lg)',
        base: 'size-(--ws-control-height-lg) p-0 text-body',
      },
      xl: {
        root: 'gap-(--ws-control-gap-xl)',
        base: 'size-(--ws-control-height-xl) p-0 text-body',
      },
    },
    variant: fieldVariants,
  },
  compoundVariants: fieldCompoundVariants,
}
