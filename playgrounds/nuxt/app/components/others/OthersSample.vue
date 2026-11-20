<script setup lang="ts">
import { type ComponentLevels, type ComponentName, components } from '#levels'

const props = defineProps<{
  /** The component the example shows. */
  name: ComponentName
  /** The components that only hold or lay out the example, shown with it. */
  with?: ComponentName[]
}>()

const component = computed<ComponentLevels>(() => components[props.name])
</script>

<template>
  <!--
    An example of a component at level 1, under its name and its levels as the levels file has
    them. The level 1 tests find a component's parts by data-sample.
  -->
  <article :id="name" :data-sample="name" class="scroll-mt-6 border-t-thin border-border pt-4">
    <header class="flex flex-wrap items-baseline gap-x-4 gap-y-1 font-mono text-caption">
      <h3 class="text-label text-text">{{ name }}</h3>
      <span v-if="props.with" class="text-text-secondary">
        with
        <template v-for="(other, index) in props.with" :key="other">
          <span :id="other" class="scroll-mt-6">{{ other }}</span
          >{{ index < props.with.length - 1 ? ', ' : '' }}
        </template>
      </span>
      <span class="text-text-secondary">
        level {{ component.today }}, for 1.0.0 level {{ component.target }}
      </span>
      <span v-if="component.parts" class="text-text-secondary">
        made of {{ component.parts.join(', ') }}
      </span>
    </header>
    <ul v-if="component.fails" class="mt-1 font-mono text-caption text-text-secondary">
      <li v-for="failure in component.fails" :key="`${failure.check} ${failure.theme}`">
        fails {{ failure.check }}{{ failure.theme ? ` in ${failure.theme}` : '' }}:
        {{ failure.note }}
      </li>
    </ul>
    <div class="mt-4 flex min-w-0 flex-wrap items-start gap-x-6 gap-y-5">
      <slot />
    </div>
  </article>
</template>
