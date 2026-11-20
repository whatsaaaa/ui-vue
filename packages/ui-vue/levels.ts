/**
 * How far each component of Nuxt UI follows the design system: every component of the Nuxt UI
 * version the package pins, with its family, the level it is at today and the level it is to
 * reach for ui-vue 1.0.0.
 *
 * - Level 1, inherits: it takes the system's colors, radius and fonts through the stylesheet. It
 *   is on a gallery page in both themes, and the level 1 checks pass on it: no contrast failure
 *   by axe, and in forced colors every icon is painted, every part whose edge is a ring keeps an
 *   edge and a control that is on differs from one that is off.
 * - Level 2, restyled: it has a theme in the package, written on the system's tiers.
 * - Level 3, specced: the design system has a spec for it, and its gallery passes the parity test.
 *
 * A component from level 2 has a section of the gallery, and one at level 1 an example on the
 * page of the others, playgrounds/nuxt/app/pages/others.vue, unless it is `unshown`.
 *
 * The levels are data: the README's tables and the gallery's page of the others are drawn from
 * this file, tests/levels.test.ts holds it to the components Nuxt UI has, and
 * tests/browser/level-1.spec.ts to what the pages draw.
 *
 * A component with an entry under `fails` does not pass level 1 yet: the entry is a level 1
 * check it fails today, carried here so that the test passes without restyling anything. The
 * test fails when a failure appears that is not listed and when a listed one no longer fails, so
 * the list only shrinks. For most, the fix comes with the restyling or the spec their level for
 * 1.0.0 asks for. For eight it is open work, with no pull request planned yet: UInputRating,
 * ProseCaution, ProseNote, ProseTip and ProseWarning stay at level 1 for 1.0.0, and UCheckbox,
 * URadioGroup and UTable are specced already, so their fix is a change of their specs.
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
 * A level 1 check: contrast is axe's color-contrast rule, and forced-icon, forced-edge and
 * forced-state are the three of forced colors.
 */
export type Check = 'contrast' | 'forced-icon' | 'forced-edge' | 'forced-state'

/**
 * A level 1 check a component is known to fail. It stands for one failure for each of its themes
 * and parts: that check failing on that part of the component in that theme, and nothing else.
 */
export interface KnownFailure {
  check: Check
  /** The themes it fails in: in forced colors, the system's color scheme. */
  themes: readonly Theme[]
  /**
   * The parts that fail: each by its data-slot, or by its element where it has none. A control
   * whose state is lost is named by its role, a pressed button as pressed.
   */
  slots: readonly string[]
  /** What fails, and what would fix it. */
  note: string
}

/**
 * Why the gallery does not show a component: it draws nothing of its own, or it is an internal
 * part, which cannot stand alone and is drawn by the component it belongs to.
 */
export interface Unshown {
  why: 'nothing' | 'part'
  note: string
}

export interface ComponentLevels {
  family: Family
  /** The level it is at today. With an entry under `fails`, it does not pass level 1 yet. */
  today: Level
  /** The level it is to reach for ui-vue 1.0.0. */
  target: Level
  /** Why the gallery does not show it, where it does not. */
  unshown?: Unshown
  /** The level 1 checks it fails today. */
  fails?: readonly KnownFailure[]
}

/**
 * Where the gallery shows a component: in a section of the gallery from level 2, on the page of
 * the others at level 1, and nowhere when it is unshown.
 */
export function shownOn({ today, unshown }: ComponentLevels): 'gallery' | 'others' | undefined {
  if (unshown) return undefined
  return today > 1 ? 'gallery' : 'others'
}

export const components = {
  // element
  UAlert: {
    family: 'element',
    today: 1,
    target: 3,
    fails: [
      {
        check: 'contrast',
        themes: ['dark'],
        slots: ['description'],
        note: 'The subtle error alert: its description in the danger color on the danger tint, 4.3:1 where text needs 4.5:1',
      },
      {
        check: 'contrast',
        themes: ['light'],
        slots: ['title', 'description'],
        note: "The solid warning alert: the page color on the warning color, 2.05:1 and 1.9:1. The status kinds get a tint and an outline with the alert's spec, and no solid",
      },
    ],
  },
  UAvatar: { family: 'element', today: 1, target: 2 },
  UAvatarGroup: { family: 'element', today: 1, target: 2 },
  UBadge: { family: 'element', today: 3, target: 3 },
  UBanner: {
    family: 'element',
    today: 1,
    target: 2,
    fails: [
      {
        check: 'contrast',
        themes: ['dark', 'light'],
        slots: ['label'],
        note: "An outline button on the banner: its label is drawn for the page and stands on the banner's fill, 1.29:1 in dark and 1.19:1 in light",
      },
    ],
  },
  UButton: { family: 'element', today: 3, target: 3 },
  UCalendar: { family: 'element', today: 1, target: 2 },
  UCard: { family: 'element', today: 3, target: 3 },
  UChip: { family: 'element', today: 1, target: 2 },
  UCollapsible: { family: 'element', today: 1, target: 1 },
  UFieldGroup: { family: 'element', today: 1, target: 2 },
  UIcon: { family: 'element', today: 1, target: 1 },
  UKbd: { family: 'element', today: 1, target: 3 },
  UProgress: { family: 'element', today: 1, target: 2 },
  UProgressGroup: { family: 'element', today: 1, target: 1 },
  USeparator: { family: 'element', today: 1, target: 2 },
  USkeleton: { family: 'element', today: 1, target: 2 },
  UToggle: {
    family: 'element',
    today: 1,
    target: 2,
    fails: [
      {
        check: 'forced-state',
        themes: ['dark', 'light'],
        slots: ['pressed'],
        note: 'Pressed is a fill alone, which forced colors take away: a pressed state comes when it is restyled with the toggle group',
      },
    ],
  },
  UToggleGroup: {
    family: 'element',
    today: 1,
    target: 3,
    fails: [
      {
        check: 'forced-state',
        themes: ['dark', 'light'],
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
    fails: [
      {
        check: 'contrast',
        themes: ['dark'],
        slots: ['description'],
        note: "A checked card: its description in the secondary text color on the tint of a checked card, 3.94:1. The checkbox spec gives both colors, so the fix is the spec's",
      },
    ],
  },
  UCheckboxGroup: { family: 'form', today: 1, target: 3 },
  UColorPicker: { family: 'form', today: 1, target: 1 },
  UFileUpload: { family: 'form', today: 1, target: 2 },
  UForm: { family: 'form', today: 1, target: 1 },
  UFormField: { family: 'form', today: 3, target: 3 },
  UInput: { family: 'form', today: 3, target: 3 },
  UInputDate: { family: 'form', today: 1, target: 2 },
  UInputMenu: { family: 'form', today: 1, target: 2 },
  UInputNumber: { family: 'form', today: 1, target: 3 },
  UInputRating: {
    family: 'form',
    today: 1,
    target: 1,
    fails: [
      {
        check: 'forced-state',
        themes: ['dark', 'light'],
        slots: ['radio'],
        note: 'A chosen star is the same icon as one that is not, in another color, which forced colors take away',
      },
    ],
  },
  UInputTags: { family: 'form', today: 1, target: 2 },
  UInputTime: { family: 'form', today: 1, target: 2 },
  UListbox: { family: 'form', today: 1, target: 2 },
  UPinInput: { family: 'form', today: 1, target: 2 },
  URadioGroup: {
    family: 'form',
    today: 3,
    target: 3,
    fails: [
      {
        check: 'contrast',
        themes: ['dark'],
        slots: ['description'],
        note: "A checked card: its description in the secondary text color on the tint of a checked card, 3.94:1. The radio group spec gives both colors, so the fix is the spec's",
      },
    ],
  },
  USelect: { family: 'form', today: 3, target: 3 },
  USelectMenu: { family: 'form', today: 3, target: 3 },
  USlider: { family: 'form', today: 1, target: 3 },
  USwitch: {
    family: 'form',
    today: 1,
    target: 3,
    fails: [
      {
        check: 'forced-state',
        themes: ['dark', 'light'],
        slots: ['switch'],
        note: 'On and off are the same empty outline: the thumb and the fill of the track are fills alone, which forced colors take away. Its spec draws both',
      },
    ],
  },
  UTextarea: { family: 'form', today: 1, target: 3 },

  // data
  UAccordion: { family: 'data', today: 1, target: 3 },
  UCarousel: { family: 'data', today: 1, target: 1 },
  UChart: { family: 'data', today: 1, target: 1 },
  UEmpty: { family: 'data', today: 1, target: 2 },
  UMarquee: { family: 'data', today: 1, target: 1 },
  UScrollArea: { family: 'data', today: 1, target: 1 },
  UTable: {
    family: 'data',
    today: 3,
    target: 3,
    fails: [
      {
        check: 'contrast',
        themes: ['dark'],
        slots: ['label'],
        note: "A tag in a chosen row: the tag's text on its tint over the chosen row's fill, 3.9:1. The table spec gives the fill and the badge spec the tag, so the fix is the specs'",
      },
    ],
  },
  UTimeline: { family: 'data', today: 1, target: 2 },
  UTree: { family: 'data', today: 1, target: 2 },
  UUser: { family: 'data', today: 1, target: 2 },

  // navigation
  UBreadcrumb: { family: 'navigation', today: 1, target: 3 },
  UCommandPalette: { family: 'navigation', today: 1, target: 2 },
  UFooterColumns: { family: 'navigation', today: 1, target: 1 },
  ULink: { family: 'navigation', today: 1, target: 2 },
  UNavigationMenu: { family: 'navigation', today: 1, target: 2 },
  UPagination: { family: 'navigation', today: 1, target: 2 },
  UStepper: { family: 'navigation', today: 1, target: 3 },
  UTabs: { family: 'navigation', today: 3, target: 3 },

  // overlay
  UContextMenu: {
    family: 'overlay',
    today: 1,
    target: 2,
    fails: [
      {
        check: 'forced-edge',
        themes: ['dark', 'light'],
        slots: ['content'],
        note: 'Reka writes outline: none on the list itself, which the outline the stylesheet gives a ring does not win over. Its restyling draws the edge as a border',
      },
    ],
  },
  UDrawer: { family: 'overlay', today: 1, target: 2 },
  UDropdownMenu: {
    family: 'overlay',
    today: 1,
    target: 3,
    fails: [
      {
        check: 'forced-edge',
        themes: ['dark', 'light'],
        slots: ['content'],
        note: 'Reka writes outline: none on the list itself, which the outline the stylesheet gives a ring does not win over. Its spec draws the edge as a border',
      },
    ],
  },
  UModal: { family: 'overlay', today: 3, target: 3 },
  UPopover: { family: 'overlay', today: 1, target: 3 },
  USlideover: { family: 'overlay', today: 1, target: 3 },
  UToast: { family: 'overlay', today: 1, target: 3 },
  UTooltip: { family: 'overlay', today: 1, target: 3 },

  // layout
  UApp: {
    family: 'layout',
    today: 1,
    target: 1,
    unshown: {
      why: 'nothing',
      note: 'The root of every page of the gallery: it holds the toaster and the overlays, and draws nothing of its own',
    },
  },
  UContainer: { family: 'layout', today: 1, target: 2 },
  UError: { family: 'layout', today: 1, target: 2 },
  UFooter: { family: 'layout', today: 1, target: 1 },
  UHeader: { family: 'layout', today: 1, target: 2 },
  UMain: { family: 'layout', today: 1, target: 1 },
  USidebar: { family: 'layout', today: 1, target: 1 },
  USplitter: { family: 'layout', today: 1, target: 1 },
  UTheme: { family: 'layout', today: 1, target: 1 },

  // page
  UAuthForm: { family: 'page', today: 1, target: 2 },
  UBlogPost: { family: 'page', today: 1, target: 2 },
  UBlogPosts: { family: 'page', today: 1, target: 1 },
  UChangelogVersion: { family: 'page', today: 1, target: 2 },
  UChangelogVersions: { family: 'page', today: 1, target: 1 },
  UPage: { family: 'page', today: 1, target: 1 },
  UPageAnchors: { family: 'page', today: 1, target: 2 },
  UPageAside: { family: 'page', today: 1, target: 1 },
  UPageBody: { family: 'page', today: 1, target: 1 },
  UPageCTA: { family: 'page', today: 1, target: 2 },
  UPageCard: { family: 'page', today: 1, target: 2 },
  UPageColumns: { family: 'page', today: 1, target: 1 },
  UPageFeature: { family: 'page', today: 1, target: 2 },
  UPageGrid: { family: 'page', today: 1, target: 1 },
  UPageHeader: { family: 'page', today: 1, target: 2 },
  UPageHero: { family: 'page', today: 1, target: 2 },
  UPageLinks: { family: 'page', today: 1, target: 2 },
  UPageList: { family: 'page', today: 1, target: 1 },
  UPageLogos: { family: 'page', today: 1, target: 1 },
  UPageSection: { family: 'page', today: 1, target: 2 },
  UPricingPlan: { family: 'page', today: 1, target: 2 },
  UPricingPlans: { family: 'page', today: 1, target: 1 },
  UPricingTable: { family: 'page', today: 1, target: 2 },

  // dashboard
  UDashboardGroup: { family: 'dashboard', today: 1, target: 1 },
  UDashboardNavbar: { family: 'dashboard', today: 1, target: 1 },
  UDashboardPanel: { family: 'dashboard', today: 1, target: 1 },
  UDashboardResizeHandle: { family: 'dashboard', today: 1, target: 1 },
  UDashboardSearch: { family: 'dashboard', today: 1, target: 1 },
  UDashboardSearchButton: { family: 'dashboard', today: 1, target: 1 },
  UDashboardSidebar: { family: 'dashboard', today: 1, target: 1 },
  UDashboardSidebarCollapse: { family: 'dashboard', today: 1, target: 1 },
  UDashboardSidebarToggle: { family: 'dashboard', today: 1, target: 1 },
  UDashboardToolbar: { family: 'dashboard', today: 1, target: 1 },

  // chat
  UChatAttachment: { family: 'chat', today: 1, target: 1 },
  UChatMessage: { family: 'chat', today: 1, target: 1 },
  UChatMessages: { family: 'chat', today: 1, target: 1 },
  UChatPalette: { family: 'chat', today: 1, target: 1 },
  UChatPrompt: { family: 'chat', today: 1, target: 1 },
  UChatPromptSubmit: { family: 'chat', today: 1, target: 1 },
  UChatReasoning: { family: 'chat', today: 1, target: 1 },
  UChatShimmer: { family: 'chat', today: 1, target: 1 },
  UChatTool: { family: 'chat', today: 1, target: 1 },

  // editor
  UEditor: { family: 'editor', today: 1, target: 1 },
  UEditorDragHandle: { family: 'editor', today: 1, target: 1 },
  UEditorEmojiMenu: { family: 'editor', today: 1, target: 1 },
  UEditorMentionMenu: { family: 'editor', today: 1, target: 1 },
  UEditorSuggestionMenu: { family: 'editor', today: 1, target: 1 },
  UEditorToolbar: { family: 'editor', today: 1, target: 1 },

  // content
  UContentNavigation: { family: 'content', today: 1, target: 1 },
  UContentSearch: { family: 'content', today: 1, target: 1 },
  UContentSearchButton: { family: 'content', today: 1, target: 1 },
  UContentSurround: { family: 'content', today: 1, target: 1 },
  UContentToc: { family: 'content', today: 1, target: 1 },

  // color-mode
  UColorModeAvatar: { family: 'color-mode', today: 1, target: 1 },
  UColorModeButton: { family: 'color-mode', today: 1, target: 1 },
  UColorModeImage: { family: 'color-mode', today: 1, target: 1 },
  UColorModeSelect: { family: 'color-mode', today: 1, target: 1 },
  UColorModeSwitch: { family: 'color-mode', today: 1, target: 1 },

  // locale
  ULocaleSelect: { family: 'locale', today: 1, target: 1 },

  // prose
  ProseA: { family: 'prose', today: 1, target: 1 },
  ProseAccordion: { family: 'prose', today: 1, target: 1 },
  ProseAccordionItem: { family: 'prose', today: 1, target: 1 },
  ProseBadge: { family: 'prose', today: 1, target: 1 },
  ProseBlockquote: { family: 'prose', today: 1, target: 1 },
  ProseCallout: { family: 'prose', today: 1, target: 1 },
  ProseCard: { family: 'prose', today: 1, target: 1 },
  ProseCardGroup: { family: 'prose', today: 1, target: 1 },
  ProseCaution: {
    family: 'prose',
    today: 1,
    target: 1,
    fails: [
      {
        check: 'contrast',
        themes: ['dark', 'light'],
        slots: ['div'],
        note: 'Its text is a shade of the danger color on a tint of it: 2.3:1 in dark, 4:1 in light',
      },
    ],
  },
  ProseCode: { family: 'prose', today: 1, target: 1 },
  ProseCodeCollapse: { family: 'prose', today: 1, target: 1 },
  ProseCodeGroup: { family: 'prose', today: 1, target: 1 },
  ProseCodeIcon: { family: 'prose', today: 1, target: 1 },
  ProseCodePreview: { family: 'prose', today: 1, target: 1 },
  ProseCodeTree: { family: 'prose', today: 1, target: 1 },
  ProseCollapsible: { family: 'prose', today: 1, target: 1 },
  ProseEm: { family: 'prose', today: 1, target: 1 },
  ProseField: { family: 'prose', today: 1, target: 1 },
  ProseFieldGroup: { family: 'prose', today: 1, target: 1 },
  ProseH1: { family: 'prose', today: 1, target: 1 },
  ProseH2: { family: 'prose', today: 1, target: 1 },
  ProseH3: { family: 'prose', today: 1, target: 1 },
  ProseH4: { family: 'prose', today: 1, target: 1 },
  ProseHr: { family: 'prose', today: 1, target: 1 },
  ProseIcon: { family: 'prose', today: 1, target: 1 },
  ProseImg: { family: 'prose', today: 1, target: 1 },
  ProseKbd: { family: 'prose', today: 1, target: 1 },
  ProseLi: { family: 'prose', today: 1, target: 1 },
  ProseNote: {
    family: 'prose',
    today: 1,
    target: 1,
    fails: [
      {
        check: 'contrast',
        themes: ['dark', 'light'],
        slots: ['div'],
        note: 'Its text is a shade of the note color on a tint of it: 2.72:1 in dark, 3.71:1 in light',
      },
    ],
  },
  ProseOl: { family: 'prose', today: 1, target: 1 },
  ProseP: { family: 'prose', today: 1, target: 1 },
  ProsePre: { family: 'prose', today: 1, target: 1 },
  ProsePrompt: { family: 'prose', today: 1, target: 1 },
  ProseScript: {
    family: 'prose',
    today: 1,
    target: 1,
    unshown: { why: 'nothing', note: 'Draws nothing: Nuxt UI leaves a script in prose out' },
  },
  ProseSteps: { family: 'prose', today: 1, target: 1 },
  ProseStrong: { family: 'prose', today: 1, target: 1 },
  ProseTable: { family: 'prose', today: 1, target: 1 },
  ProseTabs: { family: 'prose', today: 1, target: 1 },
  ProseTabsItem: { family: 'prose', today: 1, target: 1 },
  ProseTbody: { family: 'prose', today: 1, target: 1 },
  ProseTd: { family: 'prose', today: 1, target: 1 },
  ProseTh: { family: 'prose', today: 1, target: 1 },
  ProseThead: { family: 'prose', today: 1, target: 1 },
  ProseTip: {
    family: 'prose',
    today: 1,
    target: 1,
    fails: [
      {
        check: 'contrast',
        themes: ['dark'],
        slots: ['div'],
        note: 'Its text is a shade of the tip color on a tint of it: 3.11:1',
      },
    ],
  },
  ProseTr: { family: 'prose', today: 1, target: 1 },
  ProseUl: { family: 'prose', today: 1, target: 1 },
  ProseWarning: {
    family: 'prose',
    today: 1,
    target: 1,
    fails: [
      {
        check: 'contrast',
        themes: ['dark', 'light'],
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
    unshown: { why: 'part', note: 'The list of the context menu, which draws it' },
  },
  UDropdownMenuContent: {
    family: 'internal',
    today: 1,
    target: 3,
    unshown: { why: 'part', note: 'The list of the dropdown menu, which draws it' },
  },
  ULinkBase: {
    family: 'internal',
    today: 1,
    target: 1,
    unshown: { why: 'part', note: 'The element of the link, which draws it' },
  },
  UOverlayProvider: {
    family: 'internal',
    today: 1,
    target: 1,
    unshown: {
      why: 'part',
      note: 'Inside UApp: it renders the overlays an app opens from code, and draws nothing of its own',
    },
  },
  UToaster: {
    family: 'internal',
    today: 1,
    target: 3,
    unshown: {
      why: 'part',
      note: "Inside UApp: it places the toasts, which the toast's example shows",
    },
  },
} as const satisfies Record<string, ComponentLevels>

export type ComponentName = keyof typeof components
