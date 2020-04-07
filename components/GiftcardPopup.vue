<template>
<div v-if="isPopupShowed" class="giftcard__point-popup point-popup">
  <button @click="$emit('closePopup')" class="point-popup__close-button">
    <svg-icon name="close"/>
  </button>
  <div class="point-popup__info">
  <p class="point-popup__title">
    {{selectedPoint.title}}
  </p>
  <div class="point-popup__bonus">
    <svg-icon width="23" height="20" class="point-popup__coins" name="coins" />
    <p class="point-popup__bonus-text">
      Будет начислено
    </p>
    <span class="point-popup__bonus-percent">
        {{` ${Number(selectedPoint.currentBonus).toFixed()}`}}%
      </span>
  </div>
  <div class="point-popup__address address">
    <div class="point-popup__icon-wrapper">
      <svg-icon class="address__icon" width="24" height="24" name="ic_place" />
    </div>
    <p class="address__text">
      {{addressToString(selectedPoint.address)}}
    </p>
  </div>
  <div v-if="selectedPoint.phone !== ''" class="point-popup__phone phone">
    <div class="point-popup__icon-wrapper">
      <svg-icon class="phone__icon" width="24" height="24" name="tel" />
    </div>
    <a :href="`tel:${selectedPoint.phone}`">
      {{selectedPoint.phone}}
    </a>
  </div>
  </div>
  <Map class="point-popup__map" :isPopup="true" :providedPoints="[selectedPoint]" />
</div>
</template>

<script>
import Map from './YandexMap'
export default {
  name: 'GiftcardPopup',
  components: {
    Map
  },
  props: {
    selectedPoint: {
      type: Object,
      require: true
    },
    isPopupShowed: {
      type: Boolean,
      require: true
    }
  },
  methods: {
    addressToString (address) {
      return `г. ${address.city}, ${address.street}, ${address.house}`
    }
  }
}
</script>

<style lang="scss" scoped>
.point-popup {
  z-index: 200;
  background-color: #ffffff;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding-top: 30px;
  height: calc(100vh - 140px);
  display: flex;
  flex-direction: column;

  @media(min-width: $tablet-width) {
    display: flex;
    width: 600px;
    max-height: 600px;
    top: calc(50% - 300px);
    left: calc(50% - 300px);
    padding-top: 0;
  }

  @media(min-width: $desktop-width) {
    width: 1000px;
    height: 694px;
    left: calc(50% - 500px);
  }
}

.point-popup__map {
  @media(min-width: $tablet-width) {
    order: 1;
    margin-bottom: 20px;
    padding-top: 0;
  }
  @media(min-width: $desktop-width) {
    margin-bottom: 0;
  }

}

.point-popup__info {
  padding-left: 10px;
  padding-right: 10px;
  @media(min-width: $tablet-width) {
    order: 2;
  }

  @media(min-width: $desktop-width) {
    padding: 30px;
  }
}

.point-popup__bonus,
.point-popup__address,
.point-popup__phone {
  display: flex;
  justify-content: center;
  align-items: center;

  @media(min-width: $desktop-width) {
    justify-content: flex-start;
  }
}

.point-popup__title {
  font-size: 24px;
  line-height: 28px;
  text-align: center;
  margin: 0 0 10px;

  @media(min-width: $desktop-width) {
    display: inline-block;
    margin-right: 30px;
  }
}

.point-popup__bonus {
  display: flex;
  justify-content: center;
  color: #D32F2F;
  margin-bottom: 10px;

  @media(min-width: $desktop-width) {
    display: inline-flex;
  }
}

.point-popup__bonus-text {
  margin: 0;
}

.point-popup__coins,
.point-popup__icon-wrapper {
  fill: var(--maincolor);
  margin-right: 10px;
}

.point-popup__icon-wrapper {
  padding: 7px;
  border-radius: 50%;
  border: 1px solid var(--maincolor);
}

.point-popup__bonus-percent{
  margin-left: 5px;
}

.address {
  align-items: center;
  margin-bottom: 10px;
}

.address__text {
  margin: 0;
  font-size: 15px;
  line-height: 17px;
}

.point-popup__phone {
  a {
    color: #0078A8;
  }
}

.point-popup__close-button {
  position: absolute;
  top: 8px;
  right: 15px;
  border: none;
  background-color: transparent;
  width: 25px;
  height: 25px;

  @media(min-width: $tablet-width) {
    right: -13px;
    top: -13px;
    width: 34px;
    height: 34px;
    background-color: #ffffff;
    border-radius: 50%;
    z-index: 20;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  svg {
    width: 60%;
    height: 60%;
  }


}
</style>
