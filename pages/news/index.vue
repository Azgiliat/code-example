<template>
<section class="all-news">
  <div class="container-center">
    <h3 class="all-news__header header">Новости и специальные предложения участников бонусной программы</h3>
    <div class="divider" />
    <div class="all-news__content-wrapper">
      <div
        class="all-news__content content"
        v-for="(action, index) in news" :key="index"
      >
        <router-link :to="{ name: 'news-id', params: { id: index } }" class="content__link-to-article">
          <h4 class="content__title header">
            {{ action.title }}
          </h4>
        </router-link>
        <router-link v-if="action.images[0] !== undefined"
                     :to="{ name: 'news-id', params: { id: index } }"
                     class="content__img-wrapper content__link-to-article">
          <img class="content__img"
               alt="Промо картинка акции"
               :src="getPicturePath(action.images[0])"
          />
        </router-link>
        <p class="articleText" v-html="action.content">.</p>
      </div>
    </div>
  </div>
</section>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'NewsBlock',
  middleware: ['preload-news'],
  validate({ store }) {
    return store.getters['global/getOneModule']('news')
  },
  data () {
    return {
      picPath: '../pictures/'
    }
  },
  computed: {
    ...mapGetters('news', {
      news: 'getNews'
    }),
    ...mapGetters('global', [
      'getPicturePath'
    ])
  }
}
</script>

<style lang="scss" scoped>
.all-news__title {
  margin: 0;
  text-align: center;
}
.all-news__content {
  border-bottom: 2px solid var(--maincolor);
  padding: 1.5rem;
}
.content__title {
  margin: 0;
}
.content__link-to-article {
  display: block;
  text-decoration: none;
  margin-bottom: 1rem;
}
.content__img {
  width: 100%;
}
</style>
