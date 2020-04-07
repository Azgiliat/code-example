export const state = () => ({
  rules: {
    creators: 'Loading...',
    link: 'Loading...',
    about: 'Loading...',
    img: false,
    phone: '+78123221010',
    email: 'contact@GroupBMS.ru'
  }
})

export const getters = {
  getRules (state) {
    return state.rules
  },
  getCreators (state) {
    return state.rules.creators
  },
  getLink (state) {
    return state.rules.link
  },
  getAbout (state) {
    return state.rules.about
  },
  getImg (state) {
    return state.rules.img
  },
  getPhone (state) {
    return state.rules.phone
  },
  getEmail (state) {
    return state.rules.email
  }
}

export const mutations = {
  setRules (state, amount) {
    state.rules.about = amount.about
    state.rules.creators = amount.creators
    state.rules.link = amount.link
    state.rules.img = amount.img
  }
}

export const actions = {
  async loadRules ({ commit }) {
    try {
      let rules = await this.$axios.$get('/api/rules');
      commit('setRules', rules)
    } catch (e) {
      console.log(e)
    }
  }
}
