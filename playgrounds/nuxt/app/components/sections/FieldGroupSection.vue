<script setup lang="ts">
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

const prefixes = ['+381', '+382', '+387']
</script>

<template>
  <GallerySection
    id="field-group"
    title="UFieldGroup"
    lead="Controls joined in a row or a column: where two meet, their edges are one line, at every size, and the corners there are square. A field in an error, under the pointer or with the focus comes over the controls beside it, so the line between them is its own."
  >
    <GalleryRow label="states">
      <GalleryItem caption="rest">
        <UFieldGroup>
          <UInput default-value="BEOGRAD27" aria-label="Discount code" />
          <UButton label="Apply" color="neutral" variant="outline" />
        </UFieldGroup>
      </GalleryItem>
      <GalleryItem caption="hover">
        <!-- the pointer over the field: its root, the group's item, and what is in it -->
        <GalleryPart part="[data-slot=root]" :attrs="{ 'data-demo': 'hover' }">
          <UFieldGroup>
            <UInput default-value="BEOGRAD27" aria-label="Discount code" />
            <UButton label="Apply" color="neutral" variant="outline" />
          </UFieldGroup>
        </GalleryPart>
      </GalleryItem>
      <GalleryItem caption="focus">
        <UFieldGroup>
          <UInput default-value="BEOGRAD27" aria-label="Discount code" data-demo="focus" />
          <UButton label="Apply" color="neutral" variant="outline" />
        </UFieldGroup>
      </GalleryItem>
      <GalleryItem caption="invalid">
        <UFieldGroup>
          <UInput default-value="BEOGRAD" aria-label="Discount code" color="error" highlight />
          <UButton label="Apply" color="neutral" variant="outline" />
        </UFieldGroup>
      </GalleryItem>
    </GalleryRow>

    <!-- a select and a text field, each with its edge, and a field between two buttons -->
    <GalleryRow label="controls">
      <GalleryItem caption="a select and a field">
        <UFieldGroup>
          <USelect default-value="+381" :items="prefixes" aria-label="Country code" />
          <UInput default-value="64 123 4567" aria-label="Phone number" type="tel" />
        </UFieldGroup>
      </GalleryItem>
      <GalleryItem caption="a field between buttons">
        <UFieldGroup>
          <UButton icon="i-lucide-minus" color="neutral" variant="outline" aria-label="Fewer" />
          <UInput default-value="2" aria-label="Seats" class="w-16" />
          <UButton icon="i-lucide-plus" color="neutral" variant="outline" aria-label="More" />
        </UFieldGroup>
      </GalleryItem>
    </GalleryRow>

    <GalleryRow label="sizes">
      <GalleryItem v-for="size in sizes" :key="size" :caption="`size ${size}`">
        <UFieldGroup :size="size">
          <UInput default-value="BEOGRAD27" aria-label="Discount code" class="w-36" />
          <UButton label="Apply" color="neutral" variant="outline" />
        </UFieldGroup>
      </GalleryItem>
    </GalleryRow>

    <GalleryRow label="vertical" align="start">
      <GalleryItem caption="vertical">
        <UFieldGroup orientation="vertical" class="w-56">
          <UInput default-value="Knez Mihailova 12" aria-label="Street" />
          <UInput default-value="11000 Belgrade" aria-label="Postal code and city" />
          <UInput default-value="Serbia" aria-label="Country" />
        </UFieldGroup>
      </GalleryItem>
      <GalleryItem caption="vertical, invalid in the middle">
        <UFieldGroup orientation="vertical" class="w-56">
          <UInput default-value="Knez Mihailova 12" aria-label="Street" />
          <UInput
            default-value="Belgrade"
            aria-label="Postal code and city"
            color="error"
            highlight
          />
          <UInput default-value="Serbia" aria-label="Country" />
        </UFieldGroup>
      </GalleryItem>
    </GalleryRow>
  </GallerySection>
</template>
