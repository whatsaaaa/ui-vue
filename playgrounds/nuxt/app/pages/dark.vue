<script setup lang="ts">
// The page keeps the dark theme whatever the color mode's preference: @nuxtjs/color-mode puts
// the dark class on <html> for it.
definePageMeta({ colorMode: 'dark' })

const name = ref('Maya Collins')
const email = ref('maya@example')
const terms = ref(true)
</script>

<template>
  <GalleryFrame
    title="A page in the dark theme"
    lead="definePageMeta({ colorMode: 'dark' }) keeps a page in one theme, whatever the color mode's preference: the color mode puts the dark class on <html> for it, and the tokens, the dark: and light: variants and Nuxt UI's colors follow the class."
  >
    <div class="mt-10 flex max-w-2xl flex-col gap-6">
      <p class="font-mono text-label text-text-secondary" data-testid="page-theme">
        colorMode: 'dark', in the <span class="light:hidden">dark</span
        ><span class="dark:hidden">light</span> theme
      </p>
      <UCard description="Harbour Conf 2027, Lisbon.">
        <template #title>
          <h2>Registration</h2>
        </template>
        <div class="flex flex-col gap-6">
          <UFormField label="Full name" help="As on your ID.">
            <UInput v-model="name" class="w-full" />
          </UFormField>
          <UFormField
            label="Email address"
            required
            error="Enter an email address with a domain, such as maya@example.com."
          >
            <UInput v-model="email" type="email" class="w-full" />
          </UFormField>
          <UCheckbox v-model="terms" label="I accept the terms of use" />
        </div>
        <template #footer>
          <div class="flex flex-wrap items-center justify-between gap-3">
            <UBadge color="info" label="pending" />
            <div class="flex flex-wrap gap-3">
              <UButton color="neutral" variant="outline" label="Cancel" />
              <UButton label="Register" />
            </div>
          </div>
        </template>
      </UCard>
    </div>
  </GalleryFrame>
</template>
