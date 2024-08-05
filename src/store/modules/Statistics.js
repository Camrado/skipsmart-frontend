export const Statistics = {
  namespaced: true,

  state: {
    subjectsList: [],
    currentSubject: '',
    isSubjectChanged: false,
    statistics: {},
    statisticsTable: []
  },

  mutations: {
    SET_SUBJECTS_LIST(state, content) {
      state.subjectsList = content;
    },
    SET_CURRENT_SUBJECT(state, content) {
      state.currentSubject = content;
    },
    SET_IS_SUBJECT_CHANGED(state, content) {
      state.isSubjectChanged = content;
    },
    SET_STATISTICS(state, content) {
      state.statistics = content;
    },
    SET_STATISTICS_TABLE(state, content) {
      state.statisticsTable = content;
    }
  },

  actions: {
    SET_SUBJECTS_LIST({ commit }, subjectsList) {
      commit('SET_SUBJECTS_LIST', subjectsList);
    },
    CLEAR_SUBJECTS_LIST({ commit }) {
      commit('SET_SUBJECTS_LIST', []);
    },
    SET_CURRENT_SUBJECT({ commit }, currentSubject) {
      commit('SET_CURRENT_SUBJECT', currentSubject);
    },
    SET_IS_SUBJECT_CHANGED({ commit }, isSubjectChanged) {
      commit('SET_IS_SUBJECT_CHANGED', isSubjectChanged);
    },
    SET_STATISTICS({ commit }, statistics) {
      commit('SET_STATISTICS', statistics);
    },
    SET_STATISTICS_TABLE({ commit }, statisticsTable) {
      commit('SET_STATISTICS_TABLE', statisticsTable);
    },
    CLEAR_STATISTICS({ commit }) {
      commit('SET_STATISTICS', {});
      commit('SET_STATISTICS_TABLE', []);
    }
  },

  getters: {
    GET_SUBJECTS_LIST: (state) => state.subjectsList,
    GET_CURRENT_SUBJECT: (state) => state.currentSubject,
    GET_IS_SUBJECT_CHANGED: (state) => state.isSubjectChanged,
    GET_STATISTICS: (state) => state.statistics,
    GET_STATISTICS_TABLE: (state) => state.statisticsTable
  }
};
