<script setup lang="ts">
const links = [
  { label: 'Registrations', icon: 'i-lucide-ticket', to: '#dashboard', active: true },
  { label: 'Workshops', icon: 'i-lucide-presentation', to: '#dashboard' },
  { label: 'Settings', icon: 'i-lucide-settings', to: '#dashboard' },
]

const groups = [
  {
    id: 'pages',
    label: 'Pages',
    items: links.map(({ label, icon }) => ({ label, icon })),
  },
]
</script>

<template>
  <OthersSample
    name="UDashboardGroup"
    :with="[
      'UDashboardSidebar',
      'UDashboardSidebarCollapse',
      'UDashboardSidebarToggle',
      'UDashboardSearch',
      'UDashboardSearchButton',
      'UDashboardResizeHandle',
      'UDashboardPanel',
      'UDashboardNavbar',
      'UDashboardToolbar',
    ]"
  >
    <OthersScreen class="h-[26rem]">
      <!-- The sizes are not remembered: the example opens the same for every reader. -->
      <UDashboardGroup :persistent="false">
        <UDashboardSearch :groups="groups" />
        <UDashboardSidebar resizable collapsible :default-size="24">
          <template #header="{ collapsed }">
            <span v-if="!collapsed" class="font-mono text-label">sava-conf</span>
            <UDashboardSidebarCollapse class="ms-auto" />
          </template>
          <template #default="{ collapsed }">
            <UDashboardSearchButton :collapsed="collapsed" data-testid="open-UDashboardSearch" />
            <UNavigationMenu :items="links" orientation="vertical" :collapsed="collapsed" />
          </template>
          <template #resize-handle="{ onMouseDown, onTouchStart, onDoubleClick }">
            <UDashboardResizeHandle
              @mousedown="onMouseDown"
              @touchstart="onTouchStart"
              @dblclick="onDoubleClick"
            />
          </template>
        </UDashboardSidebar>
        <UDashboardPanel>
          <template #header>
            <UDashboardNavbar title="Registrations">
              <!-- The toggle the navbar draws by itself on a narrow screen, written out. -->
              <template #toggle>
                <UDashboardSidebarToggle />
              </template>
              <template #right>
                <UButton label="Invite" icon="i-lucide-plus" />
              </template>
            </UDashboardNavbar>
            <UDashboardToolbar>
              <template #left>
                <UInput
                  placeholder="Filter by name"
                  aria-label="Filter by name"
                  icon="i-lucide-search"
                  size="sm"
                />
              </template>
            </UDashboardToolbar>
          </template>
          <template #body>
            <p class="text-body-sm">Forty seats, twenty-four taken.</p>
          </template>
        </UDashboardPanel>
      </UDashboardGroup>
    </OthersScreen>
  </OthersSample>
</template>
