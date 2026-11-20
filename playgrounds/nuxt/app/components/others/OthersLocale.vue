<script setup lang="ts">
import { en, sr, sr_latn } from '@nuxt/ui/locale'

const locale = ref('en')
</script>

<template>
  <OthersSample name="ULocaleSelect">
    <ULocaleSelect
      v-model="locale"
      :locales="[en, sr_latn, sr]"
      class="w-48"
      aria-label="Language"
    />
  </OthersSample>
</template>
