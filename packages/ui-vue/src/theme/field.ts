import { type ByColor, byColor, forcedControlEdge } from './shared.ts'

/*
 * What a text field, a select and a select menu share: the field of the design system's input
 * spec, specs/input.spec.json. The control height, the value in Inter, an edge in the field
 * border on the page color, the text color's secondary on hover. With an error the edge is the
 * danger color, two pixels wide. They read the component tier by name, --ws-field-* and
 * --ws-control-*, so a change of the tier reaches them.
 *
 * The edge is a border, not Nuxt UI's ring, so that forced colors keep it; the ring is taken off.
 * A border takes room, so the field is laid out from its outer edge: the value and an icon start
 * the padding and the rest edge in. The wider edge of an error takes what it adds to the rest
 * width, --field-edge-extra, off the paddings inside it, so nothing moves when it widens.
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
  outline: `text-(--ws-field-text-rest) bg-(--ws-field-bg) ${edge} border-(--ws-field-border-rest) ${forcedControlEdge}`,
  soft: `text-text bg-raised/60 hover:bg-raised focus:bg-raised disabled:bg-transparent ${edge} border-transparent ${forcedControlEdge}`,
  subtle: `text-text bg-raised ${edge} border-field-border ${forcedControlEdge}`,
  ghost: `text-text bg-transparent hover:bg-raised focus:bg-raised disabled:bg-transparent ${edge} border-transparent ${forcedControlEdge}`,
  none: 'text-text bg-transparent',
}

/**
 * A highlighted field takes its color as the edge, and keeps it on hover and focus. A field in
 * error is highlighted in the error color: the invalid edge, wider.
 */
const highlight: ByColor = {
  primary: `${edge} border-interactive hover:border-interactive focus-visible:border-interactive`,
  success: `${edge} border-tip hover:border-tip focus-visible:border-tip`,
  info: `${edge} border-note hover:border-note focus-visible:border-note`,
  warning: `${edge} border-warning hover:border-warning focus-visible:border-warning`,
  error: `${invalidEdge} border-(--ws-field-border-invalid) hover:border-(--ws-field-border-invalid) focus-visible:border-(--ws-field-border-invalid)`,
  neutral: `${edge} border-text hover:border-text focus-visible:border-text`,
}

/** Text before or after the value starts past the icon: the field's padding, the icon and the gap. */
const iconRoom = [
  {
    leading: true,
    size: 'xs',
    class:
      'ps-[calc(var(--ws-space-8)+var(--ws-control-icon-size-xs)+var(--ws-control-gap-xs)-var(--field-edge-extra,0px))]',
  },
  {
    leading: true,
    size: 'sm',
    class:
      'ps-[calc(var(--ws-space-10)+var(--ws-control-icon-size-sm)+var(--ws-control-gap-sm)-var(--field-edge-extra,0px))]',
  },
  {
    leading: true,
    size: 'md',
    class:
      'ps-[calc(var(--ws-space-12)+var(--ws-control-icon-size-md)+var(--ws-control-gap-md)-var(--field-edge-extra,0px))]',
  },
  {
    leading: true,
    size: 'lg',
    class:
      'ps-[calc(var(--ws-space-14)+var(--ws-control-icon-size-lg)+var(--ws-control-gap-lg)-var(--field-edge-extra,0px))]',
  },
  {
    leading: true,
    size: 'xl',
    class:
      'ps-[calc(var(--ws-space-16)+var(--ws-control-icon-size-xl)+var(--ws-control-gap-xl)-var(--field-edge-extra,0px))]',
  },
  {
    trailing: true,
    size: 'xs',
    class:
      'pe-[calc(var(--ws-space-8)+var(--ws-control-icon-size-xs)+var(--ws-control-gap-xs)-var(--field-edge-extra,0px))]',
  },
  {
    trailing: true,
    size: 'sm',
    class:
      'pe-[calc(var(--ws-space-10)+var(--ws-control-icon-size-sm)+var(--ws-control-gap-sm)-var(--field-edge-extra,0px))]',
  },
  {
    trailing: true,
    size: 'md',
    class:
      'pe-[calc(var(--ws-space-12)+var(--ws-control-icon-size-md)+var(--ws-control-gap-md)-var(--field-edge-extra,0px))]',
  },
  {
    trailing: true,
    size: 'lg',
    class:
      'pe-[calc(var(--ws-space-14)+var(--ws-control-icon-size-lg)+var(--ws-control-gap-lg)-var(--field-edge-extra,0px))]',
  },
  {
    trailing: true,
    size: 'xl',
    class:
      'pe-[calc(var(--ws-space-16)+var(--ws-control-icon-size-xl)+var(--ws-control-gap-xl)-var(--field-edge-extra,0px))]',
  },
]

export const fieldCompoundVariants = [
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
  ...byColor(highlight, { highlight: true }),
  ...iconRoom,
  // Nuxt UI sets the value smaller from md up, where iOS would not zoom: the system keeps one size.
  { fixed: false, size: ['xs', 'sm'], class: 'md:text-body-sm' },
  { fixed: false, size: ['md', 'lg', 'xl'], class: 'md:text-body' },
  // The loading icon turns only for a reader who has not asked for less motion.
  { loading: true, leading: true, class: { leadingIcon: 'animate-none motion-safe:animate-spin' } },
  {
    loading: true,
    leading: false,
    trailing: true,
    class: { trailingIcon: 'animate-none motion-safe:animate-spin' },
  },
]
