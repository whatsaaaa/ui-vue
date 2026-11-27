import { type ByColor, byColor, forcedEdge, forcedIcon, solid } from './shared.ts'

/*
 * The badge of the design system's spec, specs/badge.spec.json: the system's tag, a mono label on
 * a tint of its color, in the small radius. The tag is the soft variant, so soft is the default.
 * Its kinds are Nuxt UI's colors and variants:
 *
 *   primary, success, info, warning, neutral  that color, soft
 *   danger                                    error, soft
 *   outline                                   neutral, outline
 *
 * They read the component tier by name, --ws-tag-*, so a change of the tier reaches them. The
 * other colors and variants keep working on the roles, outside the spec.
 *
 * The outlined tag's edge is a border, not Nuxt UI's ring, so that forced colors keep it, and it
 * is roomier than a tag on a tint: its padding-inline is inside the edge, and its padding-block
 * holds the edge, as .ws-tag--outline draws it. Its icons are the system's icon size at every
 * size: a tag does not grow its icon as a control does.
 */

/** A tint of the color under its text color: the tag, at every color of the tier. */
const tag: ByColor = {
  primary: 'bg-(--ws-tag-primary-bg-rest) text-(--ws-tag-primary-text-rest)',
  success: 'bg-(--ws-tag-success-bg-rest) text-(--ws-tag-success-text-rest)',
  info: 'bg-(--ws-tag-info-bg-rest) text-(--ws-tag-info-text-rest)',
  warning: 'bg-(--ws-tag-warning-bg-rest) text-(--ws-tag-warning-text-rest)',
  error: 'bg-(--ws-tag-danger-bg-rest) text-(--ws-tag-danger-text-rest)',
  neutral: 'bg-(--ws-tag-neutral-bg-rest) text-(--ws-tag-neutral-text-rest)',
}

/**
 * The outlined tag: the edge of a card, in the text color, on no fill. In another color the edge
 * and the word are that color's.
 */
const outline: ByColor = {
  primary: 'ring-0 bg-transparent border-interactive text-interactive',
  success: 'ring-0 bg-transparent border-tip text-tip-text',
  info: 'ring-0 bg-transparent border-note text-note-text',
  warning: 'ring-0 bg-transparent border-warning text-warning-text',
  error: 'ring-0 bg-transparent border-danger text-danger-text',
  neutral: 'ring-0 bg-transparent border-border text-(--ws-tag-outline-text-rest)',
}

/** The edge of a subtle badge, over its tint. */
const subtleRing: ByColor = {
  primary: 'ring ring-inset ring-interactive/50',
  success: 'ring ring-inset ring-tip/50',
  info: 'ring ring-inset ring-note/50',
  warning: 'ring ring-inset ring-warning/50',
  error: 'ring ring-inset ring-danger/50',
  neutral: 'ring ring-inset ring-border',
}

/** The tag's room and type at each size: an input's tags take them too. */
export const tagSizes = {
  xs: 'rounded-(--ws-tag-radius) px-(--ws-tag-padding-inline-xs) py-0 gap-(--ws-space-4) text-caption',
  sm: 'rounded-(--ws-tag-radius) px-(--ws-tag-padding-inline-sm) py-(--ws-tag-padding-block-sm) gap-(--ws-space-4) text-caption',
  md: 'rounded-(--ws-tag-radius) px-(--ws-tag-padding-inline-md) py-(--ws-tag-padding-block-md) gap-(--ws-space-6) text-label-sm',
  lg: 'rounded-(--ws-tag-radius) px-(--ws-tag-padding-inline-lg) py-(--ws-tag-padding-block-lg) gap-(--ws-space-6) text-label',
  xl: 'rounded-(--ws-tag-radius) px-(--ws-tag-padding-inline-xl) py-(--ws-tag-padding-block-xl) gap-(--ws-space-8) text-label',
}

/** The icon of the system's text, at every size. */
const icon = { leadingIcon: 'size-icon', trailingIcon: 'size-icon' }

export default {
  slots: {
    // in forced colors every tag is outlined
    base: `rounded-(--ws-tag-radius) font-mono font-normal whitespace-nowrap ${forcedEdge}`,
    label: 'truncate',
    leadingIcon: forcedIcon,
    trailingIcon: forcedIcon,
  },
  variants: {
    size: {
      xs: { base: tagSizes.xs, ...icon },
      sm: { base: tagSizes.sm, ...icon },
      md: { base: tagSizes.md, ...icon },
      lg: { base: tagSizes.lg, ...icon },
      xl: { base: tagSizes.xl, ...icon },
    },
  },
  compoundVariants: [
    ...byColor(solid, { variant: 'solid' }),
    ...byColor(outline, { variant: 'outline' }),
    ...byColor(tag, { variant: 'soft' }),
    ...byColor(tag, { variant: 'subtle' }),
    ...byColor(subtleRing, { variant: 'subtle' }),
    // the outlined tag's edge, and its room: the edge is outside its padding-inline and inside its
    // padding-block
    { variant: 'outline', class: 'border-(length:--ws-border-width-thin) border-solid' },
    {
      variant: 'outline',
      size: 'xs',
      class:
        'px-(--ws-tag-outline-padding-inline-xs) py-[calc(var(--ws-tag-outline-padding-block-xs)_-_var(--ws-border-width-thin))]',
    },
    {
      variant: 'outline',
      size: 'sm',
      class:
        'px-(--ws-tag-outline-padding-inline-sm) py-[calc(var(--ws-tag-outline-padding-block-sm)_-_var(--ws-border-width-thin))]',
    },
    {
      variant: 'outline',
      size: 'md',
      class:
        'px-(--ws-tag-outline-padding-inline-md) py-[calc(var(--ws-tag-outline-padding-block-md)_-_var(--ws-border-width-thin))]',
    },
    {
      variant: 'outline',
      size: 'lg',
      class:
        'px-(--ws-tag-outline-padding-inline-lg) py-[calc(var(--ws-tag-outline-padding-block-lg)_-_var(--ws-border-width-thin))]',
    },
    {
      variant: 'outline',
      size: 'xl',
      class:
        'px-(--ws-tag-outline-padding-inline-xl) py-[calc(var(--ws-tag-outline-padding-block-xl)_-_var(--ws-border-width-thin))]',
    },
    { size: ['xs', 'sm'], square: true, class: 'p-0.5' },
    { size: ['md', 'lg', 'xl'], square: true, class: 'p-1' },
  ],
  defaultVariants: {
    variant: 'soft',
  },
}
