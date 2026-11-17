/**
 * What the component themes share. Tailwind finds the classes it builds by reading the
 * source, so every class here and in the themes is written out whole: none is put together
 * from parts, and each color has its own line.
 *
 * Every slot is a string, merged onto Nuxt UI's own classes, where a class of the same kind
 * replaces Nuxt UI's: font-semibold its font-medium, disabled:opacity-100 its
 * disabled:opacity-75. Nuxt UI can also take a function that replaces a slot whole, but its
 * Vite plugin writes the config as JSON, so on Vue the function is lost.
 */

/** The colors of the theme. Nuxt UI's secondary has no role in the design system. */
export const colors = ['primary', 'success', 'info', 'warning', 'error'] as const

export type Color = (typeof colors)[number] | 'neutral'

/** One class list for each color, neutral included. */
export type ByColor = Record<Color, string>

/**
 * The design system's focus ring, as base.css draws it: two pixels of the interactive color,
 * three pixels out. Nuxt UI tints the outline with the component's color and widens it to
 * three pixels; these replace that.
 */
export const focusRing =
  'outline-interactive focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-3'

/*
 * Forced colors, Windows' contrast themes, take box shadows away and paint every background in
 * the page color. Nuxt UI draws the edge of a part with ring, a box shadow, and an icon as a mask
 * over its background, so in forced colors the edges, the icons and the fill of a checked control
 * are gone. These draw them again in the system's colors, and only in forced colors.
 */

/** The edge of a control: a border in the button border color, gray when it is disabled. */
export const forcedControlEdge =
  'forced-colors:border forced-colors:border-[ButtonBorder] forced-colors:disabled:border-[GrayText] forced-colors:aria-disabled:border-[GrayText]'

/** The edge of a panel or a tag: a border in the text color. */
export const forcedEdge = 'forced-colors:border forced-colors:border-[CanvasText]'

/**
 * A checked control's fill: the selection's colors, gray in a disabled control, kept as they are,
 * so that its mark, painted in the text color, keeps the fill's text color.
 */
export const forcedChecked =
  'forced-colors:bg-[Highlight] forced-colors:text-[HighlightText] forced-colors:forced-color-adjust-none forced-colors:in-disabled:bg-[GrayText] forced-colors:in-disabled:text-[Canvas]'

/**
 * An icon drawn as a mask, in the text color, gray in a disabled control as its label is. An icon
 * drawn as an SVG, as Nuxt UI draws them on Vue, already takes the text color, and a fill behind
 * it would hide it.
 */
export const forcedIcon =
  'forced-colors:not-[svg]:bg-[CanvasText] forced-colors:in-disabled:not-[svg]:bg-[GrayText] forced-colors:in-aria-disabled:not-[svg]:bg-[GrayText]'

/**
 * Color changes on hover and focus, in the fast duration, unless the reader asks for less motion.
 * Nuxt UI puts transition-colors on its controls; this adds it where it does not, and takes it
 * off for a reader who asks for less motion.
 */
export const transition = 'transition-colors motion-reduce:transition-none'

/**
 * Text on a solid fill. The fill of a status is its text color, which reads on the page in both
 * themes, so the page color reads on it: in the light theme every status fill is the text
 * color, and the word on it carries the status. For danger that is the brand fill and the text
 * on it, a pair the design system checks.
 */
export const solid: ByColor = {
  primary: 'bg-interactive text-on-interactive',
  success: 'bg-tip-text text-bg',
  info: 'bg-note-text text-bg',
  warning: 'bg-warning-text text-bg',
  error: 'bg-danger-text text-bg',
  neutral: 'bg-text text-bg',
}

/** A tint of the color under its text color: the tag, and the status blocks of the system. */
export const tint: ByColor = {
  primary: 'bg-tag-bg text-tag-text',
  success: 'bg-tip-tint text-tip-text',
  info: 'bg-note-tint text-note-text',
  warning: 'bg-warning-tint text-warning-text',
  error: 'bg-danger-tint text-danger-text',
  neutral: 'bg-raised text-text',
}

/** The color as text on the page. A status takes its text color, which can differ from it. */
export const text: ByColor = {
  primary: 'text-interactive',
  success: 'text-tip-text',
  info: 'text-note-text',
  warning: 'text-warning-text',
  error: 'text-danger-text',
  neutral: 'text-text',
}

/** The color as an outline drawn inside the box, which takes no room. */
export const ring: ByColor = {
  primary: 'ring-interactive',
  success: 'ring-tip',
  info: 'ring-note',
  warning: 'ring-warning',
  error: 'ring-danger',
  neutral: 'ring-field-border',
}

/**
 * One compound variant for each color, from a class list for each. With a slot the classes go
 * to that slot, without one to the component's first.
 */
export function byColor<Conditions extends object>(
  classes: ByColor,
  conditions: Conditions,
  slot?: string,
): (Conditions & { color: Color; class: string | Record<string, string> })[] {
  return (Object.keys(classes) as Color[]).map((color) => ({
    color,
    ...conditions,
    class: slot ? { [slot]: classes[color] } : classes[color],
  }))
}
