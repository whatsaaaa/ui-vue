<script setup lang="ts">
const navigation = [
  {
    title: 'Getting started',
    path: '#content',
    children: [
      { title: 'Install', path: '#content' },
      { title: 'Theme', path: '#content', badge: 'New' },
    ],
  },
  {
    title: 'Components',
    path: '#content',
    children: [{ title: 'Button', path: '#content' }],
  },
]

const pages = [
  { label: 'Install', description: 'Add the package to an app.', to: '#content' },
  { label: 'Theme', description: 'Dark, light and parts in one theme.', to: '#content' },
]

const surround = [
  { title: 'Install', description: 'Add the package to an app.', path: '#content' },
  { title: 'Theme', description: 'Dark, light and parts in one theme.', path: '#content' },
]

/** The headings of the prose examples, further down the page. */
const headings = [
  {
    id: 'prose-install',
    depth: 2,
    text: 'Install',
    children: [{ id: 'prose-on-nuxt', depth: 3, text: 'On Nuxt' }],
  },
  { id: 'prose-the-stylesheet', depth: 2, text: 'The stylesheet' },
]
</script>

<template>
  <OthersSample name="UContentNavigation">
    <UContentNavigation :navigation="navigation" class="w-64" />
  </OthersSample>

  <OthersSample name="UContentSearch" :with="['UContentSearchButton']">
    <UContentSearchButton :collapsed="false" data-testid="open-UContentSearch" />
    <UContentSearch :links="pages" />
  </OthersSample>

  <OthersSample name="UContentSurround">
    <UContentSurround :surround="surround" class="w-full max-w-xl" />
  </OthersSample>

  <OthersSample name="UContentToc">
    <UContentToc :links="headings" title="On this page" class="w-64" />
  </OthersSample>
</template>
