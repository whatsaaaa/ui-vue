import { fieldHighlight } from './field.ts'
import { byColor, focusRing, forcedControlEdge, forcedIcon, transition } from './shared.ts'

/*
 * A file chosen or dropped: a drop area, or a button, in the field's edge, on the page color,
 * with the system's focus ring. Nuxt UI dashes the drop area's edge; the system has no dashed
 * edge, so it is solid, the field border, the text color's secondary under the pointer and while
 * a file is dragged over it. A highlighted area takes its color as the edge, an area in error
 * the danger color, wider, its padding taking what it adds. The edge is a border, so forced
 * colors keep it, and draw it in the selection color while a file is over the area.
 *
 * The area's words are a label and its help: the label mono, the description in Inter in the
 * secondary text, as a form field's. A chosen file is a row in the field's edge, its name the
 * value and its size a caption.
 */

/** The area's padding, and the button's side, at each size. */
const sizes = {
  xs: {
    base: 'text-body-sm',
    icon: 'size-(--ws-control-icon-size-xs)',
    avatar: 'size-(--ws-control-height-xs) text-(length:--ws-control-icon-size-xs)',
    file: 'text-body-sm px-(--ws-space-8) py-(--ws-space-4) gap-(--ws-control-gap-xs)',
    fileSize: 'text-caption',
  },
  sm: {
    base: 'text-body-sm',
    icon: 'size-(--ws-control-icon-size-sm)',
    avatar: 'size-(--ws-control-height-sm) text-(length:--ws-control-icon-size-sm)',
    file: 'text-body-sm px-(--ws-space-10) py-(--ws-space-6) gap-(--ws-control-gap-sm)',
    fileSize: 'text-caption',
  },
  md: {
    base: 'text-body-sm',
    icon: 'size-(--ws-control-icon-size-md)',
    avatar: 'size-(--ws-control-height-md) text-(length:--ws-control-icon-size-md)',
    file: 'text-body-sm px-(--ws-space-12) py-(--ws-space-6) gap-(--ws-control-gap-md)',
    fileSize: 'text-caption',
  },
  lg: {
    base: 'text-body',
    icon: 'size-(--ws-control-icon-size-lg)',
    avatar: 'size-(--ws-control-height-lg) text-(length:--ws-control-icon-size-lg)',
    file: 'text-body px-(--ws-space-14) py-(--ws-space-8) gap-(--ws-control-gap-lg)',
    fileSize: 'text-caption',
  },
  xl: {
    base: 'text-body',
    icon: 'size-(--ws-control-icon-size-xl)',
    avatar: 'size-(--ws-control-height-xl) text-(length:--ws-control-icon-size-xl)',
    file: 'text-body px-(--ws-space-16) py-(--ws-space-8) gap-(--ws-control-gap-xl)',
    fileSize: 'text-caption',
  },
}

/** The button at each size: a square of the control's height around its icon. */
const buttons = (['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => ({
  variant: 'button',
  size,
  class: {
    base: {
      xs: 'flex-none size-(--ws-control-height-xs) p-0 items-center',
      sm: 'flex-none size-(--ws-control-height-sm) p-0 items-center',
      md: 'flex-none size-(--ws-control-height-md) p-0 items-center',
      lg: 'flex-none size-(--ws-control-height-lg) p-0 items-center',
      xl: 'flex-none size-(--ws-control-height-xl) p-0 items-center',
    }[size],
  },
}))

export default {
  slots: {
    base: `bg-(--ws-field-bg-rest) border-(length:--ws-control-border-width-rest) border-solid border-(--ws-field-border-rest) rounded-(--ws-control-radius) ${forcedControlEdge} ${transition}`,
    icon: `text-(--ws-field-icon-rest) ${forcedIcon}`,
    avatar: 'bg-raised',
    label: 'mt-(--ws-space-8) font-mono font-normal text-label text-(--ws-field-label-text-rest)',
    description: 'mt-(--ws-space-4) font-sans text-text-secondary',
    actions: 'mt-(--ws-space-16) gap-(--ws-space-8)',
    file: 'font-sans text-(--ws-field-text-rest)',
    fileName: 'text-(--ws-field-text-rest)',
    fileSize: 'font-mono text-text-secondary',
  },
  variants: {
    size: sizes,
    variant: {
      area: {
        base: 'p-[calc(var(--ws-space-16)-var(--field-edge-extra,0px))]',
        wrapper: 'px-(--ws-space-16) py-(--ws-space-12)',
      },
    },
    layout: {
      list: {
        files: 'gap-(--ws-space-8)',
        file: `border-(length:--ws-control-border-width-rest) border-(--ws-field-border-rest) rounded-(--ws-control-radius) ${forcedControlEdge}`,
      },
      grid: {
        fileLeadingAvatar: 'rounded-(--ws-control-radius)',
        files: 'gap-(--ws-space-16)',
      },
    },
  },
  compoundVariants: [
    // over Nuxt UI's ring and edge in each color: the system's ring, the edge as it is at rest
    { class: `${focusRing} focus-visible:border-(--ws-field-border-rest)` },
    {
      interactive: true,
      disabled: false,
      class: 'hover:bg-(--ws-field-bg-rest) hover:border-(--ws-field-border-hover)',
    },
    // disabled, unfaded: the edge and the words in the field's disabled colors
    {
      disabled: true,
      class: {
        base: 'opacity-100 border-(--ws-field-border-disabled)',
        icon: 'text-(--ws-field-text-disabled)',
        label: 'text-(--ws-field-text-disabled)',
        description: 'text-(--ws-field-text-disabled)',
      },
    },
    // solid, as every edge of the system, and under a file dragged over it as under the pointer
    {
      dropzone: true,
      class:
        'border-solid data-[dragging=true]:bg-(--ws-field-bg-rest) data-[dragging=true]:border-(--ws-field-border-hover) forced-colors:data-[dragging=true]:border-[Highlight]',
    },
    ...byColor(fieldHighlight, { highlight: true }),
    ...buttons,
  ],
}
