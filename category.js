query_parser = require('./query').parser;

var Category = function(){
    this.has_edges = {
    "food":{
	"Mickies":["Butterscotch milkshake", "Sweet potato fries"],
	"Ians":["Pizza"],
	"Fresh Madison Market":["Butterscotch peanut butter"]},
    "location":{
	"Mickies":["Madison"],
	"Ians":["Madison"],
	"Conversation zero":["Mickies"]},
    "essence":{
	"Ians":["restaurant"],
	"Mickies":["restaurant"],
	"Fresh Madison Market":["store"],
	"David Brown":["person"]},
    "author":{
	"paper1":["David Brown"]},
    "topic":{
	"paper1":["There are exactly 27 lines in every cubic surface"]}
    };
    this.is_edges = this.dualize_edges(this.has_edges);
    this.nodes = {"Mickies":{"data":"<node>Mickies Dairy Bar is a place</node>"},
		  "Ians":{"data":"<node/>"},
		  "Fresh Madison Market":{"data":"<node/>"},
		  "Conversation zero":{"data":"<node/>"},
		  "David Brown":{"data":"<node/>"},
		  "paper1":{"data":"<node/>"},
		  "Butterscotch milkshake":{"data":"<node/>"},
		  "Sweet potato fries":{"data":"<node/>"},
		  "Pizza":{"data":"<node/>"},
		  "Butterscotch peanut butter":{"data":"<node/>"},
		  "Madison":{"data":"<node/>"},
		  "restaurant":{"data":"<node/>"},
		  "store":{"data":"<node/>"},
		  "person":{"data":"<node/>"},
		  "There are exactly 27 lines in every cubic surface":{"data":"<node/>"}}
    // this.nodes = this.extract_nodes(this.has_edges,{});
    // this.nodes = this.extract_nodes(this.is_edges,this.nodes);
    console.log(this.is_edges);
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
    this.edge_add(source, dir, new_name, target);
}

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
    for(var i = 0; i < e.length; i++)
	this.del_edge_from_collection(e[i].source, e[i].dir, e[i].name, e[i].target);
    for(var i = 0; i < edges.length; i++){
	this.add_edge(edges[i].source, edges[i].dir, edges[i].name, edges[i].target);
	if(!(edges[i].source in this.nodes)){
	    console.log(edges[i].source);
	    this.nodes[edges[i].source] = "<node />";
	}
	if(!(edges[i].target in this.nodes)){
	    console.log(edges[i].target);
	    this.nodes[edges[i].target] = "<node />";
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

Category.prototype.save_node = function(name){
    return;
}

Category.prototype.save_edges = function(){
    return;
}

Category.prototype.extract_objects = function(text){
    return [];
}
    
Category.prototype.extract_nodes = function(edges, n){
    var nodes = n;
    for(var e in edges){
	for(var n in edges[e]){
	    if(!(n in nodes)){
		nodes[n] = Category.EMPTY;
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
	return [q[1]];
	for(var n in this.nodes){
	    if(n == q[1]) return [n];
	}
	return [];
    }
}

var c = new Category();

//console.log("ANSWER",JSON.stringify(c.search_string("has location: (has food: Butterscotch milkshake / has food: Pizza)")));

//console.log("ANSWER",JSON.stringify(c.search_string("is food")));
console.log("N",c.nodes);
console.log("I",c.is_edges);
console.log("H",c.has_edges);

console.log("ANSWER",JSON.stringify(c.search_string("is location")));
//console.log("ANSWER",JSON.stringify(c.search_string("topic of: has author: David Brown")));

if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
    exports.category = c;
}
