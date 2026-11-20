<script setup lang="ts">
import markOnDark from '~/assets/mark-on-dark.svg'
import markOnLight from '~/assets/mark-on-light.svg'
</script>

<template>
  <OthersSample name="UColorModeAvatar">
    <UColorModeAvatar :light="markOnLight" :dark="markOnDark" alt="ui-vue" size="lg" />
  </OthersSample>

  <OthersSample name="UColorModeButton">
    <UColorModeButton />
  </OthersSample>

  <OthersSample name="UColorModeImage">
    <UColorModeImage :light="markOnLight" :dark="markOnDark" alt="ui-vue" width="48" height="48" />
  </OthersSample>

  <OthersSample name="UColorModeSelect">
    <UColorModeSelect class="w-40" aria-label="Color mode" />
  </OthersSample>

  <OthersSample name="UColorModeSwitch">
    <UColorModeSwitch aria-label="Dark theme" />
  </OthersSample>
</template>
