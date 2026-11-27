import {
  fieldSizeNames,
  fieldSizes,
  fieldStateVariants,
  fieldVariants,
  iconRoomEnd,
  iconRoomStart,
} from './field.ts'
import input from './input.ts'

/*
 * The design system's number field spec, specs/number-field.spec.json: the input's field at the
 * control height, the value in figures of one width, with a step button inside the edge on each
 * side, the decrement at the start and the increment at the end. Each holds its icon where the
 * input draws its icons, at the field's padding inside the edge with the control's gap on each
 * side of it, so the value starts past a button as an input's starts past an icon. The browser's
 * own spin buttons stay hidden, as base.css hides them: Reka's field is a text input, the role
 * spinbutton, that its arrow keys step.
 *
 * A step button is Nuxt UI's link button, which Reka keeps out of the Tab order. It is drawn here,
 * through the slot around it, so that it keeps its look when an app passes its own props, as it
 * does for its name: transparent, raised as a ghost button is while the pointer is on it or it is
 * pressed, its icon in the field's icon color and faint where the button is disabled, in a
 * disabled field and at its limit. Its own edge is none: the field's is around it. The raised
 * fill follows the pointer alone, not the gallery's hover, which is the pointer on the field.
 */

/**
 * The step buttons, whichever side: the box around the icon, the icon's colors, and the raised
 * fill. In forced colors the icon is a button's text, and gray where the button is disabled.
 */
const stepButton =
  '[&>button]:px-0 [&>button]:justify-center [&_[data-slot=leadingIcon]]:text-(--ws-field-icon-rest) [&>button:disabled_[data-slot=leadingIcon]]:text-(--ws-button-text-disabled) [@media(hover:hover)]:[&>button:hover:not(:disabled)]:bg-(--ws-button-ghost-bg-hover) [&>button[data-pressed=true]]:bg-(--ws-button-ghost-bg-active) forced-colors:[&_[data-slot=leadingIcon]:not(svg)]:bg-[ButtonText] forced-colors:[&>button:disabled_[data-slot=leadingIcon]:not(svg)]:bg-[GrayText]'

/**
 * Where a step button is in a row, at each size: its icon the field's padding inside the edge,
 * so the button starts the gap before it; the gap after the icon, and four pixels of the field's
 * height above and below it.
 */
const stepPlace = {
  xs: {
    decrement:
      'ps-[calc(var(--ws-control-border-width-rest)+var(--ws-space-8)-var(--ws-control-gap-xs))]',
    increment:
      'pe-[calc(var(--ws-control-border-width-rest)+var(--ws-space-8)-var(--ws-control-gap-xs))]',
    button:
      '[&>button]:w-[calc(var(--ws-control-icon-size-xs)+var(--ws-control-gap-xs)+var(--ws-control-gap-xs))] [&>button]:h-[calc(var(--ws-control-height-xs)-var(--ws-space-8))]',
  },
  sm: {
    decrement:
      'ps-[calc(var(--ws-control-border-width-rest)+var(--ws-space-10)-var(--ws-control-gap-sm))]',
    increment:
      'pe-[calc(var(--ws-control-border-width-rest)+var(--ws-space-10)-var(--ws-control-gap-sm))]',
    button:
      '[&>button]:w-[calc(var(--ws-control-icon-size-sm)+var(--ws-control-gap-sm)+var(--ws-control-gap-sm))] [&>button]:h-[calc(var(--ws-control-height-sm)-var(--ws-space-8))]',
  },
  md: {
    decrement:
      'ps-[calc(var(--ws-control-border-width-rest)+var(--ws-space-12)-var(--ws-control-gap-md))]',
    increment:
      'pe-[calc(var(--ws-control-border-width-rest)+var(--ws-space-12)-var(--ws-control-gap-md))]',
    button:
      '[&>button]:w-[calc(var(--ws-control-icon-size-md)+var(--ws-control-gap-md)+var(--ws-control-gap-md))] [&>button]:h-[calc(var(--ws-control-height-md)-var(--ws-space-8))]',
  },
  lg: {
    decrement:
      'ps-[calc(var(--ws-control-border-width-rest)+var(--ws-space-14)-var(--ws-control-gap-lg))]',
    increment:
      'pe-[calc(var(--ws-control-border-width-rest)+var(--ws-space-14)-var(--ws-control-gap-lg))]',
    button:
      '[&>button]:w-[calc(var(--ws-control-icon-size-lg)+var(--ws-control-gap-lg)+var(--ws-control-gap-lg))] [&>button]:h-[calc(var(--ws-control-height-lg)-var(--ws-space-8))]',
  },
  xl: {
    decrement:
      'ps-[calc(var(--ws-control-border-width-rest)+var(--ws-space-16)-var(--ws-control-gap-xl))]',
    increment:
      'pe-[calc(var(--ws-control-border-width-rest)+var(--ws-space-16)-var(--ws-control-gap-xl))]',
    button:
      '[&>button]:w-[calc(var(--ws-control-icon-size-xl)+var(--ws-control-gap-xl)+var(--ws-control-gap-xl))] [&>button]:h-[calc(var(--ws-control-height-xl)-var(--ws-space-8))]',
  },
}

export default {
  slots: {
    base: `${input.slots.base} tabular-nums`,
    increment: stepButton,
    decrement: stepButton,
  },
  variants: {
    // Nuxt UI's sizes are the field's classes alone, as a string: an object there would be lost
    // in the merge with its theme, so the step buttons take theirs in the compound variants.
    size: {
      xs: fieldSizes.xs.base,
      sm: fieldSizes.sm.base,
      md: fieldSizes.md.base,
      lg: fieldSizes.lg.base,
      xl: fieldSizes.xl.base,
    },
    variant: fieldVariants,
    // the icon says a button is disabled by its color, not by fading
    disabled: {
      true: { increment: 'opacity-100', decrement: 'opacity-100' },
    },
  },
  compoundVariants: [
    ...fieldStateVariants,
    // The value starts past each step button as an input's does past an icon.
    ...fieldSizeNames.map((size) => ({ decrement: true, size, class: iconRoomStart[size] })),
    ...fieldSizeNames.map((size) => ({ increment: true, size, class: iconRoomEnd[size] })),
    // The buttons on either side of a row. A column of two at the end stays Nuxt UI's.
    ...fieldSizeNames.map((size) => ({
      orientation: 'horizontal',
      size,
      class: {
        decrement: `${stepPlace[size].decrement} ${stepPlace[size].button}`,
        increment: `${stepPlace[size].increment} ${stepPlace[size].button}`,
      },
    })),
  ],
}
