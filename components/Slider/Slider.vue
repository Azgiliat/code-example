<template>
  <div class="slider">
    <div v-if="totalPages > 1" class="slider__desktop-pagination desktop-pagination">
      <div class="desktop-pagination__prev" :class="{'desktop-pagination__prev--disabled': currentPage === 0}"
           @click="prevPage">
        <svg-icon width="40" height="15" class="desktop-pagination__prev-icon" name="arrow"/>
      </div>
      <p class="desktop-pagination__pages">
        {{currentPage + 1}}/{{totalPages}}
      </p>
      <div class="desktop-pagination__next"
           :class="{'desktop-pagination__next--disabled': currentPage + 1 === totalPages}" @click="nextPage">
        <svg-icon width="40" height="15" class="desktop-pagination__next-icon" name="arrow"/>
      </div>
    </div>
    <div class="slider__mask" ref="slider">
      <div class="slider__content" ref="sliderMask"
           :style="{'transform': `translateX(${-1 * currentPage * sliderWidth}px)`, '--sliderMargin': `${sliderMargin}px`}">
        <slot/>
        <SinglePage v-for="page in totalPages" :ref="`page-${page - 1}`" :key="`page-${page}`"/>
      </div>
    </div>
  </div>
</template>

<script>
  import SinglePage from "./SinglePage";

  export default {
    name: "Slider",
    components: {
      SinglePage
    },
    props: {
      sliderMargins: {
        type: Array,
        require: false,
        default: () => [[320, 20]]
      }
    },
    data() {
      return {
        sliderMargin: 20,
        totalPages: 0,
        perPage: 0,
        currentPage: 0,
        sliderWidth: 0
      }
    },
    methods: {
      getSliderWidth() {
        return this.$refs.slider.clientWidth;
      },
      prevPage() {
        if (this.currentPage > 0) {
          this.currentPage--;
        }
      },
      nextPage() {
        if (this.currentPage + 1 < this.totalPages) {
          this.currentPage++;
        }
      }
    },
    mounted() {
      this.sliderMargins.forEach(pair => {
        if (window.matchMedia(`(min-width: ${pair[0]}px)`).matches) {
          this.sliderMargin = pair[1]
        }
      });
      if (window.matchMedia(`(min-width: 1280px)`).matches) {
        const slider = this.$refs.slider;
        const sliderMask = this.$refs.sliderMask;
        const allSlides = [...sliderMask.querySelectorAll('.slide')];
        const slide = allSlides[0];

        this.totalPages = Math.ceil((allSlides.length * (slide.clientWidth + this.sliderMargin) - this.sliderMargin)
          / slider.clientWidth);
        this.perPage = Math.floor(slider.clientWidth / slide.clientWidth);

        console.log()

        this.$nextTick(() => {
          for (let i = 0; i < this.totalPages; i++) {
            for (let j = 0; j < this.perPage; j++) {
              (allSlides[this.perPage * i + j]) && this.$refs[`page-${i}`][0].$el.append(allSlides[this.perPage * i + j]);
            }
            this.$refs[`page-${i}`][0].$el.style.minWidth = `${slider.clientWidth}px`
          }

          sliderMask.style.width = `${this.totalPages * this.$refs['page-0'][0].$el.clientWidth}px`;

          this.sliderWidth = this.getSliderWidth();
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.slider {
  @media(min-width: $desktop-width) {
    position: relative;
  }

  &__mask {
    overflow: hidden;
  }

  &__desktop-pagination {
    display: none;

    @media (min-width: $desktop-width) {
      display: flex;
      position: absolute;
      top: -20px;
      right: 0;
      transform: translateY(-100%);
    }
  }
}

.desktop-pagination {
  &__pages {
    font-size: 14px;
    line-height: 21px;
    margin: 0 20px;
  }

  &__prev, &__next {
    display: flex;
    align-items: center;
    fill: var(--contrastcolor);

    &:hover {
      cursor: pointer;
    }

    &--disabled {
      opacity: 0.15;

      &:hover {
        cursor: auto;
      }
    }
  }

  &__next-icon {
    transform: rotate(180deg);
  }
}

.slider__content {
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

  @media (min-width: $desktop-width) {
    transition: all $transition;
  }
}

.slider-page {
  display: none;

  @media(min-width: $desktop-width) {
    display: flex;
    justify-content: space-around;
    align-items: center;
    min-width: 100%;
  }
}
</style>
