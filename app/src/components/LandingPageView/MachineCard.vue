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
          <Console :output="totalOutput"></Console>
          <Button @click="buttonAction(machine.name)" v-if="localMachine"
           class="machine-card__button" :type="buttonType" :disabled="regeneratingCerts" :loading="running">{{buttonText}}</Button>
           <Button v-if="localMachine" :loading="regeneratingCerts" @click="regenerateCerts(machine.name)" :disabled="running || machine.state !== 'running'">Regenerate Certs</Button>
    </Card>
</div>


</template>

<script>
import { Card, Button } from 'element-ui'
import Machine from 'docker-machine'
import { mapActions } from 'vuex'
import cp from 'child_process'
import Console from './Console'

  export default {
    props: ['machine'],
    components: { Card, Button, Console },
    data() {
      return {
        running: false,
        regeneratingCerts: false,
        output: '',
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
      },
      //I know, I know... blame the v-html directive
      topBarHTML() {
        return "<div class='top-bar'><ul class='circles'><li class='circle red'></li><li class='circle yellow'></li><li class='circle green'></li></ul>"
      },
      totalOutput() {
        if (this.output) {
          return this.output + this.topBarHTML
        } return null
      }
    },
    methods: {
      startMachine(machineName) {
        this.running = true
        const machine = new Machine(machineName)
        const command = cp.spawn('docker-machine', ['start', machineName])

        this.handleCpOutput(command)

        this.handleCpError(command, this.running)

        command.on('exit', code => {
          if (code !== 0) {
            this.setError('Something went wrong starting the machine')
            this.running = false
            this.output = null
            process.exit(1)
          }

          this.output += 'done!'
          setTimeout(this.clearOutput, 2000)
          this.fetchMachines()

          machine.isRunning((err, running) => {
            if (err) {
              this.setError(err)
              console.log(err);
            }
            if (running) {
              cp.exec(`docker-machine ip ${machineName}`, (err, stdout) => {
                if (err) {
                  this.setError(err)
                  this.running = false
                  this.output = null
                }
                const oldIp = localStorage.getItem(machineName)
                localStorage.setItem(machineName, stdout)
                this.updateMachineIp({ ip: stdout, machineName })
                this.updateMachineState({ machineState: 'running', machineName })
                this.running = false

                if (oldIp && stdout !== oldIp) {
                  this.regenerateCerts(machineName)
                }
                return true
              })
            }
          })
          this.running = false
        })
      },
      stopMachine(machineName) {
        this.running = true
        const machine = new Machine(machineName)
        const command = cp.spawn('docker-machine', ['stop', machineName])

        this.handleCpOutput(command)
        this.handleCpError(command, this.running)

        command.on('exit', code => {
          if (code !== 0) {
            this.setError('Something went wrong stopping the machine')
            this.running = false
            this.output = null
            process.exit(1)
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
              setTimeout(this.clearOutput, 2000)
              return true
            }
          })
        })


      },
      regenerateCerts(machineName) {
        this.regeneratingCerts = true
        const command = cp.spawn('docker-machine', ['regenerate-certs', machineName])

        this.handleCpOutput(command)

        this.handleCpError(command, this.regeneratingCerts)

        command.on('exit', code => {
          if (code !== 0) {
            this.setError('Something went wrong regenerating certs')
            this.regeneratingCerts = false
            process.exit(1)
          }
          this.output += 'done!'
          setTimeout(this.clearOutput, 2000)
          this.regeneratingCerts = false
          this.fetchMachines()
        })
      },
      handleCpOutput(cp) {
        cp.stdout.setEncoding('utf8')

        cp.stdout.on('data', data => {
          if (this.output) {
            this.output = this.output.replace('null', '')
          }
          this.output += '> ' + data.replace('\n', '<br/>')
          cp.stdin.write('y\n')
        })

        cp.stdout.on('error', err => this.setError(err))
      },
      handleCpError(cp, loadingAttribute) {
        cp.stdout.on('error', err => {
          this.setError(err)
          loadingAttribute = false
          this.clearOutput()
        })
      },
      clearOutput() {
        this.output = null
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
