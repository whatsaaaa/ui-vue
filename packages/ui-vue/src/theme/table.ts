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
 * darker in the light theme, and is ringed inside while its checkbox has the focus, not while
 * another control in the row has it. A row Nuxt UI makes a stop of its own, with a handler for
 * the row, is raised and ringed too: those classes have Nuxt UI's variants exactly, so they
 * replace Nuxt UI's own.
 */

/** A row that can be chosen, by the checkbox in its first cell or by Nuxt UI's handler. */
const hover =
  '[&>tr]:has-[>td:first-child_[role=checkbox]]:hover:bg-(--ws-table-row-bg-hover) [&>tr]:data-[selectable=true]:hover:bg-(--ws-table-row-bg-hover)'

/**
 * The ring inside a row, while the checkbox in its first cell has the focus or the row itself
 * does. The row with its checkbox has the focus in it, but not in another cell: written so, the
 * focus a gallery draws on the checkbox with the focus-visible variant rings the row too.
 *
 * A ringed row also says how wide its ring is, in --table-row-ring, and how far inside the row
 * a cell that lies over the ring has to start for the ring to show, in --table-row-ring-clip: a
 * pinned cell reads both. The clip is a thin border wider than the ring: a cell starts inside
 * its row by a part of the line between the rows, which the browser rounds to a pixel or to none,
 * and what the clip bares past the ring is the row's fill. In a row without a ring the ring is
 * nothing and the clip far outside the cell.
 *
 * In forced colors the ring of a chosen row is HighlightText, the row's text color there, on its
 * Highlight. Left to the browser, the outline of a row that has the focus itself would be in the
 * browser's color for what has the focus, Highlight on Highlight.
 */
const focus =
  '[&>tr]:outline-interactive [&>tr]:-outline-offset-(--ws-border-width-medium) [&>tr]:[--table-row-ring:0px] [&>tr]:[--table-row-ring-clip:-100vmax] [&>tr]:has-[>td:first-child_[role=checkbox]]:has-focus-visible:not-has-[>td:not(:first-child)_:focus-visible]:outline-2 [&>tr]:has-[>td:first-child_[role=checkbox]]:has-focus-visible:not-has-[>td:not(:first-child)_:focus-visible]:outline-solid [&>tr]:has-[>td:first-child_[role=checkbox]]:has-focus-visible:not-has-[>td:not(:first-child)_:focus-visible]:[--table-row-ring:var(--ws-border-width-medium)] [&>tr]:has-[>td:first-child_[role=checkbox]]:has-focus-visible:not-has-[>td:not(:first-child)_:focus-visible]:[--table-row-ring-clip:calc(var(--ws-border-width-medium)_+_var(--ws-border-width-thin))] [&>tr]:data-[selectable=true]:outline-interactive [&>tr]:data-[selectable=true]:-outline-offset-(--ws-border-width-medium) [&>tr]:data-[selectable=true]:focus-visible:outline-2 [&>tr]:data-[selectable=true]:focus-visible:outline-solid [&>tr]:data-[selectable=true]:focus-visible:[--table-row-ring:var(--ws-border-width-medium)] [&>tr]:data-[selectable=true]:focus-visible:[--table-row-ring-clip:calc(var(--ws-border-width-medium)_+_var(--ws-border-width-thin))] forced-colors:[&>tr]:data-[selected=true]:outline-[HighlightText]'

/**
 * A cell's measures. Nuxt UI takes the end padding off a cell with a checkbox, the spec does not;
 * the first cell of a row that can be chosen is only as wide as its checkbox, where a table wider
 * than its columns would widen it as it widens the others.
 */
const cell =
  'px-(--ws-table-cell-padding-inline) py-(--ws-table-cell-padding-block) [&:has([role=checkbox])]:pe-(--ws-table-cell-padding-inline) first:[&:has([role=checkbox])]:w-px'

/**
 * A cell of a chosen row in forced colors, in HighlightText. Forced colors put a plate of the
 * page color behind each line of text, which would hide it, as HighlightText is near the page
 * color: the cell keeps its colors as they are, and so does the text in it. The parts of Nuxt
 * UI's components in it draw colors of their own, such as a badge's or a button's, and keep the
 * forced colors as they do everywhere, unless a part keeps its own, as a checked box does. An
 * icon of the cell itself, outside any such part, is in HighlightText as the text is, where the
 * stylesheet paints every icon in the text color of the page.
 */
const chosenCell =
  'forced-colors:in-data-[selected=true]:text-[HighlightText] forced-colors:in-data-[selected=true]:forced-color-adjust-none forced-colors:in-data-[selected=true]:[:where(&_[data-slot])]:forced-color-adjust-auto forced-colors:in-data-[selected=true]:[:where(&_.iconify:not(svg,:is(&_[data-slot]_*)))]:bg-[HighlightText]'

/**
 * The ring of a row over a pinned cell. The cell's fill, which hides what scrolls under it, lies
 * over the row's outline too. So in a ringed row the cell gives way to the outline's lines above
 * and below it: it is clipped there by its row's --table-row-ring-clip, which in every other row
 * is far outside the cell and clips nothing. The first or the last cell of the row keeps its
 * whole height where the ring ends, as wide as --table-row-ring, and draws the end itself: the
 * row's own may have scrolled away under it. A pinned cell between them draws none: Tailwind's
 * after: gives a content to whatever it styles, so those cells are told to have none. The end is
 * a border, which forced colors keep, in the color the outline has there: the text color, or
 * Highlight on a row that has the focus itself and is not chosen, the color the browser gives
 * the outline of what has the focus.
 */
const pinnedRing =
  "[clip-path:inset(var(--table-row-ring-clip)_-100vmax)] first:[clip-path:polygon(-100vmax_-100vmax,var(--table-row-ring)_-100vmax,var(--table-row-ring)_var(--table-row-ring-clip),calc(100%_+_100vmax)_var(--table-row-ring-clip),calc(100%_+_100vmax)_calc(100%_-_var(--table-row-ring-clip)),var(--table-row-ring)_calc(100%_-_var(--table-row-ring-clip)),var(--table-row-ring)_calc(100%_+_100vmax),-100vmax_calc(100%_+_100vmax))] last:[clip-path:polygon(-100vmax_var(--table-row-ring-clip),calc(100%_-_var(--table-row-ring))_var(--table-row-ring-clip),calc(100%_-_var(--table-row-ring))_-100vmax,calc(100%_+_100vmax)_-100vmax,calc(100%_+_100vmax)_calc(100%_+_100vmax),calc(100%_-_var(--table-row-ring))_calc(100%_+_100vmax),calc(100%_-_var(--table-row-ring))_calc(100%_-_var(--table-row-ring-clip)),-100vmax_calc(100%_-_var(--table-row-ring-clip)))] after:content-none first:after:content-[''] last:after:content-[''] after:absolute after:inset-y-0 first:after:left-0 last:after:right-0 after:pointer-events-none after:border-s-[length:var(--table-row-ring,0px)] after:border-interactive forced-colors:after:border-current forced-colors:[tr[data-selectable=true]:focus-visible:not([data-selected=true])>&]:after:border-[Highlight]"

/**
 * A pinned cell hides what scrolls under it: on the page color, or its row's fill, raised under
 * the pointer where the row is, or chosen.
 */
const pinnedCell = `sticky bg-bg z-1 ${pinnedRing} [@media(hover:hover)]:[tr:has(>td:first-child_[role=checkbox]):hover>&]:bg-(--ws-table-row-bg-hover) [@media(hover:hover)]:[tr[data-selectable=true]:hover>&]:bg-(--ws-table-row-bg-hover) in-data-[selected=true]:bg-(--ws-table-row-bg-selected)! forced-colors:in-data-[selected=true]:bg-[Highlight]!`

export default {
  slots: {
    root: `rounded-lg border-thin border-border bg-bg ${focusRing}`,
    tbody: `divide-y-thin divide-border ${hover} ${focus}`,
    // A chosen row keeps its fill under the pointer. In forced colors it is in the selection
    // colors, the system's own, which forced colors keep: Highlight under HighlightText, the
    // color its line takes there, as every other color of the row is forced, and the color its
    // ring is given, with the ring's other rules.
    tr: 'data-[selected=true]:bg-(--ws-table-row-bg-selected)! data-[selected=true]:border-b-selection-border forced-colors:data-[selected=true]:bg-[Highlight]! forced-colors:data-[selected=true]:text-[HighlightText]',
    th: `${cell} align-middle bg-(--ws-table-head-bg-rest) font-mono font-bold text-overline uppercase text-(--ws-table-head-text-rest) whitespace-nowrap in-[thead]:border-b-thin in-[thead]:border-border in-[tfoot]:border-t-thin in-[tfoot]:border-border`,
    td: `${cell} align-top font-sans text-body-sm text-(--ws-table-row-text-rest) ${chosenCell}`,
    separator: 'hidden',
    empty: 'font-sans text-body-sm text-text-secondary',
  },
  variants: {
    pinned: {
      true: { th: 'sticky bg-(--ws-table-head-bg-rest) z-1', td: pinnedCell },
    },
    sticky: {
      true: {
        thead: 'sticky top-0 inset-x-0 bg-(--ws-table-head-bg-rest) backdrop-blur-none z-1',
        tfoot: 'sticky bottom-0 inset-x-0 bg-bg backdrop-blur-none z-1',
      },
      header: {
        thead: 'sticky top-0 inset-x-0 bg-(--ws-table-head-bg-rest) backdrop-blur-none z-1',
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
