---
'@whatsaaaa/ui-vue': minor
---

`UTextarea` and `UInputNumber` follow the design system's new `textarea` and `number-field` specs, and the package takes `@whatsaaaa/design-system` `^1.1.0` as its peer, the release that brings them. A text area is the input's field with rows of text and no height of its own: its value is the field's text style at each size, and one row is as tall as the input of its size. A number field is the input's field at the control height, its value in figures of one width, with its two step buttons inside the edge where the input draws its icons, their icons in the field's icon color and faint where a button is disabled. Both keep an edge in forced colors. Nuxt UI names the step buttons Decrement and Increment: pass each a name that says which field it steps, `:decrement="{ 'aria-label': 'Decrease Tickets' }"`, as the spec asks.
