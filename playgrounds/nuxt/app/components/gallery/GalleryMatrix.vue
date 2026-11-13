<script setup lang="ts" generic="Row extends string, Column extends string">
defineProps<{ rows: readonly Row[]; columns: readonly Column[]; label: string }>()
</script>

<template>
  <!--
    Every row with every column, such as a color in every variant. It scrolls inside itself on a
    narrow screen, and its controls take the keyboard there.
  -->
  <div class="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:px-0">
    <table class="border-separate border-spacing-x-3 border-spacing-y-2.5 -mx-3">
      <caption class="sr-only">
        {{ label }}
      </caption>
      <thead>
        <tr>
          <td />
          <th
            v-for="column in columns"
            :key="column"
            scope="col"
            class="text-start font-mono text-overline uppercase text-text-secondary"
          >
            {{ column }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row">
          <th
            scope="row"
            class="pe-2 text-start align-baseline font-mono text-caption text-text-secondary"
          >
            {{ row }}
          </th>
          <td v-for="column in columns" :key="column" class="align-baseline whitespace-nowrap">
            <slot :row="row" :column="column" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
