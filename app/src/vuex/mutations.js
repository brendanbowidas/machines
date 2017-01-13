import * as types from './mutation-types'

const findMachine = (state, name) => state.machines.filter(machine => machine.name === name)[0]

export default {
  [types.FETCH_MACHINES] (state, machines) {
    state.machines = machines
  },
  [types.UPDATE_MACHINE_STATE] (state, { machineState, machineName }) {
    const machineToUpdate = findMachine(state, machineName)
    machineToUpdate.state = machineState
  },
  [types.UPDATE_MACHINE_IP] (state, { ip, machineName }) {
    const machineToUpdate = findMachine(state, machineName)
    machineToUpdate.driver.ipAddress = ip
  }
}
