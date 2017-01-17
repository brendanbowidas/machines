<template>
  <div>
    <Card class="machine-card">
          <h2>{{machine.name}}</h2>
          <ul class="machine-card__info">
            <li class="machine-card__info--item">
              <span class="bold">State:</span> {{machine.state}}
            </li>
            <li class="machine-card__info--item">
              <span class="bold">Driver:</span> {{machine.driverName}}
            </li>
            <li v-if="machine.driver.ipAddress" class="machine-card__info--item">
              <span class="bold">Host:</span> {{machine.driver.ipAddress}}
            </li>
          </ul>
          <Button @click="buttonAction(machine.name)" v-if="localMachine"
           class="machine-card__button" :type="buttonType" :disabled="regeneratingCerts" :loading="running">{{buttonText}}</Button>
           <Button :loading="regeneratingCerts" @click="regenerateCerts(machine.name)" :disabled="running">Regenerate Certs</Button>
    </Card>
</div>


</template>

<script>
import { Card, Button } from 'element-ui'
import Machine from 'docker-machine'
import { mapActions } from 'vuex'
import cp from 'child_process'

  export default {
    props: ['machine'],
    components: { Card, Button },
    data() {
      return {
        running: false,
        regeneratingCerts: false,
      }
    },
    computed: {
      buttonType() {
        if (this.machine.state === 'running') {
          return 'danger'
        }
        return 'success'
      },
      buttonText() {
        if (this.buttonType === 'danger') {
          return 'Stop'
        }
        return 'Start'
      },
      localMachine() {
        return this.machine.driverName === 'virtualbox'
      },
      buttonAction() {
        if (this.machine.state === 'stopped') {
          return machine => this.startMachine(machine)
        }
        if (this.machine.state === 'running') {
          return machine => this.stopMachine(machine)
        }
      }
    },
    methods: {
      startMachine(machineName) {
        this.running = true
        const machine = new Machine(machineName)
        machine.start(err => {
          if (err) {
            this.setError(err)
            return false
          }
          machine.isRunning((err, running) => {
            if (err) {
              this.setError(err)
              return false
            }
            if (running) {
              machine.env({ parse: true }, (err, result) => {
                if (err) {
                  this.setError(err)
                  return false
                }
                const ip = result.DOCKER_HOST.replace('tcp://', '').split(':')[0]
                this.updateMachineIp({ ip, machineName })
                this.updateMachineState({ machineState: 'running', machineName })
                this.running = false
                return true
              })

            }
          })
        })
      },
      stopMachine(machineName) {
        this.running = true
        const machine = new Machine(machineName)
        machine.stop(err => {
          if (err) {
            this.setError(err)
            return false
          }
          machine.isRunning((err, running) => {
            if (err) {
              this.setError(err)
              return false
            }
            if (!running) {
              this.updateMachineIp({ ip: '', machineName })
              this.updateMachineState({ machineState: 'stopped', machineName })
              this.running = false
              return true
            }
          })
        })
      },
      regenerateCerts(machineName) {
        this.regeneratingCerts = true
        const command = cp.spawn('docker-machine', ['regenerate-certs', machineName])
        let stdout = ''

        command.stdout.setEncoding('utf8')
        
        command.stdout.on('data', data => {
          console.log(data);
          stdout += data
          command.stdin.write('y\n')
          stdout = ''
        })

        command.stdout.on('error', err => this.setError(err))


        command.on('exit', code => {
          if (code !== 0) {
            this.setError('Something went wrong regenerating certs')
            this.regeneratingCerts = false
            process.exit(1)
          }
          this.regeneratingCerts = false
        })
      },
      ...mapActions([
        'fetchMachines',
        'updateMachineState',
        'updateMachineIp',
        'setError',
      ])
    }
  }
</script>

<style>
  .machine-card {
    margin-bottom: 20px;
    padding: 20px;
    letter-spacing: .6px;
  }

  .machine-card__info {
    list-style-type: none;
    padding: 10px;
  }

  .machine-card__info--item {
    padding: 5px;
  }
  .bold {
    font-weight: bold;
  }
  .machine-card__button {
    width: 20%;
  }
</style>
