import './main.css'

import ui from '@nuxt/ui/vue-plugin'
import { syncColorMode, vueColorMode } from '@whatsaaaa/ui-vue/color-mode'
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).use(ui).mount('#app')

// The design system's theme and Nuxt UI's color mode, in step.
syncColorMode(vueColorMode())
