<template>
  <!--
    A box that stands for the screen. What a component fixes to the screen, as a sidebar or a
    dashboard does, is fixed to the box, and what it sticks to the top sticks inside it.
  -->
  <div class="others-screen w-full overflow-hidden rounded-lg border-thin border-border">
    <slot />
  </div>
</template>

<style scoped>
/* A transform makes the box the containing block of what is fixed inside it. */
.others-screen {
  position: relative;
  transform: translateZ(0);
}
</style>
