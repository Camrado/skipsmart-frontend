import { ElMessage } from 'element-plus';

export const Timetable = {
  namespaced: true,

  state: {
    date: new Date(), // ! change to new Date()
    unmarkedDates: [],
    timetable: {
      lessons: []
    },
    areUnmarkedDatesLoaded: false
  },

  mutations: {
    SET_DATE(state, content) {
      state.date = content;
    },
    SET_UNMARKED_DATES(state, content) {
      state.unmarkedDates = content;
    },
    SET_ARE_UNMARKED_DATES_LOADED(state, content) {
      state.areUnmarkedDatesLoaded = content;
    },
    SET_TIMETABLE(state, content) {
      state.timetable = content;
    }
  },

  actions: {
    SET_DATE({ commit }, date) {
      commit('SET_DATE', date);
    },
    SET_UNMARKED_DATES({ commit }, unmarkedDates) {
      commit('SET_UNMARKED_DATES', unmarkedDates);
    },
    REMOVE_MARKED_DATE({ commit, getters }, markedDate) {
      let unmarkedDates = getters.GET_UNMARKED_DATES;
      let newUnmarkedDates = unmarkedDates.filter((date) => date != markedDate);

      commit('SET_UNMARKED_DATES', newUnmarkedDates);
    },
    SET_ARE_UNMARKED_DATES_LOADED({ commit }, areUnmarkedDatesLoaded) {
      commit('SET_ARE_UNMARKED_DATES_LOADED', areUnmarkedDatesLoaded);
    },
    SET_TIMETABLE({ commit }, timetable) {
      commit('SET_TIMETABLE', timetable);
    },
    CLEAR_TIMETABLE({ commit }) {
      commit('SET_TIMETABLE', { lessons: [] });
    },

    async DOWNLOAD_UNMARKED_DATES({ rootGetters, commit }) {
      const token = localStorage.getItem(rootGetters['User/GET_JWT_LKEY']);
      const response = await fetch(rootGetters['GET_URL'] + '/attendances/unmarked-dates', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        const unmarkedDates = await response.json();
        commit('SET_UNMARKED_DATES', unmarkedDates);
        commit('SET_ARE_UNMARKED_DATES_LOADED', true);
      } else {
        ElMessage.error({ message: "Couldn't retrieve unmarked dates. Please try again later.", showClose: true });
      }
    }
  },

  getters: {
    GET_DATE: (state) => state.date,
    GET_UNMARKED_DATES: (state) => state.unmarkedDates,
    GET_ARE_UNMARKED_DATES_LOADED: (state) => state.areUnmarkedDatesLoaded,
    GET_TIMETABLE: (state) => state.timetable
  }
};
