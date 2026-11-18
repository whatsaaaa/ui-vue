import {
  type ByColor,
  byColor,
  focusRing,
  forcedControlEdge,
  forcedIcon,
  solid,
  text,
  tint,
  transition,
} from './shared.ts'

/*
 * The button of the design system's spec, specs/button.spec.json: a mono label in semibold, in a
 * box of the control height, a fill of the interactive color for the one action a view leads to
 * and an outline for the rest. Its five kinds are Nuxt UI's colors and variants:
 *
 *   primary    primary solid
 *   secondary  neutral outline
 *   ghost      neutral ghost
 *   quiet      primary link
 *   danger     error outline
 *
 * They read the component tier by name, --ws-button-* and --ws-control-*, so a change of the
 * tier reaches them. The other colors and variants keep working on the roles, outside the spec.
 *
 * Every kind but the link has an edge, a border of the control's width, transparent where the
 * kind has none: a border, not Nuxt UI's ring, so that forced colors keep it. The ring is taken
 * off wherever Nuxt UI draws one.
 */

/**
 * A fill, its edge the same color. The primary button takes the system's hover and pressed
 * fills, a step further from the page. A status fill has none of its own: it is already the text
 * color in the light theme, so it lightens toward the page, which keeps the contrast of its label.
 */
const solidFill: ByColor = {
  ...solid,
  primary:
    'bg-(--ws-button-primary-bg-rest) border-(--ws-button-primary-bg-rest) text-(--ws-button-primary-text-rest)',
}

const solidHover: ByColor = {
  primary:
    'hover:bg-(--ws-button-primary-bg-hover) hover:border-(--ws-button-primary-bg-hover) active:bg-(--ws-button-primary-bg-active) active:border-(--ws-button-primary-bg-active)',
  success: 'hover:bg-tip-text/85 active:bg-tip-text/85',
  info: 'hover:bg-note-text/85 active:bg-note-text/85',
  warning: 'hover:bg-warning-text/85 active:bg-warning-text/85',
  error: 'hover:bg-danger-text/85 active:bg-danger-text/85',
  neutral: 'hover:bg-text/85 active:bg-text/85',
}

/**
 * An edge around text on the page, on no fill, loading too: Nuxt UI fills a disabled neutral
 * outline with the page color. Secondary keeps the lighter edge while it is pressed, as Space
 * presses it without the pointer on it: the field border on the raised fill is under 3:1.
 */
const outline: ByColor = {
  primary:
    'ring-0 border-interactive text-interactive bg-transparent hover:bg-interactive/10 active:bg-interactive/10',
  success: 'ring-0 border-tip text-tip-text bg-transparent hover:bg-tip/10 active:bg-tip/10',
  info: 'ring-0 border-note text-note-text bg-transparent hover:bg-note/10 active:bg-note/10',
  warning:
    'ring-0 border-warning text-warning-text bg-transparent hover:bg-warning/10 active:bg-warning/10',
  error:
    'ring-0 border-(--ws-button-danger-border-rest) text-(--ws-button-danger-text-rest) bg-transparent hover:bg-(--ws-button-danger-bg-hover) active:bg-(--ws-button-danger-bg-active)',
  neutral:
    'ring-0 border-(--ws-button-secondary-border-rest) text-(--ws-button-secondary-text-rest) bg-transparent hover:border-(--ws-button-secondary-border-hover) hover:bg-(--ws-button-secondary-bg-hover) active:border-(--ws-button-secondary-border-active) active:bg-(--ws-button-secondary-bg-active) disabled:bg-transparent aria-disabled:bg-transparent',
}

const softHover: ByColor = {
  primary: 'hover:bg-interactive/15 active:bg-interactive/15',
  success: 'hover:bg-tip/15 active:bg-tip/15',
  info: 'hover:bg-note/15 active:bg-note/15',
  warning: 'hover:bg-warning/15 active:bg-warning/15',
  error: 'hover:bg-danger/15 active:bg-danger/15',
  neutral: 'hover:bg-accented active:bg-accented',
}

const subtleEdge: ByColor = {
  primary: 'ring-0 border-interactive/50',
  success: 'ring-0 border-tip/50',
  info: 'ring-0 border-note/50',
  warning: 'ring-0 border-warning/50',
  error: 'ring-0 border-danger/50',
  neutral: 'ring-0 border-border',
}

const ghost: ByColor = {
  ...text,
  neutral: 'text-(--ws-button-ghost-text-rest)',
}

const ghostHover: ByColor = {
  primary: 'hover:bg-interactive/10 active:bg-interactive/10',
  success: 'hover:bg-tip/10 active:bg-tip/10',
  info: 'hover:bg-note/10 active:bg-note/10',
  warning: 'hover:bg-warning/10 active:bg-warning/10',
  error: 'hover:bg-danger/10 active:bg-danger/10',
  neutral: 'hover:bg-(--ws-button-ghost-bg-hover) active:bg-(--ws-button-ghost-bg-active)',
}

/**
 * A link is the quiet button: no box, the regular weight, underlined as links in the system are,
 * the line thicker on hover.
 */
const link: ByColor = {
  primary:
    'text-(--ws-button-quiet-text-rest) hover:text-(--ws-button-quiet-text-rest) active:text-(--ws-button-quiet-text-rest)',
  success: 'text-tip-text hover:text-tip-text active:text-tip-text',
  info: 'text-note-text hover:text-note-text active:text-note-text',
  warning: 'text-warning-text hover:text-warning-text active:text-warning-text',
  error: 'text-danger-text hover:text-danger-text active:text-danger-text',
  neutral: 'text-text-secondary hover:text-text active:text-text',
}

const kinds = ['solid', 'outline', 'soft', 'subtle', 'ghost']

export default {
  slots: {
    base: `rounded-(--ws-control-radius) border-(length:--ws-control-border-width-rest) border-transparent font-mono font-semibold cursor-pointer disabled:opacity-100 aria-disabled:opacity-100 ${transition} ${focusRing}`,
    label: 'truncate',
    leadingIcon: forcedIcon,
    trailingIcon: forcedIcon,
  },
  variants: {
    size: {
      xs: {
        base: 'h-(--ws-control-height-xs) px-(--ws-space-10) py-0 gap-(--ws-control-gap-xs) text-label-sm',
        leadingIcon: 'size-(--ws-control-icon-size-xs)',
        trailingIcon: 'size-(--ws-control-icon-size-xs)',
      },
      sm: {
        base: 'h-(--ws-control-height-sm) px-(--ws-space-12) py-0 gap-(--ws-control-gap-sm) text-label-sm',
        leadingIcon: 'size-(--ws-control-icon-size-sm)',
        trailingIcon: 'size-(--ws-control-icon-size-sm)',
      },
      md: {
        base: 'h-(--ws-control-height-md) px-(--ws-space-20) py-0 gap-(--ws-control-gap-md) text-label',
        leadingIcon: 'size-(--ws-control-icon-size-md)',
        trailingIcon: 'size-(--ws-control-icon-size-md)',
      },
      lg: {
        base: 'h-(--ws-control-height-lg) px-(--ws-space-20) py-0 gap-(--ws-control-gap-lg) text-label',
        leadingIcon: 'size-(--ws-control-icon-size-lg)',
        trailingIcon: 'size-(--ws-control-icon-size-lg)',
      },
      xl: {
        base: 'h-(--ws-control-height-xl) px-(--ws-space-24) py-0 gap-(--ws-control-gap-xl) text-body',
        leadingIcon: 'size-(--ws-control-icon-size-xl)',
        trailingIcon: 'size-(--ws-control-icon-size-xl)',
      },
    },
    block: {
      true: { base: 'w-full justify-center' },
    },
  },
  compoundVariants: [
    ...byColor(solidFill, { variant: 'solid' }),
    ...byColor(solidHover, { variant: 'solid' }),
    ...byColor(outline, { variant: 'outline' }),
    ...byColor(tint, { variant: 'soft' }),
    ...byColor(softHover, { variant: 'soft' }),
    ...byColor(tint, { variant: 'subtle' }),
    ...byColor(softHover, { variant: 'subtle' }),
    ...byColor(subtleEdge, { variant: 'subtle' }),
    ...byColor(ghost, { variant: 'ghost' }),
    ...byColor(ghostHover, { variant: 'ghost' }),
    ...byColor(link, { variant: 'link' }),
    {
      variant: 'link',
      class:
        'h-auto px-0 border-0 font-normal underline decoration-1 underline-offset-[0.2em] hover:decoration-2 active:decoration-2',
    },
    // Disabled, every kind is faint: an edge of the faint color around faint text. A loading
    // button is disabled too, but keeps its look, with the icon turning in it.
    {
      variant: kinds,
      loading: false,
      class:
        'disabled:bg-transparent disabled:text-(--ws-button-text-disabled) disabled:border-(--ws-button-border-disabled) aria-disabled:bg-transparent aria-disabled:text-(--ws-button-text-disabled) aria-disabled:border-(--ws-button-border-disabled)',
    },
    // In forced colors the edge of every kind but the link takes the system's button border.
    { variant: kinds, class: forcedControlEdge },
    {
      variant: 'ghost',
      loading: false,
      class: 'disabled:border-transparent aria-disabled:border-transparent',
    },
    {
      variant: 'link',
      loading: false,
      class:
        'disabled:text-(--ws-button-text-disabled) disabled:no-underline aria-disabled:text-(--ws-button-text-disabled) aria-disabled:no-underline',
    },
    // Nuxt UI tints the focus outline with the color and widens it: the ring is the system's.
    {
      class:
        'outline-interactive focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-3',
    },
    // An icon button is as wide as it is tall.
    { square: true, size: 'xs', class: 'w-(--ws-control-height-xs) px-0 justify-center' },
    { square: true, size: 'sm', class: 'w-(--ws-control-height-sm) px-0 justify-center' },
    { square: true, size: 'md', class: 'w-(--ws-control-height-md) px-0 justify-center' },
    { square: true, size: 'lg', class: 'w-(--ws-control-height-lg) px-0 justify-center' },
    { square: true, size: 'xl', class: 'w-(--ws-control-height-xl) px-0 justify-center' },
    // The loading icon turns only for a reader who has not asked for less motion.
    {
      loading: true,
      leading: true,
      class: { leadingIcon: 'animate-none motion-safe:animate-spin' },
    },
    {
      loading: true,
      leading: false,
      trailing: true,
      class: { trailingIcon: 'animate-none motion-safe:animate-spin' },
    },
  ],
}
