<script setup lang="ts">
const variants = ['outline', 'subtle', 'soft', 'solid'] as const

/** The example of the card spec a card is: its one kind, outline, at rest. */
const specOf = (variant: string) => (variant === 'outline' ? 'card.outline.rest' : undefined)
</script>

<template>
  <GallerySection
    id="card"
    title="UCard"
    lead="A panel of the system: the surface, a border and the large radius, its parts apart by a line. Its title is a minor heading in mono."
  >
    <GalleryRow label="variants">
      <div class="grid w-full gap-6 md:grid-cols-2">
        <UCard
          v-for="variant in variants"
          :key="variant"
          :variant="variant"
          :description="`Lisbon, May 10 to 12, 2027. The ${variant} variant.`"
          :data-spec="specOf(variant)"
        >
          <!-- The title is a heading, so the card is a section of the page's outline. -->
          <template #title>
            <h4>Harbour Conf 2027</h4>
          </template>
          <p class="text-body-sm">
            Three days of talks and workshops in Lisbon, from May 10 to 12, 2027. Registration is
            open until April 1.
          </p>
          <!-- A solid card is the text color: controls drawn for the page do not read on it. -->
          <template v-if="variant !== 'solid'" #footer>
            <div class="flex flex-wrap justify-end gap-3">
              <UButton color="neutral" variant="ghost" label="Later" />
              <UButton label="Register" />
            </div>
          </template>
        </UCard>
      </div>
    </GalleryRow>

    <GalleryRow label="body only">
      <div class="w-full max-w-md">
        <UCard data-spec="card.outline.rest">
          <p class="text-body-sm">
            A card without a header or a footer has only its body, the same distance from its edges.
          </p>
        </UCard>
      </div>
    </GalleryRow>
  </GallerySection>
</template>
