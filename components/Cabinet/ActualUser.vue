<template>
<div class="user">
  <div class="card-qr" @click="showQR = !showQR">
    <transition name="qr" mode="out-in" v-on:after-enter="afterQrEnter">
      <div v-if="!showQR" :key="'card'" class="user__card-img card-img">
        <p class="card-img__wrapper card-img__card-num">
      <span class="">
          {{ user.cardNum | cardNumFilter }}
        </span>
        </p>
        <p class="card-img__wrapper card-img__balance-wrapper">
      <span class="card-img__balance-bonuses">
          {{parseFloat(user.balance)}}
        </span>
          <span class="card-img__balance-text">
        бонусов +
      </span>
          <svg-icon class="card-img__balance-icon" name="giftcards"/>
        </p>
        <p class="card-img__wrapper card-img__total-wrapper">
      <span class="card-img__total-bonuses">
          {{parseFloat(user.balance) + parseFloat(user.amount)}}
        </span>
          <span class="card-img__total-text">
        бонусов
      </span>
        </p>
      </div>
      <qrcode-vue class="user__qr" :key="'qr'" v-else :value="qrString" :size="185"/>
    </transition>
    <div v-show="showTimer" class="user__qr-timer">
      <p class="uset__timer-label">
        Время жизни QR кода:
      </p>
      <p class="user__timer-content">
        {{timer | timerFilter}}
      </p>
    </div>
  </div>
  <div class="user__inputs">
    <CabinetInput class="user__input user__first-name" :value.sync="userInput.firstName">
    <span slot="label">
      Ваше имя
    </span>
    </CabinetInput>
    <CabinetInput class="user__input user__last-name" :value.sync="userInput.lastName">
        <span slot="label">
      Ваша фамилия
    </span>
    </CabinetInput>
    <CabinetInput v-show="!!user.middleName" class="user__input user__middle-name" :value.sync="userInput.middleName">
        <span slot="label">
      Ваше отчество
    </span>
    </CabinetInput>
    <CabinetInput class="user__input user__email" :value.sync="userInput.email">
        <span slot="label">
      Ваша электронная почта
    </span>
    </CabinetInput>
    <CabinetInput class="user__input user__phone" :value.sync="userInput.phone"
                  :mask="'+# (###) ###-##-##'"
                  :isDisabled="true"
    >
        <span slot="label">
      Ваш телефон
    </span>
    </CabinetInput>
    <CabinetInput :isDisabled="true" class="user__input user__birthDate" :value.sync="userInput.birthDate">
        <span slot="label">
      Дата рождения
    </span>
    </CabinetInput>
  </div>
  <button @click="isOperationsShow = !isOperationsShow" class="user__operations-button">
    История операций
    <svg-icon class="user__operations-button-icon" :class="{'user__operations-button-icon--opened': isOperationsShow}"
              name="arrow-down"/>
  </button>
  <AnimateHeight :toggle="isOperationsShow">
    <ul class="user__operations-list" v-show="user.operations.length !== 0">
      <li class="user__operations-item" v-for="(operation, index) in user.operations" :key="index">
        <Operation class="user__operation" :operation="operation"/>
      </li>
    </ul>
  </AnimateHeight>
  <button @click="saveChanges" class="user__save-button" :class="{'user__save-button--edited': userEdited}">
    {{ userEdited ? 'Данные обновлены успешно' : 'Сохранить'}}
  </button>
</div>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
import CabinetInput from "./CabinetInput"
import Operation from "./Operation.vue";
import AnimateHeight from "../AnimateHeight";
import {mapActions, mapGetters} from 'vuex'
import md5 from "crypto-js/md5.js"

export default {
  name: "ActualUser",
  components: {
    QrcodeVue,
    CabinetInput,
    Operation,
    AnimateHeight
  },
  props: {
    user: {
      type: Object,
      require: true
    }
  },
  filters: {
    cardNumFilter (val) {
      return `**** **** **** ${val.slice(-4, -1)}${val[val.length - 1]}`
    },
    timerFilter (val) {
      const secondsRemain = 120 - val,
        minutes = Math.floor(secondsRemain / 60),
        seconds = `${secondsRemain - minutes * 60}`.length === 1 ? `0${secondsRemain - minutes * 60}` : `${secondsRemain - minutes * 60}`;
      return `0${minutes}:${seconds}`
    }
  },
  created () {
    const {cardNum, operations, amount, balance, ...userInput} = this.user
    this.userInput = userInput
  },
  methods: {
    ...mapActions('auth/user', {
      editUser: 'editUser'
    }),
    saveChanges () {
      this.editUser(this.userInput)
    },
    createQrString () {
      const userInfo = this.user,
        salt = this.user.salt
      return `BMSQR_${md5(salt.message + userInfo.cardNum + Math.floor((Date.now() / 1000) / 120))}${userInfo.id}${userInfo.extraPayment.code === 0 ? '1' : '0'}`;
    },
    startTimer () {
      return Math.floor((Date.now() / 1000) % 120)
    },
    afterQrEnter () {
      this.showTimer = this.showQR
    }
  },
  computed: {
    ...mapGetters('auth/user', {
      userEdited: 'getUserBeenEdited'
    })
  },
  data () {
    return {
      timer: 0,
      timerID: null,
      qrString: '',
      showQR: false,
      showTimer: false,
      userInput: {},
      isOperationsShow: false
    }
  },
  watch: {
    showQR (newValue) {
      // показываем код, запускаем таймер
      if (newValue) {
        this.timer = this.startTimer()
        this.qrString = this.createQrString()
        this.timerID = setInterval(() => {
          if (++this.timer === 120) {
            this.timer = 0
            this.qrString = this.createQrString()
          }
        }, 1000)
      } else { // скрыли код, отчистили таймер
        clearInterval(this.timerID)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.card-qr {
  justify-content: center;
  display: flex;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.qr-leave-active,
.qr-enter-active {
  transition: transform 0.8s cubic-bezier(0.25, 0.8, 0.5, 1);
  transform-origin: 50% 50%;
}

.qr-leave-to {
  transform: rotateY(90deg);
}

.qr-enter {
  transform: rotateY(-90deg);
}

.qr-enter-to {
  transform: rotateY(0);
}

.user {
  color: black;

  &__input {
    margin-bottom: 1.5rem;
  }

  &__inputs {
    @media(min-width: $desktop-width) {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      column-gap: 30px;
    }
  }

  &__save-button {
    border: none;
    background-color: var(--maincolor);
    color: var(--color-on-primary);
    width: 100%;
    font-size: 1rem;
    padding-top: 10px;
    padding-bottom: 10px;
    margin-bottom: 20px;
    outline: 0;
    transition: background-color $transition;

    @media(min-width: $desktop-width) {
      margin: 0 auto;
      max-width: 50%;
      display: block;
    }

    &--edited {
      background-color: var(--contrastcolor);
    }
  }

  &__operations-list {
    list-style: none;
    padding: 0;
    /*max-height: 480px;*/
    /*overflow-y: scroll;*/
  }

  &__operations-item {
    padding-bottom: 10px;
    margin-bottom: 20px;
    border-bottom: 2px solid var(--maincolor);
  }

  &__operations-button {
    display: block;
    background-color: transparent;
    border: none;
    outline: 0;
    color: var(--color-ob-secondary);
    font-size: 20px;
    margin: 0 auto 40px;
    position: relative;
  }

  &__operations-button-icon {
    position: absolute;
    width: 24px;
    height: 24px;
    bottom: -24px;
    left: calc(50% - 12px);
    fill: var(--maincolor);
    transition: transform $transition;

    &--opened {
      transform: rotateX(180deg);
    }
  }

  &__qr-timer {
    flex-basis: 100%;
    text-align: center;
  }

  &__timer-label {
    margin: 1rem 0;
  }

  &__timer-content {
    margin: 0;
    color: var(--maincolor);
    font-size: 3rem;
  }
}

.card-img {
  width: 100%;
  height: 156px;
  max-width: 280px;
  background-color: var(--maincolor);
  border-radius: 10px;
  position: relative;

  &__wrapper {
    position: absolute;
    color: var(--color-on-primary);
    margin: 0;
    top: 0;
    left: 0;
  }

  &__total-wrapper {
    font-size: 52px;
    line-height: 56px;
    top: 40%;
    left: 5%;
    display: flex;
  }

  &__total-text {
    margin-top: 5px;
    margin-left: 10px;
    font-size: 12px;
    line-height: 15px;
  }

  &__balance-wrapper {
    top: 81%;
    left: 5%;
    display: flex;
    align-items: center;
  }

  &__balance-bonuses {
    margin-right: 5px;
  }

  &__balance-text {
    margin-right: 5px;
  }

  &__balance-icon {
    width: 20px;
    height: 16px;
    fill: var(--color-on-primary);
  }

  &__card-num {
    left: 5%;
    top: 8%;
  }
}
</style>
