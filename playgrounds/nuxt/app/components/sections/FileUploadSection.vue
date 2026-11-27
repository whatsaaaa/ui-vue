<script setup lang="ts">
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

/**
 * A ticket already chosen, as a file the page makes once it runs: a few bytes of a PDF. The file
 * upload shows a file it has from a URL of the browser's own.
 */
const chosen = shallowRef<File | null>(null)
onMounted(() => {
  chosen.value = new File(['%PDF-1.7'], 'ticket-milica-jovanovic.pdf', {
    type: 'application/pdf',
  })
})
</script>

<template>
  <GallerySection
    id="file-upload"
    title="UFileUpload"
    lead="A file chosen or dropped: an area in the field's edge, on the page color, or a button. The system has no dashed edge, so the area's edge is solid, and lightens under the pointer and while a file is over it. Its label is mono and its help in Inter, as a form field's. A chosen file is a row in the field's edge."
  >
    <GalleryRow label="states">
      <div class="grid w-full items-start gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
        <UFormField label="Ticket" help="The one from your confirmation email.">
          <UFileUpload
            label="Drop your ticket here"
            description="PDF or PNG, up to 2 MB"
            accept="application/pdf,image/png"
            class="w-full"
            data-testid="file-upload"
          />
        </UFormField>
        <UFormField label="Ticket" help="hover">
          <div data-demo="hover">
            <UFileUpload
              label="Drop your ticket here"
              description="PDF or PNG, up to 2 MB"
              class="w-full"
            />
          </div>
        </UFormField>
        <UFormField label="Ticket" help="focus">
          <div data-demo="focus">
            <UFileUpload
              label="Drop your ticket here"
              description="PDF or PNG, up to 2 MB"
              class="w-full"
            />
          </div>
        </UFormField>
        <UFormField label="Ticket" help="A file over it.">
          <GalleryPart part="[data-slot=base]" :attrs="{ 'data-dragging': 'true' }">
            <UFileUpload
              label="Drop your ticket here"
              description="PDF or PNG, up to 2 MB"
              class="w-full"
            />
          </GalleryPart>
        </UFormField>
        <UFormField label="Ticket" help="Sent by the organizer.">
          <UFileUpload
            label="Drop your ticket here"
            description="PDF or PNG, up to 2 MB"
            disabled
            class="w-full"
          />
        </UFormField>
        <UFormField label="Ticket" required error="Add your ticket to register.">
          <UFileUpload
            label="Drop your ticket here"
            description="PDF or PNG, up to 2 MB"
            class="w-full"
          />
        </UFormField>
      </div>
    </GalleryRow>

    <GalleryRow label="a chosen file">
      <div class="grid w-full items-start gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
        <!-- as narrow as its column: the file's name is cut short with an ellipsis -->
        <UFormField
          label="Ticket"
          help="Under the area, with the button that takes it out."
          class="min-w-0"
        >
          <UFileUpload
            v-model="chosen"
            label="Drop your ticket here"
            description="PDF or PNG, up to 2 MB"
            layout="list"
            class="w-full"
          />
        </UFormField>
      </div>
    </GalleryRow>

    <GalleryRow label="sizes">
      <div class="grid w-full items-start gap-x-6 gap-y-6 md:grid-cols-2">
        <UFormField
          v-for="size in sizes"
          :key="size"
          :size="size"
          label="Ticket"
          :help="`size ${size}`"
        >
          <UFileUpload
            :size="size"
            label="Drop your ticket here"
            description="PDF or PNG, up to 2 MB"
            class="w-full"
          />
        </UFormField>
      </div>
    </GalleryRow>

    <!--
      the button alone: a square of the control height around its icon, at each size. Nuxt UI gives
      it no name, and an aria-label goes to the file input it hides: its name is in its slot
    -->
    <GalleryRow label="button">
      <GalleryItem v-for="size in sizes" :key="size" :caption="`size ${size}`">
        <UFileUpload variant="button" :size="size">
          <template #leading="{ ui }">
            <UIcon name="i-lucide-upload" data-slot="icon" :class="ui.icon()" />
            <span class="sr-only">Add your ticket</span>
          </template>
        </UFileUpload>
      </GalleryItem>
    </GalleryRow>
  </GallerySection>
</template>
