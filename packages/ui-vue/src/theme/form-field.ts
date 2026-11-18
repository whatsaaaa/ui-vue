/*
 * The form field of the design system's input spec: a mono label, the control, then the help and
 * the error under it, six pixels apart. The error is a word with the danger icon before it, at
 * the icon size and centered on its first line, never a color alone, and in forced colors the
 * icon takes the text's color. The required mark is the system's red, which reads at 4.5:1 in
 * both themes. Hints go under the field: the help text, not the hint beside the label. The colors
 * read the component tier by name, --ws-field-*.
 */
export default {
  slots: {
    label: 'font-mono font-normal text-(--ws-field-label-text)',
    description: 'text-text-secondary font-sans',
    hint: 'text-text-secondary font-sans',
    help: 'mt-1.5 text-(--ws-field-help-text) font-sans',
    error:
      "mt-1.5 flex gap-1.5 font-sans font-(--ws-field-error-font-weight) text-(--ws-field-error-text) before:shrink-0 before:size-icon before:mt-[calc((1lh-var(--ws-size-icon))/2)] before:text-(--ws-field-error-icon) before:bg-current before:content-[''] before:mask-(--ws-icon-danger) before:mask-center before:mask-no-repeat before:mask-size-(--ws-size-icon) forced-colors:before:bg-[CanvasText]",
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
      true: { label: "after:content-['*'] after:ms-0.5 after:text-(--ws-field-required-text)" },
    },
    orientation: {
      vertical: { container: 'mt-1.5' },
    },
  },
}
