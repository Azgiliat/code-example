<template>
  <footer class="footer">
    <p class="footer__text">
      Для получения бонусов установите Мобильное приложение Привилегия.
    </p>
    <div class="footer__links links">
      <div class="links__icons">
        <a class="links__link" :href="link">
          <svg-icon width="20" height="20" class="links__icon" name="google-mini"/>
        </a>
        <a class="links__link" :href="link">
          <svg-icon width="20" height="20" class="links__icon" name="apple-mini"/>
        </a>
      </div>
      <a class="links__more-info" :href="link">
        <p class="links__more-info-text">
          Подробнее
        </p>
      </a>
    </div>
  </footer>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'Footer',
    props: ['link'],
    data() {
      return {}
    },
    methods: {
      scrollTop() {
        const currentScroll = window.scrollY
        this.animate({
          timing(x) {
            return x
          },
          draw(progress) {
            const reverseProgress = 1 - progress
            window.scrollTo(0, reverseProgress * currentScroll)
          },
          duration: 500
        })
      },
      animate({timing, draw, duration}) {
        const start = performance.now()

        const animate = (time) => {
          let timeFraction = (time - start) / duration
          let progress = timing(timeFraction)
          draw(progress)
          if (progress >= 1) {
            progress = 1
          } else {
            requestAnimationFrame(animate)
          }
        }

        requestAnimationFrame(animate)
      }
    },
    computed: {
      ...mapGetters('global', [
        'getMainColor',
        'getMainDimmed',
        'getAppLink'
      ])
    }
  }
</script>

<style lang="scss" scoped>
.footer {
  background-color: $icon;
  padding: 15px 25px;
  color: $white;

  &__text {
    text-align: center;
  }
}

.links {
  display: flex;
  align-items: center;
  justify-content: center;

  &__icons {
    margin-right: 20px;
  }

  &__icon {
    margin-right: 10px;
    fill: $white;
  }

  &__more-info {
    display: block;
    color: $white;
    text-decoration: none;
    padding: 6px 37px 6px 10px;
    background-color: var(--contrastcolor);
    border-radius: 10px;
  }

  &__more-info-text {
    margin: 0;
  }
}
</style>
