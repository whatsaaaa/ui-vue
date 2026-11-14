<script setup lang="ts">
import markOnDark from '~/assets/mark-on-dark.svg'
import markOnLight from '~/assets/mark-on-light.svg'
</script>

<template>
  <header class="ws-tab-bar">
    <span class="ws-tab-bar__brand">
      <!-- The kit has a cut of the mark for each theme. The stylesheet shows the page's one. -->
      <img
        class="tab-bar__mark tab-bar__mark--dark"
        :src="markOnDark"
        alt=""
        width="32"
        height="32"
      />
      <img
        class="tab-bar__mark tab-bar__mark--light"
        :src="markOnLight"
        alt=""
        width="32"
        height="32"
      />
      ui-vue
    </span>
    <nav class="ws-tabs" aria-label="Main">
      <ul>
        <li><a href="#" aria-current="page">gallery</a></li>
      </ul>
    </nav>
    <div class="ws-tab-bar__end">
      <a class="ws-arrow" href="https://ui.nuxt.com/">nuxt ui</a>
    </div>
  </header>
</template>
