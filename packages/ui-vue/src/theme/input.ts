import { fieldCompoundVariants, fieldSizes, fieldVariants } from './field.ts'
import { transition } from './shared.ts'

export default {
  slots: {
    base: `font-sans placeholder:text-text-faint disabled:text-text-faint disabled:opacity-100 ${transition}`,
    leadingIcon: 'text-text-secondary',
    trailingIcon: 'text-text-secondary',
  },
  variants: {
    size: fieldSizes,
    variant: fieldVariants,
    type: {
      file: 'file:me-2 file:font-mono file:font-semibold file:text-text-secondary file:outline-none',
    },
  },
  compoundVariants: fieldCompoundVariants,
}
