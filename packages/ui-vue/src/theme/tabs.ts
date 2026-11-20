import { type ByColor, byColor, forcedEdge, forcedIcon, transition } from './shared.ts'

/*
 * Tabs read like the tabs of the frame, as the design system's tabs spec, specs/tabs.spec.json,
 * draws them: a row of mono labels over a line, the idle ones in the secondary text color, whose
 * current tab is marked in the brand color, as the frame marks its current tab. That is the link,
 * and tabs are links unless they ask for a pill: a bar on the page color whose current tab is
 * raised, which the spec leaves to the system's segmented control. The focus ring is drawn inside
 * the tab, as the frame draws it. A tab is as tall as a control, and reads the control tier by
 * name, --ws-control-*, so a change of the tier reaches it; a pill's tab is shorter, inside its
 * bar.
 *
 * Until the indicator is in the page, as in the HTML from the server, the current tab draws it
 * itself: the classes that start with in-[[data-slot=list]...] do that.
 *
 * A tab keeps its whole label: tabs that do not fit their row scroll inside it, as a table does,
 * and the marker of a link is drawn inside the row, over its line.
 *
 * In forced colors the current tab is marked in the selection color: a pill's outlined, a link's
 * underlined, and the bar of the pills is outlined. The pill's mark is a ring, which the
 * stylesheet outlines in the text color there: the outline takes the selection color too.
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
    leadingIcon: forcedIcon,
    trigger: `font-mono font-normal cursor-pointer data-[state=inactive]:text-text-secondary hover:data-[state=inactive]:not-disabled:text-text disabled:opacity-100 data-[state=inactive]:disabled:text-text-faint ${transition} ${focus}`,
    content:
      'outline-interactive focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-3',
  },
  variants: {
    variant: {
      pill: {
        list: `bg-bg ring ring-inset ring-border rounded-md p-1 ${forcedEdge}`,
        trigger:
          "grow shrink-0 rounded-sm in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:content-[''] in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:absolute in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:inset-0 in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:rounded-sm in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:ring in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:ring-inset in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:-z-10 forced-colors:in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:border-2 forced-colors:in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:border-[Highlight] forced-colors:in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:outline-[Highlight] isolate",
        indicator:
          'rounded-sm forced-colors:border-2 forced-colors:border-[Highlight] forced-colors:outline-[Highlight]',
      },
      link: {
        list: 'p-0 border-border',
        indicator: 'rounded-none forced-colors:bg-[Highlight]',
        trigger:
          "shrink-0 rounded-none in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:content-[''] in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:absolute forced-colors:in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:bg-[Highlight]",
      },
    },
    size: {
      xs: {
        trigger:
          'h-(--ws-control-height-xs) px-(--ws-space-8) gap-(--ws-control-gap-xs) text-label-sm',
        leadingIcon: 'size-(--ws-control-icon-size-xs)',
      },
      sm: {
        trigger:
          'h-(--ws-control-height-sm) px-(--ws-space-10) gap-(--ws-control-gap-sm) text-label-sm',
        leadingIcon: 'size-(--ws-control-icon-size-sm)',
      },
      md: {
        trigger:
          'h-(--ws-control-height-md) px-(--ws-space-14) gap-(--ws-control-gap-md) text-label',
        leadingIcon: 'size-(--ws-control-icon-size-md)',
      },
      lg: {
        trigger:
          'h-(--ws-control-height-lg) px-(--ws-space-16) gap-(--ws-control-gap-lg) text-label',
        leadingIcon: 'size-(--ws-control-icon-size-lg)',
      },
      xl: {
        trigger:
          'h-(--ws-control-height-xl) px-(--ws-space-16) gap-(--ws-control-gap-xl) text-label',
        leadingIcon: 'size-(--ws-control-icon-size-xl)',
      },
    },
  },
  compoundVariants: [
    // A row of tabs that does not fit scrolls inside itself. A column keeps its width.
    { orientation: 'horizontal', class: { list: 'overflow-x-auto' } },
    ...byColor(pill, { variant: 'pill' }, 'trigger'),
    ...byColor(pillIndicator, { variant: 'pill' }, 'indicator'),
    ...byColor(link, { variant: 'link' }, 'trigger'),
    ...byColor(linkIndicator, { variant: 'link' }, 'indicator'),
    // A pill's tab is inside its bar, which has a padding of 4 pixels.
    { variant: 'pill', size: 'xs', class: { trigger: 'h-6' } },
    { variant: 'pill', size: 'sm', class: { trigger: 'h-7' } },
    { variant: 'pill', size: 'md', class: { trigger: 'h-8' } },
    { variant: 'pill', size: 'lg', class: { trigger: 'h-9' } },
    { variant: 'pill', size: 'xl', class: { trigger: 'h-10' } },
    // A link's marker is a medium border wide, just over the line.
    {
      orientation: 'horizontal',
      variant: 'link',
      class: {
        list: 'border-b-thin',
        indicator: 'bottom-0 h-(--ws-border-width-medium)',
        trigger:
          'in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:bottom-0 in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:h-(--ws-border-width-medium)',
      },
    },
    {
      orientation: 'vertical',
      variant: 'link',
      class: {
        list: 'border-s-thin',
        indicator: 'start-0 w-(--ws-border-width-medium)',
        trigger:
          'justify-start in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:start-0 in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:w-(--ws-border-width-medium)',
      },
    },
    // Nuxt UI tints the focus outline of a tab and of its panel with the color: the ring is the
    // system's.
    { class: { trigger: focus, content: 'outline-interactive' } },
  ],
  defaultVariants: {
    variant: 'link',
  },
}
