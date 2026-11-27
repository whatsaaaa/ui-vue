<script setup lang="ts">
import type { InputNumberProps } from '@nuxt/ui'

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const variants = ['outline', 'subtle', 'soft', 'ghost'] as const

const tickets = ref(2)
const empty = ref<number>()
const fewest = ref(1)
const most = ref(14)

/**
 * The step buttons' names, which say what each does to which field: Nuxt UI's own say only
 * Decrement and Increment. A button takes its name as an attribute, which Nuxt UI's type of a
 * step button's props leaves out, with every other attribute of a button.
 */
const steps = (label: string) => ({
  decrement: { 'aria-label': `Decrease ${label}` } as InputNumberProps['decrement'],
  increment: { 'aria-label': `Increase ${label}` } as InputNumberProps['increment'],
})

/** The example of the number field spec a field is, by its id: number-field.outline.hover. */
const specOf = (state: string, size = 'md') =>
  ['number-field', 'outline', state, ...(size === 'md' ? [] : [size])].join('.')
</script>

<template>
  <GallerySection
    id="input-number"
    title="UInputNumber"
    lead="A number that is counted: the input's edge, height and value, the value in figures of one width, with a named step button inside the edge on each side. The buttons are no stops of the Tab key: the field's arrow keys step it. Each example holds a value inside its range, or none, so both buttons can step; the limits row shows a button at its limit, disabled. The placeholder row shows one an app passes anyway."
  >
    <GalleryRow label="states">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
        <UFormField label="Tickets" help="From 1 to 10." :data-spec="specOf('rest')">
          <UInputNumber v-model="tickets" :min="1" :max="10" v-bind="steps('Tickets')" />
        </UFormField>
        <UFormField label="Tickets" help="hover" :data-spec="specOf('hover')">
          <UInputNumber
            v-model="tickets"
            :min="1"
            :max="10"
            v-bind="steps('Tickets')"
            data-demo="hover"
          />
        </UFormField>
        <UFormField label="Tickets" help="focus" :data-spec="specOf('focus')">
          <UInputNumber
            v-model="tickets"
            :min="1"
            :max="10"
            v-bind="steps('Tickets')"
            data-demo="focus"
          />
        </UFormField>
        <UFormField label="Guests" help="Set by the organizer." :data-spec="specOf('disabled')">
          <UInputNumber :model-value="3" :min="1" :max="8" v-bind="steps('Guests')" disabled />
        </UFormField>
        <UFormField
          label="Tickets"
          required
          error="Enter a number from 1 to 10."
          :data-spec="specOf('invalid')"
        >
          <UInputNumber v-model="empty" :min="1" :max="10" v-bind="steps('Tickets')" />
        </UFormField>
      </div>
    </GalleryRow>

    <GalleryRow label="sizes">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2">
        <UFormField
          v-for="size in sizes"
          :key="size"
          :size="size"
          label="Tickets"
          :help="`size ${size}`"
          :data-spec="specOf('rest', size)"
        >
          <UInputNumber v-model="tickets" :min="1" :max="10" v-bind="steps('Tickets')" />
        </UFormField>
      </div>
    </GalleryRow>

    <GalleryRow label="invalid sizes">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2">
        <UFormField
          v-for="size in sizes"
          :key="size"
          :size="size"
          label="Tickets"
          required
          error="Enter a number from 1 to 10."
          :data-spec="specOf('invalid', size)"
        >
          <UInputNumber v-model="empty" :min="1" :max="10" v-bind="steps('Tickets')" />
        </UFormField>
      </div>
    </GalleryRow>

    <!-- outside the spec's examples: a step that would pass a limit is disabled, its icon faint -->
    <GalleryRow label="limits">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
        <UFormField label="Nights" help="at the minimum, 1">
          <UInputNumber v-model="fewest" :min="1" :max="14" v-bind="steps('Nights')" />
        </UFormField>
        <UFormField label="Nights" help="at the maximum, 14">
          <UInputNumber v-model="most" :min="1" :max="14" v-bind="steps('Nights')" />
        </UFormField>
      </div>
    </GalleryRow>

    <!-- the system uses none, but one an app passes anyway is the secondary text -->
    <GalleryRow label="placeholder">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
        <UFormField label="Guests" help="placeholder" :data-spec="specOf('rest')">
          <UInputNumber placeholder="How many" :min="1" :max="8" v-bind="steps('Guests')" />
        </UFormField>
      </div>
    </GalleryRow>

    <GalleryRow label="variants">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
        <UFormField v-for="variant in variants" :key="variant" label="Seats" :help="variant">
          <UInputNumber
            :model-value="4"
            :min="1"
            :max="8"
            :variant="variant"
            v-bind="steps('Seats')"
          />
        </UFormField>
      </div>
    </GalleryRow>
  </GallerySection>
</template>
