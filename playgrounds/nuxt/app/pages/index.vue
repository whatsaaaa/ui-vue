<script setup lang="ts">
const sections = [
  { id: 'button', label: 'UButton' },
  { id: 'badge', label: 'UBadge' },
  { id: 'input', label: 'UInput' },
  { id: 'select', label: 'USelect' },
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
    lead="Ten core Nuxt UI components, dressed in the Whatsaaaa design system through its central config, in the dark and the light theme."
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
    <SectionsSelectSection />
    <SectionsCheckboxSection />
    <SectionsRadioGroupSection />
    <SectionsCardSection />
    <SectionsModalSection />
    <SectionsTableSection />
    <SectionsTabsSection />
    <SectionsThemePartSection />
  </GalleryFrame>
</template>
