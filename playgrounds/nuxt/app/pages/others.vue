<script setup lang="ts">
import {
  OthersChat,
  OthersColorMode,
  OthersContent,
  OthersDashboard,
  OthersData,
  OthersEditor,
  OthersElement,
  OthersForm,
  OthersLayout,
  OthersLocale,
  OthersNavigation,
  OthersOverlay,
  OthersPage,
  OthersProse,
} from '#components'
import { type ComponentLevels, type Family, components, families, shownOn } from '#levels'

/** The examples of each family. The internal parts have none: their components draw them. */
const samples = {
  element: OthersElement,
  form: OthersForm,
  data: OthersData,
  navigation: OthersNavigation,
  overlay: OthersOverlay,
  layout: OthersLayout,
  page: OthersPage,
  dashboard: OthersDashboard,
  chat: OthersChat,
  editor: OthersEditor,
  content: OthersContent,
  'color-mode': OthersColorMode,
  locale: OthersLocale,
  prose: OthersProse,
  internal: undefined,
} satisfies Record<Family, unknown>

/** What a family is, in a line under its name. */
const leads: Record<Family, string> = {
  element: 'The small parts of a page: notices, avatars, key caps, progress.',
  form: 'The fields and controls of a form the package does not theme yet.',
  data: 'Lists, trees and timelines.',
  navigation: 'Where you are, and where you can go.',
  overlay: 'What opens over the page: menus, popovers, panels and toasts.',
  layout: "An app's shell: its header, footer and sidebar.",
  page: 'The blocks of a landing page, a blog, a changelog and a pricing page.',
  dashboard: 'The shell of a dashboard. Nuxt UI v5 plans to replace these.',
  chat: 'The parts of a chat with an assistant.',
  editor: 'The rich text editor and its toolbar.',
  content: 'Navigation for pages of documentation.',
  'color-mode': "Controls for Nuxt UI's color mode, each made of another component.",
  locale: 'The language select.',
  prose: "Nuxt UI's prose, which the design system has its own of.",
  internal: 'Parts of other components, which have no page in the docs of Nuxt UI.',
}

const entries = Object.entries(components) as [string, ComponentLevels][]

/**
 * Each family with its components: the ones this page shows, the ones the gallery shows, restyled
 * or held to a spec, and the others with the reason.
 */
const sections = families.map((family) => {
  const own = entries.filter(([, component]) => component.family === family)
  const shown = (where: ReturnType<typeof shownOn>) =>
    own.filter(([, component]) => shownOn(component) === where).map(([name]) => name)
  const inGallery = (level: number) =>
    own
      .filter(([, component]) => shownOn(component) === 'gallery' && component.today === level)
      .map(([name]) => name)
  return {
    family,
    shown: shown('others'),
    restyled: inGallery(2),
    specced: inGallery(3),
    unshown: own.flatMap(([name, { unshown }]) => (unshown ? [{ name, note: unshown.note }] : [])),
  }
})
</script>

<template>
  <GalleryFrame
    title="The others, as they inherit"
    lead="Every Nuxt UI component the package does not theme yet, by family. Each takes the system's colors, radius and fonts through the stylesheet, and nothing else: its type, its sizes and its states are still Nuxt UI's. The levels come from the package's levels file."
  >
    <div class="mt-10 flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
      <nav aria-labelledby="contents-title" class="min-w-0">
        <h2 id="contents-title" class="ws-prompt">ls families</h2>
        <ul class="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-mono text-label">
          <li v-for="section in sections" :key="section.family">
            <a :href="`#${section.family}`">{{ section.family }}</a>
          </li>
        </ul>
      </nav>
      <GalleryColorMode />
    </div>

    <GallerySection
      v-for="section in sections"
      :id="section.family"
      :key="section.family"
      :title="section.family"
      :lead="leads[section.family]"
    >
      <div class="flex flex-col gap-2 font-mono text-caption text-text-secondary">
        <ul v-if="section.shown.length" class="flex flex-wrap gap-x-4 gap-y-1">
          <li v-for="name in section.shown" :key="name">
            <a :href="`#${name}`">{{ name }}</a>
          </li>
        </ul>
        <p v-if="section.specced.length">
          In the <NuxtLink to="/">gallery</NuxtLink>, held to a spec:
          {{ section.specced.join(', ') }}.
        </p>
        <p v-if="section.restyled.length">
          In the <NuxtLink to="/">gallery</NuxtLink>, restyled on the system's tiers:
          {{ section.restyled.join(', ') }}.
        </p>
        <ul v-if="section.unshown.length" class="flex flex-col gap-1">
          <li v-for="{ name, note } in section.unshown" :key="name">
            {{ name }}, not shown: {{ note }}.
          </li>
        </ul>
      </div>
      <div v-if="samples[section.family]" class="flex flex-col gap-8">
        <component :is="samples[section.family]" />
      </div>
    </GallerySection>
  </GalleryFrame>
</template>
