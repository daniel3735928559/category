<template>
  <div class="searchbar"> 
      <input type="text" id="query_input" v-model="query" v-on:keyup.enter="search" />
      <ul class="category-search-result">
	  <li v-for="node in result">
	      <router-link :to="'./'+node">{{nodes[node].name}}</router-link>
	  </li>
      </ul>
  </div>
</template>

<script>
 import Vue from 'vue'
 import { mapState } from 'vuex'

 export default {
     name: 'search',
     computed: mapState([
	 'nodes'
     ]),
     data() {
	 return {
	     query: '*',
	     result: []
	 }
     },
     methods: {
	 search: function() {
	     var q = Vue.category_parse(this.query);
	     var query_result = Vue.category_search(q, this.nodes);
	     this.result = query_result;
	 }
     },
     mounted: function() {
	 this.query ='*';
	 this.search();
     }
 }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
</style>
