import { fieldCompoundVariants, inGroup } from './field.ts'
import { selectSlots, selectVariants } from './select.ts'

/*
 * A select with a search field at the top of its list: the bare field, at the control height of
 * the select menu's size, on the panel's edge, with a line of the border color under it. Its
 * icon is the field's, drawn unless an app passes a search field of its own.
 */

/**
 * The search field's icon, by default. Nuxt UI takes a default for any prop of a component from
 * its defaultVariants in the app config, after the prop itself and UTheme's, though the app
 * config's types take only the variants: so it is typed as an object.
 */
const defaultVariants: object = { searchInput: { icon: 'i-lucide-search' } }

export default {
  slots: {
    ...selectSlots,
    input: 'border-b-thin border-border',
  },
  variants: selectVariants,
  compoundVariants: [...fieldCompoundVariants, ...inGroup],
  defaultVariants,
}
