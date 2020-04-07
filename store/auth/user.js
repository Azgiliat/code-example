import {deleteCookie} from './cookieFunctions.js';

function getDefaultState () {
  return {
    networkError: '',
    userError: false,
    phone: '',
    password: '',
    isActual: false,
    user: {
      cardNum: '0000000000000000',
      firstName: '',
      middleName: '',
      lastName: '',
      birthDate: '',
      email: '',
      phone: '',
      amount: '',
      balance: '',
      operations: []
    }
  }
}

export const state = () => ({
  networkError: '',
  userError: false,
  phone: '',
  password: '',
  isActual: false,
  userBeenEdited: false,
  userEditError: '',
  user: {
    cardNum: '0000000000000000',
    firstName: '',
    middleName: '',
    lastName: '',
    birthDate: '',
    email: '',
    phone: '',
    amount: '',
    balance: '',
    operations: []
  }
});

export const mutations = {
  setPhone (state, payload) {
    state.phone = payload
  },
  setPassword (state, payload) {
    state.password = payload
  },
  setUser (state, payload) {
    state.isActual = payload.operations.code !== 57
    state.user = payload
  },
  setNetworkError (state, payload) {
    state.networkError = payload
  },
  setUserError (state, payload) {
    state.userError = payload
  },
  editUser (state, payload) {
    for (let key in payload) {
      state.user[key] = payload[key]
    }
  },
  setUserBeenEdited (state, payload) {
    state.userBeenEdited = payload
  },
  setUserEditError (state, payload) {
    state.userEditError = payload
  },
  resetState (state) {
    const defaultState = getDefaultState();
    for (let key in defaultState) {
      state[key] = defaultState[key]
    }
  }
};

export const getters = {
  getPhone (state) {
    return state.phone
  },
  getPassword (state) {
    return state.password
  },
  getUser (state) {
    return state.user
  },
  getNetworkError (state) {
    return state.networkError
  },
  getUserError (state) {
    return state.userError
  },
  getIsActual (state) {
    return state.isActual
  },
  getUserBeenEdited (state) {
    return state.userBeenEdited
  },
  getUserEditError (state) {
    return state.userEditError
  }
};

export const actions = {
  logout ({commit}) {
    commit('resetState');
    commit('global/setIsLogged', false, {root: true});
    if (typeof document !== 'undefined') {
      deleteCookie('bmsPhone')
      deleteCookie('bmsPassword')
    }
  },
  async editUser ({commit, state}, payload) {
    let result;
    try {
      result = await this.$axios.$post('api/editUser', {
        phone: state.phone,
        pswd: state.password,
        user: payload
      })
    } catch (err) {
      commit('setNetworkError', 'Ошибка при установке соеденения с сервером. Обновите страницу')
      return
    }

    switch (result.code) {
      case 0:
        commit('editUser', payload);
        commit('setUserEditError', '');
        commit('setNetworkError', '');
        commit('setUserBeenEdited', true)
        setTimeout(() => {
          commit('setUserBeenEdited', false)
        }, 2000);
        break;
      case 1:
        commit('setUserEditError', result.message);
        commit('setNetworkError', '');
        break;
      case 2:
        commit('setNetworkError', result.message);
        commit('setUserEditError', '');
        break;
      default:
        commit('setNetworkError', 'Неизвестная ошибка.');
        commit('setUserEditError', '');
        break;
    }
  },
  async loadUserInfo ({commit, dispatch, getters}, payload) {
    let userInfo, phone, pswd;

    if (payload) {
      phone = payload.phone;
      pswd = payload.pswd;
    } else {
      phone = `7${getters.getPhone}`;
      pswd = getters.getPassword;
    }

    commit('setUserError', false);

    try {
      userInfo = await this.$axios.$post('api/profile/data', {phone, pswd});
    } catch (err) {
      console.error('Request failed form vuex to node');
      commit('setNetworkError', 'Ошибка при установке соеденения с сервером. Обновите страницу')
      return
    }

    console.log(userInfo)

    switch (userInfo.code) {
      case 0:
        commit('setUser', userInfo.info);
        commit('setNetworkError', '');
        commit('setUserError', false);
        break;
      case 1:
        dispatch('logout');
        commit('setNetworkError', '');
        commit('setUserError', true);
        break;
      case 2:
        commit('setNetworkError', userInfo.message);
        commit('setUserError', false);
        break;
      default:
        commit('setNetworkError', 'Неизвестная ошибка, попробуйте обновить страницу.');
        commit('setUserError', false);
        break;
    }
  }
};
