<script setup lang="ts">
const questions = [
  { label: 'What do I need to bring?', content: 'A laptop and its charger.', value: 'bring' },
  { label: 'Can I cancel?', content: 'Up to a week before the first day.', value: 'cancel' },
  { label: 'Is lunch included?', content: 'On all three days.', value: 'lunch' },
]

const talks = [
  { title: 'Forms that check themselves', speaker: 'Milica Jovanović' },
  { title: 'Tokens in three tiers', speaker: 'Nikola Petrović' },
  { title: 'A table that scrolls', speaker: 'Jelena Marković' },
  { title: 'Focus, the short version', speaker: 'Stefan Ilić' },
]

const registrations = [
  { day: 'Mon', seats: 4 },
  { day: 'Tue', seats: 7 },
  { day: 'Wed', seats: 5 },
  { day: 'Thu', seats: 11 },
  { day: 'Fri', seats: 9 },
]

const sponsors = ['Dunav Logistika', 'Avala Studio', 'Morava Tech', 'Kopaonik Software']

const attendees = [
  'Milica Jovanović',
  'Nikola Petrović',
  'Jelena Marković',
  'Stefan Ilić',
  'Ana Đorđević',
  'Marko Nikolić',
  'Ivana Stojanović',
  'Luka Pavlović',
]

const history = [
  { date: 'Mar 3', title: 'Registered', description: 'All three days', icon: 'i-lucide-ticket' },
  { date: 'Mar 4', title: 'Paid', description: '€420.00 by card', icon: 'i-lucide-credit-card' },
  { date: 'May 10', title: 'Checked in', description: 'Belgrade', icon: 'i-lucide-map-pin' },
]

const files = [
  {
    label: 'app',
    defaultExpanded: true,
    children: [
      { label: 'pages', children: [{ label: 'index.vue', icon: 'i-lucide-file' }] },
      { label: 'app.vue', icon: 'i-lucide-file' },
    ],
  },
  { label: 'nuxt.config.ts', icon: 'i-lucide-file' },
]
</script>

<template>
  <OthersSample name="UAccordion">
    <UAccordion :items="questions" default-value="bring" class="w-full max-w-md" />
  </OthersSample>

  <OthersSample name="UCarousel">
    <!-- The arrows stand beside the slides and the dots under them, in the room left here. -->
    <div class="w-full max-w-xl px-12 pb-8">
      <UCarousel v-slot="{ item }" :items="talks" arrows dots :ui="{ item: 'basis-1/2' }">
        <div class="rounded-lg border-thin border-border p-4">
          <p class="font-mono text-label">{{ item.title }}</p>
          <p class="mt-1 text-body-sm text-text-secondary">{{ item.speaker }}</p>
        </div>
      </UCarousel>
    </div>
  </OthersSample>

  <OthersSample name="UChart">
    <UChart
      type="bar"
      :data="registrations"
      index="day"
      :categories="[{ key: 'seats', label: 'Registrations' }]"
      :height="200"
      aria-label="Registrations a day"
      class="w-full max-w-md"
    />
  </OthersSample>

  <OthersSample name="UEmpty">
    <UEmpty
      icon="i-lucide-inbox"
      title="No registrations yet"
      description="They show here as they come in."
      :actions="[{ label: 'Invite', icon: 'i-lucide-plus' }]"
    />
  </OthersSample>

  <OthersSample name="UMarquee">
    <!-- On the page color, which the marquee fades into at both ends. -->
    <UMarquee pause-on-hover class="w-full max-w-xl rounded-lg bg-bg py-3">
      <span v-for="sponsor in sponsors" :key="sponsor" class="font-mono text-label">
        {{ sponsor }}
      </span>
    </UMarquee>
  </OthersSample>

  <OthersSample name="UScrollArea">
    <UScrollArea
      v-slot="{ item }"
      :items="attendees"
      class="h-40 w-64 rounded-lg border-thin border-border"
    >
      <p class="border-b-thin border-border px-3 py-2 text-body-sm">{{ item }}</p>
    </UScrollArea>
  </OthersSample>

  <OthersSample name="UTimeline">
    <UTimeline :items="history" :default-value="1" class="w-72" />
  </OthersSample>

  <OthersSample name="UTree">
    <UTree :items="files" class="w-56" />
  </OthersSample>

  <OthersSample name="UUser">
    <UUser name="Milica Jovanović" description="Belgrade" :avatar="{ alt: 'Milica Jovanović' }" />
    <UUser
      name="Nikola Petrović"
      description="Novi Sad"
      :avatar="{ alt: 'Nikola Petrović' }"
      :chip="{ color: 'success' }"
      size="lg"
    />
  </OthersSample>
</template>
