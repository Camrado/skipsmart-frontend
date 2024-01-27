import { createStore } from 'vuex';

import { User } from '@/store/modules/User';
import { Timetable } from '@/store/modules/Timetable';
import { Statistics } from '@/store/modules/Statistics';

export default createStore({
  state: {
    url: 'https://skipsmart.onrender.com/api/v1'
  },
  mutations: {},
  actions: {},
  getters: {
    GET_URL: (state) => state.url
  },
  modules: { User, Timetable, Statistics }
});
