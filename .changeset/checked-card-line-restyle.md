---
'@whatsaaaa/ui-vue': patch
---

A page with the checkbox's card variant or the radio group's card and table variants no longer has its whole style worked out again on every change. The line about a checked card's option takes the text color from a custom property the card sets, `--choice-description`, where a rule from the card down to the line held a `:has()` that Chrome restyled the whole page for. On the gallery a style recalculation restyles about 100 elements again, where it restyled all 3,800. The line looks as it did: the text color on a checked card that is not disabled, the faint color on a disabled one.
