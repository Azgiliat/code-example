<template>
<section class="bg-light">
  <div class="container-center">
    <div class="rules__header">
      <h3 class="header">Подробности о программе бонусирования</h3>
      <div class="divider" />
    </div>
    <div class="rules__about">
      <h3 class="rules__about-header header header--thin">О программе</h3>
      <p class="rules__about-text" v-html="about">.</p>
      <ul class="rules__about-list about-list">
        <li class="about-list__item">
          <a :href="getLink" class="about-list__link">
            <svg-icon name="web" class="about-list__icon" />
            <p class="about-list__text">
              {{getLink}}
            </p>
          </a>
        </li>
        <li class="about-list__item">
          <a :href="`mailto:${getEmail}`" class="about-list__link">
            <svg-icon class="about-list__icon" name="mailto" />
            <p class="about-list__text">
              Написать разработчику
            </p>
          </a>
        </li>
        <li class="about-list__item">
          <a :href="`tel:${getPhone}`" class="about-list__link">
            <svg-icon class="about-list__icon" name="tel" />
            <p class="about-list__text">
              Позвонить в тех поддержку
            </p>
          </a>
        </li>
      </ul>
    </div>
    <a class="rules__invite-link" :href="getAppLink" target="_blank">Рассказать друзьям</a>
    <div class="rules__creators">
      <h5 class="rules__creators-header">О разработчике</h5>
      <p v-html="creators">
        . <br />
        <a href="https://groupbms.ru/">https://groupbms.ru/</a> <br />
        <router-link to="/contacts" class="insideBlock showPoints"
        >Написать разработчику</router-link
        >
      </p>
      <img
        class="mogileImgAbout"
        style="display:block; margin: 0 auto"
        height="110px"
        src="/bms.png"
        alt="hello"
      />
    </div>
  </div>
</section>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Rules',
  middleware: ['preload-rules'],
  validate({ store }) {
    return store.getters['global/getOneModule']('rules')
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters('global', {
      getAppLink: 'getAppLink'
    }),
    ...mapGetters('rules', {
      getLink: 'getLink',
      getPhone: 'getPhone',
      getEmail: 'getEmail',
      about: 'getAbout',
      img: 'getImg',
      creators: 'getCreators'
    })
  },
  methods: {
    getIcon (type) {
      return './../assets/icons/' + (type || 'web') + '.svg'
    }
  }
}
</script>

<style lang="scss" scoped>
.rules__header,
.rules__about-header,
.rules__creators-header {
  text-align: center;
}
.rules__invite-link {
  width: 100%;
  display: block;
  background-color: var(--maincolor);
  padding: 10px 16px;
  border-radius: 10px;
  text-align: center;
  text-decoration: none;
  color: #ffffff;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}
.rules__about-list {
  list-style: none;
  padding: 0;
}
.rules__about-text {
  margin-bottom: 3rem;
}
.about-list__item {
  display: flex;
  margin-bottom: 1.5rem;
}
.about-list__link {
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  text-decoration: none;
}
.about-list__text {
  margin-left: 2rem;
  text-decoration: none;
  color: $dark-font;
}
.about-list__icon {
  fill: var(--maincolor);
  width: 24px;
  height: 24px;
  outline: none;
}
</style>
