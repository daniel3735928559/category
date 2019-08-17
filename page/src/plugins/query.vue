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
     computed: {
	 ...mapState(['nodes'])
     },
     data () {
	 return {
	     result: []
	 };
     },
     mounted: function(){
	 // Parse the link info
	 var query_text = this.root.innerHTML.trim();
	 console.log('qt',query_text);
	 var q = Vue.category_parse(query_text);
	 var query_result = Vue.category_search(q, this.nodes);
	 console.log('result',this.nodes,query_result);
	 this.result = query_result
     }
 }
</script>
