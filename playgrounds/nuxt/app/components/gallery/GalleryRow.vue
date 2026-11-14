<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    /**
     * end lines the examples up at their foot, so their names share a line. start lines them
     * up at their top, for examples that start with a heading of their own.
     */
    align?: 'start' | 'end'
  }>(),
  { align: 'end' },
)
</script>

<template>
  <!-- One aspect of a component: its examples side by side, wrapping on a narrow screen. -->
  <div>
    <h3 class="font-mono text-overline uppercase text-text-secondary">{{ label }}</h3>
    <div
      class="mt-4 flex flex-wrap gap-x-6 gap-y-5"
      :class="align === 'end' ? 'items-end' : 'items-start'"
    >
      <slot />
    </div>
  </div>
</template>
