import { createStore } from 'vuex';

import { User } from '@/store/modules/User';
import { Timetable } from '@/store/modules/Timetable';

export default createStore({
  state: {
    url: 'https://skipsmart.onrender.com/api/v1'
  },
  mutations: {},
  actions: {},
  getters: {
    GET_URL: (state) => state.url
  },
  modules: { User, Timetable }
});
