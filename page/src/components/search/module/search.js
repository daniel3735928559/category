var intersect_lists = function(l1,l2){
    var ans = [];
    var l1_dict = {};
    for(var i = 0; i < l1.length; i++){
	l1_dict[l1[i]] = true;
    }
    for(var j = 0; j < l2.length; j++){
	if(l1_dict[l2[j]]) {
	    ans.push(l2[j]);
	}
    }
    return ans;
}

var union_lists = function(l1,l2){
    var result = [].concat(l1).concat(l2);
    var ans_dict = {};
    var ans = [];
    for(var i = 0; i < result.length; i++) {
	ans_dict[result[i]] = true;
    }
    for(var x in ans_dict) {
	ans.push(x);
    }
    return ans;
}

// removes everything in l2 from l1
var remove_all = function(l1,l2){
    var result = [];
    for(var i = 0; i < l1.length; i++){
	var found = false;
	for(var j = 0; j < l2.length; j++){
	    if(l1[i] == l2[j]){
		found = true;
		break;
	    }
	}
	if(!found) result.push(l1[i]);
    }
    return result;
}

var date_from_string = function(d) {
    var arr = d.split("-");
    if(arr.length != 3) return null;
    return new Date(parseInt(arr[0]), parseInt(arr[1])-1, parseInt(arr[2]));
}

var neighbourhood = function(nodeset, steps, nodes, frontier) {
    if(steps <= 0) {
	for(var n in frontier) {
	    nodeset[n] = true;
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
    var new_frontier = {}
    var new_nodeset = {};
    for(var n in nodeset) {
	new_nodeset[n] = true;
    }
    for(var n in frontier) {
	new_nodeset[n] = true;
    }
    for(var n in frontier) {
	if(!(n in nodes)) continue;
	for(var label in nodes[n].edges.has) {
	    for(var edge of nodes[n].edges.has[label]) {
		var target = edge.target
		if(!(target in new_nodeset)) {
		    // if the target is not in the set we've visited or that we're visiting, we'll visit it on the next round
		    new_frontier[target] = true;
		}
	    }
	}
	for(var label in nodes[n].edges.is) {
	    for(var edge of nodes[n].edges.is[label]) {
		var target = edge.target
		if(!(target in new_nodeset)) {
		    // if the target is not in the set we've visited or that we're visiting, we'll visit it on the next round
		    new_frontier[target] = true;
		}
	    }
	}
    }
    return neighbourhood(new_nodeset, steps-1, nodes, new_frontier);
}

var search = function(q, nodes){
    console.log("Q",q);
    var result = [];
    if(!q || q.length == 0){
	for(var n in nodes){
	    result.push(n);
	}
    }
    else if(q[0] == "and"){
	result = search(q[1][0],nodes);
	for(var i = 1; i < q[1].length; i++){
	    console.log("q",q[1][i]);
	    var nodeset = {};
	    for(var n of result) {
		if(n in nodes) {
		    nodeset[n] = nodes[n];
		}
	    }
	    console.log("NS",nodeset);
	    res = search(q[1][i],nodeset);
	    result = intersect_lists(result,res);
	    console.log("AND RES",q[1][i],result);
	}
    }
    else if(q[0] == "or"){
	for(var i = 0; i < q[1].length; i++){
	    var res = search(q[1][i],nodes);
	    result = union_lists(result,res);
	}
    }
    else if(q[0] == "not"){
	result = Object.keys(nodes);
	for(var i = 0; i < q[1].length; i++){
	    var res = search(q[1][i],nodes);
	    result = remove_all(result,res);
	}
    }
    else if(q[0] == "edge"){
	var edge = q[1];
	var res = search(edge.query,nodes);
	for(var i = 0; i < res.length; i++){
	    var node_id = res[i];
	    for(var n in nodes){
		if(edge.name == "*"){
		    var found = false;
		    for(var label in nodes[n].edges[edge.dir]){
			for(var e of nodes[n].edges[edge.dir][label]) {
			    if(e.target == node_id) {
				found = true;
				result = union_lists(result,[n]);
				break;
			    }
			    if(found) break;
			}
		    }
		}
		else if(edge.name in nodes[n].edges[edge.dir]) {
		    for(var e of nodes[n].edges[edge.dir][edge.name]) {
			if(e.target == node_id) {
			    result = union_lists(result,[n]);
			    break;
			}
		    }
		    result = union_lists(result,[n]);
		}
	    }
	}
    }
    else if(q[0] == "nbhd"){
	var subquery = q[1][0];
	var steps = q[1][1];
	var res = search(subquery,nodes);
	var nodeset = {};
	for(var n of res) {
	    nodeset[n] = true;
	}
	var ans_dict = neighbourhood(nodeset, steps, nodes);
	for(var n in ans_dict) {
	    result.push(n);
	}
    }
    else if(q[0] == "name"){
	var name = q[1].toLowerCase();
	for(var n in nodes){
	    if(name == "*" || nodes[n].name.toLowerCase().indexOf(name) >= 0){
		result.push(n);
	    }
	}
    }
    else if(q[0] == "exactly"){
	var name = q[1].toLowerCase();
	for(var n in nodes){
	    if(nodes[n].name.toLowerCase() == name){
		result.push(n);
	    }
	}
    }
    else if(q[0] == "prop"){
	var prop_name = q[1][0].toLowerCase();
	var prop_val = q[1][1].toLowerCase();
	for(var n in nodes){
	    if(nodes[n][prop_name] && nodes[n][prop_name].toLowerCase().indexOf(prop_val) >= 0){
		result.push(n);
	    }
	}
    }
    else if(q[0] == "before"){
	var cutoff_date = date_from_string(q[1]);
	for(var n in nodes){
	    if(!(nodes[n].date)) continue;
	    var d = date_from_string(nodes[n].date);
	    if(d && d < cutoff_date){
		result.push(n);
	    }
	}
    }
    else if(q[0] == "after"){
	var cutoff_date = date_from_string(q[1]);
	for(var n in nodes){
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
    return result;
}
export default search
