<template>
  <div class="points">
    <AllPoints></AllPoints>
    <client-only>
      <YandexMap :providedPoints="getPoints" :mainColor="getMainColor"></YandexMap>
    </client-only>
  </div>
</template>

<script>
import AllPoints from '~/components/AllPoints';
import YandexMap from '../../components/YandexMap';

import { mapGetters } from 'vuex';
export default {
  name: 'points',
  middleware: ['preload-points'],
  validate({ store }) {
    return store.getters['global/getOneModule']('points')
  },
  components: {
    AllPoints,
    YandexMap
  },
  computed: {
    ...mapGetters('points', {
      getPoints: 'getPoints'
    }),
    ...mapGetters('global', {
      getMainColor: 'getMainColor'
    })
  }
}
</script>

<style scoped>

</style>
