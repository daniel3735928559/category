<template>
    <div>
	<div class="snippet_header">
	    <span class="snippet_title">{{ready && graph.nodes[node] ? graph.nodes[node].name : 'loading...'}}</span>
	    <span v-on:click="edit_node(node)" class="close_x"><span class="fas fa-edit"></span></span>
	    <span v-on:click="reload_node(node)" class="close_x"><span class="fas fa-sync"></span></span>
	    <span v-on:click="new_node(node)" class="close_x"><span class="fas fa-plus"></span></span>
	    <router-link to="/" class="close_x"><span class="fas fa-home"></span></router-link>
	</div>
	<div>
	    <div v-if="ready && graph.nodes[node] && graph.nodes[node].auto == false">
		<span v-on:click="display_graph = !display_graph" class="close_x"><span class="fas fa-search"></span></span>
		<div v-if="display_graph" style="float:left;width:100%;">
		    <search :nodes="internal_nodes" initquery="*"></search>
		</div>
		
		<read :node="node" />
		<edge-display :node="node"></edge-display>
	    </div>
	    <div v-if="ready && graph.nodes[node] && graph.nodes[node].auto == true">
		<edge-display :node="node"></edge-display>
		<!-- <node-index :nodeset="neighbours(node)" /> -->
	    </div>
	    <div v-if="!ready || !graph.nodes[node]">
		Loading...
	    </div>
	</div>
    </div>
</template>

<script>
 import Vue from 'vue'
 
 import { mapState } from 'vuex'
 import { mapGetters } from 'vuex'

 export default {
     name: 'Node',
     data() {
	 return {
	     'node': this.$route.params.id,
	     'display_graph':false,
	 }
     },
     beforeRouteUpdate: function(to, fro, next) {
	 let node_id = to.params.id;
	 this.$store.dispatch('go',node_id);
	 var self = this;
	 if (!this.graph.nodes[node_id]) {
	     console.log("problem:",node_id,"does not exist");
	 } else {
	     this.node = node_id;
	 }
	 next();
	 /* else if (node_id in this.node_data) {
	    console.log("cached");
	    this.data = this.node_data[node_id];
	    console.log(this.data);
	    this.node = node_id;
	    this.$nextTick(function(){Vue.run_plugins(this);});
	    next();
	    }
	    else if(this.nodes[node_id].auto == "yes") {
	    console.log("auto");
	    this.node = node_id;
	    this.$store.dispatch('go',this.node);
	    next();
	    }*/
	 /* else {
	    console.log("not cached");
	    this.get_node(node_id, next);
	    }*/
     },
     computed: {
	 internal_nodes: function() {
	     // ans is going to be the set of locations within this document as well as all targets
	     var ans = {};
	     var duals = {"has":"is","is":"has"};
	     // Pull in children of the current node and everything connected to them:
	     for(var n in this.nodes) {
		 var node = this.nodes[n];
		 if(node.parent == this.node && n != this.node) {
		     ans[n] = node;
		     for(var dir in node.edges) {
			 for(var label in node.edges[dir]) {
			     for(var edge of node.edges[dir][label]) {
				 if(edge.target != this.node) {
				     ans[edge.target] = this.nodes[edge.target];
				 }
			     }
			 }
		     }
		 }
	     }
	     console.log("INTERNAL",ans);
	     return ans;
	 },
	 ...mapState(['graph', 'ready']),
	 ...mapGetters(['neighbours'])
     },
     methods: {
	 edit_node: function(node, event){
	     var self = this;
	     var fetch_headers = new Headers();
	     fetch_headers.append('pragma', 'no-cache');
	     fetch_headers.append('cache-control', 'no-cache');
	     
	     var fetch_params = {
		 method: 'GET',
		 headers: fetch_headers,
	     };
	     fetch('/edit/'+node, fetch_params).then(function(response){
		 response.text().then(function(data){
		     console.log(data);
		 });
	     });
	 },
	 new_node: function(node, event){
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

<style scoped>
 .snippet_content img {
     max-width: 100%;
 }

 .expanded_content img {
     max-width: 100%;
 }

 .snippet{
     border-radius: 3px;
     border: 1px solid #ccc;
     margin-bottom: 10px;
 }

 .snippet_content{
     padding:5px;
 }

 .snippet_header{
     border-radius: 10px;
     padding: 5px;
     width: 100%;
     margin-bottom: 10px;
 }

 .snippet_title{
     font-size: 20pt;
 }

 .snippet_content{
     max-height: 400px;
     overflow-y:scroll;
     overflow-x:scroll;
     margin-bottom:10px;
 }
</style>
