<template>
    <ul class="category-query-plugin-result">
	<li v-for="node in result">
	    <router-link :to="'./'+node">{{nodes[node].name}}</router-link>
	</li>
    </ul>
</template>
<script>
 import Vue from 'vue'
 import { mapState } from 'vuex'
 
 export default {
     name: 'cat-query',
     props: ['root'],
     
     // Need to have access to all the nodes in order to search them
     computed: {
	 ...mapState(['nodes'])
     },
     data () {
	 return {
	     result: []
	 };
     },
     mounted: function(){
	 var query_text = this.root.innerHTML.trim();
	 var q = Vue.category_parse(query_text);
	 var query_result = Vue.category_search(q, this.nodes);
	 this.result = query_result;
     }
 }
</script>
