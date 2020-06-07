<template>
    <div>
	<div class="snippet_header">
	    <span class="snippet_title">{{nodes && nodes[node] ? nodes[node].name : 'loading...'}}</span>
	    <span v-on:click="edit_node(node)" class="close_x"><span class="fas fa-edit"></span></span>
	    <span v-on:click="reload_node(node)" class="close_x"><span class="fas fa-sync"></span></span>
	    <span v-on:click="new_node(node)" class="close_x"><span class="fas fa-plus"></span></span>
	    <router-link to="/" class="close_x"><span class="fas fa-home"></span></router-link>
	</div>
	<div>
	    <div v-if="nodes && nodes[node] && nodes[node].auto != 'yes'">
		<span v-on:click="display_graph = !display_graph" class="close_x"><span class="fas fa-project-diagram"></span></span>
		<div v-if="display_graph"  style="float:left;width:80%;">
		    <search :nodes="internal_nodes" init_query="'*'"></search>
		</div>
		
		<div v-html="data" class="expanded_content"></div>
		<edge-display :node="node"></edge-display>
	    </div>
	    <div v-if="nodes && nodes[node] && nodes[node].auto == 'yes'">
		<node-index :nodeset="neighbours(node)" />
	    </div>
	    <div v-if="!nodes || !nodes[node]">
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
	     'data': 'loading...'
	 }
     },
     created: function() {
	 console.log('cr');
	 this.$store.commit('GO',this.node);
	 this.get_node(this.node, function(){});
     },
     beforeRouteUpdate: function(to, fro, next) {
	 console.log("ND",this.node_data);
	 let node_id = to.params.id;
	 this.$store.dispatch('go',node_id);
	 var self = this;
	 if (!this.nodes[node_id]) {
	     console.log("problem:",node_id,"does not exist");
	 }
	 else if (node_id in this.node_data) {
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
	 }
	 else {
	     console.log("not cached");
	     this.get_node(node_id, next);
	 }
     },
     computed: {
	 internal_nodes: function() {
	     // ans is going to be the set of locations within this document as well as all targets
	     var ans = {};
	     var duals = {"has":"is","is":"has"};
	     for(var dir in duals){
		 var dual_dir = duals[dir];
		 for(var label in this.nodes[this.node].edges[dir]) {
		     for(var edge of this.nodes[this.node].edges[dir][label]) {
			 console.log("E",edge);
			 var target = edge.target;
			 if('srcloc' in edge) {
			     // Ensure that location has an entry in ans
			     if(!(edge.srcloc in ans)){
				 ans[edge.srcloc] = {
				     "name":"loc"+edge.srcloc,
				     "url":this.node+"/"+edge.srcloc,
				     "edges":{"has":{},"is":{}}
				 };
			     }
			     // Ensure the target has an entry in ans
			     if(!(edge.target in ans)) {
				 ans[edge.target] = {
				     "name":this.nodes[edge.target].name,
				     "url":edge.target,
				     "edges":{"has":{},"is":{}}
				 };
			     }
			     // Ensure label exists in the appropriate edges of source and target
			     if(!(label in ans[edge.srcloc].edges[dir])) {
				 ans[edge.srcloc].edges[dir][label] = [];
			     } 
			     if(!(label in ans[edge.target].edges[dual_dir])) {
				 ans[edge.target].edges[dual_dir][label] = [];
			     }
			     
			     // Add edges between location and target
			     ans[edge.srcloc].edges[dir][label].push({"target":edge.target});
			     ans[edge.target].edges[dual_dir][label].push({"target":edge.srcloc});
			 }
		     }
		 }
	     }
	     console.log("INTERNAL",ans);
	     return ans;
	 },
	 ...mapState(['nodes', 'node_data']),
	 ...mapGetters(['neighbours'])
     },
     methods: {
	 get_node: function(node_id, next) {
	     var self = this;
	     console.log("fetching",node_id);
	     var fetch_headers = new Headers();
	     fetch_headers.append('pragma', 'no-cache');
	     fetch_headers.append('cache-control', 'no-cache');
	     
	     var fetch_params = {
		 method: 'GET',
		 headers: fetch_headers,
	     };
	     fetch('/out/'+node_id+'.html', fetch_params).then(function(response){
		 response.text().then(function(data){
		     var to_cache = {};
		     to_cache[node_id] = data;
		     self.$store.commit('CACHE',to_cache);
		     self.data = data;
		     self.node = node_id;
		     next();
		     console.log("IH1",self.data,"||",self.$el.innerHTML);
		     self.$nextTick(function(){
			 console.log("IH2",self.data,"||",self.$el.innerHTML);
			 Vue.run_plugins(self);
			 console.log("IH3",self.data,"||",self.$el.innerHTML);
		     });
		 });
	     });

	 },
	 reload_node: function(node, event){
	     var self = this;
	     this.get_node(this.node, function(){});
	 },
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
