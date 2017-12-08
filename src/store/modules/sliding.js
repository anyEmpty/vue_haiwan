import * as types from '../mutation-types.js'

const state = {
  'slidingFlag': false
}

// getters
const getters = {
  slidingFlag: state => state.slidingFlag
}

// actions
const actions = {
  slidingFlagchange ({ commit, state }, value) {
    commit(types.SLIDING, value)
  }
}

// mutations
const mutations = {
  [types.SLIDING] (state, value) {
    state.slidingFlag = value
  }
}
export default {
  state,
  getters,
  actions,
  mutations
}
