<template>
  <div
    id="app"
    :style="{ '--maincolor': getMainColor, '--maindimmed': getMainDimmed,
    '--contrastcolor': getColorAccent, '--colorOnPrimary': getColorOnPrimary, '--colorOnSecondary': getColorOnSecondary,
    '--maincolorrgb': getMainColorRgb }"
    class="app">
    <h1 class="visually-hidden">
      Бонусная программа "{{getTitle}}"
    </h1>
    <Navigation ref="nav" />
    <transition name="fade-fast" mode="out-in">
      <nuxt class="app__body"/>
    </transition>
    <Footer
      :link="getAppLink"
    />
    <Notification ref="nav"/>
    <div @click="overlayClickHandler" class="overlay" :class="{'overlay--active': getOverlayState}"/>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex';
  import Notification from '~/components/Notification.vue'
  import Navigation from '~/components/Navigation.vue'
  import Footer from '~/components/Footer.vue'

  export default {
    components: {
      Notification,
      Navigation,
      Footer
    },
    head(arg) {
      return {
        title: this.getTitle,
        link: [
          {rel: 'icon', type: 'image/x-icon', href: this.getReferer + this.getPicturePath('xxhdpi_logo_small')},
          {rel: 'image_src', href: this.getReferer + this.getPicturePath('xxhdpi_logo_small')},
          {rel: 'image_url', href: this.getReferer + this.getPicturePath('xxhdpi_logo_small')}
        ],
        meta: [
          {hid: 'og:title', property: 'og:title', content: `${this.getTitle}`},
          {hid: 'og:type', property: 'og:type', content: 'website'},
          {hid: 'og:image', property: 'og:image', content: this.getPicturePath('xxhdpi_logo_small')},
          {hid: 'og:url', property: 'og:url', content: this.getReferer + this.$route.fullPath},
          {hid: 'og:description', property: 'og:description', content: `Бонусная программа ${this.getTitle}`}
        ]
      }
    },
    data() {
      return {
        navPadding: null,
        footerLink: null,
      }
    },
    computed: {
      ...mapGetters('global', [
        'getMainColor',
        'getMainDimmed',
        'getColorAccent',
        'getColorOnPrimary',
        'getColorOnSecondary',
        'getAppLink',
        'getTitle',
        'getPicturePath',
        'getReferer',
        'getOverlayState',
        'getNavState',
        'getMainColorRgb'
      ]),
      ...mapGetters('news', {
        getImages: 'getImages'
      })
    },
    methods: {
      ...mapMutations('global', {
        setOverlayState: 'setOverlayState',
        setNavState: 'setNavState'
      }),
      overlayClickHandler() {
        if (this.getNavState) {
          this.setOverlayState(false);
          this.setNavState(false);
        }
      }
    }

  }
</script>

<style lang="scss">
.navigation-shadow {
  position: relative;
  width: 100%;
  top: 0;
  left: 0;

  @media(min-width: $desktop-width) {
    display: none;
  }
}

.fade-fast-enter-active,
.fade-fast-leave-active {
  transition: opacity 0.25s;
}

.fade-fast-enter,
.fade-fast-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.2);
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 3000;
  overflow: hidden;
  margin: 0 auto;
  top: 0;
  left: 0;
}

.app {
  position: relative;

  &__body > *:first-child {
    padding-top: 75px !important;
  }
}

.navigation-shadow {
  background-color: rgba(var(--maincolorrgb), 0.1);
}
</style>

