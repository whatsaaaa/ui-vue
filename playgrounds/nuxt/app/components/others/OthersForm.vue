<script setup lang="ts">
const days = ref(['fri', 'sat'])
const dayItems = [
  { label: 'Friday', value: 'fri', description: 'Talks' },
  { label: 'Saturday', value: 'sat', description: 'Talks' },
  { label: 'Sunday', value: 'sun', description: 'Workshops' },
]

const color = ref('#9ccfd8')
const rating = ref(4)
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

  <OthersSample name="UInputRating">
    <UFormField label="How was the workshop?">
      <UInputRating v-model="rating" />
    </UFormField>
  </OthersSample>

  <OthersSample name="UListbox">
    <UListbox v-model="track" :items="tracks" value-key="value" class="w-56" aria-label="Track" />
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
