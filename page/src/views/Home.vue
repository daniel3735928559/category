<template>
  <div class="home">
      <div class="snippet_header">
	  <span class="snippet_title">Category</span>
	  <span v-on:click="new_node()" class="close_x"><span class="fas fa-plus"></span></span>
	</div>

	<search initquery="*" />
  </div>
</template>

<script>
// @ is an alias to /src
 import { mapState } from 'vuex'
 
 export default {
     name: 'home',
     computed: mapState([
	 'nodes'
     ]),
     methods: {
	 new_node: function(event){
	     var self = this;
	     var fetch_headers = new Headers();
	     fetch_headers.append('pragma', 'no-cache');
	     fetch_headers.append('cache-control', 'no-cache');
	     
	     var fetch_params = {
		 method: 'GET',
		 headers: fetch_headers,
	     };
	     fetch('/new', fetch_params).then(function(response){
		 response.text().then(function(data){
		     console.log(data);
		 });
	     });
	 }
     }
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
