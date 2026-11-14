<script setup lang="ts">
const colors = ['primary', 'neutral', 'success', 'info', 'warning', 'error'] as const
const variants = ['soft', 'subtle', 'outline', 'solid'] as const
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

const labels = {
  primary: 'new',
  neutral: 'draft',
  success: 'paid',
  info: 'pending',
  warning: 'expiring',
  error: 'cancelled',
}
</script>

<template>
  <GallerySection
    id="badge"
    title="UBadge"
    lead="The design system's tag: a mono label on a tint of its color, in the small radius. Soft, the ws-tag, is the default. A status is never a color alone: the word carries it."
  >
    <GalleryRow label="colors and variants">
      <GalleryMatrix
        v-slot="{ row, column }"
        :rows="colors"
        :columns="variants"
        label="Badges in every color and variant"
      >
        <UBadge :color="row" :variant="column" :label="labels[row]" />
      </GalleryMatrix>
    </GalleryRow>

    <GalleryRow label="sizes">
      <GalleryItem v-for="size in sizes" :key="size" :caption="size">
        <UBadge :size="size" label="new" />
      </GalleryItem>
    </GalleryRow>

    <GalleryRow label="with an icon">
      <GalleryItem caption="leading icon">
        <UBadge color="success" icon="i-lucide-check" label="paid" />
      </GalleryItem>
      <GalleryItem caption="trailing icon">
        <UBadge color="neutral" variant="outline" trailing-icon="i-lucide-x" label="Lisbon" />
      </GalleryItem>
    </GalleryRow>
  </GallerySection>
</template>
