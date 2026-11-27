---
'@whatsaaaa/ui-vue': patch
---

`UInputDate` and `UInputTime` fit each segment to its value, in place of a width of two figures, four for a year, in which Nuxt UI centers it. The room on each side of every slash and colon, of a range's dash and of the focus tint is now the same, whatever the value: 9:30 AM and 5/10/2027 are spaced evenly, where the 9 and the 5 stood half a figure off the literal after them. The figures keep one width, so a value moves the text after it only as a second figure is typed. An empty segment's placeholder fits its letters or dashes the same way. The select's icons inside its edge take their paddings from the definition the tag field, the date and time fields and the input menu take them from, so they cannot drift apart; they do not move.
