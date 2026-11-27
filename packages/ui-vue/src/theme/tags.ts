import { tagSizes } from './badge.ts'
import { forcedEdge, forcedIcon, transition } from './shared.ts'

/*
 * A field of tags: the tags an input tags field holds, and the ones an input menu that takes
 * several values shows. The field is a field at the control height that grows as its tags wrap
 * onto more lines; each tag is the system's tag, neutral, at the size that fits the field's, with
 * a button that takes it out. The text field after the tags is the field's value, in Inter.
 *
 * The tag on its tint has no edge, and an edge in forced colors, as every tag there. The tag the
 * arrow keys are on, the one Backspace takes out, has the system's focus ring, and in forced
 * colors the selection's colors.
 */

/**
 * The field at each size: at least the control's height, its tags and its text on lines of the
 * text field's, the paddings of the field's, an edge wider than at rest taking what it adds off
 * them. On the smaller sizes a line of text fills the field, which then has no padding above and
 * under it.
 */
export const tagsFieldSizes = {
  xs: 'h-auto min-h-(--ws-control-height-xs) px-[calc(var(--ws-space-8)-var(--field-edge-extra,0px))] py-0 gap-(--ws-control-gap-xs) text-body-sm',
  sm: 'h-auto min-h-(--ws-control-height-sm) px-[calc(var(--ws-space-10)-var(--field-edge-extra,0px))] py-[calc(var(--ws-space-2)-var(--field-edge-extra,0px))] gap-(--ws-control-gap-sm) text-body-sm',
  md: 'h-auto min-h-(--ws-control-height-md) px-[calc(var(--ws-space-12)-var(--field-edge-extra,0px))] py-[calc(var(--ws-space-4)-var(--field-edge-extra,0px))] gap-(--ws-control-gap-md) text-body',
  lg: 'h-auto min-h-(--ws-control-height-lg) px-[calc(var(--ws-space-14)-var(--field-edge-extra,0px))] py-[calc(var(--ws-space-6)-var(--field-edge-extra,0px))] gap-(--ws-control-gap-lg) text-body',
  xl: 'h-auto min-h-(--ws-control-height-xl) px-[calc(var(--ws-space-16)-var(--field-edge-extra,0px))] py-[calc(var(--ws-space-8)-var(--field-edge-extra,0px))] gap-(--ws-control-gap-xl) text-body',
}

/** The tag of each size of the field: a size smaller, and the smallest on the two smallest. */
export const tagOfField = {
  xs: tagSizes.xs,
  sm: tagSizes.xs,
  md: tagSizes.sm,
  lg: tagSizes.md,
  xl: tagSizes.lg,
}

/** A tag, as the badge draws one, neutral: its words wrap where a long one is wider than the field. */
export const tag = `inline-flex items-center rounded-(--ws-tag-radius) font-mono font-normal wrap-anywhere ring-0 bg-(--ws-tag-neutral-bg-rest) text-(--ws-tag-neutral-text-rest) data-disabled:opacity-100 data-disabled:text-(--ws-field-text-disabled) data-[state=active]:bg-(--ws-tag-neutral-bg-rest) outline-interactive data-[state=active]:outline-2 data-[state=active]:outline-solid data-[state=active]:outline-offset-3 ${forcedEdge} forced-colors:data-[state=active]:bg-[Highlight] forced-colors:data-[state=active]:text-[HighlightText] forced-colors:data-[state=active]:forced-color-adjust-none`

/** On a raised field, the soft and the subtle one, a tag is on the field's color at rest. */
export const tagOnRaised = 'bg-(--ws-field-bg-rest) data-[state=active]:bg-(--ws-field-bg-rest)'

/** The button that takes a tag out, and its icon. */
export const tagDelete = `inline-flex items-center rounded-(--ws-radius-xs) text-(--ws-field-icon-rest) hover:text-text hover:bg-transparent disabled:opacity-100 disabled:text-(--ws-field-text-disabled) ${transition}`
export const tagDeleteIcon = `${forcedIcon} forced-colors:in-data-[state=active]:not-[svg]:bg-[HighlightText]`

/**
 * The icon's size at every size of the field: the system's icon size, as a tag's icons are. Nuxt
 * UI sizes it with the field, so it goes in each of the field's sizes, after Nuxt UI's.
 */
export const tagDeleteIconSize = 'size-icon'

/**
 * The text field after the tags, with no edge of its own: the field shows its focus. It fills
 * what its line leaves, at least --ws-space-48. Its width is a share of the field's, as a text
 * field's is: one with no width takes the browser's twenty characters at least, which would hold
 * a field of tags at the larger sizes, with the room for its icons, wider than a phone's column.
 */
export const tagsInput =
  'w-full min-w-(--ws-space-48) text-(--ws-field-text-rest) placeholder:text-text-secondary disabled:text-(--ws-field-text-disabled) disabled:opacity-100'
