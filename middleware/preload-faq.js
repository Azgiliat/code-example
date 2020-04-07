export default function ({ store }) {
  if(!store.getters['faq/getQuestions'].length) {
    return store.dispatch('faq/loadQuestions')
  }
}
