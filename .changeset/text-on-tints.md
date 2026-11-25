---
'@whatsaaaa/ui-vue': patch
---

Text on a tint is in the text color, which keeps it over 4.5:1 in both themes.

- The line about a checked card's option, in the checkbox's card variant and the radio group's card and table variants, is in the text color, where the secondary text color was under 4.5:1 on the interactive tint in the dark theme. A disabled card keeps its faint line.
- The text of Nuxt UI's prose callouts, the note, the tip, the warning and the caution, is in the text color, where a shade of the callout's color was under 4.5:1 on its tint. The icon, the edge and the tint keep the callout's color.
- To do so, `text-{success,info,warning,error,primary}-300` and `-600` are the text color in every app that imports `@whatsaaaa/ui-vue/index.css`, not only in Nuxt UI's callouts, the one place Nuxt UI sets text in them: an app's own `text-error-600` is the text color too. The other utilities and shades of those colors keep the color's shade, as `bg-error-600`, `border-error-600` and `text-error-700` do.
