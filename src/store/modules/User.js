export const User = {
  namespaced: true,

  state: {
    jwtKeyInLStorage: 'fnw3m43mn2fu52n3nxi4mqp23z3ifn4z44gh',
    expireDateKey: 'expireDate',
    group: undefined,
    isSignedIn: undefined,
    username: '',
    term: undefined,
    semester: undefined
  },

  mutations: {
    SET_SIGNED_IN(state, content) {
      state.isSignedIn = content;
    },
    SET_USERNAME(state, content) {
      state.username = content;
    },
    SET_GROUP(state, content) {
      state.group = content;
    },
    SET_TERM(state, content) {
      state.term = content;
    },
    SET_SEMESTER(state, content) {
      state.semester = content;
    }
  },

  actions: {
    SET_SIGNED_IN({ commit }, isSignedIn) {
      commit('SET_SIGNED_IN', isSignedIn);
    },
    SET_USERNAME({ commit }, username) {
      commit('SET_USERNAME', username);
    },
    SET_GROUP({ commit }, group) {
      commit('SET_GROUP', group);
    },
    SET_TERM({ commit }, term) {
      commit('SET_TERM', term);
    },
    SET_SEMESTER({ commit }, semester) {
      commit('SET_SEMESTER', semester);
    }
  },

  getters: {
    GET_IS_SIGNED_IN: (state) => state.isSignedIn,
    GET_USERNAME: (state) => state.username,
    GET_JWT_KEY: (state) => state.jwtKeyInLStorage,
    GET_GROUP: (state) => state.group,
    GET_TERM: (state) => state.term,
    GET_EXPIRE_DATE_KEY: (state) => state.expireDateKey,
    GET_SEMESTER: (state) => state.semester
  }
};
