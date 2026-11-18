<img src="./.github/assets/readme-header.svg" alt="whatsaaaa" width="100%" />

# ui-vue

[Nuxt UI](https://ui.nuxt.com) themed with the [Whatsaaaa design system](https://github.com/whatsaaaa/design-system), for Vue and Nuxt. A trial: ten core components (button, badge, input, select and select menu, checkbox, radio group, card, modal, table, tabs) take the system's terminal look through Nuxt UI's central config, in both themes.

| Folder             | What it is                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| `packages/ui-vue`  | `@whatsaaaa/ui-vue`: the theme, the stylesheet and the color mode's head script                   |
| `playgrounds/nuxt` | The gallery: every themed component in its variants, sizes and states, generated as a static site |
| `playgrounds/vue`  | The smallest plain Vue (Vite) setup, one page                                                     |

## Use it

The package brings three things:

- **`@whatsaaaa/ui-vue/index.css`**, the app's whole stylesheet. Import it alone, first:
  the design system's Tailwind entry, `@whatsaaaa/design-system/tailwind.css` (Tailwind and the system in cascade layers: `theme`, then `base`: Tailwind's preflight, then the system's `base.css`, then `components`, then `utilities`), Nuxt UI, the system's `dark:` and `light:` variants again over Nuxt UI's, `@whatsaaaa/design-system/tailwind/variants.css` (they follow the nearest `data-theme` or `dark` or `light` class, as the tokens do), and the package's own bridge of Nuxt UI's `--ui-*` variables to the system's `--ws-*` roles, `nuxt-ui.css`. An app on Tailwind without Nuxt UI imports `@whatsaaaa/design-system/tailwind.css` instead.
- **`theme` and `ui`** from `@whatsaaaa/ui-vue`: Nuxt UI's module options and the components' config.
- **`@whatsaaaa/ui-vue/color-mode`**: the head script the design system's theme needs next to Nuxt UI's color mode. The tokens follow the `dark` or `light` class the color mode puts on `<html>`, so the color mode switches the theme and remembers it, and a page that forces its color mode keeps its theme. Switch the theme with the color mode, not with the design system's `setTheme` or `toggleTheme`: the `data-theme` they write wins over the class. The head script keeps a theme remembered under the design system's `ws-theme` from winning over the class too.

A `dark` or `light` class, like `data-theme`, also keeps a part of a page in one theme: everything inside it, Nuxt UI's components included, takes that theme. A menu or a select list in such a part opens in it with `:portal="false"` and a `z-index` on its list, as in the gallery: in a portal at the end of the page it takes the page's theme.

On Nuxt, as in `playgrounds/nuxt`:

```ts
// nuxt.config.ts
ui: { theme, fonts: false },             // the system brings its fonts
app: { head: { script: [{ innerHTML: colorModeInitScript }] } },

// app/app.config.ts
export default defineAppConfig({ ui })

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

The package is TypeScript, imported as it is, so a consumer's `tsconfig` sets `allowImportingTsExtensions`. A build step comes with publishing.

## Working on it

You need Node.js 24.12 or later and pnpm. `corepack enable` sets pnpm up.

| Command             | What it does                                                                                                                 |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`          | Starts the gallery                                                                                                           |
| `pnpm dev:vue`      | Starts the Vue page                                                                                                          |
| `pnpm build`        | Builds both playgrounds; the gallery into `playgrounds/nuxt/.output/public`                                                  |
| `pnpm test`         | Unit tests: the config and the colors it builds, the Nuxt UI bridge, the head scripts, the Playwright version `ci.yml` names |
| `pnpm test:browser` | Builds both playgrounds and tests them in a browser                                                                          |
| `pnpm lint`         | Checks the code and the stylesheets                                                                                          |
| `pnpm type-check`   | Type-checks the package and both playgrounds                                                                                 |
| `pnpm format`       | Formats everything                                                                                                           |

## License

[MIT](./LICENSE). Built on [Nuxt UI](https://ui.nuxt.com) and the [Whatsaaaa design system](https://github.com/whatsaaaa/design-system).
