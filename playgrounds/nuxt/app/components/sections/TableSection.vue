<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

interface Registration {
  name: string
  city: string
  ticket: string
  fee: string
  status: 'paid' | 'pending' | 'cancelled'
}

const data: Registration[] = [
  { name: 'Maya Collins', city: 'Lisbon', ticket: 'All three days', fee: '€420', status: 'paid' },
  { name: 'Daniel Brooks', city: 'Berlin', ticket: 'Two days', fee: '€320', status: 'pending' },
  { name: 'Priya Shah', city: 'Dublin', ticket: 'One day', fee: '€180', status: 'paid' },
  {
    name: 'Tom Fischer',
    city: 'Vienna',
    ticket: 'All three days',
    fee: '€420',
    status: 'cancelled',
  },
]

const statusColor = {
  paid: 'success',
  pending: 'info',
  cancelled: 'error',
} as const

const UBadge = resolveComponent('UBadge')

const columns: TableColumn<Registration>[] = [
  { accessorKey: 'name', header: 'Full name' },
  { accessorKey: 'city', header: 'City' },
  { accessorKey: 'ticket', header: 'Ticket' },
  { accessorKey: 'fee', header: 'Fee' },
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
    lead="The table of the system's prose: in a border with the large radius, scrolling inside itself. The head is on the surface, as an overline; a cell is small body text."
  >
    <GalleryRow label="data">
      <UTable :data="data" :columns="columns" class="w-full" />
    </GalleryRow>

    <GalleryRow label="loading, empty">
      <div class="grid w-full gap-6 lg:grid-cols-2">
        <UTable :data="data.slice(0, 2)" :columns="columns.slice(0, 3)" loading class="w-full" />
        <UTable
          :data="[]"
          :columns="columns.slice(0, 3)"
          class="w-full"
          empty="No registrations yet."
        />
      </div>
    </GalleryRow>
  </GallerySection>
</template>
