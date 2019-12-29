import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    isLogin:0,
    key:'user'
  },
  getters:{
    getStorage: function (state) {
      if (!state.user) {
        state.user = JSON.parse(sessionStorage.getItem(state.key))
        state.isLogin = sessionStorage.getItem('isLogin')
      }
      return state.user
    }
  },
  mutations: {
    $_setLogin (state, value) {
      state.isLogin = value
      sessionStorage.setItem('isLogin', value)
    },
    $_setStorage (state, value) {
      state.user = value
      sessionStorage.setItem(state.key, JSON.stringify(value))
    },
    $_removeStorage (state) {
      state.user = null
      sessionStorage.removeItem(state.key)
    }
  },
  actions: {
  },
  modules: {
  }
})
