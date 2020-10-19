import query from './query.mjs'

class CatGraph {
    constructor(nodes, edges) {
	this.nodes = {};
	this.edges = {};
	this.index_edge_label = {};
	this.debug_search = false;
	for(var n of nodes) {
	    this.add_node(n);
	}
	for(var e of edges) {
	    this.add_edge(e);
	}
    }
    static verify_keys(obj, keys) {
	for(var k of keys) {
	    if(!(k in obj)) { throw ("Did not find expected key: "+k); }
	}
    }
    static compare(comparator, val1, val2) {
	var comparators = {
	    '==': CatGraph.cmp_eq,
	    '!=': CatGraph.cmp_neq,
	    '<': CatGraph.cmp_lt,
	    '>': CatGraph.cmp_gt,
	    '<=': CatGraph.cmp_leq,
	    '>=': CatGraph.cmp_geq,
	    '~': CatGraph.cmp_like,
	    //'!': CatGraph.cmp_null,
	    '!!': CatGraph.cmp_nonnull
	};
	if (!(comparator in comparators)) {
	    throw ("Invalid comparator: "+comparator);
	}
	return comparators[comparator](val1, val2);
    }
    static cmp_eq(x, y) {
	return x == y;
    }
    static cmp_neq(x, y) {
	return x != y;
    }
    static cmp_lt(x, y) {
	return x < y;
    }
    static cmp_gt(x, y) {
	return x > y;
    }
    static cmp_leq(x, y) {
	return x <= y;
    }
    static cmp_geq(x, y) {
	return x >= y;
    }
    static cmp_like(x, y) {
	return x.indexOf(y) != -1;
    }
    static cmp_null(x, y) {
	return x;
    }
    static cmp_nonnull(x, y) {
	return !x;
    }
    subgraph(nodeset) {
	console.log("SG",nodeset);
	var new_nodes = [];
	var new_edges = [];
	for(var n in nodeset) {
	    new_nodes.push(this.nodes[n]);
	}
	for(var eid in this.edges) {
	    if(!(this.edges[eid]["_from"] in nodeset) || !(this.edges[eid]["_to"] in nodeset)) {
		continue;
	    }
	    new_edges.push(this.edges[eid]);
	}
	return new CatGraph(new_nodes, new_edges);
    }
    sigma_graph() {
	var ans = {nodes:[],edges:[]};
	for(var n in this.nodes) {
	    ans.nodes.push({"key":n,attributes:{"label":this.nodes[n].name, "color":"#00f"}})
	}
	for(var eid in this.edges) {
	    var e = this.edges[eid];
	    ans.edges.push({"source":e["_from"],"target":e["_to"],attributes:{"label":e.label}});
	}
	return ans;
    }
    best_nodes(nodeset) {
	if(!nodeset) nodeset = this.nodes;
	var node_arr = [];
	for(var n in nodeset) {
	    node_arr.push(n);
	}
	var self = this;
	node_arr.sort(function(m, n){ return (self.nodes[n]._indegree + self.nodes[n]._outdegree)-(self.nodes[m]._indegree + self.nodes[m]._outdegree); })
	return node_arr;
    }
    best_labels(nodeset) {
	if(!nodeset) nodeset = this.nodes;
	var labels = {};
	var label_arr = [];
	for(var eid in this.edges) {
	    // Skip edges where either the source or target is outside the specified nodeset
	    if(!(this.edges[eid]["_from"] in nodeset) || !(this.edges[eid]["_to"] in nodeset)) {
		continue;
	    }
	    var l = this.edges[eid].label;
	    if(!(l in labels)){
		labels[l] = 0;
		label_arr.push({"label":l,"count":0});
	    }
	    labels[l]++;
	}
	for(var i = 0; i < label_arr.length; i++) {
	    label_arr[i].count = labels[label_arr[i].label];
	}
	label_arr.sort(function(x, y){ return y.count-x.count; })
	return label_arr;
    }
    add_node(node) {
	CatGraph.verify_keys(node, ["_key","name"]);
	let id = node["_key"];
	node["_degree"] = 0;
	node["_indegree"] = 0;
	node["_outdegree"] = 0;
	this.nodes[id] = node;
	this.index_edge_label[id] = {};
    }
    add_edge(edge) {
	CatGraph.verify_keys(edge, ["_id","_from","_to","label"]);
	if(edge["_from"].indexOf("/") >= 0) edge["_from"] = edge["_from"].split("/")[1];
	if(edge["_to"].indexOf("/") >= 0) edge["_to"] = edge["_to"].split("/")[1];
	let edgeid = edge["_id"];
	let srcid = edge["_from"];
	let tgtid = edge["_to"];
	let label = edge["label"];
	
	CatGraph.verify_keys(this.nodes, [srcid, tgtid]);

	// Edge is valid; source and dest nodes exist. Now we can start adding
	
	if(!(label in this.index_edge_label[tgtid])) { this.index_edge_label[tgtid][label] = {"in":[],"out":[]}; }
	if(!(label in this.index_edge_label[srcid])) { this.index_edge_label[srcid][label] = {"in":[],"out":[]}; }
	this.index_edge_label[tgtid][label]["in"].push(edgeid);
	this.index_edge_label[srcid][label]["out"].push(edgeid);
	this.edges[edgeid] = edge;
	this.nodes[srcid]["_outdegree"]++;
	this.nodes[tgtid]["_indegree"]++;
	this.nodes[srcid]["_degree"]++;
	this.nodes[tgtid]["_degree"]++;
    }

    get_edges(node) {
	return this.index_edge_label[node];
    }
    
    // Begin searching functions

    // Begin search helper functions

    // Search for nodes within resultset that have an adjacent edge of
    // label <label> in the specified direction <dir>
    search_dir_label_helper(resultset, dir, label) {
	var ans = {};
	for(var n in resultset) {
	    if(!(n in this.index_edge_label)) {
		continue;
	    }
	    if(label in this.index_edge_label[n][dir]) {
		// In this case, we get all outbound edges of the specified label
		for(var nodeid in this.index_edge_label[n][dir][label]) {
		    if(!(nodeid in resultset)) { continue; }
		    ans[nodeid] = true;
		}
	    }
	}
	return ans;
    }

    // Get neighbourhood of nodeset at steps distance away
    // - nodeset = the current set of nodes in the answer whose neighbours have already been explored -- the INTERIOR of the result
    // - frontier = the current set of nodes in the answer whose neighbours have not already been explored -- the BOUNDARY of the result
    // - steps = the number of steps to
    // - dir = "in", "out", "any" for edge direction
    // - lab = "*" (for any label) or a label specifying which edges to follow
    // - dist = the number of steps we've taken to get to this point (i.e. everything in nodeset is less than dist from the starting point, and everything in frontier is exactly dist from the starting point)
    // Returns: a map {node id : distance from starting nodeset}
    search_nbhd_helper(resultset, nodeset, steps, frontier, dir, lab, dist, may_overlap) {
	if(this.debug_search) {
	    console.log(steps, dir, lab);
	    this.log_nodeset("INTERIOR ", nodeset);
	    this.log_nodeset("BOUNDARY ", frontier);
	}
	// If steps is not positive, then we just return the nodeset (
	if(steps <= 0) {
	    for(var n in frontier) {
		nodeset[n] = dist;
	    }
	    return nodeset;
	}
	if(!frontier) {
	    frontier = nodeset;
	    nodeset = {};
	}
	// Check if the frontier is empty
	var no_new = true;
	for(var n in frontier) {
	    no_new = false;
	    break;
	}
	if(no_new) {
	    return nodeset;
	}

	// Now we start computing the neighbourhood
	var new_frontier = {};
	var new_nodeset = {};
	for(var n in nodeset) {
	    // The distance to everything in the interior nodeset was already known
	    new_nodeset[n] = nodeset[n];
	}
	for(var n in frontier) {
	    // The distance to everything on the boundary is exactly dist
	    new_nodeset[n] = dist;
	}
	for(var n in frontier) {
	    if(!(n in resultset)) continue;
	    for(var label in this.index_edge_label[n]) {
		// If we're not searching for this particular label, skip
		if(lab != "*" && lab != label) {
		    continue;
		}
		// 
		for(var direction in this.index_edge_label[n][label]) {
		    // If we're not searching for edges in this direction, skip
		    if(dir != "any" && dir != direction) {
			continue;
		    }
		    console.log("S",label,JSON.stringify(this.index_edge_label[n][label]));
		    for(var edgeid of this.index_edge_label[n][label][direction]) {
			var tgtid = "";
			if(direction == "out") {
			    tgtid = this.edges[edgeid]["_to"];
			}
			else if(direction == "in") {
			    tgtid = this.edges[edgeid]["_from"];
			}
			// Before we add this result to the new
			// frontier, we need to verify that it is BOTH
			// not yet visited, and that it is in the
			// ambient resultset we're searching
			if(tgtid in resultset) {
			    if(!(tgtid in new_nodeset) || may_overlap) {
				new_frontier[tgtid] = true;
			    }
			}
		    }
		}
	    }
	}
	return this.search_nbhd_helper(resultset, new_nodeset, steps-1, new_frontier, dir, lab, dist+1, may_overlap);
    }
    
    search(resultset, q) {
	if(!resultset) {
	    resultset = {};
	    for(var n in this.nodes) {
		resultset[n] = true;
	    }
	}
	if(this.debug_search) { this.log_nodeset("BEFORE: "+ JSON.stringify(q), resultset); }
	var result = {};
	if(!q || q.length == 0){
	    for(var n in this.nodes){
		ans[n] = true;
	    }
	}
	else if(q[0] == "and"){
	    // ["and", [subquery1, subquery2, ...]]
	    result = this.search(resultset, q[1][0]);
	    for(var i = 1; i < q[1].length; i++){
		result = this.search(result, q[1][i]);
	    }
	}
	else if(q[0] == "or"){
	    // ["or", [subquery1, subquery2, ...]]
	    for(var i = 0; i < q[1].length; i++){
		var next_result = this.search(resultset, q[1][i]);
		result = this.search_union(resultset,result,next_result);
	    }
	}
	else if(q[0] == "not"){
	    // ["not", [subquery]]
	    result = this.search_not(resultset, this.search(resultset, q[1][0]));
	}
	else if(q[0] == "edge"){
	    // ["edge", {"name":<name>, "dir":<dir>, "query":<subquery>}]
	    var edge = q[1];
	    // First, get the elements of the resultset that match the
	    // query (or full resultset) as potential targets:
	    var targets = resultset;
	    if("query" in q[1]) {
		targets = this.search(resultset, q[1].query);
	    }
	    console.log("T",JSON.stringify(targets));
	    // Then query for edges from this nodeset:
	    result = this.search_nbhd(resultset, targets, 1, 1, q[1].dir, q[1].name, true);
	}
	else if(q[0] == "nbhd"){
	    // ["nbhd", [<subquery>, <min_steps>, <max_steps>, <direction>, <label>]]
	    var subquery = q[1][0];
	    var min_steps = q[1][1];
	    var max_steps = q[1][2];
	    var dir = q[1][3];
	    var lab = q[1][4];
	    var targets = this.search(resultset, subquery);
	    result = this.search_nbhd(resultset, targets, min_steps, max_steps, dir, lab, true)
	}
	else if(q[0] == "name"){
	    //["name", <name>]
	    var name = q[1].toLowerCase();
	    for(var n in resultset){
		if(name == "*" || this.nodes[n].name.toLowerCase().indexOf(name) >= 0){
		    result[n] = true;
		}
	    }
	}
	else if(q[0] == "exactly"){
	    // ["exactly",<name>]
	    var name = q[1].toLowerCase();
	    for(var n in resultset){
		if(this.nodes[n].name.toLowerCase() == name){
		    result[n] = true;
		}
	    }
	}
	else if(q[0] == "prop"){
	    // ["prop", [<prop_name>, <comparator>, <val>]]
	    // comparator is one of '==', '!=', '<', '>', '<=', '>=', '~'
	    var prop_name = q[1][0].toLowerCase();
	    var prop_cmp = q[1][1];
	    var prop_val = q[1][2];
	    if (['==', '!=', '<', '>', '<=', '>=', '~', '!'].indexOf(prop_cmp) == -1) {
		throw ("Invalid comparator: "+prop_cmp);
	    }
	    for(var n in resultset){
		var real_val = this.nodes[n][prop_name];
		if(CatGraph.compare(prop_cmp, real_val, prop_val)) {
		    result[n] = true;
		}
	    }
	}
	else if(q[0] == "before"){
	    // ["before", <date>]
	    var cutoff_date = date_from_string(q[1]);
	    for(var n in resultset){
		if(!(nodes[n].date)) continue;
		var d = date_from_string(nodes[n].date);
		if(d && d < cutoff_date){
		    result.push(n);
		}
	    }
	}
	else if(q[0] == "after"){
	    // ["after", <date>]
	    var cutoff_date = date_from_string(q[1]);
	    for(var n in resultset){
		if(!(nodes[n].date)) continue;
		var d = date_from_string(nodes[n].date);
		if(d && d > cutoff_date){
		    result.push(n);
		}
	    }
	}
	else {
	    console.log("Unrecognised query type:",q[0]);
	}
	if(this.debug_search) { this.log_nodeset("AFTER: " + JSON.stringify(q), result); }	
	return result;
    }
    
    log_nodeset(msg, nodeset) {
	console.log(msg);
	for(var n in nodeset) {
	    console.log(this.nodes[n].name);
	}
    }
    
    // Begin actual search functions
    
    // // <nodeset1>, <nodeset2>
    // search_and(resultset, nodeset1, nodeset2) {
    // 	var ans = {};
    // 	for(var n in nodeset1) {
    // 	    if(n in nodeset2 && n in resultset) { ans[n] = true; }
    // 	}
    // 	return ans;
    // }

    // <nodeset1> / <nodeset2>
    search_union(resultset, nodeset1, nodeset2) {
	var ans = {};
	for(var n in nodeset2) {
	    if(n in resultset) ans[n] = true;
	}
	for(var n in nodeset1) {
	    if(!(n in nodeset2) && n in resultset) { ans[n] = true; }
	}
	return ans;
    }

    // !(<nodeset)
    search_not(resultset, nodeset) {
	var ans = {};
	for(var n in resultset) { if(!(n in nodeset)) { ans[n] = true; } }
	return ans;
    }

    // <nodeset>[<min_steps>..<max_steps>:<direction>:<label>]
    // Aliases:
    // - <nodeset>[<max_steps>]                         = <nodeset>[0..<max_steps>:any:*]
    // - <nodeset>[<max_steps>:<label>]                 = <nodeset>[0..<max_steps>:any:<label>]
    // - <nodeset>[<max_steps>:<direction>:<label>]     = <nodeset>[0..<max_steps>:<direction>:<label>]
    // - <nodeset>[<min_steps>..<max_steps>]            = <nodeset>[<min_steps>..<max_steps>:any:*]
    // - <nodeset>[<min_steps>..<max_steps>:<label>]    = <nodeset>[<min_steps>..<max_steps>:any:<label>]
    // --> ["nbhd", [<subquery>, <min_steps>, <max_steps>, <direction>, <label>]]
    search_nbhd(resultset, nodeset, min_steps, max_steps, direction, label, may_overlap) {
	if(direction == "has") {
	    direction = "in";
	}
	else if(direction == "is") {
	    direction = "out";
	}
	else if(direction != "any"){
	    throw ("Invalid direction: "+direction);
	}
	var knbhd = this.search_nbhd_helper(resultset, {}, max_steps, nodeset, direction, label, 0, may_overlap);
	console.log("K",JSON.stringify(knbhd));
	var ans = {};
	for(var nodeid in knbhd) {
	    if(min_steps <= knbhd[nodeid] && knbhd[nodeid] <= max_steps) {
		ans[nodeid] = knbhd[nodeid];
	    }
	}
	return ans;
    }

    // "has <label>: <nodeset>"
    search_has(resultset, nodeset, label) {
	var ans = this.search_nbhd(resultset, nodeset, 1, 1, "has", label, true);
    }

    // "is <label> of: <nodeset>"
    search_is(resultset, nodeset, label) {
	var ans = this.search_nbhd(resultset, nodeset, 1, 1, "is", label, true);
    }
    
    // "is <label>" = "an inbound edge of label <label> exists to this node"
    search_has_label(dir, label) {
	return this.search_dir_label_helper(resultset, "in", label)
    }

    // "has <label>" = "an outbound edge of label <label> exists from this node"
    search_has_label(resultset, label) {
	return this.search_dir_label_helper(resultset, "out", label)
    }

    // End of search functions

    // Begin report functions

    report_count(nodeset) {
	var ans = 0;
	for(var n in nodeset) {
	    ans++;
	}
	return ans;
    }
    
    // End report functions
}

var test_graph = function() {
    let nodes = [
	{"_key":"1","name":"apple"},
	{"_key":"2","name":"banana"},
	{"_key":"3","name":"cherry"},
	{"_key":"4","name":"bacon"},
	{"_key":"5","name":"lettuce"},
	{"_key":"6","name":"tomato"},
	{"_key":"7","name":"fruit salad"},
	{"_key":"8","name":"BLT"},
	{"_key":"9","name":"alice"},
	{"_key":"10","name":"bob"}
    ];
    let edges = [
	{"_id":"1","_from":"7","_to":"1","label":"ingredient"},
	{"_id":"2","_from":"7","_to":"2","label":"ingredient"},
	{"_id":"3","_from":"7","_to":"3","label":"ingredient"},
	{"_id":"4","_from":"8","_to":"4","label":"ingredient"},
	{"_id":"5","_from":"8","_to":"5","label":"ingredient"},
	{"_id":"6","_from":"8","_to":"6","label":"ingredient"},
	{"_id":"7","_from":"7","_to":"9","label":"author"},
	{"_id":"8","_from":"8","_to":"10","label":"author"},
	{"_id":"9","_from":"9","_to":"10","label":"friend"},
	{"_id":"10","_from":"9","_to":"2","label":"favorite"}
    ];
    var g = new CatGraph(nodes, edges);
    g.debug_search = true;
    g.search(g.nodes, ["name","a"]);
    g.search(g.nodes, ["not",[["name","a"]]]);
    // ["nbhd", [<subquery>, <min_steps>, <max_steps>, <direction>, <label>]]
    g.search(g.nodes, ["nbhd",[["name","apple"], 0, 1, "has", "*"]]);
    // ["prop", [<prop_name>, <comparator>, <val>]]
    g.search(g.nodes, ["prop",["name",">","baa"]]);
    console.log(JSON.stringify(g.index_edge_label));
    console.log(JSON.stringify(g.nodes));
    g.search(g.nodes, ["nbhd",[["name","apple"], 0, 2, "any", "ingredient"]]);
    g.search(g.nodes, ["edge",{"name":"*","dir":"has","query":["name","banana"]}]);
    g.search(g.nodes, ["edge",{"name":"ingredient","dir":"is"}]);
    console.log(query.parse('has x: y'));
    console.log(query.parse('(x)[1]'));
    console.log(query.parse('(x)[1..2]'));
    console.log(query.parse('(x)[1..2:is:foo]'));
    console.log(query.parse('.x == y'));
}

//test_graph();

export default CatGraph;
