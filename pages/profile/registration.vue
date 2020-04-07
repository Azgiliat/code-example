<template>
<section class="registration">
  <h2 class="header registration__header">
    Создание новой карты
  </h2>
  <div class="container-center">
    <CabinetInput class="registration__input" :value.sync="input.data" v-for="(input, index) in regInputs" :key="index"
                  :maxlength="input.maxlength"
                  :type="input.type"
                  :regexp="input.regexp"
                  :mask="input.mask"
                  :validSymbol="input.validSymbol"
                  :rules="input.rules"
                  :required="input.required"
                  :ref="`input_${input.name}`"
                  :isDisabled="input.disabled"
                  @newErrorsCollected="checkValidity"
                  v-on:clicked.once="clickedStateKeeper.splice(index, 1, true)"
    >
      <span slot="label">
        {{input.label}}
      </span>
    </CabinetInput>
    <button @click="onRegistrationClick" class="registration__button"
            :class="{'registration__button--active': isAllInputsValid && isAllRequiredClicked}">
      Создать карту
    </button>
    <div v-show="registrationError.length || networkError.length" class="registration__errors">
      {{registrationError}}
      {{networkError}}
    </div>
  </div>
</section>
</template>

<script>
import CabinetInput from "../../components/Cabinet/CabinetInput";
import {mapActions, mapGetters, mapMutations} from 'vuex'

export default {
  name: "registration",
  components: {
    CabinetInput
  },
  middleware: ['check-auth'],
  methods: {
    ...mapMutations('auth/registration', {
      resetState: 'resetState'
    }),
    ...mapActions('auth/registration', {
      registerUser: 'registerUser'
    }),
    ...mapMutations('global', {
      setIsLogged: 'setIsLogged'
    }),
    ...mapActions('auth/user', {
      loadInfo: 'loadUserInfo'
    }),
    checkValidity () {
      this.isAllInputsValid = Object.keys(this.$refs).every(key => this.$refs[key][0].gotNewErrors === false)
    },
    formatBirthDate (str) {
      const pointsIndex = [2, 5]
      let resultStr = ''
      if (str.length) {
        str.split('').forEach(symbol => {
          pointsIndex.find(index => index === resultStr.length) ? resultStr += `.${symbol}` : resultStr += symbol
        })
      }
      return resultStr
    },
    async onRegistrationClick () {
      let infoForRegister = {
        email: `${this.regInputs.find(input => input.name === 'email').data}`,
        firstName: `${this.regInputs.find(input => input.name === 'firstName').data}`,
        lastName: `${this.regInputs.find(input => input.name === 'lastName').data}`,
        //  birthDate: this.formatBirthDate(this.regInputs.find(input => input.name === 'birthDate').data)
      };

      if (this.needCardNum) {
        infoForRegister.cardNum = `${this.regInputs.find(input => input.name === 'cardNum').data}`
      }
      await this.registerUser({
        infoForRegister
      })
    }
  },
  watch: {
    async registrationDone (newValue) {
      if (newValue) {
        this.setIsLogged(true);
        await this.loadInfo({
          phone: this.getPhone,
          pswd: this.getPassword
        });
        this.resetState();
        this.$router.push('/profile')
      }
    }
  },
  created () {
    this.regInputsData = this.regInputs.map(inputObj => ({
      data: '',
      name: inputObj.name
    }));
    this.clickedStateKeeper = this.regInputs.map(inputObj => inputObj.required !== true);
    this.regInputs.find(inputObj => inputObj.name === 'phone').data = this.getPhone.substr(1)
  },
  computed: {
    ...mapGetters('auth/registration', {
      getPhone: 'getPhone',
      getPassword: 'getPassword',
      registrationError: 'getRegistrationError',
      networkError: 'getNetworkError',
      registrationDone: 'getRegistrationDone',
      needCardNum: 'getNeedCardNum'
    }),
    regInputs () {
      return this.needCardNum ? this.allRegInputs.map(inputObj => inputObj) : this.allRegInputs.filter(inputObj => inputObj.name !== 'cardNum')
    },
    requiredInputs () {
      return this.regInputs.filter(inputObj => inputObj.required === true)
    },
    isAllRequiredClicked () {
      return this.clickedStateKeeper.every(state => state === true)
    }
  },
  data () {
    return {
      isAllInputsValid: false,
      clickedStateKeeper: [],
      allRegInputs: [
        {
          label: 'Ваше имя',
          data: '',
          name: 'firstName',
          required: true
        },
        {
          label: 'Ваша фамилия',
          data: '',
          name: 'lastName',
          required: true
        },
        {
          label: 'Ваш телефон',
          data: '',
          name: 'phone',
          type: 'tel',
          validSymbol: /^\d*$/,
          mask: '+7 (###) ###-##-##',
          disabled: true
        },
        {
          label: 'Email',
          data: '',
          name: 'email',
          regexp: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        },
        {  // only in Turbonus
          label: 'Номер банковской карты',
          data: '',
          name: 'cardNum',
          type: 'tel',
          validSymbol: /^\d*$/,
          mask: '#### #### #### ####',
          rules: [val => val.length === 19 || 'Недостатчно символов.'],
          required: true
        }
        // { //  TODO: бэк почему-то не воспринимает дату рождения
        //   label: 'Дата рождения',
        //   data: '',
        //   name: 'birthDate',
        //   validSymbol: /^\d*$/,
        //   type: 'tel',
        //   mask: '##.##.####'
        //  }
        //
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.registration__header {
  margin-bottom: 2rem;
}

.registration__input {
  margin-bottom: 2rem;
}

.registration__button {
  display: block;
  margin: 0 auto;
  width: 100%;
  border: none;
  background-color: var(--contrastcolor);
  color: #ffffff;
  padding: 10px 5px;
  border-radius: 10px;
  opacity: 0.5;
  pointer-events: none;

  &--active {
    pointer-events: auto;
    opacity: 1;
  }
}
</style>
