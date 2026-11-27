<script setup lang="ts">
const sections = [
  { id: 'select', label: 'USelect' },
  { id: 'select-menu', label: 'USelectMenu' },
  { id: 'input-menu', label: 'UInputMenu' },
  { id: 'modal', label: 'UModal' },
]
</script>

<template>
  <GalleryFrame
    title="Lists and windows, open"
    lead="The examples of the select, select menu and modal specs, and the input menu's list, with the lists and the window held open in place. An open list or modal holds the page as it does in an app: it hides the rest from assistive technology and locks the page's scroll and pointer. So they have a page of their own, where each open one is a picture that takes no focus."
  >
    <div class="mt-10 flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
      <nav aria-labelledby="contents-title" class="min-w-0">
        <h2 id="contents-title" class="ws-prompt">ls components</h2>
        <ul class="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-mono text-label">
          <li v-for="section in sections" :key="section.id">
            <a :href="`#${section.id}`">{{ section.label }}</a>
          </li>
        </ul>
      </nav>
      <GalleryColorMode />
    </div>

    <SectionsSelectSpecSection component="select" />
    <SectionsSelectSpecSection component="select-menu" />
    <SectionsInputMenuOpenSection />
    <SectionsModalSpecSection />
  </GalleryFrame>
</template>
