---
'@whatsaaaa/ui-vue': patch
---

The stylesheet raises the floor for every Nuxt UI component, themed or not.

- In forced colors, an icon drawn as a mask is painted in the text color, where forced colors left it in the page color, and an edge drawn with `ring` is an outline of the ring's width, where they dropped it with the box shadow.
- `--ui-text-dimmed` is the secondary text color: the faint one was under 4.5:1 on the page, and Nuxt UI sets text in it, such as a timeline's dates and a command palette's suffix.
