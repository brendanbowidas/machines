import MachineCard from './MachineCard.vue'
import { Row } from 'element-ui'
console.log(Row);
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
