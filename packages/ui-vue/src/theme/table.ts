/*
 * The table of the system's prose: in a border with the large radius, scrolling inside it.
 * The head is on the surface, as an overline, and the rows on the page color, so the head stands
 * out on a panel too; a cell is small body text, the rows apart by a divider. A row that can be
 * chosen is half raised under the pointer, and a selected row is raised, under the pointer too.
 */
export default {
  slots: {
    root: 'rounded-lg border border-border bg-bg outline-interactive focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-3',
    tbody:
      'divide-border [&>tr]:data-[selectable=true]:not-data-[selected=true]:hover:bg-raised/50 [&>tr]:data-[selectable=true]:outline-interactive [&>tr]:data-[selectable=true]:focus-visible:outline-2 [&>tr]:data-[selectable=true]:-outline-offset-2',
    tr: 'data-[selected=true]:bg-raised',
    th: 'px-4 py-2.5 bg-surface align-top font-mono font-bold text-overline uppercase text-text-secondary whitespace-nowrap',
    td: 'px-4 py-2.5 align-top font-sans text-body-sm text-text',
    separator: 'bg-border',
    empty: 'font-sans text-body-sm text-text-secondary',
  },
  variants: {
    pinned: {
      true: { th: 'sticky bg-surface z-1', td: 'sticky bg-bg z-1' },
    },
    sticky: {
      true: {
        thead: 'sticky top-0 inset-x-0 bg-surface backdrop-blur-none z-1',
        tfoot: 'sticky bottom-0 inset-x-0 bg-bg backdrop-blur-none z-1',
      },
      header: { thead: 'sticky top-0 inset-x-0 bg-surface backdrop-blur-none z-1' },
      footer: { tfoot: 'sticky bottom-0 inset-x-0 bg-bg backdrop-blur-none z-1' },
    },
  },
  compoundVariants: [
    { loading: true, loadingColor: 'primary', class: { thead: 'after:bg-interactive' } },
    { loading: true, loadingColor: 'neutral', class: { thead: 'after:bg-text' } },
  ],
}
