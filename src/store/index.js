import Vue from 'vue';
import Vuex from 'vuex';

import authModule from './auth/index.js';
import feedModule from './feed/index.js';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        auth: authModule,
        feed: feedModule
    }
});

export default store;