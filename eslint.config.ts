import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from 'eslint-config-prettier/flat'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts}'],
  },

  globalIgnores([
    '**/dist/**',
    '**/.nuxt/**',
    '**/.output/**',
    '**/auto-imports.d.ts',
    '**/components.d.ts',
    'playwright-report/**',
    'test-results/**',
  ]),

  ...pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,

  {
    name: 'app/nuxt',
    files: ['playgrounds/nuxt/app/{app,error}.vue', 'playgrounds/nuxt/app/pages/**/*.vue'],
    rules: {
      // Nuxt names its root, error and page components with one word
      'vue/multi-word-component-names': 'off',
    },
  },

  // oxlint runs first and is faster: leave the rules it covers to it
  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),
  skipFormatting,
)
