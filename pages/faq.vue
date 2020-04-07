<template>
  <section class="faq">
    <div class="container-center">
      <div class="faq__header-block">
        <h3 class="header">Вопросы и ответы</h3>
        <div class="divider"/>
      </div>
      <div class="faq__cards cards">
        <div class="cards__card card" :key="index" v-for="(question, index) in questions">
          <div class="card__question-block" @click="toggleQuestion(index)">
            <p class="card__question">
              {{ question.question }}
            </p>
            <button type="button" class="card__button">
              <svg-icon class="card__icon"
                        :class="{ 'card__icon--opened': openedQuestions[index] }"
                        width="24"
                        height="24"
                        fill="var(--maincolor)"
                        name="arrow-down"
              />
            </button>
          </div>
          <animateHeight :toggle="openedQuestions[index]" :duration="300">
            <div class="divider divider--short" />
            <p class="card__answer">
              {{ question.answer }}
            </p>
          </animateHeight>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import animate from '~/components/AnimateHeight'
import { mapGetters } from 'vuex'

export default {
  name: 'FaqCont',
  middleware: ['preload-faq'],
  components: {
    animateHeight: animate
  },
  validate({ store }) {
    return store.getters['global/getOneModule']('faq')
  },
  data () {
    return {
      openedQuestions: []
    }
  },
  methods: {
    toggleQuestion (index) {
      this.openedQuestions.splice(index, 1, !this.openedQuestions[index])
    }
  },
  computed: {
    ...mapGetters('faq', {
      questions: 'getQuestions'
    })
  },
  created () {
    this.openedQuestions = this.questions.map(() => false)
  }
}
</script>

<style lang="scss" scoped>
  .card__question,
  .card__answer {
    margin: 0;
  }

  .card__question {
    transition: all 0.5s;

    &:hover {
      color: var(--maincolor);
      transform: scale(1.2);
    }
  }

  .card__button {
    border: none;
    background-color: transparent;
    outline: none;
    cursor: pointer;
  }

  .card__icon {
    transition: all 0.3s;
  }

  .card__icon--opened {
    transform: rotateX(180deg);
  }

  .card {
    text-align: center;
    margin-bottom: 1rem;
    padding-bottom: 0.9rem;
    border-bottom: solid 2px var(--maincolor);
  }
</style>
