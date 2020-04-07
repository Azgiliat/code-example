<template>
  <nuxt></nuxt>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  head() {
    return {
      title: this.getTitle,
      link: [
        {rel: 'icon', type: 'image/x-icon', href: this.getPicturePath('xxhdpi_logo_small')}
      ]
    }
  },
  computed: {
    ...mapGetters('global', [
      'getPicturePath',
      'getTitle'
    ])
  }
}
</script>

<style scoped>

</style>
