<script setup lang="ts">
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
// none has no look of its own: it is the field inside another control, such as a select menu's
// search, whose focus that control shows
const variants = ['outline', 'subtle', 'soft', 'ghost'] as const

const name = ref('Maya Collins')
const email = ref('maya@example')

/** The example of the input spec a field is, by its id: input.outline.hover. */
const specOf = (state: string, size = 'md') =>
  ['input', 'outline', state, ...(size === 'md' ? [] : [size])].join('.')
</script>

<template>
  <GallerySection
    id="input"
    title="UInput"
    lead="One line of text at the control height: the value in Inter, an edge in the field border on the page color. The label is mono, the help goes under the field, and an error takes its place as a word with an icon. The system uses no placeholders; the placeholder row shows one an app passes anyway."
  >
    <GalleryRow label="states">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
        <UFormField label="Full name" help="As on your ID." :data-spec="specOf('rest')">
          <UInput v-model="name" class="w-full" />
        </UFormField>
        <UFormField label="Full name" help="hover" :data-spec="specOf('hover')">
          <UInput v-model="name" class="w-full" data-demo="hover" />
        </UFormField>
        <UFormField label="Full name" help="focus" :data-spec="specOf('focus')">
          <UInput v-model="name" class="w-full" data-demo="focus" />
        </UFormField>
        <UFormField
          label="Full name"
          help="Filled in by the organizer."
          :data-spec="specOf('disabled')"
        >
          <UInput model-value="Maya Collins" class="w-full" disabled />
        </UFormField>
        <UFormField
          label="Email address"
          required
          error="Enter an email address with a domain, such as maya@example.com."
          :data-spec="specOf('invalid')"
        >
          <UInput v-model="email" type="email" class="w-full" />
        </UFormField>
        <UFormField
          label="Email address"
          help="Checking whether the address is free."
          :data-spec="specOf('loading')"
        >
          <UInput
            model-value="maya@example.com"
            type="email"
            icon="i-lucide-mail"
            loading
            class="w-full"
          />
        </UFormField>
      </div>
    </GalleryRow>

    <!-- each size with its icons and without, as the spec's paddings differ on the side of an icon -->
    <GalleryRow label="sizes">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2">
        <template v-for="size in sizes" :key="size">
          <UFormField
            :size="size"
            label="Email address"
            :help="`size ${size}`"
            :data-spec="specOf('rest', size)"
          >
            <UInput
              model-value="maya@example.com"
              type="email"
              icon="i-lucide-mail"
              trailing-icon="i-lucide-circle-check"
              class="w-full"
            />
          </UFormField>
          <UFormField
            :size="size"
            label="Email address"
            :help="`size ${size}, no icons`"
            :data-spec="specOf('rest', size)"
          >
            <UInput model-value="maya@example.com" type="email" class="w-full" />
          </UFormField>
        </template>
      </div>
    </GalleryRow>

    <GalleryRow label="invalid sizes">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2">
        <template v-for="size in sizes" :key="size">
          <UFormField
            :size="size"
            label="Email address"
            required
            error="Enter an email address with a domain, such as maya@example.com."
            :data-spec="specOf('invalid', size)"
          >
            <UInput
              v-model="email"
              type="email"
              icon="i-lucide-mail"
              trailing-icon="i-lucide-circle-x"
              class="w-full"
            />
          </UFormField>
          <UFormField
            :size="size"
            label="Email address"
            required
            error="Enter an email address with a domain, such as maya@example.com."
            :data-spec="specOf('invalid', size)"
          >
            <UInput v-model="email" type="email" class="w-full" />
          </UFormField>
        </template>
      </div>
    </GalleryRow>

    <!-- the system uses none, but one an app passes anyway is the secondary text -->
    <GalleryRow label="placeholder">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
        <UFormField label="Search" help="placeholder" :data-spec="specOf('rest')">
          <UInput placeholder="Name or email address" class="w-full" />
        </UFormField>
      </div>
    </GalleryRow>

    <GalleryRow label="variants">
      <div class="grid w-full gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
        <UFormField v-for="variant in variants" :key="variant" label="City" :help="variant">
          <UInput model-value="Copenhagen" :variant="variant" class="w-full" />
        </UFormField>
      </div>
    </GalleryRow>
  </GallerySection>
</template>
