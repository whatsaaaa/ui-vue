/**
 * How far each component of Nuxt UI follows the design system: every component of the Nuxt UI
 * version the package pins, with its family, the level it is at today and the level it is to
 * reach for ui-vue 1.0.0.
 *
 * - Level 1, inherits: it takes the system's colors, radius and fonts through the stylesheet. It
 *   is on a gallery page in both themes, and the level 1 checks pass on it: no contrast failure
 *   by axe, in forced colors every icon is painted, every part whose edge is a ring keeps an edge
 *   and a control that is on differs from one that is off, and nothing overflows at 390 px.
 * - Level 2, restyled: it has a theme in the package, written on the system's tiers.
 * - Level 3, specced: the design system has a spec for it, and its gallery passes the parity test.
 *
 * The levels are data: the README's table and the gallery's page of the others are drawn
 * from this file, tests/levels.test.ts holds it to the components Nuxt UI has, and
 * tests/browser/level-1.spec.ts to what the pages draw. A level 1 check a component still fails,
 * whose fix belongs to its restyling or to its spec, is listed with it under `fails`: the test
 * fails when a failure appears that is not listed and when a listed one no longer fails, so the
 * list only shrinks.
 */

/** The families: the categories of Nuxt UI's docs, and its internal parts, which have no page. */
export const families = [
  'element',
  'form',
  'data',
  'navigation',
  'overlay',
  'layout',
  'page',
  'dashboard',
  'chat',
  'editor',
  'content',
  'color-mode',
  'locale',
  'prose',
  'internal',
] as const

export type Family = (typeof families)[number]

export type Level = 1 | 2 | 3

export type Theme = 'dark' | 'light'

/**
 * A level 1 check: contrast is axe's color-contrast rule, forced-icon, forced-edge and
 * forced-state are the three of forced colors, overflow is the width of a phone.
 */
export type Check = 'contrast' | 'forced-icon' | 'forced-edge' | 'forced-state' | 'overflow'

/** A level 1 check a component is known to fail. */
export interface KnownFailure {
  check: Check
  /** The theme it fails in. Without one, it fails in both. */
  theme?: Theme
  /**
   * The parts that fail: each by its data-slot, or by its element where it has none. A control
   * whose state is lost is named by its role, a pressed button as pressed.
   */
  slots: readonly string[]
  /** What fails, and what fixes it. */
  note: string
}

/**
 * A component the gallery does not show: one that draws nothing of its own, or an internal part,
 * which cannot stand alone and is drawn by the component it belongs to.
 */
export interface Unshown {
  unshown: 'nothing' | 'part'
  note: string
}

export interface ComponentLevels {
  family: Family
  /** The level it is at today. */
  today: Level
  /** The level it is to reach for ui-vue 1.0.0. */
  target: Level
  /**
   * Where the gallery shows it: in a section of the gallery, held to its spec, or on the page of
   * the others, playgrounds/nuxt/app/pages/others.vue. Or why it does not.
   */
  shown: 'gallery' | 'others' | Unshown
  /**
   * The components it is made of, where it draws little itself: it is as good as its parts, so
   * it follows them as they are restyled.
   */
  parts?: readonly string[]
  /** The level 1 checks it fails today. */
  fails?: readonly KnownFailure[]
}

export const components = {
  // element
  UAlert: {
    family: 'element',
    today: 1,
    target: 3,
    shown: 'others',
    fails: [
      {
        check: 'contrast',
        theme: 'dark',
        slots: ['description'],
        note: 'The subtle error alert: its description in the danger color on the danger tint, 4.3:1 where text needs 4.5:1',
      },
      {
        check: 'contrast',
        theme: 'light',
        slots: ['title', 'description'],
        note: "The solid warning alert: the page color on the warning color, 2.05:1 and 1.9:1. The status kinds get a tint and an outline with the alert's spec, and no solid",
      },
    ],
  },
  UAvatar: { family: 'element', today: 1, target: 2, shown: 'others' },
  UAvatarGroup: { family: 'element', today: 1, target: 2, shown: 'others' },
  UBadge: { family: 'element', today: 3, target: 3, shown: 'gallery' },
  UBanner: {
    family: 'element',
    today: 1,
    target: 2,
    shown: 'others',
    fails: [
      {
        check: 'contrast',
        slots: ['label'],
        note: "An outline button on the banner: its label is drawn for the page and stands on the banner's fill, 1.29:1 in dark and 1.19:1 in light",
      },
    ],
  },
  UButton: { family: 'element', today: 3, target: 3, shown: 'gallery' },
  UCalendar: { family: 'element', today: 1, target: 2, shown: 'others' },
  UCard: { family: 'element', today: 3, target: 3, shown: 'gallery' },
  UChip: { family: 'element', today: 1, target: 2, shown: 'others' },
  UCollapsible: { family: 'element', today: 1, target: 1, shown: 'others' },
  UFieldGroup: {
    family: 'element',
    today: 1,
    target: 2,
    shown: 'others',
    parts: ['UButton', 'UInput'],
  },
  UIcon: { family: 'element', today: 1, target: 1, shown: 'others' },
  UKbd: { family: 'element', today: 1, target: 3, shown: 'others' },
  UProgress: { family: 'element', today: 1, target: 2, shown: 'others' },
  UProgressGroup: { family: 'element', today: 1, target: 1, shown: 'others' },
  USeparator: { family: 'element', today: 1, target: 2, shown: 'others' },
  USkeleton: { family: 'element', today: 1, target: 2, shown: 'others' },
  UToggle: {
    family: 'element',
    today: 1,
    target: 3,
    shown: 'others',
    parts: ['UButton'],
    fails: [
      {
        check: 'forced-state',
        slots: ['pressed'],
        note: "Pressed is a fill alone, which forced colors take away: a pressed state comes with the toggle group's spec",
      },
    ],
  },
  UToggleGroup: {
    family: 'element',
    today: 1,
    target: 3,
    shown: 'others',
    parts: ['UButton'],
    fails: [
      {
        check: 'forced-state',
        slots: ['pressed'],
        note: 'Pressed is a fill alone, which forced colors take away: a pressed state comes with its spec',
      },
    ],
  },

  // form
  UCheckbox: {
    family: 'form',
    today: 3,
    target: 3,
    shown: 'gallery',
    fails: [
      {
        check: 'contrast',
        theme: 'dark',
        slots: ['description'],
        note: "A checked card: its description in the secondary text color on the tint of a checked card, 3.94:1. The checkbox spec gives both colors, so the fix is the spec's",
      },
    ],
  },
  UCheckboxGroup: { family: 'form', today: 1, target: 3, shown: 'others', parts: ['UCheckbox'] },
  UColorPicker: { family: 'form', today: 1, target: 1, shown: 'others' },
  UFileUpload: { family: 'form', today: 1, target: 2, shown: 'others' },
  UForm: { family: 'form', today: 1, target: 1, shown: 'others' },
  UFormField: { family: 'form', today: 3, target: 3, shown: 'gallery' },
  UInput: { family: 'form', today: 3, target: 3, shown: 'gallery' },
  UInputDate: { family: 'form', today: 1, target: 2, shown: 'others' },
  UInputMenu: { family: 'form', today: 1, target: 2, shown: 'others' },
  UInputNumber: { family: 'form', today: 1, target: 3, shown: 'others' },
  UInputRating: {
    family: 'form',
    today: 1,
    target: 1,
    shown: 'others',
    fails: [
      {
        check: 'forced-state',
        slots: ['radio'],
        note: 'A chosen star is the same icon as one that is not, in another color, which forced colors take away',
      },
    ],
  },
  UInputTags: { family: 'form', today: 1, target: 2, shown: 'others' },
  UInputTime: { family: 'form', today: 1, target: 2, shown: 'others' },
  UListbox: { family: 'form', today: 1, target: 2, shown: 'others' },
  UPinInput: { family: 'form', today: 1, target: 2, shown: 'others' },
  URadioGroup: {
    family: 'form',
    today: 3,
    target: 3,
    shown: 'gallery',
    fails: [
      {
        check: 'contrast',
        theme: 'dark',
        slots: ['description'],
        note: "A checked card: its description in the secondary text color on the tint of a checked card, 3.94:1. The radio group spec gives both colors, so the fix is the spec's",
      },
    ],
  },
  USelect: { family: 'form', today: 3, target: 3, shown: 'gallery' },
  USelectMenu: { family: 'form', today: 3, target: 3, shown: 'gallery' },
  USlider: { family: 'form', today: 1, target: 3, shown: 'others' },
  USwitch: {
    family: 'form',
    today: 1,
    target: 3,
    shown: 'others',
    fails: [
      {
        check: 'forced-state',
        slots: ['switch'],
        note: 'On and off are the same empty outline: the thumb and the fill of the track are fills alone, which forced colors take away. Its spec draws both',
      },
    ],
  },
  UTextarea: { family: 'form', today: 1, target: 3, shown: 'others' },

  // data
  UAccordion: { family: 'data', today: 1, target: 3, shown: 'others' },
  UCarousel: { family: 'data', today: 1, target: 1, shown: 'others' },
  UChart: { family: 'data', today: 1, target: 1, shown: 'others' },
  UEmpty: { family: 'data', today: 1, target: 2, shown: 'others' },
  UMarquee: { family: 'data', today: 1, target: 1, shown: 'others' },
  UScrollArea: { family: 'data', today: 1, target: 1, shown: 'others' },
  UTable: {
    family: 'data',
    today: 3,
    target: 3,
    shown: 'gallery',
    fails: [
      {
        check: 'contrast',
        theme: 'dark',
        slots: ['label'],
        note: "A tag in a chosen row: the tag's text on its tint over the chosen row's fill, 3.9:1. The table spec gives the fill and the badge spec the tag, so the fix is the specs'",
      },
    ],
  },
  UTimeline: { family: 'data', today: 1, target: 2, shown: 'others' },
  UTree: { family: 'data', today: 1, target: 2, shown: 'others' },
  UUser: { family: 'data', today: 1, target: 2, shown: 'others', parts: ['UAvatar', 'UChip'] },

  // navigation
  UBreadcrumb: { family: 'navigation', today: 1, target: 3, shown: 'others' },
  UCommandPalette: {
    family: 'navigation',
    today: 1,
    target: 2,
    shown: 'others',
    parts: ['UInput', 'UButton', 'UAvatar', 'UChip', 'UKbd'],
  },
  UFooterColumns: { family: 'navigation', today: 1, target: 1, shown: 'others' },
  ULink: { family: 'navigation', today: 1, target: 2, shown: 'others' },
  UNavigationMenu: { family: 'navigation', today: 1, target: 2, shown: 'others' },
  UPagination: {
    family: 'navigation',
    today: 1,
    target: 2,
    shown: 'others',
    parts: ['UButton'],
  },
  UStepper: { family: 'navigation', today: 1, target: 3, shown: 'others' },
  UTabs: { family: 'navigation', today: 3, target: 3, shown: 'gallery' },

  // overlay
  UContextMenu: {
    family: 'overlay',
    today: 1,
    target: 2,
    shown: 'others',
    fails: [
      {
        check: 'forced-edge',
        slots: ['content'],
        note: 'Reka writes outline: none on the list itself, which the outline the stylesheet gives a ring does not win over. Its restyling draws the edge as a border',
      },
    ],
  },
  UDrawer: { family: 'overlay', today: 1, target: 2, shown: 'others' },
  UDropdownMenu: {
    family: 'overlay',
    today: 1,
    target: 3,
    shown: 'others',
    fails: [
      {
        check: 'forced-edge',
        slots: ['content'],
        note: 'Reka writes outline: none on the list itself, which the outline the stylesheet gives a ring does not win over. Its spec draws the edge as a border',
      },
    ],
  },
  UModal: { family: 'overlay', today: 3, target: 3, shown: 'gallery' },
  UPopover: { family: 'overlay', today: 1, target: 3, shown: 'others' },
  USlideover: { family: 'overlay', today: 1, target: 3, shown: 'others' },
  UToast: { family: 'overlay', today: 1, target: 3, shown: 'others' },
  UTooltip: { family: 'overlay', today: 1, target: 3, shown: 'others' },

  // layout
  UApp: {
    family: 'layout',
    today: 1,
    target: 1,
    shown: {
      unshown: 'nothing',
      note: 'The root of every page of the gallery: it holds the toaster and the overlays, and draws nothing of its own',
    },
  },
  UContainer: { family: 'layout', today: 1, target: 2, shown: 'others' },
  UError: { family: 'layout', today: 1, target: 2, shown: 'others', parts: ['UButton'] },
  UFooter: { family: 'layout', today: 1, target: 1, shown: 'others' },
  UHeader: { family: 'layout', today: 1, target: 2, shown: 'others' },
  UMain: { family: 'layout', today: 1, target: 1, shown: 'others' },
  USidebar: { family: 'layout', today: 1, target: 1, shown: 'others' },
  USplitter: { family: 'layout', today: 1, target: 1, shown: 'others' },
  UTheme: { family: 'layout', today: 1, target: 1, shown: 'others' },

  // page
  UAuthForm: {
    family: 'page',
    today: 1,
    target: 2,
    shown: 'others',
    parts: [
      'UForm',
      'UFormField',
      'UInput',
      'UCheckbox',
      'USelectMenu',
      'UPinInput',
      'UButton',
      'USeparator',
    ],
  },
  UBlogPost: { family: 'page', today: 1, target: 2, shown: 'others' },
  UBlogPosts: { family: 'page', today: 1, target: 1, shown: 'others' },
  UChangelogVersion: { family: 'page', today: 1, target: 2, shown: 'others' },
  UChangelogVersions: { family: 'page', today: 1, target: 1, shown: 'others' },
  UPage: { family: 'page', today: 1, target: 1, shown: 'others' },
  UPageAnchors: { family: 'page', today: 1, target: 2, shown: 'others' },
  UPageAside: { family: 'page', today: 1, target: 1, shown: 'others' },
  UPageBody: { family: 'page', today: 1, target: 1, shown: 'others' },
  UPageCTA: { family: 'page', today: 1, target: 2, shown: 'others' },
  UPageCard: { family: 'page', today: 1, target: 2, shown: 'others' },
  UPageColumns: { family: 'page', today: 1, target: 1, shown: 'others' },
  UPageFeature: { family: 'page', today: 1, target: 2, shown: 'others' },
  UPageGrid: { family: 'page', today: 1, target: 1, shown: 'others' },
  UPageHeader: { family: 'page', today: 1, target: 2, shown: 'others' },
  UPageHero: { family: 'page', today: 1, target: 2, shown: 'others' },
  UPageLinks: { family: 'page', today: 1, target: 2, shown: 'others' },
  UPageList: { family: 'page', today: 1, target: 1, shown: 'others' },
  UPageLogos: {
    family: 'page',
    today: 1,
    target: 1,
    shown: 'others',
    parts: ['UMarquee', 'UAvatar'],
  },
  UPageSection: { family: 'page', today: 1, target: 2, shown: 'others' },
  UPricingPlan: { family: 'page', today: 1, target: 2, shown: 'others' },
  UPricingPlans: { family: 'page', today: 1, target: 1, shown: 'others' },
  UPricingTable: { family: 'page', today: 1, target: 2, shown: 'others' },

  // dashboard
  UDashboardGroup: { family: 'dashboard', today: 1, target: 1, shown: 'others' },
  UDashboardNavbar: { family: 'dashboard', today: 1, target: 1, shown: 'others' },
  UDashboardPanel: { family: 'dashboard', today: 1, target: 1, shown: 'others' },
  UDashboardResizeHandle: { family: 'dashboard', today: 1, target: 1, shown: 'others' },
  UDashboardSearch: {
    family: 'dashboard',
    today: 1,
    target: 1,
    shown: 'others',
    parts: ['UModal', 'UCommandPalette'],
  },
  UDashboardSearchButton: {
    family: 'dashboard',
    today: 1,
    target: 1,
    shown: 'others',
    parts: ['UButton', 'UKbd', 'UTooltip'],
  },
  UDashboardSidebar: { family: 'dashboard', today: 1, target: 1, shown: 'others' },
  UDashboardSidebarCollapse: {
    family: 'dashboard',
    today: 1,
    target: 1,
    shown: 'others',
    parts: ['UButton'],
  },
  UDashboardSidebarToggle: {
    family: 'dashboard',
    today: 1,
    target: 1,
    shown: 'others',
    parts: ['UButton'],
  },
  UDashboardToolbar: { family: 'dashboard', today: 1, target: 1, shown: 'others' },

  // chat
  UChatAttachment: { family: 'chat', today: 1, target: 1, shown: 'others' },
  UChatMessage: { family: 'chat', today: 1, target: 1, shown: 'others' },
  UChatMessages: { family: 'chat', today: 1, target: 1, shown: 'others' },
  UChatPalette: { family: 'chat', today: 1, target: 1, shown: 'others' },
  UChatPrompt: { family: 'chat', today: 1, target: 1, shown: 'others' },
  UChatPromptSubmit: {
    family: 'chat',
    today: 1,
    target: 1,
    shown: 'others',
    parts: ['UButton'],
  },
  UChatReasoning: { family: 'chat', today: 1, target: 1, shown: 'others' },
  UChatShimmer: { family: 'chat', today: 1, target: 1, shown: 'others' },
  UChatTool: { family: 'chat', today: 1, target: 1, shown: 'others' },

  // editor
  UEditor: { family: 'editor', today: 1, target: 1, shown: 'others' },
  UEditorDragHandle: {
    family: 'editor',
    today: 1,
    target: 1,
    shown: 'others',
    parts: ['UButton'],
  },
  UEditorEmojiMenu: { family: 'editor', today: 1, target: 1, shown: 'others' },
  UEditorMentionMenu: { family: 'editor', today: 1, target: 1, shown: 'others' },
  UEditorSuggestionMenu: { family: 'editor', today: 1, target: 1, shown: 'others' },
  UEditorToolbar: {
    family: 'editor',
    today: 1,
    target: 1,
    shown: 'others',
    parts: ['UButton', 'UDropdownMenu', 'UTooltip'],
  },

  // content
  UContentNavigation: { family: 'content', today: 1, target: 1, shown: 'others' },
  UContentSearch: {
    family: 'content',
    today: 1,
    target: 1,
    shown: 'others',
    parts: ['UModal', 'UCommandPalette'],
  },
  UContentSearchButton: {
    family: 'content',
    today: 1,
    target: 1,
    shown: 'others',
    parts: ['UButton', 'UKbd', 'UTooltip'],
  },
  UContentSurround: { family: 'content', today: 1, target: 1, shown: 'others' },
  UContentToc: { family: 'content', today: 1, target: 1, shown: 'others' },

  // color-mode
  UColorModeAvatar: {
    family: 'color-mode',
    today: 1,
    target: 1,
    shown: 'others',
    parts: ['UAvatar'],
  },
  UColorModeButton: {
    family: 'color-mode',
    today: 1,
    target: 1,
    shown: 'others',
    parts: ['UButton'],
  },
  UColorModeImage: { family: 'color-mode', today: 1, target: 1, shown: 'others' },
  UColorModeSelect: {
    family: 'color-mode',
    today: 1,
    target: 1,
    shown: 'others',
    parts: ['USelectMenu'],
  },
  UColorModeSwitch: {
    family: 'color-mode',
    today: 1,
    target: 1,
    shown: 'others',
    parts: ['USwitch'],
  },

  // locale
  ULocaleSelect: {
    family: 'locale',
    today: 1,
    target: 1,
    shown: 'others',
    parts: ['USelectMenu'],
  },

  // prose
  ProseA: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseAccordion: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseAccordionItem: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseBadge: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseBlockquote: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseCallout: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseCard: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseCardGroup: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseCaution: {
    family: 'prose',
    today: 1,
    target: 1,
    shown: 'others',
    fails: [
      {
        check: 'contrast',
        slots: ['div'],
        note: 'Its text is a shade of the danger color on a tint of it: 2.3:1 in dark, 4:1 in light',
      },
    ],
  },
  ProseCode: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseCodeCollapse: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseCodeGroup: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseCodeIcon: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseCodePreview: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseCodeTree: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseCollapsible: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseEm: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseField: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseFieldGroup: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseH1: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseH2: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseH3: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseH4: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseHr: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseIcon: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseImg: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseKbd: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseLi: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseNote: {
    family: 'prose',
    today: 1,
    target: 1,
    shown: 'others',
    fails: [
      {
        check: 'contrast',
        slots: ['div'],
        note: 'Its text is a shade of the note color on a tint of it: 2.72:1 in dark, 3.71:1 in light',
      },
    ],
  },
  ProseOl: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseP: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProsePre: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProsePrompt: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseScript: {
    family: 'prose',
    today: 1,
    target: 1,
    shown: { unshown: 'nothing', note: 'Draws nothing: Nuxt UI leaves a script in prose out' },
  },
  ProseSteps: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseStrong: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseTable: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseTabs: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseTabsItem: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseTbody: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseTd: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseTh: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseThead: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseTip: {
    family: 'prose',
    today: 1,
    target: 1,
    shown: 'others',
    fails: [
      {
        check: 'contrast',
        theme: 'dark',
        slots: ['div'],
        note: 'Its text is a shade of the tip color on a tint of it: 3.11:1',
      },
    ],
  },
  ProseTr: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseUl: { family: 'prose', today: 1, target: 1, shown: 'others' },
  ProseWarning: {
    family: 'prose',
    today: 1,
    target: 1,
    shown: 'others',
    fails: [
      {
        check: 'contrast',
        slots: ['div'],
        note: 'Its text is a shade of the warning color on a tint of it: 3.2:1 in dark, 2.48:1 in light',
      },
    ],
  },

  // internal
  UContextMenuContent: {
    family: 'internal',
    today: 1,
    target: 2,
    shown: { unshown: 'part', note: 'The list of the context menu, which draws it' },
  },
  UDropdownMenuContent: {
    family: 'internal',
    today: 1,
    target: 3,
    shown: { unshown: 'part', note: 'The list of the dropdown menu, which draws it' },
  },
  ULinkBase: {
    family: 'internal',
    today: 1,
    target: 1,
    shown: { unshown: 'part', note: 'The element of the link, which draws it' },
  },
  UOverlayProvider: {
    family: 'internal',
    today: 1,
    target: 1,
    shown: {
      unshown: 'part',
      note: 'Inside UApp: it renders the overlays an app opens from code, and draws nothing of its own',
    },
  },
  UToaster: {
    family: 'internal',
    today: 1,
    target: 3,
    shown: {
      unshown: 'part',
      note: "Inside UApp: it places the toasts, which the toast's example shows",
    },
  },
} as const satisfies Record<string, ComponentLevels>

export type ComponentName = keyof typeof components
