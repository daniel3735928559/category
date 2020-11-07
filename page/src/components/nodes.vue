<template>
    <div class="node-index-container">
	<div class="node-index-menu">
            <div v-on:click="toggle_display('all')" v-bind:class="'node-index-menu-item ' + (current_label == 'all' ? 'node-index-menu-selected' : '')" v-if="num_nodes > 0">
		(all)
            </div>
            <div v-on:click="toggle_display(l)" v-bind:class="'node-index-menu-item ' + (current_label == l ? 'node-index-menu-selected' : '')" v-for="l in labeldata.labels">
		{{l}}
            </div>
            <div v-on:click="toggle_display('unlinked')" v-bind:class="'node-index-menu-item ' + (current_label == 'unlinked' ? 'node-index-menu-selected' : '')" v-if="labeldata.disconnected && labeldata.disconnected.length > 0 && labeldata.disconnected.length < num_nodes">
		(unlinked)
            </div>
	</div>
	
	<!-- List of edges associated with current_label -->
	<div class="node-index-list" v-if="current_label != 'all' && current_label != 'unlinked'">
            <h3>{{modes[current_label] == 'by' ? 'By ' + current_label : 'Has ' + current_label}} <span style="cursor:pointer;font-size:.5em;" v-on:click="swap_mode(current_label)"><span class="fas fa-random"></span></span>
		<span v-if="!sort_is_ascending" style="margin-left:1em;float:right;cursor:pointer;font-size:.5em;" v-on:click="sortasc(true)">
		    <span class="fas fa-long-arrow-alt-up"></span>
		</span>
		<span v-if="sort_is_ascending" style="margin-left:1em;float:right;cursor:pointer;font-size:.5em;" v-on:click="sortasc(false)">
		    <span class="fas fa-long-arrow-alt-down"></span>
		</span>
		<span v-bind:class="{'sortkey_selected': sort_method == 'name'}" style="margin-left:1em;float:right;cursor:pointer;font-size:.5em;" v-on:click="sortby('name')">name</span>
		<span v-bind:class="{'sortkey_selected': sort_method == 'date'}" style="margin-left:1em;float:right;cursor:pointer;font-size:.5em;" v-on:click="sortby('date')">date</span>
		<span style="margin-left:1em;float:right;font-size:.5em;">Sort by:</span>
	    </h3>
            <label-index :label="current_label" :mode="modes[current_label]" :nodeset="nodeset" v-bind:sortkey="sort_method" v-bind:sortasc="sort_is_ascending" />
	</div>
	
	<!-- List of all edges -->
	<div class="node-index-list" v-if="current_label == 'all' && num_nodes > 0">
            <div v-if="node">
		<h3>All edges</h3>
    		<edge-display :node="node"></edge-display>
            </div>
            <div v-if="!node">
		<h3>All nodes
		    <span v-if="!sort_is_ascending" style="margin-left:1em;float:right;cursor:pointer;font-size:.5em;" v-on:click="sortasc(true)">
			<span class="fas fa-long-arrow-alt-up"></span>
		    </span>
		    <span v-if="sort_is_ascending" style="margin-left:1em;float:right;cursor:pointer;font-size:.5em;" v-on:click="sortasc(false)">
			<span class="fas fa-long-arrow-alt-down"></span>
		    </span>
		    <span v-bind:class="{'sortkey_selected': sort_method == 'name'}" style="margin-left:1em;float:right;cursor:pointer;font-size:.5em;" v-on:click="sortby('name')">name</span>
		    <span v-bind:class="{'sortkey_selected': sort_method == 'date'}" style="margin-left:1em;float:right;cursor:pointer;font-size:.5em;" v-on:click="sortby('date')">date</span>
		    <span style="margin-left:1em;float:right;font-size:.5em;">Sort by:</span>
		</h3>
    		<ul>
		    <li v-for="n in sorted_nodes">
			<router-link :to="'/node/'+n">{{nodeset[n].name}} <span v-if="'date' in nodeset[n]" style="font-size:.5em;color:#666;">{{nodeset[n].date}}</span></router-link>
		    </li>
    		</ul>
            </div>
	</div>
	
	<!-- List of unlinked nodes -->
	<div class="node-index-list" v-if="current_label == 'unlinked'">
            <h3>Unlinked</h3>
            <ul>
    		<li v-for="n in sorted(labeldata.disconnected)">
    		    <router-link :to="'/node/'+n">{{nodeset[n].name}}</router-link>
    		</li>
            </ul>
	</div>
	
	<div class="spacer" style="clear: both;"></div>
    </div>
</template>

<script>
 import { mapState } from 'vuex'
 import { mapGetters } from 'vuex'
 
 export default {
     name: 'node-index',
     props: ['nodeset','node'],
     data() {
	 return {
	     'current_label': 'blah',
	     'modes': {},
	     'sort_method': 'name',
	     'sort_is_ascending': true
	 }
     },
     computed: {
	 sorted_nodes: function() {
	     var ans = [];
	     for(var n in this.subgraph.nodes) {
		 ans.push(n);
	     }
	     return this.sortedby(ans, this.sort_method, this.sort_is_ascending)
	 },
	 nodelist: function() {
	     var ans = [];
	     for(var n in this.nodeset) {
		 ans.push(n);
	     }
	     return ans;
	 },
	 num_nodes: function() {
	     var ans = 0;
	     for(var n in this.nodeset) ans++;
	     return ans;
	 },
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
	     for(var edgeid in this.subgraph.edges) {
		 var edge = this.subgraph.edges[edgeid];
		 // Make sure both ends of this edge are in the nodeset
		 var lab = edge["label"];
		 
		 if(!(lab in all_labels)) {
		     all_labels[lab] = {
			 'num_covered':0,
			 'num_in':0, 
			 'num_out':0,
			 'covered':{}, // set of nodes connected to this label
			 'in':{}, // set of nodes with this label as an outbound edge
			 'out':{}, // set of nodes with this label as an inbound edge
			 'mode':'' // whether displaying by source node or target node is more useful
		     };
		 }
		 var src = edge["_from"];
		 var tgt = edge["_to"];
		 
		 // Increment the counts as appropriate:
		 if(!(all_labels[lab].covered[src])) all_labels[lab].num_covered++;
		 if(!(all_labels[lab].covered[tgt])) all_labels[lab].num_covered++;
		 if(!(all_labels[lab]['in'][tgt])) all_labels[lab].num_in++;
		 if(!(all_labels[lab]['out'][src])) all_labels[lab].num_out++;
		 
		 // Then add the src and target to the appropriate nodesets:
		 all_labels[lab].covered[src] = true;
		 all_labels[lab].covered[tgt] = true;
		 all_labels[lab]['in'][tgt] = true;
		 all_labels[lab]['out'][src] = true;
	     }

	     // Place the labels into a sorted list in order of
	     // most edges to fewest edges (also, take this
	     // opportunity to select the mode)
	     var sorted_labels = [];
	     for(var l in all_labels){
		 if(all_labels[l].num_covered == 0) continue;
		 modes[l] = all_labels[l].num_in < all_labels[l].num_out ? 'by' : 'menu';
		 sorted_labels.push(l);
	     }
	     var discriminitivity = function(l){
		 // Intuitively, we are going to arrange the |count|
		 // nodes in a rectangle with |has| or |is| columns. This
		 // is the most "discriminitave" if the rectangle is a
		 // square, i.e. |has| or |is| is close to sqrt(|count|).
		     
		 // However, we also want to normalise for number of
		 // nodes, to a point, and we want to penalise being too close to the useless values of 

		 var N = all_labels[l].num_covered;
		 var tgt = Math.sqrt(N);
		 var scores = [];
		 var ns = [all_labels[l].num_out, all_labels[l].num_in]
		 for(var i = 0; i < 2; i++) {
		     var n = ns[i];
		     var tgt_score = 1-(tgt-n)*(tgt-n)/(N*N); // This rewards being close to sqrt(N) -- bigger is better
		     var avoid_ends_score = Math.min(0, (n-1)*(N/2-n)/(N*N)); // This penalises being too close to 1 or N/2--bigger is better
		     var nodes_score = Math.log(N+1); // This factors in number of nodes a little (containing more is better than few, but only meaningfully so if an order of magnitude more)
		     var score = nodes_score*(tgt_score + avoid_ends_score);
		     
		     console.log("D",l,i,tgt_score, avoid_ends_score, nodes_score,score)   
		     scores.push(score);
		 }
		 return Math.max(scores[0], scores[1]);
	     }
	     console.log("ALAL",all_labels);
	     sorted_labels.sort(function(a, b){ return discriminitivity(b) - discriminitivity(a); });
	     
	     // Prep a set of all nodes so we can mark which ones we've finished
	     var finished_nodes = {};
	     var nodes_count = 0;
	     var finished_count = 0;
	     for(var n in this.nodeset) {
		 // Only count nodes with actual edges; we'll deal
		 // with disconnected ones separately
		 var disconnected = true;
		 // If there's an edge 
		 for(var lab in this.subgraph.index_edge_label[n]) {
		     disconnected = false;
		     break;
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
	 ...mapState(['graph','subgraph']),
	 ...mapGetters(['sorted','sortedby'])
     },
     methods: {
	 sortasc: function(ascending) {
	     Vue.set(this, 'sort_is_ascending', ascending);
	 },
	 sortby: function(key) {
	     Vue.set(this, 'sort_method', key);
	 },
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

 .sortkey_selected {
     text-decoration:underline;
 }
 
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
