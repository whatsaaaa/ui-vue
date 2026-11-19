<script setup lang="ts">
const cities = ['Amsterdam', 'Berlin', 'Copenhagen', 'Dublin', 'Lisbon', 'Oslo', 'Prague', 'Vienna']
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

const days = [
  { type: 'label' as const, label: 'Conference' },
  { label: 'Day one, May 10', value: 'day-1' },
  { label: 'Day two, May 11', value: 'day-2' },
  { type: 'separator' as const },
  { type: 'label' as const, label: 'Workshops' },
  { label: 'Day three, May 12', value: 'day-3' },
  { label: "Speakers' dinner", value: 'dinner', disabled: true },
]

const city = ref('Lisbon')
const day = ref('day-1')
const menuCity = ref('Berlin')
const menuCities = ref(['Oslo', 'Vienna'])
</script>

<template>
  <GallerySection
    id="select"
    title="USelect, USelectMenu"
    lead="The trigger is a field. The list opens on a panel with a border and no shadow: the hovered option is raised, the chosen one marked in the interactive color. USelectMenu adds a search at the top of the list. Their specs' examples, with the lists open, are on the open page."
  >
    <GalleryRow label="states">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
        <UFormField label="City" help="Where the conference takes place.">
          <USelect v-model="city" :items="cities" class="w-full" />
        </UFormField>
        <UFormField label="City" help="hover">
          <USelect v-model="city" :items="cities" class="w-full" data-demo="hover" />
        </UFormField>
        <UFormField label="City" help="focus">
          <USelect v-model="city" :items="cities" class="w-full" data-demo="focus" />
        </UFormField>
        <UFormField label="City" help="Set by the organizer.">
          <USelect model-value="Oslo" :items="cities" class="w-full" disabled />
        </UFormField>
        <UFormField label="Day" required error="Choose the day you are registering for.">
          <USelect :items="days" placeholder="Choose a day" class="w-full" />
        </UFormField>
        <UFormField label="City" help="Loading the cities.">
          <USelect model-value="Berlin" :items="cities" loading class="w-full" />
        </UFormField>
      </div>
    </GalleryRow>

    <GalleryRow label="groups in the list">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
        <UFormField label="Day" help="Options in groups, one of them disabled.">
          <USelect v-model="day" :items="days" class="w-full" data-testid="select-days" />
        </UFormField>
      </div>
    </GalleryRow>

    <GalleryRow label="USelectMenu">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
        <UFormField label="City" help="Search by the city's name.">
          <USelectMenu
            v-model="menuCity"
            :items="cities"
            class="w-full"
            data-testid="select-menu"
          />
        </UFormField>
        <!-- a search field the app passes takes the place of the default one: it keeps the icon
             by passing it with its placeholder -->
        <UFormField
          label="Cities"
          help="Several cities at once, the search naming what it searches."
        >
          <USelectMenu
            v-model="menuCities"
            :items="cities"
            multiple
            :search-input="{ placeholder: 'Search the cities', icon: 'i-lucide-search' }"
            class="w-full"
          />
        </UFormField>
        <UFormField label="City" help="focus, nothing chosen yet">
          <USelectMenu
            :items="cities"
            placeholder="Choose a city"
            class="w-full"
            data-demo="focus"
          />
        </UFormField>
      </div>
    </GalleryRow>

    <GalleryRow label="sizes">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
        <UFormField
          v-for="size in sizes"
          :key="size"
          :size="size"
          label="City"
          :help="`size ${size}`"
        >
          <USelect model-value="Dublin" :items="cities" class="w-full" />
        </UFormField>
      </div>
    </GalleryRow>
  </GallerySection>
</template>
