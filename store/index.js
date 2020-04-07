import { getCookie } from './auth/cookieFunctions.js';

export const state = () => ({});

export const mutations = {};

export const getters = {};

export const actions = {
  async nuxtServerInit ({dispatch, commit}, {req}) {
    let phone,
      password;

    if (req.headers.cookie && typeof(req.headers.cookie) !== 'undefined') {
      phone = getCookie('bmsPhone', req.headers.cookie);
      password = getCookie('bmsPassword', req.headers.cookie);
    }

    if (!!phone && !!password && phone !== 'undefined' && password !== 'undefined') {
      commit('auth/user/setPhone', phone)
      commit('auth/user/setPassword', password)
      commit('global/setIsLogged', true)

      await dispatch('auth/user/loadUserInfo', {phone, pswd: password})
    }

    let header = await this.$axios.$get('/api/header');
    dispatch('global/loadHeader', header);
    commit('auth/registration/setNeedCardNum', header.needCardNum);
    commit('global/setReferer', req.headers.host);
  }
};
