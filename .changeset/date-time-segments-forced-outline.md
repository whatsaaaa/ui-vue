---
'@whatsaaaa/ui-vue': patch
---

In forced colors, a segment of `UInputDate` and `UInputTime` draws no outline, where Nuxt UI's `outline-hidden` drew one in the text color around every segment and every slash and colon, with nothing focused. The segment with the focus stays in the selection colors, Highlight under HighlightText.
