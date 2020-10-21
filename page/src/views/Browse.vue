<template>
    <div class="browse">
	<div class="querypanel" style="float:left;width:20%;padding-left:10px;">
	    <b v-if="num_hidden > 0">Hidden: {{num_hidden}}</b><br />
	    <b>Top nodes</b>
	    <div v-for="n in best_nodes" class="query_result">
		<div style="display:inline-block;">
		    <span class="badge_button" v-on:click="add_to_query('((=' + graph.nodes[n].name + ')[2], !(=' + graph.nodes[n].name + '))')">+</span>
		    <span class="badge_button" v-on:click="hide_node(n)">-</span>
		</div>
		<a href="#" v-on:click="set_highlight('(=' + graph.nodes[n].name + ')[1], !(='+graph.nodes[n].name+')')">{{graph.nodes[n].name}} ({{graph.nodes[n]['_degree']}})</a> 
	    </div>
	    <hr />
	    <b>Top labels</b>
	    <div v-for="e in best_edges" class="query_result">
		<div style="display:inline-block;">
		    <span class="badge_button" v-on:click="add_to_query('(has ' + e.label + ' / is ' + e.label + ')')">+</span>
		    <span class="badge_button" v-on:click="add_to_query('!(is ' + e.label + ')')">-</span>
		</div>
		<a href="#" v-on:click="set_highlight('(is ' + e.label + ')')">{{e.label}} ({{e.count}})</a>
	    </div>
	</div>
	<div class="browse_container" style="float:left;width:50%;">
	    <div class="filterquery">
		<!-- <input type="text" id="query_input" v-model="query" v-on:keyup.enter="search" /> -->
		<span><input type="search" id="query_input" v-model="query" v-on:search="run_search" v-on:keyup.enter="run_search" /></span>
		<span v-on:click="clear_filter()" class="close_x"><span class="fas fa-globe"></span></span>
		<span v-on:click="mode='list'" class="close_x"><span class="fas fa-list"></span></span>
		<span v-on:click="mode='graph'" class="close_x"><span class="fas fa-project-diagram"></span></span>
		<span style="float:right;padding-left:10px;">Display:</span>
		<span v-on:click="expand_highlight()" class="close_x"><span class="fas fa-expand-arrows-alt"></span></span>
		<span v-on:click="zoom_to_highlight()" class="close_x"><span class="fas fa-eye"></span></span>
		<span v-on:click="hide_highlight()" class="close_x"><span class="fas fa-eye-slash"></span></span>
		<span style="float:right;padding-left:10px;">Highlight:</span>
		<span v-on:click="new_node()" class="close_x"><span class="fas fa-plus"></span></span>
		<span style="float:right;padding-left:10px;">Node:</span>
	    </div>
	    <div v-if="mode=='graph'">
		<div style="float:left;width:100%;">
		    <br />
		    <graph-index :nodeset="resultset" :highlight="highlightset" v-if="!is_empty" v-on:selectedNode="toggle_highlight" v-on:clickedNode="preview_a_node" v-on:doubleClickedNode="goto_node"></graph-index>
		    <br />
		    Reasonableness: {{reasonableness}}
		</div>
	    </div>
	    <div v-if="mode=='list'">
		<node-index :nodeset="resultset" v-if="result.length > 0"></node-index>
	    </div>
	</div>
	<div class="querypanel" style="float:left;width:30%;padding-left:10px;">
	    <div style="float:left">
		<input type="search" id="highlight_input" v-model="highlight_query" v-on:search="do_highlight" v-on:keyup.enter="do_highlight" />
	    </div>

	    <span class="search-error" v-if="errormsg.length > 0">{{errormsg}}</span>
	    <br /><br />

	    
	    <div v-if="preview_mode">
		<span style="float:right;" v-on:click="preview_mode = false" class="close_x"><span class="fas fa-times"></span></span>
		<h4>{{graph.nodes[preview_node].name}}</h4>
		<read :node="preview_node" />
		<edge-display :node="node" />
	    </div>
	    <div v-if="!highlight_is_empty && !preview_mode">
		<b>Top nodes in result</b>
		<div v-for="n in best_highlights" class="query_result">
		    <div style="display:inline-block;">
			<span class="badge_button" v-on:click="add_to_query('((=' + graph.nodes[n].name + ')[2], !(=' + graph.nodes[n].name + '))')">+</span>
			<span class="badge_button" v-on:click="toggle_highlight(n)">-</span>
		    </div>
		    <a href="#" v-on:click="goto_node(n)">{{graph.nodes[n].name}} ({{graph.nodes[n]['_degree']}})</a> 
		</div>
	    </div>
	    <hr />
	</div>
    </div>
</template>

<script>
 import Vue from 'vue'
 import { mapState } from 'vuex'

 export default {
     name: 'browse',
     computed: {
	 reasonableness: function() {
	     if(!(this.ready)) return 1;
	     var d = 0;
	     var ns = 0;
	     for(var n in this.resultset) {
		 d += this.graph.nodes[n]['_degree'];
		 console.log("D",this.graph.nodes[n]['_degree']);
		 ns++;
	     }
	     if(ns == 0) return 1;
	     return d/ns;
	 },
	 resultset: function() {
	     if(!this.ready) return {};
	     if(!this.result) {
		 return this.graph.nodes;
	     }
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
	     var ans = [];
	     var best = this.subgraph.best_nodes();
	     for(var n of best){
		 if(n in this.highlightset) {
		     ans.push(n);
		     if(ans.length >= 10) break;
		 }
	     }
	     return ans;
	 },
	 best_nodes: function() {
	     console.log("BN",this.ready);
	     if(!this.ready) return [];
	     return this.subgraph.best_nodes().slice(0,10);
	 },
	 best_edges: function() {
	     console.log("RRR",this.ready);
	     if(!this.ready) return [];
	     return this.subgraph.best_labels().slice(0,10);
	 },
	 num_hidden: function() {
	     var ans = 0;
	     for(var n in this.hidden) {
		 ans++
	     }
	     return ans;
	 },
	 ...mapState(['graph', 'ready', 'node_data'])
     },
     data() {
	 return {
	     entered_query: '',
	     preview_mode: false,
	     preview_node: '',
	     query: this.$route.params.query ? atob(this.$route.params.query) : '*',
	     preview_id: this.$route.params.id || '',
	     highlight_query: '',
	     errormsg: '',
	     result: {},
	     hidden: {},
	     highlight: {},
	     mode: 'graph',
	     subgraph: {}
	 }
     },
     watch: {
	 ready: function(val) {
	     if(val) {
		 this.$nextTick(function () {
		     this.search();
		 });
	     }
	 }
     },
     methods: {
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
	 },
	 preview_a_node: function(e) {
	     console.log("Preview",e);
	     this.preview_node = e;
	     this.preview_mode = true;
	 },
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
	     this.$router.push('/browse/'+btoa(this.query));
	     this.search();
	 },
	 toggle_highlight: function(n) {
	     console.log("toggle",n);
	     var ans = {};
	     for(var nodeid in this.highlight) {
		 ans[nodeid] = true;
	     }
	     if(n in ans) {
		 delete ans[n];
	     }
	     else {
		 ans[n] = true;
	     }
	     this.highlight = ans;
	     console.log("HANS",ans);
	 },
	 set_query: function(qry) {
	     this.query = qry;
	     this.highlight_query = "";
	     this.do_highlight();
	     this.$router.push('/browse/'+btoa(this.query));
	     this.search();
	 },
	 set_highlight: function(qry) {
	     this.highlight_query = qry;
	     this.do_highlight();
	 },
	 run_search: function(qry, nodeset) {
	     if(!this.ready) return {};
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
		 this.highlight = {};
		 this.subgraph = this.graph.subgraph(this.result);
		 this.do_highlight();
		 this.$forceUpdate();
		 /* for(var i = 0; i < this.result.length; i++){
		    if(this.nodes[this.result[i]].name == this.query.trim()) {
		    this.$router.push('/node/'+this.result[i]);
		    break;
		    }
		    }*/
	     }
	 },
	 hide_highlight: function() {
	     var ans = {};
	     for(var n in this.result) {
		 if(n in this.highlight) {
		     this.hidden[n] = true;
		 }
		 else {
		     ans[n] = true;
		 }
	     }
	     this.highlight = {};
	     this.result = ans;
	     this.subgraph = this.graph.subgraph(this.result);
	 },
	 hide_node: function(n) {
	     var ans = {};
	     for(var x in this.result) {
		 if(x == n) {
		     this.hidden[x] = true;
		 }
		 else {
		     ans[x] = true;
		 }
	     }
	     this.result = ans;
	     this.subgraph = this.graph.subgraph(this.result);
	 },
	 zoom_to_highlight: function() {
	     var ans = {};
	     for(var n in this.result) {
		 if(n in this.highlight) {
		     ans[n] = true;
		 }
		 else {
		     this.hidden[n] = true;
		 }
	     }
	     this.result = ans;
	     this.subgraph = this.graph.subgraph(this.result);
	 },
	 do_highlight: function() {
	     console.log("doing highlight");
	     this.highlight = this.run_search(this.highlight_query, this.resultset);
	 },
	 expand_highlight: function() {
	     this.highlight = this.graph.search_nbhd(this.resultset, this.highlightset, 0, 1, "any", "*", true)
	 },
	 clear_highlight: function() {
	     this.highlight_query = "";
	     this.do_highlight();
	 },
	 clear_filter: function() {
	     this.$router.push('/browse/'+btoa('*'));
	     this.query = '*';
	     this.search();
	     this.do_highlight();
	 }
     },
     beforeRouteUpdate (to, from, next) {
	 console.log('222222222222',to);
	 this.query = to.params.query ? atob(to.params.query) : '*';
	 this.search();
	 next();
     },
     mounted: function() {
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
