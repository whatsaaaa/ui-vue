<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { ref } from 'vue'

/*
 * Nuxt UI's color mode on Vue is VueUse's, which names the system's setting auto. Unlike the
 * useDark of Nuxt UI's plugin it puts a light class on <html> as well as a dark one, which the
 * tokens need to tell a chosen light theme from the system's.
 */
const { store: colorMode, state: theme } = useColorMode()

/** Chooses the other theme from the one on show, with the color mode, which remembers it. */
function switchTheme() {
  colorMode.value = theme.value === 'dark' ? 'light' : 'dark'
}

const modes = [
  { label: 'system', value: 'auto' },
  { label: 'dark', value: 'dark' },
  { label: 'light', value: 'light' },
]

const cities = ['Amsterdam', 'Berlin', 'Dublin', 'Lisbon', 'Vienna']

const name = ref('Maya Collins')
const email = ref('maya@example')
const city = ref('Lisbon')
const terms = ref(true)
</script>

<template>
  <UApp>
    <main class="mx-auto flex max-w-xl flex-col gap-8 py-6 lg:py-10">
      <header class="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 class="font-mono text-h2-compact lg:text-h2">ui-vue on Vue</h1>
          <p class="mt-1 text-body-sm text-text-secondary">
            The same theme, through the options of Nuxt UI's Vite plugin.
          </p>
        </div>
        <UButton
          color="neutral"
          variant="outline"
          icon="i-lucide-sun-moon"
          label="Theme"
          @click="switchTheme"
        />
      </header>

      <URadioGroup
        v-model="colorMode"
        legend="Nuxt UI color mode"
        orientation="horizontal"
        :items="modes"
        data-testid="color-mode"
      />

      <UCard description="Harbour Conf 2027, Lisbon.">
        <template #title>
          <h2>Registration</h2>
        </template>
        <div class="flex flex-col gap-6">
          <UFormField label="Full name" help="As on your ID.">
            <UInput v-model="name" class="w-full" />
          </UFormField>
          <UFormField
            label="Email address"
            required
            error="Enter an email address with a domain, such as maya@example.com."
          >
            <UInput v-model="email" type="email" class="w-full" />
          </UFormField>
          <UFormField label="City" help="Where the conference takes place.">
            <USelect v-model="city" :items="cities" class="w-full" />
          </UFormField>
          <UCheckbox v-model="terms" label="I accept the terms of use" />
        </div>
        <template #footer>
          <div class="flex flex-wrap items-center justify-between gap-3">
            <UBadge color="info" label="pending" />
            <div class="flex flex-wrap gap-3">
              <UButton color="neutral" variant="outline" label="Cancel" />
              <UButton label="Register" />
            </div>
          </div>
        </template>
      </UCard>
    </main>
  </UApp>
</template>
