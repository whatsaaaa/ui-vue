import { bindThemeModule } from '@whatsaaaa/ui-vue/color-mode'

// The design system's theme switch moves Nuxt UI's color mode.
export default defineNuxtPlugin(() => {
  bindThemeModule(useColorMode())
})
