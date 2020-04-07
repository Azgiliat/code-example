<template>
<div class="">
  <div class="input-group" :class="{'input-group--focus': isFocused, 'input-group--disabled': isDisabled}">
    <label class="input__label" :class="{'input__label--focus': isFocused}" :for="_uid">
      <slot name="label"/>
    </label>
    <input ref="input" v-model="_value" :id="_uid" class="input"
           @input="$emit('input', $event)"
           @focus="isFocused = true"
           @blur="onBlurHandler"
           :type="type"
           :maxlength="realLength"
    >
  </div>
  <transition-group tag="ul" class="input-group__errors errors" name="errors-list" v-show="currentErrors.length">
    <li class="errors__item" v-for="(error) in currentErrors" :key="error.name">
      <p class="errors__content">
        {{error.msg}}
      </p>
    </li>
  </transition-group>
</div>
</template>

<script>
export default {
  name: "CabinetInput",
  props: {
    value: {
      require: true
    },
    isDisabled: {
      type: Boolean,
      require: false,
      default: false
    },
    mask: {
      type: String,
      require: false
    },
    maxlength: {
      type: Number,
      require: false
    },
    regexp: {
      type: RegExp,
      require: false,
      default () {
        return /(.*)/
      }
    },
    validSymbol: {
      type: RegExp,
      require: false
    },
    rules: {
      type: Array,
      require: false
    },
    type: {
      type: String,
      require: false,
      default: 'text'
    },
    required: {
      type: Boolean,
      require: false,
      default: false
    }
  },
  computed: {
    realLength () {
      return this.mask ? this.mask.length : this.maxlength
    },
    gotErrors () {
      return !!this.currentErrors.length
    },
    _value: {
      get () {
        if (this.mask) {
          let significantValue = this.value
          let strAfterMasked = this.mask
          let lastIndex = 0
          if (significantValue.length === 0) {
            return strAfterMasked.slice(0, strAfterMasked.indexOf('#'))
          }
          if (significantValue.length > this.realLength) { //  обрезаем лишние символы, если такие есть
            significantValue = significantValue.slice(0, this.realLength)
          }
          significantValue.split('').forEach((symbol, index) => { //  заменяем решетки значимыми символами
            strAfterMasked = strAfterMasked.replace('#', symbol)
            lastIndex = this.significantIndexes[index]
          })
          if (significantValue.length !== this.significantIndexes.length) { //  если значимых символом столько сколько должно быть, ничего не делаем
            strAfterMasked = strAfterMasked.slice(0, strAfterMasked.indexOf('#')) //  если их меньше, то убираем лишний кусок маски
          }
          return strAfterMasked
        }
        return this.value
      },
      set (newValue) {
        let currentValue = newValue
        if (typeof newValue !== 'string') {
          newValue += ''
        }
        if (this.mask) {  //  если есть маска, то нужно выделить оттуда значимые символы, без всякого мусора аля тире, скобок
          let significantValue = newValue.length === 1 ? newValue : this.takeSignificantSymbols(newValue) //  получаем значимые символы в соотвествие с маской
          let isSymbolAdded = newValue.length === 1 ? true : significantValue.length > this.value.length  //  определяем был символ удален или добавлен
          //  проверка что пользователь удаляет НЕ значимый символ, котоырй присутсвует в маске типа скобок, пробелов и т.д.
          //  но он же хочет на самом деле удалить значимый символ
          if (!isSymbolAdded && !this.significantIndexes.find((item) => item === newValue.length)) {
            significantValue = significantValue.slice(0, -1)  // и тогда удаляем значимый символ
          }
          currentValue = significantValue
        }
        //  проверяем что значимые символы нам подходят
        if (this.validSymbol && !currentValue.split('').every(symbol => this.validSymbol.test(symbol))) {
          currentValue = currentValue.slice(0, -1)
        }
        //  проверяем что всё выражение соответствует regexp
        if (this.regexp && this.mask) {
          currentValue && (this.regexp.test(newValue) ? this.errors.badRegExp = false : this.errors.badRegExp = true)
        } else {
          currentValue && (this.regexp.test(currentValue) ? this.errors.badRegExp = false : this.errors.badRegExp = true)
        }
        this.required && (this.errors.required = !currentValue.length)
        this.checkErrors(this.mask ? newValue : currentValue)
        this.$emit('clicked')
        this.$forceUpdate()
        this.$emit('update:value', currentValue)
      }
    }
  },
  methods: {
    checkErrors (val) {
      let errors = [];
      if (this.rules) { //  собираем все сообщения об ошибках из пропсов, если они есть
        errors = this.rules.map((rule, index) => ({name: index, msg: rule(val)})).filter(item => item.msg !== true)
      }
      for (let key in this.errors) { //  собираем сообщения об ошибках внутри комопнента, если оин есть
        this.errors[key] && errors.push({name: key, msg: this.errorsMessages[key]})
      }
      this.gotNewErrors = !!errors.length;
      this.$emit('newErrorsCollected', !!errors.length);
      this.errorsTimeoutId && clearTimeout(this.errorsTimeoutId);
      this.errorsTimeoutId = setTimeout(() => { // через секунду обновляем массив ошибок
        if (!errors.length) { //  сли ошибок нет, то сразу очищаем массив с сообщениями
          this.currentErrors.splice(0, this.currentErrors.length);
          this.$emit('errorsTextUpdated', this.gotErrors);
          return
        }
        [...this.currentErrors].forEach((error, index) => {//  удаляем иссправленные ошибки
          if (errors.find(item => item.name === error.name) === undefined) {
            this.currentErrors.splice(index, 1)
          }
        });
        errors.forEach(error => { //  добавляем новые ошибки.
          if (!this.currentErrors.find(item => item.name === error.name)) {
            this.currentErrors.push(error)
          }
        });
        this.$emit('errorsTextUpdated', this.gotErrors)
        // делается так сложно, а не просто currentErrors = errors, чтобы Vue мог отследить изменения в массиве
        // и применить анимации появления/исчезновения сообщения об ошибке к каждой конкретно ошибке.
      }, 1000)
    },
    takeSignificantSymbols (str) {
      let significantStr = ''
      this.significantIndexes.forEach(index => {
        significantStr += !!str[index] && str[index] !== '#' ? str[index] : ''
      })
      return significantStr
    },
    onBlurHandler () {
      this.required && (this.errors.required = !this.value.length)
      this.checkErrors(this._value)
      this.$emit('clicked')
      this.isFocused = false
    }
  },
  created () {
    if (this.mask) {
      this.significantIndexes = [...this.mask.matchAll(/[#]/g)].map(symbol => symbol.index)
    }
    if (this.required) {

    }
  },
  data () {
    return {
      gotNewErrors: false,
      errorsTimeoutId: null,
      isFocused: false,
      errors: {
        badRegExp: false,
        required: false
      },
      errorsMessages: {
        badRegExp: 'Неверный формат',
        required: 'Поле обязательно для заполнения'
      },
      currentErrors: [],
      significantIndexes: []
    }
  }
}
</script>

<style lang="scss" scoped>
.input-group {
  border: 2px solid #9e9e9e;
  border-radius: 10px;
  transition: border-color $transition;
  position: relative;
  padding: 0 10px;

  &--focus {
    border-color: var(--maincolor);
  }

  &--disabled {
    pointer-events: none;
  }
}

.input {
  outline: 0;
  border: none;
  padding: 10px 5px;
  border-radius: 10px;
  width: 100%;
  font-size: 16px;
  line-height: 18px;
}

.input__label {
  display: block;
  position: absolute;
  font-size: 12px;
  line-height: 14px;
  background-color: #ffffff;
  top: -7px;
  left: 15px;
  padding: 0 5px;
  transition: color $transition;

  &--focus {
    color: var(--maincolor);
  }
}

.errors-list-enter, .errors-list-leave-to {
  opacity: 0;
  transition: opacity $transition;
}

.errors-list-enter-to {
  opacity: 1;
  transition: opacity $transition;
}

.errors {
  list-style: none;
  margin: 5px 0 0;
  padding: 0 0 0 20px;

  &__item {
    margin-bottom: 8px;
  }

  &__content {
    margin: 0;
    font-size: 0.8rem;
    color: red;
  }
}
</style>
