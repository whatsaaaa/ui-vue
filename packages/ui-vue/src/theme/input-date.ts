import {
  fieldSizes,
  fieldWithinCompoundVariants,
  fieldWithinVariants,
  iconsWithinSizes,
  inGroup,
} from './field.ts'
import { inputSlots } from './input.ts'
import { transition } from './shared.ts'

/*
 * A date or a time typed a part at a time: the field is the text field, with its focus on the
 * part being typed, and its parts, the segments, sit side by side in it. The part with the focus
 * is on the tag's tint, the system's interactive tint, which reads on every variant of the field,
 * and in forced colors in the selection's colors. Nuxt UI hides a part's outline with
 * outline-hidden, which forced colors draw as a solid outline around every part, at rest too: a
 * part has no outline there, and the selection's colors mark the one with the focus. A part not
 * filled in yet and the literal between parts are the secondary text, an invalid date the danger
 * text. Its icon is the one the app names, or Nuxt UI's, at the control's icon size.
 */

/**
 * A segment is as wide as its value, in figures of one width, with the room of the tint around
 * it: the room around every literal, around the dash of a range and in the tint of the focus is
 * the same on each side, whatever the value, and the text after a segment moves by a figure as a
 * second one is typed. Nuxt UI gives each a width of its own at each size, which a year in Inter
 * overflows and a value of one figure does not fill.
 */
const segmentWidths =
  'data-[segment=day]:w-auto data-[segment=month]:w-auto data-[segment=year]:w-auto not-data-[segment=literal]:w-auto'

/** The field at each size, and the icon between the two dates of a range at the control's size. */
const sizes = {
  xs: {
    ...fieldSizes.xs,
    ...iconsWithinSizes.xs,
    base: 'h-(--ws-control-height-xs) px-[calc(var(--ws-space-8)-var(--field-edge-extra,0px))] py-0 gap-0 text-body-sm',
    separatorIcon: 'size-(--ws-control-icon-size-xs)',
    segment: segmentWidths,
  },
  sm: {
    ...fieldSizes.sm,
    ...iconsWithinSizes.sm,
    base: 'h-(--ws-control-height-sm) px-[calc(var(--ws-space-10)-var(--field-edge-extra,0px))] py-0 gap-0 text-body-sm',
    separatorIcon: 'size-(--ws-control-icon-size-sm)',
    segment: segmentWidths,
  },
  md: {
    ...fieldSizes.md,
    ...iconsWithinSizes.md,
    base: 'h-(--ws-control-height-md) px-[calc(var(--ws-space-12)-var(--field-edge-extra,0px))] py-0 gap-0 text-body',
    separatorIcon: 'size-(--ws-control-icon-size-md)',
    segment: segmentWidths,
  },
  lg: {
    ...fieldSizes.lg,
    ...iconsWithinSizes.lg,
    base: 'h-(--ws-control-height-lg) px-[calc(var(--ws-space-14)-var(--field-edge-extra,0px))] py-0 gap-0 text-body',
    separatorIcon: 'size-(--ws-control-icon-size-lg)',
    segment: segmentWidths,
  },
  xl: {
    ...fieldSizes.xl,
    ...iconsWithinSizes.xl,
    base: 'h-(--ws-control-height-xl) px-[calc(var(--ws-space-16)-var(--field-edge-extra,0px))] py-0 gap-0 text-body',
    separatorIcon: 'size-(--ws-control-icon-size-xl)',
    segment: segmentWidths,
  },
}

/** A field of a date or a time: input-time.ts takes it too. */
export default {
  slots: {
    base: `rounded-(--ws-control-radius) font-sans cursor-text ${transition}`,
    leadingIcon: inputSlots.leadingIcon,
    trailingIcon: inputSlots.trailingIcon,
    segment: `rounded-(--ws-radius-sm) px-(--ws-space-4) data-[segment=literal]:px-0 tabular-nums text-(--ws-field-text-rest) data-placeholder:text-text-secondary data-[segment=literal]:text-text-secondary data-invalid:text-danger-text data-disabled:opacity-100 data-disabled:text-(--ws-field-text-disabled) forced-colors:outline-none forced-colors:focus:bg-[Highlight] forced-colors:focus:text-[HighlightText] forced-colors:focus:forced-color-adjust-none ${transition}`,
    separatorIcon: 'mx-(--ws-space-4) text-(--ws-field-icon-rest)',
  },
  variants: {
    size: sizes,
    variant: fieldWithinVariants,
  },
  compoundVariants: [
    ...fieldWithinCompoundVariants,
    ...inGroup,
    // over Nuxt UI's fill of each variant, and under the pointer
    {
      variant: ['outline', 'soft', 'subtle', 'ghost', 'none'],
      class: { segment: 'focus:bg-tag-bg focus:text-tag-text group-hover:focus:bg-tag-bg' },
    },
  ],
}
