<script setup lang="ts">
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const variants = ['outline', 'subtle', 'soft', 'ghost'] as const

const topics = ref(['Forms', 'Accessibility'])
</script>

<template>
  <GallerySection
    id="input-tags"
    title="UInputTags"
    lead="A field of tags: each value is the system's tag, neutral, with a button that takes it out, and the field grows as its tags wrap. Enter adds what is typed as a tag, the arrow keys move onto the tags, and Backspace takes out the one they are on."
  >
    <GalleryRow label="states">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
        <UFormField label="Topics" help="Press Enter after each topic.">
          <UInputTags v-model="topics" class="w-full" data-testid="input-tags" />
        </UFormField>
        <UFormField label="Topics" help="hover">
          <div data-demo="hover">
            <UInputTags :default-value="['Forms', 'Accessibility']" class="w-full" />
          </div>
        </UFormField>
        <UFormField label="Topics" help="focus">
          <UInputTags
            :default-value="['Forms', 'Accessibility']"
            class="w-full"
            data-demo="focus"
          />
        </UFormField>
        <UFormField label="Topics" help="The tag the arrow keys are on, which Backspace takes out.">
          <GalleryPart part="[data-slot=item]" :index="1" :attrs="{ 'data-state': 'active' }">
            <UInputTags
              :default-value="['Forms', 'Accessibility']"
              class="w-full"
              data-demo="focus"
            />
          </GalleryPart>
        </UFormField>
        <UFormField label="Topics" help="Chosen by the organizer.">
          <UInputTags :default-value="['Forms', 'Accessibility']" disabled class="w-full" />
        </UFormField>
        <UFormField label="Topics" required error="Choose at most two topics.">
          <UInputTags :default-value="['Forms', 'Accessibility', 'Tooling']" class="w-full" />
        </UFormField>
      </div>
    </GalleryRow>

    <!-- tags that wrap onto a second line, the field growing with them -->
    <GalleryRow label="many tags">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
        <UFormField label="Speakers" help="The tags wrap, and the field grows.">
          <UInputTags
            :default-value="[
              'Milica Jovanović',
              'Nikola Petrović',
              'Jelena Marković',
              'Stefan Ilić',
            ]"
            class="w-full"
          />
        </UFormField>
      </div>
    </GalleryRow>

    <!-- each size with an icon and without, as the field's paddings differ on the side of an icon -->
    <GalleryRow label="sizes">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2">
        <template v-for="size in sizes" :key="size">
          <UFormField :size="size" label="Topics" :help="`size ${size}`">
            <UInputTags
              :default-value="['Forms', 'Accessibility']"
              icon="i-lucide-tag"
              class="w-full"
            />
          </UFormField>
          <UFormField :size="size" label="Topics" :help="`size ${size}, no icon`">
            <UInputTags :default-value="['Forms', 'Accessibility']" class="w-full" />
          </UFormField>
        </template>
      </div>
    </GalleryRow>

    <GalleryRow label="variants">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
        <UFormField v-for="variant in variants" :key="variant" label="Topics" :help="variant">
          <UInputTags
            :default-value="['Forms', 'Accessibility']"
            :variant="variant"
            class="w-full"
          />
        </UFormField>
      </div>
    </GalleryRow>
  </GallerySection>
</template>
