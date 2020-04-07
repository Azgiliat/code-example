function getDefaultState () {
  return {
    networkError: '',
    registrationError: '',
    registrationDone: false
  }
}

export const state = () => ({
  networkError: '',
  registrationError: '',
  registrationDone: false,
  needCardNum: false
});

export const mutations = {
  setNetworkError (state, payload) {
    state.networkError = payload
  },
  setRegistrationError (state, payload) {
    state.registrationError = payload
  },
  setRegistrationDone (state, payload) {
    state.registrationDone = payload
  },
  setNeedCardNum (state, payload) {
    state.needCardNum = payload;
  },
  resetState (state) {
    const defaultState = getDefaultState();
    for (let key in defaultState) {
      state[key] = defaultState[key]
    }
  }
};
export const actions = {
  async registerUser ({commit, getters}, payload) {
    let registrationResult;
    try {
      registrationResult = await this.$axios.$post('api/newcard', {
        phone: getters.getPhone,
        pswd: getters.getPassword,
        ...payload
      });
    } catch (err) {
      commit('setNetworkError', 'Ошибка интернет соеденения. Попробуйте чуть позже.');
      return
    }

    switch (registrationResult.code) {
      case 0:
        commit('setNetworkError', '');
        commit('setRegistrationError', '');
        commit('setRegistrationDone', true);
        break;
      case 1:
        commit('setRegistrationError', registrationResult.message);
        commit('setNetworkError', '');
        break;
      case 2:
        commit('setRegistrationError', '');
        commit('setNetworkError', registrationResult.message);
        break;
      default:
        commit('setNetworkError', 'Ошибка интернет соеденения. Попробуйте чуть позже.');
        break;
    }
  }
};
export const getters = {
  getPhone: (state, getters, rootState, rootGetters) => rootGetters['auth/user/getPhone'],
  getPassword: (state, getters, rootState, rootGetters) => rootGetters['auth/user/getPassword'],
  getNetworkError: state => state.networkError,
  getRegistrationError: state => state.registrationError,
  getRegistrationDone: state => state.registrationDone,
  getNeedCardNum: state => state.needCardNum
};
