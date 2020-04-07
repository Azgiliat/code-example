<template>
<section class="single-point">
  <div class="single-point__info">
    <div class="container-center">
      <div class="single-point__title">
        <h3 class="header">{{point.title}}</h3>
        <hr class="newsHr">
      </div>
      <div class="single-point__content">
        <div class="single-point__rules rules">
          <h3 class="header rules__header">
            Правила бонусирования
          </h3>
          <ul class="rules__list">
            <li :key="index" v-for="(unit, index) in point.units" class="rules__list-item">
              <span>
                <i class="fas fa-percent fa-sm rules__percent" aria-hidden="true"/>
                {{unit.title}}
              </span>
            </li>
          </ul>
        </div>
        <div class="single-point__action action" v-if="actions.length > 0">
          <div class="action__wrapper">
            <svg-icon class="action__icon" width="24" height="24" name="fire" />
            <span class="action__title header">
              Акции
            </span>
          </div>
          <transition appear v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:leave="leave">
            <ul v-if="actionsShowed" class="action__list">
              <li class="action__list-item" v-for="(action) in actions" :key="action.title">
                <router-link :to="`/news/${getActions.indexOf(action)}`" class="action__link-to-action">
                  {{action.title}}
                </router-link>
              </li>
            </ul>
          </transition>
          <button class="action__show-all" @click.stop="toggleActionsList">
            <svg-icon class="action__show-all-icon" width="30" height="30" ref="actionsArrow" name="arrow-down" />
          </button>
        </div>
        <div class="single-point__point-info point-info">
          <div class="point-info__rating-block point-info__block" v-if="point.rating !== 0">
            <h4 class="header point-info__header">Рейтинг заведения</h4>
            <div class="point-info__wrapper">
              <i class="fas fa-star point-info__icon point-info__icon--star" aria-hidden="true"/>
              <span class="point-info__rating">
              {{point.rating}}
            </span>
            </div>
          </div>
          <div class="point-info__phone-block point-info__block" v-if="point.phone !== ''">
            <h4 class="header point-info__header">Телефон</h4>
            <div class="point-info__wrapper">
              <i class="fas fa-phone-square point-info__icon point-info__icon--phone" aria-hidden="true"/>
              <span class="point-info__phone">
              {{point.phone}}
            </span>
            </div>
          </div>
          <div class="point-info__bonus-block point-info__block" v-if="point.currentBonus !== ''">
            <h4 class="header point-info__header">Текущий Бонус</h4>
            <div class="point-info__wrapper">
              <i class="fas fa-percent fa-sm point-info__icon point-info__icon--percent" aria-hidden="true"/>
              <span class="point-info__bonus">
              {{point.currentBonus}}
            </span>
            </div>
          </div>
          <div class="point-info__address-block point-info__block" v-if="point.address.city !== ''">
            <h4 class="header point-info__address-block">Адрес</h4>
            <p class="point-info__address">
              {{point.address.city}},
              {{point.address.street}},
              {{point.address.house}}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="single-point__map">
    <client-only>
      <Map :providedPoints="[point]"/>
    </client-only>
  </div>
  <div class="single-point__reviews reviews">
    <div class="container-center">
      <h3 class="reviews__header header" v-if="point.retailPointFeedbacks.length <= 0">
        К сожалению, отзывов о {{point.title}} пока что нет. Станьте первым кто оставит отзыв!
      </h3>
      <div class="reviews__wrapper" v-else>
        <h3 class="reviews__header header">
          Последние оценки {{point.title}}
        </h3>
        <ul class="reviews__list">
          <li class="reviews__list-item" :key="index" v-for='(review, index) in point.retailPointFeedbacks'>
            <div class="reviews__content">
              <p class="reviews__text" v-if="review.message !== null">
                <span class="reviews__text-title">Отзыв:</span>
                {{review.message}}
              </p>
              <p class="reviews__rating">
                <span class="reviews__text-title">Рейтинг:</span> {{review.rating}}
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</section>
</template>

<script>
import Map from '@/components/YandexMap.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'SinglePoint',
  //  props: ['point', 'actions'],
  middleware: ['preload-points'],
  validate({ store }) {
    return store.getters['global/getOneModule']('points')
  },
  computed: {
    ...mapGetters('points', {
      points: 'getPoints',
      getActions: 'getActions'
    }),
    point () {
      return this.points.find(item => this.$route.params.id === item.id)
    },
    actions () {
      return this.getActions.filter(action => action.points.indexOf(this.$route.params.id) !== -1)
    }
  },
  components: {
    Map
  },
  data () {
    return {
      actionsShowed: false
    }
  },
  methods: {
    beforeEnter (el) {
      el.style.height = 0
      el.style.opacity = 0
    },
    enter (el, done) {
      const totalHeight = Math.round([...el.childNodes].reduce((accum, value) => accum + value.clientHeight, 0))
      this.animate({
        duration: 400,
        timing: (x) => x,
        draw: (progress, el) => {
          el.style.height = `${progress * totalHeight}px`
          el.style.opacity = progress
        },
        done,
        el
      })
    },
    leave (el, done) {
      const totalHeight = el.clientHeight
      this.animate({
        duration: 400,
        timing: (x) => x,
        draw: (progress, el) => {
          const reverseProgress = 1 - progress
          el.style.height = `${reverseProgress * totalHeight}px`
          el.style.opacity = progress
        },
        done,
        el
      })
    },
    animate ({ duration, timing, el, draw, done }) {
      const start = performance.now()
      const animate = () => {
        const timeFraction = (performance.now() - start) / duration
        const progress = timing(timeFraction)
        draw(progress, el)
        if (timeFraction < 1) {
          requestAnimationFrame(animate)
        } else {
          if (done) done()
        }
      }
      requestAnimationFrame(animate)
    },
    toggleActionsList () {
      this.actionsShowed = !this.actionsShowed
      this.actionsShowed
        ? this.animate({
          duration: 400,
          timing: (x) => x,
          el: this.$refs.actionsArrow,
          draw: (progress, el) => {
            el.style.transform = `rotateX(${progress * 180}deg)`
          }
        })
        : this.animate({
          duration: 400,
          timing: (x) => x,
          el: this.$refs.actionsArrow,
          draw: (progress, el) => {
            el.style.transform = `rotateX(${(1 - progress) * 180}deg)`
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.action {
}

.action__title {
  margin-left: 1rem;
}

.action__icon {
  fill: var(--maincolor)
}

.action__wrapper {
  width: 100%;
  text-align: center;
  margin-bottom: 0.5rem;
}

.action__show-all {
  border: none;
  background-color: transparent;
  display: block;
  margin: 0 auto;
  outline: none;
}

.action__list {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

.action__list-item {
  text-align: center;
}

.action__link-to-action {
  text-decoration: none;
  color: var(--maincolor)
}

.action__show-all-text {
  font-size: 0.9rem;
  display: block;
}

.single-point__action {
  margin-bottom: 1.5rem;
}

.rules__list {
  list-style: none;
  padding: 0;
}

.rules__list-item {
  margin-bottom: 1rem;
}

.rules__percent {
  color: darkred;
  margin-right: 10px;
}

.point-info__wrapper {
  text-align: center;
}

.point-info__block {
  margin-bottom: 1rem;
}

.point-info__address {
  text-align: center;
}

.point-info__icon {
  &--star {
    color: gold;
  }

  &--phone {
    color: green;
  }

  &--percent {
    color: darkred;
  }
}
</style>
