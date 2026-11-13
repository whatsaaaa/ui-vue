<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

const items: TabsItem[] = [
  { label: 'Pregled', icon: 'i-lucide-list', content: 'Četiri prijave, tri plaćene.' },
  { label: 'Podešavanja', icon: 'i-lucide-settings', content: 'Prijave su otvorene do 1. aprila.' },
  { label: 'Istorija', icon: 'i-lucide-history', content: 'Poslednja izmena juče u 14:20.' },
  { label: 'Arhiva', icon: 'i-lucide-archive', disabled: true },
]
</script>

<template>
  <GallerySection
    id="tabs"
    title="UTabs"
    lead="Kartice kao kartice okvira: mono natpisi, neaktivne u sekundarnoj boji teksta. Pill je traka čija je trenutna kartica izdignuta, link je red nad linijom sa trenutnom karticom označenom bojom brenda."
  >
    <GalleryRow label="pill">
      <UTabs :items="items" class="w-full" :ui="{ content: 'text-body-sm' }" />
    </GalleryRow>

    <GalleryRow label="link">
      <UTabs :items="items" variant="link" class="w-full" :ui="{ content: 'text-body-sm' }" />
    </GalleryRow>

    <GalleryRow label="stanja">
      <GalleryItem caption="hover">
        <UTabs :items="items.slice(0, 2)" :content="false" data-demo="hover" />
      </GalleryItem>
      <!-- the focus of one tab: every tab inside a marked example draws it -->
      <GalleryItem caption="fokus">
        <UTabs :items="items.slice(0, 1)" :content="false" data-demo="focus" />
      </GalleryItem>
      <GalleryItem caption="fokus, link">
        <UTabs :items="items.slice(0, 1)" variant="link" :content="false" data-demo="focus" />
      </GalleryItem>
      <GalleryItem caption="onemogućena">
        <UTabs :items="items.slice(2, 4)" :content="false" />
      </GalleryItem>
    </GalleryRow>

    <GalleryRow label="uspravno">
      <UTabs
        :items="items.slice(0, 3)"
        orientation="vertical"
        variant="link"
        :ui="{ content: 'text-body-sm' }"
      />
    </GalleryRow>

    <GalleryRow label="veličine">
      <GalleryItem v-for="size in sizes" :key="size" :caption="size">
        <UTabs :size="size" :items="items.slice(0, 2)" :content="false" />
      </GalleryItem>
    </GalleryRow>
  </GallerySection>
</template>
