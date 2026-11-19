<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

const items: TabsItem[] = [
  { label: 'Overview', icon: 'i-lucide-list', content: 'Four registrations, three of them paid.' },
  { label: 'Settings', icon: 'i-lucide-settings', content: 'Registration is open until April 1.' },
  { label: 'History', icon: 'i-lucide-history', content: 'Last changed yesterday at 2:20 pm.' },
  { label: 'Archive', icon: 'i-lucide-archive', disabled: true },
]

/** The example of the tabs spec a row of tabs is, by its id: tabs.link.hover. */
const specOf = (state: string, size = 'md') =>
  ['tabs', 'link', state, ...(size === 'md' ? [] : [size])].join('.')

/*
 * The examples of a state show the same two tabs, so that only the state tells them apart. The
 * first is the one in the state; in the others the second is the current tab.
 */
const pair = items.slice(0, 2)
const archived = [items[3]!, items[1]!]
</script>

<template>
  <GallerySection
    id="tabs"
    title="UTabs"
    lead="Tabs read like the tabs of the frame: a row of mono labels over a line, the idle ones in the secondary text color, the current one marked by a bar of the brand color. As tall as a control at each size. A pill, a bar whose current tab is raised and outlined, is there to ask for."
  >
    <GalleryRow label="link">
      <UTabs :items="items" class="w-full" :ui="{ content: 'text-body-sm' }" />
    </GalleryRow>

    <GalleryRow label="states">
      <GalleryItem caption="rest">
        <UTabs :data-spec="specOf('rest')" :items="pair" default-value="1" :content="false" />
      </GalleryItem>
      <GalleryItem caption="hover">
        <UTabs
          :data-spec="specOf('hover')"
          data-demo="hover"
          :items="pair"
          default-value="1"
          :content="false"
        />
      </GalleryItem>
      <!-- the focus of one tab: every tab inside a marked example draws it -->
      <GalleryItem caption="focus">
        <UTabs
          :data-spec="specOf('focus')"
          data-demo="focus"
          :items="pair"
          default-value="1"
          :content="false"
        />
      </GalleryItem>
      <GalleryItem caption="current">
        <UTabs :data-spec="specOf('current')" :items="pair" :content="false" />
      </GalleryItem>
      <GalleryItem caption="disabled">
        <UTabs
          :data-spec="specOf('disabled')"
          :items="archived"
          default-value="1"
          :content="false"
        />
      </GalleryItem>
    </GalleryRow>

    <GalleryRow label="sizes">
      <GalleryItem v-for="size in sizes" :key="size" :caption="size">
        <UTabs
          :data-spec="specOf('rest', size)"
          :size="size"
          :items="pair"
          default-value="1"
          :content="false"
        />
      </GalleryItem>
    </GalleryRow>

    <GalleryRow label="vertical">
      <UTabs :items="items.slice(0, 3)" orientation="vertical" :ui="{ content: 'text-body-sm' }" />
    </GalleryRow>

    <GalleryRow label="pill">
      <UTabs :items="items" variant="pill" class="w-full" :ui="{ content: 'text-body-sm' }" />
    </GalleryRow>
  </GallerySection>
</template>
