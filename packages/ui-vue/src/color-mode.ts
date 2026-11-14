/**
 * The design system's theme with Nuxt UI's color mode.
 *
 * The design system's tokens follow a dark or light class as they follow data-theme, so Nuxt UI's
 * color mode, @nuxtjs/color-mode on Nuxt and VueUse's useColorMode on Vue, switches the theme by
 * itself: it puts the class of the theme on <html> and remembers the choice. Switch the theme
 * with the color mode, not with the design system's setTheme or toggleTheme: the data-theme they
 * write wins over the class. What is left here is the head script, which keeps a choice
 * remembered under the design system's `ws-theme` from setting a data-theme over the color mode's
 * class, and on Vue puts the color mode's remembered class on before the first paint, as
 * @nuxtjs/color-mode's own head script does on Nuxt.
 */
import { THEME_STORAGE_KEY, themeInitScript } from '@whatsaaaa/design-system/theme'

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
