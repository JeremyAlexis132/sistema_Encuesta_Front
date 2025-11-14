import { createStore } from 'vuex';
import userModule from '@/modules/user/store';

const store = createStore({
  modules: {
    user: userModule,
  },
  state() {
    return {
      showAlert: false,
      dataAlert: {},
    };
  },
  getters: {
    getShowAlert(state) {
      return state.showAlert;
    },
    getDataAlert(state) {
      return state.dataAlert;
    },
  },
  mutations: {
    setAlert(state, payload) {
      state.showAlert = payload;
    },
    setDataAlert(state, payload) {
      state.dataAlert = payload;
    },
  },
});

export default store; // Asegúrate de que esta línea exista
