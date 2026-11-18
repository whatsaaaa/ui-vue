<template>
  <GallerySection
    id="modal"
    title="UModal"
    lead="The example of the modal spec: a confirmation open over its dimmed page, which is a box around the window here rather than the whole screen."
  >
    <GalleryRow label="open">
      <GalleryOpen data-spec="modal.window.open" class="w-full">
        <UModal
          open
          :portal="false"
          title="Delete registration"
          description="Maya Collins's registration will be deleted for good."
        >
          <template #body>
            <p class="text-body-sm">
              The fee goes back to the account it was paid from within five working days. This
              cannot be undone.
            </p>
          </template>
          <template #footer>
            <UButton color="neutral" variant="outline" label="Cancel" />
            <!-- danger is an outline in both themes, as the button spec says -->
            <UButton color="error" variant="outline" label="Delete" />
          </template>
        </UModal>
      </GalleryOpen>
    </GalleryRow>
  </GallerySection>
</template>
