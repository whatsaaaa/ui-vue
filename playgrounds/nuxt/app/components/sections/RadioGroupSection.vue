<script setup lang="ts">
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

const payments = [
  { label: 'Card', value: 'card', description: 'Pay now, by card on the site.' },
  { label: 'Bank transfer', value: 'transfer', description: 'Pay within five days.' },
  { label: 'Cash', value: 'cash', description: 'At the door, on the first day.' },
]
const tickets = ['One day', 'Two days', 'All three days']
const sessions = ['Morning', 'Afternoon', 'Evening']

const payment = ref('card')
const ticket = ref('All three days')
</script>

<template>
  <GallerySection
    id="radio-group"
    title="URadioGroup"
    lead="A circle with a dot, checked in the interactive color. The group's name is a field label in mono, its options are in Inter."
  >
    <GalleryRow label="states" align="start">
      <GalleryItem caption="default">
        <URadioGroup v-model="payment" legend="Payment" :items="payments" />
      </GalleryItem>
      <GalleryItem caption="hover">
        <URadioGroup legend="Ticket" :items="['One day']" data-demo="hover" />
      </GalleryItem>
      <GalleryItem caption="focus">
        <URadioGroup legend="Ticket" :items="['One day']" data-demo="focus" />
      </GalleryItem>
      <GalleryItem caption="disabled">
        <URadioGroup model-value="Two days" legend="Ticket" :items="tickets" disabled />
      </GalleryItem>
      <GalleryItem caption="error">
        <UFormField name="ticket" error="Choose a ticket.">
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
        <URadioGroup
          :size="size"
          model-value="Two days"
          :legend="`Ticket, ${size}`"
          :items="tickets.slice(0, 2)"
        />
      </GalleryItem>
    </GalleryRow>
  </GallerySection>
</template>
