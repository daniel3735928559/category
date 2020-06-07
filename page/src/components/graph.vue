<template>
    <div class="graph_index">
	<div id="graph_container"></div>
    </div>
</template>

<script>
 import {DirectedGraph} from 'graphology';
 import FA2 from 'graphology-layout-forceatlas2';
 import FA2Layout from 'graphology-layout-forceatlas2/worker';
 import WebGLRenderer from 'sigma/renderers/webgl';
 
 import { mapState } from 'vuex'
 import { mapGetters } from 'vuex'
 
 export default {
     name: 'graph-index',
     props: ['nodeset','highlight'],
     computed: {
	 num_nodes: function() {
	     var ans = 0;
	     for(var id in this.nodeset) {
		 ans++;
	     }
	     return ans;
	 },
	 graph_data: function() {
	     var ans = {nodes:[],edges:[]};
	     var edgeset = {};
	     for(var id in this.nodeset) {
		 console.log("NODE",id,name);
		 ans.nodes.push({"key":id,attributes:{"label":this.nodeset[id].name, "color":"#00f"}})
		 if(!(this.nodeset[id].edges)) continue;
		 for(var label in this.nodeset[id].edges.has) {
		     for(var edge of this.nodeset[id].edges.has[label]) {
			 var target = edge.target;
			 console.log("EDGE",edge,id,target);
			 if(target in this.nodeset) {
			     var eid = `${id}_${target}_${label}`;
			     if(eid in edgeset) {
				 edgeset[eid].attributes.label += ", " + label;
			     }
			     else {
				 edgeset[eid] = {"source":id,"target":target,attributes:{"label":label}};
			     }
			 }
		     }
		 }
	     }
	     for(var eid in edgeset) {
		 ans.edges.push(edgeset[eid]);
	     }
	     return ans;
	 },
	 ...mapState([
	     'nodes'
	 ]),
	 ...mapGetters(['sorted','sortedby'])
     },
     watch: {
	 nodeset: function(val) {
	     this.$nextTick(function () {
		 this.update_graph();
	     });
	 },
	 highlight: function(val) {
	     this.$nextTick(function () {
		 this.update_highlight();
	     });
	 }
     },
     methods: {
	 label_neighbours: function(n, label) {
	     var ans = [];
	     var tgts = this.nodes[n].edges[this.mode == 'menu' ? 'has' : 'is'][label];
	     for(var i = 0; i < tgts.length; i++) {
		 var m = tgts[i].target;
		 console.log(m);
		 if(m in this.nodeset) ans.push(m);
	     }
	     console.log(ans);
	     return ans;
	 },
	 update_graph: function() {
	     if(this.layout) {
		 this.layout.stop();
		 this.layout = null;
	     }
	     if(this.layout_timer) {
		 clearTimeout(this.layout_timer);
		 this.layout_timer = null;
	     }
	     this.graph.clear();
	     this.graph.import(this.graph_data);
	     this.graph.nodes().forEach(node => {
		 this.graph.mergeNodeAttributes(node, {
		     x: Math.random(),
		     y: Math.random(),
		     size: Math.max(3,Math.min(this.graph.degree(node), 8)),
		     color: node in this.highlight ? "#f00" : "#00f"
		 });
	     });
	     
	     var settings = FA2.inferSettings(this.graph);
	     console.log(settings);
	     settings.slowDown = 10;
	     //saneSettings.strongGravityMode = true;
	     //saneSettings.gravity = 3;
	     this.layout = new FA2Layout(this.graph, {settings: settings});
	     this.layout.start();
	     var self = this;
	     this.layout_timer = setTimeout(function(){self.layout.stop(); self.layout = null; self.layout_timer = null;}, 1*3*(this.num_nodes/100)*1000);
	 },
	 update_highlight: function() {
	     console.log("updating highlight",this.highlight);
	     this.graph.nodes().forEach(node => {
		 console.log("N",node, node in this.highlight);
		 this.graph.mergeNodeAttributes(node, {color: node in this.highlight ? "#f00" : "#00f"});
	     });
	     
	 }
     },
     mounted: function () {
	 this.$nextTick(function () {
	     console.log("initing graph container");
	     this.graph = new DirectedGraph({multi: true});
	     this.renderer = new WebGLRenderer(this.graph, document.getElementById("graph_container"), {
		 defaultEdgeType: 'arrow',
		 defaultEdgeColor: '#888',
		 renderEdgeLabels: true,
		 labelSize: 12,
		 labelGrid: {
		     cell: {
			 width: 40,
			 height: 20
		     },
		     renderedSizeThreshold: 1}});
	     const camera = this.renderer.getCamera();
	     const captor = this.renderer.getMouseCaptor();

	     // State
	     let draggedNode = null, dragging = false;

	     var self = this;
	     
	     this.renderer.on('downNode', e => {
		 dragging = true;
		 console.log("down",e);
		 draggedNode = e.node;
		 camera.disable();
	     });

	     this.renderer.on('clickNode', e => {
		 console.log("nav",e.node);
		 this.$router.push("/node/"+e.node);
	     });

	     captor.on('mouseup', e => {
		 dragging = false;
		 console.log("up",e);
		 draggedNode = null;
		 camera.enable();
	     });

	     captor.on('mousemove', e => {
		 if (!dragging)
		     return;

		 // Get new position of node
		 const pos = self.renderer.normalizationFunction.inverse(
		     camera.viewportToGraph(self.renderer, e.x, e.y)
		 );

		 self.graph.setNodeAttribute(draggedNode, 'x', pos.x);
		 self.graph.setNodeAttribute(draggedNode, 'y', pos.y);
	     });

	     this.update_graph();
	     this.update_highlight();
	 });
     }
 }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 .graph_index {
     height: 100%;
     min-height:100vh;
     width: 100%;
 }
 #graph_container {
     height: 100%;
     min-height:100vh;
     width: 100%;
     color: unset;
     border: 1px solid #ccc;
 }
</style>
