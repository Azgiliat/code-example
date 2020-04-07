<template>
<transition v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:leave="leave" v-on:after-leave="afterLeave"
             >
  <div class="wrapper" v-show="toggle" ref="wrap">
    <slot />
  </div>
</transition>
</template>

<script>
export default {
  name: 'AnimateHeight',
  props: {
    duration: {
      type: Number,
      require: false,
      default: 300
    },
    timing: {
      type: Function,
      require: false,
      default: (x) => x
    },
    toggle: {
      type: Boolean,
      require: true
    }
  },
  mounted() {
    //  console.log(this.$refs.wrap.offsetHeight)
  },
  data () {
    return {
      totalHeight: 0
    }
  },
  methods: {
    draw (progress, el) {
      el.style.height = `${progress * this.totalHeight}px`
      el.style.marginTop = `${progress * 0.6}rem`
    },
    drawBack (progress, el) {
      el.style.height = `${(1 - progress) * this.totalHeight}px`
      el.style.marginTop = `${(1 - progress) * 0.6}rem`
    },
    animate ({ draw, done, el }) {
      const start = performance.now()
      const animate = () => {
        const timeFraction = (performance.now() - start) / this.duration
        const progress = this.timing(timeFraction)
        draw(progress, el)
        if (timeFraction <= 1) {
          requestAnimationFrame(animate)
        } else {
          if (done) done()
        }
      }
      requestAnimationFrame(animate)
    },
    beforeEnter (el) {
      el.style.height = 0;
    },
    enter (el, done) {
      this.totalHeight = [...el.childNodes].filter(node => node.nodeType === 1).reduce((accum, item) => {
        // заебало каждый раз переписывать эту стрелочную функцию на вариант  () => { return blabbla}
        //  для отладки подсчета высоты. пусть такой и остаётся.
        // console.log(item.clientHeight)
        // console.log(getComputedStyle(item).getPropertyValue('margin-top'))
        // console.log(getComputedStyle(item).getPropertyValue('margin-bottom').slice(0, -2))
        return accum +
        (item.clientHeight + parseFloat(getComputedStyle(item).getPropertyValue('margin-top').slice(0, -2))
          + parseFloat(getComputedStyle(item).getPropertyValue('margin-bottom').slice(0, -2)))}, 0);
      console.log(this.totalHeight)
      this.totalHeight = Math.round(this.totalHeight)
      this.animate({
        draw: this.draw,
        done,
        el
      })
    },
    leave (el, done) {
      this.animate({
        draw: this.drawBack,
        el,
        done
      })
    },
    afterLeave (el) {
      //this.totalHeight = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  overflow: hidden;
}
</style>
