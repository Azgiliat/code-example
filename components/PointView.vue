<template>
  <div class="partner">
    <nuxt-link class="partner__link partner__container" :to="'/points/' + item.id">
      <h3 class="partner__header" :data-title="'id:' + item.id">
        {{ item.title }}
      </h3>
    </nuxt-link>
    <div class="partner__address-block  partner__container">
      <svg-icon class="partner__address-icon" width="16" height="22" name="place"/>
      <p class="partner__address">
        {{ item.address.street }}, {{ item.address.house }}
      </p>
    </div>
    <div class="partner__rating partner__container">
      <svg-icon :class="{'partner__rating-icon--filled': rating <= Math.round(item.rating)}"
                class="partner__rating-icon" name="rating" width="18" height="18" v-for="rating in 5" :key="rating"/>
      <p class="partner__rating-number">
        ({{item.rating}})
      </p>
    </div>
    <div class="partner__contacts partner__container" v-if="item.phone !== ''">
      <svg-icon width="22" height="22" class="partner__contacts-icon" name="phone" />
      <a class="partner__contacts-phone" :href="'tel:' + item.phone">{{ item.phone }}</a>
    </div>
    <div class="partner__separator" />
    <div class="partner__bonus bonus partner__container">
      <svg-icon width="30" height="30" class="bonus__icon" name="bonus" />
      <p class="bonus__text">
        Бонусирование: <span class="bonus__percent">{{Math.round(item.currentBonus)}}</span>%
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PointView',
    props: {
      item: {
        type: Object,
        require: true
      }
    },
    data() {
      return {
        headerActive: false
      }
    }
  }
</script>

<style lang="scss" scoped>
.partner {
  padding: 20px 0 10px;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  background-color: $white;

  &__container {
    padding: 0 20px;
  }

  &__separator {
    width: 100%;
    height: 1px;
    background-color: rgba($icon, 0.15);
    margin-bottom: 10px;
  }
}

.partner__address {
  &-block {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  &-icon {
    margin-right: 10px;
    fill: $icon;
  }

  grid-area: address;
  font-size: 1em;
  color: rgba(1, 1, 1, 0.5);
  margin: 0;
}

.partner__rating {
  grid-area: info;
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  &-number {
    margin: 0;
  }

  &-icon {
    fill: rgba($icon, 0.15);
    margin-right: 6px;

    &--filled {
      fill: $gold;
    }
  }
}

.partner__info-element {
  display: block;
  margin-right: 1rem;
  font-size: 1rem;
}

.partner__header {
  margin: 0;
  font-size: 16px;
  line-height: 16px;
  font-weight: 500;
  text-align: left;
  padding-bottom: 15px;
  color: $icon;
  border-bottom: 1px dashed rgba($icon-rgb, 0.1);
}

.partner__link {
  grid-area: header;
  display: block;
  text-decoration: none;
  color: $dark-font;
  margin-bottom: 15px;
}

.partner__contacts {
  grid-area: contacts;
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  &-icon {
    margin-right: 10px;
    fill: $icon;
  }
}

.partner__contacts-title {
  display: block;
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 0.5rem;

  &:hover {
    color: green;
    transition: color 0.5s;
  }
}

.partner__contacts-phone {
  font-size: 14px;
  line-height: 13px;
  font-weight: 500;
  display: block;
  justify-self: end;
  color: var(--maincolor);
  text-decoration: none;
}

.bonus{
  display: flex;
  align-items: center;

  &__icon {
    margin-right: 10px;
    fill: var(--maincolor);
  }

  &__text {
    margin: 0;
    color: var(--maincolor);
  }

  &__percent {
    font-weight: 500;
  }
}
</style>
