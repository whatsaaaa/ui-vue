<script setup lang="ts">
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const variants = ['outline', 'subtle', 'soft', 'ghost'] as const

const message = ref(
  'Could the workshop start at ten? I come in from Novi Sad on the morning train, which reaches Belgrade at half past nine.',
)
const long = ref(
  'I would like to bring my team from Niš: Marko, Jelena, Stefan and Ana. We would need a table for four at lunch, two vegetarian meals, and a projector for the demo on the second day.',
)

/** The example of the text area spec a field is, by its id: textarea.outline.hover. */
const specOf = (state: string, size = 'md') =>
  ['textarea', 'outline', state, ...(size === 'md' ? [] : [size])].join('.')
</script>

<template>
  <GallerySection
    id="textarea"
    title="UTextarea"
    lead="Text of several lines: the input's edge, value and field, with rows of text in place of its one line and no height of its own. Its first line sits where an input's value does, so a text area of one row is as tall as the input beside it. It has no icons and no loading state. The placeholder row shows one an app passes anyway."
  >
    <GalleryRow label="states">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
        <UFormField label="Message" help="Up to 150 characters." :data-spec="specOf('rest')">
          <UTextarea v-model="message" class="w-full" />
        </UFormField>
        <UFormField label="Message" help="hover" :data-spec="specOf('hover')">
          <UTextarea v-model="message" class="w-full" data-demo="hover" />
        </UFormField>
        <UFormField label="Message" help="focus" :data-spec="specOf('focus')">
          <UTextarea v-model="message" class="w-full" data-demo="focus" />
        </UFormField>
        <UFormField
          label="Notes for the organizer"
          help="Sent with your ticket."
          :data-spec="specOf('disabled')"
        >
          <UTextarea model-value="A vegetarian lunch, please." class="w-full" disabled />
        </UFormField>
        <UFormField
          label="Message"
          required
          error="Shorten the message to 150 characters or fewer."
          :data-spec="specOf('invalid')"
        >
          <UTextarea v-model="long" autoresize class="w-full" />
        </UFormField>
      </div>
    </GalleryRow>

    <GalleryRow label="sizes">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2">
        <UFormField
          v-for="size in sizes"
          :key="size"
          :size="size"
          label="Message"
          :help="`size ${size}`"
          :data-spec="specOf('rest', size)"
        >
          <UTextarea v-model="message" class="w-full" />
        </UFormField>
      </div>
    </GalleryRow>

    <GalleryRow label="invalid sizes">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2">
        <UFormField
          v-for="size in sizes"
          :key="size"
          :size="size"
          label="Message"
          required
          error="Shorten the message to 150 characters or fewer."
          :data-spec="specOf('invalid', size)"
        >
          <UTextarea v-model="long" autoresize class="w-full" />
        </UFormField>
      </div>
    </GalleryRow>

    <!-- one row beside the input of its size: as tall as it, its line where the input's value is -->
    <GalleryRow label="one row">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2">
        <template v-for="size in sizes" :key="size">
          <UFormField :size="size" label="City" :help="`input, size ${size}`">
            <UInput model-value="Kragujevac" class="w-full" />
          </UFormField>
          <UFormField :size="size" label="City" :help="`one row, size ${size}`">
            <UTextarea model-value="Kragujevac" :rows="1" class="w-full" />
          </UFormField>
        </template>
      </div>
    </GalleryRow>

    <!-- the system uses none, but one an app passes anyway is the secondary text -->
    <GalleryRow label="placeholder">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
        <UFormField label="Message" help="placeholder" :data-spec="specOf('rest')">
          <UTextarea placeholder="What would you like to ask?" class="w-full" />
        </UFormField>
      </div>
    </GalleryRow>

    <GalleryRow label="variants">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
        <UFormField v-for="variant in variants" :key="variant" label="Notes" :help="variant">
          <UTextarea model-value="A seat near the door." :variant="variant" class="w-full" />
        </UFormField>
      </div>
    </GalleryRow>
  </GallerySection>
</template>
