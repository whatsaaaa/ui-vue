<script setup lang="ts">
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const variants = ['outline', 'subtle', 'soft', 'ghost'] as const

const code = ref(['4', '2'])
</script>

<template>
  <GallerySection
    id="pin-input"
    title="UPinInput"
    lead="A code typed a character to a cell: each cell is a field, square at the control height, with the field's edge and focus ring, its character centered in Inter. Typing moves to the next cell, and Backspace back to the one before."
  >
    <GalleryRow label="states">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
        <UFormField label="Code from the email" help="Four digits, sent to milica@example.com.">
          <UPinInput v-model="code" :length="4" data-testid="pin-input" />
        </UFormField>
        <UFormField label="Code from the email" help="hover, on the second cell">
          <GalleryPart part="[data-slot=base]" :index="1" :attrs="{ 'data-demo': 'hover' }">
            <UPinInput :default-value="['4', '2']" :length="4" />
          </GalleryPart>
        </UFormField>
        <UFormField label="Code from the email" help="focus, on the third cell">
          <GalleryPart part="[data-slot=base]" :index="2" :attrs="{ 'data-demo': 'focus' }">
            <UPinInput :default-value="['4', '2']" :length="4" />
          </GalleryPart>
        </UFormField>
        <UFormField label="Code from the email" help="Sent again in a minute.">
          <UPinInput :default-value="['4', '2', '7', '1']" :length="4" disabled />
        </UFormField>
        <UFormField label="Code from the email" required error="The code is not the one we sent.">
          <UPinInput :default-value="['4', '2', '7', '9']" :length="4" />
        </UFormField>
        <UFormField label="Code from the email" help="Hidden as it is typed.">
          <UPinInput :default-value="['4', '2', '7']" :length="4" mask />
        </UFormField>
      </div>
    </GalleryRow>

    <GalleryRow label="sizes">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2">
        <UFormField
          v-for="size in sizes"
          :key="size"
          :size="size"
          label="Code from the email"
          :help="`size ${size}`"
        >
          <UPinInput :default-value="['4', '2', '7', '1']" :length="4" />
        </UFormField>
      </div>
    </GalleryRow>

    <GalleryRow label="variants">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
        <UFormField
          v-for="variant in variants"
          :key="variant"
          label="Code from the email"
          :help="variant"
        >
          <UPinInput :default-value="['4', '2', '7', '1']" :length="4" :variant="variant" />
        </UFormField>
      </div>
    </GalleryRow>
  </GallerySection>
</template>
