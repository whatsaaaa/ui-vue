<script setup lang="ts">
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const terms = ref(true)
const news = ref(false)
const all = ref<boolean | 'indeterminate'>('indeterminate')
</script>

<template>
  <GallerySection
    id="checkbox"
    title="UCheckbox"
    lead="A twenty pixel box in the smallest radius, outlined in the field border, filled with the interactive color when checked. Its label is an option, so it is in Inter, on the line the box sits on."
  >
    <GalleryRow label="states">
      <GalleryItem caption="unchecked">
        <UCheckbox v-model="news" label="Send me news" />
      </GalleryItem>
      <GalleryItem caption="checked">
        <UCheckbox v-model="terms" label="I accept the terms of use" />
      </GalleryItem>
      <GalleryItem caption="indeterminate">
        <UCheckbox v-model="all" label="All days" />
      </GalleryItem>
      <GalleryItem caption="hover">
        <UCheckbox label="Send me news" data-demo="hover" />
      </GalleryItem>
      <GalleryItem caption="focus">
        <UCheckbox label="Send me news" data-demo="focus" />
      </GalleryItem>
      <GalleryItem caption="disabled">
        <UCheckbox label="Send me news" disabled />
      </GalleryItem>
      <GalleryItem caption="disabled, checked">
        <UCheckbox :model-value="true" label="I accept the terms" disabled />
      </GalleryItem>
    </GalleryRow>

    <GalleryRow label="with a description and an error">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2">
        <UCheckbox
          label="I need accommodation"
          description="We will get back to you with hotels nearby."
        />
        <UFormField name="terms" required error="You can register once you accept the terms.">
          <UCheckbox label="I accept the terms of use" required />
        </UFormField>
      </div>
    </GalleryRow>

    <GalleryRow label="card">
      <div class="grid w-full gap-4 md:grid-cols-2">
        <UCheckbox
          variant="card"
          :model-value="true"
          label="Workshop: Vue in practice"
          description="May 12, from 10 am to 2 pm."
        />
        <UCheckbox
          variant="card"
          label="Workshop: accessibility"
          description="May 12, from 3 pm to 6 pm."
        />
      </div>
    </GalleryRow>

    <GalleryRow label="sizes">
      <GalleryItem v-for="size in sizes" :key="size" :caption="size">
        <UCheckbox :size="size" :model-value="true" label="I accept" />
      </GalleryItem>
    </GalleryRow>
  </GallerySection>
</template>
