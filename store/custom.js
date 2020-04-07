export const state = () => ({
  mod: {}
})

export const getters = {
  getMod (state) {
    return state.mod
  }
}

export const mutations = {
  setMod (state, amount) {
    state.mod = amount
  }
}

export const actions = {
  async loadMod ({ commit }) {
    try {
      let res = await this.$axios.$get('api/custom');
      commit('setMod', res.mod)
    } catch (e) {
      console.error(e)
    }
  }
}
