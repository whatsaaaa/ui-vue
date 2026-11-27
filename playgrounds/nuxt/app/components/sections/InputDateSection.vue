<script setup lang="ts">
import { CalendarDate, Time } from '@internationalized/date'

const props = defineProps<{ component: 'input-date' | 'input-time' }>()

const UInputDate = resolveComponent('UInputDate')
const UInputTime = resolveComponent('UInputTime')
const field = computed(() => (props.component === 'input-date' ? UInputDate : UInputTime))
const date = props.component === 'input-date'

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const variants = ['outline', 'subtle', 'soft', 'ghost'] as const

/** The value of a field, a date or a time, which each example takes as its own. */
const value = () => (date ? new CalendarDate(2027, 5, 10) : new Time(9, 30))
const arrival = shallowRef(value())
const range = shallowRef(
  date
    ? { start: new CalendarDate(2027, 5, 10), end: new CalendarDate(2027, 5, 12) }
    : { start: new Time(9, 30), end: new Time(11, 0) },
)

const label = date ? 'Arrival' : 'Start'
// a calendar and a clock, the icons the app names
const icon = date ? 'i-lucide-calendar' : 'i-lucide-clock'
</script>

<template>
  <GallerySection
    :id="component"
    :title="date ? 'UInputDate' : 'UInputTime'"
    :lead="
      date
        ? 'A date typed a part at a time: the day, the month and the year are each a segment of the field, the one with the focus on the interactive tint. The arrow keys change the segment with the focus and move from one to the next.'
        : 'A time typed a part at a time, as the date field: the hour, the minute and the half of the day are each a segment, the one with the focus on the interactive tint. The arrow keys change the segment with the focus and move from one to the next.'
    "
  >
    <!-- the segments are the month, a slash, the day: the focus on the third is on the day -->
    <GalleryRow label="states">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
        <UFormField :label="label" help="As on your ticket.">
          <component
            :is="field"
            v-model="arrival"
            :icon="icon"
            :data-testid="component"
            class="w-full"
          />
        </UFormField>
        <UFormField :label="label" help="hover">
          <div data-demo="hover">
            <component :is="field" :default-value="value()" :icon="icon" class="w-full" />
          </div>
        </UFormField>
        <UFormField :label="label" :help="date ? 'focus, on the day' : 'focus, on the minute'">
          <GalleryPart part="[data-slot=segment]" :index="2" :attrs="{ 'data-demo': 'focus' }">
            <component :is="field" :default-value="value()" :icon="icon" class="w-full" />
          </GalleryPart>
        </UFormField>
        <UFormField :label="label" help="Set by the organizer.">
          <component :is="field" :default-value="value()" :icon="icon" disabled class="w-full" />
        </UFormField>
        <UFormField
          :label="label"
          required
          :error="date ? 'Choose a day of the conference.' : 'Choose a time of the conference.'"
        >
          <component :is="field" :icon="icon" class="w-full" />
        </UFormField>
        <UFormField :label="label" help="Checking the schedule.">
          <component :is="field" :default-value="value()" :icon="icon" loading class="w-full" />
        </UFormField>
      </div>
    </GalleryRow>

    <!-- two dates and the line between them are wider than a phone's narrowest screen: the
         example scrolls inside itself there, as a wide matrix of the gallery does -->
    <GalleryRow label="range">
      <div class="-mx-4 w-[calc(100%+2rem)] overflow-x-auto px-4 lg:mx-0 lg:w-full lg:px-0">
        <div class="grid w-full min-w-fit gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
          <UFormField :label="date ? 'Stay' : 'Session'" help="From the first to the last.">
            <component :is="field" v-model="range" range :icon="icon" class="w-full" />
          </UFormField>
        </div>
      </div>
    </GalleryRow>

    <!-- each size with an icon and without, as the field's paddings differ on the side of an icon -->
    <GalleryRow label="sizes">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2">
        <template v-for="size in sizes" :key="size">
          <UFormField :size="size" :label="label" :help="`size ${size}`">
            <component :is="field" :default-value="value()" :icon="icon" class="w-full" />
          </UFormField>
          <UFormField :size="size" :label="label" :help="`size ${size}, no icon`">
            <component :is="field" :default-value="value()" class="w-full" />
          </UFormField>
        </template>
      </div>
    </GalleryRow>

    <GalleryRow label="variants">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
        <UFormField v-for="variant in variants" :key="variant" :label="label" :help="variant">
          <component
            :is="field"
            :default-value="value()"
            :icon="icon"
            :variant="variant"
            class="w-full"
          />
        </UFormField>
      </div>
    </GalleryRow>
  </GallerySection>
</template>
