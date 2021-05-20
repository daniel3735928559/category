<template>
    <div class="edge_display">
	Edges:
	<br />
	<div v-for="(edges, label) in graph.get_edges(node)">
            <div v-for="edgeid in edges['in']">
		is {{label}} of:
		<router-link :to="'./'+graph.edges[edgeid]['_from'] + ('dstloc' in graph.edges[edgeid] && graph.edges[edgeid].dstloc != null ? '/' + graph.edges[edgeid].dstloc : '')">{{graph.nodes[graph.edges[edgeid]['_from']].name}}</router-link>
	    </div>
            <div v-for="edgeid in edges['out']">
		has {{label}}:
		<router-link :to="'./'+graph.edges[edgeid]['_to'] + ('dstloc' in graph.edges[edgeid] && graph.edges[edgeid].dstloc != null ? '/' + graph.edges[edgeid].dstloc : '')">{{graph.nodes[graph.edges[edgeid]['_to']].name}}</router-link>
	    </div>
	</div>
	<!-- <div v-for="(edges, label) in graph.get_edges(node)">
             <div v-for="edgeid in edges['in']" v-if="graph.nodes[graph.edges[edgeid]['_from']].auto != 'yes'">
	     is {{label}} of: 
	     <router-link :to="'./'+graph.edges[edgeid]['_from'] + ('dstloc' in graph.edges[edgeid] && graph.edges[edgeid].dstloc != null ? '/' + graph.edges[edgeid].dstloc : '')">{{graph.nodes[graph.edges[edgeid]['_from']].name}}</router-link>
	     </div>
             <div v-for="edgeid in edges['out']" v-if="graph.nodes[graph.edges[edgeid]['_to']].auto != 'yes'">
	     has {{label}}: 
	     <router-link :to="'./'+graph.edges[edgeid]['_to'] + ('dstloc' in graph.edges[edgeid] && graph.edges[edgeid].dstloc != null ? '/' + graph.edges[edgeid].dstloc : '')">{{graph.nodes[graph.edges[edgeid]['_to']].name}}</router-link>
	     </div>
	     </div> --> 
	<!-- <div v-for="(edges,label) in graph.get_edges(node)['in']">
             <div v-for="edge in edges" v-if="graph.nodes[edge.target].auto != 'yes'">
	     is {{label}} of: 
	     <router-link :to="'./'+edge.target + ('dstloc' in edge && edge.dstloc != null ? '/' + edge.dstloc : '')">{{graph.nodes[edge.target].name}}</router-link>
	     </div>
	     </div>
	     <b>Auto-generated:</b>
	     <div v-for="(edges,label) in graph.get_edges(node)['in']">
             <div v-for="edge in edges" v-if="graph.get_edge(node).auto == 'yes'">
	     has {{label}}: 
	     <router-link :to="'./'+edge.target + ('dstloc' in edge && edge.dstloc != null ? '/' + edge.dstloc : '')">{{graph.nodes[edge.target].name}}</router-link>
	     </div>
	     </div> 
	     <div v-for="(edges,label) in graph.nodes[node].edges.is">
             <div v-for="edge in edges" v-if="graph.nodes[edge.target].auto == 'yes'">
	     is {{label}} of: 
	     <router-link :to="'./'+edge.target + ('dstloc' in edge && edge.dstloc != null ? '/' + edge.dstloc : '')">{{graph.nodes[edge.target].name}}</router-link>
	     </div>
	     </div> -->
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
     name: 'edge-display',
     props: ['node'],
     computed: mapState([
	 'graph'
     ]),
     created: function() {
	 console.log('ed',this.graph.get_edges(this.node));
     },
     methods: {
	 clickedNode: function(n) {
	     this.$emit("clickedNode",n);
	 }
     }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
