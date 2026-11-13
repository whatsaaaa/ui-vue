<script setup lang="ts">
const colors = ['primary', 'neutral', 'success', 'info', 'warning', 'error'] as const
const variants = ['soft', 'subtle', 'outline', 'solid'] as const
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

const labels = {
  primary: 'novo',
  neutral: 'nacrt',
  success: 'plaćeno',
  info: 'na čekanju',
  warning: 'ističe',
  error: 'otkazano',
}
</script>

<template>
  <GallerySection
    id="badge"
    title="UBadge"
    lead="Oznaka dizajn sistema: mono natpis na nijansi boje, mali radijus. Podrazumevana varijanta je soft, kao ws-tag. Status nikad nije samo boja: reč ga nosi."
  >
    <GalleryRow label="boje i varijante">
      <GalleryMatrix
        v-slot="{ row, column }"
        :rows="colors"
        :columns="variants"
        label="Oznake u svakoj boji i varijanti"
      >
        <UBadge :color="row" :variant="column" :label="labels[row]" />
      </GalleryMatrix>
    </GalleryRow>

    <GalleryRow label="veličine">
      <GalleryItem v-for="size in sizes" :key="size" :caption="size">
        <UBadge :size="size" label="novo" />
      </GalleryItem>
    </GalleryRow>

    <GalleryRow label="sa ikonom">
      <GalleryItem caption="ikona ispred">
        <UBadge color="success" icon="i-lucide-check" label="plaćeno" />
      </GalleryItem>
      <GalleryItem caption="ikona iza">
        <UBadge color="neutral" variant="outline" trailing-icon="i-lucide-x" label="Novi Sad" />
      </GalleryItem>
    </GalleryRow>
  </GallerySection>
</template>
