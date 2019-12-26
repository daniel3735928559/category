<template>
  <div class="label_index">
      <ul v-if="mode == 'by' || mode == 'menu'">
	  <li v-for="n in sortedby(headers, sortkey, sortasc)">
	      <router-link :to="{name:'node', params: {id: n}}">{{nodes[n].name}} <span v-if="'date' in nodes[n]" style="font-size:.5em;color:#666;">{{nodes[n].date}}</span></router-link>
	      <ul>
		  <li v-for="m in sortedby(label_neighbours(n, label), sortkey, sortasc)">
		      <router-link :to="{name:'node', params: {id: m}}">{{nodes[m].name}} <span v-if="'date' in nodes[m]" style="font-size:.5em;color:#666;">{{nodes[m].date}}</span></router-link>
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
	 ...mapGetters(['sorted','sortedby'])
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
