<script setup lang="ts">
const sections = [
  { id: 'button', label: 'UButton' },
  { id: 'badge', label: 'UBadge' },
  { id: 'input', label: 'UInput' },
  { id: 'textarea', label: 'UTextarea' },
  { id: 'input-number', label: 'UInputNumber' },
  { id: 'select', label: 'USelect' },
  { id: 'input-menu', label: 'UInputMenu' },
  { id: 'input-tags', label: 'UInputTags' },
  { id: 'input-date', label: 'UInputDate' },
  { id: 'input-time', label: 'UInputTime' },
  { id: 'pin-input', label: 'UPinInput' },
  { id: 'file-upload', label: 'UFileUpload' },
  { id: 'field-group', label: 'UFieldGroup' },
  { id: 'checkbox', label: 'UCheckbox' },
  { id: 'radio-group', label: 'URadioGroup' },
  { id: 'card', label: 'UCard' },
  { id: 'modal', label: 'UModal' },
  { id: 'table', label: 'UTable' },
  { id: 'tabs', label: 'UTabs' },
]
</script>

<template>
  <GalleryFrame
    title="Nuxt UI on the design system"
    lead="The Nuxt UI components the package themes, dressed in the Whatsaaaa design system through its central config, in the dark and the light theme: the ones held to a spec of the system, and the fields restyled on its tiers."
  >
    <div class="mt-10 flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
      <nav aria-labelledby="contents-title" class="min-w-0">
        <h2 id="contents-title" class="ws-prompt">ls components</h2>
        <ul class="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-mono text-label">
          <li v-for="section in sections" :key="section.id">
            <a :href="`#${section.id}`">{{ section.label }}</a>
          </li>
        </ul>
      </nav>
      <GalleryColorMode />
    </div>

    <SectionsButtonSection />
    <SectionsBadgeSection />
    <SectionsInputSection />
    <SectionsTextareaSection />
    <SectionsInputNumberSection />
    <SectionsSelectSection />
    <SectionsInputMenuSection />
    <SectionsInputTagsSection />
    <SectionsInputDateSection component="input-date" />
    <SectionsInputDateSection component="input-time" />
    <SectionsPinInputSection />
    <SectionsFileUploadSection />
    <SectionsFieldGroupSection />
    <SectionsCheckboxSection />
    <SectionsRadioGroupSection />
    <SectionsCardSection />
    <SectionsModalSection />
    <SectionsTableSection />
    <SectionsTabsSection />
    <SectionsThemePartSection />
  </GalleryFrame>
</template>
