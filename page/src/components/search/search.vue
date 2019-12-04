<template>
  <div class="searchbar"> 
      <input type="text" id="query_input" v-model="query" v-on:keyup.enter="search" />
      <ul class="category-search-result">
	  <span class="search-error" v-if="errormsg.length > 0">{{errormsg}}</span>
	  <span v-if="result.length == 0 && entered_query.trim().length > 0 && errormsg.length == 0">No results</span>
	  <node-index :nodeset="resultset" v-if="result.length > 0"></node-index>
	  <!-- <li v-for="node in result">
	       <router-link :to="'./'+node">{{nodes[node].name}}</router-link>
	       </li> -->
      </ul>
  </div>
</template>

<script>
 import Vue from 'vue'
 import { mapState } from 'vuex'

 export default {
     name: 'search',
     computed: { 
	 ...mapState(['nodes']),
	 resultset: function() {
	     var ans = {};
	     for(var r of this.result) {
		 ans[r] = this.nodes[r];
	     }
	     return ans;
	 }
     },
     data() {
	 return {
	     entered_query: '',
	     query: '',
	     errormsg: '',
	     result: []
	 }
     },
     methods: {
	 search: function() {
	     this.entered_query = this.query;
	     this.errormsg = "";
	     if(this.query.trim().length == 0) {
		 this.result = [];
		 return;
	     }
	     try {
		 var q = Vue.category_query.parse(this.query);
	     }
	     catch(e){
		 this.errormsg = e.toString();
		 this.result = [];
		 return;
	     }
	     var query_result = Vue.category_search(q, this.nodes);
	     if(query_result.length == 1) {
		 this.$router.push('/node/'+query_result[0]);
	     }
	     else {
		 this.result = query_result;
		 for(var i = 0; i < this.result.length; i++){
		     if(this.nodes[this.result[i]].name == this.query.trim()) {
			 this.$router.push('/node/'+this.result[i]);
			 break;
		     }
		 }
	     }
	 }
     },
     mounted: function() {
	 this.query = '';
	 this.search();
     }
 }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

 .search-error {
     color: #e33;
 }
</style>
