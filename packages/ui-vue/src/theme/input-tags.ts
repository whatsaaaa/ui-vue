import {
  fieldSizes,
  fieldWithinCompoundVariants,
  fieldWithinVariants,
  iconsWithinSizes,
  inGroup,
} from './field.ts'
import { inputSlots } from './input.ts'
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
 * A field of tags, on the text field: its edge, its icons and its colors, with its focus on the
 * text field inside it. Its tags are the system's tag, which tags.ts draws. Nuxt UI draws the
 * field and the root as one element, so the root takes the field's classes.
 */

const sizes = Object.fromEntries(
  (['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => [
    size,
    {
      ...fieldSizes[size],
      ...iconsWithinSizes[size],
      base: tagsFieldSizes[size],
      item: tagOfField[size],
      itemDeleteIcon: tagDeleteIconSize,
    },
  ]),
)

export default {
  slots: {
    base: inputSlots.base,
    leadingIcon: inputSlots.leadingIcon,
    trailingIcon: inputSlots.trailingIcon,
    item: tag,
    itemDelete: tagDelete,
    itemDeleteIcon: tagDeleteIcon,
    input: tagsInput,
  },
  variants: {
    size: sizes,
    variant: fieldWithinVariants,
  },
  compoundVariants: [
    ...fieldWithinCompoundVariants,
    ...inGroup,
    { variant: ['soft', 'subtle'], class: { item: tagOnRaised } },
  ],
}
