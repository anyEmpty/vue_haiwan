import * as types from '../mutation-types.js'

const state = {
  'num': 0
}

// getters
const getters = {
  num: state => state.num
}

// actions
const actions = {
  add ({ commit, state }) {
    commit(types.ADD)
  },
  del ({ commit, state }) {
    commit(types.DEL)
  }
}

// mutations
const mutations = {
  [types.ADD] (state) {
    state.num++
  },

  [types.DEL] (state) {
    state.num--
  }
}
export default {
  state,
  getters,
  actions,
  mutations
}
