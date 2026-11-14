/**
 * The design system's theme with Nuxt UI's color mode.
 *
 * The design system's tokens follow a dark or light class as they follow data-theme, so Nuxt UI's
 * color mode, @nuxtjs/color-mode on Nuxt and VueUse on Vue, switches the theme by itself: it puts
 * the class of the theme on <html> and remembers the choice. What is left here:
 *
 * - the head script, which keeps a choice remembered under the design system's `ws-theme` from
 *   setting a data-theme over the color mode's class, and on Vue puts the color mode's remembered
 *   class on before the first paint, as @nuxtjs/color-mode's own head script does on Nuxt,
 * - on Vue, the light class: Nuxt UI's plugin marks the theme with VueUse's useDark, which leaves
 *   light to no class at all,
 * - and a choice made with the design system's theme module, setTheme or toggleTheme, which goes
 *   to the color mode.
 */
import { THEME_STORAGE_KEY, themeInitScript } from '@whatsaaaa/design-system/theme'
import { useColorMode } from '@vueuse/core'
import { watch } from 'vue'

type Theme = 'dark' | 'light'

/**
 * A color mode's preference: `dark`, `light` or `system`. Nuxt's `useColorMode()` is one as it
 * is. On Vue, `vueColorMode()` makes one of VueUse's.
 */
export interface ColorMode {
  preference: string
}

/** Where VueUse's color mode remembers its preference: `dark`, `light` or `auto`. */
const VUE_STORAGE_KEY = 'vueuse-color-scheme'

/**
 * The theme module remembers a choice under `ws-theme`, and the design system's head script sets
 * data-theme from it, which wins over the class. The color mode remembers the choice instead.
 */
const forgetTheme = `try{localStorage.removeItem(${JSON.stringify(THEME_STORAGE_KEY)})}catch(e){}`

/**
 * The head script on Nuxt, for before any stylesheet, in place of the design system's: its own,
 * which keeps the browser's bars at the theme's background, after forgetting `ws-theme`.
 *
 *   app: { head: { script: [{ innerHTML: colorModeInitScript }] } }
 */
export const colorModeInitScript = `(function(){${forgetTheme}})();${themeInitScript}`

/**
 * The head script on Vue: colorModeInitScript, and VueUse's remembered preference as the class of
 * <html>, so a chosen theme shows from the first paint. With none the tokens follow the system.
 *
 *   <script>{vueColorModeInitScript}</script>
 */
export const vueColorModeInitScript = `(function(){${forgetTheme}try{var m=localStorage.getItem(${JSON.stringify(VUE_STORAGE_KEY)});if(m==='dark'||m==='light')document.documentElement.classList.add(m)}catch(e){}})();${themeInitScript}`

const isTheme = (value: unknown): value is Theme => value === 'dark' || value === 'light'

/**
 * Lets the design system's theme module switch the theme too. Its setTheme and toggleTheme write
 * data-theme on <html>, and the color mode takes that as its preference. data-theme in turn names
 * the color mode's preference, and is left off while it follows the system, so it never holds an
 * older choice over the class, and toggleTheme and setTheme('system') start from the theme shown.
 * Call it once, in the browser, after the color mode is set up. Returns a function that stops it.
 */
export function bindThemeModule(colorMode: ColorMode): () => void {
  const html = document.documentElement

  const observer = new MutationObserver(() => {
    const theme = html.dataset.theme
    colorMode.preference = isTheme(theme) ? theme : 'system'
  })

  function mark(preference: string) {
    if (isTheme(preference)) html.dataset.theme = preference
    else delete html.dataset.theme
    // its own change, which is no choice
    observer.takeRecords()
  }

  mark(colorMode.preference)
  observer.observe(html, { attributeFilter: ['data-theme'] })
  const stopWatching = watch(() => colorMode.preference, mark)

  return () => {
    stopWatching()
    observer.disconnect()
  }
}

/**
 * VueUse's color mode, which Nuxt UI's Vue plugin sets up, as a preference. VueUse names the
 * system's setting `auto`. Unlike the plugin's useDark it puts a light class on <html> as well
 * as a dark one, which the tokens need to tell a chosen light theme from the system's.
 */
export function vueColorMode(): ColorMode {
  const { store } = useColorMode()
  return {
    get preference() {
      return store.value === 'auto' ? 'system' : store.value
    },
    set preference(value: string) {
      store.value = isTheme(value) ? value : 'auto'
    },
  }
}
