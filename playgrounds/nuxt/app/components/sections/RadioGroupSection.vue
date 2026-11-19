<script setup lang="ts">
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

const payments = [
  { label: 'Card', value: 'card', description: 'Pay now, by card on the site.' },
  { label: 'Bank transfer', value: 'transfer', description: 'Pay within five days.' },
  { label: 'Cash', value: 'cash', description: 'At the door, on the first day.' },
]
const tickets = ['One day', 'Two days', 'All three days']
const sessions = ['Morning', 'Afternoon', 'Evening']

// none is checked to begin with, as the content rules of the spec ask
const method = ref<string>()
const payment = ref('card')
const ticket = ref('All three days')

/** The example of the radio group spec a group is, by its id: radio-group.list.hover. */
const specOf = (state: string, size = 'md') =>
  ['radio-group', 'list', state, ...(size === 'md' ? [] : [size])].join('.')
</script>

<template>
  <GallerySection
    id="radio-group"
    title="URadioGroup"
    lead="A circle with a dot, checked in the interactive color. The group's name is a field label in mono, its options are in Inter."
  >
    <!--
      the examples of a state show the same group, so that only the state tells them apart; the
      pointer and the focus are on one option at a time, so the examples of them have one
    -->
    <GalleryRow label="states" align="start">
      <GalleryItem caption="rest">
        <URadioGroup
          v-model="method"
          legend="Payment"
          :items="payments"
          :data-spec="specOf('rest')"
        />
      </GalleryItem>
      <GalleryItem caption="hover">
        <URadioGroup
          legend="Payment"
          :items="payments.slice(0, 1)"
          data-demo="hover"
          :data-spec="specOf('hover')"
        />
      </GalleryItem>
      <GalleryItem caption="focus">
        <URadioGroup
          legend="Payment"
          :items="payments.slice(0, 1)"
          data-demo="focus"
          :data-spec="specOf('focus')"
        />
      </GalleryItem>
      <GalleryItem caption="checked">
        <URadioGroup
          model-value="card"
          legend="Payment"
          :items="payments"
          :data-spec="specOf('checked')"
        />
      </GalleryItem>
      <GalleryItem caption="disabled">
        <URadioGroup
          model-value="transfer"
          legend="Payment"
          :items="payments"
          disabled
          :data-spec="specOf('disabled')"
        />
      </GalleryItem>
      <GalleryItem caption="invalid">
        <UFormField name="ticket" error="Choose a ticket." :data-spec="specOf('invalid')">
          <URadioGroup legend="Ticket" :items="tickets" required />
        </UFormField>
      </GalleryItem>
    </GalleryRow>

    <GalleryRow label="horizontal">
      <URadioGroup v-model="ticket" legend="Ticket" orientation="horizontal" :items="tickets" />
    </GalleryRow>

    <GalleryRow label="cards and table">
      <div class="grid w-full gap-6 lg:grid-cols-2">
        <URadioGroup v-model="payment" legend="Payment" variant="card" :items="payments" />
        <URadioGroup v-model="payment" legend="Payment" variant="table" :items="payments" />
      </div>
    </GalleryRow>

    <GalleryRow label="cards without the circle, with an error">
      <UFormField name="session" error="Choose a session." class="w-full">
        <URadioGroup
          legend="Session"
          variant="card"
          indicator="hidden"
          orientation="horizontal"
          :items="sessions"
          required
        />
      </UFormField>
    </GalleryRow>

    <GalleryRow label="sizes" align="start">
      <GalleryItem v-for="size in sizes" :key="size" :caption="size">
        <div class="flex flex-col gap-5">
          <URadioGroup
            :size="size"
            :legend="`Ticket, ${size}`"
            :items="tickets.slice(0, 2)"
            :data-spec="specOf('rest', size)"
          />
          <URadioGroup
            :size="size"
            model-value="Two days"
            :legend="`Ticket, ${size}`"
            :items="tickets.slice(0, 2)"
            :data-spec="specOf('checked', size)"
          />
        </div>
      </GalleryItem>
    </GalleryRow>
  </GallerySection>
</template>
