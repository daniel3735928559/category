<template>
    <div>
	<div v-if="!ready">
	    Loading...
	</div>
	<div v-if="ready && graph.nodes[node] && graph.nodes[node].auto == false">
	    <h3>{{graph.nodes[node].name}}</h3>
	    <div v-html="data" class="expanded_content"></div>
	</div>
    </div>
</template>

<script>
 import Vue from 'vue'
 
 import { mapState } from 'vuex'
 import { mapGetters } from 'vuex'

 export default {
     name: 'Read',
     props: ['node'],
     data() {
	 return {
	     data: "loading..."
	 };
     },
     watch: {
	 node(prev, next) {
	     console.log("NEW NODE???", prev, next);
	     this.get_node(next);
	 }
     },
     created: function() {
	 console.log('cr');
	 this.get_node(this.node);
     },
     methods: {
	 get_node(n) {
	     var self = this;
	     console.log("GET",n);
	     this.$store.dispatch('get_node', n).then(response => {
		 console.log("response",response);
		 self.data = self.node_data[n];
             }, error => {
		 console.error("ERROR", error)
             });
	     
	 }
     },
     computed: {
	 ...mapState(['ready', 'graph', 'node_data']),
     },
 }
</script>

<style scoped>
 .expanded_content img {
     max-width: 100%;
 }
</style>
