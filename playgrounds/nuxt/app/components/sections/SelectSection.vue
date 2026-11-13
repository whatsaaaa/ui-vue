<script setup lang="ts">
const cities = [
  'Beograd',
  'Novi Sad',
  'Niš',
  'Kragujevac',
  'Subotica',
  'Zrenjanin',
  'Pančevo',
  'Čačak',
]
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

const days = [
  { type: 'label' as const, label: 'Konferencija' },
  { label: 'Prvi dan, 10. maj', value: 'day-1' },
  { label: 'Drugi dan, 11. maj', value: 'day-2' },
  { type: 'separator' as const },
  { type: 'label' as const, label: 'Radionice' },
  { label: 'Treći dan, 12. maj', value: 'day-3' },
  { label: 'Večera govornika', value: 'dinner', disabled: true },
]

const city = ref('Novi Sad')
const day = ref('day-1')
const menuCity = ref('Beograd')
const menuCities = ref(['Niš', 'Subotica'])
</script>

<template>
  <GallerySection
    id="select"
    title="USelect, USelectMenu"
    lead="Okidač je polje. Lista se otvara na panelu sa obrubom i bez senke: pređena opcija je izdignuta, izabrana je označena interaktivnom bojom. USelectMenu dodaje pretragu na vrh liste."
  >
    <GalleryRow label="stanja">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
        <UFormField label="Grad" help="Gde se održava konferencija.">
          <USelect v-model="city" :items="cities" class="w-full" />
        </UFormField>
        <UFormField label="Grad" help="hover">
          <USelect v-model="city" :items="cities" class="w-full" data-demo="hover" />
        </UFormField>
        <UFormField label="Grad" help="fokus">
          <USelect v-model="city" :items="cities" class="w-full" data-demo="focus" />
        </UFormField>
        <UFormField label="Grad" help="Određuje organizator.">
          <USelect model-value="Niš" :items="cities" class="w-full" disabled />
        </UFormField>
        <UFormField label="Dan" required error="Izaberite dan za koji se prijavljujete.">
          <USelect :items="days" class="w-full" />
        </UFormField>
        <UFormField label="Grad" help="Učitavamo gradove.">
          <USelect model-value="Beograd" :items="cities" loading class="w-full" />
        </UFormField>
      </div>
    </GalleryRow>

    <GalleryRow label="grupe u listi">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
        <UFormField label="Dan" help="Opcije u grupama, jedna onemogućena.">
          <USelect v-model="day" :items="days" class="w-full" data-testid="select-days" />
        </UFormField>
      </div>
    </GalleryRow>

    <GalleryRow label="USelectMenu">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
        <UFormField label="Grad" help="Pretraga po imenu grada.">
          <USelectMenu
            v-model="menuCity"
            :items="cities"
            class="w-full"
            data-testid="select-menu"
          />
        </UFormField>
        <UFormField label="Gradovi" help="Više gradova odjednom.">
          <USelectMenu v-model="menuCities" :items="cities" multiple class="w-full" />
        </UFormField>
        <UFormField label="Grad" help="fokus">
          <USelectMenu v-model="menuCity" :items="cities" class="w-full" data-demo="focus" />
        </UFormField>
      </div>
    </GalleryRow>

    <GalleryRow label="veličine">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
        <UFormField
          v-for="size in sizes"
          :key="size"
          :size="size"
          label="Grad"
          :help="`veličina ${size}`"
        >
          <USelect model-value="Subotica" :items="cities" class="w-full" />
        </UFormField>
      </div>
    </GalleryRow>
  </GallerySection>
</template>
