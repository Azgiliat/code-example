<template>
  <div class="error">
    <div class="block">
      <div class="icon">
        <svg-icon name="error" :style="{fill: getMainColor}" />
      </div>
      <h1 class="title">Страница не найдена</h1></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'error.vue',
  layout: 'clear',
  head() {
    return {
      title: `${this.getTitle} - Страница не найдена`,
      link: [
        {rel: 'icon', type: 'image/x-icon', href: this.getPicturePath('xxhdpi_logo_small')}
      ],
      meta: [
        { hid: 'og:title', property: 'og:title', content: `${this.getTitle}` },
        { hid: 'og:type', property: 'og:type', content: 'website' },
        { hid: 'og:image', property: 'og:image', content: this.getPicturePath('xxhdpi_logo_small') },
        { hid: 'og:url', property: 'og:url', content: this.getReferer +this.$route.fullPath },
        { hid: 'og:description', property: 'og:description', content: `Бонусная программа ${this.getTitle}` }
      ]
    }
  },
  computed: {
    ...mapGetters('global', [
      'getTitle',
      'getPicturePath',
      'getMainColor'
    ])
  }
}
</script>

<style scoped>
  .error {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    text-align: center;
  }
</style>
