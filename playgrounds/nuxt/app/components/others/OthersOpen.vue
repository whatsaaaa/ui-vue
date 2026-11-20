<template>
  <!--
    An open menu, popover or tooltip as a picture, as GalleryOpen draws an open list: held open
    with :portal="false", so it is drawn here, and inert, so it takes no focus as the page loads.
    main.css lays it out in place, under its trigger.
  -->
  <div class="others-open" inert>
    <slot />
  </div>
</template>
