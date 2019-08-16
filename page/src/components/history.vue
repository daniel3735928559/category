<template>
    <div id="working_set">
	<h4 v-if="recent.length != 0"><span v-on:click="clear_history()" style="cursor:pointer;margin-right:5px;">[x]</span>Recent nodes
</h4>
	<ul>
	    <li v-for="node in recent">
		<span v-on:click="remove_from_history(node)" style="cursor:pointer;margin-right:5px;">[x]</span> <router-link :to="{name:'node', params: {id: node}}">{{nodes && nodes[node] ? nodes[node].name : "loading..."}}</router-link>
	    </li>
	    <!-- <draggable v-model="recent">
		 <li v-for="node in recent">
		 <router-link :to="{name:'doc', params: {id: node}}">{{nodes[node].name}}</router-link>
		 </li>
		 </draggable> -->
	</ul>
    </div>
</template>

<script>
 import { mapState } from 'vuex'
 
 export default {
     name: 'history-display',
     computed: mapState([
	 'recent', 'nodes'
     ]),
     methods: {
	 remove_from_history: function(node_id) {
	     this.$store.dispatch('remove_from_history',node_id);
	 },
	 clear_history: function() {
	     this.$store.dispatch('clear_history');
	 }
     }
 }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

 #working_set{
     padding-top:5px;
     padding-left:5px;
 }

</style>
