<template>
  <div>
    <h1>Welcome.</h1>
    <Row>
      <machines-list :machines="machines"></machines-list>
    </Row>

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import MachinesList from './LandingPageView/MachinesList'
import { Row } from 'element-ui'

export default {
  created() {
    this.fetchMachines()
  },
  name: 'landing-page',
  methods: {
    ...mapActions([
      'fetchMachines',
    ]),
  },
  computed: {
    machines() {
      return this.$store.state.machines
    },
    ...mapGetters([
      'runningMachines',
    ])
  },
  components: { MachinesList, Row },
}
</script>
