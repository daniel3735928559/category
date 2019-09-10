<template>
  <div class="label_index">
      <ul v-if="mode == 'by' || mode == 'menu'">
	  <li v-for="n in sorted(headers)">
	      <router-link :to="{name:'node', params: {id: n}}">{{nodes[n].name}}</router-link>
	      <ul>
		  <li v-for="m in sorted(label_neighbours(n, label))">
		      <router-link :to="{name:'node', params: {id: m}}">{{nodes[m].name}}</router-link>
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
	 ]),
	 ...mapGetters(['sorted'])
     },
     methods: {
	 label_neighbours: function(n, label) {
	     var ans = [];
	     console.log("NL",n,label);
	     var tgts = this.nodes[n].edges[this.mode == 'menu' ? 'has' : 'is'][label];
	     for(var i = 0; i < tgts.length; i++) {
		 var m = tgts[i];
		 console.log(m);
		 if(m in this.nodeset) ans.push(m);
	     }
	     console.log(ans);
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
