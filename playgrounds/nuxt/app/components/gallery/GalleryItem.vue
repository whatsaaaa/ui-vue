<script setup lang="ts">
defineProps<{ caption: string }>()
</script>

<template>
  <!-- An example, named under it. -->
  <figure class="m-0 flex min-w-0 flex-col items-start gap-2">
    <slot />
    <figcaption class="font-mono text-caption text-text-secondary">{{ caption }}</figcaption>
  </figure>
</template>
