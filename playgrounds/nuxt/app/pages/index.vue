<script setup lang="ts">
const colorMode = useColorMode()

const modes = [
  { label: 'sistem', value: 'system' },
  { label: 'tamna', value: 'dark' },
  { label: 'svetla', value: 'light' },
]

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
    title="Nuxt UI na dizajn sistemu"
    lead="Deset osnovnih komponenti Nuxt UI-ja, obučenih u Whatsaaaa dizajn sistem centralnom konfiguracijom, u tamnoj i svetloj temi."
  >
    <div class="mt-10 flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
      <nav aria-labelledby="contents-title" class="min-w-0">
        <h2 id="contents-title" class="ws-prompt">ls komponente</h2>
        <ul class="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-mono text-label">
          <li v-for="section in sections" :key="section.id">
            <a :href="`#${section.id}`">{{ section.label }}</a>
          </li>
        </ul>
      </nav>
      <!--
        Nuxt UI's own color mode, next to the design system's switch in the status line: either
        one moves the other.
      -->
      <ClientOnly>
        <URadioGroup
          v-model="colorMode.preference"
          legend="Režim boja Nuxt UI-ja"
          orientation="horizontal"
          :items="modes"
          class="shrink-0"
          data-testid="color-mode"
        />
        <template #fallback>
          <div class="h-[4.25rem]" />
        </template>
      </ClientOnly>
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
  </GalleryFrame>
</template>
