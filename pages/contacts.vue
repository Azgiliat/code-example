<template>
<section class="contacts">
  <div class="container-center">
    <div class="contacts__header-block">
      <h3 class="header">Контакты</h3>
      <div class="divider" />
    </div>
    <div class="contacts__content">
      <div class="contacts__phone-block contacts__block">
        <p class="contacts__phone-title">
          Наши контактные телефоны:
        </p>
        <a class="contacts__phone" href="tel:+78123221010">+7(812)322-10-10</a>
        <a class="contacts__phone" href="tel:88004441010">8(800)444-10-10</a>
      </div>
      <div class="contacts__email-block contacts__block">
        <p class="contacts__amil-title">Электронная почта:</p>
        <a class="contacts__email" href="mailto:contact@groupbms.ru">contact@groupbms.ru</a>
      </div>
      <div class="contacts__address-block contacts__block">
        <p class="contacts__address-title">А так же будем рады видеть Вас в нашем офисе по адресу:</p>
        <p class="contacts__address">Санкт-Петербург, пл. Конституции, д. 1/2 лит А пом. 12Н</p>
      </div>
    </div>
  </div>
  <FeedBackForm class="contacts__feedback"/>
  <client-only>
    <YandexMap :providedPoints="coords"></YandexMap>
  </client-only>
</section>
</template>

<script>
import FeedBackForm from '@/components/FeedBackForm.vue'
import YandexMap from '../components/YandexMap'

export default {
  name: 'contacts',
  components: { FeedBackForm, YandexMap },
  validate({ store }) {
    return store.getters['global/getOneModule']('contacts')
  },
  data() {
    return {
      coords: [{
        address: {
          latitude:59.850305,
          longitude:30.300615
        },
        phone: '8(800)444-10-10',
        title: 'BMS Group'
      }]
    }
  }
}
</script>

<style lang="scss" scoped>
.contacts__content {
  text-align: center;
}
.contacts__block {
  border-bottom: 2px solid var(--maincolor);
  margin-bottom: 1rem;
  padding-bottom: 1rem;
}
.contacts__phone {
  display: block;
  margin-bottom: 0.5rem;
}
</style>
