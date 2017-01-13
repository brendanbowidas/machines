import MachineCard from './MachineCard.vue'

export default {
  name: 'MachinesList',
  functional: true,
  render(h, { data }) {
    return (
      <div>
        { data.attrs.machines.map(machine =>  <MachineCard machine={machine}></MachineCard>) }
      </div>
    )
  }
}
