<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

const items: TabsItem[] = [
  { label: 'Overview', icon: 'i-lucide-list', content: 'Four registrations, three of them paid.' },
  { label: 'Settings', icon: 'i-lucide-settings', content: 'Registration is open until April 1.' },
  { label: 'History', icon: 'i-lucide-history', content: 'Last changed yesterday at 2:20 pm.' },
  { label: 'Archive', icon: 'i-lucide-archive', disabled: true },
]
</script>

<template>
  <GallerySection
    id="tabs"
    title="UTabs"
    lead="Tabs read like the tabs of the frame: mono labels, the idle ones in the secondary text color. A pill is a bar whose current tab is raised and outlined; a link is a row over a divider, its current tab marked in the brand color."
  >
    <GalleryRow label="pill">
      <UTabs :items="items" class="w-full" :ui="{ content: 'text-body-sm' }" />
    </GalleryRow>

    <GalleryRow label="link">
      <UTabs :items="items" variant="link" class="w-full" :ui="{ content: 'text-body-sm' }" />
    </GalleryRow>

    <GalleryRow label="states">
      <GalleryItem caption="hover">
        <UTabs :items="items.slice(0, 2)" :content="false" data-demo="hover" />
      </GalleryItem>
      <!-- the focus of one tab: every tab inside a marked example draws it -->
      <GalleryItem caption="focus">
        <UTabs :items="items.slice(0, 1)" :content="false" data-demo="focus" />
      </GalleryItem>
      <GalleryItem caption="focus, link">
        <UTabs :items="items.slice(0, 1)" variant="link" :content="false" data-demo="focus" />
      </GalleryItem>
      <GalleryItem caption="disabled">
        <UTabs :items="items.slice(2, 4)" :content="false" />
      </GalleryItem>
    </GalleryRow>

    <GalleryRow label="vertical">
      <UTabs
        :items="items.slice(0, 3)"
        orientation="vertical"
        variant="link"
        :ui="{ content: 'text-body-sm' }"
      />
    </GalleryRow>

    <GalleryRow label="sizes">
      <GalleryItem v-for="size in sizes" :key="size" :caption="size">
        <UTabs :size="size" :items="items.slice(0, 2)" :content="false" />
      </GalleryItem>
    </GalleryRow>
  </GallerySection>
</template>
