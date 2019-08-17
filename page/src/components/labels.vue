<template>
  <div class="label_index">
      <ul v-if="mode == 'by' || mode == 'menu'">
	  <li v-for="n in headers">
	      <router-link :to="{name:'node', params: {id: n}}">{{nodes[n].name}}</router-link>
	      <ul>
		  <li v-for="m in nodes[n].edges[mode == 'menu' ? 'has' : 'is'][label]" v-if="m in nodeset">
		      <router-link :to="{name:'node', params: {id: m}}">{{nodes[m].name}}</router-link>
		  </li>
	      </ul>
	  </li>
      </ul>
  </div>
</template>

<script>
 import { mapState } from 'vuex'
 
 export default {
     name: 'label-index',
     props: ['mode','label','nodeset'],
     computed: {
	 headers: function() {
	     if(this.mode == 'menu'){
		 var ans = []
		 for(var n in this.nodeset) {
		     if(this.nodes[n].edges['has'][this.label]){
			 ans.push(n);
		     }
		 }
		 return ans;
	     }
	     else if(this.mode == 'by') {
		 var ans = []
		 for(var n in this.nodeset) {
		     if(this.nodes[n].edges['is'][this.label]){
			 ans.push(n);
		     }
		 }
		 return ans;
	     }
	 },
	 ...mapState([
	     'nodes'
	 ])
     }
 }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
</style>
