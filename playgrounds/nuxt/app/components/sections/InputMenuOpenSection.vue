<script setup lang="ts">
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

// an open list highlights its first option, the chosen one here, as the select menu's does. A
// group, a line and two more: Nuxt UI's list is no higher than 15rem, which they fit in at xl
const cities = [
  { type: 'label' as const, label: 'Vojvodina' },
  'Novi Sad',
  'Subotica',
  { type: 'separator' as const },
  'Belgrade',
  { label: 'Niš', disabled: true },
]
</script>

<template>
  <GallerySection
    id="input-menu"
    title="UInputMenu"
    lead="The input menu's list, open under its field in each size: the select menu's list, with the chosen city highlighted and ticked, a group's name an overline, and a disabled city faint."
  >
    <GalleryRow label="open" align="start">
      <div class="grid w-full items-start gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
        <UFormField
          v-for="size in sizes"
          :key="size"
          :size="size"
          label="City"
          :help="`size ${size}`"
        >
          <GalleryOpen class="gallery-open--in-field">
            <UInputMenu
              default-value="Novi Sad"
              :items="cities"
              open
              :portal="false"
              class="w-full"
            />
          </GalleryOpen>
        </UFormField>
      </div>
    </GalleryRow>
  </GallerySection>
</template>
