<script setup lang="ts">
const colors = ['primary', 'neutral', 'success', 'info', 'warning', 'error'] as const
const variants = ['solid', 'outline', 'soft', 'subtle', 'ghost', 'link'] as const
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

const labels = {
  primary: 'Sačuvaj',
  neutral: 'Otkaži',
  success: 'Potvrdi',
  info: 'Detalji',
  warning: 'Proveri',
  error: 'Obriši',
}
</script>

<template>
  <GallerySection
    id="button"
    title="UButton"
    lead="Natpis u mono pismu, obrub boje polja ili ispuna interaktivne boje, visina polja. Onemogućeno dugme je bledo u svakoj varijanti."
  >
    <GalleryRow label="boje i varijante">
      <GalleryMatrix
        v-slot="{ row, column }"
        :rows="colors"
        :columns="variants"
        label="Dugmad u svakoj boji i varijanti"
      >
        <UButton :color="row" :variant="column" :label="labels[row]" />
      </GalleryMatrix>
    </GalleryRow>

    <GalleryRow label="veličine">
      <GalleryItem v-for="size in sizes" :key="size" :caption="size">
        <UButton :size="size" label="Sačuvaj" />
      </GalleryItem>
    </GalleryRow>

    <GalleryRow label="sa ikonom">
      <GalleryItem caption="ikona ispred">
        <UButton icon="i-lucide-send" label="Pošalji" />
      </GalleryItem>
      <GalleryItem caption="ikona iza">
        <UButton
          trailing-icon="i-lucide-arrow-right"
          color="neutral"
          variant="outline"
          label="Dalje"
        />
      </GalleryItem>
      <GalleryItem v-for="size in sizes" :key="size" :caption="`samo ikona, ${size}`">
        <UButton
          :size="size"
          icon="i-lucide-trash-2"
          color="neutral"
          variant="outline"
          aria-label="Obriši"
        />
      </GalleryItem>
    </GalleryRow>

    <GalleryRow label="stanja">
      <GalleryItem caption="podrazumevano">
        <UButton label="Sačuvaj" />
      </GalleryItem>
      <GalleryItem caption="hover">
        <UButton label="Sačuvaj" data-demo="hover" />
      </GalleryItem>
      <GalleryItem caption="fokus">
        <UButton label="Sačuvaj" data-demo="focus" />
      </GalleryItem>
      <GalleryItem caption="onemogućeno">
        <UButton label="Sačuvaj" disabled />
      </GalleryItem>
      <GalleryItem caption="učitava">
        <UButton label="Čuvanje" loading />
      </GalleryItem>
    </GalleryRow>

    <GalleryRow label="stanja, obrub">
      <GalleryItem caption="podrazumevano">
        <UButton color="neutral" variant="outline" label="Otkaži" />
      </GalleryItem>
      <GalleryItem caption="hover">
        <UButton color="neutral" variant="outline" label="Otkaži" data-demo="hover" />
      </GalleryItem>
      <GalleryItem caption="fokus">
        <UButton color="neutral" variant="outline" label="Otkaži" data-demo="focus" />
      </GalleryItem>
      <GalleryItem caption="onemogućeno">
        <UButton color="neutral" variant="outline" label="Otkaži" disabled />
      </GalleryItem>
      <GalleryItem caption="učitava">
        <UButton color="neutral" variant="outline" label="Učitavanje" loading />
      </GalleryItem>
    </GalleryRow>

    <GalleryRow label="cela širina">
      <div class="w-full max-w-sm">
        <UButton block label="Prijavi se" />
      </div>
    </GalleryRow>
  </GallerySection>
</template>
