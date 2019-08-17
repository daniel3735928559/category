<template>
    <div class="node-index-container">
	<div class="node-index-menu">
            <div v-on:click="toggle_display('all')" v-bind:class="'node-index-menu-item ' + (current_label == 'all' ? 'node-index-menu-selected' : '')">
		(all)
            </div>
            <div v-on:click="toggle_display(l)" v-bind:class="'node-index-menu-item ' + (current_label == l ? 'node-index-menu-selected' : '')" v-for="l in labeldata.labels">
		{{l}}
            </div>
            <div v-on:click="toggle_display('unlinked')" v-bind:class="'node-index-menu-item ' + (current_label == 'unlinked' ? 'node-index-menu-selected' : '')" v-if="labeldata.disconnected && labeldata.disconnected.length > 0">
		(unlinked)
            </div>
	</div>
	
	<!-- List of edges associated with current_label -->
	<div class="node-index-list" v-if="current_label != 'all' && current_label != 'unlinked'">
            <h3>{{modes[current_label] == 'by' ? 'By ' + current_label : 'Has ' + current_label}} <span style="cursor:pointer;font-size:.5em;" v-on:click="swap_mode(current_label)"><span class="fas fa-random"></span></span></h3>
            <label-index :label="current_label" :mode="modes[current_label]" />
	</div>
	
	<!-- List of all edges -->
	<div class="node-index-list" v-if="current_label == 'all'">
            <div v-if="node">
		<h3>All edges</h3>
    		<edge-display :node="node"></edge-display>
            </div>
            <div v-if="!node">
		<h3>All nodes</h3>
    		<ul>
		    <li v-for="(node,n) in nodeset">
			<router-link :to="'/node/'+n">{{node.name}}</router-link>
		    </li>
    		</ul>
            </div>
	</div>
	
	<!-- List of unlinked nodes -->
	<div class="node-index-list" v-if="current_label == 'unlinked'">
            <h3>Unlinked</h3>
            <ul>
    		<li v-for="n in labeldata.disconnected">
    		    <router-link :to="'/node/'+n">{{nodes[n].name}}</router-link>
    		</li>
            </ul>
	</div>
	
	<div class="spacer" style="clear: both;"></div>
    </div>
</template>

<script>
 import { mapState } from 'vuex'
 
 export default {
     name: 'node-index',
     props: ['nodeset','node'],
     data() {
	 return {
	     'current_label': 'blah',
	     'modes': {}
	 }
     },
     computed: {
	 labeldata: function() {
	     // The result is:
	     // {
	     //   disconnected: [],
	     //   labels: {},
	     // }

	     var disconnected_nodes = [];
	     var modes = {};
	     var best_label = ''
	     
	     // We build the data structure needed to prepare the index.
	     // For each label, we create an entry like:
	     // {
	     //   count: how many nodes does this label cover
	     //   covered: the set of nodes hit by the eddge
	     //   has: the list of nodes that "have" this edge
	     //   is: the list of nodes that "is" this edge
	     // }
	     var all_labels = {}; 
	     for(var n in this.nodeset) {
		 for(var e in this.nodeset[n].edges.has) {
		     if(!(e in all_labels)) all_labels[e] = {'count':0, 'covered':{},'has':[],'is':[], 'mode':''};
		     for(var t in this.nodeset[n].edges.has[e]){
			 t = this.nodeset[n].edges.has[e][t];
			 if(!(t in this.nodeset)) continue;
			 if(!all_labels[e].covered[t]){
			     // We haven't seen this node before
			     all_labels[e].covered[t] = true;
			     all_labels[e].count++;
			 }
			 if(all_labels[e].has.indexOf(n) == -1)
			     all_labels[e].has.push(n);
		     }
		 }
		 for(var e in this.nodeset[n].edges.is){
		     if(!(e in all_labels)) all_labels[e] = {'count':0, 'covered':{},'has':[],'is':[], 'mode':''};
		     for(var t in this.nodeset[n].edges.is[e]){
			 t = this.nodeset[n].edges.is[e][t];
			 if(!(t in this.nodeset)) continue;
			 if(!all_labels[e].covered[t]){
			     // We haven't seen this node before
			     all_labels[e].covered[t] = true;
			     all_labels[e].count++;
			 }
			 if(all_labels[e].is.indexOf(n) == -1)
			     all_labels[e].is.push(n);
		     }
		 }
	     }
	     // Place the labels into a sorted list in order of
	     // most edges to fewest edges (also, take this
	     // opportunity to select the mode)
	     var sorted_labels = [];
	     for(var l in all_labels){
		 if(all_labels[l].count == 0) continue;
		 modes[l] = all_labels[l].is.length < all_labels[l].has.length ? 'by' : 'menu';
		 sorted_labels.push(l);
	     }
	     var discriminitivity = function(l){
		 return (all_labels[l].has.length-1)*(all_labels[l].is.length-1);
	     }
	     sorted_labels.sort(function(a, b){
		 var da = discriminitivity(a);
		 var db = discriminitivity(b);
		 if(da < db) return 1; // TODO: -1 or 1 for descending order?
		 if(da > db) return -1;
		 return 0;
	     });
	     // Prep a set of all nodes so we can mark which ones we've finished
	     var finished_nodes = {};
	     var nodes_count = 0;
	     var finished_count = 0;
	     for(var n in this.nodeset) {
		 // Only count nodes with actual edges; we'll deal
		 // with disconnected ones separately
		 var disconnected = true;
		 for(var e in this.nodeset[n].edges.has){
		     for(var i = 0; i < this.nodeset[n].edges.has[e].length; i++){
			 t = this.nodeset[n].edges.has[e][i];
			 if(this.nodeset[t]) disconnected = false;
		     }
		 }
		 for(var e in this.nodeset[n].edges.is){
		     for(var i = 0; i < this.nodeset[n].edges.is[e].length; i++){
			 t = this.nodeset[n].edges.is[e][i];
			 if(this.nodeset[t]) disconnected = false;
		     }
		 }
		 if(disconnected){
		     disconnected_nodes.push(n);
		 }
		 else {
		     finished_nodes[n] = false;
		     nodes_count++;
		 }
	     }

	     // Now we want to collect the labels we will use for
	     // indexing as well as figure out what modes to
	     // display them in
	     var best_labels = [];
	     
	     // Run through the labels
	     for(var i = 0; i < sorted_labels.length; i++) {
		 best_labels.push(sorted_labels[i]);
		 // Mark all nodes covered as finished:
		 for(var n in sorted_labels[i].covered){
		     if(!finished_nodes[n]){
			 finished_count++;
			 finished_nodes[n] = true;
		     }
		 }
		 // We cut short the use of labels, but only if we have
		 // exhausted all the connected nodes, each under at
		 // least one label already _and_ only if we already
		 // have a lot of labels (> 20)
		 if(finished_count == nodes_count && best_labels.length > 20) {
		     break;
		 }
	     }

	     // Now we are done!
	     if(best_labels.length == 1) best_label = best_labels[0];
	     else best_label = 'all';
	     this.current_label = best_label;
	     this.modes = modes;
	     return {
		 'disconnected': disconnected_nodes,
		 'labels': best_labels
	     };
	 },
	 ...mapState(['nodes'])
     },
     methods: {
	 toggle_display: function(l) {
 	     this.current_label = l;
	 },
	 swap_mode: function(l) {
 	     this.modes[l] = (this.modes[l] == 'by' ? 'menu' : 'by');
 	     //this.$forceUpdate();
	 },

     }
 }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

 .node-index-menu {
     width: 24%;
     float:left;
 }

 .node-index-menu-item {
     width: 90%;
     border-radius:8px;
     padding:5px;
     margin:2px;
     cursor:pointer;
     background-color: #ccf !important;
 }


 .node-index-menu-selected {
     background-color: #99c !important;
 }

 .node-index-list {
     width: 72%;
     float:left;
 }
</style>
