<template>
  <div class="slide">
    <slot />
  </div>
</template>

<script>
  export default {
    name: "Slide"
  }
</script>

<style lang="scss" scoped>
.slide {
  margin-right: var(--sliderMargin);
  scroll-snap-align: start;

  &:last-child {
    padding-right: var(--sliderMargin);
  }
}
</style>
