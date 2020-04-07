<template>
  <section class="giftcard" :style="{'--main-color': getMainColor}">
    <div class="container-center">
      <div class="giftcard__body" v-if="requestDone">
        <div class="giftcard__col col-12"
             v-if="!cardFound"
        >
          <h2 class="giftcard__title">{{message}}</h2>
        </div>
        <template v-else>
          <div class="giftcard__col col-12">
            <h2 class="giftcard__title">{{info.congratulation}}</h2>
            <div class="giftcard__postcard postcard">
              <div class="postcard__image">
                <img :src="info.imageUrl" alt="Подарочная карта">
              </div>
              <div class="postcard__content">
                <div class="postcard__title">
                  Подарочная карта
                </div>

                <div class="postcard__amount">{{info.balance}}<sup>{{changeWord}}</sup></div>
                <!--              <div class="postcard__code">-->
                <!--                <img src="../assets/code.svg" alt="">-->
                <!--              </div>-->
              </div>
            </div>
          </div>

          <div class="giftcard__qr  col-12"
               v-if="isAuthorization"
          >
            <div class="giftcard__qrimg col-12" v-if="showCode === 'qr'" @click="toggleShowCode('qr')">
              <qrcode-vue :value="info.qr" :size="150"/>
            </div>
            <div class="giftcard__qrimg col-12" v-if="showCode === 'bar'" @click="toggleShowCode('bar')">
              <barcode :value="info.qr" :display-value="false"/>
            </div>
            <div class="giftcard__text col-12">
              Подарочная карта создана в&nbsp;приложении {{getTitle}}.
            </div>

          </div>

          <div class="giftcard__form  col-12"
               :class="requestProgress ? 'is-disabled' : ''"
               v-else
          >
            <div class="giftcard__col">
              <div class="giftcard__text">
                Чтобы воспользоваться подарочной картой, пожалуйста, введите последние четыре цифры вашего мобильного
                телефона:
              </div>
              <form class="giftcard__field" @keyup.enter="sendCode()">
                <input type="number"
                       :step=1
                       v-for="(num, i) in number"
                       v-model.lazy="number[i]"
                       :key="i"
                       :ref="`input${i}`"
                       maxlength="1"
                       @keypress="changeVal($event, i)"
                       @input="setValue($event.target.value, i)"
                       @keydown.delete="deleteVal($event.target.value , i)"
                       @focus="changeActiveClass(i)"
                       @click="scrollInputsIntoView"
                       :class="activeInput === i ? 'is-active' : ''"
                />
              </form>
              <div class="giftcard__btn"
                   :class="validation ? '' : 'is-disabled'"
                   @click="sendCode()"
              >
                Загрузить подарочную карту
              </div>
              <div v-if="error && !validation" class="giftcard__mess">{{message}}</div>
            </div>
          </div>
        </template>

        <div class="giftcard__points points row">

          <div class="container">
            <div class="row">
              <div class="giftcard__text points__title  col-12">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="48" height="48"
                     viewBox="0 0 48 48">
                  <defs>
                    <path id="a"
                          d="M12 29v2.76h4.48c-.24 1.2-1.42 3.26-4.48 3.26-2.72 0-4.92-2.26-4.92-5.02s2.2-5.02 4.92-5.02c1.54 0 2.58.66 3.16 1.22l2.18-2.12C15.96 22.8 14.16 22 12 22c-4.42 0-8 3.58-8 8s3.58 8 8 8c4.62 0 7.68-3.24 7.68-7.82 0-.46-.04-.82-.1-1.18H12zm24-5.82V38c0 2.2-1.8 4-4 4H4c-2.2 0-4-1.8-4-4V10c0-2.2 1.8-4 4-4h12.36c-.22.96-.36 1.96-.36 3 0 8.08 9.04 18.1 10.06 19.22L29 31.4l2.94-3.18c.42-.46 2.14-2.38 4.06-5.04zM38 9c0-4.96-4.04-9-9-9s-9 4.04-9 9c0 6.76 9 16.5 9 16.5s9-9.74 9-16.5zM25 9c0-2.2 1.8-4 4-4s4 1.8 4 4-1.78 4-4 4c-2.2 0-4-1.8-4-4z"/>
                  </defs>
                  <use fill="#D32F2F" fill-rule="nonzero" transform="translate(6)" xlink:href="#a"/>
                </svg>
                Партнеры программы:
              </div>
              <div class="col-12 points__tabs" v-if="getCategories.length > 1">
                <ul>
                  <li :class="activeCategory === 'all' ? 'is-active' : ''"
                      @click="setCategory('all')">Все
                  </li>
                  <li
                    v-for="cat in getCategories" :key="cat"
                    @click="setCategory(cat)"
                    :class="activeCategory === cat ? 'is-active' : ''"
                  >
                    {{cat}}
                  </li>
                </ul>
              </div>
              <div class="giftcard__points-list">
                <div class="" v-for="(point, index) in getPoints" :key="index"
                     v-show="point.categoryName === activeCategory || activeCategory === 'all'">
                  <div class="media" @click.stop="showPopup(index)">
                    <svg class="media__point-icon" viewBox="0 0 16 16"
                         xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="m6 0c-3.31372 0-6 2.68628-6 6 0 5 6 10 6 10s6-5 6-10c0-3.31372-2.68628-6-6-6zm0 8c-1.10455 0-2-.895447-2-2 0-1.10461.895447-2 2-2 1.10455 0 2 .895386 2 2 0 1.10455-.895447 2-2 2z"
                        transform="translate(2)"/>
                    </svg>
                    <div class="media-body ml-3">
                      <div class="mt-0 media-title">{{point.title}}</div>
                      <span class="media__address">{{addressToString(point.address)}}</span>
                      <div class="media__cash">
                        <svg-icon name="coins"></svg-icon>
                        Будет начислено&nbsp;<strong> {{numberToFixed(point.currentBonus)}}</strong>%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      <div class="giftcard__footer">
        <div class="giftcard__col">
          <div class="giftcard__text">Управляйте подарочной картой в мобильном приложении:</div>
          <div class="giftcard__app">
            <a :href="`${getAppLink}`" target="_blank">
              <svg-icon name="google" />
            </a>
            <a :href="`${getAppLink}`" target="_blank">
              <svg-icon name="app-store" />
            </a>
          </div>
        </div>
      </div>
    </div>

    <Popup :selectedPoint="selectedPoint" :isPopupShowed="isPopupShowed" @closePopup="isPopupShowed = false"/>
    <div v-if="isPopupShowed" class="overlay" />
    <client-only>
      <Map class='points__map' :providedPoints="getPoints" :mainColor="getMainColor"/>
    </client-only>
  </section>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
import VueBarcode from 'vue-barcode'
import { mapGetters } from 'vuex'
import Map from '~/components/YandexMap'
import Popup from '~/components/GiftcardPopup.vue'

export default {
  name: 'GiftCard',
  components: { QrcodeVue, barcode: VueBarcode, Map, Popup },
  data () {
    return {
      state: 'auth',
      number: ['', '', '', ''],
      error: false,
      info: {
        balance: ''
      },
      cardUrl: '',
      cardFound: true,
      requestDone: false,
      requestProgress: false,
      activeInput: 0,
      message: 'Ошибка или карта не найдена.',
      showCode: 'qr',
      activeCategory: 'all',
      selectedPoint: {},
      isPopupShowed: false,
      referer: ''
    }
  },
  head() {
    return {
      title: `${this.getTitle} - Подарочная карта`,
      meta: [
        { hid: 'og:title', property: 'og:title', content: `${this.getTitle} - Подарочная карта` },
        { hid: 'og:type', property: 'og:type', content: 'website' },
        { hid: 'og:image', property: 'og:image', content: this.info.imageUrl },
        { hid: 'og:url', property: 'og:url', content: this.getReferer + this.$route.fullPath },
        { hid: 'og:description', property: 'og:description', content: this.info.congratulation }
      ],
      link: [
        {rel: 'icon', type: 'image/x-icon', href: this.getReferer + this.getPicturePath('xxhdpi_logo_small')},
        {rel: 'image_src', href: this.info.imageUrl},
        {rel: 'image_url', href: this.info.imageUrl}
      ],
    }
  },
  middleware: ['preload-points'],
  layout: 'clear',
  validate({ store, params }) {
    return params.id && store.getters['global/getOneModule']('giftcards')
  },
  async asyncData({params, $axios, req}) {
    let referer = '';
    if(req) {
      referer = req.headers.referer
    }
    let cardUrl = params.id;
    try {
      let cardInfo = await $axios.$post(
        `/api/giftcards/auth`,
        { cardUrl }
      )

      if(!cardInfo.success) throw new Error()

      return {
        requestDone: true,
        cardFound: true,
        info: cardInfo,
        referer
      }
    } catch (e) {
      return {
        message: e.description || 'Ошибка или карта не найдена.',
        requestDone: true,
        cardFound: false
      }
    }
  },
  computed: {
    ...mapGetters('global', {
      getTitle: 'getTitle',
      getAppLink: 'getAppLink',
      getMainColor: 'getMainColor',
      getReferer: 'getReferer',
      getPicturePath: 'getPicturePath'
    }),
    ...mapGetters('points', {
      getPoints: 'getPoints',
      getCategories: 'getCategories'
    }),
    validation () {
      return this.number.every(num => num !== '')
    },
    isAuthorization () {
      return this.info.qr && this.info.qr !== ''
    },
    changeWord () {
      if(this.info.balance) {
        let amount = this.info.balance.toString()
        if (amount >= 11 && amount <= 19) {
          return 'бонусов'
        } else if (parseInt(amount.slice(-1)) === 1) {
          return 'бонус'
        } else if (parseInt(amount.slice(-1)) >= 2 && parseInt(amount.slice(-1)) <= 4) {
          return 'бонуса'
        } else {
          return 'бонусов'
        }
      }
    }
  },
  methods: {
    addressToString (address) {
      return `г. ${address.city}, ${address.street}, ${address.house}`
    },
    changeVal (e, i) {
      let charCode = (e.which) ? e.which : e.keyCode
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        e.preventDefault()
      }
    },
    setValue (val, i) {
      if (val.length > 0 && i < 3) {
        this.$refs[`input${i + 1}`][0].focus()
      }
      this.$set(this.number, i, val.slice(-1))
    },
    deleteVal (val, i) {
      if (val.length === 0 && i > 0) {
        this.$refs[`input${i - 1}`][0].focus()
      }
    },
    changeActiveClass (i) {
      this.activeInput = i
    },
    scrollInputsIntoView () {
      if(process.client) {
        const windowWidth = window.innerWidth
        if (windowWidth < 1024) {
          const scrolled = document.querySelector('.giftcard__text')
          scrolled.scrollIntoView(true)
        }
      }
    },
    showPopup (id) {
      this.selectedPoint = this.getPoints[id]
      this.isPopupShowed = true
    },
    async sendCode () {
      if (this.validation) {
        let query = this.number.join('')
        this.requestProgress = true

        try {
          let getQr = await this.$axios.$post(
            `/api/giftcards/auth/`,
            {
              cardUrl: this.$route.params.id,
              phone: query
            },
            {
              withCredentials: true
            }
          )
          this.requestDone = true
          this.requestProgress = false
          if (!getQr.success) {
            this.error = true
            this.message = getQr.description
          } else {
            this.$set(this.info, 'qr', getQr.qr)
          }
        } catch (e) {
          this.requestProgress = false
          this.number = ['', '', '', '']
          this.changeActiveClass(0)
          this.$refs[`input0`][0].focus()
          this.error = true
          this.message = e.response.data.description
        }


      }
    },
    toggleShowCode (code) {
      if (code === 'qr') this.showCode = 'bar'
      else if (code === 'bar') this.showCode = 'qr'
    },
    numberToFixed (num) {
      return Number(num).toFixed()
    },
    setCategory (cat) {
      this.activeCategory = cat
    }
  }
}
</script>

<style lang="scss" scoped>
  $sm: 576px;
  $md: 768px;
  $lg: 992px;
  $xl: 1200px;

  $red: #d32f2f;
  .giftcard {
    font-family: 'Roboto', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100%;
    text-align: left;
    color: #000000;
    position: relative;

    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
      display: none;
    }

    input[type=number] {
      -moz-appearance: textfield;
    }

    &__title {
      text-align: center;
      font-size: 23px;
      margin-bottom: 20px;
      font-weight: bold;
      @media(min-width: $lg) {
        font-size: 36px;
      }
    }

    &__text {
      font-size: 16px;
      font-weight: bold;
      @media(min-width: $lg) {
        font-size: 18px;
      }

      a {
        color: $red;
        text-decoration: underline;

        &:hover {
          text-decoration: none;
        }
      }
    }

    &__form {
      text-align: center;
      transition: .2s linear;

      &.is-disabled {
        opacity: 0.5;
        pointer-events: none;
      }

      input {
        background: #e4e4e4;
        border-radius: 4px;
        height: 46px;
        width: 46px;
        color: #000000;
        font-size: 20px;
        font-weight: bold;
        text-align: center;
        margin: 0 8px;
        border: 2px solid transparent;
        outline: none;
        transition: .2s linear;
        box-hadow: none;

        &:focus,
        &:active,
        &.is-active {
          border: 2px solid $red;
          caret-color: $red;
          background: transparent;
        }
      }
    }

    &__field {
      margin: 32px 0;
    }

    &__btn {
      width: 300px;
      max-width: 100%;
      height: 44px;
      text-align: center;
      text-transform: uppercase;
      font-size: 14px;
      border-radius: 20px;
      line-height: 46px;
      font-weight: bold;
      margin: 0 auto 15px;
      background: $red;
      color: #ffffff;
      box-shadow: 0 2px 0 0 #b1afb0;
      transition: .2s linear;

      &:hover {
        cursor: pointer;
        box-shadow: none;
      }

      &.is-disabled {
        color: #9e9e9e;
        background: #e4e4e4;
        cursor: default;
        box-shadow: 0 2px 0 0 #b1afb0;
      }
    }

    &__body {
      min-height: calc(100vh - 170px);
    }

    &__footer {
      background: #f1f3f4;
      padding: 10px 15px 30px;
      width: 100%;
      position: fixed;
      bottom: 0;
      left: 0;
      max-height: 140px;
      z-index: 1000;
      @media(min-width: $md) {
        padding: 20px 15px 30px;
      }

      .giftcard__text {
        min-height: 40px;
        @media(min-width: $md) {
          text-align: center;
        }
      }
    }

    &__col {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
    }

    &__app {
      text-align: center;
      display: flex;
      justify-content: space-between;
      margin: 20px -7px 0;
      @media(min-width: $md) {
        justify-content: center;
      }

      a {
        margin: 0 5px;
        @media(min-width: $md) {
          margin: 0 10px;
        }
      }

      svg {
        width: 100%;
        max-width: 150px;
        height: 50px;
      }
    }

    &__qr {
      text-align: center;
    }

    &__qrimg {
      margin-bottom: 32px;
      min-height: 150px;
    }

    &__mess {
      color: $red;
    }

    &__points-list {
      @media(min-width: $tablet-width) {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        column-gap: 30px;
      }
    }
  }

  .postcard {
    max-width: 100%;
    //background: url('../assets/img/strawberries.jpg') no-repeat;
    border-radius: 10px;
    color: #ffffff;
    text-align: center;
    margin: 0 auto 30px;
    position: relative;

    &__image {
      font-size: 0;
      position: relative;
      overflow: hidden;
      border-radius: 20px;

      &::before {
        @include pseudo-element;
        border-radius: 50%;
        content: '';
        width: 79%;
        height: 140%;
        background: #D32F2F;
        opacity: 0.3;
        left: -67px;
        top: 50%;
        transform: translateY(-50%);
      }

      img {
        width: 100%;
      }
    }

    &__content {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      text-align: left;
      padding: 13px 17px;
      @media(min-width: $sm) {
        padding: 20px 25px;
      }
    }

    &__title {
      font-size: 19px;
      font-weight: bold;
      margin-bottom: 10px;
      @media(min-width: $sm) {
        font-size: 35px;
        margin-bottom: 36px;
      }
    }

    &__num {
      font-size: 13px;
      margin-bottom: 17px;
      @media(min-width: $sm) {
        font-size: 16px;
      }
    }

    &__amount {
      font-size: 56px;
      margin-bottom: 10px;
      @media(min-width: $sm) {
        font-size: 70px;
      }

      sup {
        font-size: 13px;
        vertical-align: super;
        margin-left: 7px;
        font-weight: 500;
        @media(min-width: $sm) {
          font-size: 24px;
        }
      }
    }

    &__code {
      text-align: right;
      font-size: 0;
      position: absolute;
      bottom: 15px;
      right: 15px;
    }
  }

  .points {
    margin-top: 56px;

    &__map {
      margin-top: 50px;
    }

    &__title {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 36px;
      margin-top: 50px;
      svg {
        margin-bottom: 30px;
      }
    }

    .media {
      text-align: left;
      margin-bottom: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;

      .media__point-icon {
        margin-right: 15px;
        width: 25px;
        height: 25px;
        fill: var(--main-color);
      }

      &-title {
        font-size: 16px;
        margin-bottom: 5px;
      }

      &-body {

        span {
          font-size: 14px;
          color: #666666;
        }

        @media(min-width: $lg) {
          //min-height: 72px;
        }
      }

      &__cash {
        display: flex;
        align-items: center;
        color: $red;
        font-size: 12px;

        svg {
          width: 17px;
          height: 17px;
          margin-right: 5px;
        }
      }
    }

    &__tabs {
      ul {
        list-style: none;
        display: flex;
        padding: 0;
        margin: 0;
        justify-content: stretch;
        align-items: stretch;

        li {
          cursor: pointer;
          padding: 5px;
          width: 100%;
          text-align: center;
          color: $red;
          border-style: solid;
          border-color: $red;
          border-width: 1px 0 1px 1px;
          margin-bottom: 30px;

          &:first-child {
            border-radius: 4px 0 0 4px;
          }

          &:last-child {
            border-radius: 0 4px 4px 0;
            border-width: 1px;
          }

          &.is-active {
            background: $red;
            color: #ffffff;
          }
        }
      }
    }
  }

  .media__point-icon {
    align-self: flex-start;
  }

  .media__address {
    display: block;
    margin-bottom: 5px;
  }

  .media__coins {
    fill: var(--maincolor);
  }

  .overlay {
    position: fixed;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(4px);
  }

  .row {
    @media(min-width: $desktop-width) {
      max-width: 1200px;
      margin: 0 auto;
    }
  }
</style>
