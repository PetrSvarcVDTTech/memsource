import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    notifications: [],
    nextId: 1
  },
  mutations: {
    ADDID(state) {
      state.nextId++
    },
    PUSH(state, notification) {
      state.notifications.push(notification)
    },
    DELETE(state, notificationToRemove) {
      state.notifications = state.notifications.filter((notification) => notification.id !== notificationToRemove.id)
    }
  },
  actions: {
    add({ commit, dispatch }, notification) {
      commit('ADDID')
      let newNotification = {
        ...notification,
        id: this.state.nextId
      }
      commit('PUSH', newNotification)
      let timeout = setTimeout(() => {
        dispatch('remove', newNotification)
        clearTimeout(timeout)
      }, 5000)
    },
    remove({ commit }, notificationToRemove) {
      commit('DELETE', notificationToRemove)
    }
  },
  modules: {}
})
