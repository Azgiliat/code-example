<template>
<section class="article">
  <div class="container-center">
    <h4 class="header article__header">{{currentArticle.title}}</h4>
    <div class="divider" />
    <div class="article__img-wrapper">
      <img class="article__img" :src="getPicturePath(currentImg)" alt="Промо-картинка новости"/>
    </div>
    <p class="article__text" v-html="currentArticle.content">.</p>
    <div class="article__points-in" v-if="pointsIn.length">
      <hr class="newsHr"/>
      <h4 class="header article__points-in-header">Участвующие в данной акции точки:</h4>
      <ul class="article__points-in-list">
        <li class="article__points-in-item" v-for="(point, index) in pointsIn" :key="index">
          <a class="article__points-in-link" :href="'/points/'+point.id">
            <svg-icon
              class="article__points-in-icon"
              width="24"
              height="24"
              fill="var(--maincolor)"
              name="place"
            />
            <span class="article__points-in-name"
                  style="vertical-align:middle;"
                  :data-cherry="index"
                  :data-rating="point.currentBonus"
                  :data-title="point.title"
                  :data-latitude="point.address.latitude"
                  :data-longitude="point.address.longitude">
                  {{point.title}}
            </span>
          </a>
        </li>
      </ul>
    </div>
  </div>
  <Map :providedPoints="pointsIn" v-if="pointsIn.length"/>
</section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Map from '@/components/YandexMap.vue'

export default {
  name: 'SingleArticle',
  data () {
    return {
      picPath: '../pictures/',
      newsId: this.$route.params.id
    }
  },
  validate({ store }) {
    return store.getters['global/getOneModule']('news')
  },
  scrollToTop: true,
  components: { Map },
  middleware: [
    'preload-news',
    'preload-points'
  ],
  computed: {
    ...mapGetters('news', {
      getNews: 'getNews',
      getAllPoints: 'getAllPoints',
      getImages: 'getImages'
    }),
    ...mapGetters('global', {
      getPicturePath: 'getPicturePath'
    }),
    currentArticle () {
      return this.getNews[this.newsId] || []
    },
    pointsIn () {
      return this.getAllPoints.filter(point => this.currentArticle.points.indexOf(point.id) !== -1)
    },
    currentImg () {
      return this.getImages[this.newsId]
    }
  }
}
</script>

<style lang="scss" scoped>
.article__img-wrapper {
  width: 100%;
}

.article__header {
  margin-bottom: 0;
}

.article__img {
  width: 100%;
}

.article__points-in-list {
  list-style: none;
  padding: 0;
}

.article__points-in-link {
  display: block;
  transition: all 0.3s;
  text-decoration: none;
  text-align: center;

  &:hover {
    color: var(--maincolor);
    transform: scale(1.2)
  }
}
</style>
