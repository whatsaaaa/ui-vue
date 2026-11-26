/**
 * The stylesheets take every color from a design system token: the design system's config makes a
 * hex value, a named color or a color function an error, and a variable that nothing defines too.
 * It extends stylelint-config-standard, and loads it and stylelint-value-no-unknown-custom-properties
 * from this repository's devDependencies. The rules below are this repository's own: Tailwind's
 * at-rules, and the naming and ordering it leaves to the stylesheets.
 */
export default {
  extends: ['@whatsaaaa/design-system/stylelint'],
  ignoreFiles: ['**/dist/**', '**/coverage/**', '**/.nuxt/**', '**/.output/**'],
  rules: {
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
    // the selector of a variant or of a utility, which Tailwind puts the class in for &
    'nesting-selector-no-missing-scoping-root': [
      true,
      { ignoreAtRules: ['custom-variant', 'utility'] },
    ],
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
