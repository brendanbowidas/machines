<template>
    <Card class="machine-card">
      {{machine.name}}
    </Card>
</template>

<script>
import { Card } from 'element-ui'

  export default {
    props: ['machine'],
    components: { Card }
  }
</script>

<style>
  .machine-card {
    margin-bottom: 20px;
  }
</style>
