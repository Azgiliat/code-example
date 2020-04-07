<template>
<section class="login">
  <div class="container-center">
    <div class="login__phone-group">
      <p class="login__phone-title">
        На указанный номер будет выслано СМС с кодом.
      </p>
      <CabinetInput class="login__phone-input"
                    :mask="'+7 (###) ###-##-##'"
                    :rules="[val => val.length === 18 || 'Недостаточно символов.']"
                    :required="true"
                    :type="'tel'"
                    :validSymbol="/^\d*$/"
                    :value.sync="phone"
                    v-on:clicked.once="isPhoneClicked = true"
                    @newErrorsCollected="phoneErrors = $event"
                    ref="phoneInput"
      />
      <button @click="submitPhone(`7${phone}`)" class="login__phone-button"
              :class="{'login__phone-button--disabled': phoneErrors || timerStatus || loadingStatus}">
        Отправить код
      </button>
      <p v-show="timerStatus" class="login__repeat-sms">
        Повторно отправить код можно через: {{secondsRemain}}
      </p>
    </div>
    <AnimateHeight :toggle="tokenStatus">
      <div class="login__token-group">
        <p class="login__token-title">
          Пароль из СМС:
        </p>
        <CabinetInput class="login__token-input"
                      :maxlength="5"
                      :required="true"
                      :type="'tel'"
                      :validSymbol="/^\d*$/"
                      :value.sync="token"
        />
      </div>
      <button @click="submitToken({phone: `7${phone}`, token})" class="login__token-button"
              :class="{'login__token-button--disabled': !tokenStatus || loadingStatus || loadingInfoStatus}">
        Подтвердить
      </button>
    </AnimateHeight>
    <div class="login__auth-errors">
      <ul class="login__auth-errors-list">
        <li class="login__auth-errors-item" v-for="error in loginErrors" :key="error">
          <p class="login__auth-error-text">
            {{error}}
          </p>
        </li>
      </ul>
    </div>
  </div>
</section>
</template>

<script>
import CabinetInput from "../../components/Cabinet/CabinetInput";
import AnimateHeight from "../../components/AnimateHeight";
import {mapGetters, mapActions, mapMutations} from 'vuex';

export default {
  name: "login",
  middleware: ['check-auth'],
  components: {
    CabinetInput,
    AnimateHeight
  },
  computed: {
    ...mapGetters('auth/login', {
      tokenStatus: 'getTokenStatus',
      loginStatus: 'getLoginStatus',
      password: 'getPassword',
      getPhone: 'getPhone',
      networkError: 'getNetworkError',
      tokenApproveError: 'getTokenApproveError',
      tokenSentError: 'getTokenSentError',
      timerStatus: 'getTimerStatus',
      secondsRemain: 'getSecondsRemain',
      loadingStatus: 'getLoadingStatus'
    }),
    loginErrors () {
      return [this.networkError, this.tokenApproveError, this.tokenSentError].filter(error => error.length !== 0)
    }
  },
  beforeMount () {
    if (this.tokenStatus) {
      this.phone = this.getPhone.substring(1);
      this.phoneErrors = false;
    }
  },
  methods: {
    ...mapActions('auth/login', {
      submitPhone: 'submitPhone',
      submitToken: 'submitToken',
      resetState: 'resetState'
    }),
    ...mapActions('auth/user', {
      loadUserInfo: 'loadUserInfo'
    }),
    ...mapMutations('auth/user', {
      setPhone: 'setPhone',
      setPassword: 'setPassword'
    }),
    ...mapMutations('global', {
      setIsLogged: 'setIsLogged'
    })
  },
  watch: {
    async loginStatus (newValue) {
      if (newValue) {
        this.loadingInfoStatus = true;
        this.setPhone(`7${this.phone}`);
        this.setPassword(this.password);
        await this.loadUserInfo({
          phone: `7${this.phone}`,
          pswd: this.password
        });
        this.resetState();
        this.setIsLogged(true);
        this.loadingInfoStatus = false;
        this.$router.push('/profile')
      }
    }
  },
  data () {
    return {
      phone: '',
      isPhoneClicked: false,
      token: '',
      phoneErrors: true,
      loadingInfoStatus: false
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  &__phone-group {
    margin-bottom: 1rem;
  }

  &__repeat-sms {
    font-size: 0.8rem;
    text-align: center;
  }

  &__phone-button, &__token-button {
    margin-top: 10px;
    border: none;
    background-color: var(--contrastcolor);
    color: var(--color-on-primary);
    font-size: 1rem;
    text-align: center;
    padding: 10px 0;
    width: 100%;
    border-radius: 20px;

    &--disabled {
      opacity: 0.5;
      pointer-events: none;
    }
  }

  &__token-title {
    margin: 0 0 1rem 0;
  }

  &__auth-errors-list {
    margin: 0;
    list-style: none;
    color: red;
  }
}
</style>
