var sorted_nodes = function(nodes, event){
    var ans = nodes.slice();
    var self = this;
    ans.sort(function(a,b){
	if('index' in self.nodes[a] && 'index' in self.nodes[b]) return self.nodes[a].index - self.nodes[b].index;
	if('date' in self.nodes[a] && 'date' in self.nodes[b]) return self.nodes[a].date.localeCompare(self.nodes[b].date);
	return self.nodes[a].name.localeCompare(self.nodes[b].name);
    });
    return ans;
};

window.onload = function(){
    var plugins = {"math":new MathPlugin(),
		   "query":new QueryPlugin(),
		   "video":new VideoPlugin(),
		   "link":new LinkPlugin(),
		   "slideshow":new SlideshowPlugin()};
    //Guppy.init({"path":"/node_modules/guppy-js","symbols":"/node_modules/guppy-js/sym/symbols.json"});

    var run_plugins = function(comp){
	for(var n in comp.nodes) {
	    var container = document.getElementById(n+'-container');
	    if(!container) continue;
	    var l = container.getElementsByTagName("script");
	    for(i = 0; i < l.length; i++){
		if(l[i].getAttribute("type") == "category/plugin"){
		    var p = l[i].getAttribute("lang");
		    if(p in plugins){
			console.log("RUN",p);
			plugins[p].run(comp, n, l[i]);
		    }
		}
	    }
	    while(l.length > 0){
		l[0].parentNode.removeChild(l[0]);
	    }
	    
	    // last resort: run all plugins on nothing
	    for(var p in plugins){
		plugins[p].run();
	    }
	}
    }
    
    Vue.component('node-link', {
	template: `<a href="#" v-on:click="$emit('click',node)">{{name}}</a>`,
	props: ['node','name'],
    });

    Vue.component('edge-display', {
	template: `<div class="edge_display">
                   <div v-for="(targets,edge) in edges.has">
                      <div v-for="target in sorted_nodes(targets)" v-if="nodes[target].auto != 'yes'"><a href="#" v-on:click="$emit('edgeclick',edge+' of: '+nodes[node].name)">has {{edge}}: </a> <node-link v-on:click="$emit('click',target)" :name="nodes[target].name" :node="target" /></div>
                   </div> 
                   <div v-for="(targets,edge) in edges.is">
                      <div v-for="target in sorted_nodes(targets)" v-if="nodes[target].auto != 'yes'"><a href="#" v-on:click="$emit('edgeclick','has '+edge+': '+nodes[node].name)">is {{edge}} of: </a> <node-link v-on:click="$emit('click',target)" :name="nodes[target].name" :node="target" /></div>
                   </div>
                   <b>Auto-generated:</b>
                   <div v-for="(targets,edge) in edges.has">
                      <div v-for="target in sorted_nodes(targets)" v-if="nodes[target].auto == 'yes'"><a href="#" v-on:click="$emit('edgeclick',edge+' of: '+nodes[node].name)">has {{edge}}: </a> <node-link v-on:click="$emit('click',target)" :name="nodes[target].name" :node="target" /></div>
                   </div> 
                   <div v-for="(targets,edge) in edges.is">
                      <div v-for="target in sorted_nodes(targets)" v-if="nodes[target].auto == 'yes'"><a href="#" v-on:click="$emit('edgeclick','has '+edge+': '+nodes[node].name)">is {{edge}} of: </a> <node-link v-on:click="$emit('click',target)" :name="nodes[target].name" :node="target" /></div>
                   </div>
                   </div>`,
	props: ['edges','nodes','node'],
	methods: { sorted_nodes: sorted_nodes }
    });
    
    var app = new Vue({
	el: '#cafeapp',
	data() {
	    return {
		mode: 'list',
		query: '',
		node_data: {},
		nodes: {},
		working_set: [],
		query_results: [],
		error: '',
		main_doc: '',
		network: false
		// nodes: {'A': {'name':'APPLE','edges':{'has':{'location':['B']}}},
		// 	   'B': {'name':'BANANA','edges':{'is':{'location':['A']},'has':{'something':['C']}}},
		// 	   'C': {'name':'CHERRY','edges':{'is':{'something':['B']}}}},
		// working_set: ['A','B'],
		// query_results: ['A','B','C'],
		// main_doc: 'B'
	    };
	},
	mounted: function(){
	    var self = this;
	    fetch('data/metadata.json').then(function(response){
		response.json().then(function(data){
		    self.working_set = [];
		    self.query_results = [];
		    // for(var x in data){
		    // 	self.query_results.push(x);
		    // 	self.main_doc = x;
		    // }
		    self.nodes = data;
		    //console.log(JSON.stringify(self.nodes['89fa72baeb81db041ceceb3b58222baae1734cf8cf0573a683258e2fb5bee2d3']));
		    self.query = 'is category';
		    self.search()
		});
	    });
	},
	methods: {
	    set_query: function(q, event){
		this.query = q;
		this.search();
	    },
	    search: function(event){
		if(this.query.length == 0) this.query = "*";
		try{
		    var q = query.parse(this.query);
		    this.error = '';
		}
		catch(e){
		    this.error = e.toString();
		}
		var res = search(q, this.nodes);
		this.query_results = res;
		if(this.mode == 'graph')
		    this.update_graph();
	    },
	    sorted_nodes: sorted_nodes,
	    get_node: function(node, event){
		var self = this;
		if(node in self.node_data) return;
		fetch('data/'+node+'.html').then(function(response){
		    response.text().then(function(data){
			self.node_data[node] = response.status == 200 ? data : '';
			self.$forceUpdate();
			Vue.nextTick(function() { run_plugins(self); });
		    });
		});
	    },
	    graph_nodes: function(event) {
		var ans = [];
		for(var i = 0; i < this.query_results.length; i++){
		    var n = this.query_results[i];
		    ans.push({"id":n, "label":this.nodes[n].name});
		}
		return new vis.DataSet(ans);
	    },
	    graph_edges: function(event) {
		var ans = [];
		for(var j = 0; j < this.query_results.length; j++){
		    var n = this.query_results[j];
		    for(var e in this.nodes[n].edges.has){
			for(var i = 0; i < this.nodes[n].edges.has[e].length; i++){
			    var t = this.nodes[n].edges.has[e][i];
			    ans.push({"from":n,
				      "to":t,
				      "arrows":"to",
				      "label":e,
				      "font":{"align":"top"}});
			}
		    }
		}
		return new vis.DataSet(ans);
	    },
	    open_snippet: function(node, event){
		var self = this;
		this.get_node(node);
		this.main_doc = node;
		idx = this.working_set.indexOf(node);
		if(idx < 0) this.working_set.unshift(node);
		else {
		    this.working_set.splice(idx,1);
		    this.working_set.unshift(node);
		}
		Vue.nextTick(function() { run_plugins(self); });
	    },
	    goto_snippet: function(node, event){
		var self = this;
		if(this.mode == 'list') this.open_snippet(node, event);
		else if(this.mode == 'doc') this.main_doc = node;
		Vue.nextTick(function() { run_plugins(self); });
	    },
	    minimise_snippet: function(node, event){
		idx = this.working_set.indexOf(node);
		if(idx >= 0) {
		    this.working_set.splice(idx,1);
		    this.working_set.push(node);
		}
		Vue.nextTick(function() { run_plugins(self); });
	    },
	    close_snippet: function(node, event){
		var self = this;
		idx = this.working_set.indexOf(node);
		if(idx >= 0) this.working_set.splice(idx,1);
		Vue.nextTick(function(){ run_plugins(self); });
	    },
	    view_doc: function(node, event){
		var self = this;
		this.get_node(node);
		this.main_doc = node;
		this.set_mode('doc');
		Vue.nextTick(function() { run_plugins(self); });
	    },
	    set_mode: function(mode, event){
		var self = this;
		this.mode = mode;
		if(mode == 'graph'){
		    this.update_graph();
		}
		else {
		    if(this.network){
			this.network.destroy();
			this.network = false;
		    }
		    Vue.nextTick(function() { run_plugins(self); });
		}
	    },
	    update_graph: function(){
		if(this.mode != 'graph') return;
		var self = this;
		Vue.nextTick(function() {
		    var container = document.getElementById('graph');
		    self.network = new vis.Network(container,
						  {nodes: self.graph_nodes(), edges: self.graph_edges()},
						  {});
		    self.network.on("doubleClick", function(params){
			if(params.nodes.length > 0){
			    self.open_snippet(params.nodes[0]);
			    self.set_mode('doc');
			}
		    });
		});
	    }
	}
    });
}
