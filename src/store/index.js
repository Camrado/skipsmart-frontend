import { createStore } from 'vuex';

import { User } from '@/store/modules/User';

export default createStore({
  state: {
    url: 'http://localhost:3000/api/v1'
  },
  mutations: {},
  actions: {},
  getters: {
    GET_URL: (state) => state.url
  },
  modules: { User }
});
