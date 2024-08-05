import { createStore } from 'vuex';

import { User } from '@/store/modules/User';
import { Timetable } from '@/store/modules/Timetable';
import { Statistics } from '@/store/modules/Statistics';

export default createStore({
  state: {
    url: 'http://localhost:5000/api/core-service/v1'
  },
  mutations: {},
  actions: {},
  getters: {
    GET_URL: (state) => state.url
  },
  modules: { User, Timetable, Statistics }
});
