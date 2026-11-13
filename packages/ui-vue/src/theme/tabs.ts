import { type ByColor, byColor, transition } from './shared.ts'

/*
 * Tabs read like the tabs of the frame: mono labels, the idle ones in the secondary text color.
 * A pill is a bar on the page color whose current tab is raised, the current item of the system.
 * A link is a row over a divider whose current tab is marked in the brand color, as the frame
 * marks its current tab. The focus ring is drawn inside the tab, as the frame draws it.
 *
 * Until the indicator is in the page, as in the HTML from the server, the current tab draws it
 * itself: the classes that start with in-[[data-slot=list]...] do that.
 *
 * A tab keeps its whole label: tabs that do not fit their row scroll inside it, as a table does,
 * and the marker of a link is drawn inside the row, over its divider.
 */

/**
 * The current tab of a pill is raised and outlined: the raised fill alone is too close to the bar
 * to be seen, the outline is in a color that reads on it.
 */
const pill: ByColor = {
  primary:
    'data-[state=active]:text-text in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:bg-raised in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:ring-field-border',
  success:
    'data-[state=active]:text-tip-text in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:bg-tip-tint in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:ring-tip',
  info: 'data-[state=active]:text-note-text in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:bg-note-tint in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:ring-note',
  warning:
    'data-[state=active]:text-warning-text in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:bg-warning-tint in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:ring-warning',
  error:
    'data-[state=active]:text-danger-text in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:bg-danger-tint in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:ring-danger',
  neutral:
    'data-[state=active]:text-text in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:bg-raised in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:ring-field-border',
}

const pillIndicator: ByColor = {
  primary: 'bg-raised ring ring-inset ring-field-border',
  success: 'bg-tip-tint ring ring-inset ring-tip',
  info: 'bg-note-tint ring ring-inset ring-note',
  warning: 'bg-warning-tint ring ring-inset ring-warning',
  error: 'bg-danger-tint ring ring-inset ring-danger',
  neutral: 'bg-raised ring ring-inset ring-field-border',
}

const link: ByColor = {
  primary:
    'data-[state=active]:text-text in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:bg-brand',
  success:
    'data-[state=active]:text-tip-text in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:bg-tip',
  info: 'data-[state=active]:text-note-text in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:bg-note',
  warning:
    'data-[state=active]:text-warning-text in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:bg-warning',
  error:
    'data-[state=active]:text-danger-text in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:bg-danger',
  neutral:
    'data-[state=active]:text-text in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:bg-text',
}

const linkIndicator: ByColor = {
  primary: 'bg-brand',
  success: 'bg-tip',
  info: 'bg-note',
  warning: 'bg-warning',
  error: 'bg-danger',
  neutral: 'bg-text',
}

/** The ring inside the tab. */
const focus =
  'outline-interactive focus-visible:outline-2 focus-visible:outline-solid focus-visible:-outline-offset-2'

export default {
  slots: {
    root: 'gap-4',
    // the indicator moves only for a reader who has not asked for less motion, as Nuxt UI has it
    indicator:
      'transition-[translate,width,height] duration-(--ws-motion-duration-base) ease-standard',
    trigger: `font-mono font-normal cursor-pointer data-[state=inactive]:text-text-secondary hover:data-[state=inactive]:not-disabled:text-text disabled:opacity-100 data-[state=inactive]:disabled:text-text-faint ${transition} ${focus}`,
    content:
      'outline-interactive focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-3',
  },
  variants: {
    variant: {
      pill: {
        list: 'bg-bg ring ring-inset ring-border rounded-md p-1',
        trigger:
          "grow shrink-0 rounded-sm in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:content-[''] in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:absolute in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:inset-0 in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:rounded-sm in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:ring in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:ring-inset in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:-z-10 isolate",
        indicator: 'rounded-sm',
      },
      link: {
        list: 'p-0 border-border',
        indicator: 'rounded-none',
        trigger:
          "shrink-0 rounded-none in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:content-[''] in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:absolute",
      },
    },
    size: {
      xs: { trigger: 'h-6 px-2 gap-1.5 text-label-sm', leadingIcon: 'size-3.5' },
      sm: { trigger: 'h-7 px-2.5 gap-1.5 text-label-sm', leadingIcon: 'size-4' },
      md: { trigger: 'h-8 px-3.5 gap-2 text-label', leadingIcon: 'size-4' },
      lg: { trigger: 'h-9 px-4 gap-2 text-label', leadingIcon: 'size-4' },
      xl: { trigger: 'h-10 px-4 gap-2.5 text-label', leadingIcon: 'size-4.5' },
    },
  },
  compoundVariants: [
    // A row of tabs that does not fit scrolls inside itself. A column keeps its width.
    { orientation: 'horizontal', class: { list: 'overflow-x-auto' } },
    ...byColor(pill, { variant: 'pill' }, 'trigger'),
    ...byColor(pillIndicator, { variant: 'pill' }, 'indicator'),
    ...byColor(link, { variant: 'link' }, 'trigger'),
    ...byColor(linkIndicator, { variant: 'link' }, 'indicator'),
    // A link's tabs are as tall as a field, and its marker is two pixels, just over the divider.
    { variant: 'link', size: 'xs', class: { trigger: 'h-7' } },
    { variant: 'link', size: 'sm', class: { trigger: 'h-8' } },
    { variant: 'link', size: 'md', class: { trigger: 'h-10' } },
    { variant: 'link', size: 'lg', class: { trigger: 'h-11' } },
    { variant: 'link', size: 'xl', class: { trigger: 'h-12' } },
    {
      orientation: 'horizontal',
      variant: 'link',
      class: {
        indicator: 'bottom-0 h-0.5',
        trigger:
          'in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:bottom-0 in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:h-0.5',
      },
    },
    {
      orientation: 'vertical',
      variant: 'link',
      class: {
        indicator: 'start-0 w-0.5',
        trigger:
          'justify-start in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:start-0 in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:w-0.5',
      },
    },
    // Nuxt UI tints the focus outline of a tab and of its panel with the color: the ring is the
    // system's.
    { class: { trigger: focus, content: 'outline-interactive' } },
  ],
}
