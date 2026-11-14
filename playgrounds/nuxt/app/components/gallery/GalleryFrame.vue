<script setup lang="ts">
defineProps<{ title: string; lead: string }>()
</script>

<template>
  <!-- The design system's terminal frame: a window with a tab bar on top and a status line. -->
  <div class="window ws-term">
    <GalleryTabBar />
    <main class="window__main">
      <div class="px-4 pt-6 pb-12 lg:px-12 lg:pt-10 lg:pb-16">
        <header class="max-w-(--ws-size-content)">
          <h1 class="font-mono text-h1-compact lg:text-h1">{{ title }}</h1>
          <p class="mt-2 text-lead text-text-secondary">{{ lead }}</p>
        </header>
        <slot />
      </div>
    </main>
    <GalleryStatusLine />
  </div>
</template>
