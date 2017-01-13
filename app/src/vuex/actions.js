import * as types from './mutation-types'
import Machine from 'docker-machine'

export const fetchMachines = ({ commit }) => {
  Machine.list({ inspect: true }, (err, machines) => {
    if (err) throw err
    commit(types.FETCH_MACHINES, machines)
  })
}

export const updateMachineState = ({ commit }, payload) => commit(types.UPDATE_MACHINE_STATE, payload)

export const updateMachineIp = ({ commit }, payload) => commit(types.UPDATE_MACHINE_IP, payload)
