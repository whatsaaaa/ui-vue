<script setup lang="ts">
const actions = [
  [{ label: 'Profile', icon: 'i-lucide-user', kbds: ['meta', 'p'] }],
  [
    { label: 'Settings', icon: 'i-lucide-settings' },
    { label: 'Show the sidebar', type: 'checkbox' as const, checked: true },
  ],
  [{ label: 'Delete registration', icon: 'i-lucide-trash', color: 'error' as const }],
]

const toast = useToast()

function showToast() {
  toast.add({
    title: 'Registration saved',
    description: 'Milica Jovanović is on the list for all three days.',
    icon: 'i-lucide-circle-check',
    color: 'success',
    // it stays until it is closed
    duration: 0,
    actions: [{ label: 'Undo', color: 'neutral', variant: 'outline' }],
  })
}
</script>

<template>
  <OthersSample name="UContextMenu">
    <UContextMenu :items="actions">
      <div
        class="flex h-24 w-72 items-center justify-center rounded-lg border-thin border-dashed border-field-border text-body-sm text-text-secondary"
        data-testid="open-UContextMenu"
      >
        Right-click here
      </div>
    </UContextMenu>
  </OthersSample>

  <OthersSample name="UDrawer">
    <UDrawer
      title="Your ticket"
      description="Sava Conf 2027, Belgrade, May 10 to 12."
      :ui="{ body: 'text-body-sm' }"
    >
      <UButton
        label="Open the drawer"
        color="neutral"
        variant="outline"
        data-testid="open-UDrawer"
      />
      <template #body>
        <p>All three days, with lunch. Show this ticket at the door.</p>
      </template>
      <template #footer>
        <UButton label="Download" icon="i-lucide-download" />
      </template>
    </UDrawer>
  </OthersSample>

  <OthersSample name="UDropdownMenu">
    <OthersOpen class="h-64 w-56">
      <UDropdownMenu :items="actions" :open="true" :portal="false" :modal="false">
        <UButton
          label="Account"
          color="neutral"
          variant="outline"
          trailing-icon="i-lucide-chevron-down"
        />
      </UDropdownMenu>
    </OthersOpen>
  </OthersSample>

  <OthersSample name="UPopover">
    <OthersOpen class="h-32 w-72">
      <UPopover :open="true" :portal="false">
        <UButton label="Filter" color="neutral" variant="outline" icon="i-lucide-filter" />
        <template #content>
          <p class="p-4 text-body-sm">Only registrations that are paid.</p>
        </template>
      </UPopover>
    </OthersOpen>
  </OthersSample>

  <OthersSample name="USlideover">
    <USlideover title="Milica Jovanović" description="Registered on March 3, 2027.">
      <UButton
        label="Open the slideover"
        color="neutral"
        variant="outline"
        data-testid="open-USlideover"
      />
      <template #body>
        <p class="text-body-sm">All three days, with lunch. Paid €420.00 by card.</p>
      </template>
      <template #footer>
        <UButton label="Edit" />
        <UButton label="Refund" color="neutral" variant="outline" />
      </template>
    </USlideover>
  </OthersSample>

  <OthersSample name="UToast">
    <UButton
      label="Show a toast"
      color="neutral"
      variant="outline"
      data-testid="open-UToast"
      @click="showToast"
    />
  </OthersSample>

  <OthersSample name="UTooltip">
    <OthersOpen class="h-20 w-48">
      <UTooltip text="Copy the link" :kbds="['meta', 'C']" :open="true" :portal="false">
        <UButton icon="i-lucide-copy" color="neutral" variant="outline" aria-label="Copy" />
      </UTooltip>
    </OthersOpen>
  </OthersSample>
</template>
