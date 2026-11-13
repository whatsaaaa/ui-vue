<script setup lang="ts">
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const terms = ref(true)
const news = ref(false)
const all = ref<boolean | 'indeterminate'>('indeterminate')
</script>

<template>
  <GallerySection
    id="checkbox"
    title="UCheckbox"
    lead="Kvadrat od 20 piksela sa najmanjim radijusom, obrub boje polja. Štikliran je ispunjen interaktivnom bojom. Natpis je opcija, pa je u Inter pismu, na liniji na kojoj stoji kvadrat."
  >
    <GalleryRow label="stanja">
      <GalleryItem caption="nije štikliran">
        <UCheckbox v-model="news" label="Šaljite mi novosti" />
      </GalleryItem>
      <GalleryItem caption="štikliran">
        <UCheckbox v-model="terms" label="Prihvatam uslove korišćenja" />
      </GalleryItem>
      <GalleryItem caption="delimično">
        <UCheckbox v-model="all" label="Svi dani" />
      </GalleryItem>
      <GalleryItem caption="hover">
        <UCheckbox label="Šaljite mi novosti" data-demo="hover" />
      </GalleryItem>
      <GalleryItem caption="fokus">
        <UCheckbox label="Šaljite mi novosti" data-demo="focus" />
      </GalleryItem>
      <GalleryItem caption="onemogućen">
        <UCheckbox label="Šaljite mi novosti" disabled />
      </GalleryItem>
      <GalleryItem caption="onemogućen, štikliran">
        <UCheckbox :model-value="true" label="Prihvatam uslove" disabled />
      </GalleryItem>
    </GalleryRow>

    <GalleryRow label="sa opisom i greškom">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2">
        <UCheckbox
          label="Treba mi smeštaj"
          description="Javićemo vam se sa ponudom hotela u blizini."
        />
        <UFormField name="terms" required error="Prijava je moguća tek kada prihvatite uslove.">
          <UCheckbox label="Prihvatam uslove korišćenja" required />
        </UFormField>
      </div>
    </GalleryRow>

    <GalleryRow label="kartica">
      <div class="grid w-full gap-4 md:grid-cols-2">
        <UCheckbox
          variant="card"
          :model-value="true"
          label="Radionica: Vue u praksi"
          description="12. maj, od 10 do 14 časova."
        />
        <UCheckbox
          variant="card"
          label="Radionica: pristupačnost"
          description="12. maj, od 15 do 18 časova."
        />
      </div>
    </GalleryRow>

    <GalleryRow label="veličine">
      <GalleryItem v-for="size in sizes" :key="size" :caption="size">
        <UCheckbox :size="size" :model-value="true" label="Prihvatam" />
      </GalleryItem>
    </GalleryRow>
  </GallerySection>
</template>
