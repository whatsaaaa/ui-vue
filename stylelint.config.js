/**
 * The stylesheets take every color from a design system token: a hex value, a named color or a
 * color function is an error, and so is a variable that nothing defines.
 */
export default {
  extends: ['stylelint-config-standard'],
  plugins: ['stylelint-value-no-unknown-custom-properties'],
  ignoreFiles: ['**/dist/**', '**/coverage/**', '**/.nuxt/**', '**/.output/**'],
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
    // the declarations of a utility under a condition, which Tailwind puts in the utility's rule
    'no-invalid-position-declaration': [true, { ignoreAtRules: ['utility'] }],
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
