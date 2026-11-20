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

1. **Inherits.** It takes the system's colors, radius and fonts through the stylesheet, and nothing else: its type, its sizes and its states are still Nuxt UI's. It is on the gallery's page of the others in both themes, where axe finds no contrast failure, and where in forced colors every icon and every edge drawn as a ring is still there and a control that is on differs from one that is off.
2. **Restyled.** It has a theme in the package, written on the system's tiers.
3. **Specced.** The design system has a spec for it, and its section of the gallery passes the parity test.

`packages/ui-vue/levels.ts` lists every component of the Nuxt UI version the package pins with the level it is at today and the level it is to reach for 1.0.0. A unit test fails when Nuxt UI has a component the file does not name.

A component with a known failure in the file does not pass level 1 yet: the file lists each level 1 check it fails today, with the theme and the part, so that the test passes without restyling anything here. The browser test fails when a failure appears that is not listed and when a listed one no longer fails, so the list only shrinks. For most of them the fix comes with the restyling or the spec their level for 1.0.0 asks for. For eight it is open work, with no pull request planned yet: `UInputRating`, `ProseCaution`, `ProseNote`, `ProseTip` and `ProseWarning` stay at level 1 for 1.0.0, and `UCheckbox`, `URadioGroup` and `UTable` are specced already, so their fix is a change of their specs.

The tables below are drawn from the file by `pnpm levels`.

<!-- levels:start -->

| Family         | Components | Level 3 today | Level 2 today | Level 1 today | Pass every level 1 check | Fail a level 1 check | Level 3 for 1.0.0 | Level 2 for 1.0.0 | Level 1 for 1.0.0 |
| -------------- | ---------- | ------------- | ------------- | ------------- | ------------------------ | -------------------- | ----------------- | ----------------- | ----------------- |
| Element        | 19         | 3             | 0             | 16            | 15                       | 4                    | 6                 | 10                | 3                 |
| Form           | 21         | 6             | 0             | 15            | 17                       | 4                    | 11                | 7                 | 3                 |
| Data           | 10         | 1             | 0             | 9             | 9                        | 1                    | 2                 | 4                 | 4                 |
| Navigation     | 8          | 1             | 0             | 7             | 8                        | 0                    | 3                 | 4                 | 1                 |
| Overlay        | 8          | 1             | 0             | 7             | 6                        | 2                    | 6                 | 2                 | 0                 |
| Layout         | 9          | 0             | 0             | 9             | 9                        | 0                    | 0                 | 3                 | 6                 |
| Page           | 23         | 0             | 0             | 23            | 23                       | 0                    | 0                 | 13                | 10                |
| Dashboard      | 10         | 0             | 0             | 10            | 10                       | 0                    | 0                 | 0                 | 10                |
| Chat           | 9          | 0             | 0             | 9             | 9                        | 0                    | 0                 | 0                 | 9                 |
| Editor         | 6          | 0             | 0             | 6             | 6                        | 0                    | 0                 | 0                 | 6                 |
| Content        | 5          | 0             | 0             | 5             | 5                        | 0                    | 0                 | 0                 | 5                 |
| Color mode     | 5          | 0             | 0             | 5             | 5                        | 0                    | 0                 | 0                 | 5                 |
| Locale         | 1          | 0             | 0             | 1             | 1                        | 0                    | 0                 | 0                 | 1                 |
| Prose          | 47         | 0             | 0             | 47            | 43                       | 4                    | 0                 | 0                 | 47                |
| Internal parts | 5          | 0             | 0             | 5             | 5                        | 0                    | 2                 | 1                 | 2                 |
| **All**        | 186        | 12            | 0             | 174           | 171                      | 15                   | 30                | 44                | 112               |

The components that do not pass level 1 yet, with each check they fail:

| Component       | Today | For 1.0.0 | Check it fails | In          | Parts              | What fails                                                                                                                                                              |
| --------------- | ----- | --------- | -------------- | ----------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `UAlert`        | 1     | 3         | contrast       | dark        | description        | The subtle error alert: its description in the danger color on the danger tint, 4.3:1 where text needs 4.5:1                                                            |
| `UAlert`        | 1     | 3         | contrast       | light       | title, description | The solid warning alert: the page color on the warning color, 2.05:1 and 1.9:1. The status kinds get a tint and an outline with the alert's spec, and no solid          |
| `UBanner`       | 1     | 2         | contrast       | dark, light | label              | An outline button on the banner: its label is drawn for the page and stands on the banner's fill, 1.29:1 in dark and 1.19:1 in light                                    |
| `UToggle`       | 1     | 2         | forced-state   | dark, light | pressed            | Pressed is a fill alone, which forced colors take away: a pressed state comes when it is restyled with the toggle group                                                 |
| `UToggleGroup`  | 1     | 3         | forced-state   | dark, light | pressed            | Pressed is a fill alone, which forced colors take away: a pressed state comes with its spec                                                                             |
| `UCheckbox`     | 3     | 3         | contrast       | dark        | description        | A checked card: its description in the secondary text color on the tint of a checked card, 3.94:1. The checkbox spec gives both colors, so the fix is the spec's        |
| `UInputRating`  | 1     | 1         | forced-state   | dark, light | radio              | A chosen star is the same icon as one that is not, in another color, which forced colors take away                                                                      |
| `URadioGroup`   | 3     | 3         | contrast       | dark        | description        | A checked card: its description in the secondary text color on the tint of a checked card, 3.94:1. The radio group spec gives both colors, so the fix is the spec's     |
| `USwitch`       | 1     | 3         | forced-state   | dark, light | switch             | On and off are the same empty outline: the thumb and the fill of the track are fills alone, which forced colors take away. Its spec draws both                          |
| `UTable`        | 3     | 3         | contrast       | dark        | label              | A tag in a chosen row: the tag's text on its tint over the chosen row's fill, 3.9:1. The table spec gives the fill and the badge spec the tag, so the fix is the specs' |
| `UContextMenu`  | 1     | 2         | forced-edge    | dark, light | content            | Reka writes outline: none on the list itself, which the outline the stylesheet gives a ring does not win over. Its restyling draws the edge as a border                 |
| `UDropdownMenu` | 1     | 3         | forced-edge    | dark, light | content            | Reka writes outline: none on the list itself, which the outline the stylesheet gives a ring does not win over. Its spec draws the edge as a border                      |
| `ProseCaution`  | 1     | 1         | contrast       | dark, light | div                | Its text is a shade of the danger color on a tint of it: 2.3:1 in dark, 4:1 in light                                                                                    |
| `ProseNote`     | 1     | 1         | contrast       | dark, light | div                | Its text is a shade of the note color on a tint of it: 2.72:1 in dark, 3.71:1 in light                                                                                  |
| `ProseTip`      | 1     | 1         | contrast       | dark        | div                | Its text is a shade of the tip color on a tint of it: 3.11:1                                                                                                            |
| `ProseWarning`  | 1     | 1         | contrast       | dark, light | div                | Its text is a shade of the warning color on a tint of it: 3.2:1 in dark, 2.48:1 in light                                                                                |

<details>

<summary>Every component</summary>

| Component                   | Family         | Today | For 1.0.0 | In the gallery       | Passes level 1   |
| --------------------------- | -------------- | ----- | --------- | -------------------- | ---------------- |
| `UAlert`                    | Element        | 1     | 3         | Others               | No: contrast     |
| `UAvatar`                   | Element        | 1     | 2         | Others               | Yes              |
| `UAvatarGroup`              | Element        | 1     | 2         | Others               | Yes              |
| `UBadge`                    | Element        | 3     | 3         | Gallery              | Yes              |
| `UBanner`                   | Element        | 1     | 2         | Others               | No: contrast     |
| `UButton`                   | Element        | 3     | 3         | Gallery              | Yes              |
| `UCalendar`                 | Element        | 1     | 2         | Others               | Yes              |
| `UCard`                     | Element        | 3     | 3         | Gallery              | Yes              |
| `UChip`                     | Element        | 1     | 2         | Others               | Yes              |
| `UCollapsible`              | Element        | 1     | 1         | Others               | Yes              |
| `UFieldGroup`               | Element        | 1     | 2         | Others               | Yes              |
| `UIcon`                     | Element        | 1     | 1         | Others               | Yes              |
| `UKbd`                      | Element        | 1     | 3         | Others               | Yes              |
| `UProgress`                 | Element        | 1     | 2         | Others               | Yes              |
| `UProgressGroup`            | Element        | 1     | 1         | Others               | Yes              |
| `USeparator`                | Element        | 1     | 2         | Others               | Yes              |
| `USkeleton`                 | Element        | 1     | 2         | Others               | Yes              |
| `UToggle`                   | Element        | 1     | 2         | Others               | No: forced-state |
| `UToggleGroup`              | Element        | 1     | 3         | Others               | No: forced-state |
| `UCheckbox`                 | Form           | 3     | 3         | Gallery              | No: contrast     |
| `UCheckboxGroup`            | Form           | 1     | 3         | Others               | Yes              |
| `UColorPicker`              | Form           | 1     | 1         | Others               | Yes              |
| `UFileUpload`               | Form           | 1     | 2         | Others               | Yes              |
| `UForm`                     | Form           | 1     | 1         | Others               | Yes              |
| `UFormField`                | Form           | 3     | 3         | Gallery              | Yes              |
| `UInput`                    | Form           | 3     | 3         | Gallery              | Yes              |
| `UInputDate`                | Form           | 1     | 2         | Others               | Yes              |
| `UInputMenu`                | Form           | 1     | 2         | Others               | Yes              |
| `UInputNumber`              | Form           | 1     | 3         | Others               | Yes              |
| `UInputRating`              | Form           | 1     | 1         | Others               | No: forced-state |
| `UInputTags`                | Form           | 1     | 2         | Others               | Yes              |
| `UInputTime`                | Form           | 1     | 2         | Others               | Yes              |
| `UListbox`                  | Form           | 1     | 2         | Others               | Yes              |
| `UPinInput`                 | Form           | 1     | 2         | Others               | Yes              |
| `URadioGroup`               | Form           | 3     | 3         | Gallery              | No: contrast     |
| `USelect`                   | Form           | 3     | 3         | Gallery              | Yes              |
| `USelectMenu`               | Form           | 3     | 3         | Gallery              | Yes              |
| `USlider`                   | Form           | 1     | 3         | Others               | Yes              |
| `USwitch`                   | Form           | 1     | 3         | Others               | No: forced-state |
| `UTextarea`                 | Form           | 1     | 3         | Others               | Yes              |
| `UAccordion`                | Data           | 1     | 3         | Others               | Yes              |
| `UCarousel`                 | Data           | 1     | 1         | Others               | Yes              |
| `UChart`                    | Data           | 1     | 1         | Others               | Yes              |
| `UEmpty`                    | Data           | 1     | 2         | Others               | Yes              |
| `UMarquee`                  | Data           | 1     | 1         | Others               | Yes              |
| `UScrollArea`               | Data           | 1     | 1         | Others               | Yes              |
| `UTable`                    | Data           | 3     | 3         | Gallery              | No: contrast     |
| `UTimeline`                 | Data           | 1     | 2         | Others               | Yes              |
| `UTree`                     | Data           | 1     | 2         | Others               | Yes              |
| `UUser`                     | Data           | 1     | 2         | Others               | Yes              |
| `UBreadcrumb`               | Navigation     | 1     | 3         | Others               | Yes              |
| `UCommandPalette`           | Navigation     | 1     | 2         | Others               | Yes              |
| `UFooterColumns`            | Navigation     | 1     | 1         | Others               | Yes              |
| `ULink`                     | Navigation     | 1     | 2         | Others               | Yes              |
| `UNavigationMenu`           | Navigation     | 1     | 2         | Others               | Yes              |
| `UPagination`               | Navigation     | 1     | 2         | Others               | Yes              |
| `UStepper`                  | Navigation     | 1     | 3         | Others               | Yes              |
| `UTabs`                     | Navigation     | 3     | 3         | Gallery              | Yes              |
| `UContextMenu`              | Overlay        | 1     | 2         | Others               | No: forced-edge  |
| `UDrawer`                   | Overlay        | 1     | 2         | Others               | Yes              |
| `UDropdownMenu`             | Overlay        | 1     | 3         | Others               | No: forced-edge  |
| `UModal`                    | Overlay        | 3     | 3         | Gallery              | Yes              |
| `UPopover`                  | Overlay        | 1     | 3         | Others               | Yes              |
| `USlideover`                | Overlay        | 1     | 3         | Others               | Yes              |
| `UToast`                    | Overlay        | 1     | 3         | Others               | Yes              |
| `UTooltip`                  | Overlay        | 1     | 3         | Others               | Yes              |
| `UApp`                      | Layout         | 1     | 1         | No: draws nothing    | Yes              |
| `UContainer`                | Layout         | 1     | 2         | Others               | Yes              |
| `UError`                    | Layout         | 1     | 2         | Others               | Yes              |
| `UFooter`                   | Layout         | 1     | 1         | Others               | Yes              |
| `UHeader`                   | Layout         | 1     | 2         | Others               | Yes              |
| `UMain`                     | Layout         | 1     | 1         | Others               | Yes              |
| `USidebar`                  | Layout         | 1     | 1         | Others               | Yes              |
| `USplitter`                 | Layout         | 1     | 1         | Others               | Yes              |
| `UTheme`                    | Layout         | 1     | 1         | Others               | Yes              |
| `UAuthForm`                 | Page           | 1     | 2         | Others               | Yes              |
| `UBlogPost`                 | Page           | 1     | 2         | Others               | Yes              |
| `UBlogPosts`                | Page           | 1     | 1         | Others               | Yes              |
| `UChangelogVersion`         | Page           | 1     | 2         | Others               | Yes              |
| `UChangelogVersions`        | Page           | 1     | 1         | Others               | Yes              |
| `UPage`                     | Page           | 1     | 1         | Others               | Yes              |
| `UPageAnchors`              | Page           | 1     | 2         | Others               | Yes              |
| `UPageAside`                | Page           | 1     | 1         | Others               | Yes              |
| `UPageBody`                 | Page           | 1     | 1         | Others               | Yes              |
| `UPageCTA`                  | Page           | 1     | 2         | Others               | Yes              |
| `UPageCard`                 | Page           | 1     | 2         | Others               | Yes              |
| `UPageColumns`              | Page           | 1     | 1         | Others               | Yes              |
| `UPageFeature`              | Page           | 1     | 2         | Others               | Yes              |
| `UPageGrid`                 | Page           | 1     | 1         | Others               | Yes              |
| `UPageHeader`               | Page           | 1     | 2         | Others               | Yes              |
| `UPageHero`                 | Page           | 1     | 2         | Others               | Yes              |
| `UPageLinks`                | Page           | 1     | 2         | Others               | Yes              |
| `UPageList`                 | Page           | 1     | 1         | Others               | Yes              |
| `UPageLogos`                | Page           | 1     | 1         | Others               | Yes              |
| `UPageSection`              | Page           | 1     | 2         | Others               | Yes              |
| `UPricingPlan`              | Page           | 1     | 2         | Others               | Yes              |
| `UPricingPlans`             | Page           | 1     | 1         | Others               | Yes              |
| `UPricingTable`             | Page           | 1     | 2         | Others               | Yes              |
| `UDashboardGroup`           | Dashboard      | 1     | 1         | Others               | Yes              |
| `UDashboardNavbar`          | Dashboard      | 1     | 1         | Others               | Yes              |
| `UDashboardPanel`           | Dashboard      | 1     | 1         | Others               | Yes              |
| `UDashboardResizeHandle`    | Dashboard      | 1     | 1         | Others               | Yes              |
| `UDashboardSearch`          | Dashboard      | 1     | 1         | Others               | Yes              |
| `UDashboardSearchButton`    | Dashboard      | 1     | 1         | Others               | Yes              |
| `UDashboardSidebar`         | Dashboard      | 1     | 1         | Others               | Yes              |
| `UDashboardSidebarCollapse` | Dashboard      | 1     | 1         | Others               | Yes              |
| `UDashboardSidebarToggle`   | Dashboard      | 1     | 1         | Others               | Yes              |
| `UDashboardToolbar`         | Dashboard      | 1     | 1         | Others               | Yes              |
| `UChatAttachment`           | Chat           | 1     | 1         | Others               | Yes              |
| `UChatMessage`              | Chat           | 1     | 1         | Others               | Yes              |
| `UChatMessages`             | Chat           | 1     | 1         | Others               | Yes              |
| `UChatPalette`              | Chat           | 1     | 1         | Others               | Yes              |
| `UChatPrompt`               | Chat           | 1     | 1         | Others               | Yes              |
| `UChatPromptSubmit`         | Chat           | 1     | 1         | Others               | Yes              |
| `UChatReasoning`            | Chat           | 1     | 1         | Others               | Yes              |
| `UChatShimmer`              | Chat           | 1     | 1         | Others               | Yes              |
| `UChatTool`                 | Chat           | 1     | 1         | Others               | Yes              |
| `UEditor`                   | Editor         | 1     | 1         | Others               | Yes              |
| `UEditorDragHandle`         | Editor         | 1     | 1         | Others               | Yes              |
| `UEditorEmojiMenu`          | Editor         | 1     | 1         | Others               | Yes              |
| `UEditorMentionMenu`        | Editor         | 1     | 1         | Others               | Yes              |
| `UEditorSuggestionMenu`     | Editor         | 1     | 1         | Others               | Yes              |
| `UEditorToolbar`            | Editor         | 1     | 1         | Others               | Yes              |
| `UContentNavigation`        | Content        | 1     | 1         | Others               | Yes              |
| `UContentSearch`            | Content        | 1     | 1         | Others               | Yes              |
| `UContentSearchButton`      | Content        | 1     | 1         | Others               | Yes              |
| `UContentSurround`          | Content        | 1     | 1         | Others               | Yes              |
| `UContentToc`               | Content        | 1     | 1         | Others               | Yes              |
| `UColorModeAvatar`          | Color mode     | 1     | 1         | Others               | Yes              |
| `UColorModeButton`          | Color mode     | 1     | 1         | Others               | Yes              |
| `UColorModeImage`           | Color mode     | 1     | 1         | Others               | Yes              |
| `UColorModeSelect`          | Color mode     | 1     | 1         | Others               | Yes              |
| `UColorModeSwitch`          | Color mode     | 1     | 1         | Others               | Yes              |
| `ULocaleSelect`             | Locale         | 1     | 1         | Others               | Yes              |
| `ProseA`                    | Prose          | 1     | 1         | Others               | Yes              |
| `ProseAccordion`            | Prose          | 1     | 1         | Others               | Yes              |
| `ProseAccordionItem`        | Prose          | 1     | 1         | Others               | Yes              |
| `ProseBadge`                | Prose          | 1     | 1         | Others               | Yes              |
| `ProseBlockquote`           | Prose          | 1     | 1         | Others               | Yes              |
| `ProseCallout`              | Prose          | 1     | 1         | Others               | Yes              |
| `ProseCard`                 | Prose          | 1     | 1         | Others               | Yes              |
| `ProseCardGroup`            | Prose          | 1     | 1         | Others               | Yes              |
| `ProseCaution`              | Prose          | 1     | 1         | Others               | No: contrast     |
| `ProseCode`                 | Prose          | 1     | 1         | Others               | Yes              |
| `ProseCodeCollapse`         | Prose          | 1     | 1         | Others               | Yes              |
| `ProseCodeGroup`            | Prose          | 1     | 1         | Others               | Yes              |
| `ProseCodeIcon`             | Prose          | 1     | 1         | Others               | Yes              |
| `ProseCodePreview`          | Prose          | 1     | 1         | Others               | Yes              |
| `ProseCodeTree`             | Prose          | 1     | 1         | Others               | Yes              |
| `ProseCollapsible`          | Prose          | 1     | 1         | Others               | Yes              |
| `ProseEm`                   | Prose          | 1     | 1         | Others               | Yes              |
| `ProseField`                | Prose          | 1     | 1         | Others               | Yes              |
| `ProseFieldGroup`           | Prose          | 1     | 1         | Others               | Yes              |
| `ProseH1`                   | Prose          | 1     | 1         | Others               | Yes              |
| `ProseH2`                   | Prose          | 1     | 1         | Others               | Yes              |
| `ProseH3`                   | Prose          | 1     | 1         | Others               | Yes              |
| `ProseH4`                   | Prose          | 1     | 1         | Others               | Yes              |
| `ProseHr`                   | Prose          | 1     | 1         | Others               | Yes              |
| `ProseIcon`                 | Prose          | 1     | 1         | Others               | Yes              |
| `ProseImg`                  | Prose          | 1     | 1         | Others               | Yes              |
| `ProseKbd`                  | Prose          | 1     | 1         | Others               | Yes              |
| `ProseLi`                   | Prose          | 1     | 1         | Others               | Yes              |
| `ProseNote`                 | Prose          | 1     | 1         | Others               | No: contrast     |
| `ProseOl`                   | Prose          | 1     | 1         | Others               | Yes              |
| `ProseP`                    | Prose          | 1     | 1         | Others               | Yes              |
| `ProsePre`                  | Prose          | 1     | 1         | Others               | Yes              |
| `ProsePrompt`               | Prose          | 1     | 1         | Others               | Yes              |
| `ProseScript`               | Prose          | 1     | 1         | No: draws nothing    | Yes              |
| `ProseSteps`                | Prose          | 1     | 1         | Others               | Yes              |
| `ProseStrong`               | Prose          | 1     | 1         | Others               | Yes              |
| `ProseTable`                | Prose          | 1     | 1         | Others               | Yes              |
| `ProseTabs`                 | Prose          | 1     | 1         | Others               | Yes              |
| `ProseTabsItem`             | Prose          | 1     | 1         | Others               | Yes              |
| `ProseTbody`                | Prose          | 1     | 1         | Others               | Yes              |
| `ProseTd`                   | Prose          | 1     | 1         | Others               | Yes              |
| `ProseTh`                   | Prose          | 1     | 1         | Others               | Yes              |
| `ProseThead`                | Prose          | 1     | 1         | Others               | Yes              |
| `ProseTip`                  | Prose          | 1     | 1         | Others               | No: contrast     |
| `ProseTr`                   | Prose          | 1     | 1         | Others               | Yes              |
| `ProseUl`                   | Prose          | 1     | 1         | Others               | Yes              |
| `ProseWarning`              | Prose          | 1     | 1         | Others               | No: contrast     |
| `UContextMenuContent`       | Internal parts | 1     | 2         | No: an internal part | Yes              |
| `UDropdownMenuContent`      | Internal parts | 1     | 3         | No: an internal part | Yes              |
| `ULinkBase`                 | Internal parts | 1     | 1         | No: an internal part | Yes              |
| `UOverlayProvider`          | Internal parts | 1     | 1         | No: an internal part | Yes              |
| `UToaster`                  | Internal parts | 1     | 3         | No: an internal part | Yes              |

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
