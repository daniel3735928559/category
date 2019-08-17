<template>
  <div class="home">
      <div class="snippet_header">
	  <span class="snippet_title">Category</span>
	</div>

    <node-index :nodeset="nodes" />
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
 .snippet_header{
     border-radius: 10px;
     padding: 5px;
     width: 100%;
     margin-bottom: 10px;
 }

 .snippet_title{
     font-size: 20pt;
 }
</style>
