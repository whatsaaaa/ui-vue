import { focusRing } from './shared.ts'

/*
 * The table of the design system's table spec, specs/table.spec.json: the table of the system's
 * prose, in a border with the large radius, scrolling inside it. The head is on the surface, as
 * an overline, and the rows on the page color, so the head stands out on a panel too; a cell is
 * small body text, the rows apart by a line. It reads the table tier by name, --ws-table-*, so a
 * change of the tier reaches it.
 *
 * The lines are borders, which forced colors keep: the head's is the border of its cells, where
 * Nuxt UI draws a row of its own filled with the border color, and the foot's the same.
 *
 * Rows are chosen by a checkbox in each row's first cell, as the spec has it: a row with one is
 * raised under the pointer, takes the selection color once chosen, the line under it a step
 * darker in the light theme, and is ringed inside while its checkbox has the focus. A row
 * Nuxt UI makes a stop of its own, with a handler for the row, is raised and ringed too.
 */

/** A row that can be chosen, by the checkbox in its first cell or by Nuxt UI's handler. */
const hover =
  '[&>tr]:has-[>td:first-child_[role=checkbox]]:not-data-[selected=true]:hover:bg-(--ws-table-row-bg-hover) [&>tr]:data-[selectable=true]:not-data-[selected=true]:hover:bg-(--ws-table-row-bg-hover)'

/** The ring inside a row, while its checkbox or the row itself has the focus. */
const focus =
  '[&>tr]:outline-interactive [&>tr]:has-[>td:first-child_[role=checkbox]]:has-focus-visible:outline-2 [&>tr]:has-[>td:first-child_[role=checkbox]]:has-focus-visible:outline-solid [&>tr]:data-[selectable=true]:focus-visible:outline-2 [&>tr]:data-[selectable=true]:focus-visible:outline-solid [&>tr]:-outline-offset-(--ws-border-width-medium)'

/**
 * A cell's measures. Nuxt UI takes the end padding off a cell with a checkbox, the spec does not;
 * the first cell of a row that can be chosen is only as wide as its checkbox, where a table wider
 * than its columns would widen it as it widens the others.
 */
const cell =
  'px-(--ws-table-cell-padding-inline) py-(--ws-table-cell-padding-block) [&:has([role=checkbox])]:pe-(--ws-table-cell-padding-inline) first:[&:has([role=checkbox])]:w-px'

export default {
  slots: {
    root: `rounded-lg border-thin border-border bg-bg ${focusRing}`,
    tbody: `divide-y-thin divide-border ${hover} ${focus}`,
    // In forced colors a chosen row is in the selection colors, which its cells keep.
    tr: 'data-[selected=true]:bg-(--ws-table-row-bg-selected) data-[selected=true]:border-b-selection-border forced-colors:data-[selected=true]:bg-[Highlight] forced-colors:data-[selected=true]:forced-color-adjust-none',
    th: `${cell} align-middle bg-(--ws-table-head-bg) font-mono font-bold text-overline uppercase text-(--ws-table-head-text) whitespace-nowrap in-[thead]:border-b-thin in-[thead]:border-border in-[tfoot]:border-t-thin in-[tfoot]:border-border`,
    td: `${cell} align-top font-sans text-body-sm text-(--ws-table-row-text) forced-colors:forced-color-adjust-auto forced-colors:in-data-[selected=true]:text-[HighlightText]`,
    separator: 'hidden',
    empty: 'font-sans text-body-sm text-text-secondary',
  },
  variants: {
    pinned: {
      true: { th: 'sticky bg-(--ws-table-head-bg) z-1', td: 'sticky bg-bg z-1' },
    },
    sticky: {
      true: {
        thead: 'sticky top-0 inset-x-0 bg-(--ws-table-head-bg) backdrop-blur-none z-1',
        tfoot: 'sticky bottom-0 inset-x-0 bg-bg backdrop-blur-none z-1',
      },
      header: {
        thead: 'sticky top-0 inset-x-0 bg-(--ws-table-head-bg) backdrop-blur-none z-1',
      },
      footer: { tfoot: 'sticky bottom-0 inset-x-0 bg-bg backdrop-blur-none z-1' },
    },
  },
  compoundVariants: [
    // The loading line is a thin border's height, over the line under the head.
    { loading: true, class: { thead: 'after:bottom-0 after:h-(--ws-border-width-thin)' } },
    { loading: true, loadingColor: 'primary', class: { thead: 'after:bg-interactive' } },
    { loading: true, loadingColor: 'neutral', class: { thead: 'after:bg-text' } },
    // In forced colors the loading bar is in the text color.
    { loading: true, class: { thead: 'forced-colors:after:bg-[CanvasText]' } },
  ],
}
