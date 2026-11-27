# @whatsaaaa/ui-vue

## 0.2.1

### Patch Changes

- [#62](https://github.com/whatsaaaa/ui-vue/pull/62) [`5529c11`](https://github.com/whatsaaaa/ui-vue/commit/5529c118a225a7f9b7790ca5ee473634e87ebfe2) Thanks [@whatsaaaa](https://github.com/whatsaaaa)! - `UInputDate` and `UInputTime` fit each segment to its value, in place of a width of two figures, four for a year, in which Nuxt UI centers it. The room on each side of every slash and colon, of a range's dash and of the focus tint is now the same, whatever the value: 9:30 AM and 5/10/2027 are spaced evenly, where the 9 and the 5 stood half a figure off the literal after them. The figures keep one width, so a value moves the text after it only as a second figure is typed. An empty segment's placeholder fits its letters or dashes the same way. The select's icons inside its edge take their paddings from the definition the tag field, the date and time fields and the input menu take them from, so they cannot drift apart; they do not move.

- [#64](https://github.com/whatsaaaa/ui-vue/pull/64) [`4cf2860`](https://github.com/whatsaaaa/ui-vue/commit/4cf2860788182ac0b13a00d2b4efba5a99487c94) Thanks [@whatsaaaa](https://github.com/whatsaaaa)! - In forced colors, a segment of `UInputDate` and `UInputTime` draws no outline, where Nuxt UI's `outline-hidden` drew one in the text color around every segment and every slash and colon, with nothing focused. The segment with the focus stays in the selection colors, Highlight under HighlightText.

## 0.2.0

### Minor Changes

- [#61](https://github.com/whatsaaaa/ui-vue/pull/61) [`d2d5138`](https://github.com/whatsaaaa/ui-vue/commit/d2d51380dbb9be891ba671b40e3fb65b3348de07) Thanks [@whatsaaaa](https://github.com/whatsaaaa)! - The pin input, input tags, input menu, input date, input time, file upload and field group are restyled on the design system's tiers, at level 2. Each field has the control's heights, the field's edge as a border, which forced colors keep, the system's focus ring, its text styles in place of Tailwind's sizes, and no shadow. A pin input's cells are squares of the control height, 40 px at md. A tag field's and an input menu's tags are the system's neutral tag, the one the arrow keys are on ringed. The input menu's list is the select menu's. A date field's segment with the focus is on the interactive tint. A file upload's drop area has a solid edge, as the system has no dashed one. In a field group the edges of two controls lie over each other as one line at every size, a field under the pointer comes over its neighbours and one in a color over those too, the input, number field, select and select menu in a group too, and a field or a button with the focus comes over them all. A file upload drawn as a button is named in its `#leading` slot, as the README shows.

- [#58](https://github.com/whatsaaaa/ui-vue/pull/58) [`af2607e`](https://github.com/whatsaaaa/ui-vue/commit/af2607ef5284e9366b9b3a07c0560fd7dffe7eba) Thanks [@whatsaaaa](https://github.com/whatsaaaa)! - `UTextarea` and `UInputNumber` follow the design system's new `textarea` and `number-field` specs, and the package takes `@whatsaaaa/design-system` `^1.1.0` as its peer, the release that brings them. A text area is the input's field with rows of text and no height of its own: its value is the field's text style at each size, and one row is as tall as the input of its size. A number field is the input's field at the control height, its value in figures of one width, with its two step buttons inside the edge where the input draws its icons, their icons in the field's icon color and faint where a button is disabled. Both keep an edge in forced colors. Nuxt UI names the step buttons Decrement and Increment: pass each a name that says which field it steps, `:decrement="{ 'aria-label': 'Decrease Tickets' }"`, as the spec asks.

## 0.1.0

### Minor Changes

- [#46](https://github.com/whatsaaaa/ui-vue/pull/46) [`920d625`](https://github.com/whatsaaaa/ui-vue/commit/920d6250ef3174410addd92b91b648c697cc9751) Thanks [@whatsaaaa](https://github.com/whatsaaaa)! - The package follows the design system 0.15.0, and takes `@whatsaaaa/design-system` `^0.15.0` as its peer: an app updates both together.

  - The themes read the component tier's colors by their new names, which end in a state, such as `--ws-field-bg-rest` for `--ws-field-bg`. They draw the same colors.
  - The line between two groups of a select's or a select menu's list is a border, so it stays in forced colors, such as a Windows contrast theme, where the fill it was went away. It is still one pixel of the border color.
  - A tag in a chosen table row reads at 4.5:1 or more in dark, where it read at 3.9:1, with the design system's opaque tints: the table passes level 1.

- [#50](https://github.com/whatsaaaa/ui-vue/pull/50) [`e706617`](https://github.com/whatsaaaa/ui-vue/commit/e706617903baddaf6a9daa5e73fac91401ede66f) Thanks [@whatsaaaa](https://github.com/whatsaaaa)! - The package takes `@whatsaaaa/design-system` `^1.0.0` as its peer: an app on the design system 0.15 moves to 1.0.0 with it. The design system 1.0.0 renames or removes nothing, and every component meets its spec, with no change to how it looks. From 1.0.0 on, the design system's minors and patches stay within the peer range.

- [#41](https://github.com/whatsaaaa/ui-vue/pull/41) [`ceeea8a`](https://github.com/whatsaaaa/ui-vue/commit/ceeea8abb41c2ce4bed7f96455a4f1deaeb2bf42) Thanks [@whatsaaaa](https://github.com/whatsaaaa)! - The first release on npm: Nuxt UI themed with the Whatsaaaa design system.

  - `theme` and `ui` from `@whatsaaaa/ui-vue`: Nuxt UI's module options and the components' config, for button, badge, input, select, select menu, checkbox, radio group, card, modal, table and tabs.
  - `@whatsaaaa/ui-vue/index.css`: the app's whole stylesheet. It names the package's themes as a source of classes itself, so an app adds no `@source` for them.
  - `colorModeInitScript` and `vueColorModeInitScript` from `@whatsaaaa/ui-vue/color-mode`: the head scripts for Nuxt and for Vue.

  It ships compiled JavaScript with type declarations, and works with Nuxt UI `~4.13.0` and the design system `^0.15.0`: one minor of each.

### Patch Changes

- [#54](https://github.com/whatsaaaa/ui-vue/pull/54) [`ca1642c`](https://github.com/whatsaaaa/ui-vue/commit/ca1642c250ab0cd6406a0034c566537578351bb3) Thanks [@whatsaaaa](https://github.com/whatsaaaa)! - A page with the checkbox's card variant or the radio group's card and table variants no longer has its whole style worked out again on every change. The line about a checked card's option takes the text color from a custom property the card sets, `--choice-description`, where a rule from the card down to the line held a `:has()` that Chrome restyled the whole page for. On the gallery a style recalculation restyles about 100 elements again, where it restyled all 3,800. The line looks as it did: the text color on a checked card that is not disabled, the faint color on a disabled one.

- [#49](https://github.com/whatsaaaa/ui-vue/pull/49) [`025d621`](https://github.com/whatsaaaa/ui-vue/commit/025d621b1ba20534b251b8f148105b1fc88168dc) Thanks [@whatsaaaa](https://github.com/whatsaaaa)! - The package takes `@whatsaaaa/design-system` `^0.15.1` as its peer, the release whose parity helper also checks, in forced colors, a line on one side of a part only, such as the select's group separator and the lines of the tabs and the table. Every component meets its spec under that check, with no change to how it looks.

- [#44](https://github.com/whatsaaaa/ui-vue/pull/44) [`8b5b9f3`](https://github.com/whatsaaaa/ui-vue/commit/8b5b9f3138894d40fa56d6dcacf76bb2520cc89c) Thanks [@whatsaaaa](https://github.com/whatsaaaa)! - The stylesheet raises the floor for every Nuxt UI component, themed or not.

  - In forced colors, an icon drawn as a mask is painted in the text color, where forced colors left it in the page color, and an edge drawn with `ring` is an outline of the ring's width, where they dropped it with the box shadow.
  - `--ui-text-dimmed` is the secondary text color: the faint one was under 4.5:1 on the page, and Nuxt UI sets text in it, such as a timeline's dates and a command palette's suffix.

- [#43](https://github.com/whatsaaaa/ui-vue/pull/43) [`09df947`](https://github.com/whatsaaaa/ui-vue/commit/09df94701be0b9320a0b761bdeeb71ff0b2d2ec1) Thanks [@whatsaaaa](https://github.com/whatsaaaa)! - A pinned table cell keeps its row's focus ring, in both themes and in forced colors, and a chosen row's focus ring shows in forced colors.

- [#48](https://github.com/whatsaaaa/ui-vue/pull/48) [`0007a3f`](https://github.com/whatsaaaa/ui-vue/commit/0007a3fdb3c6a995ce8f7ff0d9a8b014a643d64d) Thanks [@whatsaaaa](https://github.com/whatsaaaa)! - In forced colors, the line under a chosen table row over a row that is not chosen is in the text color, as the line under every other row is, where it took the row's HighlightText, the page's color, and vanished. Between two chosen rows it stays HighlightText, on their Highlight.

- [#51](https://github.com/whatsaaaa/ui-vue/pull/51) [`10a5563`](https://github.com/whatsaaaa/ui-vue/commit/10a5563ad1465ff6674996fd26bb1884142455ff) Thanks [@whatsaaaa](https://github.com/whatsaaaa)! - Text on a tint is in the text color, which keeps it over 4.5:1 in both themes.

  - The line about a checked card's option, in the checkbox's card variant and the radio group's card and table variants, is in the text color, where the secondary text color was under 4.5:1 on the interactive tint in the dark theme. A disabled card keeps its faint line.
  - The text of Nuxt UI's prose callouts, the note, the tip, the warning and the caution, is in the text color, where a shade of the callout's color was under 4.5:1 on its tint. The icon, the edge and the tint keep the callout's color.
  - To do so, `text-{success,info,warning,error,primary}-300` and `-600` are the text color in every app that imports `@whatsaaaa/ui-vue/index.css`, not only in Nuxt UI's callouts, the one place Nuxt UI sets text in them: an app's own `text-error-600` is the text color too. The other utilities and shades of those colors keep the color's shade, as `bg-error-600`, `border-error-600` and `text-error-700` do.
