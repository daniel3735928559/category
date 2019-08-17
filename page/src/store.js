import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
	query: 'is category',
	current: '',
	nodes: {},
	recent: [],
	node_data: {}
    },
    getters: {
	neighbours: state => node_id => {
	    let node = state.nodes[node_id];
	    var ans = {};
	    for(var d in node.edges) {
		for(var l in node.edges[d]) {
		    for(var nbr_id of node.edges[d][l]) {
			ans[nbr_id] = state.nodes[nbr_id];
		    }
		}
	    }
	    return ans;
	}	
    }, 
    mutations: {
	CACHE: (state, node_id, node_data) => {
	    //node_data = plugin_process(state, node_id, node_data);
	    state.node_data[node_id] = node_data;
	},
	CLEAR_HISTORY: state => {
	    state.recent = [];
	},
	REMOVE_FROM_HISTORY: (state, node_id) => {
	    var idx = state.recent.indexOf(node_id);
	    if(idx >= 0) state.recent.splice(idx,1);
	},
	GO: (state, node_id) => {
	    state.current = node_id;
	    var idx = state.recent.indexOf(node_id);
	    if(idx >= 0) {
		state.recent.splice(idx, 1);
	    }
	    state.recent.unshift(node_id);
	},
	METADATA: (state, nodes) => {
	    state.nodes = nodes;
	    state.recent = [];
	    state.query = "is category";
	}
    },
    actions: {
	cache: (context, node_id, data) => {
	    context.commit('CACHE',node_id, data);
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
