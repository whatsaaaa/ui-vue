import whatsaaaa from '@whatsaaaa/eslint-config'

export default whatsaaaa(
  {
    vue: true,
    ignores: ['**/.nuxt/**', '**/.output/**', '**/auto-imports.d.ts', '**/components.d.ts'],
  },

  {
    name: 'app/nuxt',
    files: ['playgrounds/nuxt/app/{app,error}.vue', 'playgrounds/nuxt/app/pages/**/*.vue'],
    rules: {
      // Nuxt names its root, error and page components with one word
      'vue/multi-word-component-names': 'off',
    },
  },
)
