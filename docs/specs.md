# Specs

How ui-vue meets each component spec of the [Whatsaaaa design system](https://github.com/whatsaaaa/design-system). A spec says what every implementation draws alike, and nothing about one implementation, so each keeps its own record next to its parity test. This is ui-vue's. For each spec it records:

- **Kinds and sizes**: the Nuxt UI component and the props that draw each kind and size of the spec.
- **Parts**: where ui-vue draws a part of the spec under another slot than the part's name, as `tests/browser/parts.ts` maps it for the parity test.
- **Deviations**: where ui-vue does not meet the spec yet, and where that shows in this repository.
- **Parity**: whether the gallery passes the parity test, `tests/browser/spec.spec.ts`, and against which versions.

Each spec has a section of its own, whose anchor is the spec's name: [button](#button), [input](#input), [textarea](#textarea), [number-field](#number-field), [select](#select), [select-menu](#select-menu), [checkbox](#checkbox), [radio-group](#radio-group), [modal](#modal), [badge](#badge), [card](#card), [table](#table) and [tabs](#tabs).

## Parity

The parity test holds the gallery's examples of each spec to the spec's values, part by part, in both themes and in forced colors, with the design system's helper, `@whatsaaaa/design-system/testing`. It checks what a part draws: its colors, measures and type. A spec's keys, its accessibility rules and the Lucide names of its icons are left to the implementation: ui-vue's other browser tests, such as `tests/browser/keyboard.spec.ts`, check some of them, and the deviations below were found by reading the theme and Nuxt UI against the rest and checking them in the built gallery.

Last checked on 2026-11-27, against `@whatsaaaa/design-system` 1.1.0 and `@nuxt/ui` 4.13.0:

| Spec                          | Nuxt UI component            | Parity | Deviations |
| ----------------------------- | ---------------------------- | ------ | ---------- |
| [button](#button)             | `UButton`                    | Passes | None       |
| [input](#input)               | `UInput`, `UFormField`       | Passes | 1          |
| [textarea](#textarea)         | `UTextarea`, `UFormField`    | Passes | 1          |
| [number-field](#number-field) | `UInputNumber`, `UFormField` | Passes | 3          |
| [select](#select)             | `USelect`                    | Passes | None       |
| [select-menu](#select-menu)   | `USelectMenu`                | Passes | None       |
| [checkbox](#checkbox)         | `UCheckbox`                  | Passes | 1          |
| [radio-group](#radio-group)   | `URadioGroup`                | Passes | 1          |
| [modal](#modal)               | `UModal`                     | Passes | 1          |
| [badge](#badge)               | `UBadge`                     | Passes | None       |
| [card](#card)                 | `UCard`                      | Passes | 1          |
| [table](#table)               | `UTable`                     | Passes | 2          |
| [tabs](#tabs)                 | `UTabs`                      | Passes | None       |

Every component token a spec's rows name is read by name in the theme, so a change of the design system's component tier reaches ui-vue.

CI runs the parity test with the other browser tests on every pull request that changes more than Markdown. To run it alone, build first:

```sh
pnpm build
pnpm exec playwright test tests/browser/spec.spec.ts --project=nuxt
```

## What every spec shares

- A size is the `size` prop, `md` by default. A field's control takes its own `size`, or else that of the `UFormField` around it, where the gallery passes it.
- A state the pointer or the keyboard draws, hover, active or focus, has no prop. `disabled` and `loading` are props of the component.
- A field, a checkbox or a radio group in error has its `error` on the `UFormField` around it, which draws the error and gives the control its invalid edge. `required` on the `UFormField`, or on a checkbox or a radio group itself, draws the required mark.
- The gallery marks each example with its id in `data-spec`, as the specs' gallery contract asks, and draws a list or a modal open in place with `open` and `:portal="false"`. An app needs neither.

## Button

`UButton`. Each kind is a color and a variant of Nuxt UI:

| Kind      | Props                                                 |
| --------- | ----------------------------------------------------- |
| primary   | `color="primary" variant="solid"`, Nuxt UI's defaults |
| secondary | `color="neutral" variant="outline"`                   |
| ghost     | `color="neutral" variant="ghost"`                     |
| quiet     | `color="primary" variant="link"`                      |
| danger    | `color="error" variant="outline"`                     |

Sizes: `size`, `xs` to `xl`. Icons: `icon` or `leading-icon`, and `trailing-icon`.

**Parts:** `root` is `base`, `leading-icon` is `leadingIcon` and `trailing-icon` is `trailingIcon`.

**Deviations:** none.

**Parity:** passes.

## Input

`UInput` inside a `UFormField`, which draws the label, the required mark, the help and the error.

| Kind    | Props                                  |
| ------- | -------------------------------------- |
| outline | `variant="outline"`, Nuxt UI's default |

Sizes: `size` on the `UFormField`, or on the `UInput`. Icons: `icon` or `leading-icon`, and `trailing-icon`. The label, `help`, `error` and `required` are props of the `UFormField`.

**Parts:** `root` is `base`, `placeholder` is `base::placeholder`, `leading-icon` is `leadingIcon`, `trailing-icon` is `trailingIcon`, `required` is `label::after` and `error-icon` is `error::before`. `label`, `help` and `error` are the form field's slots of those names.

**Deviations:**

- The error icon is the design system's own danger glyph, `--ws-icon-danger`, drawn as a mask before the error, where the spec names Lucide's `octagon-alert`. Both are an octagon with an exclamation mark, at the icon size and in the error icon's color, which the parity test checks; the glyph is not Lucide's. Shows in the form field's theme, `packages/ui-vue/src/theme/form-field.ts`, and in the part map, `'error-icon': 'error::before'`.

**Parity:** passes.

## Textarea

`UTextarea` inside a `UFormField`, as the [input](#input) is: the input's edge, value and form field, with rows of text in place of its one line.

| Kind    | Props                                  |
| ------- | -------------------------------------- |
| outline | `variant="outline"`, Nuxt UI's default |

Sizes: `size` on the `UFormField`, or on the `UTextarea`. Its height is its rows, `rows`, three by Nuxt UI's default; `autoresize` grows it with its text, as the spec lets an implementation. The spec draws no icons and no loading state, so the gallery passes neither: Nuxt UI's `icon` and `loading` still work, outside the spec, with an icon where the input's is.

**Parts:** `root` is `base`, `placeholder` is `base::placeholder`, `required` is `label::after` and `error-icon` is `error::before`, as the input's. `label`, `help` and `error` are the form field's slots of those names.

**Deviations:**

- The error icon is the design system's danger glyph, not Lucide's `octagon-alert`, as the [input](#input)'s.

**Parity:** passes.

## Number field

`UInputNumber` inside a `UFormField`, as the [input](#input) is, with Nuxt UI's two step buttons on either side of the value: its default `orientation="horizontal"`.

| Kind    | Props                                  |
| ------- | -------------------------------------- |
| outline | `variant="outline"`, Nuxt UI's default |

Sizes: `size` on the `UFormField`, or on the `UInputNumber`. The range is `min`, `max` and `step`. The step buttons are Nuxt UI's link buttons with Lucide's `minus` and `plus`, as the spec names them, which Reka UI keeps out of the Tab order and disables at a limit; the theme draws them through the `decrement` and `increment` slots around them, so they keep their look when an app passes its own props to `decrement` or `increment`. The field is Reka UI's text input with the role `spinbutton`, one of the two the spec allows. Two step buttons stacked at the end, `orientation="vertical"`, keep Nuxt UI's look, outside the spec.

**Parts:** `root` is `base`, the input, `placeholder` is `base::placeholder`, `required` is `label::after` and `error-icon` is `error::before`, as the input's. A step button is the button inside its slot and its icon that button's icon: `decrement` is `decrement base`, `decrement-icon` is `decrement leadingIcon`, `increment` is `increment base` and `increment-icon` is `increment leadingIcon`. `label`, `help` and `error` are the form field's slots of those names.

**Deviations:**

- The step buttons' names do not say which field they step unless the app names them. Nuxt UI names them Decrement and Increment, where the spec's names say what each does to which field, such as Decrease Tickets and Increase Tickets. An app passes the names, `:decrement="{ 'aria-label': 'Decrease Tickets' }"` and `:increment="{ 'aria-label': 'Increase Tickets' }"`, as the gallery does; Nuxt UI's type of those props leaves out a button's attributes, so TypeScript takes them only with a cast. Shows in the README, under the four things Nuxt UI leaves to the app.
- The field's edge does not take its hover color while the pointer is on a step button. The hover is the input's, and the buttons lie over it, inside the edge, where the spec's hover is the pointer anywhere on the field. Not recorded elsewhere in this repository yet.
- The error icon is the design system's danger glyph, not Lucide's `octagon-alert`, as the [input](#input)'s.

**Parity:** passes.

## Select

`USelect` inside a `UFormField`, which draws the label, the help and the error, as the input spec has them.

| Kind    | Props                                  |
| ------- | -------------------------------------- |
| outline | `variant="outline"`, Nuxt UI's default |

Sizes: `size` on the `UFormField`, or on the `USelect`. A leading icon is `icon`; the chevron, the tick and the loading icon are Nuxt UI's, Lucide's `chevron-down`, `check` and `loader-circle`, as the spec names them. A group is an item of `type: 'label'` before its options, and the line between two groups an item of `type: 'separator'`.

**Parts:** the trigger's slots, not those of the same name in its open list: `root` is `base`, `placeholder` is `base placeholder`, `leading-icon` is `base leadingIcon` and `trailing-icon` is `base trailingIcon`. In the list, `group-label` is `content label`, `item-highlight` is `item::before` and `item-indicator` is `itemTrailingIcon`. `content`, `group`, `item` and `separator` are the slots of those names.

**Deviations:** none.

**Parity:** passes.

## Select menu

`USelectMenu` inside a `UFormField`, drawn as the [select](#select) is, with a search at the top of its list.

| Kind    | Props                                  |
| ------- | -------------------------------------- |
| outline | `variant="outline"`, Nuxt UI's default |

Sizes, icons and groups as the select's. The search draws Lucide's `search` icon: ui-vue gives the select menu `searchInput: { icon: 'i-lucide-search' }` by default. An app that passes its own `searchInput`, for example for its placeholder, passes `icon: 'i-lucide-search'` with it, as the README says: Nuxt UI takes a passed `searchInput` in place of the default.

**Parts:** those of the select, and `search` is `input` and `search-icon` is `input leadingIcon`.

**Deviations:** none.

**Parity:** passes.

## Checkbox

`UCheckbox`, inside a `UFormField` for its error.

| Kind | Props                               |
| ---- | ----------------------------------- |
| list | `variant="list"`, Nuxt UI's default |

Sizes: `size`. Checked is `:model-value="true"`, indeterminate `model-value="indeterminate"`. The label is `label`, the description `description`, and `required` draws the required mark.

**Parts:** `control` is `base`, `required` is `label::after` and `error-icon` is `error::before`, the error of the `UFormField` around it. `root`, `indicator`, `icon`, `label`, `description` and `error` are the slots of those names.

**Deviations:**

- The error icon is the design system's danger glyph, not Lucide's `octagon-alert`, as the [input](#input)'s: the error is the form field's.

**Parity:** passes.

## Radio group

`URadioGroup`, inside a `UFormField` for its error.

| Kind | Props                                                                                                            |
| ---- | ---------------------------------------------------------------------------------------------------------------- |
| list | `variant="list"`, Nuxt UI's default, its options one under the other or in a row with `orientation="horizontal"` |

Sizes: `size`. The legend is `legend`, the options `items`, and `required` draws the required mark after the legend.

**Parts:** `required` is `legend::after`, `control` is `base`, `dot` is `indicator::after` and `error-icon` is `error::before`. `root`, `legend`, `item`, `indicator`, `label`, `description` and `error` are the slots of those names.

**Deviations:**

- The error icon is the design system's danger glyph, not Lucide's `octagon-alert`, as the [input](#input)'s.

**Parity:** passes.

## Modal

`UModal`.

| Kind   | Props                                                    |
| ------ | -------------------------------------------------------- |
| window | Nuxt UI's defaults: not `fullscreen`, with its `overlay` |

One size. The title is `title`, the description `description`, and the body and the footer are the `#body` and `#footer` slots. The close button is Nuxt UI's, named Close, with Lucide's `x`.

**Parts:** every part is the slot of its name.

**Deviations:**

- The window has no `aria-modal`. Reka UI, which Nuxt UI's modal is built on, gives it the role `dialog`, its title and its description, keeps the focus in it, and hides the rest of the page from assistive technology with `aria-hidden`, but sets no `aria-modal`, where the spec's dialog has `aria-modal` true. Not recorded elsewhere in this repository yet.

**Parity:** passes.

## Badge

`UBadge`. The tag is the soft variant, which ui-vue makes the badge's default:

| Kind    | Props                                          |
| ------- | ---------------------------------------------- |
| primary | `color="primary" variant="soft"`, the defaults |
| success | `color="success"`                              |
| info    | `color="info"`                                 |
| warning | `color="warning"`                              |
| danger  | `color="error"`                                |
| neutral | `color="neutral"`                              |
| outline | `color="neutral" variant="outline"`            |

Sizes: `size`, `xs` to `xl`. Icons: `icon` or `leading-icon`, and `trailing-icon`.

**Parts:** `root` is `base`, `leading-icon` is `leadingIcon` and `trailing-icon` is `trailingIcon`.

**Deviations:** none.

**Parity:** passes.

## Card

`UCard`.

| Kind    | Props                                  |
| ------- | -------------------------------------- |
| outline | `variant="outline"`, Nuxt UI's default |

One size. The title is `title` or the `#title` slot, the description `description`, and the body and the footer the default and `#footer` slots.

**Parts:** every part is the slot of its name.

**Deviations:**

- The title is not a heading unless the app makes it one. Nuxt UI draws it in a `div`, where the spec's title is a heading, so that the card is a section of the page's outline. An app names a heading for it, `:as="{ title: 'h3' }"`, or passes one in the `#title` slot, as the gallery does. Shows in the README, under the four things Nuxt UI leaves to the app.

**Parity:** passes.

## Table

`UTable`, with its `data` and `columns`.

| Kind       | Props                                                                                                                                                                                   |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| plain      | `data` and `columns`                                                                                                                                                                    |
| selectable | A first column of a `UCheckbox` in each row, named for the row, and one in the head that chooses every row, with `v-model:row-selection`, as the gallery's `TableSection.vue` builds it |

One size. The loading line is `loading`, in the primary color, Nuxt UI's default `loading-color`; Nuxt UI sets `aria-busy` on the table while it loads. A row is chosen by its checkbox, not by `@select`: with a handler for its rows Nuxt UI makes each row a stop of the Tab key, which the spec's rows are not. The theme draws such a row too, outside the spec.

**Parts:** a row and a cell of the body, not of the head: `tr` is `tbody tr` and `td` is `tbody td`. The loading line is `thead::after`. `root` and `th` are the slots of those names, and `amount` is the app's own element, below.

**Deviations:**

- An amount has no slot of Nuxt UI's, so the theme cannot draw it at the end of its column in figures of one width. The app gives its column `meta: { class: { th: 'text-end', td: 'text-end tabular-nums' } }`; the gallery also draws each amount in an element with `data-slot="amount"`, which the parity test finds. Shows in the README, under the four things Nuxt UI leaves to the app.
- A table wider than its frame cannot take the focus as its frame while a control is in it, such as the checkboxes of a selectable table, so the arrow keys cannot scroll it. Neither Nuxt UI's table nor the theme gives the frame a `tabindex`, and Chromium makes a frame that scrolls a stop of the Tab key only when nothing in it takes the focus. The theme draws the frame's focus ring, so an app can pass `tabindex="0"` to `UTable`, whose frame takes the attribute. Not recorded elsewhere in this repository yet.

**Parity:** passes.

## Tabs

`UTabs`. Tabs are links unless they ask for a pill: ui-vue makes `link` the default, where Nuxt UI's is `pill`.

| Kind | Props                              |
| ---- | ---------------------------------- |
| link | `variant="link"`, ui-vue's default |

Sizes: `size`, `xs` to `xl`. The tabs are `items`, each with its `label`, `icon` and, for a disabled tab, `disabled: true`; the current tab is `default-value` or `v-model`. Pill tabs, `variant="pill"`, and tabs in a column keep working outside the spec.

**Parts:** `leading-icon` is `leadingIcon`. `root`, `list`, `trigger`, `indicator`, `label` and `content` are the slots of those names.

**Deviations:** none.

**Parity:** passes.

## Keeping it current

A change to the theme, the gallery or `tests/browser/parts.ts` that changes what a section here says changes this page in the same pull request. So does an update of `@whatsaaaa/design-system` or `@nuxt/ui`: the parity test then runs against the new versions, and the versions and date above move with it. A deviation that is fixed leaves the page.
