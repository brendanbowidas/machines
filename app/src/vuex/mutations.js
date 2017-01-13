import * as types from './mutation-types'

export default {
  [types.FETCH_MACHINES] (state, machines) {
    state.machines = machines
  },
}
