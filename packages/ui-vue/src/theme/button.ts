import { type ByColor, byColor, focusRing, solid, text, tint, transition } from './shared.ts'

/*
 * The button of the sample apps: forty pixels tall, a mono label in semibold, an outline in
 * the field border or a fill of the interactive color. Disabled, every kind is faint.
 */

/**
 * The primary button takes the system's hover and pressed fills, a step further from the page.
 * A status fill has none of its own: it is already the text color in the light theme, so it
 * lightens toward the page, which keeps the contrast of its label.
 */
const solidHover: ByColor = {
  primary: 'hover:bg-interactive-hover active:bg-interactive-active',
  success: 'hover:bg-tip-text/85 active:bg-tip-text/85',
  info: 'hover:bg-note-text/85 active:bg-note-text/85',
  warning: 'hover:bg-warning-text/85 active:bg-warning-text/85',
  error: 'hover:bg-danger-text/85 active:bg-danger-text/85',
  neutral: 'hover:bg-text/85 active:bg-text/85',
}

const outline: ByColor = {
  primary:
    'ring ring-inset ring-interactive text-interactive bg-transparent hover:bg-interactive/10 active:bg-interactive/10 focus-visible:ring-interactive',
  success:
    'ring ring-inset ring-tip text-tip-text bg-transparent hover:bg-tip/10 active:bg-tip/10 focus-visible:ring-tip',
  info: 'ring ring-inset ring-note text-note-text bg-transparent hover:bg-note/10 active:bg-note/10 focus-visible:ring-note',
  warning:
    'ring ring-inset ring-warning text-warning-text bg-transparent hover:bg-warning/10 active:bg-warning/10 focus-visible:ring-warning',
  error:
    'ring ring-inset ring-danger text-danger-text bg-transparent hover:bg-danger/10 active:bg-danger/10 focus-visible:ring-danger',
  neutral:
    'ring ring-inset ring-field-border text-text bg-transparent hover:ring-text-secondary hover:bg-raised active:bg-raised focus-visible:ring-field-border',
}

const softHover: ByColor = {
  primary: 'hover:bg-interactive/15 active:bg-interactive/15',
  success: 'hover:bg-tip/15 active:bg-tip/15',
  info: 'hover:bg-note/15 active:bg-note/15',
  warning: 'hover:bg-warning/15 active:bg-warning/15',
  error: 'hover:bg-danger/15 active:bg-danger/15',
  neutral: 'hover:bg-accented active:bg-accented',
}

const subtleRing: ByColor = {
  primary: 'ring ring-inset ring-interactive/50 focus-visible:ring-interactive/50',
  success: 'ring ring-inset ring-tip/50 focus-visible:ring-tip/50',
  info: 'ring ring-inset ring-note/50 focus-visible:ring-note/50',
  warning: 'ring ring-inset ring-warning/50 focus-visible:ring-warning/50',
  error: 'ring ring-inset ring-danger/50 focus-visible:ring-danger/50',
  neutral: 'ring ring-inset ring-border focus-visible:ring-border',
}

const ghostHover: ByColor = {
  primary: 'hover:bg-interactive/10 active:bg-interactive/10',
  success: 'hover:bg-tip/10 active:bg-tip/10',
  info: 'hover:bg-note/10 active:bg-note/10',
  warning: 'hover:bg-warning/10 active:bg-warning/10',
  error: 'hover:bg-danger/10 active:bg-danger/10',
  neutral: 'hover:bg-raised active:bg-raised',
}

/**
 * A link is the sample apps' quiet button: no box, the regular weight, underlined as links in the
 * system are, the line thicker on hover.
 */
const link: ByColor = {
  primary: 'text-interactive hover:text-interactive active:text-interactive',
  success: 'text-tip-text hover:text-tip-text active:text-tip-text',
  info: 'text-note-text hover:text-note-text active:text-note-text',
  warning: 'text-warning-text hover:text-warning-text active:text-warning-text',
  error: 'text-danger-text hover:text-danger-text active:text-danger-text',
  neutral: 'text-text-secondary hover:text-text active:text-text',
}

const kinds = ['solid', 'outline', 'soft', 'subtle', 'ghost']

export default {
  slots: {
    base: `rounded-md font-mono font-semibold cursor-pointer disabled:opacity-100 aria-disabled:opacity-100 ${transition} ${focusRing}`,
    label: 'truncate',
  },
  variants: {
    size: {
      xs: {
        base: 'h-7 px-2.5 py-0 gap-1.5 text-label-sm',
        leadingIcon: 'size-3.5',
        trailingIcon: 'size-3.5',
      },
      sm: {
        base: 'h-8 px-3 py-0 gap-1.5 text-label-sm',
        leadingIcon: 'size-icon',
        trailingIcon: 'size-icon',
      },
      md: {
        base: 'h-control px-5 py-0 gap-2 text-label',
        leadingIcon: 'size-icon',
        trailingIcon: 'size-icon',
      },
      lg: {
        base: 'h-11 px-5 py-0 gap-2 text-label',
        leadingIcon: 'size-4.5',
        trailingIcon: 'size-4.5',
      },
      xl: {
        base: 'h-12 px-6 py-0 gap-2.5 text-body',
        leadingIcon: 'size-5',
        trailingIcon: 'size-5',
      },
    },
    block: {
      true: { base: 'w-full justify-center' },
    },
  },
  compoundVariants: [
    ...byColor(solid, { variant: 'solid' }),
    ...byColor(solidHover, { variant: 'solid' }),
    ...byColor(outline, { variant: 'outline' }),
    ...byColor(tint, { variant: 'soft' }),
    ...byColor(softHover, { variant: 'soft' }),
    ...byColor(tint, { variant: 'subtle' }),
    ...byColor(softHover, { variant: 'subtle' }),
    ...byColor(subtleRing, { variant: 'subtle' }),
    ...byColor(text, { variant: 'ghost' }),
    ...byColor(ghostHover, { variant: 'ghost' }),
    ...byColor(link, { variant: 'link' }),
    {
      variant: 'link',
      class:
        'h-auto px-0 font-normal underline decoration-1 underline-offset-[0.2em] hover:decoration-2 active:decoration-2',
    },
    // Disabled, every kind is faint: an outline of the faint color around faint text. A loading
    // button is disabled too, but keeps its look, with the icon turning in it.
    {
      variant: kinds,
      loading: false,
      class:
        'disabled:bg-transparent disabled:text-text-faint disabled:ring disabled:ring-inset disabled:ring-text-faint aria-disabled:bg-transparent aria-disabled:text-text-faint aria-disabled:ring aria-disabled:ring-inset aria-disabled:ring-text-faint',
    },
    {
      variant: 'ghost',
      loading: false,
      class: 'disabled:ring-0 aria-disabled:ring-0',
    },
    {
      variant: 'link',
      loading: false,
      class:
        'disabled:text-text-faint disabled:no-underline aria-disabled:text-text-faint aria-disabled:no-underline',
    },
    // Nuxt UI tints the focus outline with the color and widens it: the ring is the system's.
    {
      class:
        'outline-interactive focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-3',
    },
    // An icon button is as wide as it is tall.
    { square: true, size: 'xs', class: 'w-7 px-0 justify-center' },
    { square: true, size: 'sm', class: 'w-8 px-0 justify-center' },
    { square: true, size: 'md', class: 'w-control px-0 justify-center' },
    { square: true, size: 'lg', class: 'w-11 px-0 justify-center' },
    { square: true, size: 'xl', class: 'w-12 px-0 justify-center' },
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
