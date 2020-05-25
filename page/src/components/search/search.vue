<template>
    <div class="searchbar"> 
	<input type="text" id="query_input" v-model="query" v-on:keyup.enter="search" />
	<span v-on:click="mode='list'" class="close_x"><span class="fas fa-list"></span></span>
	<span v-on:click="mode='graph'" class="close_x"><span class="fas fa-project-diagram"></span></span>
	<span class="search-error" v-if="errormsg.length > 0">{{errormsg}}</span>


	<div v-if="mode=='graph'">
	    <div style="float:left;width:20%;">
		<b>Top nodes</b>
		<div v-for="n in best_nodes" style="border:1px solid #66f;border-radius:3px;margin:1px;overflow:hidden;white-space:nowrap;padding:2px;">
		    <div style="display:inline-block;">
			<span class="badge_button" v-on:click="add_to_query('((=' + nodes[n.node].name + ')[2], !(=' + nodes[n.node].name + '))')">+</span>
			<span class="badge_button" v-on:click="add_to_query('!(=' + nodes[n.node].name + ')')">-</span>
		    </div>
		    <a href="#" v-on:click="set_highlight('(=' + nodes[n.node].name + ')[1]')">{{nodes[n.node].name}} ({{n.degree}})</a> 
		</div>
		<hr />
		<b>Top labels</b>
		<div v-for="e in best_edges" style="border:1px solid #66f;border-radius:3px;margin:1px;overflow:hidden;white-space:nowrap;padding:2px;">
		    <div style="display:inline-block;">
			<span class="badge_button" v-on:click="add_to_query('(has ' + e.edge + ' / is ' + e.edge + ')')">+</span>
			<span class="badge_button" v-on:click="add_to_query('!(is ' + e.edge + ')')">-</span>
		    </div>
		    <a href="#" v-on:click="set_highlight('(is ' + e.edge + ')')">{{e.edge}} ({{e.count}})</a>
		</div>
	    </div>
	    <div style="float:left;width:80%;">
		<div style="float:left">Highlight: <input type="text" id="highlight_input" v-model="highlight_query" v-on:keyup.enter="do_highlight" />
		<span v-on:click="do_highlight()" class="close_x"><span class="fas fa-search"></span></span>
		<span v-on:click="set_query(highlight_query)" class="close_x"><span class="fas fa-search-plus"></span></span>
		<span v-on:click="add_to_query('!('+highlight_query+')')" class="close_x"><span class="fas fa-search-minus"></span></span>
		</div><br /><br />
		<graph-index :nodeset="resultset" :highlight="highlightset" v-if="result.length > 0"></graph-index>
	    </div>
	</div>
	<div v-if="mode=='list'">
	    <node-index :nodeset="resultset" v-if="result.length > 0"></node-index>
	</div>
  </div>
</template>

<script>
 import Vue from 'vue'
 import { mapState } from 'vuex'

 export default {
     name: 'search',
     props: ['initquery'],
     computed: { 
	 ...mapState(['nodes']),
	 resultset: function() {
	     var ans = {};
	     for(var r of this.result) {
		 ans[r] = this.nodes[r];
	     }
	     return ans;
	 },
	 highlightset: function() {
	     var ans = {};
	     for(var r of this.highlight) {
		 ans[r] = true;
	     }
	     console.log(ans);
	     return ans;
	 },
	 best_nodes: function() {
	     var nodes_by_deg = [];
	     for(var n in this.resultset) {
		 var targets = {}
		 for(var label in this.nodes[n].edges.has) {
		     for(var target of this.nodes[n].edges.has[label]) {
			 if(target in this.resultset) {
			     targets[target] = true;
			 }
		     }
		 }
		 for(var label in this.nodes[n].edges.is) {
		     for(var target of this.nodes[n].edges.is[label]) {
			 if(target in this.resultset) {
			     targets[target] = true;
			 }
		     }
		 }
		 var deg = 0;
		 for(var t in targets) {
		     deg++;
		 }
		 nodes_by_deg.push({"node":n,"degree":deg});
	     }
	     nodes_by_deg.sort(function(a, b){ return b.degree - a.degree; });
	     return nodes_by_deg.slice(0,10);
	 },
	 best_edges: function() {
	     var edges_with_count = {};
	     for(var n in this.resultset) {
		 var count = 0;
		 // only need to count the has direction since the is direction will be accounted for when iterating over the has edges of the target
		 for(var label in this.nodes[n].edges.has) {
		     if(!(label in edges_with_count)) {
			 edges_with_count[label] = 0
		     }
		     for(var target of this.nodes[n].edges.has[label]) {
			 if(target in this.resultset) {
			     edges_with_count[label]++;
			 }
		     }
		 }
	     }
	     var edges_by_count = [];
	     for(var e in edges_with_count) {
		 edges_by_count.push({"edge":e,"count":edges_with_count[e]})
	     }
	     edges_by_count.sort(function(a, b){return b.count-a.count;});
	     return edges_by_count.slice(0,10);
	 },

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
     methods: {
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
	 run_search: function(qry) {
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
	     return Vue.category_search(q, this.nodes);
	 },
	 search: function() {
	     var query_result = this.run_search(this.query)
	     console.log(query_result);
	     if(query_result.length == 0) {
		 return;
	     }
	     if(query_result.length == 1) {
		 this.$router.push('/node/'+query_result[0]);
	     }
	     else {
		 this.result = query_result;
		 console.log("RES",this.result);
		 for(var i = 0; i < this.result.length; i++){
		     if(this.nodes[this.result[i]].name == this.query.trim()) {
			 this.$router.push('/node/'+this.result[i]);
			 break;
		     }
		 }
	     }
	 },
	 do_highlight: function() {
	     this.highlight = this.run_search(this.highlight_query);
	 }
     },
     mounted: function() {
	 this.query = this.initquery;
	 this.search();
     }
 }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

 .search-error {
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
</style>
