<script setup lang="ts">
defineProps<{ id: string; title: string; lead: string }>()
</script>

<template>
  <!-- A section is the output of the component's name, typed at the prompt. -->
  <section :id="id" class="mt-16 scroll-mt-6 lg:mt-20" :aria-labelledby="`${id}-title`">
    <h2 :id="`${id}-title`" class="ws-prompt">{{ title }}</h2>
    <p class="mt-2 max-w-(--ws-size-content) text-body-sm text-text-secondary">{{ lead }}</p>
    <div class="mt-8 flex flex-col gap-10">
      <slot />
    </div>
  </section>
</template>
