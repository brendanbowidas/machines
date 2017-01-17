<template>
  <div>
    <el-alert v-if="error" show-icon title="Error" :description="error" @close="clearError" type="error"></el-alert>
    <machines-list :machines="machines"></machines-list>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import MachinesList from './LandingPageView/MachinesList'
import { Alert } from 'element-ui'

export default {
  created() {
    this.fetchMachines()
  },
  name: 'landing-page',
  methods: {
    clearError() {
      this.setError(null)
    },
    ...mapActions([
      'fetchMachines',
      'setError'
    ]),
  },
  computed: {
    machines() {
      return this.$store.state.machines
    },
    error() {
      return this.$store.state.error
    },
    ...mapGetters([
      'runningMachines',
    ])
  },
  components: { MachinesList, elAlert: Alert },
}
</script>

<style>
  .el-alert {
    display: flex;
    align-items: center;
  }

  .el-alert__content {
    margin: 0 auto;
  }
</style>
