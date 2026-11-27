<script setup lang="ts">
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const variants = ['outline', 'subtle', 'soft', 'ghost'] as const

const cities = ['Belgrade', 'Novi Sad', 'Niš', 'Kragujevac', 'Subotica', 'Zrenjanin', 'Čačak']

const city = ref('Novi Sad')
const several = ref(['Belgrade', 'Niš'])
</script>

<template>
  <GallerySection
    id="input-menu"
    title="UInputMenu"
    lead="A text field whose list opens under it as it is typed in: the field is the input's, and the list the select menu's, on a panel with a border and no shadow. With several values, the chosen ones are tags in the field. Its list, open, is on the open page."
  >
    <GalleryRow label="states">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
        <UFormField label="City" help="Type to find the city.">
          <UInputMenu v-model="city" :items="cities" class="w-full" data-testid="input-menu" />
        </UFormField>
        <UFormField label="City" help="hover">
          <div data-demo="hover">
            <UInputMenu default-value="Novi Sad" :items="cities" class="w-full" />
          </div>
        </UFormField>
        <UFormField label="City" help="focus">
          <UInputMenu default-value="Novi Sad" :items="cities" class="w-full" data-demo="focus" />
        </UFormField>
        <UFormField label="City" help="Set by the organizer.">
          <UInputMenu default-value="Subotica" :items="cities" disabled class="w-full" />
        </UFormField>
        <UFormField label="City" required error="Choose the city you are coming from.">
          <UInputMenu :items="cities" class="w-full" />
        </UFormField>
        <UFormField label="City" help="Loading the cities.">
          <UInputMenu default-value="Niš" :items="cities" loading class="w-full" />
        </UFormField>
      </div>
    </GalleryRow>

    <GalleryRow label="several values">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
        <UFormField label="Cities" help="Each city chosen is a tag.">
          <UInputMenu v-model="several" :items="cities" multiple class="w-full" />
        </UFormField>
        <UFormField label="Cities" help="focus">
          <UInputMenu
            :default-value="['Belgrade', 'Niš']"
            :items="cities"
            multiple
            class="w-full"
            data-demo="focus"
          />
        </UFormField>
        <UFormField label="Cities" required error="Choose at most two cities.">
          <UInputMenu
            :default-value="['Belgrade', 'Niš', 'Čačak']"
            :items="cities"
            multiple
            class="w-full"
          />
        </UFormField>
      </div>
    </GalleryRow>

    <!-- each size with an icon and without, as the field's paddings differ on the side of an icon -->
    <GalleryRow label="sizes">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2">
        <template v-for="size in sizes" :key="size">
          <UFormField :size="size" label="City" :help="`size ${size}`">
            <UInputMenu
              default-value="Kragujevac"
              :items="cities"
              icon="i-lucide-map-pin"
              class="w-full"
            />
          </UFormField>
          <UFormField :size="size" label="Cities" :help="`size ${size}, several values`">
            <UInputMenu
              :default-value="['Belgrade', 'Niš']"
              :items="cities"
              multiple
              class="w-full"
            />
          </UFormField>
        </template>
      </div>
    </GalleryRow>

    <GalleryRow label="variants">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
        <UFormField v-for="variant in variants" :key="variant" label="City" :help="variant">
          <UInputMenu default-value="Zrenjanin" :items="cities" :variant="variant" class="w-full" />
        </UFormField>
      </div>
    </GalleryRow>
  </GallerySection>
</template>
