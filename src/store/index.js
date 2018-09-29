import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import utils from '@/utils/index.js';

export default new Vuex.Store({
  state: {
    votePage: 'voteCode', // 投票开始为输入投票码页面
  },

  mutations: {
    setState: utils.setState
  },

  getters: {

  },

  actions: {
  }
});
