import { createStore } from 'vuex';

import { User } from '@/store/modules/User';
import { Timetable } from '@/store/modules/Timetable';
import { Statistics } from '@/store/modules/Statistics';

export default createStore({
  state: {
    // url: 'https://skipsmart-backend-v2-core-service-demo.onrender.com/api/core-service/v1'
    url: 'http://localhost:5280/api/core-service/v1'
  },
  mutations: {},
  actions: {},
  getters: {
    GET_URL: (state) => state.url
  },
  modules: { User, Timetable, Statistics }
});
