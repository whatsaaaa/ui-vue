<script setup lang="ts">
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const news = ref(false)

/** The example of the checkbox spec an option is, by its id: checkbox.list.hover. */
const specOf = (state: string, size = 'md') =>
  ['checkbox', 'list', state, ...(size === 'md' ? [] : [size])].join('.')

// The examples of a state show the same option, so that only the state tells them apart.
const option = {
  label: 'Send me news',
  description: 'One email a month, about new workshops.',
}
</script>

<template>
  <GallerySection
    id="checkbox"
    title="UCheckbox"
    lead="A twenty pixel box in the smallest radius, edged in the field border, filled with the interactive color when checked. Its label is an option, so it is in Inter, on the line the box sits on."
  >
    <GalleryRow label="states" align="start">
      <GalleryItem caption="rest">
        <div :data-spec="specOf('rest')">
          <UCheckbox v-model="news" v-bind="option" />
        </div>
      </GalleryItem>
      <GalleryItem caption="hover">
        <div :data-spec="specOf('hover')" data-demo="hover">
          <UCheckbox v-bind="option" />
        </div>
      </GalleryItem>
      <GalleryItem caption="focus">
        <div :data-spec="specOf('focus')" data-demo="focus">
          <UCheckbox v-bind="option" />
        </div>
      </GalleryItem>
      <GalleryItem caption="checked">
        <div :data-spec="specOf('checked')">
          <UCheckbox :model-value="true" v-bind="option" />
        </div>
      </GalleryItem>
      <GalleryItem caption="indeterminate">
        <div :data-spec="specOf('indeterminate')">
          <UCheckbox model-value="indeterminate" v-bind="option" />
        </div>
      </GalleryItem>
      <GalleryItem caption="disabled">
        <div :data-spec="specOf('disabled')">
          <UCheckbox v-bind="option" disabled />
        </div>
      </GalleryItem>
      <GalleryItem caption="disabled, checked">
        <div :data-spec="specOf('disabled')">
          <UCheckbox :model-value="true" v-bind="option" disabled />
        </div>
      </GalleryItem>
      <GalleryItem caption="disabled, indeterminate">
        <div :data-spec="specOf('disabled')">
          <UCheckbox model-value="indeterminate" v-bind="option" disabled />
        </div>
      </GalleryItem>
    </GalleryRow>

    <GalleryRow label="invalid">
      <UFormField
        name="terms"
        error="Accept the terms of use to register."
        :data-spec="specOf('invalid')"
      >
        <UCheckbox label="I accept the terms of use" required />
      </UFormField>
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
        <div class="flex flex-col gap-3">
          <div :data-spec="specOf('rest', size)">
            <UCheckbox :size="size" label="I accept" />
          </div>
          <div :data-spec="specOf('checked', size)">
            <UCheckbox :size="size" :model-value="true" label="I accept" />
          </div>
        </div>
      </GalleryItem>
    </GalleryRow>
  </GallerySection>
</template>
