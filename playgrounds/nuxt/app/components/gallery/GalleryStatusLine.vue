<script setup lang="ts">
import { enableShortcuts, isTyping } from '@whatsaaaa/design-system/shortcuts'
import { toggleTheme } from '@whatsaaaa/design-system/theme'

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
onUnmounted(() => {
  document.removeEventListener('focusin', updateMode)
  document.removeEventListener('focusout', updateMode)
  disableShortcuts?.()
})
</script>

<template>
  <footer class="ws-status-line" aria-label="Status">
    <span class="ws-status-line__mode">{{ mode }}</span>
    <!-- The room left in the line, which the path shows in whole or not at all. -->
    <span class="status-line__path">
      <span class="ws-status-line__file"><span>~/ui-vue/galerija</span></span>
    </span>
    <!-- Each hint is the control it names: the key clicks the button. -->
    <span class="ws-status-line__keys">
      <button type="button" data-ws-key="t" aria-label="Switch theme" @click="toggleTheme">
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
      screen, and this is not. Both names are in the page and the styles show the theme's one.
    -->
    <button
      type="button"
      class="status-line__theme ws-status-line__item ws-status-line__item--edge ws-status-line__item--dark"
      @click="toggleTheme"
    >
      <span class="sr-only">Switch theme, now</span>
      rose-pine
    </button>
    <button
      type="button"
      class="status-line__theme ws-status-line__item ws-status-line__item--edge ws-status-line__item--light"
      @click="toggleTheme"
    >
      <span class="sr-only">Switch theme, now</span>
      rose-pine-dawn
    </button>
  </footer>
</template>
