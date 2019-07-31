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

    var fetch_headers = new Headers();
    fetch_headers.append('pragma', 'no-cache');
    fetch_headers.append('cache-control', 'no-cache');
    
    var fetch_params = {
	method: 'GET',
	headers: fetch_headers,
    };

    var is_empty = function(obj) {
	for (var prop in obj) if (obj.hasOwnProperty(prop)) return false;
	return true;
    };
    
    var run_plugins = function(comp){
	for(var n in comp.nodes) {
	    var container = document.getElementById(n+'-container');
	    if(!container) continue;
	    var l = container.getElementsByTagName("script");
	    for(i = 0; i < l.length; i++){
		if(l[i].getAttribute("type") == "category/plugin"){
		    var p = l[i].getAttribute("lang");
		    if(p in plugins){
			console.log("RUN",p,l[i],i);
			plugins[p].run(comp, n, l[i], i);
		    }
		}
	    }
	    while(l.length > 0){
		l[0].parentNode.removeChild(l[0]);
	    }
	}
    }
    
    Vue.component('node-link', {
	template: `<a href="#" v-on:click="$emit('click',node)">{{name}}</a>`,
	props: ['node','name'],
    });

    Vue.component('node-index', {
	template: '#node-index',
	data() {
	    return {
		modes: {},
		current_label: 'all',
		num_nodes: 0,
		disconnected_nodes: [],
	    }
	},
	computed: {
	    labels: function() {
		// We build the data structure needed to prepare the index.
		// For each label, we create an entry like:
		// {
		//   count: how many nodes does this label cover
		//   covered: the set of nodes hit by the eddge
		//   has: the list of nodes that "have" this edge
		//   is: the list of nodes that "is" this edge
	        // }
		var all_labels = {}; 
		for(var n in this.nodes) {
		    for(var e in this.nodes[n].edges.has) {
			if(!(e in all_labels)) all_labels[e] = {'count':0, 'covered':{},'has':[],'is':[], 'mode':''};
			for(var t in this.nodes[n].edges.has[e]){
			    t = this.nodes[n].edges.has[e][t];
			    if(!(t in this.nodes)) continue;
			    if(!all_labels[e].covered[t]){
				// We haven't seen this node before
				all_labels[e].covered[t] = true;
				all_labels[e].count++;
			    }
			    if(all_labels[e].has.indexOf(n) == -1)
				all_labels[e].has.push(n);
			}
		    }
		    for(var e in this.nodes[n].edges.is){
			if(!(e in all_labels)) all_labels[e] = {'count':0, 'covered':{},'has':[],'is':[], 'mode':''};
			for(var t in this.nodes[n].edges.is[e]){
			    t = this.nodes[n].edges.is[e][t];
			    if(!(t in this.nodes)) continue;
			    if(!all_labels[e].covered[t]){
				// We haven't seen this node before
				all_labels[e].covered[t] = true;
				all_labels[e].count++;
			    }
			    if(all_labels[e].is.indexOf(n) == -1)
				all_labels[e].is.push(n);
			}
		    }
		}
		// Place the labels into a sorted list in order of
		// most edges to fewest edges (also, take this
		// opportunity to select the mode)
		var sorted_labels = [];
		for(var l in all_labels){
		    if(all_labels[l].count == 0) continue;
		    this.modes[l] = all_labels[l].is.length < all_labels[l].has.length ? 'by' : 'menu';
		    sorted_labels.push(l);
		}
		var discriminitivity = function(l){
		    return (all_labels[l].has.length-1)*(all_labels[l].is.length-1);
		}
		sorted_labels.sort(function(a, b){
		    da = discriminitivity(a);
		    db = discriminitivity(b);
		    if(da < db) return 1; // TODO: -1 or 1 for descending order?
		    if(da > db) return -1;
		    return 0;
		});
		// Prep a set of all nodes so we can mark which ones we've finished
		var finished_nodes = {};
		var nodes_count = 0;
		var finished_count = 0;
		this.disconnected_nodes = []
		for(var n in this.nodes) {
		    // Only count nodes with actual edges; we'll deal
		    // with disconnected ones separately
		    var disconnected = true;
		    for(var e in this.nodes[n].edges.has){
			for(var i = 0; i < this.nodes[n].edges.has[e].length; i++){
			    t = this.nodes[n].edges.has[e][i];
			    if(this.nodes[t]) disconnected = false;
			}
		    }
		    for(var e in this.nodes[n].edges.is){
			for(var i = 0; i < this.nodes[n].edges.is[e].length; i++){
			    t = this.nodes[n].edges.is[e][i];
			    if(this.nodes[t]) disconnected = false;
			}
		    }
		    if(disconnected){
			this.disconnected_nodes.push(n);
		    }
		    else {
			finished_nodes[n] = false;
			nodes_count++;
		    }
		}
		this.num_nodes = nodes_count + this.disconnected_nodes.length;

		// Now we want to collect the labels we will use for
		// indexing as well as figure out what modes to
		// display them in
		var best_labels = [];
		
		// Run through the labels
		for(var i = 0; i < sorted_labels.length; i++) {
		    best_labels.push(sorted_labels[i]);
		    // Mark all nodes covered as finished:
		    for(var n in sorted_labels[i].covered){
			if(!finished_nodes[n]){
			    finished_count++;
			    finished_nodes[n] = true;
			}
		    }
		    // We cut short the use of labels, but only if we
		    // have exhausted all the nodes under some label
		    // already _and_ only if we already have a lot of
		    // labels (> 20)
		    if(finished_count == nodes_count && best_labels.length > 20) {
			break;
		    }
		}

		// Now we are done!
		if(best_labels.length == 1) this.current_label = best_labels[0];
		else this.current_label = 'all';
		return best_labels;
	    }
	},
	props: ['nodes','node','edges'],
	methods: {
	    sorted_nodes: sorted_nodes,
	    opening: function(n, event) {
		this.$emit('open-snippet',n);
	    },
	    toggle_display: function(l) {
		this.current_label = l;
		this.$forceUpdate();
	    },
	    swap_mode: function(l) {
		this.modes[l] = (this.modes[l] == 'by' ? 'menu' : 'by');
		this.$forceUpdate();
	    }
	}
    });

    Vue.component('label-index', {
	template: '#label-index',
	data() {
	    return {
		test: "hi"
	    }
	},
	computed: {
	    headers: function() {
		if(this.mode == 'menu'){
		    ans = []
		    for(var n in this.nodes) {
			if(this.nodes[n].edges['has'][this.label]) ans.push(n);
		    }
		    return ans;
		}
		else if(this.mode == 'by') {
		    ans = []
		    for(var n in this.nodes) {
			if(this.nodes[n].edges['is'][this.label]) ans.push(n);
		    }
		    return ans;
		}
	    }
	},
	props: ['nodes', 'mode', 'label'],
	methods: { sorted_nodes: sorted_nodes }
    });

    Vue.component('edge-display', {
	template: '#edge-display',
	props: ['edges','nodes','node'],
	methods: { sorted_nodes: sorted_nodes }
    });
    
    var app = new Vue({
	el: '#cafeapp',
	data() {
	    return {
		mode: 'home',
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
	    fetch('out/metadata.json', fetch_params).then(function(response){
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
	    reload: function(){
		var self = this;
		fetch('out/metadata.json', fetch_params).then(function(response){
		    response.json().then(function(data){
			self.nodes = data;
			self.$forceUpdate();
		    });
		});
	    },
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
	    get_auto_node: function(node) {
		if(!("category" in this.nodes[node]["edges"]["is"])) return "";
		// Find all edges in category and provide 
		return "";
	    },
	    get_node: function(node, event){
		var self = this;
		if(node in self.node_data) return;
		fetch('out/'+node+'.html', fetch_params).then(function(response){
		    response.text().then(function(data){
			self.node_data[node] = response.status == 200 ? data : self.get_auto_node(node);
			self.$forceUpdate();
			Vue.nextTick(function() { run_plugins(self); });
		    });
		});
	    },
	    reload_node: function(node, event){
		delete this.node_data[node];
		this.get_node(node);
	    },
	    edit_node: function(node, event){
		var self = this;
		fetch('/edit/'+node, fetch_params).then(function(response){
		    response.text().then(function(data){
			console.log(data);
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
		if(!this.nodes[node]){
		    console.log("WARNING: Attempted to open non-existent node: ",node);
		    return;
		}
		this.get_node(node);
		if(this.mode == 'home' || this.mode == 'graph') this.mode = 'doc';
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
	    neighbours: function(node, event){
		var ans = {};
		for(var e in this.nodes[node].edges.has){
		    for(var i = 0; i < this.nodes[node].edges.has[e].length; i++){
			n = this.nodes[node].edges.has[e][i];
			ans[n] = this.nodes[n];
		    }
		}
		for(var e in this.nodes[node].edges.is){
		    for(var i = 0; i < this.nodes[node].edges.is[e].length; i++){
			n = this.nodes[node].edges.is[e][i];
			ans[n] = this.nodes[n];
		    }
		}
		return ans;
	    },
	    update_graph: function(){
		if(this.mode != 'graph') return;
		var self = this;
		Vue.nextTick(function() {
		    var container = document.getElementById('graph');
		    var options = {nodes: {
			shapeProperties: {
			    interpolation: false
			},
			layout: {improvedLayout: false}
		    }};
		    self.network = new vis.Network(container,
						   {nodes: self.graph_nodes(), edges: self.graph_edges()},
						   options);
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
