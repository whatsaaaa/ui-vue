import { fieldCompoundVariants, fieldSizes, fieldVariants, inGroupRoot } from './field.ts'
import { forcedIcon, transition } from './shared.ts'

/** The text field's value and icons, which the fields built on it start from. */
export const inputSlots = {
  // The system uses no placeholders: one an app passes anyway is the secondary text, at 4.5:1.
  base: `rounded-(--ws-control-radius) font-sans placeholder:text-text-secondary disabled:text-(--ws-field-text-disabled) disabled:opacity-100 ${transition}`,
  leadingIcon: `text-(--ws-field-icon-rest) ${forcedIcon}`,
  trailingIcon: `text-(--ws-field-icon-rest) ${forcedIcon}`,
}

/** The bare field draws no edge: its icons start the padding in, where its value does. */
export const bareIcons = [
  {
    variant: 'none',
    size: 'xs',
    class: { leading: 'ps-(--ws-space-8)', trailing: 'pe-(--ws-space-8)' },
  },
  {
    variant: 'none',
    size: 'sm',
    class: { leading: 'ps-(--ws-space-10)', trailing: 'pe-(--ws-space-10)' },
  },
  {
    variant: 'none',
    size: 'md',
    class: { leading: 'ps-(--ws-space-12)', trailing: 'pe-(--ws-space-12)' },
  },
  {
    variant: 'none',
    size: 'lg',
    class: { leading: 'ps-(--ws-space-14)', trailing: 'pe-(--ws-space-14)' },
  },
  {
    variant: 'none',
    size: 'xl',
    class: { leading: 'ps-(--ws-space-16)', trailing: 'pe-(--ws-space-16)' },
  },
]

export default {
  slots: inputSlots,
  variants: {
    size: fieldSizes,
    variant: fieldVariants,
    type: {
      file: 'file:me-2 file:font-mono file:font-semibold file:text-text-secondary file:outline-none',
    },
  },
  compoundVariants: [...fieldCompoundVariants, ...bareIcons, ...inGroupRoot],
}
