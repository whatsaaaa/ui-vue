# @whatsaaaa/ui-vue

## 0.1.0

### Minor Changes

- [#41](https://github.com/whatsaaaa/ui-vue/pull/41) [`ceeea8a`](https://github.com/whatsaaaa/ui-vue/commit/ceeea8abb41c2ce4bed7f96455a4f1deaeb2bf42) Thanks [@whatsaaaa](https://github.com/whatsaaaa)! - The first release on npm: Nuxt UI themed with the Whatsaaaa design system.

  - `theme` and `ui` from `@whatsaaaa/ui-vue`: Nuxt UI's module options and the components' config, for button, badge, input, select, select menu, checkbox, radio group, card, modal, table and tabs.
  - `@whatsaaaa/ui-vue/index.css`: the app's whole stylesheet. It names the package's themes as a source of classes itself, so an app adds no `@source` for them.
  - `colorModeInitScript` and `vueColorModeInitScript` from `@whatsaaaa/ui-vue/color-mode`: the head scripts for Nuxt and for Vue.

  It ships compiled JavaScript with type declarations, and works with Nuxt UI `~4.13.0` and the design system `^0.14.0`: one minor of each.

### Patch Changes

- [#44](https://github.com/whatsaaaa/ui-vue/pull/44) [`8b5b9f3`](https://github.com/whatsaaaa/ui-vue/commit/8b5b9f3138894d40fa56d6dcacf76bb2520cc89c) Thanks [@whatsaaaa](https://github.com/whatsaaaa)! - The stylesheet raises the floor for every Nuxt UI component, themed or not.

  - In forced colors, an icon drawn as a mask is painted in the text color, where forced colors left it in the page color, and an edge drawn with `ring` is an outline of the ring's width, where they dropped it with the box shadow.
  - `--ui-text-dimmed` is the secondary text color: the faint one was under 4.5:1 on the page, and Nuxt UI sets text in it, such as a timeline's dates and a command palette's suffix.

- [#43](https://github.com/whatsaaaa/ui-vue/pull/43) [`09df947`](https://github.com/whatsaaaa/ui-vue/commit/09df94701be0b9320a0b761bdeeb71ff0b2d2ec1) Thanks [@whatsaaaa](https://github.com/whatsaaaa)! - A pinned table cell keeps its row's focus ring, in both themes and in forced colors, and a chosen row's focus ring shows in forced colors.
