<template>
    <div class="edge_display">
	<div v-for="(edges,label) in nodes[node].edges.has">
            <div v-for="edge in edges" v-if="nodes[edge.target].auto != 'yes'">
		has {{label}}: 
		<router-link :to="'./'+edge.target + ('dstloc' in edge && edge.dstloc != null ? '/' + edge.dstloc : '')">{{nodes[edge.target].name}}</router-link>
	    </div>
	</div> 
	<div v-for="(edges,label) in nodes[node].edges.is">
            <div v-for="edge in edges" v-if="nodes[edge.target].auto != 'yes'">
		is {{label}} of: 
		<router-link :to="'./'+edge.target + ('dstloc' in edge && edge.dstloc != null ? '/' + edge.dstloc : '')">{{nodes[edge.target].name}}</router-link>
	    </div>
	</div>
	<b>Auto-generated:</b>
	<div v-for="(edges,label) in nodes[node].edges.has">
            <div v-for="edge in edges" v-if="nodes[edge.target].auto == 'yes'">
		has {{label}}: 
		<router-link :to="'./'+edge.target + ('dstloc' in edge && edge.dstloc != null ? '/' + edge.dstloc : '')">{{nodes[edge.target].name}}</router-link>
	    </div>
	</div> 
	<div v-for="(edges,label) in nodes[node].edges.is">
            <div v-for="edge in edges" v-if="nodes[edge.target].auto == 'yes'">
		is {{label}} of: 
		<router-link :to="'./'+edge.target + ('dstloc' in edge && edge.dstloc != null ? '/' + edge.dstloc : '')">{{nodes[edge.target].name}}</router-link>
	    </div>
	</div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
     name: 'edge-display',
     props: ['node'],
     computed: mapState([
	 'nodes'
     ])
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
