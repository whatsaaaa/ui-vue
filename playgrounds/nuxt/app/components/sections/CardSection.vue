<script setup lang="ts">
const variants = ['outline', 'subtle', 'soft', 'solid'] as const
</script>

<template>
  <GallerySection
    id="card"
    title="UCard"
    lead="Panel sistema: površina, obrub i veliki radijus, delovi odvojeni linijom. Naslov je manji naslov u mono pismu."
  >
    <GalleryRow label="varijante">
      <div class="grid w-full gap-6 md:grid-cols-2">
        <UCard
          v-for="variant in variants"
          :key="variant"
          :variant="variant"
          title="Harbour Conf 2027"
          :description="`Novi Sad, 10-12. maj 2027. Varijanta ${variant}.`"
        >
          <p class="text-body-sm">
            Tri dana predavanja i radionica u Novom Sadu, od 10. do 12. maja 2027. Prijave su
            otvorene do 1. aprila.
          </p>
          <!-- A solid card is the text color: controls drawn for the page do not read on it. -->
          <template v-if="variant !== 'solid'" #footer>
            <div class="flex flex-wrap justify-end gap-3">
              <UButton color="neutral" variant="ghost" label="Kasnije" />
              <UButton label="Prijavi se" />
            </div>
          </template>
        </UCard>
      </div>
    </GalleryRow>

    <GalleryRow label="samo telo">
      <div class="w-full max-w-md">
        <UCard>
          <p class="text-body-sm">
            Kartica bez zaglavlja i podnožja ima samo telo, sa istim razmakom do ivica.
          </p>
        </UCard>
      </div>
    </GalleryRow>
  </GallerySection>
</template>
