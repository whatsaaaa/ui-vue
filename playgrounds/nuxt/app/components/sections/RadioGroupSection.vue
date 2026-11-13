<script setup lang="ts">
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

const payments = [
  { label: 'Kartica', value: 'card', description: 'Plaćanje odmah, karticom na sajtu.' },
  { label: 'Uplatnica', value: 'slip', description: 'Uplata u roku od pet dana.' },
  { label: 'Gotovina', value: 'cash', description: 'Na ulazu, prvog dana.' },
]
const tickets = ['Jedan dan', 'Dva dana', 'Sva tri dana']

const payment = ref('card')
const ticket = ref('Sva tri dana')
</script>

<template>
  <GallerySection
    id="radio-group"
    title="URadioGroup"
    lead="Krug sa tačkom, štikliran u interaktivnoj boji. Ime grupe je natpis polja u mono pismu, opcije su u Inter pismu."
  >
    <GalleryRow label="stanja" align="start">
      <GalleryItem caption="podrazumevano">
        <URadioGroup v-model="payment" legend="Način plaćanja" :items="payments" />
      </GalleryItem>
      <GalleryItem caption="hover">
        <URadioGroup legend="Kotizacija" :items="['Jedan dan']" data-demo="hover" />
      </GalleryItem>
      <GalleryItem caption="fokus">
        <URadioGroup legend="Kotizacija" :items="['Jedan dan']" data-demo="focus" />
      </GalleryItem>
      <GalleryItem caption="onemogućeno">
        <URadioGroup model-value="Dva dana" legend="Kotizacija" :items="tickets" disabled />
      </GalleryItem>
      <GalleryItem caption="greška">
        <UFormField name="ticket" error="Izaberite kotizaciju.">
          <URadioGroup legend="Kotizacija" :items="tickets" required />
        </UFormField>
      </GalleryItem>
    </GalleryRow>

    <GalleryRow label="vodoravno">
      <URadioGroup v-model="ticket" legend="Kotizacija" orientation="horizontal" :items="tickets" />
    </GalleryRow>

    <GalleryRow label="kartice i tabela">
      <div class="grid w-full gap-6 lg:grid-cols-2">
        <URadioGroup v-model="payment" legend="Način plaćanja" variant="card" :items="payments" />
        <URadioGroup v-model="payment" legend="Način plaćanja" variant="table" :items="payments" />
      </div>
    </GalleryRow>

    <GalleryRow label="veličine" align="start">
      <GalleryItem v-for="size in sizes" :key="size" :caption="size">
        <URadioGroup
          :size="size"
          model-value="Dva dana"
          :legend="`Kotizacija, ${size}`"
          :items="tickets.slice(0, 2)"
        />
      </GalleryItem>
    </GalleryRow>
  </GallerySection>
</template>
