<script setup lang="ts">
import { CalendarDate, Time } from '@internationalized/date'

const days = ref(['fri', 'sat'])
const dayItems = [
  { label: 'Friday', value: 'fri', description: 'Talks' },
  { label: 'Saturday', value: 'sat', description: 'Talks' },
  { label: 'Sunday', value: 'sun', description: 'Workshops' },
]

const color = ref('#9ccfd8')
const arrival = shallowRef(new CalendarDate(2027, 5, 9))
const start = shallowRef(new Time(9, 30))
const city = ref('Belgrade')
const cities = ['Belgrade', 'Novi Sad', 'Niš', 'Kragujevac', 'Subotica']
const rating = ref(4)
const topics = ref(['forms', 'accessibility'])
const code = ref(['4', '2'])
const track = ref('systems')
const tracks = [
  { label: 'Design systems', value: 'systems' },
  { label: 'Forms', value: 'forms' },
  { label: 'Accessibility', value: 'accessibility' },
  { label: 'Tooling', value: 'tooling' },
]
const budget = ref(40)

const state = reactive({ name: 'Milica Jovanović', email: 'milica@example.com' })
</script>

<template>
  <OthersSample name="UCheckboxGroup">
    <UCheckboxGroup v-model="days" legend="Days" :items="dayItems" />
  </OthersSample>

  <OthersSample name="UColorPicker">
    <UColorPicker v-model="color" />
  </OthersSample>

  <OthersSample name="UFileUpload">
    <UFileUpload
      label="Drop your ticket here"
      description="PDF or PNG, up to 2 MB"
      accept="application/pdf,image/png"
      class="w-72"
    />
  </OthersSample>

  <OthersSample name="UForm">
    <UForm :state="state" class="flex w-72 flex-col gap-4">
      <UFormField label="Full name" name="name">
        <UInput v-model="state.name" class="w-full" />
      </UFormField>
      <UFormField label="Email address" name="email">
        <UInput v-model="state.email" type="email" class="w-full" />
      </UFormField>
      <UButton type="submit" label="Save" class="self-start" />
    </UForm>
  </OthersSample>

  <OthersSample name="UInputDate">
    <UFormField label="Arrival">
      <UInputDate v-model="arrival" />
    </UFormField>
  </OthersSample>

  <OthersSample name="UInputMenu">
    <UFormField label="City" class="w-56">
      <UInputMenu v-model="city" :items="cities" class="w-full" />
    </UFormField>
  </OthersSample>

  <OthersSample name="UInputRating">
    <UFormField label="How was the workshop?">
      <UInputRating v-model="rating" />
    </UFormField>
  </OthersSample>

  <OthersSample name="UInputTags">
    <UFormField label="Topics" class="w-72">
      <UInputTags v-model="topics" class="w-full" />
    </UFormField>
  </OthersSample>

  <OthersSample name="UInputTime">
    <UFormField label="Start">
      <UInputTime v-model="start" />
    </UFormField>
  </OthersSample>

  <OthersSample name="UListbox">
    <UListbox v-model="track" :items="tracks" value-key="value" class="w-56" aria-label="Track" />
  </OthersSample>

  <OthersSample name="UPinInput">
    <UFormField label="Code from the email">
      <UPinInput v-model="code" :length="4" />
    </UFormField>
  </OthersSample>

  <OthersSample name="USlider">
    <USlider v-model="budget" class="w-56" aria-label="Budget" />
  </OthersSample>

  <OthersSample name="USwitch">
    <USwitch
      label="Email me the schedule"
      description="One message, a week before."
      :default-value="true"
    />
    <USwitch label="Lunch" :default-value="false" />
  </OthersSample>
</template>
