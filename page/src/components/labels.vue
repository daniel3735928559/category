<template>
  <div class="label_index">
      <ul v-if="mode == 'by' || mode == 'menu'">
	  <li v-for="n in sortedby(headers, sortkey, sortasc)">
	      <router-link :to="{name:'node', params: {id: n}}">{{nodeset[n].name}} <span v-if="'date' in nodeset[n]" style="font-size:.5em;color:#666;">{{nodeset[n].date}}</span></router-link>
	      <ul>
		  <li v-for="m in sortedby(label_neighbours(n, label), sortkey, sortasc)">
		      <router-link :to="{name:'node', params: {id: m}}">{{nodeset[m].name}} <span v-if="'date' in nodeset[m]" style="font-size:.5em;color:#666;">{{nodeset[m].date}}</span></router-link>
		  </li>
	      </ul>
	  </li>
      </ul>
  </div>
</template>

<script>
 import { mapState } from 'vuex'
 import { mapGetters } from 'vuex'
 
 export default {
     name: 'label-index',
     props: ['mode','label','nodeset','sortkey','sortasc'],
     computed: {
	 headers: function() {
	     var dir = this.mode == "menu" ? 'out' : 'in';
	     var ans = [];
	     for(var n in this.nodeset) {
		 if(this.label in this.subgraph.index_edge_label[n] && this.subgraph.index_edge_label[n][this.label][dir].length > 0) {
		     ans.push(n);
		 }
	     }
	     return ans;
	 },
	 ...mapState(['graph','subgraph']),
	 ...mapGetters(['sorted','sortedby'])
     },
     methods: {
	 label_neighbours: function(n, label) {
	     // return the nodes adjacent to n via the given label
	     var dir = this.mode == "menu" ? 'out' : 'in';
	     var ans = [];
	     for(var eid of this.subgraph.index_edge_label[n][label][dir]) {
		 ans.push(this.subgraph.edges[eid][this.mode == "menu" ? "_to" : "_from"]);
	     }
	     return ans;
	 }
     }
 }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
</style>
