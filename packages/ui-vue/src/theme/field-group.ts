/*
 * Controls joined in a row or a column: each one's edge lies over the one before it, by the
 * control's border width, so that where two meet their edges are one line, at every size and in
 * forced colors, which draw the same edge. Nuxt UI squares the corners where they meet. A field
 * in a color or under the pointer comes over the controls beside it, so that the line is its
 * edge, and a control with the focus over those too, so that its ring shows whole: field.ts
 * raises a field, button.ts a button.
 */
export default {
  variants: {
    orientation: {
      horizontal: '-space-x-(--ws-control-border-width-rest)',
      vertical: '-space-y-(--ws-control-border-width-rest)',
    },
  },
}
