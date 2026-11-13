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
  },
  // Nuxt UI's color mode remembers its preference where the design system remembers its theme.
  colorMode: {
    storageKey: 'ws-theme',
  },
  icon: {
    // The icons are bundled with the app, so a static copy asks no server for them.
    provider: 'none',
    clientBundle: { scan: true },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'sr-Latn' },
      title: 'ui-vue - Nuxt UI na dizajn sistemu',
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      // Before the stylesheet: a remembered theme and "keys off" apply before the first paint.
      script: [{ innerHTML: colorModeInitScript }, { innerHTML: keysInitScript }],
    },
  },
  devtools: { enabled: false },
  telemetry: false,
  compatibilityDate: '2026-11-01',
})
