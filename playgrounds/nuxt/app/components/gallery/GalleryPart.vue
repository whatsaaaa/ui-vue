<script setup lang="ts">
const props = defineProps<{
  /** The parts of the example, by a selector: [data-slot=base] for the cells of a pin input. */
  part: string
  /** Which of them, from 0. */
  index?: number
  /** The attributes it takes: data-demo="focus", or the state a component gives one of its parts. */
  attrs: Record<string, string>
}>()

const root = useTemplateRef<HTMLElement>('root')

/** Gives the part its attributes, again where the component has set one of them back. */
function mark() {
  const part = root.value?.querySelectorAll(props.part)[props.index ?? 0]
  for (const [name, value] of Object.entries(props.attrs))
    if (part && part.getAttribute(name) !== value) part.setAttribute(name, value)
}

let observer: MutationObserver | undefined

onMounted(() => {
  mark()
  observer = new MutationObserver(mark)
  observer.observe(root.value!, {
    subtree: true,
    childList: true,
    attributeFilter: Object.keys(props.attrs),
  })
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <!--
    An example with one of its parts in a state: one cell of a pin input with the focus, one
    segment of a date field, a tag the arrow keys are on. data-demo on the example would draw the
    state on every part, and a component draws the parts of some itself, with no attribute an app
    passes. The part takes the attributes once it is drawn, and keeps them where the component
    sets one back; the box draws nothing of its own.
  -->
  <div ref="root" class="contents">
    <slot />
  </div>
</template>
