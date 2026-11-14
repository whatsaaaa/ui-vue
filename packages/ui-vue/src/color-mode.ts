/**
 * The design system's theme and Nuxt UI's color mode, kept in step.
 *
 * The design system switches its tokens on data-theme="dark" or "light" on <html>, or on the
 * system's setting when there is none, and remembers a choice under `ws-theme`. Nuxt UI, Tailwind
 * and VueUse switch on a dark class on <html>, and Nuxt UI's color mode, @nuxtjs/color-mode on
 * Nuxt and VueUse on Vue, remembers its own preference. Here both read as one:
 *
 * - the head script applies a remembered choice and the class before the first paint,
 * - a choice made with the design system's theme module moves the color mode's preference,
 * - a preference set through the color mode sets the design system's choice,
 * - a dark or light class put on <html> by hand is a choice too,
 * - and with no choice both follow the system.
 *
 * The class of the theme on show is always on <html>: dark or light, as @nuxtjs/color-mode puts
 * it. The dark: and light: variants read it where there is no data-theme.
 */
import { setTheme, THEME_STORAGE_KEY } from '@whatsaaaa/design-system/theme'
import { useColorMode } from '@vueuse/core'
import { watch } from 'vue'

export type Theme = 'dark' | 'light'
export type ThemeChoice = Theme | 'system'

/**
 * A color mode's preference: `dark`, `light` or `system`. Nuxt's `useColorMode()` is one as it
 * is. On Vue, `vueColorMode()` makes one of VueUse's.
 */
export interface ColorMode {
  preference: string
}

/**
 * The head script, for before any stylesheet: a remembered choice becomes data-theme, a dark or
 * light class in the markup does when nothing is remembered, and the class of the theme on show
 * goes on <html>. It runs the design system's own head script's work, so it replaces it.
 *
 *   <script>{colorModeInitScript}</script>
 */
export const colorModeInitScript = `(function(){var d=document.documentElement,c=d.classList,t=null;try{t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})}catch(e){}if(t==='dark'||t==='light')d.dataset.theme=t;else if(!d.dataset.theme&&c.contains('dark')!==c.contains('light'))d.dataset.theme=c.contains('dark')?'dark':'light';var s=d.dataset.theme;if(s!=='dark'&&s!=='light')s=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';c.toggle('dark',s==='dark');c.toggle('light',s==='light')})()`

const isTheme = (value: unknown): value is Theme => value === 'dark' || value === 'light'

const html = () => document.documentElement

/** The design system's choice: data-theme, or `system`. */
function choice(): ThemeChoice {
  const attribute = html().dataset.theme
  return isTheme(attribute) ? attribute : 'system'
}

function systemTheme(): Theme {
  return matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

/** The theme on show. */
function shown(): Theme {
  const current = choice()
  return current === 'system' ? systemTheme() : current
}

/** The theme the class names, when it names one. */
function classTheme(): Theme | undefined {
  const { classList } = html()
  const dark = classList.contains('dark')
  if (dark === classList.contains('light')) return undefined
  return dark ? 'dark' : 'light'
}

/** Puts the class of the theme on show on <html>, and takes the other one off. */
function markClass(): void {
  const theme = shown()
  html().classList.toggle('dark', theme === 'dark')
  html().classList.toggle('light', theme === 'light')
}

function asChoice(preference: string): ThemeChoice {
  return isTheme(preference) ? preference : 'system'
}

/**
 * Starts keeping the two in step, from the design system's choice, which the head script has
 * already applied. Call it once, in the browser, after the color mode is set up. Returns a
 * function that stops it.
 */
export function syncColorMode(colorMode: ColorMode): () => void {
  colorMode.preference = choice()
  markClass()

  // A preference set through the color mode: the design system takes it and remembers it.
  const stopWatching = watch(
    () => colorMode.preference,
    (preference) => {
      const next = asChoice(preference)
      if (next !== choice()) setTheme(next)
      markClass()
    },
  )

  const observer = new MutationObserver((records) => {
    if (records.some((record) => record.attributeName === 'data-theme')) {
      // the design system's theme module chose: the color mode follows
      if (asChoice(colorMode.preference) !== choice()) colorMode.preference = choice()
    } else if (asChoice(colorMode.preference) !== choice()) {
      // the color mode changed the class before its preference reached the watcher above
      setTheme(asChoice(colorMode.preference))
    } else {
      // a class that names the other theme was put on by hand: it is a choice
      const named = classTheme()
      if (named && named !== shown()) {
        setTheme(named)
        colorMode.preference = named
      }
    }
    markClass()
  })
  observer.observe(html(), { attributes: true, attributeFilter: ['class', 'data-theme'] })

  // With no choice the page follows the system, and the class with it.
  const media = matchMedia('(prefers-color-scheme: light)')
  media.addEventListener('change', markClass)

  return () => {
    stopWatching()
    observer.disconnect()
    media.removeEventListener('change', markClass)
  }
}

/**
 * VueUse's color mode, which Nuxt UI's Vue plugin sets up, as a preference. VueUse names the
 * system's setting `auto`.
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
