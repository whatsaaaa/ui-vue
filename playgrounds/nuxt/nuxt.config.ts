import { fileURLToPath } from 'node:url'
import { keysInitScript } from '@whatsaaaa/design-system/shortcuts'
import { theme } from '@whatsaaaa/ui-vue'
import { colorModeInitScript } from '@whatsaaaa/ui-vue/color-mode'

// The gallery of the components, generated as a static site.
export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  ui: {
    theme,
    // The design system brings its fonts, self-hosted. @nuxt/fonts would fetch them again.
    fonts: false,
    // The prose and content components, which Nuxt UI registers for @nuxt/content alone: the
    // page of the others shows them too.
    prose: true,
    content: true,
  },
  alias: {
    // The level of every component, which the page of the others is drawn from
    '#levels': fileURLToPath(new URL('../../packages/ui-vue/levels.ts', import.meta.url)),
  },
  icon: {
    // The icons are bundled with the app, so a static copy asks no server for them.
    provider: 'none',
    clientBundle: {
      scan: true,
      // The icons Nuxt UI's prose gives a code block by its file's name, which no file writes
      icons: ['vscode-icons:file-type-css', 'vscode-icons:file-type-nuxt'],
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'ui-vue - Nuxt UI on the design system',
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      // The theme-color tags come from the server only: server/plugins/theme-color.ts.
      // Before the stylesheet: the browser's bars take the theme's color, and a remembered "keys
      // off" applies before the first paint. @nuxtjs/color-mode adds its own for the theme.
      script: [{ innerHTML: colorModeInitScript }, { innerHTML: keysInitScript }],
    },
  },
  devtools: { enabled: false },
  telemetry: false,
  compatibilityDate: '2026-11-01',
})
