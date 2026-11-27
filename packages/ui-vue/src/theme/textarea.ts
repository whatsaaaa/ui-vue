import { fieldSizes } from './field.ts'
import input from './input.ts'

/*
 * The design system's text area spec, specs/textarea.spec.json: the input's field, with rows of
 * text in place of its one line and no height of its own, so it is as tall as its rows. Its value
 * is the field's text style at each size, line height and all. The padding above and below the
 * text is half of what the control's height leaves around a line, less the edge, so its first
 * line sits where an input's value does and a text area of one row is as tall as the input of
 * its size. An edge wider than the rest edge, an error's, takes what it adds off the padding on
 * every side, so the text keeps its place.
 *
 * Nuxt UI builds its text area on the input's theme, and so does this one: the edge, the value,
 * the states and the variants are the input's. The spec draws no icons, as several lines have no
 * one line for an icon to sit on: one an app passes anyway sits where the input's does.
 */

/** The heights of the rows, with the padding around them; the icons' places are the input's. */
const size = {
  xs: {
    ...fieldSizes.xs,
    base: 'px-[calc(var(--ws-space-8)-var(--field-edge-extra,0px))] py-[calc(var(--ws-space-2)-var(--ws-control-border-width-rest)-var(--field-edge-extra,0px))] gap-(--ws-control-gap-xs) text-body-sm',
  },
  sm: {
    ...fieldSizes.sm,
    base: 'px-[calc(var(--ws-space-10)-var(--field-edge-extra,0px))] py-[calc(var(--ws-space-4)-var(--ws-control-border-width-rest)-var(--field-edge-extra,0px))] gap-(--ws-control-gap-sm) text-body-sm',
  },
  md: {
    ...fieldSizes.md,
    base: 'px-[calc(var(--ws-space-12)-var(--field-edge-extra,0px))] py-[calc(var(--ws-space-6)-var(--ws-control-border-width-rest)-var(--field-edge-extra,0px))] gap-(--ws-control-gap-md) text-body',
  },
  lg: {
    ...fieldSizes.lg,
    base: 'px-[calc(var(--ws-space-14)-var(--field-edge-extra,0px))] py-[calc(var(--ws-space-8)-var(--ws-control-border-width-rest)-var(--field-edge-extra,0px))] gap-(--ws-control-gap-lg) text-body',
  },
  xl: {
    ...fieldSizes.xl,
    base: 'px-[calc(var(--ws-space-16)-var(--field-edge-extra,0px))] py-[calc(var(--ws-space-10)-var(--ws-control-border-width-rest)-var(--field-edge-extra,0px))] gap-(--ws-control-gap-xl) text-body',
  },
}

export default {
  slots: input.slots,
  variants: { ...input.variants, size },
  compoundVariants: input.compoundVariants,
}
