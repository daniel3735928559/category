<template>
  <div class="home">
    <node-index :nodeset="nodes "/>
  </div>
</template>

<script>
// @ is an alias to /src
 import { mapState } from 'vuex'
 
 export default {
     name: 'home',
     computed: mapState([
	 'nodes'
     ])
 }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
