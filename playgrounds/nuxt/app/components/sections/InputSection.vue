<script setup lang="ts">
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
// none has no look of its own: it is the field inside another control, such as a select menu's
// search, whose focus that control shows
const variants = ['outline', 'subtle', 'soft', 'ghost'] as const

const name = ref('Milica Petrović')
const email = ref('milica@primer')
</script>

<template>
  <GallerySection
    id="input"
    title="UInput"
    lead="Polje uzoraka: visina 40 piksela, vrednost u Inter pismu, obrub boje polja. Natpis je mono, napomena stoji ispod polja, a greška je reč sa ikonom. Bez placeholdera."
  >
    <GalleryRow label="stanja">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
        <UFormField label="Ime i prezime" help="Kao na ličnoj karti.">
          <UInput v-model="name" class="w-full" />
        </UFormField>
        <UFormField label="Ime i prezime" help="hover">
          <UInput v-model="name" class="w-full" data-demo="hover" />
        </UFormField>
        <UFormField label="Ime i prezime" help="fokus">
          <UInput v-model="name" class="w-full" data-demo="focus" />
        </UFormField>
        <UFormField label="Ime i prezime" help="Popunjava organizator.">
          <UInput model-value="Milica Petrović" class="w-full" disabled />
        </UFormField>
        <UFormField
          label="Imejl adresa"
          required
          error="Unesite imejl adresu sa domenom, na primer milica@primer.rs."
        >
          <UInput v-model="email" type="email" class="w-full" />
        </UFormField>
        <UFormField label="Imejl adresa" help="Proveravamo da li je adresa slobodna.">
          <UInput
            model-value="milica@primer.rs"
            type="email"
            icon="i-lucide-mail"
            loading
            class="w-full"
          />
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
          <UInput model-value="Novi Sad" icon="i-lucide-map-pin" class="w-full" />
        </UFormField>
      </div>
    </GalleryRow>

    <GalleryRow label="varijante">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
        <UFormField v-for="variant in variants" :key="variant" label="Grad" :help="variant">
          <UInput model-value="Kragujevac" :variant="variant" class="w-full" />
        </UFormField>
      </div>
    </GalleryRow>
  </GallerySection>
</template>
