import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
	query: 'is category',
	current: '',
	nodes: {},
	recent: [],
	node_data: {},
	plugin_data: {}
    },
    getters: {
	neighbours: state => node_id => {
	    let node = state.nodes[node_id];
	    var ans = {};
	    for(var d in node.edges) {
		for(var l in node.edges[d]) {
		    for(var edge of node.edges[d][l]) {
			ans[edge.target] = state.nodes[edge.target];
		    }
		}
	    }
	    return ans;
	},
	sorted: state => nodelist => {
	    return nodelist.sort(function(a, b){
		if('index' in state.nodes[a] && 'index' in state.nodes[b]) {
		    return parseInt(state.nodes[a].index) - parseInt(state.nodes[b].index);
		}
		else if('date' in state.nodes[a] && 'date' in state.nodes[b]) {
		    return state.nodes[a].date.localeCompare(state.nodes[b].date);
		}
		else return state.nodes[a].name.localeCompare(state.nodes[b].name);
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
	    for(var node_id in nodes){
		state.nodes[node_id].snippet = nodes[node_id].substring(0,100);
		state.node_data[node_id] = nodes[node_id];
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
	METADATA: (state, nodes) => {
	    state.nodes = nodes;
	    state.recent = [];
	    state.query = "is category";
	}
    },
    actions: {
	cache: (context, nodes) => {
	    context.commit('CACHE',nodes);
	},
	clear_history: (context) => {
	    context.commit('CLEAR_HISTORY');
	},
	remove_from_history: (context, node_id) => {
	    context.commit('REMOVE_FROM_HISTORY', node_id);
	},
	go: (context, node_id) => {
	    context.commit('GO', node_id);
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
