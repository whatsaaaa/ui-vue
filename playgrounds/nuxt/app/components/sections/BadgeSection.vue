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

/** The kind of the badge spec a color and a variant are, if they are one of its kinds. */
const kindOf = (color: string, variant: string) =>
  variant === 'soft'
    ? color === 'error'
      ? 'danger'
      : color
    : variant === 'outline' && color === 'neutral'
      ? 'outline'
      : undefined

/** The example of the badge spec a badge is, by its id: badge.outline.rest.sm. */
const specOf = (kind: string | undefined, size = 'md') =>
  kind && ['badge', kind, 'rest', ...(size === 'md' ? [] : [size])].join('.')
</script>

<template>
  <GallerySection
    id="badge"
    title="UBadge"
    lead="The design system's tag: a mono label on a tint of its color, in the small radius, or outlined in the border color for a plain list. Soft, the ws-tag, is the default. A status is never a color alone: the word carries it."
  >
    <GalleryRow label="colors and variants">
      <GalleryMatrix
        v-slot="{ row, column }"
        :rows="colors"
        :columns="variants"
        label="Badges in every color and variant"
      >
        <UBadge
          :color="row"
          :variant="column"
          :label="labels[row]"
          :data-spec="specOf(kindOf(row, column))"
        />
      </GalleryMatrix>
    </GalleryRow>

    <GalleryRow label="sizes" align="start">
      <GalleryItem v-for="size in sizes" :key="size" :caption="size">
        <div class="flex flex-col items-start gap-3">
          <UBadge :size="size" label="new" :data-spec="specOf('primary', size)" />
          <UBadge
            :size="size"
            color="neutral"
            variant="outline"
            label="TypeScript"
            :data-spec="specOf('outline', size)"
          />
        </div>
      </GalleryItem>
    </GalleryRow>

    <GalleryRow label="with an icon">
      <GalleryItem caption="leading icon">
        <UBadge color="success" icon="i-lucide-check" label="paid" :data-spec="specOf('success')" />
      </GalleryItem>
      <GalleryItem caption="trailing icon">
        <UBadge
          color="neutral"
          variant="outline"
          trailing-icon="i-lucide-x"
          label="Lisbon"
          :data-spec="specOf('outline')"
        />
      </GalleryItem>
    </GalleryRow>
  </GallerySection>
</template>
