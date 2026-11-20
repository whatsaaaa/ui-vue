<script setup lang="ts">
const links = [
  { label: 'Program', to: '#layout', active: true },
  { label: 'Speakers', to: '#layout' },
]

const sidebarLinks = [
  { label: 'Registrations', icon: 'i-lucide-ticket', to: '#layout', active: true },
  { label: 'Workshops', icon: 'i-lucide-presentation', to: '#layout' },
  { label: 'Settings', icon: 'i-lucide-settings', to: '#layout' },
]

/** Whether the sidebar is open: beside the page on a wide screen, over it on a narrow one. */
const sidebar = ref(true)

const panes = [
  { id: 'list', defaultSize: 40, minSize: 20, slot: 'list' as const },
  { id: 'detail', defaultSize: 60, minSize: 30, slot: 'detail' as const },
]
</script>

<template>
  <OthersSample name="UContainer">
    <div class="w-full rounded-lg border-thin border-dashed border-field-border">
      <UContainer>
        <p class="bg-raised py-4 text-center text-body-sm">
          As wide as the container, with its padding at the sides
        </p>
      </UContainer>
    </div>
  </OthersSample>

  <OthersSample name="UError">
    <UError
      class="min-h-0 w-full py-10"
      :error="{
        statusCode: 404,
        statusMessage: 'Page not found',
        message: 'The talk you are looking for has moved.',
      }"
      redirect="/others"
    />
  </OthersSample>

  <OthersSample name="UHeader" :with="['UMain', 'UFooter']">
    <OthersScreen>
      <UHeader title="Sava Conf" to="#layout" :toggle="false">
        <UNavigationMenu :items="links" />
        <template #right>
          <UButton label="Register" />
        </template>
      </UHeader>
      <UMain as="div" class="min-h-0">
        <p class="px-6 py-10 text-body-sm">The page, between the header and the footer.</p>
      </UMain>
      <USeparator />
      <UFooter>
        <template #left>
          <p class="text-body-sm text-text-secondary">© 2027 Sava Conf</p>
        </template>
        <template #right>
          <UButton icon="i-lucide-rss" color="neutral" variant="ghost" aria-label="Feed" />
        </template>
      </UFooter>
    </OthersScreen>
  </OthersSample>

  <OthersSample name="USidebar">
    <OthersScreen class="h-80">
      <div class="flex h-full">
        <USidebar
          v-model:open="sidebar"
          title="Sava Conf"
          description="Organizers"
          :ui="{ container: 'h-full' }"
        >
          <UNavigationMenu :items="sidebarLinks" orientation="vertical" />
          <template #footer>
            <UUser
              name="Milica Jovanović"
              description="Organizer"
              :avatar="{ alt: 'Milica Jovanović' }"
            />
          </template>
        </USidebar>
        <div class="flex flex-col items-start gap-4 p-6">
          <UButton
            icon="i-lucide-panel-left"
            color="neutral"
            variant="outline"
            aria-label="Show or hide the sidebar"
            @click="sidebar = !sidebar"
          />
          <p class="text-body-sm">Forty seats, twenty-four taken.</p>
        </div>
      </div>
    </OthersScreen>
  </OthersSample>

  <OthersSample name="USplitter">
    <!-- The splitter fills its parent, which gives it its height. -->
    <div class="h-40 w-full rounded-lg border-thin border-border">
      <USplitter :items="panes">
        <template #list>
          <p class="p-4 text-body-sm">Registrations</p>
        </template>
        <template #detail>
          <p class="p-4 text-body-sm">Milica Jovanović, all three days.</p>
        </template>
      </USplitter>
    </div>
  </OthersSample>

  <OthersSample name="UTheme">
    <UTheme :props="{ button: { color: 'neutral', variant: 'outline', size: 'sm' } }">
      <div class="flex flex-wrap gap-3">
        <UButton label="Export" icon="i-lucide-download" />
        <UButton label="Print" icon="i-lucide-printer" />
        <UButton label="Share" icon="i-lucide-share" />
      </div>
    </UTheme>
  </OthersSample>
</template>
