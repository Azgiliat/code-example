<template>
  <section class="map" :class="{'map--popup': isPopup}">
    <div :class="{'map-container--popup': isPopup }" :id="`mapid-${_uid}`" class="map-container"/>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'YandexMap',
  data () {
    return {
      map: {}
    }
  },
  props: {
    providedPoints: {
      type: Array,
      require: false
    },
    isPopup: {
      type: Boolean,
      require: false,
      default: false
    },
    mainColor: {
      type: String,
      require: false
    }
  },
  mounted () {
    ymaps.ready(this.buildMap)
  },
  methods: {
    getPicturePath (imgName) {
      const basePath = '/img/' + imgName
      return process.env.NODE_ENV === 'production'
        ? basePath
        : 'http://localhost:8085' + basePath
    },
    calcCenter () {
      return this.providedPoints.map(point => {
        return [
          point.address.latitude,
          point.address.longitude
        ]
      })
    },
    isShoppingMall () {
      const firstPointCoords = {
        latitude: this.providedPoints[0].address.latitude,
        longitude: this.providedPoints[0].address.longitude
      }
      return this.providedPoints.every(point => point.address.latitude === firstPointCoords.latitude && point.address.longitude === firstPointCoords.longitude)
    },
    buildMap () {
      this.map = new ymaps.Map(`mapid-${this._uid}`, this.providedPoints.length === 1 || this.isShoppingMall() ? {
        center: [this.providedPoints[0].address.latitude, this.providedPoints[0].address.longitude],
        zoom: 12
      } : {
        bounds: ymaps.util.bounds.fromPoints(this.calcCenter())
      })
      const placeIcon = ymaps.templateLayoutFactory.createClass(
        `<div class="cluster-icon"><svg><defs><path id="yandexmappoint" d="M7 0C3.13 0 0 3.13 0 7c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/></defs><use fill="${this.mainColor}" fill-rule="nonzero" transform="translate(5 2)" xlink:href="#yandexmappoint"/></svg>{{ properties.geoObjects.length }}</div>`
      )
      const clusterer = new ymaps.Clusterer({
        maxZoom: 30,
        clusterIconColor: this.mainColor
      })
      this.providedPoints.forEach(point => {
        let balloonContentBody = '';
        if(point.currentBonus) {
          balloonContentBody += `<span style="display: block; width: 100%">Бонусирование: <span style="color: red;">${point.currentBonus} %</span></span>`
        }
        if(point.phone.length)  {
          balloonContentBody += `<span>Телефон: </span><a class="balloon-phone" href="tel:${point.phone}">${point.phone}</a>`
        }

        clusterer.add(new ymaps.Placemark([point.address.latitude, point.address.longitude], {
            balloonContentHeader: `${point.title}`,
            balloonContentBody
          },
          {
            iconLayout: 'default#imageWithContent',
            iconImageHref: this.getPicturePath('ymaps-back.svg'),
            iconImageSize: [30, 30],
            iconImageOffset: [-15, -15],
            iconContentLayout: placeIcon,
            iconImageOpacity: 0,
            //  iconLayout: placeIcon,
            hasBalloon: true,
            cursor: 'pointer'
          }
          // {
          //   preset: 'islands#circleDotIconWithCaption',
          //   iconColor: this.mainColor
          // }
        ))
      })
      this.map.geoObjects.add(clusterer)
      this.map.controls.remove('trafficControl')
      this.map.controls.remove('searchControl')
      this.map.controls.remove('typeSelector')
      this.map.behaviors.disable('scrollZoom')
    }
  }
}
</script>

<style lang="scss">
  .cluster-icon {
    fill: var(--maincolor);
    width: 30px;
    height: 30px;

    svg {
      width: 30px;
      height: 30px;
    }
  }

  .map {
    &--popup {
      flex-grow: 1;
      padding-bottom: 0;
    }
  }

  .map-container {
    width: 100%;
    border-radius: 1px;
    height: 600px;
    max-height: 75vh;
    z-index: 10;

    &--popup {
      height: 100%;
    }
  }
</style>
