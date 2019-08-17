<template>
    <div class="edge_display">
	<div v-for="(targets,edge) in nodes[node].edges.has">
            <div v-for="target in targets" v-if="nodes[target].auto != 'yes'">
		has {{edge}}: 
		<router-link :to="'./'+target">{{nodes[target].name}}</router-link>
	    </div>
	</div> 
	<div v-for="(targets,edge) in nodes[node].edges.is">
            <div v-for="target in targets" v-if="nodes[target].auto != 'yes'">
		is {{edge}} of: 
		<router-link :to="'./'+target">{{nodes[target].name}}</router-link>
	    </div>
	</div>
	<b>Auto-generated:</b>
	<div v-for="(targets,edge) in nodes[node].edges.has">
            <div v-for="target in targets" v-if="nodes[target].auto == 'yes'">
		has {{edge}}: 
		<router-link :to="'./'+target">{{nodes[target].name}}</router-link>
	    </div>
	</div> 
	<div v-for="(targets,edge) in nodes[node].edges.is">
            <div v-for="target in targets" v-if="nodes[target].auto == 'yes'">
		is {{edge}} of: 
		<router-link :to="'./'+target">{{nodes[target].name}}</router-link>
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
