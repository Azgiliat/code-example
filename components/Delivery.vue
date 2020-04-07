<template>
  <section class="delivery">
    <div class="container-center">
      <h2 class="delivery__header">
        Доставка
      </h2>
      <p class="delivery__app">
        через приложение
      </p>
      <p class="delivery__description">
        Закажи доставку на дом и мы вернем <span class="delivery__percent">50%</span> бонусами на карту “Привилегия”
      </p>
      <a class="delivery__link" :href="appLink" target="_blank">
        Перейти для загрузки
      </a>
    </div>
    <div class="delivery__applications">
      <div class="delivery__applications-content">
        <div class="delivery__applications-links container-center container-center--flex">
          <div class="delivery__google google">
            <a class="google__link" :href="appLink" target="_blank">
              <svg-icon class="google__icon" name="google"/>
            </a>
          </div>
          <div class="delivery__apple apple">
            <a class="apple__link" :href="appLink" target="_blank">
              <svg-icon class="apple__icon" name="app-store"/>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import {mapGetters} from 'vuex';

  export default {
    name: "Delivery",
    computed: {
      ...mapGetters('global', {
        appLink: 'getAppLink'
      })
    }
  }
</script>

<style lang="scss" scoped>
.delivery {
  background-color: rgba(var(--maincolorrgb), 0.1);
  padding-bottom: 0;
}

.delivery__header {
  font-size: 50px;
  line-height: 48px;
  font-weight: 500;
  text-align: center;
  margin: 0 0 10px;
}

.delivery__app {
  background-color: var(--maincolor);
  color: $white;
  font-size: 22px;
  line-height: 21px;
  text-align: center;
  max-width: 240px;
  padding: 9px 11px;
  display: block;
  margin: 0 auto;
  border-radius: 4px;
}

.delivery__description {
  font-size: 14px;
  line-height: 21px;
  font-weight: 400;
  margin: 10px 0 0;
}

.delivery__percent {
  font-weight: 500;
}

.delivery__link {
  max-width: 200px;
  font-size: 14px;
  line-height: 13px;
  margin: 20px auto 0 auto;
  display: block;
  padding: 16px 20px 11px;
  color: $white;
  background-color: var(--contrastcolor);
  border-radius: 10px;
  text-align: center;
  text-decoration: none;
}

.delivery__applications {
  background-color: $white;
  margin-top: 40px;
}

.delivery__applications-content {
  background-color: #000000;
  border-radius: 0 0 10px 10px;
}

.delivery__applications-links {
  justify-content: space-around;
}

.google__link,
.apple__link {
  display: block;
}

.apple__icon,
.google__icon {
  width: 112px;
  height: 36px;
}
</style>
