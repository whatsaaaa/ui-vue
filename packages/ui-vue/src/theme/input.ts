import { fieldCompoundVariants, fieldSizes, fieldVariants } from './field.ts'
import { forcedIcon, transition } from './shared.ts'

export default {
  slots: {
    // The system uses no placeholders: one an app passes anyway is the secondary text, at 4.5:1.
    base: `font-sans placeholder:text-text-secondary disabled:text-(--ws-field-text-disabled) disabled:opacity-100 ${transition}`,
    leadingIcon: `text-(--ws-field-icon) ${forcedIcon}`,
    trailingIcon: `text-(--ws-field-icon) ${forcedIcon}`,
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
