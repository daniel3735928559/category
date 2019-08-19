<template>
    <div>
	<div class="snippet_header">
	    <span class="snippet_title">{{nodes && nodes[node] ? nodes[node].name : 'loading...'}}</span>
	    <span v-on:click="edit_node(node)" class="close_x"><span class="fas fa-edit"></span></span>
	    <span v-on:click="reload_node(node)" class="close_x"><span class="fas fa-sync"></span></span>
	    <router-link to="/" class="close_x"><span class="fas fa-home"></span></router-link>
	</div>
	<div>
	    <div v-if="nodes && nodes[node] && nodes[node].auto != 'yes'">
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
	     'data': 'loading...'
	 }
     },
     created: function() {
	 this.get_node(this.node, function(){});
	 this.$store.dispatch('go',this.node);
     },
     beforeRouteUpdate: function(to, fro, next) {
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
	     this.get_node(node_id, data => {
		 self.$store.dispatch('cache',{node_id:data});
		 self.node = node_id;
		 next();
	     });
	 }
     },
     computed: {
	 ...mapState(['nodes', 'node_data']),
	 ...mapGetters([
	     'neighbours',
	 ])
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
		     self.data = data;
		     next(data);
		     self.$nextTick(function(){Vue.run_plugins(self);});
		 });
	     });

	 },
	 reload_node: function(node, event){
	     var self = this;
	     this.get_node(this.node, data => {
		 self.$store.dispatch('cache',{node:data});
	     });
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
