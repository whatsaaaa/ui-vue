import {
  fieldCompoundVariants,
  fieldSizes,
  fieldVariants,
  fieldWithinCompoundVariants,
  fieldWithinVariants,
  inGroupRoot,
} from './field.ts'
import { bareIcons, inputSlots } from './input.ts'
import { listMotion, selectSlots, selectVariants } from './select.ts'
import {
  tag,
  tagDelete,
  tagDeleteIcon,
  tagDeleteIconSize,
  tagOfField,
  tagOnRaised,
  tagsFieldSizes,
  tagsInput,
} from './tags.ts'

/*
 * A text field whose list opens under it as it is typed in: the field is the text field, and the
 * list draws what the select menu's draws, from the select menu's theme. With several values the
 * field is a field of tags, which tags.ts draws, with its focus on the text field inside it.
 */

const sizes = Object.fromEntries(
  (['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => {
    const { label, item, itemLeadingIcon, itemTrailingIcon, empty } = selectVariants.size[size]
    return [
      size,
      {
        ...fieldSizes[size],
        label,
        item,
        itemLeadingIcon,
        itemTrailingIcon,
        empty,
        tagsItem: tagOfField[size],
        tagsItemDeleteIcon: tagDeleteIconSize,
      },
    ]
  }),
)

/** With several values, the field of tags at each size. */
const tagsFields = (['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => ({
  multiple: true,
  size,
  class: { base: tagsFieldSizes[size] },
}))

export default {
  slots: {
    ...inputSlots,
    trailing: 'disabled:opacity-100',
    // the list's panel, which Nuxt UI opens with its own motion
    content: `${selectSlots.content} ${listMotion}`,
    arrow: selectSlots.arrow,
    group: selectSlots.group,
    empty: selectSlots.empty,
    label: selectSlots.label,
    separator: selectSlots.separator,
    item: selectSlots.item,
    itemLeadingIcon: selectSlots.itemLeadingIcon,
    itemTrailing: selectSlots.itemTrailing,
    itemTrailingIcon: selectSlots.itemTrailingIcon,
    itemDescription: selectSlots.itemDescription,
    tagsItem: tag,
    tagsItemDelete: tagDelete,
    tagsItemDeleteIcon: tagDeleteIcon,
    tagsInput,
  },
  variants: {
    size: sizes,
    variant: fieldVariants,
    virtualize: {
      false: { viewport: selectSlots.viewport },
    },
  },
  compoundVariants: [
    // Nuxt UI takes the edge off a field of one value after the variants have drawn it
    {
      multiple: false,
      variant: ['outline', 'soft', 'subtle', 'ghost'],
      class: 'border-(length:--ws-control-border-width-rest)',
    },
    // with several values the field is one with the focus inside it, disabled by data-disabled
    ...Object.entries(fieldWithinVariants).map(([variant, classes]) => ({
      multiple: true,
      variant,
      class: classes,
    })),
    ...fieldCompoundVariants,
    ...bareIcons,
    ...inGroupRoot,
    // with several values the field shows the focus of the text field inside it
    ...fieldWithinCompoundVariants.map((compound) => ({ ...compound, multiple: true })),
    { multiple: true, variant: ['soft', 'subtle'], class: { tagsItem: tagOnRaised } },
    ...tagsFields,
  ],
}
