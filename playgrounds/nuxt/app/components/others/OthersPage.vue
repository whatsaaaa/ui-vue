<script setup lang="ts">
const fields = [
  { name: 'email', type: 'email' as const, label: 'Email address', required: true },
  { name: 'password', type: 'password' as const, label: 'Password', required: true },
  { name: 'remember', type: 'checkbox' as const, label: 'Remember me' },
]

const posts = [
  {
    title: 'How we check a form',
    description: 'Notes from the first workshop, and what we would change.',
    date: '2027-03-12',
    badge: 'Notes',
    authors: [{ name: 'Milica Jovanović', avatar: { alt: 'Milica Jovanović' } }],
    to: '#page',
  },
  {
    title: 'The program is out',
    description: 'Three days, twenty talks and four workshops in Belgrade.',
    date: '2027-02-20',
    badge: 'News',
    authors: [{ name: 'Nikola Petrović', avatar: { alt: 'Nikola Petrović' } }],
    to: '#page',
  },
]

const versions = [
  {
    title: 'Tables and tabs',
    description: 'The table and the tabs follow their specs.',
    date: '2026-11-19',
    badge: '0.14.0',
  },
  {
    title: 'Badge and card',
    description: 'The badge is the tag of the system, the card its panel.',
    date: '2026-11-18',
    badge: '0.13.0',
  },
]

const anchors = [
  { label: 'Program', icon: 'i-lucide-calendar', to: '#page' },
  { label: 'Speakers', icon: 'i-lucide-mic', to: '#page' },
  { label: 'Venue', icon: 'i-lucide-map-pin', to: '#page' },
]

const community = [
  { label: 'Edit this page', icon: 'i-lucide-pencil', to: '#page' },
  { label: 'Ask a question', icon: 'i-lucide-message-circle', to: '#page' },
]

const features = [
  { title: 'Talks', description: 'Twenty, over two days.', icon: 'i-lucide-mic' },
  { title: 'Workshops', description: 'Four, on the third day.', icon: 'i-lucide-presentation' },
  { title: 'Lunch', description: 'Included on all three days.', icon: 'i-lucide-utensils' },
]

const sponsors = ['Dunav Logistika', 'Avala Studio', 'Morava Tech', 'Kopaonik Software']

const plans = [
  {
    title: 'Talks',
    description: 'The first two days.',
    price: '€280',
    billingCycle: '/person',
    features: ['Twenty talks', 'Lunch', 'The recordings'],
    button: { label: 'Register', color: 'neutral' as const, variant: 'outline' as const },
  },
  {
    title: 'All three days',
    description: 'The talks and a workshop.',
    price: '€420',
    billingCycle: '/person',
    badge: 'Most chosen',
    highlight: true,
    features: ['Twenty talks', 'One workshop', 'Lunch', 'The recordings'],
    button: { label: 'Register' },
  },
]

const tiers = [
  { id: 'talks', title: 'Talks', price: '€280', button: { label: 'Register' } },
  { id: 'all', title: 'All three days', price: '€420', button: { label: 'Register' } },
]

const comparison = [
  {
    title: 'What you get',
    features: [
      { title: 'Talks', tiers: { talks: 20, all: 20 } },
      { title: 'A workshop', tiers: { talks: false, all: true } },
      { title: 'Lunch', tiers: { talks: 'Two days', all: 'Three days' } },
    ],
  },
]
</script>

<template>
  <OthersSample name="UAuthForm">
    <UAuthForm
      class="w-full max-w-sm"
      title="Sign in"
      description="Use the email you registered with."
      icon="i-lucide-lock"
      :fields="fields"
      :providers="[{ label: 'Continue with a passkey', icon: 'i-lucide-key-round' }]"
      :submit="{ label: 'Sign in' }"
    />
  </OthersSample>

  <OthersSample name="UBlogPost" :with="['UBlogPosts']">
    <UBlogPosts class="w-full">
      <UBlogPost v-for="post in posts" :key="post.title" v-bind="post" />
    </UBlogPosts>
  </OthersSample>

  <OthersSample name="UChangelogVersion" :with="['UChangelogVersions']">
    <UChangelogVersions class="w-full">
      <UChangelogVersion v-for="version in versions" :key="version.badge" v-bind="version" />
    </UChangelogVersions>
  </OthersSample>

  <OthersSample name="UPage" :with="['UPageAside', 'UPageBody']">
    <OthersScreen>
      <UPage class="px-6">
        <template #left>
          <UPageAside>
            <UPageAnchors :links="anchors" />
          </UPageAside>
        </template>
        <UPageBody>
          <p class="text-body-sm">The body of the page, beside what stands at its side.</p>
        </UPageBody>
      </UPage>
    </OthersScreen>
  </OthersSample>

  <OthersSample name="UPageAnchors">
    <UPageAnchors :links="anchors" class="w-56" />
  </OthersSample>

  <OthersSample name="UPageCard" :with="['UPageGrid']">
    <UPageGrid class="w-full">
      <UPageCard
        title="Talks"
        description="Twenty, over two days."
        icon="i-lucide-mic"
        to="#page"
      />
      <UPageCard
        variant="subtle"
        title="Workshops"
        description="Four, on the third day."
        icon="i-lucide-presentation"
      />
      <UPageCard
        variant="soft"
        title="Lunch"
        description="Included on all three days."
        icon="i-lucide-utensils"
      />
    </UPageGrid>
  </OthersSample>

  <OthersSample name="UPageColumns">
    <UPageColumns class="w-full">
      <UPageCard
        v-for="feature in features"
        :key="feature.title"
        v-bind="feature"
        variant="subtle"
      />
    </UPageColumns>
  </OthersSample>

  <OthersSample name="UPageCTA">
    <UPageCTA
      class="w-full"
      title="Ready to register?"
      description="Seats are limited to forty."
      :links="[
        { label: 'Register' },
        { label: 'Ask a question', color: 'neutral', variant: 'subtle' },
      ]"
    />
  </OthersSample>

  <OthersSample name="UPageFeature">
    <UPageFeature
      class="w-72"
      title="The recordings"
      description="Every talk, a week after the conference."
      icon="i-lucide-video"
    />
  </OthersSample>

  <OthersSample name="UPageHeader">
    <UPageHeader
      class="w-full"
      headline="Program"
      title="Workshops"
      description="Four workshops on the third day, each for ten people."
      :links="[{ label: 'Register', icon: 'i-lucide-ticket' }]"
    />
  </OthersSample>

  <OthersSample name="UPageHero">
    <UPageHero
      class="w-full"
      headline="Belgrade, May 10 to 12, 2027"
      title="Sava Conf 2027"
      description="Three days on forms, tables and the people who use them."
      :links="[
        { label: 'Register' },
        { label: 'See the program', color: 'neutral', variant: 'outline' },
      ]"
    />
  </OthersSample>

  <OthersSample name="UPageLinks">
    <UPageLinks title="Community" :links="community" class="w-56" />
  </OthersSample>

  <OthersSample name="UPageList">
    <UPageList divide class="w-full max-w-sm">
      <UPageCard
        v-for="feature in features"
        :key="feature.title"
        v-bind="feature"
        variant="ghost"
      />
    </UPageList>
  </OthersSample>

  <OthersSample name="UPageLogos">
    <UPageLogos title="With the support of" class="w-full">
      <span v-for="sponsor in sponsors" :key="sponsor" class="font-mono text-label">
        {{ sponsor }}
      </span>
    </UPageLogos>
  </OthersSample>

  <OthersSample name="UPageSection">
    <UPageSection
      class="w-full"
      headline="What you get"
      title="Three days in Belgrade"
      description="Everything is in one place, by the river."
      :features="features"
    />
  </OthersSample>

  <OthersSample name="UPricingPlan" :with="['UPricingPlans']">
    <UPricingPlans class="w-full">
      <UPricingPlan v-for="plan in plans" :key="plan.title" v-bind="plan" />
    </UPricingPlans>
  </OthersSample>

  <OthersSample name="UPricingTable">
    <UPricingTable :tiers="tiers" :sections="comparison" class="w-full" />
  </OthersSample>
</template>
