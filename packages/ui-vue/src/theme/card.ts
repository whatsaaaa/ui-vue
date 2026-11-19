import { forcedEdge } from './shared.ts'

/*
 * The card of the design system's spec, specs/card.spec.json: a panel of the system, the surface
 * in an edge of the border color with the large radius, its parts apart by a line of the same
 * color. Its title is a minor heading in mono. The spec's one kind is Nuxt UI's outline; the
 * other variants keep working on the roles, outside the spec.
 *
 * The edge is a border, not Nuxt UI's ring, so that forced colors keep it, the subtle card's too.
 * The lines between the parts are a divider, which draws one under every part but the last, so
 * the body's line takes its color whether a footer follows it or not.
 *
 * The padding is the spec's from 64rem up; below it, as the frame's paddings narrow there too, it
 * is --ws-space-16, and --ws-space-12 for the header's and the footer's padding-block. It is
 * restated at sm: to cancel Nuxt UI's wider one there.
 */
export default {
  slots: {
    // in forced colors every card is outlined
    root: forcedEdge,
    header:
      'px-(--ws-space-16) py-(--ws-space-12) sm:px-(--ws-space-16) lg:px-(--ws-space-20) lg:py-(--ws-space-16)',
    title: 'font-mono font-(--ws-text-h4-font-weight) text-h4 text-text',
    description: 'font-sans text-body-sm text-text-secondary',
    body: 'border-border p-(--ws-space-16) sm:p-(--ws-space-16) lg:p-(--ws-space-20)',
    footer:
      'px-(--ws-space-16) py-(--ws-space-12) sm:px-(--ws-space-16) lg:px-(--ws-space-20) lg:py-(--ws-space-16)',
  },
  variants: {
    variant: {
      solid: {
        root: 'bg-text text-bg',
        title: 'text-bg',
        description: 'text-bg',
      },
      outline: {
        root: 'bg-surface text-text border-(length:--ws-border-width-thin) border-border ring-0 [box-shadow:none] rounded-lg divide-y-thin divide-border',
      },
      soft: {
        root: 'bg-raised divide-y-thin divide-border',
      },
      subtle: {
        root: 'bg-raised border-(length:--ws-border-width-thin) border-border ring-0 [box-shadow:none] divide-y-thin divide-border',
      },
    },
  },
}
