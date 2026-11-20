<script setup lang="ts">
import { enableShortcuts, isTyping } from '@whatsaaaa/design-system/shortcuts'

const route = useRoute()

/** The page on show, by the name of its tab: the index page is the gallery. */
const pageName = computed(() => (route.name === 'index' ? 'gallery' : String(route.name)))

const colorMode = useColorMode()

/** Chooses the other theme from the one on show, with Nuxt UI's color mode, which remembers it. */
function switchTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

/**
 * NORMAL while single keys are shortcuts, INSERT while they are typed into a field. It says
 * whether the key hints next to it work right now.
 */
const mode = ref<'NORMAL' | 'INSERT'>('NORMAL')

function updateMode() {
  mode.value = isTyping(document.activeElement) ? 'INSERT' : 'NORMAL'
}

let disableShortcuts: (() => void) | undefined
onMounted(() => {
  updateMode()
  document.addEventListener('focusin', updateMode)
  document.addEventListener('focusout', updateMode)
  disableShortcuts = enableShortcuts()
})
onBeforeUnmount(() => {
  document.removeEventListener('focusin', updateMode)
  document.removeEventListener('focusout', updateMode)
  disableShortcuts?.()
})
</script>

<template>
  <footer class="ws-status-line" aria-label="Status">
    <span class="ws-status-line__mode">{{ mode }}</span>
    <!-- The room left in the line, which the path shows in whole or not at all. -->
    <span class="ws-status-line__path">
      <span class="ws-status-line__file"><span>~/ui-vue/{{ pageName }}</span></span>
    </span>
    <!-- Each hint is the control it names: the key clicks the button. -->
    <span class="ws-status-line__keys">
      <button type="button" data-ws-key="t" :disabled="colorMode.forced" @click="switchTheme">
        <kbd class="ws-kbd">t</kbd>theme
      </button>
    </span>
    <!-- The shortcuts module gives the switch its state. Until then the styles keep it hidden. -->
    <button
      type="button"
      class="ws-status-line__switch"
      role="switch"
      aria-label="Shortcut keys"
      data-ws-keys-switch
    >
      keys
      <span class="ws-status-line__on" aria-hidden="true">on</span>
      <span class="ws-status-line__off" aria-hidden="true">off</span>
    </button>
    <!--
      The name of the theme, which also switches it: the hints above are hidden on a narrow
      screen, and this is not. Both names are in the button and the styles show the theme's one,
      so the button keeps the focus when the theme changes.
    -->
    <button
      type="button"
      class="ws-status-line__theme"
      :disabled="colorMode.forced"
      @click="switchTheme"
    >
      <span class="sr-only">Switch theme, now</span>
      <span class="ws-theme-dark">rose-pine</span>
      <span class="ws-theme-light">rose-pine-dawn</span>
    </button>
  </footer>
</template>
