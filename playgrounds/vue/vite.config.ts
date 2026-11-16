import ui from '@nuxt/ui/vite'
import vue from '@vitejs/plugin-vue'
import { keysInitScript } from '@whatsaaaa/design-system/shortcuts'
import { themeColorMeta } from '@whatsaaaa/design-system/theme/meta'
import { theme, ui as components } from '@whatsaaaa/ui-vue'
import { vueColorModeInitScript } from '@whatsaaaa/ui-vue/color-mode'
import { defineConfig, type Plugin } from 'vite'

/**
 * The head of the design system, before the stylesheet: the theme-color tags, so the browser's
 * bars take the theme's background in the page as sent, and the head scripts inline, so a
 * remembered theme and a remembered "keys off" apply before the first paint.
 */
function headScripts(): Plugin {
  return {
    name: 'head-scripts',
    transformIndexHtml: {
      order: 'pre',
      handler: () => [
        ...themeColorMeta.map((attrs) => ({
          tag: 'meta',
          attrs: { ...attrs },
          injectTo: 'head' as const,
        })),
        { tag: 'script', children: vueColorModeInitScript, injectTo: 'head' },
        { tag: 'script', children: keysInitScript, injectTo: 'head' },
      ],
    },
  }
}

// The smallest Vue setup: Nuxt UI's Vite plugin takes the theme and the components' config.
export default defineConfig({
  plugins: [
    vue(),
    ui({
      theme,
      ui: components,
      router: false,
      // the icons the app uses are bundled with it, so the page asks no server for them
      icon: { clientBundle: { scan: true } },
    }),
    headScripts(),
  ],
})
