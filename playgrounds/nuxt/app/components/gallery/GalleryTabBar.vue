<script setup lang="ts">
import markOnDark from '~/assets/mark-on-dark.svg'
import markOnLight from '~/assets/mark-on-light.svg'
</script>

<template>
  <header class="ws-tab-bar">
    <span class="ws-tab-bar__brand">
      <!-- The kit has a cut of the mark for each theme. The design system shows the page's one. -->
      <img class="tab-bar__mark ws-theme-dark" :src="markOnDark" alt="" width="32" height="32" />
      <img class="tab-bar__mark ws-theme-light" :src="markOnLight" alt="" width="32" height="32" />
      ui-vue
    </span>
    <nav class="ws-tabs" aria-label="Main">
      <!-- The router marks the tab of the page on show with aria-current. -->
      <ul>
        <li><NuxtLink to="/">gallery</NuxtLink></li>
        <li><NuxtLink to="/dark">dark</NuxtLink></li>
        <li><NuxtLink to="/open">open</NuxtLink></li>
      </ul>
    </nav>
    <div class="ws-tab-bar__end">
      <a class="ws-arrow" href="https://ui.nuxt.com/">nuxt ui</a>
    </div>
  </header>
</template>
