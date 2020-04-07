import {setCookie} from './cookieFunctions.js';

function getDefaultState () {
  return {
    tokenApproveError: '',
    networkError: '',
    tokenSent: false,
    tokenSentError: '',
    tokenApproved: true,
    loginSuccess: false,
    timerDuration: 60,
    timerId: null,
    secondsRemain: 60,
    loadingStatus: false,
    password: '',
    phone: ''
  }
}

export const state = () => ({
  tokenApproveError: '',
  networkError: '',
  tokenSent: false,
  tokenSentError: '',
  tokenApproved: true,
  loginSuccess: false,
  timerDuration: 60,
  timerId: null,
  secondsRemain: 60,
  loadingStatus: false,
  password: '',
  phone: ''
});

export const getters = {
  getTokenStatus: state => state.tokenSent,
  getTokenApproved: state => state.tokenApproved,
  getTokenApproveError: state => state.tokenApproveError,
  getTokenSentError: state => state.tokenSentError,
  getLoginStatus: state => state.loginSuccess,
  getNetworkError: state => state.networkError,
  getTimerDuration: state => state.timerDuration,
  getPassword: state => state.password,
  getPhone: state => state.phone,
  getTimerStatus: state => !!state.timerId,
  getSecondsRemain: state => state.secondsRemain,
  getLoadingStatus: state => state.loadingStatus
};

export const mutations = {
  setTokenSent (state, payload) {
    state.tokenSent = payload
  },
  setTokenSentError (state, payload) {
    state.tokeSentError = payload
  },
  setTokenApproved (state, payload) {
    state.tokenApproved = payload
  },
  setTokenApproveError (state, payload) {
    state.tokenApproveError = payload
  },
  setLoginFail (state) {
    state.loginSuccess = false
  },
  setLoginSuccess (state, payload) {
    setCookie('bmsPhone', payload.phone)
    setCookie('bmsPassword', payload.password)

    state.loginSuccess = true
  },
  setNetworkError (state, payload) {
    state.networkError = payload
  },
  setPassword (state, payload) {
    state.password = payload
  },
  setPhone (state, payload) {
    state.phone = payload;
  },
  setLoadingStatus (state, payload) {
    state.loadingStatus = payload;
  },
  minusSecond (state) {
    --state.secondsRemain;
  },
  startTimer (state, payload) {
    console.log(payload)
    state.timerId = payload;
  },
  stopTimer (state) {
    clearInterval(state.timerId);
    state.secondsRemain = state.timerDuration;
    state.timerId = null;
  },
  restoreDefaultState (state) {
    const defaultState = getDefaultState();
    for (let key in defaultState) {
      state[key] = defaultState[key]
    }
  }
};

export const actions = {
  resetState ({commit, state}) {
    commit('stopTimer');
    commit('restoreDefaultState');
  },
  startTimer ({commit, getters}) {
    getters.getTimerStatus && commit('stopTimer');

    commit('startTimer', setInterval(() => {
      commit('minusSecond');
      if (getters.getSecondsRemain === 0) {
        commit('stopTimer');
      }
    }, 1000));
  },
  async submitPhone ({commit, state, dispatch}, payload) {
    let tokenSentStatus;

    try {
      commit('setLoadingStatus', true);
      tokenSentStatus = await this.$axios.$post('api/phonetoken', {phone: payload});
      commit('setLoadingStatus', false);
    } catch (err) {
      console.error(err);
      commit('setTokenSent', false);
      commit('setNetworkError', 'Ошибка при установке соеденения с сервером.');
      return
    }

    if (tokenSentStatus.code === 0) {
      //  TODO запустить таймер
      dispatch('startTimer');
      commit('setTokenSent', true);
      commit('setPhone', payload);
      commit('setNetworkError', '')
    } else {
      commit('setTokenSent', false);
      commit('setTokenSentError', tokenSentStatus.message)
    }
  },
  async submitToken ({commit, state}, payload) {
    let password;

    try {
      commit('setLoadingStatus', true);
      password = await this.$axios.$post('api/phoneauth', {phone: payload.phone, token: payload.token});
      commit('setLoadingStatus', false);
    } catch (err) {
      commit('setNetworkError', 'Ошибка установки соеденения с сервером.');
      return
    }

    if (password.status === 'ok') {

      commit('setTokenApproved', true);
      commit('setPassword', password.pswd);
      commit('setTokenApproveError', '');
      commit('global/setIsLogged', true, {root: true});
      commit('setLoginSuccess', {
        phone: payload.phone,
        password: password.pswd
      })
    } else {
      commit('setTokenApproved', false);
      commit('setTokenApproveError', 'Неверный пароль из СМС');
    }
  }
};
