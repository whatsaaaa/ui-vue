/*
 * The design system's modal spec, specs/modal.spec.json. A modal is a window of the terminal
 * frame, a panel of the overlay, --ws-overlay-*: the surface in the field border's edge, which
 * reads at 3:1, with the window's radius and no shadow. Its header is a bar as tall as the tab
 * bar, on the page color, with the title as a minor heading and the close button at its end. The
 * page behind it is dimmed in its own color. The edge is a border, so forced colors keep it.
 *
 * The window's padding is the overlay's from 64rem up; below it, as the frame's paddings narrow
 * there too, it is --ws-space-16.
 */

const fadeIn =
  'data-[state=open]:animate-[fade-in_var(--ws-motion-duration-base)_var(--ws-motion-easing-out)]'
const fadeOut =
  'data-[state=closed]:animate-[fade-out_var(--ws-motion-duration-base)_var(--ws-motion-easing-in)]'

export default {
  slots: {
    content: 'bg-(--ws-overlay-bg) divide-y-thin divide-border',
    header:
      'items-start gap-3 min-h-(--ws-size-tab-bar) px-(--ws-space-16) py-0 sm:px-(--ws-space-16) lg:px-(--ws-overlay-window-padding) bg-bg',
    wrapper: 'flex-1 min-w-0 py-3',
    body: 'p-(--ws-space-16) sm:p-(--ws-space-16) lg:p-(--ws-overlay-window-padding)',
    footer:
      'flex-wrap justify-end gap-(--ws-space-12) px-(--ws-space-16) py-(--ws-space-12) sm:px-(--ws-space-16) lg:px-(--ws-overlay-window-padding)',
    title: 'font-mono font-(--ws-text-h4-font-weight) text-h4 text-text',
    description: 'font-sans text-body-sm text-text-secondary',
    // A square of the small control, in the header's flow, not over it, and smaller than the
    // bar, so its focus ring has room inside the window. Its box reaches into the header's
    // padding, so its icon ends where the content does.
    close: 'static shrink-0 size-(--ws-control-height-sm) mt-2 -me-2',
  },
  variants: {
    transition: {
      true: {
        overlay: `${fadeIn} ${fadeOut}`,
        // the window grows into place, and only fades for a reader who asks for less motion
        content: `${fadeIn} ${fadeOut} motion-safe:data-[state=open]:animate-[scale-in_var(--ws-motion-duration-base)_var(--ws-motion-easing-out)] motion-safe:data-[state=closed]:animate-[scale-out_var(--ws-motion-duration-base)_var(--ws-motion-easing-in)]`,
      },
    },
    fullscreen: {
      false: {
        content:
          'w-[calc(100vw-2rem)] max-w-[32rem] rounded-(--ws-overlay-window-radius) border-(length:--ws-overlay-border-width) border-(--ws-overlay-border) ring-0 [box-shadow:none] overflow-hidden',
      },
    },
    overlay: {
      true: { overlay: 'bg-[color-mix(in_srgb,var(--ws-color-bg)_80%,transparent)]' },
    },
  },
}
