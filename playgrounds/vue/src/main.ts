import './main.css'

import ui from '@nuxt/ui/vue-plugin'
import { bindThemeModule, vueColorMode } from '@whatsaaaa/ui-vue/color-mode'
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).use(ui).mount('#app')

// Nuxt UI's color mode puts the light class on too, and the design system's theme switch moves it.
bindThemeModule(vueColorMode())
