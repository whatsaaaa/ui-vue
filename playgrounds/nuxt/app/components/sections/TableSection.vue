<script setup lang="ts">
import type { TableColumn, TableRow } from '@nuxt/ui'

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
  // an amount, at the right edge in figures of one width
  {
    accessorKey: 'fee',
    header: 'Fee',
    meta: { class: { th: 'text-end', td: 'text-end tabular-nums' } },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) =>
      h(UBadge, { color: statusColor[row.original.status], label: row.original.status }),
  },
]

// A table whose rows are chosen by a click, Enter or Space. The second row starts selected.
const selection = ref<Record<string, boolean>>({ 1: true })

function toggle(_event: Event, row: TableRow<Registration>) {
  row.toggleSelected()
}

/*
 * Its first row shows hover and its third focus, as the other examples do with data-demo. The
 * table draws its rows itself, so the attribute is set on them once they are there.
 */
const selectable = useTemplateRef<{ $el: HTMLElement }>('selectable')
onMounted(() => {
  const rows = selectable.value?.$el.querySelectorAll('tbody > tr')
  rows?.[0]?.setAttribute('data-demo', 'hover')
  rows?.[2]?.setAttribute('data-demo', 'focus')
})
</script>

<template>
  <GallerySection
    id="table"
    title="UTable"
    lead="The table of the system's prose: in a border with the large radius, scrolling inside itself. The head is on the surface, as an overline; a cell is small body text, and an amount sits at the right edge in figures of one width. A selected row is raised, and a row that can be chosen is half raised under the pointer and ringed inside when focused."
  >
    <GalleryRow label="data">
      <UTable :data="data" :columns="columns" class="w-full" />
    </GalleryRow>

    <GalleryRow label="selectable: hover, selected, focus">
      <UTable
        ref="selectable"
        v-model:row-selection="selection"
        :data="data.slice(0, 3)"
        :columns="columns"
        class="w-full"
        @select="toggle"
      />
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
