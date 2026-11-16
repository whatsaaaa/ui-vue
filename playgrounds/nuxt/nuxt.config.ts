import { keysInitScript } from '@whatsaaaa/design-system/shortcuts'
import { themeColorMeta } from '@whatsaaaa/design-system/theme/meta'
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
  icon: {
    // The icons are bundled with the app, so a static copy asks no server for them.
    provider: 'none',
    clientBundle: { scan: true },
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
      // The browser's bars take the theme's background in the page as sent, for a visitor
      // without JavaScript and a link preview. The head script keeps them at the theme shown.
      meta: themeColorMeta.map((attrs) => ({ ...attrs })),
      // Before the stylesheet: the browser's bars take the theme's color, and a remembered "keys
      // off" applies before the first paint. @nuxtjs/color-mode adds its own for the theme.
      script: [{ innerHTML: colorModeInitScript }, { innerHTML: keysInitScript }],
    },
  },
  devtools: { enabled: false },
  telemetry: false,
  compatibilityDate: '2026-11-01',
})
