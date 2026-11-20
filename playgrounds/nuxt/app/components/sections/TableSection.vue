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
  {
    name: 'Maya Collins',
    city: 'Lisbon',
    ticket: 'All three days',
    fee: '€420.00',
    status: 'paid',
  },
  { name: 'Daniel Brooks', city: 'Berlin', ticket: 'Two days', fee: '€320.00', status: 'pending' },
  { name: 'Priya Shah', city: 'Dublin', ticket: 'One day', fee: '€180.00', status: 'paid' },
  {
    name: 'Tom Fischer',
    city: 'Vienna',
    ticket: 'All three days',
    fee: '€420.00',
    status: 'cancelled',
  },
]

const statusColor = {
  paid: 'success',
  pending: 'info',
  cancelled: 'error',
} as const

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UCheckbox = resolveComponent('UCheckbox')

const columns: TableColumn<Registration>[] = [
  { accessorKey: 'name', header: 'Full name' },
  { accessorKey: 'city', header: 'City' },
  { accessorKey: 'ticket', header: 'Ticket' },
  // an amount, at the end of its column in figures of one width, under its name
  {
    accessorKey: 'fee',
    header: 'Fee',
    meta: { class: { th: 'text-end', td: 'text-end tabular-nums' } },
    cell: ({ row }) => h('span', { 'data-slot': 'amount' }, row.original.fee),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) =>
      h(UBadge, { color: statusColor[row.original.status], label: row.original.status }),
  },
]

/**
 * The columns of a table whose rows are chosen: a checkbox in each row's first cell, named for
 * the row, and one in the head that chooses every row. The checkbox of the row at the index
 * focused shows the focus with data-demo, and the row draws its ring around it: marked on the
 * example, every checkbox and the frame would show it too.
 */
function choosing(focused?: number): TableColumn<Registration>[] {
  return [
    {
      id: 'select',
      header: ({ table }) =>
        h(UCheckbox, {
          modelValue: table.getIsSomePageRowsSelected()
            ? 'indeterminate'
            : table.getIsAllPageRowsSelected(),
          'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
            table.toggleAllPageRowsSelected(!!value),
          'aria-label': 'Choose every registration',
        }),
      cell: ({ row }) =>
        h(UCheckbox, {
          modelValue: row.getIsSelected(),
          'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
          'aria-label': `Choose ${row.original.name}`,
          ...(row.index === focused && { 'data-demo': 'focus' }),
        }),
    },
    ...columns,
  ]
}

// built once: columns built again on each render would draw every cell again, and take the focus
// from the checkbox that changed
const choosable = choosing()
const choosableFocused = choosing(0)

// a row's own action at its end, a stop of its own, which rings itself and not its row
const action: TableColumn<Registration> = {
  id: 'action',
  header: 'Action',
  cell: ({ row }) =>
    h(UButton, {
      color: 'primary',
      variant: 'link',
      size: 'sm',
      label: 'Edit',
      'aria-label': `Edit ${row.original.name}`,
    }),
}
const choosableWithAction = [...choosable, action]

/*
 * Pinned columns, which the table spec does not draw: the checkbox stays at the start and the
 * action at the end while the columns between them scroll under both. Its first row shows the
 * focus, whose ring runs over the pinned cells too.
 */
const pinnedFocused = [...choosableFocused, action]
const pinning = { left: ['select'], right: ['action'] }

const rows = data.slice(0, 3)

// Each example chooses its own rows: the selected one its first, the others none.
const selection = {
  rest: ref<Record<string, boolean>>({}),
  hover: ref<Record<string, boolean>>({}),
  focus: ref<Record<string, boolean>>({}),
  selected: ref<Record<string, boolean>>({ 0: true }),
  action: ref<Record<string, boolean>>({}),
  pinned: ref<Record<string, boolean>>({}),
}
</script>

<template>
  <GallerySection
    id="table"
    title="UTable"
    lead="The table of the system's prose: in a border with the large radius, scrolling inside itself. The head is on the surface, as an overline; a cell is small body text, and an amount sits at the end of its column in figures of one width. A row is chosen by the checkbox in its first cell: it is raised under the pointer, takes the selection color once chosen, and is ringed inside while its checkbox has the focus."
  >
    <GalleryRow label="rest">
      <UTable data-spec="table.plain.rest" :data="data" :columns="columns" class="w-full" />
    </GalleryRow>

    <GalleryRow label="focus">
      <UTable
        data-spec="table.plain.focus"
        data-demo="focus"
        :data="rows"
        :columns="columns"
        class="w-full"
      />
    </GalleryRow>

    <GalleryRow label="selectable">
      <UTable
        v-model:row-selection="selection.rest.value"
        data-spec="table.selectable.rest"
        :data="rows"
        :columns="choosable"
        class="w-full"
      />
    </GalleryRow>

    <GalleryRow label="selectable: hover">
      <UTable
        v-model:row-selection="selection.hover.value"
        data-spec="table.selectable.hover"
        data-demo="hover"
        :data="rows"
        :columns="choosable"
        class="w-full"
      />
    </GalleryRow>

    <GalleryRow label="selectable: focus">
      <UTable
        v-model:row-selection="selection.focus.value"
        data-spec="table.selectable.focus"
        :data="rows"
        :columns="choosableFocused"
        class="w-full"
      />
    </GalleryRow>

    <GalleryRow label="selectable: selected">
      <UTable
        v-model:row-selection="selection.selected.value"
        data-spec="table.selectable.selected"
        :data="rows"
        :columns="choosable"
        class="w-full"
      />
    </GalleryRow>

    <GalleryRow label="selectable, with an action">
      <UTable
        v-model:row-selection="selection.action.value"
        data-testid="table-action"
        :data="rows"
        :columns="choosableWithAction"
        class="w-full"
      />
    </GalleryRow>

    <!-- narrower than its columns, so they scroll -->
    <GalleryRow label="pinned columns: focus">
      <UTable
        v-model:row-selection="selection.pinned.value"
        data-testid="table-pinned"
        :column-pinning="pinning"
        :data="rows"
        :columns="pinnedFocused"
        class="w-full max-w-xl"
      />
    </GalleryRow>

    <GalleryRow label="loading, empty">
      <div class="grid w-full gap-6 lg:grid-cols-2">
        <UTable
          data-spec="table.plain.loading"
          :data="data.slice(0, 2)"
          :columns="columns.slice(0, 3)"
          loading
          class="w-full"
        />
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
