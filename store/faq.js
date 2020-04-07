export const state = () => ({
  questions: []
})

export const getters = {
  getQuestions (state) {
    return state.questions
  }
}

export const mutations = {
  setQuestions (state, amount) {
    state.questions = amount.questions
  }
}

export const actions = {
  async loadQuestions ({ commit }) {
    try {
      let q = await this.$axios.$get('api/faq');
      commit('setQuestions', q)
    } catch (e) {
      console.error(e)
    }
  }
}
