/*
 * The field of the sample apps: a mono label, the control, then the hint and the error under
 * it, six pixels apart. The error is a word with the danger icon before it, never a color alone,
 * and in forced colors the icon takes the text's color. The required mark is the brand color.
 * Hints go under the field: the help text, not the hint beside the label.
 */
export default {
  slots: {
    label: 'font-mono font-normal text-text',
    description: 'text-text-secondary font-sans',
    hint: 'text-text-secondary font-sans',
    help: 'mt-1.5 text-text-secondary font-sans',
    error:
      "mt-1.5 flex gap-1.5 font-sans font-medium text-danger-text before:shrink-0 before:w-4 before:h-lh before:bg-danger before:content-[''] before:mask-(--ws-icon-danger) before:mask-center before:mask-no-repeat before:mask-size-[1rem] forced-colors:before:bg-[CanvasText]",
  },
  variants: {
    size: {
      xs: { root: 'text-body-sm', label: 'text-label-sm' },
      sm: { root: 'text-body-sm', label: 'text-label-sm' },
      md: { root: 'text-body-sm', label: 'text-label' },
      lg: { root: 'text-body-sm', label: 'text-label' },
      xl: { root: 'text-body', label: 'text-label' },
    },
    required: {
      true: { label: "after:content-['*'] after:ms-0.5 after:text-brand" },
    },
    orientation: {
      vertical: { container: 'mt-1.5' },
    },
  },
}
