export const User = {
  namespaced: true,

  state: {
    jwtKeyInLStorage: 'fnw3m43mn2fu52n3nxi4mqp23z3ifn4z44gh',
    expirationDateKey: 'expirationDate',
    userId: undefined,
    groupId: undefined,
    isSignedIn: undefined,
    firstName: '',
    lastName: '',
    email: '',
    languageSubgroup: undefined,
    facultySubgroup: undefined
  },

  mutations: {
    SET_SIGNED_IN(state, content) {
      state.isSignedIn = content;
    },
    SET_USER_ID(state, content) {
      state.userId = content;
    },
    SET_FIRSTNAME(state, content) {
      state.firstName = content;
    },
    SET_LASTNAME(state, content) {
      state.lastName = content;
    },
    SET_EMAIL(state, content) {
      state.email = content;
    },
    SET_GROUP_ID(state, content) {
      state.groupId = content;
    },
    SET_LANGUAGE_SUBGROUP(state, content) {
      state.languageSubgroup = content;
    },
    SET_FACULTY_SUBGROUP(state, content) {
      state.facultySubgroup = content;
    }
  },

  actions: {
    SET_SIGNED_IN({ commit }, isSignedIn) {
      commit('SET_SIGNED_IN', isSignedIn);
    },
    SET_USER_ID({ commit }, userId) {
      commit('SET_USER_ID', userId);
    },
    SET_FIRSTNAME({ commit }, firstName) {
      commit('SET_FIRSTNAME', firstName);
    },
    SET_LASTNAME({ commit }, lastName) {
      commit('SET_LASTNAME', lastName);
    },
    SET_EMAIL({ commit }, email) {
      commit('SET_EMAIL', email);
    },
    SET_GROUP_ID({ commit }, groupId) {
      commit('SET_GROUP_ID', groupId);
    },
    SET_LANGUAGE_SUBGROUP({ commit }, subgroup) {
      commit('SET_LANGUAGE_SUBGROUP', subgroup);
    },
    SET_FACULTY_SUBGROUP({ commit }, subgroup) {
      commit('SET_FACULTY_SUBGROUP', subgroup);
    }
  },

  getters: {
    GET_IS_SIGNED_IN: (state) => state.isSignedIn,
    GET_USER_ID: (state) => state.userId,
    GET_FIRSTNAME: (state) => state.firstName,
    GET_LASTNAME: (state) => state.lastName,
    GET_EMAIL: (state) => state.email,
    GET_GROUP_ID: (state) => state.groupId,
    GET_LANGUAGE_SUBGROUP: (state) => state.languageSubgroup,
    GET_FACULTY_SUBGROUP: (state) => state.facultySubgroup,

    GET_JWT_LKEY: (state) => state.jwtKeyInLStorage,
    GET_EXPIRATION_DATE_KEY: (state) => state.expirationDateKey
  }
};
