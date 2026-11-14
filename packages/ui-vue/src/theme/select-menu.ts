import { fieldCompoundVariants } from './field.ts'
import { selectSlots, selectVariants } from './select.ts'

/* A select with a search field at the top of its list: the field sits on the panel's border. */
export default {
  slots: {
    ...selectSlots,
    input: 'border-b border-border',
    content: 'bg-surface ring-border',
  },
  variants: selectVariants,
  compoundVariants: fieldCompoundVariants,
}
