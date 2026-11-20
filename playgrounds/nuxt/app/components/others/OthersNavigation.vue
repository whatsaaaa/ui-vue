<script setup lang="ts">
const crumbs = [
  { label: 'Home', icon: 'i-lucide-house', to: '#navigation' },
  { label: 'Workshops', to: '#navigation' },
  { label: 'Forms that check themselves' },
]

const commands = [
  {
    id: 'pages',
    label: 'Pages',
    items: [
      { label: 'Registrations', icon: 'i-lucide-ticket', kbds: ['G', 'R'] },
      { label: 'Workshops', icon: 'i-lucide-presentation' },
      { label: 'Settings', icon: 'i-lucide-settings', suffix: 'Account' },
    ],
  },
  {
    id: 'people',
    label: 'People',
    items: [
      { label: 'Milica Jovanović', avatar: { alt: 'Milica Jovanović' } },
      { label: 'Nikola Petrović', avatar: { alt: 'Nikola Petrović' } },
    ],
  },
]

const columns = [
  {
    label: 'Conference',
    children: [
      { label: 'Program', to: '#navigation' },
      { label: 'Speakers', to: '#navigation' },
      { label: 'Venue', to: '#navigation' },
    ],
  },
  {
    label: 'Help',
    children: [
      { label: 'Questions', to: '#navigation' },
      { label: 'Code of conduct', to: '#navigation' },
    ],
  },
]

const menu = [
  { label: 'Program', icon: 'i-lucide-calendar', to: '#navigation', active: true },
  {
    label: 'Workshops',
    icon: 'i-lucide-presentation',
    children: [
      { label: 'Forms', description: 'Fields that check themselves', to: '#navigation' },
      { label: 'Tables', description: 'Rows, sorting and paging', to: '#navigation' },
    ],
  },
  { label: 'Speakers', icon: 'i-lucide-mic', to: '#navigation', badge: '20' },
]

const steps = [
  { title: 'About you', description: 'Name and email', icon: 'i-lucide-user' },
  { title: 'Your visit', description: 'Days and meals', icon: 'i-lucide-calendar' },
  { title: 'Review', description: 'Check and send', icon: 'i-lucide-check' },
]
</script>

<template>
  <OthersSample name="UBreadcrumb">
    <UBreadcrumb :items="crumbs" />
  </OthersSample>

  <OthersSample name="UCommandPalette">
    <UCommandPalette
      :groups="commands"
      placeholder="Search pages and people"
      :autofocus="false"
      class="h-80 w-full max-w-md rounded-lg border-thin border-border"
    />
  </OthersSample>

  <OthersSample name="UFooterColumns">
    <UFooterColumns :columns="columns" class="w-full max-w-md" />
  </OthersSample>

  <OthersSample name="ULink">
    <ULink to="#navigation" class="text-body">See the program</ULink>
    <ULink to="#navigation" active class="text-body">The page you are on</ULink>
    <ULink disabled class="text-body">Registration is closed</ULink>
  </OthersSample>

  <OthersSample name="UNavigationMenu">
    <UNavigationMenu :items="menu" class="w-full" />
    <UNavigationMenu :items="menu" orientation="vertical" class="w-56" />
  </OthersSample>

  <OthersSample name="UPagination">
    <UPagination :total="100" :default-page="3" />
  </OthersSample>

  <OthersSample name="UStepper">
    <UStepper :items="steps" :default-value="1" class="w-full max-w-2xl" />
  </OthersSample>
</template>
