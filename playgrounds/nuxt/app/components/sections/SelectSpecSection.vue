<script setup lang="ts">
const props = defineProps<{ component: 'select' | 'select-menu' }>()

const USelect = resolveComponent('USelect')
const USelectMenu = resolveComponent('USelectMenu')
const field = computed(() => (props.component === 'select' ? USelect : USelectMenu))

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

const cities = ['Amsterdam', 'Berlin', 'Copenhagen', 'Dublin', 'Lisbon', 'Oslo', 'Prague', 'Vienna']

// an open list opens on its chosen option and highlights it: the first, as the spec draws it.
// The options are chosen by their value, value-key="value", as a select does by default.
const days = [
  { type: 'label' as const, label: 'Conference' },
  { label: 'Day one, May 10', value: 'day-1' },
  { label: 'Day two, May 11', value: 'day-2' },
  { type: 'separator' as const },
  { type: 'label' as const, label: 'Workshops' },
  { label: 'Day three, May 12', value: 'day-3' },
  { label: "Speakers' dinner", value: 'dinner', disabled: true },
]

/** The example of the spec a select is, by its id: select.outline.hover. */
const specOf = (state: string, size = 'md') =>
  [props.component, 'outline', state, ...(size === 'md' ? [] : [size])].join('.')
</script>

<template>
  <GallerySection
    :id="component"
    :title="component === 'select' ? 'USelect' : 'USelectMenu'"
    :lead="
      component === 'select'
        ? 'The examples of the select spec: the trigger in each state and size, and its list open under it.'
        : 'The examples of the select menu spec: the trigger in each state and size, and its list open under it, with the search at its top.'
    "
  >
    <!-- the element with the example's id wraps the select, its trigger and its list, never its form field -->
    <GalleryRow label="states">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
        <UFormField label="City" help="Where the conference takes place.">
          <div :data-spec="specOf('rest')">
            <component :is="field" model-value="Lisbon" :items="cities" class="w-full" />
          </div>
        </UFormField>
        <UFormField label="City" help="hover">
          <div :data-spec="specOf('hover')" data-demo="hover">
            <component :is="field" model-value="Lisbon" :items="cities" class="w-full" />
          </div>
        </UFormField>
        <UFormField label="City" help="focus">
          <div :data-spec="specOf('focus')" data-demo="focus">
            <component :is="field" model-value="Lisbon" :items="cities" class="w-full" />
          </div>
        </UFormField>
        <UFormField label="City" help="Set by the organizer.">
          <div :data-spec="specOf('disabled')">
            <component :is="field" model-value="Oslo" :items="cities" class="w-full" disabled />
          </div>
        </UFormField>
        <UFormField label="City" help="Loading the cities.">
          <div :data-spec="specOf('loading')">
            <component :is="field" model-value="Berlin" :items="cities" loading class="w-full" />
          </div>
        </UFormField>
      </div>
    </GalleryRow>

    <!-- nothing chosen and no placeholder, as the system uses none: the error says what to choose -->
    <GalleryRow label="invalid">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
        <UFormField label="Day" required error="Choose the day you are registering for.">
          <div :data-spec="specOf('invalid')">
            <component
              :is="field"
              :items="days"
              value-key="value"
              icon="i-lucide-calendar"
              class="w-full"
            />
          </div>
        </UFormField>
        <UFormField label="Day" required error="Choose the day you are registering for.">
          <div :data-spec="specOf('invalid')">
            <component :is="field" :items="days" value-key="value" class="w-full" />
          </div>
        </UFormField>
      </div>
    </GalleryRow>

    <!-- each size with an icon and without, as the spec's paddings differ on the side of an icon -->
    <GalleryRow label="sizes">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2">
        <template v-for="size in sizes" :key="size">
          <UFormField :size="size" label="City" :help="`size ${size}`">
            <div :data-spec="specOf('rest', size)">
              <component
                :is="field"
                model-value="Dublin"
                :items="cities"
                icon="i-lucide-map-pin"
                class="w-full"
              />
            </div>
          </UFormField>
          <UFormField :size="size" label="City" :help="`size ${size}, no icon`">
            <div :data-spec="specOf('rest', size)">
              <component :is="field" model-value="Dublin" :items="cities" class="w-full" />
            </div>
          </UFormField>
        </template>
      </div>
    </GalleryRow>

    <GalleryRow label="invalid sizes">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2">
        <template v-for="size in sizes" :key="size">
          <UFormField
            :size="size"
            label="Day"
            required
            error="Choose the day you are registering for."
          >
            <div :data-spec="specOf('invalid', size)">
              <component
                :is="field"
                :items="days"
                value-key="value"
                icon="i-lucide-calendar"
                class="w-full"
              />
            </div>
          </UFormField>
          <UFormField
            :size="size"
            label="Day"
            required
            error="Choose the day you are registering for."
          >
            <div :data-spec="specOf('invalid', size)">
              <component :is="field" :items="days" value-key="value" class="w-full" />
            </div>
          </UFormField>
        </template>
      </div>
    </GalleryRow>

    <GalleryRow label="open" align="start">
      <div class="grid w-full items-start gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
        <UFormField
          v-for="size in sizes"
          :key="size"
          :size="size"
          label="Day"
          :help="`size ${size}`"
        >
          <GalleryOpen :data-spec="specOf('open', size)">
            <component
              :is="field"
              model-value="day-1"
              :items="days"
              value-key="value"
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
