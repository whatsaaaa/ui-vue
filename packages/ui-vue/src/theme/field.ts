import { type ByColor, byColor, forcedControlEdge } from './shared.ts'

/*
 * What a text field, a select and a select menu share, and the fields restyled on them: the pin
 * input's cells, the tag field, the input menu and the date and time fields. The field of the
 * design system's input spec, specs/input.spec.json: the control height, the value in Inter, an
 * edge in the field border on the page color, the text color's secondary on hover. With an error
 * the edge is the danger color, two pixels wide. They read the component tier by name,
 * --ws-field-* and --ws-control-*, so a change of the tier reaches them.
 *
 * The edge is a border, not Nuxt UI's ring, so that forced colors keep it; the ring is taken off.
 * A border takes room, so the field is laid out from its outer edge: the value and an icon start
 * the padding and the rest edge in. An edge wider than the field's at rest, an error's or a
 * highlighted bare field's, takes what it adds, --field-edge-extra, off the paddings inside it,
 * so nothing moves when it changes.
 *
 * A field whose focus is on a part inside it, as a tag field's input or a date field's segments
 * are, shows the focus as the field it is: its within classes read has-focus where the others
 * read focus.
 */

/**
 * The heights, paddings and value sizes, for the field and the icons in it. An input's icons sit
 * beside it, not inside its edge: past the padding and the rest edge, where a value starts.
 */
export const fieldSizes = {
  xs: {
    base: 'h-(--ws-control-height-xs) px-[calc(var(--ws-space-8)-var(--field-edge-extra,0px))] py-0 gap-(--ws-control-gap-xs) text-body-sm',
    leading: 'ps-[calc(var(--ws-space-8)+var(--ws-control-border-width-rest))]',
    trailing: 'pe-[calc(var(--ws-space-8)+var(--ws-control-border-width-rest))]',
    leadingIcon: 'size-(--ws-control-icon-size-xs)',
    trailingIcon: 'size-(--ws-control-icon-size-xs)',
  },
  sm: {
    base: 'h-(--ws-control-height-sm) px-[calc(var(--ws-space-10)-var(--field-edge-extra,0px))] py-0 gap-(--ws-control-gap-sm) text-body-sm',
    leading: 'ps-[calc(var(--ws-space-10)+var(--ws-control-border-width-rest))]',
    trailing: 'pe-[calc(var(--ws-space-10)+var(--ws-control-border-width-rest))]',
    leadingIcon: 'size-(--ws-control-icon-size-sm)',
    trailingIcon: 'size-(--ws-control-icon-size-sm)',
  },
  md: {
    base: 'h-(--ws-control-height-md) px-[calc(var(--ws-space-12)-var(--field-edge-extra,0px))] py-0 gap-(--ws-control-gap-md) text-body',
    leading: 'ps-[calc(var(--ws-space-12)+var(--ws-control-border-width-rest))]',
    trailing: 'pe-[calc(var(--ws-space-12)+var(--ws-control-border-width-rest))]',
    leadingIcon: 'size-(--ws-control-icon-size-md)',
    trailingIcon: 'size-(--ws-control-icon-size-md)',
  },
  lg: {
    base: 'h-(--ws-control-height-lg) px-[calc(var(--ws-space-14)-var(--field-edge-extra,0px))] py-0 gap-(--ws-control-gap-lg) text-body',
    leading: 'ps-[calc(var(--ws-space-14)+var(--ws-control-border-width-rest))]',
    trailing: 'pe-[calc(var(--ws-space-14)+var(--ws-control-border-width-rest))]',
    leadingIcon: 'size-(--ws-control-icon-size-lg)',
    trailingIcon: 'size-(--ws-control-icon-size-lg)',
  },
  xl: {
    base: 'h-(--ws-control-height-xl) px-[calc(var(--ws-space-16)-var(--field-edge-extra,0px))] py-0 gap-(--ws-control-gap-xl) text-body',
    leading: 'ps-[calc(var(--ws-space-16)+var(--ws-control-border-width-rest))]',
    trailing: 'pe-[calc(var(--ws-space-16)+var(--ws-control-border-width-rest))]',
    leadingIcon: 'size-(--ws-control-icon-size-xl)',
    trailingIcon: 'size-(--ws-control-icon-size-xl)',
  },
}

/**
 * The field's edge, of the control's width: transparent where the variant draws none, so that
 * every field lays out alike, and forced colors draw one there. The bare field, inside another
 * control, has none: its value starts the padding in, as that control's content does.
 */
const edge = 'ring-0 border-(length:--ws-control-border-width-rest)'

/** The edge of a field in error, wider: in forced colors too, which draw the control's edge. */
const invalidEdge =
  'ring-0 border-(length:--ws-control-border-width-invalid) forced-colors:border-(length:--ws-control-border-width-invalid) [--field-edge-extra:calc(var(--ws-control-border-width-invalid)_-_var(--ws-control-border-width-rest))]'

/** In forced colors every field but the bare one is outlined, as a field there is. */
export const fieldVariants = {
  outline: `text-(--ws-field-text-rest) bg-(--ws-field-bg-rest) ${edge} border-(--ws-field-border-rest) ${forcedControlEdge}`,
  soft: `text-text bg-raised/60 hover:bg-raised focus:bg-raised disabled:bg-transparent ${edge} border-transparent ${forcedControlEdge}`,
  subtle: `text-text bg-raised ${edge} border-field-border ${forcedControlEdge}`,
  ghost: `text-text bg-transparent hover:bg-raised focus:bg-raised disabled:bg-transparent ${edge} border-transparent ${forcedControlEdge}`,
  none: 'text-text bg-transparent',
}

/** A disabled field's gray edge in forced colors, where Reka marks it data-disabled alone. */
const forcedWithinDisabled = 'forced-colors:data-disabled:border-[GrayText]'

/** The same, with the focus inside: disabled is Reka's data-disabled, on an element that is no control. */
export const fieldWithinVariants = {
  ...fieldVariants,
  outline: `${fieldVariants.outline} ${forcedWithinDisabled}`,
  soft: `text-text bg-raised/60 hover:bg-raised has-focus:bg-raised data-disabled:bg-transparent ${edge} border-transparent ${forcedControlEdge} ${forcedWithinDisabled}`,
  subtle: `${fieldVariants.subtle} ${forcedWithinDisabled}`,
  ghost: `text-text bg-transparent hover:bg-raised has-focus:bg-raised data-disabled:bg-transparent ${edge} border-transparent ${forcedControlEdge} ${forcedWithinDisabled}`,
}

/**
 * A highlighted field takes its color as the edge, and keeps it on hover and focus. A field in
 * error is highlighted in the error color: the invalid edge, wider.
 */
export const fieldHighlight: ByColor = {
  primary: `${edge} border-interactive hover:border-interactive focus-visible:border-interactive`,
  success: `${edge} border-tip hover:border-tip focus-visible:border-tip`,
  info: `${edge} border-note hover:border-note focus-visible:border-note`,
  warning: `${edge} border-warning hover:border-warning focus-visible:border-warning`,
  error: `${invalidEdge} border-(--ws-field-border-invalid) hover:border-(--ws-field-border-invalid) focus-visible:border-(--ws-field-border-invalid)`,
  neutral: `${edge} border-text hover:border-text focus-visible:border-text`,
}

const highlightWithin: ByColor = {
  primary: `${edge} border-interactive hover:border-interactive has-focus-visible:border-interactive`,
  success: `${edge} border-tip hover:border-tip has-focus-visible:border-tip`,
  info: `${edge} border-note hover:border-note has-focus-visible:border-note`,
  warning: `${edge} border-warning hover:border-warning has-focus-visible:border-warning`,
  error: `${invalidEdge} border-(--ws-field-border-invalid) hover:border-(--ws-field-border-invalid) has-focus-visible:border-(--ws-field-border-invalid)`,
  neutral: `${edge} border-text hover:border-text has-focus-visible:border-text`,
}

/**
 * The room for an icon at the start or the end of the field, where text before or after the value
 * starts past it: the field's padding, the icon and the gap, less the extra edge.
 */
export const iconRoomStart = {
  xs: 'ps-[calc(var(--ws-space-8)+var(--ws-control-icon-size-xs)+var(--ws-control-gap-xs)-var(--field-edge-extra,0px))]',
  sm: 'ps-[calc(var(--ws-space-10)+var(--ws-control-icon-size-sm)+var(--ws-control-gap-sm)-var(--field-edge-extra,0px))]',
  md: 'ps-[calc(var(--ws-space-12)+var(--ws-control-icon-size-md)+var(--ws-control-gap-md)-var(--field-edge-extra,0px))]',
  lg: 'ps-[calc(var(--ws-space-14)+var(--ws-control-icon-size-lg)+var(--ws-control-gap-lg)-var(--field-edge-extra,0px))]',
  xl: 'ps-[calc(var(--ws-space-16)+var(--ws-control-icon-size-xl)+var(--ws-control-gap-xl)-var(--field-edge-extra,0px))]',
}

export const iconRoomEnd = {
  xs: 'pe-[calc(var(--ws-space-8)+var(--ws-control-icon-size-xs)+var(--ws-control-gap-xs)-var(--field-edge-extra,0px))]',
  sm: 'pe-[calc(var(--ws-space-10)+var(--ws-control-icon-size-sm)+var(--ws-control-gap-sm)-var(--field-edge-extra,0px))]',
  md: 'pe-[calc(var(--ws-space-12)+var(--ws-control-icon-size-md)+var(--ws-control-gap-md)-var(--field-edge-extra,0px))]',
  lg: 'pe-[calc(var(--ws-space-14)+var(--ws-control-icon-size-lg)+var(--ws-control-gap-lg)-var(--field-edge-extra,0px))]',
  xl: 'pe-[calc(var(--ws-space-16)+var(--ws-control-icon-size-xl)+var(--ws-control-gap-xl)-var(--field-edge-extra,0px))]',
}

export type FieldSize = keyof typeof iconRoomStart

export const fieldSizeNames = Object.keys(iconRoomStart) as FieldSize[]

/** The bare field draws no edge at rest: highlighted, it gives back the whole edge it draws. */
const bareHighlight = [
  {
    variant: 'none',
    highlight: true,
    class: '[--field-edge-extra:var(--ws-control-border-width-rest)]',
  },
  {
    variant: 'none',
    highlight: true,
    color: 'error',
    class: '[--field-edge-extra:var(--ws-control-border-width-invalid)]',
  },
]

/** Nuxt UI sets the value smaller from md up, where iOS would not zoom: the system keeps one size. */
const oneValueSize = [
  { fixed: false, size: ['xs', 'sm'], class: 'md:text-body-sm' },
  { fixed: false, size: ['md', 'lg', 'xl'], class: 'md:text-body' },
]

/**
 * A field's icons, wherever its focus is: text before or after the value starts past an icon,
 * and the loading icon turns only for a reader who has not asked for less motion.
 */
const fieldIcons = [
  ...fieldSizeNames.map((size) => ({ leading: true, size, class: iconRoomStart[size] })),
  ...fieldSizeNames.map((size) => ({ trailing: true, size, class: iconRoomEnd[size] })),
  { loading: true, leading: true, class: { leadingIcon: 'animate-none motion-safe:animate-spin' } },
  {
    loading: true,
    leading: false,
    trailing: true,
    class: { trailingIcon: 'animate-none motion-safe:animate-spin' },
  },
]

/**
 * What every field shares across its states: the edge on hover, on focus and disabled, the
 * focus ring, the highlighted edge, and one size of the value at every width.
 */
export const fieldStateVariants = [
  // The edge lightens on hover, stays as it is on focus, where the ring shows, and fades when
  // the field is disabled.
  {
    variant: ['outline', 'subtle'],
    class:
      'hover:border-(--ws-field-border-hover) focus-visible:border-(--ws-field-border-rest) disabled:border-(--ws-field-border-disabled) outline-interactive focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-3',
  },
  {
    variant: ['soft', 'ghost'],
    class:
      'outline-interactive focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-3',
  },
  ...byColor(fieldHighlight, { highlight: true }),
  ...bareHighlight,
  ...oneValueSize,
]

export const fieldCompoundVariants = [...fieldStateVariants, ...fieldIcons]

/** The same, with the focus inside. */
export const fieldWithinCompoundVariants = [
  {
    variant: ['outline', 'subtle'],
    class:
      'hover:border-(--ws-field-border-hover) has-focus-visible:border-(--ws-field-border-rest) data-disabled:border-(--ws-field-border-disabled) outline-interactive has-focus-visible:outline-2 has-focus-visible:outline-solid has-focus-visible:outline-offset-3',
  },
  {
    variant: ['soft', 'ghost'],
    class:
      'outline-interactive has-focus-visible:outline-2 has-focus-visible:outline-solid has-focus-visible:outline-offset-3',
  },
  ...byColor(highlightWithin, { highlight: true }),
  ...bareHighlight,
  ...oneValueSize,
  ...fieldIcons,
]

/**
 * In a field group each control's edge lies over the one before it, so that the two make one
 * line. A field in a color or under the pointer comes over the controls beside it, so that the
 * line is its edge, and one with the focus, on itself or on a part inside it, over those too, so
 * that its ring shows whole: on the part that is the group's item, the field itself, or the root
 * around a text field.
 */
export const inGroup = [
  {
    fieldGroup: ['horizontal', 'vertical'],
    class: 'hover:z-[1] focus-visible:z-[2] has-focus-visible:z-[2]',
  },
  { fieldGroup: ['horizontal', 'vertical'], highlight: true, class: 'z-[1]' },
]

export const inGroupRoot = [
  {
    fieldGroup: ['horizontal', 'vertical'],
    class: { root: 'hover:z-[1] has-focus-visible:z-[2]' },
  },
  { fieldGroup: ['horizontal', 'vertical'], highlight: true, class: { root: 'z-[1]' } },
]
