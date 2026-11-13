import { syncColorMode } from '@whatsaaaa/ui-vue/color-mode'

// The design system's theme and Nuxt UI's color mode, in step.
export default defineNuxtPlugin(() => {
  syncColorMode(useColorMode())
})
