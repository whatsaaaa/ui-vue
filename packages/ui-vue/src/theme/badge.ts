import { type ByColor, byColor, forcedEdge, forcedIcon, solid, tint } from './shared.ts'

/*
 * A badge is the system's tag: a mono label on a tint, in the small radius. The tag is the soft
 * variant, so soft is the default. Outlined and neutral, it is the outlined tag.
 */

const outline: ByColor = {
  primary: 'ring ring-inset ring-interactive text-interactive',
  success: 'ring ring-inset ring-tip text-tip-text',
  info: 'ring ring-inset ring-note text-note-text',
  warning: 'ring ring-inset ring-warning text-warning-text',
  error: 'ring ring-inset ring-danger text-danger-text',
  neutral: 'ring ring-inset ring-border text-text',
}

const subtleRing: ByColor = {
  primary: 'ring ring-inset ring-interactive/50',
  success: 'ring ring-inset ring-tip/50',
  info: 'ring ring-inset ring-note/50',
  warning: 'ring ring-inset ring-warning/50',
  error: 'ring ring-inset ring-danger/50',
  neutral: 'ring ring-inset ring-border',
}

export default {
  slots: {
    // in forced colors every tag is outlined
    base: `rounded-sm font-mono font-normal whitespace-nowrap ${forcedEdge}`,
    label: 'truncate',
    leadingIcon: forcedIcon,
    trailingIcon: forcedIcon,
  },
  variants: {
    size: {
      xs: {
        base: 'rounded-sm px-1.5 py-0 gap-1 text-caption',
        leadingIcon: 'size-3',
        trailingIcon: 'size-3',
      },
      sm: {
        base: 'rounded-sm px-1.5 py-0.5 gap-1 text-caption',
        leadingIcon: 'size-3',
        trailingIcon: 'size-3',
      },
      md: {
        base: 'rounded-sm px-2 py-0.5 gap-1.5 text-label-sm',
        leadingIcon: 'size-3.5',
        trailingIcon: 'size-3.5',
      },
      lg: {
        base: 'rounded-sm px-2.5 py-1 gap-1.5 text-label',
        leadingIcon: 'size-icon',
        trailingIcon: 'size-icon',
      },
      xl: {
        base: 'rounded-sm px-3 py-1.5 gap-2 text-label',
        leadingIcon: 'size-icon',
        trailingIcon: 'size-icon',
      },
    },
  },
  compoundVariants: [
    ...byColor(solid, { variant: 'solid' }),
    ...byColor(outline, { variant: 'outline' }),
    ...byColor(tint, { variant: 'soft' }),
    ...byColor(tint, { variant: 'subtle' }),
    ...byColor(subtleRing, { variant: 'subtle' }),
    { size: ['xs', 'sm'], square: true, class: 'p-0.5' },
    { size: ['md', 'lg', 'xl'], square: true, class: 'p-1' },
  ],
  defaultVariants: {
    variant: 'soft',
  },
}
