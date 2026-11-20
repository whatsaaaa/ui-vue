<img src="./.github/assets/readme-header.svg" alt="whatsaaaa" width="100%" />

# ui-vue

[Nuxt UI](https://ui.nuxt.com) themed with the [Whatsaaaa design system](https://github.com/whatsaaaa/design-system), for Vue and Nuxt. A trial: ten core components (button, badge, input, select and select menu, checkbox, radio group, card, modal, table, tabs) take the system's terminal look through Nuxt UI's central config, in both themes.

| Folder             | What it is                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| `packages/ui-vue`  | `@whatsaaaa/ui-vue`: the theme, the stylesheet and the color mode's head script                   |
| `playgrounds/nuxt` | The gallery: every themed component in its variants, sizes and states, generated as a static site |
| `playgrounds/vue`  | The smallest plain Vue (Vite) setup, one page                                                     |

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
  the design system's Tailwind entry, `@whatsaaaa/design-system/tailwind.css` (Tailwind and the system in cascade layers: `theme`, then `base`: Tailwind's preflight, then the system's `base.css`, then `components`, then `utilities`), Nuxt UI, the system's `dark:` and `light:` variants again over Nuxt UI's, `@whatsaaaa/design-system/tailwind/variants.css` (they follow the nearest `data-theme` or `dark` or `light` class, as the tokens do), and the package's own bridge of Nuxt UI's `--ui-*` variables to the system's `--ws-*` roles, `nuxt-ui.css`. An app on Tailwind without Nuxt UI imports `@whatsaaaa/design-system/tailwind.css` instead.
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

## Working on it

You need Node.js 24.12 or later and pnpm. `corepack enable` sets pnpm up.

The playgrounds use the package as an app does, built in `packages/ui-vue/dist`, and the browser tests run on the playgrounds. The unit tests import the package's TypeScript, and need the build too: its stylesheet reads the themes' classes from there. `pnpm install` builds it, and the commands that read it build it again first.

| Command             | What it does                                                                                                                                                         |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`          | Starts the gallery, and builds the package again when its TypeScript changes                                                                                         |
| `pnpm dev:vue`      | Starts the Vue page, the same way                                                                                                                                    |
| `pnpm build`        | Builds the package into `packages/ui-vue/dist`, then both playgrounds; the gallery into `playgrounds/nuxt/.output/public`                                            |
| `pnpm test`         | Unit tests: the config and the colors it builds, the Nuxt UI bridge, the head scripts, the versions the install command names, the Playwright version `ci.yml` names |
| `pnpm test:browser` | Builds the package and both playgrounds, and tests them in a browser                                                                                                 |
| `pnpm lint`         | Checks the code, the stylesheets and the package as it is packed                                                                                                     |
| `pnpm type-check`   | Type-checks the package and both playgrounds                                                                                                                         |
| `pnpm format`       | Formats everything                                                                                                                                                   |
| `pnpm changeset`    | Records a change to the package for the next release                                                                                                                 |

## Releasing

1. A pull request that changes what the package ships adds a changeset with `pnpm changeset`.
2. When it merges, the release workflow, `.github/workflows/release.yml`, opens a Version Packages pull request that bumps the version and writes the changelog.
3. Merging that one starts the publish job. It waits for a reviewer to approve the `npm` environment, then publishes to npm through trusted publishing, with provenance. No npm token is stored anywhere.

That needs an `npm` environment with a required reviewer, "Allow GitHub Actions to create and approve pull requests" in the repository's Actions settings, and a trusted publisher on the package's npm settings for `release.yml` and the environment `npm`. npm sets up a trusted publisher only for a package that exists, so the first version is published by hand.

A release that moves to a new minor of Nuxt UI is a minor: the update moves the peer range to that minor, and the browser tests then run on it. The install commands of this README and the package's name the peer ranges, and a unit test holds them to `packages/ui-vue/package.json`.

## License

[MIT](./LICENSE). Built on [Nuxt UI](https://ui.nuxt.com) and the [Whatsaaaa design system](https://github.com/whatsaaaa/design-system).
