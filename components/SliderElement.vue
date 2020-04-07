<template>
  <div class="action">
    <nuxt-link :to="`/news/${index}`" class="action__link">
      <div class="action__img-wrapper">
        <img :src="imgPath" class="action__img" alt="action img"/>
      </div>
    </nuxt-link>
    <nuxt-link :to="`/news/${index}`" class="action__link">
      <div class="action__title">
        <p class="action__title-text">
          {{action.title}}
        </p>
      </div>
    </nuxt-link>
    <nuxt-link :to="`/news/${index}`" class="action__link">
      <div class="action__more">
        <p class="action__more-text">
          Подробнее
        </p>
      </div>
    </nuxt-link>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';

  export default {
    name: 'SliderElement',
    computed: {
      ...mapGetters('global', {
        picturePath: 'getPicturePath'
      }),
      imgPath() {
        return this.picturePath(this.action.images[0])
      }
    },
    props: {
      action: {
        type: Object,
        require: true
      },
      index: {
        type: Number,
        require: true
      }
    }
  }
</script>

<style scoped lang="scss">
.action__img-wrapper {
  display: block;
  width: 250px;
  height: 187px;
  margin: 0 auto 15px;

  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
  border-radius: 10px;

  @media (min-width: $tablet-width) {
    width: 300px;
    height: 300px;
  }
}

.action__img {
  width: 100%;
  height: 100%;
  border-radius: 10px;
}

.action__link {
  display: block;
  padding: 0 10px 5px;
  text-decoration: none;
}

.action__title-text,
.action__more-text {
  margin: 0;
  text-decoration: none;
  font-size: 16px;
  line-height: 20px;
  color: $black;
  font-weight: 500;
}

.action__more-text {
  color: var(--contrastcolor);
}
</style>
