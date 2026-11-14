<script setup lang="ts">
const deleteOpen = ref(false)
const name = ref('Maya Collins')
</script>

<template>
  <GallerySection
    id="modal"
    title="UModal"
    lead="A window of the terminal: the surface in a border with the window's radius, no shadow. Its header is a bar as tall as the tab bar, on the page color. The page behind it is dimmed in its own color."
  >
    <GalleryRow label="opening">
      <GalleryItem caption="confirmation">
        <UModal
          v-model:open="deleteOpen"
          title="Delete registration"
          description="Maya Collins's registration will be deleted for good."
        >
          <UButton
            color="error"
            variant="outline"
            icon="i-lucide-trash-2"
            label="Delete registration"
          />
          <template #body>
            <p class="text-body-sm">
              The fee goes back to the account it was paid from within five working days. This
              cannot be undone.
            </p>
          </template>
          <template #footer>
            <UButton color="neutral" variant="outline" label="Cancel" @click="deleteOpen = false" />
            <UButton color="error" label="Delete" @click="deleteOpen = false" />
          </template>
        </UModal>
      </GalleryItem>
      <GalleryItem caption="with a form">
        <UModal title="Edit registration">
          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-pencil"
            label="Edit registration"
          />
          <template #body>
            <div class="flex flex-col gap-6">
              <UFormField label="Full name" help="As on your ID.">
                <UInput v-model="name" class="w-full" />
              </UFormField>
              <UCheckbox label="I need accommodation" />
            </div>
          </template>
          <template #footer="{ close }">
            <UButton color="neutral" variant="outline" label="Cancel" @click="close" />
            <UButton label="Save" @click="close" />
          </template>
        </UModal>
      </GalleryItem>
    </GalleryRow>
  </GallerySection>
</template>
