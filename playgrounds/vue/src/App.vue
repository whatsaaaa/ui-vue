<script setup lang="ts">
import { toggleTheme } from '@whatsaaaa/design-system/theme'
import { useColorMode } from '@vueuse/core'
import { ref } from 'vue'

// Nuxt UI's color mode on Vue is VueUse's, which names the system's setting auto.
const { store: colorMode } = useColorMode()

const modes = [
  { label: 'sistem', value: 'auto' },
  { label: 'tamna', value: 'dark' },
  { label: 'svetla', value: 'light' },
]

const cities = ['Beograd', 'Novi Sad', 'Niš', 'Kragujevac', 'Subotica']

const name = ref('Milica Petrović')
const email = ref('milica@primer')
const city = ref('Novi Sad')
const terms = ref(true)
</script>

<template>
  <UApp>
    <main class="mx-auto flex max-w-xl flex-col gap-8 py-6 lg:py-10">
      <header class="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 class="font-mono text-h2-compact lg:text-h2">ui-vue na Vue-u</h1>
          <p class="mt-1 text-body-sm text-text-secondary">
            Ista tema, kroz opcije Vite dodatka Nuxt UI-ja.
          </p>
        </div>
        <UButton
          color="neutral"
          variant="outline"
          icon="i-lucide-sun-moon"
          label="Tema"
          @click="toggleTheme"
        />
      </header>

      <URadioGroup
        v-model="colorMode"
        legend="Režim boja Nuxt UI-ja"
        orientation="horizontal"
        :items="modes"
        data-testid="color-mode"
      />

      <UCard title="Prijava" description="Harbour Conf 2027, Novi Sad.">
        <div class="flex flex-col gap-6">
          <UFormField label="Ime i prezime" help="Kao na ličnoj karti.">
            <UInput v-model="name" class="w-full" />
          </UFormField>
          <UFormField
            label="Imejl adresa"
            required
            error="Unesite imejl adresu sa domenom, na primer milica@primer.rs."
          >
            <UInput v-model="email" type="email" class="w-full" />
          </UFormField>
          <UFormField label="Grad" help="Gde se održava konferencija.">
            <USelect v-model="city" :items="cities" class="w-full" />
          </UFormField>
          <UCheckbox v-model="terms" label="Prihvatam uslove korišćenja" />
        </div>
        <template #footer>
          <div class="flex flex-wrap items-center justify-between gap-3">
            <UBadge color="info" label="na čekanju" />
            <div class="flex flex-wrap gap-3">
              <UButton color="neutral" variant="outline" label="Otkaži" />
              <UButton label="Prijavi se" />
            </div>
          </div>
        </template>
      </UCard>
    </main>
  </UApp>
</template>
