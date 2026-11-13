/**
 * The stylesheets take every color from a token. A hex value, a named color or a color
 * function is an error, so the design system's tokens stay the one place a color is defined.
 * A variable that nothing defines is an error too, so a token cannot be misspelled.
 */
export default {
  extends: ['stylelint-config-standard'],
  plugins: ['stylelint-value-no-unknown-custom-properties'],
  ignoreFiles: ['**/dist/**', '**/.nuxt/**', '**/.output/**'],
  rules: {
    'color-no-hex': true,
    'color-named': 'never',
    'function-disallowed-list': [
      'rgb',
      'rgba',
      'hsl',
      'hsla',
      'oklch',
      'oklab',
      'lab',
      'lch',
      'hwb',
    ],
    'csstools/value-no-unknown-custom-properties': [
      true,
      {
        // what a stylesheet may read besides its own variables: the design system's tokens
        // and icons, and Tailwind's theme
        importFrom: [
          'packages/ui-vue/node_modules/@whatsaaaa/design-system/dist/tokens.css',
          'packages/ui-vue/node_modules/@whatsaaaa/design-system/dist/css/icons.css',
        ],
      },
    ],
    // Tailwind's at-rules and functions
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['theme', 'source', 'custom-variant', 'slot', 'utility', 'variant', 'apply'],
      },
    ],
    'at-rule-no-deprecated': [true, { ignoreAtRules: ['apply'] }],
    // the selector of a variant, which Tailwind puts the utility's in for &
    'nesting-selector-no-missing-scoping-root': [true, { ignoreAtRules: ['custom-variant'] }],
    'import-notation': 'string',
    'selector-class-pattern': null,
    'custom-property-pattern': null,
    'no-descending-specificity': null,
  },
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
    },
  ],
}
