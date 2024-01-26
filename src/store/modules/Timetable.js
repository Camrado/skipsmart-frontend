import { useToast } from 'vue-toastification';

export const Timetable = {
  namespaced: true,

  state: {
    date: new Date('2024-02-02'), // ! change to new Date()
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
    SET_ARE_UNMARKED_DATES_LOADED({ commit }, areUnmarkedDatesLoaded) {
      commit('SET_ARE_UNMARKED_DATES_LOADED', areUnmarkedDatesLoaded);
    },
    SET_TIMETABLE({ commit }, timetable) {
      commit('SET_TIMETABLE', timetable);
    },

    async DOWNLOAD_UNMARKED_DATES({ rootGetters, commit }) {
      const toast = useToast();

      const token = localStorage.getItem(rootGetters['User/GET_JWT_KEY']);
      const response = await fetch(rootGetters['GET_URL'] + '/attendance/unmarked-dates', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        const data = await response.json();
        commit('SET_UNMARKED_DATES', data.unmarkedDates);
        commit('SET_ARE_UNMARKED_DATES_LOADED', true);
      } else {
        toast.error("Couldn't retrieve unmarked dates. Please try again later.");
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
