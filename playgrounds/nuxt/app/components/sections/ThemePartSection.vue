<script setup lang="ts">
/*
 * A part for each page theme, in the other one. The design system's ws-theme-dark and
 * ws-theme-light show the one for the page's theme, from the first paint.
 */
const parts = [
  { page: 'dark', theme: 'light' },
  { page: 'light', theme: 'dark' },
] as const

const cities = ['Beograd', 'Kragujevac', 'Niš', 'Novi Sad', 'Subotica']
const delivery = [
  { label: 'Courier', value: 'courier', description: 'Two working days.' },
  { label: 'Pickup point', value: 'pickup', description: 'Collect it within a week.' },
]

const name = ref('Jelena Petrović')
const email = ref('jelena@example')
const city = ref('Novi Sad')
const method = ref('courier')
const updates = ref(true)
</script>

<template>
  <GallerySection
    id="theme-part"
    title=".dark, .light"
    lead="A dark or light class on an element puts what is inside it in that theme, as data-theme does: the tokens, the dark: and light: variants and Nuxt UI's colors. This part has the class of the other theme from the page's, and switches with it."
  >
    <div v-for="part in parts" :key="part.theme" :class="`ws-theme-${part.page}`" class="max-w-2xl">
      <div
        :class="part.theme"
        class="rounded-xl border border-border bg-bg p-4 text-text lg:p-8"
        data-testid="theme-part"
      >
        <p class="font-mono text-label text-text-secondary">
          class="{{ part.theme }}", in the <span class="light:hidden">dark</span
          ><span class="dark:hidden">light</span> theme
        </p>
        <UCard class="mt-4" title="Delivery address" description="Order 2027-0412, to Serbia.">
          <div class="flex flex-col gap-6">
            <UFormField label="Full name">
              <UInput v-model="name" class="w-full" />
            </UFormField>
            <UFormField
              label="Email address"
              required
              error="Enter an email address with a domain, such as jelena@example.rs."
            >
              <UInput v-model="email" type="email" class="w-full" />
            </UFormField>
            <UFormField label="City" help="Delivery within Serbia only.">
              <!--
                The list opens in the part, in its theme: at the end of the page it would take the
                page's. There it is raised over the fields after it.
              -->
              <USelect
                v-model="city"
                :items="cities"
                :portal="false"
                :ui="{ content: 'z-10' }"
                class="w-full"
              />
            </UFormField>
            <URadioGroup v-model="method" legend="Delivery" :items="delivery" />
            <UCheckbox v-model="updates" label="Send me delivery updates" />
          </div>
          <template #footer>
            <div class="flex flex-wrap items-center justify-between gap-3">
              <UBadge color="success" variant="subtle" label="in stock" />
              <div class="flex flex-wrap gap-3">
                <UButton color="neutral" variant="outline" label="Back" />
                <UButton label="Place order" />
              </div>
            </div>
          </template>
        </UCard>
      </div>
    </div>
  </GallerySection>
</template>
