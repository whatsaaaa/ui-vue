/*
 * A card is a panel of the system: the surface, a border and the large radius, its parts apart
 * by a divider. Its title is a minor heading in mono. The padding is the sample apps' group's,
 * and narrower below the one breakpoint.
 */
export default {
  slots: {
    header: 'px-4 py-3 sm:px-4 lg:px-5 lg:py-4',
    title: 'font-mono font-bold text-h4 text-text',
    description: 'font-sans text-body-sm text-text-secondary',
    body: 'p-4 sm:p-4 lg:p-5',
    footer: 'px-4 py-3 sm:px-4 lg:px-5 lg:py-4',
  },
  variants: {
    variant: {
      solid: {
        root: 'bg-text text-bg',
        title: 'text-bg',
        description: 'text-bg',
      },
      outline: {
        root: 'bg-surface ring ring-border divide-y divide-border',
      },
      soft: {
        root: 'bg-raised divide-y divide-border',
      },
      subtle: {
        root: 'bg-raised ring ring-border divide-y divide-border',
      },
    },
  },
}
