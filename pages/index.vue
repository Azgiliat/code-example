<template>
  <div class="home">
    <Delivery/>
    <div class="home__header">
      <div class="container-center">
        <div class="home__header-container">
          <svg-icon width="30" height="30" class="home__header-icon" name="bonus"/>
          <h2 class="home__header-content">
            Бонусная программа "{{getTitle}}"
          </h2>
        </div>
      </div>
    </div>
    <News/>
    <AllPoints :isIndex="true"/>
    <client-only>
      <YandexMap class="home__map" :providedPoints="getPoints" :mainColor="getMainColor" />
    </client-only>

    <!--    <FeedBackForm />-->
    <!--    <FeedBackForm />-->
  </div>
</template>

<script>
  import Delivery from "../components/Delivery.vue";
  import News from '~/components/News.vue'
  import AllPoints from '~/components/AllPoints.vue'
  // import FeedBackForm from '@/components/FeedBackForm'
  import YandexMap from '~/components/YandexMap.vue';
  import {mapGetters} from 'vuex';

  export default {
    name: 'home',
    components: {
      // FeedBackForm,
      AllPoints,
      News,
      YandexMap,
      Delivery
    },
    middleware: ['preload-news', 'preload-points', 'check-auth'],
    validate({store}) {
      return store.getters['global/getOneModule']('main')
    },
    data() {
      return {
        showPoints: false,
        showMap: true
      }
    },
    computed: {
      ...mapGetters('points', {
        getPoints: 'getPoints',
        getActions: 'getActions'
      }),
      ...mapGetters('global', {
        checkModule: 'checkActiveModule',
        getMainColor: 'getMainColor',
        getTitle: 'getTitle'
      })
    }
  }
</script>

<style lang="scss" scoped>
.home__header {
  margin-top: 30px;
}
.home__header-container {
  display: flex;
  padding-bottom: 20px;
  border-bottom: 1px dashed rgba(102, 102, 102, 0.15);
}
.home__header-icon {
  fill: var(--maincolor);
  width: 30px;
  height: 30px;
  margin-right: 10px;
}

.home__header-content {
  margin: 0;
  color: var(--maincolor);
  font-size: 22px;
  line-height: 26px;
}

.home__map {
  padding-bottom: 0;
}
</style>
