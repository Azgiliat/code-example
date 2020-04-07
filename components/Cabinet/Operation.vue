<template>
<div class="operation">
  <p class="operation__place">
    <span class="operation__place-name">
    {{operation.place}}
      </span>
    <span class="operation__date-content">
      {{operation.dateOperation | noSecsInDate}}
    </span>
  </p>
  <!--    new - новая-->
  <!--    ready - подтверждена-->
  <!--    processed - завершена-->
  <!--    cancel - отменена-->
  <!--    -->
  <!--    type:-->
  <!--    payment - платёж-->
  <!--    cashbak - возврат-->
  <!--    deposit - внесение средств-->
  <p class="operation__amount"
     :class="parseFloat(operation.amountEarn) !== 0 ? 'operation__amount--earn' : 'operation__amount--spend'">
    Изменение баланса: {{parseFloat(operation.amountEarn) !== 0 ? `+${parseFloat(operation.amountEarn)}` :
    `-${parseFloat(operation.amountSpend)}`}} бонусов
  </p>
  <p class="operation__check">
    <span class="operation__check-label">
      Сумма чека:
    </span>
    <span class="operation__check-content">
          {{operation.amount}}
    </span>
  </p>
  <p class="operation__state">
    <span class="operation__state-label">
      Статус:
    </span>
    <span class="operation__state-content">
      {{operation.state | operationStatus}}
    </span>
  </p>
  <p class="operation__type">
    <span class="operation__type-label">
      Тип операции:
    </span>
    <span class="operation__type-content">
      {{operation.type | operationType}}
    </span>
  </p>
</div>
</template>

<script>
export default {
  name: "Operation",
  props: {
    operation: {
      type: Object,
      require: true
    }
  },
  filters: {
    noSecsInDate (str) {
      return str.slice(0, -3)
    },
    operationStatus (str) {
      let normalStatus
      switch (str) {
        case 'NEW':
          normalStatus = 'Новая'
          break;
        case 'READY':
          normalStatus = 'Подтверждена'
          break;
        case 'PROCESSED':
          normalStatus = 'Завершена'
          break;
        case 'CANCEL':
          normalStatus = 'Отменена'
          break;
        default:
          normalStatus = 'Неизвесный статус операции'
          break;
      }
      return normalStatus
    },
    operationType (str) {
      let normalType
      switch (str) {
        case 'PAYMENT':
          normalType = 'Платёж'
          break;
        case 'PAYMENT_AND_CONFIRM':
          normalType = 'Платёж'
          break;
        case 'CASHBACK':
          normalType = 'Возврат'
          break;
        case 'DEPOSIT':
          normalType = 'Внесение средств'
          break;
        default:
          normalType = 'Неизвестный тип операции'
          break;
      }
      return normalType
    }
  }
}
</script>

<style lang="scss" scoped>
.operation {

  &__place,
  &__date,
  &__amount,
  &__state,
  &__check,
  &__type {
    margin: 0;
  }

  &__place {
    font-size: 20px;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  &__date-content {
    margin-left: auto;
    font-size: 12px;
    font-weight: 400;
  }

  &__amount--earn {
    color: green;
  }

  &__amount--spend {
    color: red;
  }
}
</style>
