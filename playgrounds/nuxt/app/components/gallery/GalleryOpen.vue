<template>
  <!--
    An open list or window as a picture: a select, a select menu or a modal held open with
    :portal="false", so it is drawn here and not in a layer at the end of the page. It takes no
    focus, as the list and the window would, so data-demo="open" draws what the focus would: the
    chosen option highlighted. main.css lays the list and the window out in place.
  -->
  <div class="gallery-open" data-demo="open" inert>
    <slot />
  </div>
</template>
