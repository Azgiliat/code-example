export const state = () => ({
  colors: {},
  resolved: false,
  resolvedProfile: false,
  overlayState: false,
  isNavShow: false,
  modal: {
    show: false,
    text: 'loading'
  },
  disabledModules: [],
  modules: [
    {
      id: 'main',
      name: 'Главная',
      path: '/',
    },
    {
      id: 'countdown',
      path: '/countdown',
      name: 'Счетчик'
    },
    {
      id: 'rules',
      path: '/rules',
      name: 'О программе'
    },
    {
      id: 'faq',
      path: '/faq',
      name: 'Вопрос-Ответ'
    },
    {
      id: 'news',
      path: '/news',
      name: 'Новости'
    },
    {
      id: 'points',
      path: '/points',
      name: 'Адреса'
    },
    {
      id: 'contacts',
      path: '/contacts',
      name: 'Контакты'
    },
    {
      id: 'cabinet',
      path: '/profile',
      name: 'Кабинет'
    },
    {
      id: 'join',
      path: '/join',
      name: 'Участвовать'
    },
    {
      id: 'giftcards',
      path: '/gc',
      name: 'Подарочная карта'
    }
  ],
  customModules: {},
  title: '',
  logo: '',
  appLink: '',
  loadHeader: false,
  referer: '',
  isLogged: false
});

export const mutations = {
  setOverlayState (state, payload) {
    state.overlayState = payload;
  },
  setNavState (state, payload) {
    state.isNavShow = payload;
  },
  setModules (state, mods) {
    state.disabledModules = mods.left
  },
  setColors (state, amount) {
    state.colors = amount
  },
  setCustom (state, custMods) {
    state.customModules = custMods
  },
  setTitle (state, str) {
    state.title = str
  },
  setAppLink (state, link) {
    state.appLink = link
  },
  initialiseStore () {
    const state = null
    if (state) {
      this.replaceState(Object.assign(this.state, JSON.parse(state)))
    }
  },
  showModal (state, data) {
    state.modal.show = true
    state.modal.text = data
  },
  closeModal (state) {
    state.modal.show = false
  },
  resolved (state) {
    state.resolved = true
  },
  resolvedProfile (state) {
    state.resolvedProfile = true
  },
  unresolveProfile (state) {
    state.resolvedProfile = false
  },
  setReferer (state, val) {
    state.referer = `https://${val}`
  },
  setIsLogged (state, payload) {
    state.isLogged = payload
  }
};

export const getters = {
  getModules: state => state.modules,
  getCustomModules: state => state.customModules,
  getActiveModules: state => {
    return state.modules.filter(module => {
      return state.disabledModules.indexOf(module.id) === -1
    })
  },
  getOneModule: state => name => {
    return state.disabledModules.indexOf(name) === -1
  },
  checkActiveModule: state => name => name && state.modules[name] && state.modules[name].enabled,
  getTitle: state => state.title,
  getAppLink: state => state.appLink.toLowerCase(),
  getMainColor: state => state.colors.colorPrimary,
  getMainDimmed: state => state.colors.colorPrimaryDark,
  getColorOnPrimary: state => state.colors.colorOnPrimary,
  getColorAccent: state => state.colors.colorAccent,
  getColorOnSecondary: state => state.colors.colorOnSecondary,
  getMainColorRgb: state => {
    const hex = state.colors.colorPrimary.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    return '' + r + ',' + g + ',' + b
  },
  getResolved: state => state.resolved,
  getAwait: state => state.await,
  showModal: state => {
    return state.modal.show
  },
  modalText: state => {
    return state.modal.text
  },
  getLoadHeader: state => state.loadHeader,
  getPicturePath: state => image => {
    return '/api/proxy/pictures/' + image
  },
  getReferer: state => state.referer,
  getIsLogged: state => state.isLogged,
  getOverlayState: state => state.overlayState,
  getNavState: state => state.isNavShow
};

export const actions = {
  async loadHeader ({ commit }, data) {
    commit('setColors', data.colors);
    commit('setModules', data.modules);
    commit('setCustom', data.customModules);
    commit('setTitle', data.name);
    commit('setAppLink', data.appLink);
  }
};
