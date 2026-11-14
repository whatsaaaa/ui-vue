/*
 * A modal is a window of the terminal frame: the surface in a border with the window's radius,
 * no shadow. Its header is a bar as tall as the tab bar, on the page color, with the title as a
 * minor heading and the close button at its end. The page behind it is dimmed in its own color.
 */

const fadeIn =
  'data-[state=open]:animate-[fade-in_var(--ws-motion-duration-base)_var(--ws-motion-easing-out)]'
const fadeOut =
  'data-[state=closed]:animate-[fade-out_var(--ws-motion-duration-base)_var(--ws-motion-easing-in)]'

export default {
  slots: {
    content: 'bg-surface divide-border',
    header: 'items-start gap-3 px-4 py-0 sm:px-4 lg:px-5 bg-bg',
    wrapper: 'flex-1 min-w-0 py-3',
    body: 'p-4 sm:p-4 lg:p-5',
    footer: 'flex-wrap justify-end gap-3 px-4 py-3 sm:px-4 lg:px-5',
    title: 'font-mono font-bold text-h4 text-text',
    description: 'font-sans text-body-sm text-text-secondary',
    // In the header's flow, not over it, and smaller than the bar, so its focus ring has room
    // inside the window. Its box reaches into the header's padding, so its icon ends where the
    // content does.
    close: 'static shrink-0 size-8 mt-2 -me-2',
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
        content: 'w-[calc(100vw-2rem)] max-w-lg rounded-xl ring ring-border overflow-hidden',
      },
    },
    overlay: {
      true: { overlay: 'bg-bg/80' },
    },
  },
}
