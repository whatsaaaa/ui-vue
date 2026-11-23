---
'@whatsaaaa/ui-vue': minor
---

The package follows the design system 0.15.0, and takes `@whatsaaaa/design-system` `^0.15.0` as its peer: an app updates both together.

- The themes read the component tier's colors by their new names, which end in a state, such as `--ws-field-bg-rest` for `--ws-field-bg`. They draw the same colors.
- The line between two groups of a select's or a select menu's list is a border, so it stays in forced colors, such as a Windows contrast theme, where the fill it was went away. It is still one pixel of the border color.
- A tag in a chosen table row reads at 4.5:1 or more in dark, where it read at 3.9:1, with the design system's opaque tints: the table passes level 1.
