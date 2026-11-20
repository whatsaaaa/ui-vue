<img src="./.github/assets/readme-header.svg" alt="whatsaaaa" width="100%" />

# ui-vue

[Nuxt UI](https://ui.nuxt.com) themed with the [Whatsaaaa design system](https://github.com/whatsaaaa/design-system), for Vue and Nuxt. A trial: ten core components (button, badge, input, select and select menu, checkbox, radio group, card, modal, table, tabs) take the system's terminal look through Nuxt UI's central config, in both themes.

| Folder             | What it is                                                                                                                   |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `packages/ui-vue`  | `@whatsaaaa/ui-vue`: the theme, the stylesheet and the color mode's head script                                              |
| `playgrounds/nuxt` | The gallery: every themed component in its variants, sizes and states, and a page of every other, generated as a static site |
| `playgrounds/vue`  | The smallest plain Vue (Vite) setup, one page                                                                                |

## Use it

### Install

An app adds the package next to Nuxt UI, and with it the design system and Tailwind, which the package reads:

```sh
pnpm add @whatsaaaa/ui-vue '@whatsaaaa/design-system@^0.14.0' '@nuxt/ui@~4.13.0' tailwindcss
```

The versions are the package's peer ranges. A release works with one minor of Nuxt UI, the one its tests passed on: a theme leans on Nuxt UI's own classes, which change in a minor, so a new minor of Nuxt UI comes with a new minor of the package. Until the design system's 1.0.0, a release works with one minor of it too.

On Nuxt, the config takes the theme and the head script, and names the app's stylesheet:

```ts
// nuxt.config.ts
import { theme } from '@whatsaaaa/ui-vue'
import { colorModeInitScript } from '@whatsaaaa/ui-vue/color-mode'

export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  ui: { theme, fonts: false }, // the system brings its fonts
  app: { head: { script: [{ innerHTML: colorModeInitScript }] } },
})
```

```ts
// app/app.config.ts
import { ui } from '@whatsaaaa/ui-vue'

export default defineAppConfig({ ui })
```

The stylesheet imports the package's, alone and first, in place of Tailwind's and Nuxt UI's own imports:

```css
/* app/assets/css/main.css */
@import '@whatsaaaa/ui-vue/index.css';
```

It names the package's themes as a source of classes itself, so the app adds no `@source` for them. The rest of this section says what each part is, and shows the setup on Vue.

### What it brings

The package brings three things:

- **`@whatsaaaa/ui-vue/index.css`**, the app's whole stylesheet. Import it alone, first:
  the design system's Tailwind entry, `@whatsaaaa/design-system/tailwind.css` (Tailwind and the system in cascade layers: `theme`, then `base`: Tailwind's preflight, then the system's `base.css`, then `components`, then `utilities`), Nuxt UI, the system's `dark:` and `light:` variants again over Nuxt UI's, `@whatsaaaa/design-system/tailwind/variants.css` (they follow the nearest `data-theme` or `dark` or `light` class, as the tokens do), and the package's own bridge of Nuxt UI's `--ui-*` variables to the system's `--ws-*` roles, `nuxt-ui.css`. It also draws again, for every component, what forced colors take away: an icon drawn as a mask is painted in the text color, and an edge drawn with `ring` is an outline. An app on Tailwind without Nuxt UI imports `@whatsaaaa/design-system/tailwind.css` instead.
- **`theme` and `ui`** from `@whatsaaaa/ui-vue`: Nuxt UI's module options and the components' config.
- **`@whatsaaaa/ui-vue/color-mode`**: the head script the design system's theme needs next to Nuxt UI's color mode. The tokens follow the `dark` or `light` class the color mode puts on `<html>`, so the color mode switches the theme and remembers it, and a page that forces its color mode keeps its theme. Switch the theme with the color mode, not with the design system's `setTheme` or `toggleTheme`: the `data-theme` they write wins over the class. The head script keeps a theme remembered under the design system's `ws-theme` from winning over the class too.

A `dark` or `light` class, like `data-theme`, also keeps a part of a page in one theme: everything inside it, Nuxt UI's components included, takes that theme. A menu or a select list in such a part opens in it with `:portal="false"` and a `z-index` on its list, as in the gallery: in a portal at the end of the page it takes the page's theme.

A select menu's search draws the search icon by default. An app that passes its own `searchInput`, for example to give it a placeholder naming what it searches, passes `icon: 'i-lucide-search'` with it: Nuxt UI takes a passed `searchInput` in place of the default.

Three things Nuxt UI leaves to the app, which the gallery does and a page has to do too:

- **A card's title is a heading.** Nuxt UI draws the title in a `div` unless the `as` prop names another element for it, so name a heading, at the level the page's outline puts the card at: `<UCard title="Harbour Conf" :as="{ title: 'h3' }">`. A heading passed in the `#title` slot still works, and is what the gallery does: `<template #title><h3>Harbour Conf</h3></template>`. The theme draws it as the card's title either way.
- **An amount in a table is set by its column.** Nuxt UI has no slot for an amount, so the theme cannot find one: give the column `meta: { class: { th: 'text-end', td: 'text-end tabular-nums' } }`, which puts the amounts and their column's name at the end of the column, in figures of one width.
- **The key hints need the design system's keys head script.** `colorModeInitScript` is the theme's head script only. An app with a status line whose keys work, by `enableShortcuts` from `@whatsaaaa/design-system/shortcuts`, also inlines `keysInitScript` from the same module in the `<head>`, after the color mode's script: on Nuxt `script: [{ innerHTML: colorModeInitScript }, { innerHTML: keysInitScript }]`, on Vue from the Vite plugin that inlines the other. The design system's usage guide has the markup of the hints and of the keys switch.

On Nuxt, as in `playgrounds/nuxt`, the color mode switches the theme:

```ts
// a theme switch: <button :disabled="colorMode.forced" @click="switchTheme">
const colorMode = useColorMode()
const switchTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

// a page kept in one theme, as the gallery's dark page. The switch is disabled there: the color
// mode would neither show nor remember a choice made on it.
definePageMeta({ colorMode: 'dark' })
```

On Vue, as in `playgrounds/vue`: `ui({ theme, ui })` in the Vite plugin's options, `vueColorModeInitScript` in the `<head>`, and VueUse's `useColorMode()` in the app's root component, which switches the theme. Unlike the `useDark` of Nuxt UI's plugin, it puts a `light` class on `<html>` as well as a `dark` one, which the tokens need to tell a chosen light theme from the system's.

Send the design system's two theme-color tags too, `themeColorMeta` from `@whatsaaaa/design-system/theme/meta`, in the `<head>` before the head script, so the browser's bars take the theme's background in the page as sent, as the design system's usage guide shows. On Vue they go in from the Vite plugin that inlines the head script. On Nuxt they go in from a Nitro plugin, as `playgrounds/nuxt/server/plugins/theme-color.ts` does, not from `app.head`: Nuxt's head would put back their colors as sent once the app hydrates, over the theme the head script keeps them at.

The package ships its TypeScript compiled, with the type declarations, in `dist/`, and its two stylesheets as they are written. `index.css` reads the classes of the component themes from the compiled files, the ones the app runs.

## Coverage

How far a Nuxt UI component follows the design system is one of three levels, each a test:

1. **Inherits.** It takes the system's colors, radius and fonts through the stylesheet, and nothing else: its type, its sizes and its states are still Nuxt UI's. It is on the gallery's page of the others in both themes, where axe finds no contrast failure, every icon and every edge drawn as a ring is still there in forced colors, a control that is on differs there from one that is off, and nothing overflows at 390 px.
2. **Restyled.** It has a theme in the package, written on the system's tiers.
3. **Specced.** The design system has a spec for it, and its section of the gallery passes the parity test.

`packages/ui-vue/levels.ts` lists every component of the Nuxt UI version the package pins with the level it is at today and the level it is to reach for 1.0.0. A unit test fails when Nuxt UI has a component the file does not name. A level 1 check that a component still fails, whose fix belongs to its restyling or to its spec, is listed with it there: the browser test fails when another appears and when a listed one no longer fails, so the list only shrinks. The tables below are drawn from the file by `pnpm levels`.

<!-- levels:start -->

| Family         | Components | Level 3 today | Level 2 today | Level 1 today | Level 3 for 1.0.0 | Level 2 for 1.0.0 | Level 1 for 1.0.0 |
| -------------- | ---------- | ------------- | ------------- | ------------- | ----------------- | ----------------- | ----------------- |
| Element        | 19         | 3             | 0             | 16            | 7                 | 9                 | 3                 |
| Form           | 21         | 6             | 0             | 15            | 11                | 7                 | 3                 |
| Data           | 10         | 1             | 0             | 9             | 2                 | 4                 | 4                 |
| Navigation     | 8          | 1             | 0             | 7             | 3                 | 4                 | 1                 |
| Overlay        | 8          | 1             | 0             | 7             | 6                 | 2                 | 0                 |
| Layout         | 9          | 0             | 0             | 9             | 0                 | 3                 | 6                 |
| Page           | 23         | 0             | 0             | 23            | 0                 | 13                | 10                |
| Dashboard      | 10         | 0             | 0             | 10            | 0                 | 0                 | 10                |
| Chat           | 9          | 0             | 0             | 9             | 0                 | 0                 | 9                 |
| Editor         | 6          | 0             | 0             | 6             | 0                 | 0                 | 6                 |
| Content        | 5          | 0             | 0             | 5             | 0                 | 0                 | 5                 |
| Color mode     | 5          | 0             | 0             | 5             | 0                 | 0                 | 5                 |
| Locale         | 1          | 0             | 0             | 1             | 0                 | 0                 | 1                 |
| Prose          | 47         | 0             | 0             | 47            | 0                 | 0                 | 47                |
| Internal parts | 5          | 0             | 0             | 5             | 2                 | 1                 | 2                 |
| **All**        | 186        | 12            | 0             | 174           | 31                | 43                | 112               |

<details>

<summary>Every component</summary>

| Component                   | Family         | Today | For 1.0.0 | In the gallery       | Known level 1 failures            |
| --------------------------- | -------------- | ----- | --------- | -------------------- | --------------------------------- |
| `UAlert`                    | Element        | 1     | 3         | Others               | contrast (dark), contrast (light) |
| `UAvatar`                   | Element        | 1     | 2         | Others               |                                   |
| `UAvatarGroup`              | Element        | 1     | 2         | Others               |                                   |
| `UBadge`                    | Element        | 3     | 3         | Gallery              |                                   |
| `UBanner`                   | Element        | 1     | 2         | Others               | contrast                          |
| `UButton`                   | Element        | 3     | 3         | Gallery              |                                   |
| `UCalendar`                 | Element        | 1     | 2         | Others               |                                   |
| `UCard`                     | Element        | 3     | 3         | Gallery              |                                   |
| `UChip`                     | Element        | 1     | 2         | Others               |                                   |
| `UCollapsible`              | Element        | 1     | 1         | Others               |                                   |
| `UFieldGroup`               | Element        | 1     | 2         | Others               |                                   |
| `UIcon`                     | Element        | 1     | 1         | Others               |                                   |
| `UKbd`                      | Element        | 1     | 3         | Others               |                                   |
| `UProgress`                 | Element        | 1     | 2         | Others               |                                   |
| `UProgressGroup`            | Element        | 1     | 1         | Others               |                                   |
| `USeparator`                | Element        | 1     | 2         | Others               |                                   |
| `USkeleton`                 | Element        | 1     | 2         | Others               |                                   |
| `UToggle`                   | Element        | 1     | 3         | Others               | forced-state                      |
| `UToggleGroup`              | Element        | 1     | 3         | Others               | forced-state                      |
| `UCheckbox`                 | Form           | 3     | 3         | Gallery              | contrast (dark)                   |
| `UCheckboxGroup`            | Form           | 1     | 3         | Others               |                                   |
| `UColorPicker`              | Form           | 1     | 1         | Others               |                                   |
| `UFileUpload`               | Form           | 1     | 2         | Others               |                                   |
| `UForm`                     | Form           | 1     | 1         | Others               |                                   |
| `UFormField`                | Form           | 3     | 3         | Gallery              |                                   |
| `UInput`                    | Form           | 3     | 3         | Gallery              |                                   |
| `UInputDate`                | Form           | 1     | 2         | Others               |                                   |
| `UInputMenu`                | Form           | 1     | 2         | Others               |                                   |
| `UInputNumber`              | Form           | 1     | 3         | Others               |                                   |
| `UInputRating`              | Form           | 1     | 1         | Others               | forced-state                      |
| `UInputTags`                | Form           | 1     | 2         | Others               |                                   |
| `UInputTime`                | Form           | 1     | 2         | Others               |                                   |
| `UListbox`                  | Form           | 1     | 2         | Others               |                                   |
| `UPinInput`                 | Form           | 1     | 2         | Others               |                                   |
| `URadioGroup`               | Form           | 3     | 3         | Gallery              | contrast (dark)                   |
| `USelect`                   | Form           | 3     | 3         | Gallery              |                                   |
| `USelectMenu`               | Form           | 3     | 3         | Gallery              |                                   |
| `USlider`                   | Form           | 1     | 3         | Others               |                                   |
| `USwitch`                   | Form           | 1     | 3         | Others               | forced-state                      |
| `UTextarea`                 | Form           | 1     | 3         | Others               |                                   |
| `UAccordion`                | Data           | 1     | 3         | Others               |                                   |
| `UCarousel`                 | Data           | 1     | 1         | Others               |                                   |
| `UChart`                    | Data           | 1     | 1         | Others               |                                   |
| `UEmpty`                    | Data           | 1     | 2         | Others               |                                   |
| `UMarquee`                  | Data           | 1     | 1         | Others               |                                   |
| `UScrollArea`               | Data           | 1     | 1         | Others               |                                   |
| `UTable`                    | Data           | 3     | 3         | Gallery              | contrast (dark)                   |
| `UTimeline`                 | Data           | 1     | 2         | Others               |                                   |
| `UTree`                     | Data           | 1     | 2         | Others               |                                   |
| `UUser`                     | Data           | 1     | 2         | Others               |                                   |
| `UBreadcrumb`               | Navigation     | 1     | 3         | Others               |                                   |
| `UCommandPalette`           | Navigation     | 1     | 2         | Others               |                                   |
| `UFooterColumns`            | Navigation     | 1     | 1         | Others               |                                   |
| `ULink`                     | Navigation     | 1     | 2         | Others               |                                   |
| `UNavigationMenu`           | Navigation     | 1     | 2         | Others               |                                   |
| `UPagination`               | Navigation     | 1     | 2         | Others               |                                   |
| `UStepper`                  | Navigation     | 1     | 3         | Others               |                                   |
| `UTabs`                     | Navigation     | 3     | 3         | Gallery              |                                   |
| `UContextMenu`              | Overlay        | 1     | 2         | Others               | forced-edge                       |
| `UDrawer`                   | Overlay        | 1     | 2         | Others               |                                   |
| `UDropdownMenu`             | Overlay        | 1     | 3         | Others               | forced-edge                       |
| `UModal`                    | Overlay        | 3     | 3         | Gallery              |                                   |
| `UPopover`                  | Overlay        | 1     | 3         | Others               |                                   |
| `USlideover`                | Overlay        | 1     | 3         | Others               |                                   |
| `UToast`                    | Overlay        | 1     | 3         | Others               |                                   |
| `UTooltip`                  | Overlay        | 1     | 3         | Others               |                                   |
| `UApp`                      | Layout         | 1     | 1         | No: draws nothing    |                                   |
| `UContainer`                | Layout         | 1     | 2         | Others               |                                   |
| `UError`                    | Layout         | 1     | 2         | Others               |                                   |
| `UFooter`                   | Layout         | 1     | 1         | Others               |                                   |
| `UHeader`                   | Layout         | 1     | 2         | Others               |                                   |
| `UMain`                     | Layout         | 1     | 1         | Others               |                                   |
| `USidebar`                  | Layout         | 1     | 1         | Others               |                                   |
| `USplitter`                 | Layout         | 1     | 1         | Others               |                                   |
| `UTheme`                    | Layout         | 1     | 1         | Others               |                                   |
| `UAuthForm`                 | Page           | 1     | 2         | Others               |                                   |
| `UBlogPost`                 | Page           | 1     | 2         | Others               |                                   |
| `UBlogPosts`                | Page           | 1     | 1         | Others               |                                   |
| `UChangelogVersion`         | Page           | 1     | 2         | Others               |                                   |
| `UChangelogVersions`        | Page           | 1     | 1         | Others               |                                   |
| `UPage`                     | Page           | 1     | 1         | Others               |                                   |
| `UPageAnchors`              | Page           | 1     | 2         | Others               |                                   |
| `UPageAside`                | Page           | 1     | 1         | Others               |                                   |
| `UPageBody`                 | Page           | 1     | 1         | Others               |                                   |
| `UPageCTA`                  | Page           | 1     | 2         | Others               |                                   |
| `UPageCard`                 | Page           | 1     | 2         | Others               |                                   |
| `UPageColumns`              | Page           | 1     | 1         | Others               |                                   |
| `UPageFeature`              | Page           | 1     | 2         | Others               |                                   |
| `UPageGrid`                 | Page           | 1     | 1         | Others               |                                   |
| `UPageHeader`               | Page           | 1     | 2         | Others               |                                   |
| `UPageHero`                 | Page           | 1     | 2         | Others               |                                   |
| `UPageLinks`                | Page           | 1     | 2         | Others               |                                   |
| `UPageList`                 | Page           | 1     | 1         | Others               |                                   |
| `UPageLogos`                | Page           | 1     | 1         | Others               |                                   |
| `UPageSection`              | Page           | 1     | 2         | Others               |                                   |
| `UPricingPlan`              | Page           | 1     | 2         | Others               |                                   |
| `UPricingPlans`             | Page           | 1     | 1         | Others               |                                   |
| `UPricingTable`             | Page           | 1     | 2         | Others               |                                   |
| `UDashboardGroup`           | Dashboard      | 1     | 1         | Others               |                                   |
| `UDashboardNavbar`          | Dashboard      | 1     | 1         | Others               |                                   |
| `UDashboardPanel`           | Dashboard      | 1     | 1         | Others               |                                   |
| `UDashboardResizeHandle`    | Dashboard      | 1     | 1         | Others               |                                   |
| `UDashboardSearch`          | Dashboard      | 1     | 1         | Others               |                                   |
| `UDashboardSearchButton`    | Dashboard      | 1     | 1         | Others               |                                   |
| `UDashboardSidebar`         | Dashboard      | 1     | 1         | Others               |                                   |
| `UDashboardSidebarCollapse` | Dashboard      | 1     | 1         | Others               |                                   |
| `UDashboardSidebarToggle`   | Dashboard      | 1     | 1         | Others               |                                   |
| `UDashboardToolbar`         | Dashboard      | 1     | 1         | Others               |                                   |
| `UChatAttachment`           | Chat           | 1     | 1         | Others               |                                   |
| `UChatMessage`              | Chat           | 1     | 1         | Others               |                                   |
| `UChatMessages`             | Chat           | 1     | 1         | Others               |                                   |
| `UChatPalette`              | Chat           | 1     | 1         | Others               |                                   |
| `UChatPrompt`               | Chat           | 1     | 1         | Others               |                                   |
| `UChatPromptSubmit`         | Chat           | 1     | 1         | Others               |                                   |
| `UChatReasoning`            | Chat           | 1     | 1         | Others               |                                   |
| `UChatShimmer`              | Chat           | 1     | 1         | Others               |                                   |
| `UChatTool`                 | Chat           | 1     | 1         | Others               |                                   |
| `UEditor`                   | Editor         | 1     | 1         | Others               |                                   |
| `UEditorDragHandle`         | Editor         | 1     | 1         | Others               |                                   |
| `UEditorEmojiMenu`          | Editor         | 1     | 1         | Others               |                                   |
| `UEditorMentionMenu`        | Editor         | 1     | 1         | Others               |                                   |
| `UEditorSuggestionMenu`     | Editor         | 1     | 1         | Others               |                                   |
| `UEditorToolbar`            | Editor         | 1     | 1         | Others               |                                   |
| `UContentNavigation`        | Content        | 1     | 1         | Others               |                                   |
| `UContentSearch`            | Content        | 1     | 1         | Others               |                                   |
| `UContentSearchButton`      | Content        | 1     | 1         | Others               |                                   |
| `UContentSurround`          | Content        | 1     | 1         | Others               |                                   |
| `UContentToc`               | Content        | 1     | 1         | Others               |                                   |
| `UColorModeAvatar`          | Color mode     | 1     | 1         | Others               |                                   |
| `UColorModeButton`          | Color mode     | 1     | 1         | Others               |                                   |
| `UColorModeImage`           | Color mode     | 1     | 1         | Others               |                                   |
| `UColorModeSelect`          | Color mode     | 1     | 1         | Others               |                                   |
| `UColorModeSwitch`          | Color mode     | 1     | 1         | Others               |                                   |
| `ULocaleSelect`             | Locale         | 1     | 1         | Others               |                                   |
| `ProseA`                    | Prose          | 1     | 1         | Others               |                                   |
| `ProseAccordion`            | Prose          | 1     | 1         | Others               |                                   |
| `ProseAccordionItem`        | Prose          | 1     | 1         | Others               |                                   |
| `ProseBadge`                | Prose          | 1     | 1         | Others               |                                   |
| `ProseBlockquote`           | Prose          | 1     | 1         | Others               |                                   |
| `ProseCallout`              | Prose          | 1     | 1         | Others               |                                   |
| `ProseCard`                 | Prose          | 1     | 1         | Others               |                                   |
| `ProseCardGroup`            | Prose          | 1     | 1         | Others               |                                   |
| `ProseCaution`              | Prose          | 1     | 1         | Others               | contrast                          |
| `ProseCode`                 | Prose          | 1     | 1         | Others               |                                   |
| `ProseCodeCollapse`         | Prose          | 1     | 1         | Others               |                                   |
| `ProseCodeGroup`            | Prose          | 1     | 1         | Others               |                                   |
| `ProseCodeIcon`             | Prose          | 1     | 1         | Others               |                                   |
| `ProseCodePreview`          | Prose          | 1     | 1         | Others               |                                   |
| `ProseCodeTree`             | Prose          | 1     | 1         | Others               |                                   |
| `ProseCollapsible`          | Prose          | 1     | 1         | Others               |                                   |
| `ProseEm`                   | Prose          | 1     | 1         | Others               |                                   |
| `ProseField`                | Prose          | 1     | 1         | Others               |                                   |
| `ProseFieldGroup`           | Prose          | 1     | 1         | Others               |                                   |
| `ProseH1`                   | Prose          | 1     | 1         | Others               |                                   |
| `ProseH2`                   | Prose          | 1     | 1         | Others               |                                   |
| `ProseH3`                   | Prose          | 1     | 1         | Others               |                                   |
| `ProseH4`                   | Prose          | 1     | 1         | Others               |                                   |
| `ProseHr`                   | Prose          | 1     | 1         | Others               |                                   |
| `ProseIcon`                 | Prose          | 1     | 1         | Others               |                                   |
| `ProseImg`                  | Prose          | 1     | 1         | Others               |                                   |
| `ProseKbd`                  | Prose          | 1     | 1         | Others               |                                   |
| `ProseLi`                   | Prose          | 1     | 1         | Others               |                                   |
| `ProseNote`                 | Prose          | 1     | 1         | Others               | contrast                          |
| `ProseOl`                   | Prose          | 1     | 1         | Others               |                                   |
| `ProseP`                    | Prose          | 1     | 1         | Others               |                                   |
| `ProsePre`                  | Prose          | 1     | 1         | Others               |                                   |
| `ProsePrompt`               | Prose          | 1     | 1         | Others               |                                   |
| `ProseScript`               | Prose          | 1     | 1         | No: draws nothing    |                                   |
| `ProseSteps`                | Prose          | 1     | 1         | Others               |                                   |
| `ProseStrong`               | Prose          | 1     | 1         | Others               |                                   |
| `ProseTable`                | Prose          | 1     | 1         | Others               |                                   |
| `ProseTabs`                 | Prose          | 1     | 1         | Others               |                                   |
| `ProseTabsItem`             | Prose          | 1     | 1         | Others               |                                   |
| `ProseTbody`                | Prose          | 1     | 1         | Others               |                                   |
| `ProseTd`                   | Prose          | 1     | 1         | Others               |                                   |
| `ProseTh`                   | Prose          | 1     | 1         | Others               |                                   |
| `ProseThead`                | Prose          | 1     | 1         | Others               |                                   |
| `ProseTip`                  | Prose          | 1     | 1         | Others               | contrast (dark)                   |
| `ProseTr`                   | Prose          | 1     | 1         | Others               |                                   |
| `ProseUl`                   | Prose          | 1     | 1         | Others               |                                   |
| `ProseWarning`              | Prose          | 1     | 1         | Others               | contrast                          |
| `UContextMenuContent`       | Internal parts | 1     | 2         | No: an internal part |                                   |
| `UDropdownMenuContent`      | Internal parts | 1     | 3         | No: an internal part |                                   |
| `ULinkBase`                 | Internal parts | 1     | 1         | No: an internal part |                                   |
| `UOverlayProvider`          | Internal parts | 1     | 1         | No: an internal part |                                   |
| `UToaster`                  | Internal parts | 1     | 3         | No: an internal part |                                   |

</details>

<!-- levels:end -->

## Working on it

You need Node.js 24.12 or later and pnpm. `corepack enable` sets pnpm up.

The playgrounds use the package as an app does, built in `packages/ui-vue/dist`, and the browser tests run on the playgrounds. The unit tests import the package's TypeScript, and need the build too: its stylesheet reads the themes' classes from there. `pnpm install` builds it, and the commands that read it build it again first.

| Command             | What it does                                                                                                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`          | Starts the gallery, and builds the package again when its TypeScript changes                                                                                                          |
| `pnpm dev:vue`      | Starts the Vue page, the same way                                                                                                                                                     |
| `pnpm build`        | Builds the package into `packages/ui-vue/dist`, then both playgrounds; the gallery into `playgrounds/nuxt/.output/public`                                                             |
| `pnpm test`         | Unit tests: the config and the colors it builds, the Nuxt UI bridge, the head scripts, the versions the install command names, the levels file, the Playwright version `ci.yml` names |
| `pnpm test:browser` | Builds the package and both playgrounds, and tests them in a browser                                                                                                                  |
| `pnpm lint`         | Checks the code, the stylesheets and the package as it is packed                                                                                                                      |
| `pnpm type-check`   | Type-checks the package and both playgrounds                                                                                                                                          |
| `pnpm format`       | Formats everything                                                                                                                                                                    |
| `pnpm changeset`    | Records a change to the package for the next release                                                                                                                                  |
| `pnpm levels`       | Writes the coverage tables of this README from `packages/ui-vue/levels.ts`                                                                                                            |

## Releasing

1. A pull request that changes what the package ships adds a changeset with `pnpm changeset`.
2. When it merges, the release workflow, `.github/workflows/release.yml`, opens a Version Packages pull request that bumps the version and writes the changelog.
3. Merging that one starts the publish job. It waits for a reviewer to approve the `npm` environment, then publishes to npm through trusted publishing, with provenance. No npm token is stored anywhere.

That needs an `npm` environment with a required reviewer, "Allow GitHub Actions to create and approve pull requests" in the repository's Actions settings, and a trusted publisher on the package's npm settings for `release.yml` and the environment `npm`. npm sets up a trusted publisher only for a package that exists, so the first version is published by hand.

A release that moves to a new minor of Nuxt UI is a minor: the update moves the peer range to that minor, and the browser tests then run on it. The install commands of this README and the package's name the peer ranges, and a unit test holds them to `packages/ui-vue/package.json`.

## License

[MIT](./LICENSE). Built on [Nuxt UI](https://ui.nuxt.com) and the [Whatsaaaa design system](https://github.com/whatsaaaa/design-system).
