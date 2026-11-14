<script setup lang="ts">
const colors = ['primary', 'neutral', 'success', 'info', 'warning', 'error'] as const
const variants = ['solid', 'outline', 'soft', 'subtle', 'ghost', 'link'] as const
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

const labels = {
  primary: 'Save',
  neutral: 'Cancel',
  success: 'Confirm',
  info: 'Details',
  warning: 'Review',
  error: 'Delete',
}
</script>

<template>
  <GallerySection
    id="button"
    title="UButton"
    lead="A mono label, an outline in the field border or a fill of the interactive color, as tall as a field. A disabled button is faint in every variant."
  >
    <GalleryRow label="colors and variants">
      <GalleryMatrix
        v-slot="{ row, column }"
        :rows="colors"
        :columns="variants"
        label="Buttons in every color and variant"
      >
        <UButton :color="row" :variant="column" :label="labels[row]" />
      </GalleryMatrix>
    </GalleryRow>

    <GalleryRow label="sizes">
      <GalleryItem v-for="size in sizes" :key="size" :caption="size">
        <UButton :size="size" label="Save" />
      </GalleryItem>
    </GalleryRow>

    <GalleryRow label="with an icon">
      <GalleryItem caption="leading icon">
        <UButton icon="i-lucide-send" label="Send" />
      </GalleryItem>
      <GalleryItem caption="trailing icon">
        <UButton
          trailing-icon="i-lucide-arrow-right"
          color="neutral"
          variant="outline"
          label="Next"
        />
      </GalleryItem>
      <GalleryItem v-for="size in sizes" :key="size" :caption="`icon only, ${size}`">
        <UButton
          :size="size"
          icon="i-lucide-trash-2"
          color="neutral"
          variant="outline"
          aria-label="Delete"
        />
      </GalleryItem>
    </GalleryRow>

    <GalleryRow label="states">
      <GalleryItem caption="default">
        <UButton label="Save" />
      </GalleryItem>
      <GalleryItem caption="hover">
        <UButton label="Save" data-demo="hover" />
      </GalleryItem>
      <GalleryItem caption="focus">
        <UButton label="Save" data-demo="focus" />
      </GalleryItem>
      <GalleryItem caption="disabled">
        <UButton label="Save" disabled />
      </GalleryItem>
      <GalleryItem caption="loading">
        <UButton label="Saving" loading />
      </GalleryItem>
    </GalleryRow>

    <GalleryRow label="states, outline">
      <GalleryItem caption="default">
        <UButton color="neutral" variant="outline" label="Cancel" />
      </GalleryItem>
      <GalleryItem caption="hover">
        <UButton color="neutral" variant="outline" label="Cancel" data-demo="hover" />
      </GalleryItem>
      <GalleryItem caption="focus">
        <UButton color="neutral" variant="outline" label="Cancel" data-demo="focus" />
      </GalleryItem>
      <GalleryItem caption="disabled">
        <UButton color="neutral" variant="outline" label="Cancel" disabled />
      </GalleryItem>
      <GalleryItem caption="loading">
        <UButton color="neutral" variant="outline" label="Loading" loading />
      </GalleryItem>
    </GalleryRow>

    <GalleryRow label="full width">
      <div class="w-full max-w-sm">
        <UButton block label="Register" />
      </div>
    </GalleryRow>
  </GallerySection>
</template>
