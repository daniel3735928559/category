import Vue from 'vue'
import Vuex from 'vuex'
import CatGraph from './graph/graph.mjs'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
	query: 'is category',
	ready: false,
	current: '',
	graph: {},
	subgraph: {},
	zoom: {},
	highlights: {},
	graph_history: {},
	recent: [],
	node_data: {},
	plugin_data: {}
    },
    getters: {
	neighbours: state => node_id => {
	    let node = state.graph.nodes[node_id];
	    var ans = {};
	    for(var d in node.edges) {
		for(var l in node.edges[d]) {
		    for(var edge of node.edges[d][l]) {
			ans[edge.target] = state.graph.nodes[edge.target];
		    }
		}
	    }
	    return ans;
	},
	sorted: state => nodelist => {
	    return nodelist.sort(function(a, b){
		if('index' in state.graph.nodes[a] && 'index' in state.graph.nodes[b]) {
		    return parseInt(state.graph.nodes[a].index) - parseInt(state.graph.nodes[b].index);
		}
		else if('date' in state.graph.nodes[a] && 'date' in state.graph.nodes[b]) {
		    return state.graph.nodes[a].date.localeCompare(state.graph.nodes[b].date);
		}
		else return state.graph.nodes[a].name.localeCompare(state.graph.nodes[b].name);
	    });
	},
	sortedby: state => (nodeset, nodelist, key, ascending) => {
	    var ans = nodelist.sort(function(a, b){
		var res = 0;
		if (key in nodeset[a] && key in nodeset[b]) {
		    //console.log("arr by",key);
		    if (key == 'index') {
			var res = parseInt(nodeset[a].index) - parseInt(nodeset[b].index)
			return ascending ? res : -res;
		    }
		    var res = nodeset[a][key].localeCompare(nodeset[b][key]);
		    return ascending ? res : -res;
		} // Place things without properties 
		else if (!(key in nodeset[a]) && key in nodeset[b]) {
		    return 1;
		}
		else if ((key in nodeset[a]) && !(key in nodeset[b])) {
		    return -1;
		}
		return ascending ? res : -res;
	    });
	    console.log(ans);
	    return ans;
	}
    }, 
    mutations: {
	CACHE: (state, nodes) => {
	    //node_data = plugin_process(state, node_id, node_data);
	    console.log('caching',nodes);
	    if(state.ready) {
		for(var node_id in nodes){
		    if(state.graph.nodes[node_id].auto) {
			state.graph.nodes[node_id].snippet = "[index node]";
		    }
		    state.node_data[node_id] = nodes[node_id];
		}
	    }
	},
	PLUGIN_DATA_STORE: (state, data) => {
	    //node_data = plugin_process(state, node_id, node_data);
	    console.log('storing',data);
	    for(var plugin_id in data){
		state.plugin_data[plugin_id] = data[plugin_id];
	    }
	},
	CLEAR_HISTORY: state => {
	    state.recent = [];
	},
	REMOVE_FROM_HISTORY: (state, node_id) => {
	    var idx = -1;
	    for(var i = 0; i < state.recent.length; i++) {
		if(state.recent[i].id == node_id) {
		    idx = i;
		    break;
		}
	    }
	    if(idx >= 0) state.recent.splice(idx,1);
	},
	GO: (state, node_id) => {
	    console.log('historicising');
	    console.log(state.recent);
	    state.current = node_id;
	    var idx = -1;
	    for(var i = 0; i < state.recent.length; i++) {
		if(state.recent[i].id == node_id) {
		    idx = i;
		    break;
		}
	    }
	    if(idx < 0) {
		state.recent.unshift({"id":node_id,"fixed":false});
	    }
	    // else {
	    // 	// Move to top if already in working set
	    // 	state.recent.splice(idx, 1);
	    // }
	},
	ZOOM: (state, nodes, highlight_nodes) => {
	    state.zoom = nodes;
	    state.highlights = highlight_nodes;
	    state.history.push({"zoom":state.zoom, "highlight":state.highlights});
	    state.subgraph = state.graph.subgraph(state.zoom);
	},
	UNDO: (state) => {
	    if(len(state.history) > 1) {
		var h = state.history.pop();
		state.zoom = h.zoom;
		state.highlights = h.highlight;
	    }
	    else {
		state.zoom = state.history[0].zoom;
		state.highlights = state.history[0].highlight;
	    }
	    state.subgraph = state.graph.subgraph(state.zoom);
	},
	HIGHLIGHT: (state, nodes) => {
	    state.highlights = nodes;
	    state.history.push({"zoom":state.zoom, "highlight":state.highlights});
	},
	METADATA: (state, g) => {
	    console.log("MD",g);
	    state.graph = new CatGraph(g["nodes"], g["edges"]);
	    state.subgraph = state.graph;
	    state.zoom = state.graph.nodes;
	    state.highlights = {};
	    state.history = [{"zoom":state.zoom, "highlight":state.highlights}];
	    state.recent = [];
	    state.ready = true;
	    state.query = "is category";
	}	
    },
    actions: {
	cache: (context, nodes) => {
	    context.commit('CACHE',nodes);
	},
	dohighlight: (context, nodes) => {
	    context.commit('HIGHLIGHT',nodes);
	},
	dozoom: (context, nodes, highlight_nodes) => {
	    context.commit('ZOOM',nodes, highlight_nodes);
	},
	clear_history: (context) => {
	    context.commit('CLEAR_HISTORY');
	},
	reset_metadata: (context, data) => {
	    context.commit('METADATA', data);
	},
	remove_from_history: (context, node_id) => {
	    context.commit('REMOVE_FROM_HISTORY', node_id);
	},
	go: (context, node_id) => {
	    context.commit('GO', node_id);
	},
	get_node: (context, node_id) => {
	    console.log("fetching",node_id);
	    var fetch_headers = new Headers();
	    fetch_headers.append('pragma', 'no-cache');
	    fetch_headers.append('cache-control', 'no-cache');
	    
	    var fetch_params = {
		method: 'GET',
		headers: fetch_headers,
	    };
	    return new Promise((resolve, reject) => {
		fetch('/out/'+node_id+'.html', fetch_params).then(function(response){
		    response.text().then(function(data){
			var to_cache = {};
			to_cache[node_id] = data;
			context.commit('CACHE',to_cache);
			resolve();
		    });
		});
	    });
	},
	refresh_metadata: (context) => {
	    var fetch_headers = new Headers();
	    fetch_headers.append('pragma', 'no-cache');
	    fetch_headers.append('cache-control', 'no-cache');
	    
	    var fetch_params = {
		method: 'GET',
		headers: fetch_headers,
	    };
	    return new Promise((resolve, reject) => {
		fetch('/out/metadata.json', fetch_params).then(function(response){
	    	    response.json().then(function(data){
	    		context.commit('METADATA', data);
			resolve();
	    	    });
		});
	    });
	    // fetch('/out/metadata.json', fetch_params).then(function(response){
	    // 	console.log("R",response);
	    // 	response.json().then(function(data){
	    // 	    context.commit('METADATA', data);
	    // 	});
	    // });

	}
    }
})
