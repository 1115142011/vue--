import Vue from 'vue';
import Vuex from 'vuex';
import wxSurvey from './modules/wxSurvey.store';
import repairs from './modules/repairs.store';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    reiseChange: false
  },
  mutations: {
    transform_resize (st, val) {
      st.reiseChange = val;
    }
  },
  modules: {
    wxSurvey,
    repairs
  },
  plugins: [createPersistedState({
    storage: window.sessionStorage
  })]

});
