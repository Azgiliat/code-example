
export const state = () => ({
  points: 'Loading...',
  actions: 'Loading...',
  category: []
})

export const getters = {
  getPoints (state) {
    return state.points
  },
  getActions (state) {
    return state.actions
  },
  getCategories (state) {
    return state.category
  }
}

export const mutations = {
  setPoints (state, amount) {
    state.points = amount.points
    state.actions = amount.actions
  },
  setCategory (state, cat) {
    state.category.push(cat)
  }
}

export const actions = {
  async loadPoints ({ commit, state }, data) {
    try {
      let data = await this.$axios.$get('/api/points')
      commit('setPoints', data);
      data.points.forEach(item => {
        if (state.category.indexOf(item.categoryName) < 0) {
          commit('setCategory', item.categoryName)
        }
      })
    } catch (e) {
      console.log(e)
    }
  }
}
