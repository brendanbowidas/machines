
<template>


    <div class="console hidden" :class="{'active': output}" v-html="output">

    </div>



</template>

<script>
export default {
  name: 'Console',
  props: ['output']

}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Fira+Mono');
  .console {
    background-color: #202222;
    color: #fff;
    font-family: 'Fira Mono', monospace;
    font-size: .95rem;
    border-radius: 5px;
    width: 50%;
    border-top: 18px solid #cdcdcd;
    text-align: justify;
    position: relative;
    transition: opacity 0.3s ease;
  }
  .top-bar {
    position: absolute;
    top: -15px;
    left: 0;
    color: red;
  }

  .circles {
    list-style-type: none;
    width: 100%;
    display: inline-block;
  }

  .circle {
    display: inline-block;
    width: 10px;
    border-radius: 5px;
    height: 10px;
    margin-left: 8px;
    margin-bottom: 2px;

  }

  .circle.red {
    background-color: #F14352;
  }
  .circle.yellow {
    background-color: #F8B532;
  }
  .circle.green {
    background-color: #32DA3F;
  }

  .hidden {
    opacity: 0;
    padding: 0;
    margin: 0;
  }
  .active {
    opacity: 1;
    padding: 20px;
    margin: 0 auto;
    margin-bottom: 20px;
  }
</style>
