<template>
  <div class="navigation" :style="{ '--maincolorrgb': getMainColorRgb, '--headerHeight': `${headerHeight}px` }">
    <div ref="header" class="navigation__header">
      <div class="navigation__header-content container-center">
        <button
          class="navigation__menu-toggle menu-toggle"
          type="button"
          @click.stop="openMobileNav"
        >
          <span class="menu-toggle__element"/>
        </button>
        <img :src="getPicturePath('xxhdpi_logo_small')" class="navigation__logo"/>
        <nuxt-link to="/profile" class="navigation__cabinet">
          <svg-icon :name="'cabinet'" width="27" height="20" class="navigation__cabinet-icon"/>
        </nuxt-link>
      </div>
    </div>
    <transition name="showMobileMenu">
      <nav class="mobile-nav navigation__mobile-nav"
           v-if="getNavState" ref="mobileNav">
        <ul class="navigation__list list">
          <li
            v-for="(item, index) in getActiveModules.filter(module => module.id !== 'cabinet')"
            :key="index"
            class="list__item"
            @click.stop="closeMobileNav"
          >
            <router-link :to="item.path" class="list__link">
              <div class="list__icon-wrapper">
                <svg-icon :name="item.id" class="list__icon"/>
              </div>
              <span class="list__link-name">
                 {{ item.name }}
               </span>
            </router-link>
          </li>
          <li v-if="isLogged" class="list__item list__link"
              @click.stop="closeMobileNav">
            <div class="list__icon-wrapper">
              <svg-icon :name="'logout'" class="list__icon"/>
            </div>
            <span class="list__link-name">
                 Выйти
               </span>
          </li>
        </ul>
      </nav>
    </transition>
    <!--    <div class="overlay" :class="{ 'overlay&#45;&#45;active': mobileMenuShowed }" />-->
    <!--    <nav class="desktop-nav container-center">-->
    <!--      <div class="container-center&#45;&#45;space-around container-center&#45;&#45;flex">-->
    <!--      <img :src="getPicturePath('xxhdpi_logo_small')" class="desktop-nav__img" />-->
    <!--      <ul class="navigation__list">-->
    <!--        <li-->
    <!--          v-for="(item, index) in getActiveModules"-->
    <!--          :key="index"-->
    <!--          class="navigation__list-item"-->
    <!--        >-->
    <!--          <router-link :to="item.path" class="navigation__list-link">-->
    <!--            {{ item.name }}-->
    <!--          </router-link>-->
    <!--        </li>-->
    <!--      </ul>-->
    <!--      </div>-->
    <!--    </nav>-->

  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    name: 'navigation',
    data() {
      return {
        mobileMenuShowed: false,
        headerHeight: null
      }
    },
    computed: {
      ...mapGetters('global', {
        getTitle: 'getTitle',
        getActiveModules: 'getActiveModules',
        getMainColorRgb: 'getMainColorRgb',
        getPicturePath: 'getPicturePath',
        getNavState: 'getNavState',
        isLogged: 'getIsLogged'
      })
    },
    methods: {
      ...mapMutations('global', {
        toggleOverlay: 'setOverlayState',
        toggleNav: 'setNavState'
      }),
      openMobileNav() {
        this.toggleOverlay(true);
        this.toggleNav(true);
      },
      closeMobileNav() {
        this.toggleOverlay(false);
        this.toggleNav(false);
      },
    }
  }
</script>

<style lang="scss" scoped>
  .showMobileMenu-enter,
  .showMobileMenu-leave-to {
    transform: translateX(-100%);
  }

  .showMobileMenu-enter-to {
    transform: translateY(0);
  }

  .mobile-nav {
    transition: all 1s;
    width: 84%;
    height: 100vh;
    overflow-y: auto;
    background-color: $white;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 150;
    padding-top: calc(var(--headerHeight) + 20px);
    padding-left: 15px;
    padding-right: 10px;

    @media(min-width: $tablet-width) {
      width: 50%;
    }

    @media (min-width: $desktop-width) {
      display: none;
    }
  }

  .mobile-nav__title {
    color: $dark-font;
    font-weight: 600;
    text-align: center;
    font-size: 1rem;
    margin: 0 0 0 1.5rem;

    @media (min-width: $tablet-width) {
      font-size: 1.5rem;
    }
  }

  .mobile-nav__header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-right: 40px;
  }

  .mobile-nav__close-button {
    border: none;
    background-color: transparent;
    width: 1.5rem;
    height: 1.5rem;
    position: absolute;
    top: 45px;
    right: 10px;
    outline: none;
    transition: all 0.5s;
    transform-origin: center top;

    &::before,
    &::after {
      @include pseudo-element;
      width: 100%;
      height: 3px;
      background-color: $dark-font;
    }

    &::before {
      transform: rotate(45deg);
    }

    &::after {
      transform: rotate(-45deg);
    }

    &:hover {
      transform: scale(1.3);
    }
  }

  .desktop-nav {
    display: none;

    @media (min-width: $desktop-width) {
      display: block;
      order: 1;
      margin-bottom: 0.8rem;
      padding-top: 1rem;
    }
  }

  .navigation {
    margin-bottom: 3rem;
    background-color: $white;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 400;
    box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.1);
    border-radius: 0px 0px 20px 20px;

    @media(min-width: $desktop-width) {
      position: static;
      display: flex;
      flex-wrap: wrap;
    }
  }

  .navigation__logo {
    width: 70px;
    height: auto;
    position: absolute;
    border-radius: 10px;
    top: 5px;
    left: calc(50% - 35px);
  }

  .navigation__header {
    padding-bottom: 1rem;
    padding-top: 1rem;
    position: relative;
    z-index: 500;
    box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.1);
    border-radius: 0px 0px 20px 20px;

    @media (min-width: $desktop-width) {
      order: 2;
      background-color: $light-back;
      justify-content: center;
      border-top-right-radius: 10px;
      border-top-left-radius: 10px;
    }
  }

  .navigation__header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .navigation__cabinet {
    transition: fill $transition;

    &:hover {
      cursor: pointer;
      fill: var(--maincolor);
    }
  }

  .navigation__app-title {
    margin: 0;
    font-size: 19px;
    color: #ffffff;
    text-align: center;

    @media (min-width: $desktop-width) {
      color: $dark-font;
      font-size: 2.5rem;
      font-weight: 700;
      margin-top: 2rem;
    }
  }

  .list {
    list-style: none;
    padding: 0;
    margin: 0;

    @media (min-width: $desktop-width) {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-content: center;
    }
  }

  .list__item {
    padding: 10px 20px 10px 10px;
    border-radius: 8px;
    transition: all $transition;

    &:hover .list__link-name {
      color: var(--maincolor);
    }

    &:hover svg {
      fill: rgba(var(--maincolorrgb), 1);
    }

    @media(min-width: $desktop-width) {
      padding: 0.6rem;
    }
  }

  .list__icon-wrapper {
    margin-right: 1rem;
    width: 30px;
    height: 30px;
    display: flex;
    justify-items: center;
    align-content: center;
  }

  .list__link-name {
    transition: color $transition;
  }

  .list__link {
    color: $dark-font;
    display: flex;
    align-items: center;
    width: 100%;
    text-decoration: none;

    @media (min-width: $desktop-width) {
      display: block;
      width: auto;
      color: $light-font;
      font-size: 1rem;
      font-weight: bold;
      transition: color 0.5s;
      position: relative;

      &::before {
        @include pseudo-element;
        top: 110%;
        left: 50%;
        width: 0;
        height: 2px;
        background-color: transparent;
        transition: width 1s, transform 1s, background-color 0.5s;
        transform: translateX(-50%);
      }
    }

    &:hover {
      text-decoration: none;

      @media(min-width: $desktop-width) {
        &::before {
          width: 100%;
          background-color: $light-font;
          transform: translateX(-50%);
        }
      }
    }
  }

  .list__icon {
    transition: fill $transition;
    fill: rgb(158, 158, 158);
  }

  .navigation__menu-toggle {
    border: none;
    padding: 0;
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 2.5rem;
    background-color: transparent;

    @media (min-width: $desktop-width) {
      display: none;
    }
  }

  .menu-toggle__element {
    position: relative;
    display: block;
    border: none;
    background-color: var(--maincolor);
    width: 100%;
    height: 2px;

    &::before,
    &::after {
      @include pseudo-element;
      width: 100%;
      height: 2px;
      background-color: inherit;
    }

    &::before {
      top: -400%;
    }

    &::after {
      top: 400%;
    }
  }

  .desktop-nav__img {
    width: 100px;
    height: 100px;
  }
</style>
