import { type ByColor, byColor, forcedControlEdge } from './shared.ts'

/*
 * What a text field, a select and a select menu share: the field of the sample apps. Forty
 * pixels tall, the value in Inter, an outline in the field border on the page color, the text
 * color's secondary on hover. With an error the outline is the danger color, two pixels wide.
 */

/** The heights, paddings and value sizes, for the field and the icons in it. */
export const fieldSizes = {
  xs: {
    base: 'h-7 px-2 py-0 gap-1.5 text-body-sm',
    leading: 'ps-2',
    trailing: 'pe-2',
    leadingIcon: 'size-icon',
    trailingIcon: 'size-icon',
  },
  sm: {
    base: 'h-8 px-2.5 py-0 gap-1.5 text-body-sm',
    leading: 'ps-2.5',
    trailing: 'pe-2.5',
    leadingIcon: 'size-icon',
    trailingIcon: 'size-icon',
  },
  md: {
    base: 'h-control px-3 py-0 gap-2 text-body',
    leading: 'ps-3',
    trailing: 'pe-3',
    leadingIcon: 'size-icon',
    trailingIcon: 'size-icon',
  },
  lg: {
    base: 'h-11 px-3.5 py-0 gap-2 text-body',
    leading: 'ps-3.5',
    trailing: 'pe-3.5',
    leadingIcon: 'size-5',
    trailingIcon: 'size-5',
  },
  xl: {
    base: 'h-12 px-4 py-0 gap-2.5 text-body',
    leading: 'ps-4',
    trailing: 'pe-4',
    leadingIcon: 'size-5',
    trailingIcon: 'size-5',
  },
}

/** In forced colors every field but the bare one is outlined, as a field there is. */
export const fieldVariants = {
  outline: `text-text bg-bg ring ring-inset ring-field-border ${forcedControlEdge}`,
  soft: `text-text bg-raised/60 hover:bg-raised focus:bg-raised disabled:bg-transparent ${forcedControlEdge}`,
  subtle: `text-text bg-raised ring ring-inset ring-field-border ${forcedControlEdge}`,
  ghost: `text-text bg-transparent hover:bg-raised focus:bg-raised disabled:bg-transparent ${forcedControlEdge}`,
  none: 'text-text bg-transparent',
}

/** A highlighted field takes its color as the outline, and keeps it on hover and focus. */
const highlight: ByColor = {
  primary: 'ring ring-inset ring-interactive hover:ring-interactive focus-visible:ring-interactive',
  success: 'ring ring-inset ring-tip hover:ring-tip focus-visible:ring-tip',
  info: 'ring ring-inset ring-note hover:ring-note focus-visible:ring-note',
  warning: 'ring ring-inset ring-warning hover:ring-warning focus-visible:ring-warning',
  error: 'ring-2 ring-inset ring-danger hover:ring-danger focus-visible:ring-danger',
  neutral: 'ring ring-inset ring-text hover:ring-text focus-visible:ring-text',
}

/**
 * Text before or after the value starts past the icon: its padding, the icon and a gap as wide
 * as the padding's part of the gap.
 */
const iconRoom = [
  { leading: true, size: 'xs', class: 'ps-7' },
  { leading: true, size: 'sm', class: 'ps-8' },
  { leading: true, size: 'md', class: 'ps-9' },
  { leading: true, size: 'lg', class: 'ps-11' },
  { leading: true, size: 'xl', class: 'ps-12' },
  { trailing: true, size: 'xs', class: 'pe-7' },
  { trailing: true, size: 'sm', class: 'pe-8' },
  { trailing: true, size: 'md', class: 'pe-9' },
  { trailing: true, size: 'lg', class: 'pe-11' },
  { trailing: true, size: 'xl', class: 'pe-12' },
]

export const fieldCompoundVariants = [
  // The outline lightens on hover, stays as it is on focus, where the ring shows, and fades
  // when the field is disabled.
  {
    variant: ['outline', 'subtle'],
    class:
      'hover:ring-text-secondary focus-visible:ring-field-border disabled:ring-text-faint outline-interactive focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-3',
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
