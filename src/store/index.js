import Vue from 'vue';
import Vuex from 'vuex';

import authModule from './auth/index.js';
import feedModule from './feed/index.js';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    auth: authModule,
    feed: feedModule,
  },
  state() {
    return {
      alert: false,
      alertMsg: null,
      alertType: null,
    };
  },
  getters: {
    alert(state) {
      return state.alert;
    },
    alertMsg(state) {
      return state.alertMsg;
    },
    alertType(state) {
      return state.alertType;
    },
  },
  actions: {
    toggleAlert(context, payload) {
      context.commit('toggleAlert', payload);
    },
  },
  mutations: {
    toggleAlert(state, payload) {
      state.alert = payload.show;
      if (state.alert) {
        state.alertMsg = payload.message;
        state.alertType = payload.type;
      }
    },
  },
});

export default store;
