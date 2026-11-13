<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

interface Registration {
  name: string
  city: string
  ticket: string
  fee: string
  status: 'plaćeno' | 'na čekanju' | 'otkazano'
}

const data: Registration[] = [
  {
    name: 'Milica Petrović',
    city: 'Novi Sad',
    ticket: 'Sva tri dana',
    fee: '18.000 RSD',
    status: 'plaćeno',
  },
  {
    name: 'Đorđe Jovanović',
    city: 'Beograd',
    ticket: 'Dva dana',
    fee: '13.500 RSD',
    status: 'na čekanju',
  },
  {
    name: 'Jelena Šćepanović',
    city: 'Niš',
    ticket: 'Jedan dan',
    fee: '7.500 RSD',
    status: 'plaćeno',
  },
  {
    name: 'Nikola Ćirić',
    city: 'Subotica',
    ticket: 'Sva tri dana',
    fee: '18.000 RSD',
    status: 'otkazano',
  },
]

const statusColor = {
  plaćeno: 'success',
  'na čekanju': 'info',
  otkazano: 'error',
} as const

const UBadge = resolveComponent('UBadge')

const columns: TableColumn<Registration>[] = [
  { accessorKey: 'name', header: 'Ime i prezime' },
  { accessorKey: 'city', header: 'Grad' },
  { accessorKey: 'ticket', header: 'Kotizacija' },
  { accessorKey: 'fee', header: 'Iznos' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) =>
      h(UBadge, { color: statusColor[row.original.status], label: row.original.status }),
  },
]
</script>

<template>
  <GallerySection
    id="table"
    title="UTable"
    lead="Tabela iz proze sistema: u obrubu sa velikim radijusom, skroluje unutar sebe. Zaglavlje je na površini, kao nadnaslov; ćelija je mali tekst tela."
  >
    <GalleryRow label="podaci">
      <UTable :data="data" :columns="columns" class="w-full" />
    </GalleryRow>

    <GalleryRow label="učitava, prazna">
      <div class="grid w-full gap-6 lg:grid-cols-2">
        <UTable :data="data.slice(0, 2)" :columns="columns.slice(0, 3)" loading class="w-full" />
        <UTable
          :data="[]"
          :columns="columns.slice(0, 3)"
          class="w-full"
          empty="Još nema prijava."
        />
      </div>
    </GalleryRow>
  </GallerySection>
</template>
