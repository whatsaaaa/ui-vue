<img src="./.github/assets/readme-header.svg" alt="whatsaaaa" width="100%" />

# ui-vue

[Nuxt UI](https://ui.nuxt.com) themed with the [Whatsaaaa design system](https://github.com/whatsaaaa/design-system), for Vue and Nuxt. A trial, private for now: ten core components (button, badge, input, select and select menu, checkbox, radio group, card, modal, table, tabs) take the system's terminal look through Nuxt UI's central config, in both themes.

| Folder             | What it is                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| `packages/ui-vue`  | `@whatsaaaa/ui-vue`: the theme, the stylesheets and the color mode bridge                         |
| `playgrounds/nuxt` | The gallery: every themed component in its variants, sizes and states, generated as a static site |
| `playgrounds/vue`  | The smallest plain Vue (Vite) setup, one page                                                     |

## Use it

The package brings three things:

- **`@whatsaaaa/ui-vue/index.css`**, the app's whole stylesheet. Import it alone, first:
  Tailwind and the design system in cascade layers (`theme`, then `base`: Tailwind's preflight, then the system's `base.css`, then `components`, then `utilities`), Nuxt UI, and the bridge of Nuxt UI's `--ui-*` variables to the system's `--ws-*` roles. Its part `tailwind.css` is the design system for Tailwind on its own, meant to move into the design system.
- **`theme` and `ui`** from `@whatsaaaa/ui-vue`: Nuxt UI's module options and the components' config.
- **`@whatsaaaa/ui-vue/color-mode`**: a head script and a sync that keep the system's `data-theme` and Nuxt UI's `.dark` class in step, both ways.

On Nuxt, as in `playgrounds/nuxt`:

```ts
// nuxt.config.ts
ui: { theme, fonts: false },             // the system brings its fonts
colorMode: { storageKey: 'ws-theme' },   // one remembered choice for both
app: { head: { script: [{ innerHTML: colorModeInitScript }] } },

// app/app.config.ts
export default defineAppConfig({ ui })

// app/plugins/color-mode.client.ts
export default defineNuxtPlugin(() => syncColorMode(useColorMode()))
```

On Vue, as in `playgrounds/vue`: `ui({ theme, ui })` in the Vite plugin's options, `colorModeInitScript` in the `<head>`, and `syncColorMode(vueColorMode())` after mounting the app.

The package is TypeScript, imported as it is, so a consumer's `tsconfig` sets `allowImportingTsExtensions`. A build step comes with publishing.

## Working on it

You need Node.js 24.12 or later and pnpm. `corepack enable` sets pnpm up.

| Command             | What it does                                                                |
| ------------------- | --------------------------------------------------------------------------- |
| `pnpm dev`          | Starts the gallery                                                          |
| `pnpm dev:vue`      | Starts the Vue page                                                         |
| `pnpm build`        | Builds both playgrounds; the gallery into `playgrounds/nuxt/.output/public` |
| `pnpm test`         | Unit tests: the config and the colors it builds, the head script            |
| `pnpm test:browser` | Builds both playgrounds and tests them in a browser                         |
| `pnpm lint`         | Checks the code and the stylesheets                                         |
| `pnpm type-check`   | Type-checks the package and both playgrounds                                |
| `pnpm format`       | Formats everything                                                          |
