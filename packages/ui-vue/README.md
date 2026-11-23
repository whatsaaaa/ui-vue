<img src="https://raw.githubusercontent.com/whatsaaaa/ui-vue/main/.github/assets/readme-header.svg" alt="whatsaaaa" width="100%" />

# @whatsaaaa/ui-vue

[Nuxt UI](https://ui.nuxt.com) themed with the [Whatsaaaa design system](https://github.com/whatsaaaa/design-system), for Vue and Nuxt. A trial: ten core components (button, badge, input, select and select menu, checkbox, radio group, card, modal, table, tabs) take the system's terminal look through Nuxt UI's central config, in both themes.

## Install

```sh
pnpm add @whatsaaaa/ui-vue '@whatsaaaa/design-system@^0.15.0' '@nuxt/ui@~4.13.0' tailwindcss
```

The versions are the package's peer ranges: a release works with one minor of Nuxt UI and, until the design system's 1.0.0, one minor of it.

The package brings three things:

- **`theme` and `ui`** from `@whatsaaaa/ui-vue`: Nuxt UI's module options and the components' config.
- **`@whatsaaaa/ui-vue/index.css`**, the app's whole stylesheet, imported alone and first.
- **`colorModeInitScript` and `vueColorModeInitScript`** from `@whatsaaaa/ui-vue/color-mode`: the head script the design system's theme needs next to Nuxt UI's color mode, on Nuxt and on Vue.

The [repository's README](https://github.com/whatsaaaa/ui-vue#use-it) shows the setup on Nuxt and on Vue.

## License

[MIT](https://github.com/whatsaaaa/ui-vue/blob/main/LICENSE). Built on [Nuxt UI](https://ui.nuxt.com) and the [Whatsaaaa design system](https://github.com/whatsaaaa/design-system).
