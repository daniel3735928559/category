<template>
    <div class="browse">
	<div class="browse_container" style="float:left;width:70%;">
	    <div class="filterquery">
		<!-- <input type="text" id="query_input" v-model="query" v-on:keyup.enter="search" /> -->
		<span>{{query}}</span>
		<span v-on:click="clear_filter()" class="close_x"><span class="fas fa-eraser"></span></span>
		<span v-on:click="mode='list'" class="close_x"><span class="fas fa-list"></span></span>
		<span v-on:click="mode='graph'" class="close_x"><span class="fas fa-project-diagram"></span></span>
	    </div>
	    <div v-if="mode=='graph'">
		<div style="float:left;width:100%;">
		    <br />
		    <graph-index :nodeset="resultset" :highlight="highlightset" v-if="!is_empty" v-on:clickedNode="goto_node"></graph-index>
		</div>
	    </div>
	    <div v-if="mode=='list'">
		<node-index :nodeset="resultset" v-if="result.length > 0"></node-index>
	    </div>
	</div>
	<div class="querypanel" style="float:left;width:30%;padding-left:10px;">
	    <div style="float:left">
		<input type="text" id="highlight_input" v-model="highlight_query" v-on:keyup.enter="do_highlight" />
		<span v-on:click="do_highlight()" class="close_x"><span class="fas fa-search"></span></span>
		<span v-on:click="expand_highlight()" class="close_x"><span class="fas fa-plus"></span></span>
		<span v-on:click="clear_highlight()" class="close_x"><span class="fas fa-backspace"></span></span>
		<span v-on:click="set_query(highlight_query)" class="close_x"><span class="fas fa-search-plus"></span></span>
		<span v-on:click="add_to_query('!('+highlight_query+')')" class="close_x"><span class="fas fa-search-minus"></span></span>
	    </div>

	    <span class="search-error" v-if="errormsg.length > 0">{{errormsg}}</span>
	    <br /><br />
	    <div v-if="highlight_is_empty">
		<b>Top nodes</b>
		<div v-for="n in best_nodes" class="query_result">
		    <div style="display:inline-block;">
			<span class="badge_button" v-on:click="add_to_query('((=' + graph.nodes[n.node].name + ')[2], !(=' + graph.nodes[n.node].name + '))')">+</span>
			<span class="badge_button" v-on:click="add_to_query('!(=' + graph.nodes[n.node].name + ')')">-</span>
		    </div>
		    <a href="#" v-on:click="set_highlight('(=' + graph.nodes[n].name + ')[1]')">{{graph.nodes[n].name}} ({{graph.nodes[n]['_outdegree']+graph.nodes[n]['_indegree']}})</a> 
		</div>
	    </div>
	    <div v-if="!highlight_is_empty">
		<b>Top nodes in result</b>
		<div v-for="n in best_highlights" class="query_result">
		    <div style="display:inline-block;">
			<span class="badge_button" v-on:click="add_to_query('((=' + graph.nodes[n.node].name + ')[2], !(=' + graph.nodes[n.node].name + '))')">+</span>
			<span class="badge_button" v-on:click="add_to_query('!(=' + graph.nodes[n.node].name + ')')">-</span>
		    </div>
		    <a href="#" v-on:click="set_highlight('(=' + graph.nodes[n].name + ')[1]')">{{graph.nodes[n].name}} ({{graph.nodes[n]['_outdegree']+graph.nodes[n]['_indegree']}})</a> 
		</div>
	    </div>
	    <hr />
	    <b>Top labels</b>
	    <div v-for="e in best_edges" class="query_result">
		<div style="display:inline-block;">
		    <span class="badge_button" v-on:click="add_to_query('(has ' + e.edge + ' / is ' + e.edge + ')')">+</span>
		    <span class="badge_button" v-on:click="add_to_query('!(is ' + e.edge + ')')">-</span>
		</div>
		<a href="#" v-on:click="set_highlight('(is ' + e.edge + ')')">{{e.label}} ({{e.count}})</a>
	    </div>
	</div>
    </div>
</template>

<script>
 import Vue from 'vue'
 import { mapState } from 'vuex'

 export default {
     name: 'browse',
     computed: {
	 resultset: function() {
	     var ans = {};
	     for(var r in this.result) {
		 ans[r] = this.graph.nodes[r];
	     }
	     return ans;
	 },
	 is_empty: function() {
	     for(var n in this.result) {
		 return false;
	     }
	     return true;
	 },
	 highlight_is_empty: function() {
	     for(var n in this.highlightset) {
		 return false;
	     }
	     return true;
	 },
	 highlightset: function() {
	     var ans = {};
	     for(var r in this.highlight) {
		 ans[r] = true;
	     }
	     console.log(ans);
	     return ans;
	 },
	 best_highlights: function() {
	     return this.subgraph.subgraph(this.highlightset).best_nodes().slice(0,10);
	 },
	 subgraph: function() {
	     if(!this.ready) return;
	     console.log("GGGGGG",this.graph);
	     return this.graph;
	 },
	 best_nodes: function() {
	     console.log("BN",this.ready);
	     if(!this.ready) return [];
	     return this.subgraph.best_nodes().slice(0,10);
	 },
	 best_edges: function() {
	     return this.subgraph.best_labels().slice(0,10);
	 },
	 ...mapState(['graph','ready', 'node_data'])
     },
     data() {
	 return {
	     entered_query: '',
	     query: '',
	     highlight_query: '',
	     errormsg: '',
	     result: [],
	     highlight: [],
	     mode: 'graph',
	 }
     },
     watch: {
	 nodes: function(val) {
	     this.$nextTick(function () {
		 this.search();
	     });
	 }
     },
     methods: {
	 goto_node: function(e) {
	     console.log("GOTO",e);
	     this.$router.push("/node/"+e);
	 },
	 add_to_query: function(qry) {
	     if(this.query.trim().length > 0 && this.query.trim() != "*") {
		 this.query = "("+this.query+"),"+qry;
	     }
	     else {
		 this.query = qry;
	     }
	     this.search();
	 },
	 set_query: function(qry) {
	     this.query = qry;
	     this.highlight_query = "";
	     this.do_highlight();
	     this.search();
	 },
	 set_highlight: function(qry) {
	     this.highlight_query = qry;
	     this.do_highlight();
	 },
	 run_search: function(qry, nodeset) {
	     this.entered_query = qry;
	     this.errormsg = "";
	     if(qry.trim().length == 0) {
		 return [];
	     }
	     try {
		 var q = Vue.category_query.parse(qry);
	     }
	     catch(e){
		 this.errormsg = e.toString();
		 return [];
	     }
	     console.log("QQ",q,this.graph);
	     return this.graph.search(nodeset, q);
	 },
	 search: function() {
	     if(this.query.trim().length == 0) {
		 this.query = "*";
	     }
	     this.graph.debug_search = true;
	     var query_result = this.run_search(this.query,this.nodeset)
	     console.log("RES",query_result);
	     if(query_result.length == 0) {
		 return;
	     }
	     if(query_result.length == 1) {
		 this.$router.push('/node/'+query_result[0]);
	     }
	     else {
		 this.result = query_result;
		 /* for(var i = 0; i < this.result.length; i++){
		    if(this.nodes[this.result[i]].name == this.query.trim()) {
		    this.$router.push('/node/'+this.result[i]);
		    break;
		    }
		    }*/
	     }
	 },
	 do_highlight: function() {
	     this.highlight = this.run_search(this.highlight_query, this.resultset);
	 },
	 expand_highlight: function() {
	     this.highlight_query = "("+this.highlight_query+")[1]";
	     this.do_highlight();
	 },
	 clear_highlight: function() {
	     this.highlight_query = "";
	     this.do_highlight();
	 },
	 new_node: function(event){
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
	 },
	 clear_filter: function() {
	     this.query = '*';
	     this.search();
	     this.do_highlight();
	 }
     },
     mounted: function() {
	 this.query = '*';
	 this.search();
     }
 }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 .sidebar-item {
     border:1px solid #66f;
     border-radius:3px;
     margin:1px;
     overflow:hidden;
     white-space:nowrap;
     padding:2px;
 }
 .search-error {
     font-family: monospace;
     white-space: pre;
     color: #e33;
 }
 .badge_button {
     cursor:pointer;
     margin-right:5px;
     display: inline-block;
     min-width: 10px;
     padding: 3px 7px;
     font-size: 12px;
     font-weight: bold;
     line-height: 1;
     color: #fff;
     text-align: center;
     white-space: nowrap;
     vertical-align: middle;
     background-color: #777;
     border-radius: 10px;
     float:right;
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
</style>
