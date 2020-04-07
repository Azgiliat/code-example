<template>
  <section class="partners">
    <div class="container-center">
      <h3 class="title">
        Наши партнёры
      </h3>
    </div>
    <div class="partners__categories categories">
      <slider :slider-margin="10" class="categories__slider">
        <slide class="categories__slide" :key="category" v-for="category in ['Все', ...categories]">
          <p class="categories__name" :class="{'categories__name--active': currentCategory === category}"
             @click="currentCategory = category">
            {{category}}
          </p>
        </slide>
      </slider>
    </div>
    <div class="container-center">
      <ul ref="pointsList"
          :style="{height: `${gotMorePoints ? pointHeight * 3 : pointHeight * currentPoints.length}px`}"
          class="partners__list">
        <li class="partners__block partner" v-for='(item, index) in currentPoints'
            :key='item.title + index'
            :ref="`point-${index}`"
        >
          <point-view :item="item"/>
        </li>
      </ul>
      <button type="button" class="partners__button" @click="showMore" v-if="gotMorePoints && isIndex">
        {{buttonText}}
      </button>
    </div>
  </section>
</template>

<script>
  import {mapGetters} from 'vuex';
  import Slide from "./Slider/Slide";
  import Slider from "./Slider/Slider";
  import ActionsList from '~/components/ActionsList.vue'
  import PointView from '~/components/PointView.vue'

  export default {
    name: 'AllPoints',
    props: {
      isIndex: {
        type: Boolean,
        require: false,
        default: false
      }
    },
    data() {
      return {
        showAll: false,
        buttonText: 'Ещё больше партнёров',
        gotMorePoints: true,
        currentCategory: 'Все',
        pointHeight: 0
      }
    },
    components: {
      'point-view': PointView,
      ActionsList,
      Slide,
      Slider
    },
    computed: {
      ...mapGetters('points', {
        points: 'getPoints',
        actions: 'getActions',
        categories: 'getCategories'
      }),
      currentPoints() {
        return this.currentCategory === 'Все' ? this.points : this.points.filter(({categoryName}) => categoryName === this.currentCategory)
      }
    },
    mounted() {
      console.log(this.$refs['point-0']);
      this.pointHeight = this.$refs['point-0'][0].clientHeight +
        parseFloat(getComputedStyle(this.$refs['point-0'][0]).getPropertyValue('margin-bottom').slice(0, -2));
    },
    methods: {
      showMore() {
        this.gotMorePoints = false;
      }
    }
  }
</script>

<style lang="scss" scoped>
.categories__slider {
  margin-left: 15px;
}

.categories__name {
  font-size: 16px;
  line-height: 15px;
  padding: 15px 44px 10px;
  border: 1px solid var(--maincolor);
  border-radius: 10px;
  transition: all $transition;
  font-weight: 500;
  color: $black;

  &--active {
    background-color: var(--maincolor);
    color: $white;
  }

  &:hover {
    cursor: pointer;
  }
}

.partners__block {
  display: block;
  width: 100%;
  margin-bottom: 15px;

  @media (min-width: $tablet-width) {
    width: auto;
    padding: 0.5rem;
    border-radius: 8px;
    transition: all 0.5s;

    &:hover {
      //transform: scale(1.1);
      border-color: var(--maindimmed);
      box-shadow: 0 0 13px rgba(0, 0, 0, 0.7);
    }
  }
}

.partners__list {
  transition: all $transition;
  padding: 0;
  list-style: none;
  overflow-y: hidden;

  @media (min-width: $tablet-width) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    grid-column-gap: 2%;
    justify-content: space-evenly;
  }

  @media (min-width: $desktop-width) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 2%;
    grid-auto-columns: 1fr;
  }
}

.partners__button {
  border: none;
  font-size: 14px;
  line-height: 13px;
  background-color: var(--contrastcolor);
  display: block;
  color: $white;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  padding: 15px 40px;
  width: 100%;
}
</style>
