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

    @media(min-width: $desktop-width) {
      padding-right: 0;
    }
  }
}
</style>
