<template>
    <div id="histogram">
	<histogram-slider
	    style="margin: 10px auto"
	    :width="600"
	    :bar-height="50"
	    :bar-gap="2"
	    :data="hist_data"
	    :prettify="prettify"
	    :drag-interval="true"
	    :force-edges="false"
	    :colors="['#4facfe', '#00ccff']"
	    :min="data_min"
	    :max="data_max"
	    v-on:update="slid"
	    v-on:finish="slid"
	    v-on:change="slid"
	    v-if="hist_data.length > 0"></histogram-slider>
	<li v-for="n in sortedby(selected, date, true)">
	    <router-link :to="{name:'node', params: {id: n}}">{{graph.nodes[n].name}} <span v-if="'date' in graph.nodes[n]" style="font-size:.5em;color:#666;">{{graph.nodes[n].date}}</span></router-link>
	</li>

    </div>
</template>

<script>
 import { mapState } from 'vuex'
 import { mapGetters } from 'vuex'
 import "vue-histogram-slider/dist/histogram-slider.css";
 
 export default {
     name: 'timeline-display',
     props: ['prop'],
     data() {
	 return {
	     select_begin: new Date(1990,1,1),
	     select_end: new Date(3000,1,1),
	     prettify: function(ts) {
		 return new Date(ts).toLocaleDateString("en", {
		     year: "numeric",
		     month: "short",
		     day: "numeric"
		 });
	     }
	 };
     },
     
     computed: {
	 date_to_node: function() {
	     var ans = {"none":[]};
	     for(var n in this.subgraph.nodes) {
		 if("date" in this.subgraph.nodes[n]) {
		     var d = this.subgraph.nodes[n].date;
		     if(isNaN((new Date(d)).getTime())) {
			 ans["none"].push(n);
		     }
		     else {
			 if(!(d in ans)){ ans[d] = []; }
			 ans[d].push(n);
		     }
		 }
		 else{
		     ans["none"].push(n);
		 }
	     }
	     return ans;
	 },
	 hist_data: function() {
	     var ans = [];
	     for(var n in this.zoom) {
		 if("date" in this.subgraph.nodes[n]) {
		     var d = new Date(this.subgraph.nodes[n].date);
		     if(!isNaN(d.getTime())){ ans.push(d); }
		 }
	     }
	     console.log("DS",ans);
	     return ans;
	 },
	 data_min: function(){
	     if(this.hist_data.length == 0) return 0;
	     var ans = this.hist_data[0];
	     for(var d of this.hist_data) {
		 if(d < ans) ans = d;
	     }
	     return ans.valueOf();
	 },
	 data_max: function(){
	     if(this.hist_data.length == 0) return 0;
	     var ans = this.hist_data[0];
	     for(var d of this.hist_data) {
		 if(d > ans) ans = d;
	     }
	     return ans.valueOf();
	 },
	 selected: function() {
	     var ans = [];
	     for(var n in this.zoom) {
		 if("date" in this.subgraph.nodes[n]) {
		     var d = new Date(this.subgraph.nodes[n].date);
		     if(isNaN(d.getTime())){ continue; }
		     if(this.select_begin <= d && d <= this.select_end) {
			 ans.push(n);
		     }
		 }
	     }
	     var self = this;
	     ans.sort(function(a, b) {
		 var d1 = new Date(self.graph.nodes[a].date)
		 var d2 = new Date(self.graph.nodes[b].date)
		 return d2.valueOf()-d1.valueOf();
	     });
	     return ans;
	 },
	 ...mapState(['graph','subgraph','zoom']),
	 ...mapGetters(['sorted','sortedby'])
     },
     methods: {
	 slid: function(e) {
	     var ans = [];
	     this.select_begin = new Date(e.from);
	     this.select_end = new Date(e.to);
	     this.$nextTick(function() {
		 this.$emit("select", this.selected);
	     });
	 }
     },
     mounted () {
     }
 }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

 #working_set{
     padding-top:5px;
     padding-left:5px;
 }
 .flip-list-move {
     transition: transform 0.5s;
 }
 .no-move {
     transition: transform 0s;
 }
 .node_snippet {
     color:#ccc;
 }
 .ghost {
     opacity: 0.5;
     background: #c8ebfb;
 }
 .list-group {
     min-height: 20px;
 }
 .list-group-item {
     cursor: move;
 }
 .list-group-item i {
     cursor: pointer;
 }
 .badge_button {
     cursor:pointer;
     margin-right:5px;
     display: inline-block;
     min-width: 10px;
     max-width: 10%;
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
