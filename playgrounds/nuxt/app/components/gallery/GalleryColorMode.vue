<script setup lang="ts">
const colorMode = useColorMode()

const modes = [
  { label: 'system', value: 'system' },
  { label: 'dark', value: 'dark' },
  { label: 'light', value: 'light' },
]
</script>

<template>
  <!-- Nuxt UI's own color mode, which the theme switch in the status line moves too. -->
  <ClientOnly>
    <URadioGroup
      v-model="colorMode.preference"
      legend="Nuxt UI color mode"
      orientation="horizontal"
      :items="modes"
      class="shrink-0"
      data-testid="color-mode"
    />
    <template #fallback>
      <div class="h-[4.25rem]" />
    </template>
  </ClientOnly>
</template>
