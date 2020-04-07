<template>
<section class="news">
  <div class="container-center">
    <h2 class="title news__title">
      Новости и акции
    </h2>
<!--      <div class="news__slider" v-if="getActions.length">-->
<!--        <carousel :paginationActiveColor="getMainColor" :paginationSize="15" :perPageCustom="[[1280, 3]]">-->
<!--          <slide v-for="(img, index) in getActions" :key="index">-->
<!--            <slider-element  :index="index" :imgPath="getPicturePath(img.images[0])" />-->
<!--          </slide>-->
<!--        </carousel>-->
<!--      </div>-->
  </div>
  <div class="news__slider" v-if="getActions.length">
    <Slider :sliderMargin="10">
      <Slide v-for="(action, index) in getActions" :key="index">
        <SliderElement :action="action" :index="index" />
      </Slide>
    </Slider>
  </div>
  <p v-else class="news__no-news">
    Новостей пока нет, но скоро обязательно появятся.
  </p>
</section>
</template>

<script>
import { mapGetters } from 'vuex'
import SliderElement from "./SliderElement";
import Slide from '~/components/Slider/Slide.vue';
import Slider from '~/components/Slider/Slider.vue';
export default {
  name: 'news',
  components: {
    SliderElement,
    Slide,
    Slider
  },
  fetch({ store, params }) {

  },
  computed: {
    ...mapGetters('points', {
      getActions: 'getActions'
    }),
    ...mapGetters('global', {
      getMainColor: 'getMainColor'
    })
  }
}
</script>

<style lang="scss">
.news {
  margin-top: 10px;
}
.news__no-news {
  color: var(--colorOnSecondary);
  text-align: center;

  @media(min-width: $tablet-width) {
    font-size: 1.3rem;
  }
}
.news__slider {
  margin-top: 15px;
  margin-left: 5px;
}
</style>
