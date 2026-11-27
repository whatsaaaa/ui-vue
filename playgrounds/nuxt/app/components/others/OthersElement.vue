<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'

const day = shallowRef(new CalendarDate(2027, 5, 10))

const seats = [
  { label: 'Paid', value: 24, color: 'success' },
  { label: 'Held', value: 6, color: 'warning' },
  { label: 'Free', value: 10, color: 'neutral' },
]

const reminders = ref(true)
const view = ref('list')
const views = [
  { label: 'List', value: 'list', icon: 'i-lucide-list' },
  { label: 'Board', value: 'board', icon: 'i-lucide-columns-3' },
  { label: 'Calendar', value: 'calendar', icon: 'i-lucide-calendar' },
]
</script>

<template>
  <OthersSample name="UAlert">
    <div class="grid w-full gap-3 lg:grid-cols-2">
      <UAlert
        title="Registration closes on Friday"
        description="After April 1 the price goes up to €480."
        icon="i-lucide-info"
      />
      <UAlert
        color="neutral"
        variant="outline"
        title="The program is out"
        description="Three days, twenty talks and four workshops."
        icon="i-lucide-calendar"
        close
      />
      <UAlert
        color="success"
        variant="soft"
        title="Your seat is saved"
        description="We sent the ticket to milica@example.com."
        icon="i-lucide-circle-check"
      />
      <UAlert
        color="error"
        variant="subtle"
        title="The card was declined"
        description="Nothing was charged. Try another card."
        icon="i-lucide-octagon-alert"
        :actions="[{ label: 'Try again' }]"
      />
      <UAlert
        color="warning"
        variant="solid"
        title="Two seats left"
        description="The workshop on forms is nearly full."
        icon="i-lucide-triangle-alert"
      />
    </div>
  </OthersSample>

  <OthersSample name="UAvatar">
    <UAvatar alt="Milica Jovanović" size="sm" />
    <UAvatar alt="Nikola Petrović" />
    <UAvatar alt="Jelena Marković" size="lg" />
    <UAvatar icon="i-lucide-user" size="xl" />
  </OthersSample>

  <OthersSample name="UAvatarGroup">
    <UAvatarGroup :max="3">
      <UAvatar alt="Milica Jovanović" />
      <UAvatar alt="Nikola Petrović" />
      <UAvatar alt="Jelena Marković" />
      <UAvatar alt="Stefan Ilić" />
      <UAvatar alt="Ana Đorđević" />
    </UAvatarGroup>
  </OthersSample>

  <OthersSample name="UBanner">
    <UBanner
      class="w-full"
      icon="i-lucide-megaphone"
      title="Registration for Sava Conf 2027 is open."
      close
      :actions="[{ label: 'Register', variant: 'outline' }]"
    />
  </OthersSample>

  <OthersSample name="UCalendar">
    <UCalendar v-model="day" />
  </OthersSample>

  <OthersSample name="UChip">
    <UChip text="3" size="3xl">
      <UButton icon="i-lucide-bell" color="neutral" variant="outline" aria-label="Notifications" />
    </UChip>
    <UChip color="success" inset>
      <UAvatar alt="Milica Jovanović" />
    </UChip>
  </OthersSample>

  <OthersSample name="UCollapsible">
    <UCollapsible :default-open="true" class="w-64">
      <UButton
        label="What is included"
        color="neutral"
        variant="outline"
        trailing-icon="i-lucide-chevron-down"
        block
      />
      <template #content>
        <p class="pt-2 text-body-sm">Lunch on all three days, and the recordings afterwards.</p>
      </template>
    </UCollapsible>
  </OthersSample>

  <OthersSample name="UIcon">
    <UIcon name="i-lucide-ticket" class="size-icon" />
    <UIcon name="i-lucide-map-pin" class="size-icon-lg" />
    <UIcon name="i-lucide-calendar" class="size-8 text-text-secondary" />
  </OthersSample>

  <OthersSample name="UKbd">
    <UKbd value="meta" />
    <UKbd value="K" />
    <UKbd value="enter" variant="subtle" />
    <UKbd value="escape" variant="solid" />
    <UKbd value="shift" variant="soft" size="lg" />
  </OthersSample>

  <OthersSample name="UProgress">
    <div class="flex w-64 flex-col gap-4">
      <UProgress :model-value="60" aria-label="Seats taken" />
      <UProgress
        :model-value="2"
        :max="['Sent', 'Paid', 'Confirmed', 'Checked in']"
        aria-label="Registration"
      />
    </div>
  </OthersSample>

  <OthersSample name="UProgressGroup">
    <UProgressGroup :items="seats" :max="40" class="w-64" aria-label="Seats" />
  </OthersSample>

  <OthersSample name="USeparator">
    <div class="flex w-64 flex-col gap-4">
      <USeparator />
      <USeparator label="or" />
      <USeparator icon="i-lucide-ticket" type="dashed" />
    </div>
  </OthersSample>

  <OthersSample name="USkeleton">
    <div class="flex items-center gap-4">
      <USkeleton class="size-12 rounded-full" />
      <div class="flex flex-col gap-2">
        <USkeleton class="h-4 w-56" />
        <USkeleton class="h-4 w-40" />
      </div>
    </div>
  </OthersSample>

  <OthersSample name="UToggle">
    <UToggle v-model="reminders" label="Reminders" icon="i-lucide-bell" />
    <UToggle :default-value="false" label="Newsletter" icon="i-lucide-mail" />
    <UToggle :default-value="true" icon="i-lucide-star" aria-label="Favorite, on" />
    <UToggle :default-value="false" icon="i-lucide-star" aria-label="Favorite, off" />
  </OthersSample>

  <OthersSample name="UToggleGroup">
    <UToggleGroup v-model="view" :items="views" aria-label="View" />
    <UToggleGroup default-value="board" :items="views" aria-label="View, another chosen" />
    <UToggleGroup default-value="calendar" :items="views" attached aria-label="View, attached" />
  </OthersSample>
</template>
