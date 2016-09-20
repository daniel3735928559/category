query_parser = require('./query').parser;
fs = require('fs');

var Category = function(){
    var self = this;
    
    // Both has_edges and is_edges take the format:
    // { "<edge label>":
    //   {
    //       "<source node 1>": ["<target node 1>", "<target node 2>", ...],
    //       "<source node 2>": ["<target node 1>", "<target node 2>", ...],
    //       ...
    //   }
    // }
    // The only has_edges is the dual of is_edges.
    this.has_edges = JSON.parse(fs.readFileSync('data/edges.json','utf-8'));
    this.is_edges = this.dualize_edges(this.has_edges);

    this.nodes = {};
    var node_files = fs.readdirSync('data/nodes/');
    for(var i = 0; i < node_files.length; i++){
	this.nodes[node_files[i].substring(0,node_files[i].lastIndexOf("."))] = {'data':fs.readFileSync('data/nodes/'+node_files[i],'utf-8')};
    }
    this.nodes = this.extract_nodes(this.has_edges,this.nodes);
    console.log("EE",JSON.stringify(this.has_edges));
    console.log("NN",JSON.stringify(this.nodes));
}

Category.EMPTY = {};

Category.prototype.edge_add = function(source, dir, name, target){
    this.add_edge_to_collection(source,name,target,dir == "has" ? this.has_edges : this.is_edges)
}

Category.prototype.edge_del = function(source, dir, name, target){
    this.del_edge_from_collection(source, name, target, dir == "has" ? this.has_edges : this.is_edges);
    this.del_edge_from_collection(target, name, source, dir == "has" ? this.is_edges : this.has_edges);
    
}

Category.prototype.edge_rename = function(source, dir, name, target, new_name){
    this.edge_del(source, dir, name, target);
    this.edge_add(source, dir, new_name, target);}

Category.prototype.get_edges = function(source){
    var result = [];
    for(var name in this.has_edges){
	if(source in this.has_edges[name]){
	    for(var i=0;i<this.has_edges[name][source].length;i++){
		result.push({source:source, name: name, dir:"has", target:this.has_edges[name][source][i]});
	    }
	}
    }

    for(var name in this.is_edges){
	if(source in this.is_edges[name]){
	    for(var i=0;i<this.is_edges[name][source].length;i++)
		result.push({source:source, name: name, dir:"is", target:this.is_edges[name][source][i]});
	}
    }
    return result;
}

Category.prototype.set_edges = function(id, edges){
    var e = this.get_edges(id);
    console.log("EE",id,e,edges);
    if(!edges) return;
    for(var i = 0; i < e.length; i++)
	this.del_edge(e[i].source, e[i].dir, e[i].name, e[i].target);
    for(var i = 0; i < edges.length; i++){
	this.add_edge(edges[i].source, edges[i].dir, edges[i].name, edges[i].target);
	if(!(edges[i].source in this.nodes)){
	    console.log(edges[i].source);
	    this.nodes[edges[i].source] = {data: "<node />"};
	    this.edge_add(edges[i].source, edges[i].dir, edges[i].name, edges[i].target)
	}
	if(!(edges[i].target in this.nodes)){
	    console.log(edges[i].target);
	    this.nodes[edges[i].target] = {data: "<node />"};
	    this.edge_add(edges[i].source, edges[i].dir, edges[i].name, edges[i].target)
	}
    }
    
    console.log("H",this.has_edges)
    console.log("I",this.is_edges)
    console.log("N",this.nodes)
}

Category.prototype.add_edge = function(source, dir, name, target){
    console.log("Adding",source, dir, name, target);
    this.add_edge_to_collection(source, name, target, dir == "has" ? this.has_edges : this.is_edges);
    this.add_edge_to_collection(target, name, source, dir == "is" ? this.has_edges : this.is_edges);
}

Category.prototype.del_edge = function(source, dir, name, target){
    this.del_edge_from_collection(source, name, target, dir == "has" ? this.has_edges : this.is_edges);
    this.del_edge_from_collection(target, name, source, dir == "is" ? this.has_edges : this.is_edges);
}

Category.prototype.add_edge_to_collection = function(source, name, target, edges){
    if(!(name in edges))
	edges[name] = {};
    if(!(source in edges[name]))
	edges[name][source] = [];
    for(var i = 0; i < edges[name][source].length; i++){
	if(edges[name][source][i] == target) return false;
    }
    edges[name][source].push(target);
    return true;
}

Category.prototype.del_edge_from_collection = function(source, name, target, edges){
    if(edges[name] && edges[name][source]){
	for(var i = 0; i < edges[name][source].length; i++){
	    if(edges[name][source][i] == target){
		edges[name][source].splice(i,1);
		if(edges[name][source].length == 0)
		    delete edges[name][source];
		return true;
	    }
	}
    }
}

Category.prototype.del_node_from_collection = function(name, edges){
    for(var e in edges){
	for(var n in edges[e]){
	    if(n == name){
		delete edges[e][n];
		continue;
	    }
	    for(var i = 0; i < edges[e][n].length; i++){
		if(edges[e][n][i] == name){
		    edges[e][n].splice(i,1);
		    if(edges[e][n].length == 0)
			delete edges[e][n];
		}
	    }
	}
    }
}

Category.prototype.rename_node_in_collection = function(name, new_name, edges){
    for(var e in edges){
	for(var n in edges[e]){
	    if(n == name){
		edges[e][new_name] = edges[e][n];
		delete edges[e][n];
		continue;
	    }
	    for(var i = 0; i < edges[e][n].length; i++){
		if(edges[e][n][i] == name)
		    edges[e][n][i] = new_name;
	    }
	}
    }
}

// Private method to remove all edges associated with given node
// "name" (a string). If any array or object within edge_collection
// becomes empty after removing name node, it is also removed. The
// edge_collection is an object in the format of either has_edges or
// is_edges.
Category.prototype.delete_node_from_collection = function(name, edge_collection)
{
    // Loop on all edges labels
    for(var edge in edge_collection) {

        // Loop on all keys
        for (var node_key in edge_collection[edge]) {
            
            // If key matches name, remove and continue
            if (node_key === name)
            {
                delete edge_collection[edge][node_key];
                continue;
            }

            // Filter out nodes matching name
            edge_collection[edge][node_key] = edge_collection[edge][node_key].filter(function(x){return x !== name;})
            
            // if value array is empty after filtering, remove key
            if (!edge_collection[edge][node_key].length)
            {
                delete edge_collection[edge][node_key];
            }
        }
        
        // if edge dict is empty at this point, remove edge label from
        // edge_collection entirely
        if (Object.keys(edge_collection[edge]).length === 0)
        {
            delete edge_collection[edge];
        }
    }
}

Category.prototype.node_add = function(name,text){
    if(!(name in this.nodes)){
	this.nodes[name] = {"data":text};
	return true;
    }
    return false;
}

Category.prototype.node_del = function(name){
    if(name in this.nodes){
	delete this.nodes[name];
	this.delete_node_from_collection(name, this.has_edges);
	this.delete_node_from_collection(name, this.is_edges);
	return true;
    }
    return false;
}

Category.prototype.node_rename = function(name,new_name){
    if(new_name in nodes){
	return false;
    }
    this.rename_node_in_collection(name, new_name, this.has_edges);
    this.rename_node_in_collection(name, new_name, this.is_edges);
    this.nodes[new_name] = this.nodes[name];
    delete this.nodes[name];
    return true;
}

Category.prototype.extract_objects = function(text){
    return [];
}

Category.prototype.extract_nodes = function(edges, n){
    var nodes = n;
    for(var e in edges){
	for(var n in edges[e]){
	    if(!(n in nodes)){
		nodes[n] = {'data':''};
	    }
	}
    }
    return nodes;
}

Category.prototype.dualize_edges = function(edges){
    var result = {};
    for(var e in edges){
	result[e] = {};
	for(var n in edges[e]){
	    for(var i = 0; i < edges[e][n].length; i++){
		var src = edges[e][n][i];
		if(!(src in result[e])){
		    result[e][src] = [];
		}
		result[e][src].push(n);
	    }
	}
    }
    return result;
}

Category.intersect_lists = function(l1,l2){
    var result = [];
    for(var i = 0; i < l1.length; i++){
	for(var j = 0; j < l2.length; j++){
	    if(l1[i] == l2[j]) result.push(l1[i]);
	}
    }
    return result;
}

Category.union_lists = function(l1,l2){
    var result = [].concat(l1);
    for(var i = 0; i < l2.length; i++){
	var found = false;
	for(var j = 0; j < l1.length; j++){
	    if(l2[i] == l1[j]){
		found = true;
		break;
	    }
	}
	if(!found) result.push(l2[i]);
    }
    return result;
}

Category.prototype.search_string = function(query_string){
    return this.search_obj(query_parser.parse(query_string));
}

Category.prototype.search_obj = function(q){
    console.log(JSON.stringify(q));
    if(!q || q.length == 0){
	var result = [];
	for(var n in this.nodes){
	    result.push(n);
	}
	return result;
    }
    else if(q[0] == "and"){
	var result = this.search_obj(q[1][0]);
	for(var i = 1; i < q[1].length; i++){
	    var res = this.search_obj(q[1][i]);
	    result = Category.intersect_lists(result,res);
	}
	return result;
    }
    else if(q[0] == "or"){
	var result = [];
	for(var i = 0; i < q[1].length; i++){
	    var res = this.search_obj(q[1][i]);
	    result = Category.union_lists(result,res);
	}
	return result;
    }
    else if(q[0] == "edge"){
	result = [];
	var edge = q[1];
	var res = this.search_obj(edge.query);
	console.log(res);
	for(var i = 0; i < res.length; i++){
	    var node_name = res[i];
	    if(edge.dir == "has"){
		for(var src in this.has_edges[edge.name]){
		    for(var j = 0; j < this.has_edges[edge.name][src].length; j++){
			if(node_name == this.has_edges[edge.name][src][j]){
			    result = Category.union_lists(result,[src]);
			}
		    }
		}
	    }
	    else if(edge.dir == "is"){
		if(this.has_edges[edge.name][node_name]){
		    result = Category.union_lists(result,this.has_edges[edge.name][node_name]);
		}
	    }
	}
	return result;
	
    }
    else if(q[0] == "name"){
	//return [q[1]];
	for(var n in this.nodes){
	    if(n == q[1]) return [n];
	}
	return [];
    }
}
module.exports = Category;
