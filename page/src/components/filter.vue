<template>    
    <div id="first-pass-filter">
	<input type="text" id="filter_input" v-model="filter_query" v-on:keyup.enter="do_filter" />
	<br />
	<span class="filter-error">{{filter_error}}</span>
    </div>
</template>

<script>
 import { mapState } from 'vuex'
 
 export default {
     name: 'node-filter',
     data() {
	 return {
	     filter_query: "",
	     filter_error: ""
	 };
     },
     computed: {
	 ...mapState([
	 'nodes', 'ready'
	 ])
     },
     methods: {
	 do_filter: function() {
	     var fetch_headers = new Headers();
	     fetch_headers.append('pragma', 'no-cache');
	     fetch_headers.append('cache-control', 'no-cache');
	     
	     var fetch_params = {
		 method: 'GET',
		 headers: fetch_headers,
	     };
	     var self = this;
	     fetch('/out/metadata.json?q=' + encodeURI(this.filter_query), fetch_params).then(function(response){
	    	 response.json().then(function(data){
		     console.log(data);
		     if('error' in data) {
			 self.filter_error = data.error;
		     }
		     else {
			 self.$store.dispatch('reset_metadata',data);
		     }
	    	 });
	     });
	 },
     }
 }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
