<script setup lang="ts">
const colors = ['primary', 'neutral', 'success', 'info', 'warning', 'error'] as const
const variants = ['solid', 'outline', 'soft', 'subtle', 'ghost', 'link'] as const
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

/** The kinds of button the system names, as Nuxt UI draws them. */
const kinds = {
  primary: { color: 'primary', variant: 'solid', label: 'Save' },
  secondary: { color: 'neutral', variant: 'outline', label: 'Cancel' },
  ghost: { color: 'neutral', variant: 'ghost', label: 'Later' },
  quiet: { color: 'primary', variant: 'link', label: 'Edit' },
  danger: { color: 'error', variant: 'outline', label: 'Delete' },
} as const
const kindNames = Object.keys(kinds) as (keyof typeof kinds)[]

/** A state, drawn by its demo attribute or by its prop. */
const states = {
  default: {},
  hover: { 'data-demo': 'hover' },
  pressed: { 'data-demo': 'active' },
  focus: { 'data-demo': 'focus' },
  disabled: { disabled: true },
  loading: { loading: true },
} as const
const stateNames = Object.keys(states) as (keyof typeof states)[]

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
      <GalleryMatrix
        v-slot="{ row, column }"
        :rows="kindNames"
        :columns="stateNames"
        label="Each kind of button in every state"
      >
        <!-- a quiet button is a link, which does not load -->
        <UButton
          v-if="row !== 'quiet' || column !== 'loading'"
          :color="kinds[row].color"
          :variant="kinds[row].variant"
          :label="kinds[row].label"
          v-bind="states[column]"
        />
      </GalleryMatrix>
    </GalleryRow>

    <GalleryRow label="full width">
      <div class="w-full max-w-sm">
        <UButton block label="Register" />
      </div>
    </GalleryRow>
  </GallerySection>
</template>
