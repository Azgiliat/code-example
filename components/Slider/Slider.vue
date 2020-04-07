<template>
  <div class="slider">
    <div class="slider__mask" :style="{'--sliderMargin': `${sliderMargin}px`}">
      <slot/>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Slider",
    props: {
      sliderMargin: {
        type: Number,
        require: false,
        default: 20
      }
    }
  }
</script>

<style lang="scss" scoped>
.slider__mask {
  display: flex;
  overflow: scroll hidden;
  scroll-snap-type: x mandatory;

  &::-webkit-scrollbar {
    width: 0 !important
  }

  @supports (overflow: -moz-scrollbars-none) {
    overflow: -moz-scrollbars-none
  }

  @supports (-ms-overflow-style: none) {
    -ms-overflow-style: none;
  }
}
</style>
