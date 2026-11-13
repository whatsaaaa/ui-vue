<script setup lang="ts">
const removeOpen = ref(false)
const name = ref('Milica Petrović')
</script>

<template>
  <GallerySection
    id="modal"
    title="UModal"
    lead="Prozor terminala: površina u obrubu sa radijusom prozora, bez senke. Zaglavlje je traka visine trake kartica, na boji stranice. Stranica iza je zatamnjena svojom bojom."
  >
    <GalleryRow label="otvaranje">
      <GalleryItem caption="potvrda">
        <UModal
          v-model:open="removeOpen"
          title="Brisanje prijave"
          description="Prijava Milice Petrović biće trajno obrisana."
        >
          <UButton color="error" variant="outline" icon="i-lucide-trash-2" label="Obriši prijavu" />
          <template #body>
            <p class="text-body-sm">
              Kotizacija se vraća na račun sa kog je uplaćena, u roku od pet radnih dana. Ovo ne
              može da se poništi.
            </p>
          </template>
          <template #footer>
            <UButton color="neutral" variant="outline" label="Otkaži" @click="removeOpen = false" />
            <UButton color="error" label="Obriši" @click="removeOpen = false" />
          </template>
        </UModal>
      </GalleryItem>
      <GalleryItem caption="sa obrascem">
        <UModal title="Izmena prijave">
          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-pencil"
            label="Izmeni prijavu"
          />
          <template #body>
            <div class="flex flex-col gap-6">
              <UFormField label="Ime i prezime" help="Kao na ličnoj karti.">
                <UInput v-model="name" class="w-full" />
              </UFormField>
              <UCheckbox label="Treba mi smeštaj" />
            </div>
          </template>
          <template #footer="{ close }">
            <UButton color="neutral" variant="outline" label="Otkaži" @click="close" />
            <UButton label="Sačuvaj" @click="close" />
          </template>
        </UModal>
      </GalleryItem>
    </GalleryRow>
  </GallerySection>
</template>
