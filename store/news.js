export const state = () => ({
  news: ['Loading...'],
  images: 'Loading',
  allPoints: []
})

export const getters = {
  getNews (state) {
    return state.news
  },
  getImages (state) {
    return state.images
  },
  getAllPoints (state) {
    return state.allPoints
  }
}

export const mutations = {
  setNews (state, amount) {
    if (amount.news.length === 0) { state.news = { title: 'Новостей пока нет', content: '' } } else state.news = amount.news
    state.images = amount.news.map(item => item.images)
  },
  setAllPoints (state, amount) {
    state.allPoints = amount
  }
}

export const actions = {
  async loadNews ({ commit }) {
    try {
      let news = await this.$axios.$get('/api/news')
      commit('setNews', news)
    } catch (error) {
      console.error(error)
    }
  },
  async loadAllPoints ({ commit }, amount) {
    try {
      let oneNew = await this.$axios.$get(`/api/news/${amount}`)
      commit('setAllPoints', oneNew.points)
    } catch (e) {
      console.error(error)
    }
  }
}
