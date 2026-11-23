/*
 * Where ui-vue draws each part of the design system's component specs, for the parity test in
 * spec.spec.ts. A spec names its parts and nothing about an implementation, so ui-vue keeps its
 * own map of each and passes it to the design system's testing helper. A part a map does not name
 * is drawn by the Nuxt UI slot of its own name, the `data-slot` of the same word. A value is a
 * slot, a slot and a pseudo-element of it, or a slot inside another. A map that names a part its
 * spec does not have fails the test, so a part a release of the design system renames is not left
 * unchecked.
 */

export const parts = {
  badge: { root: 'base', 'leading-icon': 'leadingIcon', 'trailing-icon': 'trailingIcon' },
  button: { root: 'base', 'leading-icon': 'leadingIcon', 'trailing-icon': 'trailingIcon' },
  card: {},
  // the box the check is drawn in, the required mark after the label's words, and the error's
  // icon before the error's
  checkbox: { control: 'base', required: 'label::after', 'error-icon': 'error::before' },
  input: {
    root: 'base',
    placeholder: 'base::placeholder',
    'leading-icon': 'leadingIcon',
    'trailing-icon': 'trailingIcon',
    required: 'label::after',
    'error-icon': 'error::before',
  },
  modal: {},
  'radio-group': {
    required: 'legend::after',
    control: 'base',
    dot: 'indicator::after',
    'error-icon': 'error::before',
  },
  // the trigger's own slots, not those of the same name in the open list
  select: {
    root: 'base',
    placeholder: 'base placeholder',
    'leading-icon': 'base leadingIcon',
    'trailing-icon': 'base trailingIcon',
    'group-label': 'content label',
    'item-highlight': 'item::before',
    'item-indicator': 'itemTrailingIcon',
  },
  // a select's, and the search field at the top of the list
  'select-menu': {
    root: 'base',
    placeholder: 'base placeholder',
    'leading-icon': 'base leadingIcon',
    'trailing-icon': 'base trailingIcon',
    'group-label': 'content label',
    'item-highlight': 'item::before',
    'item-indicator': 'itemTrailingIcon',
    search: 'input',
    'search-icon': 'input leadingIcon',
  },
  // a row and a cell of the body, not of the head, and the loading bar under the head
  table: { tr: 'tbody tr', td: 'tbody td', 'loading-bar': 'thead::after' },
  tabs: { 'leading-icon': 'leadingIcon' },
} satisfies Record<string, Record<string, string>>
