var app = angular.module('app', []);

app.filter('source', function(){
    return function(edges, name){
	var res = [];        
	for (var i=0; i<edges.length; i++)
	    if (edges[i].source == name){console.log(name,JSON.stringify(edges[i])); res.push(edges[i]);}
	return res;
    }
});

app.controller("NodesController", function($scope){
    $scope.search_display = false;
    $scope.node_names = ["Penguin","Giraffe"];
    $scope.nodes = [{"name":"Penguin","content":"So Funny","timestamp":"2013-04-25T13:43:00"},{"name":"Giraffe","content":"blah","timestamp":"2013-04-25 13:43:00 CDT"}];
    $scope.edges = [{"source":"Penguin","dir":"has","name":"friend","target":"Giraffe",editing:false}];
    $scope.theDB = "test1";
    $.couch.urlPrefix = "http://localhost:11111/db";
    $scope.queries = []
    
    $scope.active_nodes = [];
    $scope.search_nodes = [];
    $scope.current_nodes = $scope.nodes;

    $scope.toggle_edge_edit = function(edge){ edge.editing = true; $scope.$apply();}
    $scope.toggle_search = function(){ $scope.search_display = !($scope.search_display); $scope.$apply();}
    $scope.activate = function(node){ $scope.active_nodes.push(node); $scope.$apply(); }
    $scope.deactivate = function(idx){ $scope.active_nodes.splice(idx,1); $scope.$apply(); }
    $scope.set_current = function(node){ $scope.current_nodes = [node]; $scope.$apply(); }
    $scope.query_edit = function(q){ q.editing = true; $scope.$apply(); }
    $scope.query_add = function(){ $scope.queries.push({"editing":true,"str":"","obj":{}}); $scope.$apply(); }
    $scope.query_remove = function(idx){ $scope.queries.splice(idx,1); $scope.$apply(); }
    $scope.edge_str = function(edge){ return edge.dir == "has" ? 
				      "has " + edge.name + ": " + edge.target : 
				    "is " + edge.name + " of: " + edge.target;
				    }
    $scope.edge_key = function(e,edge){ 
	if(e.keyCode == 13){ edge.editing = false; $scope.$apply(); } 
	
    }
    $scope.query_key = function(e,q){ 
	if(e.keyCode == 13){ q.editing = false; $scope.$apply(); }
	q.obj = $scope.parse_query(q.str); 
    }
    $scope.parse_query = function(s){
	return {};
    }

    $scope.set_current_by_name = function(name){
	console.log(name);
	var found = false;
	for(var i in $scope.nodes){
	    if($scope.nodes[i].name == name){
		$scope.current_nodes = [$scope.nodes[i]];
		$scope.$apply();
		found = true;
		break;
	    }
	}
	if(!found){
	    //go to database
	}
    }


    $scope.refresh = function(){
	$.couch.db($scope.theDB).view("cat/SourceOrTarget", {
	    success: function(data) {
		console.log("batman", JSON.stringify(data));
		$scope.nodes = [];
		$scope.edges = [];
		var sources = [];
		for(var d in data["rows"]){
		    var edge = data["rows"][d]["value"];
		    $scope.edges.push(edge);
		    if(sources.indexOf(edge["source"]) < 0) sources.push(edge["source"]);
		}
		$.couch.db($scope.theDB).view("cat/NodeNames", {
		    success: function(data){
			console.log(JSON.stringify(data));
			for(var i in data["rows"])
			    $.couch.db($scope.theDB).openDoc(data["rows"][i]["id"],{success:function(data){$scope.nodes.push(data);$scope.$apply();}, error:couchError});
		    },
		    keys: sources,
		    error: couchError,
		    reduce: false
		});
		
	    },
	    keys: $scope.node_names,
	    error: couchError,
	    reduce: false
	});
    }
    
});

function couchError(status){
    console.log('error',status);
}

/*

function recvQueryData(data,successFn){
    console.log("res",JSON.stringify(data));
    var uniqNames = []
    for(var d in data) if(uniqNames.indexOf(data[d]["value"]) < 0) uniqNames.push(data[d]["value"]);
    console.log(JSON.stringify(uniqNames));
    $.couch.db(theDB).view("cat/NodeNames", {
	success: function(data) {
	    console.log("FINAL DATA",JSON.stringify(data));
	    for(var i in data["rows"]) $.couch.db(theDB).openDoc(data["rows"][i]["id"],{success:successFn, error:couchError});
	},
	keys: uniqNames,
	error: couchError,
	reduce: false
    });
}

function sendSearchQuery(){
    console.log(JSON.stringify(TagManager.getQueryList()));
    sendQuery(TagManager.getQueryList(),appendToView);
}

function sendCurrentQuery(){
    console.log(JSON.stringify(TagManager.getQueryList()));
    sendQuery(currentQuery,appendToView);
}

function sendQuery(queries,successFn){
    $("#nodes").children().remove();
    sendQueryHelper(queries,0,null,recvQueryData,successFn);
}


// Query: type = node,content,time,edge
// Notation: 
// node: 
//       name: node_name
//       node: node_name
// content: 
//       content: content string
//       text: content string
// time: 
//       time: time specifier
//       time specifier (ISO)
// edge: 
//       has edgename: target
//       is edgeame of: target
// conn: 
//       conn: target
//       target


function sendQueryHelper(queries,index,result,success,successSuccessFn){
    console.log(JSON.stringify(queries));
    var q = queries[index];
    var queryViews = {"edge":{"first":"relB","view":"ArelB","genKeys":function(q,res){
	var keys = [];
	if(res)
	    for(var r in res)
		keys.push(res[r]["value"] + " " + q["dir"] + " " + q["edge"]+": "+q["node"]);
	else
	    keys.push(q["dir"] + " " + q["edge"]+": "+q["node"]);
	return keys;
    }
			     },
		      "node":{"first":"NodeNames","view":"NodeNames","genKeys":function(q,res){
			  return [q["name"]]
		      }
			     },
		      "content":{"first":"hasContent","view":"AhasContent","genKeys":function(q,res){
			  var keys = q["text"].toLowerCase().replace(/[^a-z $]/g,"").split(" ");
			  if(res){
			      var ans = []
			      for(var r in res)
				  for(var i in keys) ans.push(res[r]["value"] + ";" + keys[i]);
			      return ans;
			  }
			  return keys;
		      }
				},
		      "time":{"first":"time","view":"Atime","genKeys":function(q,res){return [];}},
		      "conn":{"first":"connB","view":"AconnB","genKeys":function(q,res){
			  var keys = [];
			  if(res)
			      for(var r in result)
				  keys.push(res[r]["value"] + ";" + q["node"]);
			  else
			      keys = [q["node"]]
			  return keys;
		      }}}

    console.log("QQQQQQQQQQ",JSON.stringify(q));
    console.log("QS",JSON.stringify(queries));
    var view = "";
    if(index == 0) view = queryViews[q["type"]]["first"];
    else view = queryViews[q["type"]]["view"];
    var nextKeys = queryViews[q["type"]]["genKeys"](q,result);
    console.log("SQ",JSON.stringify(queries),index,view,JSON.stringify(nextKeys));
    $.couch.db(theDB).view("cat/"+view, {
	success: function(data) {
	    console.log("SQS");
            console.log('data',JSON.stringify(data));
	    var res = [];
	    for(var d in data["rows"])
		res.push(data["rows"][d])
	    if(index+1 < queries.length) sendQueryHelper(queries,index+1,res,success);
	    else success(res,successSuccessFn)
	},
	keys: nextKeys,
	error: couchError,
	reduce: false
    });
}


function autocomplete(req,add){
    return;
    var suggestions = [];
    //Generate the view and keys
    var query = TagManager.getQuery(req.term)[0];					    
    var key = (query["node"][0] == " ")? "":query["node"][0];
    console.log("qq",JSON.stringify(query))
    $.couch.db(theDB).view("cat/auto",{
	success: function(data){
	    console.log("data",JSON.stringify(data));
	    var hasData  = (query["dir"]!=null && query["edge"]!=null);
	    for(row in data["rows"]){
		console.log("row", data["rows"]["row"])
		if(hasData){
		    suggestions.push(
			(query["dir"] == "has") ? "has "+query["edge"]+":"+ data["rows"][row]["key"] : "is "+query["edge"]+" of: "+data["rows"][row]["key"]);
		}
		else{
		    suggestions.push(data["rows"][row]["key"])
		}
	    }
	    add(suggestions);
	},						
	startkey:key,
	endkey:key+"\ufff0"
    });
} 

TagManager.getQuery = function(s){
    //Returns target of the text
    console.log("SSSSSSSSSSS",s);
    if(s.indexOf("has ") == 0){
	var match = s.match(/has ([.,-a-zA-Z0-9_ ]+): *([.,-a-zA-Z0-9_ ]+)/i);
	if(match)
	    return {"type":"edge","dir":"has","edge":match[1],"node":match[2]};
    }
    else if(s.indexOf("name:") ==0 || s.indexOf("node: ") ==0){
	match = s.match(/[^:]*: *([.,-a-zA-Z0-9_ ]+)/i);
	if(match)
	    return {"type":"node","name":match[1]};
    }
    else if(s.indexOf("content:") == 0|| s.indexOf("contains:") == 0 || s.indexOf("text:") == 0){
	match = s.match(/[^:]*: *([.,-a-zA-Z0-9_ ]+)/i);
	if(match)
	    return {"type":"content","text":match[1]};
    }
    else if(s.indexOf("is ") == 0 && s.indexOf("of:") > 0){
	var match = s.match(/is ([.,-a-zA-Z0-9_ ]+) of: *([.,-a-zA-Z0-9_ ]+)/i);
	if(match)
	    return {"type":"edge","dir":"isof","edge":match[1],"node":match[2]};
    }
    else{
	return {"type":"conn","node":s};
    }
 }

TagManager.getQueryList = function(){
    var ans = [];
    for(var i in tagBoxList){
	ans = ans.concat(TagManager.getQuery(tagBoxList[i].text));
	console.log("ttlt",tagBoxList[i].text);
    }
    console.log("ASD",JSON.stringify(ans));
    return ans;
}

function queryString(q){
    if(q["type"] == "edge"){
	if(q["dir"] == "has") return "has " + q["edge"] + ": " + q["node"];
	else return "is " + q["edge"] +  " of: " + q["node"];
    }
    else if(q["type"] == "content") return "content: " + q["text"]
    else if(q["type"] == "node") return "node: " + q["name"]
    else if(q["type"] == "conn") return q["node"]
}


function Node(dict,active){
    var _self = this;
    (!active) ? this.active = false : this.active = true;
    this.name  = dict["name"];
    this.timestamp = dict["timestamp"];
    this.content = dict["content"]
    this.dict = dict;

    this.dict["has"] = {};
    this.dict["isof"] = {};
    this.syncLock = false;
    $.couch.db(theDB).view("cat/SourceOrTarget", {
	success: function(data) {
	    console.log("batman", JSON.stringify(data));
	    for(var d in data["rows"]){
		var edge = data["rows"][d]["value"];
		if(!_self.dict[edge["dir"]][edge["name"]]) _self.dict[edge["dir"]][edge["name"]] = [] ;
		_self.dict[edge["dir"]][edge["name"]].push(edge["target"]);
	    }
	    _self.has = _self.dict["has"];
	    _self.isof = _self.dict["isof"];
	    console.log("lists:", JSON.stringify(_self.has), JSON.stringify(_self.isof));
	    _self.update();
	},
	key: this.name,
	error: couchError,
	reduce: false
    });
    
    this.json = {};
    this.frontends = [];
    

    this.deleteNode = function() {
	//Remove edges. Fixes synchronization issues.
	_self.div.detach();
	if(!("_id" in _self.dict)){
	    return;
	}
	
	$.couch.db(theDB).view("cat/SourceOrTarget", {
	    success: function(data) {
		//Add node to the list of things that should be deleted.
		data["rows"].push({"value":{"_id":_self.dict["_id"], "_rev":_self.dict["_rev"]}});
		sourceOrTargetCB(data,function(){return;});
	    },
	    key: this.name,
	    error: couchError,
	    reduce: false
	});

	
    }
    
    var sourceOrTargetCB = function(data,cb){
	var ids = [];
	console.log("REVREV",JSON.stringify(data));
	for(var row in data["rows"])
	    ids.push({"_id":data["rows"][row]["value"]["_id"],"_rev":data["rows"][row]["value"]["_rev"]});
	console.log("ids",JSON.stringify(ids));
	    $.couch.db(theDB).bulkRemove({"docs":ids},{success:function(data){
		cb();
	    }});
    }
    


    //Synchronize the JSON object with the UI
    this.synchronize = function (){
	if(_self.syncLock==true){
	    
	    return;
	}
	_self.syncLock = true;
	_self.json["has"] = {}; _self.json["isof"] = {};
	if("_id" in dict && "_rev" in dict){
	    _self.json["_id"] = dict["_id"]; _self.json["_rev"] = dict["_rev"];
	}
	//console.log("FRONTENDS",JSON.stringify(_self.frontends));
	for(var f in _self.frontends){
	    console.log("fe", _self.frontends[f][0].content());
	    _self.frontends[f][1](_self.frontends[f][0].content());
	}

	//Remove edges. Fixes synchronization issues.
	console.log("sinky");

	var addEdges = function(){	    
	    _self.dict["content"] = _self.json["content"];
	    _self.dict["name"] = _self.json["name"];
	    _self.dict["timestamp"] = timestamp();
	    console.log("what's my name", _self.json["name"]);
	    // Save the node document
	    $.couch.db(theDB).saveDoc(_self.dict, { 
		success:function(data) {
		    console.log("added a node")
		},
		error: couchError
	    });

	    // Save the new edges

	    var dirs = ["has","isof"];
	    var edgeDocs = [];
	    var targets = [];
	    for(var dir in dirs)
	    {
		dir = dirs[dir];
		for(var edge in _self.json[dir])
		    for( node in _self.json[dir][edge]){
			console.log("edges",JSON.stringify({"source":_self.json["name"],"target":_self.json[dir][edge][node], "name":edge, "dir":dir, "type":"edge"}));
			edgeDocs.push({"source":_self.json["name"],"target":_self.json[dir][edge][node], "name":edge, "dir":dir, "type":"edge"})
			targets.push(_self.json[dir][edge][node]);
		    }
	    }

	    $.couch.db(theDB).view("cat/NodeNames", {
		success: function(data) {
		    console.log("FINAL DATA",JSON.stringify(data));
		    for(var i in data["rows"]){
			var idx = targets.indexOf(data["rows"][i]["key"]);
			targets.splice(idx,1);
		    }
		    console.log("NEW",JSON.stringify(targets));
		    var newNodes = [];
		    for(var i in targets)
			newNodes.push({"name":targets[i],"timestamp":timestamp(),"type":"node"})
		    console.log("NEW",JSON.stringify(newNodes));
		    $.couch.db(theDB).bulkSave({"docs":newNodes}, {
			success:function(data){
			    console.log("SAVED",JSON.stringify(data));
			    console.log("ED",JSON.stringify(edgeDocs),JSON.stringify(_self.json));
			    $.couch.db(theDB).bulkSave({"docs":edgeDocs}, {
				success:function(data){
				    console.log("SAVED",JSON.stringify(data));
				    _self.syncLock = false;
				    sendSearchQuery();
				    _json = {};
				}
			    });
			}
		    });
		    
		},
		keys: targets,
		error: couchError,
		reduce: false
	    });
	}
	
	$.couch.db(theDB).view("cat/SourceOrTarget", {
	    success: function(data) {
		sourceOrTargetCB(data,addEdges);
	    },
	    key: _self.json["name"],
	    error: couchError,
	    reduce: false
	});
    }


    this.activate = function(){
	_self.active = true;
	_self.div.detach();
	_self.activateDiv.detach();
	_self.deactivateDiv.prependTo(_self.nameDiv);
	_self.div.appendTo("#activeNodes");
    }
    
    this.deactivate = function(){
	_self.active = false;
	_self.div.detach();
	_self.deactivateDiv.detach();
	_self.activateDiv.prependTo(_self.nameDiv);
	_self.div.appendTo("#nodes");
    }
    
    this.div = $("<div />",{id:this.name, class:"node"});
    this.nameDiv = $("<div />",{id:this.name+"_name", class:"name"}).appendTo(this.div);
    this.edgesDiv = $("<div />",{id:this.name+"_edges", class:"edges"}).appendTo(this.div);
    this.contentDiv = $("<div />",{id:this.name+"_content", class:"content"}).appendTo(this.div);

    this.activateDiv = $("<div />",{class:"activationButton",text:"[!]",click:function(e){_self.activate();}})
    this.deactivateDiv = $("<div />",{class:"activationButton",text:"[x]",click:function(e){_self.deactivate();}});
    this.dialog  = $("<div/>").dialog({
	    autoOpen: false
	});

    this.DeleteDiv = $("<div />",{class:"activationButton",text:"[D]",click:function(e){	
	console.log("launched delete dialogue");

	_self.dialog.dialog('option', 'buttons', {
	    "Confirm": function () {
		_self.deleteNode();
		_self.dialog.dialog("close");	
	    },
	    "Cancel": function () {
		_self.dialog.dialog("close");
	    }
	});
	
	_self.dialog.dialog("open");

    }}).appendTo(this.div);
    
    if(active)
	this.deactivateDiv.prependTo(this.nameDiv);
    else
	this.activateDiv.prependTo(this.nameDiv);
    
    //Add edges button
    $("<div />",{class:"edgeAdd",text:"[+]"}).appendTo(_self.edgesDiv).click(function(e) {
	_self.frontends.push([new EdgeDiv(_self,_self.edgesDiv,"",null),_self.addEdge]);
	$('div.edgeEdit',_self.edgesDiv.children('div.edgeBox').last()).click();
	$('div.edgeInput',_self.edgesDiv.children('div.edgeBox').last()).focus();
    });

    this.addEdge = function(queries){
	for(var q in queries){
	    console.log("json", JSON.stringify(_self.json));
	    q = queries[q];
	    console.log("ANE",JSON.stringify(q),queries,_self);	    
	    if(q["dir"] != null && q["edge"] in _self.json[q["dir"]])
		_self.json[q["dir"]][q["edge"]].push(q["node"]);
	    else if(q["dir"] != null) _self.json[q["dir"]][q["edge"]] = [q["node"]];
	}
    };
    
    this.update = function( ){
	for(var n in this.has)
	    this.frontends.push([new EdgeDiv(this,this.edgesDiv,'has ' + n,this.has[n]),this.addEdge]);
	console.log("TTTTT",this.frontends);
	for(var n in this.isof){
	    console.log("n",n);
	    this.frontends.push([new EdgeDiv(this,this.edgesDiv,'is ' + n + ' of',this.isof[n]),this.addEdge]);
	}
	console.log("dict",JSON.stringify(this.dict));
	this.frontends.push([new ContentDiv(this,this.contentDiv,this.dict["content"]),function(s){ _self.json["content"] = s; _self.json["timestamp"] = _self.timestamp; }]);
	this.frontends.push([new NameDiv(this,this.nameDiv,this.dict["name"]),function(s){ _self.json["name"] = s; }]);
    }
    
    this.editDone = function (){
	return true;
    }

}

function ContentDiv(node,parentDiv,content){
    var _self = this;
    this.node = node;
    this.style = "contentBoxMin";
    this.div = $("<div />",{class:"contentBoxMin",contenteditable:"true", text:content}).appendTo(parentDiv);
    this.timestamp = $("<div />",{class:"timestamp", text:"Last Edited: " + node.timestamp}).appendTo(parentDiv);
    this.renderedDiv = $("<div />",{class:"contentBoxMin", text:content});
    this.renderedDiv.click(function(e){
	console.log("reattaching div");
	_self.renderedDiv.detach()
	_self.div.prependTo(parentDiv);
    });
    this.overlay = $("<div />",{class:"overlay"}).appendTo(document.body);
    this.content =  function() {
	console.log("CONTENT",this.div.text());
	return this.div.text();
    }
    this.renderedDiv.keyup(function(e){
	if(e.keyCode == 27){ _self.lightboxToggle(); }
    });
    this.lightboxToggle = function(){
	if(_self.style == "contentBoxMax"){ 
	    _self.style = "contentBoxMin"
	    $(_self.overlay).css("display","none");
	} else{ 
	    _self.style = "contentBoxMax";
	    $(_self.overlay).css("display","block");
	}

	$(_self.div).attr("class",_self.style);
	$(_self.renderedDiv).attr("class",_self.style);
	console.log($(_self.div).attr("class"));
    }
    this.LaTeXRender = function(){
	_self.renderedDiv.text(_self.div.text());
	_self.div.detach();
	MathJax.Hub.Queue(["Typeset",MathJax.Hub,_self.renderedDiv.get(0)]);
	_self.renderedDiv.prependTo(parentDiv);
	_self.renderedDiv.focus();
    }
    this.div.blur(function(e){ _self.LaTeXRender(); node.synchronize()});
    this.div.keyup(function (e) {
	console.log("key pressed in content area",e.keyCode);
	if(e.keyCode == 27)
	    _self.LaTeXRender();
	else if(e.keyCode == 13 && e.ctrlKey)
	    _self.lightboxToggle();
 	_self.node.timestamp = timestamp();
	_self.timestamp.text("Last edited: "+_self.node.timestamp);
    });
}

/*

TODO 2014-04-21:
- (DONE) Add node
- Autocomplete on edges
- (DONE) MathJax it
- (DONE) has *:A should replace A in search
- (DONE) Down on last edge should create a new edge
- (DONE) search by node name
- (DONE) search by content
- search by timestamp
- (DONE) display timestamp of last edit
- (DONE) save timestamp of last edit
- (DONE) Delete nodes
- (DONE) Make adding an edge to a non-existent node create that node
- (DONE) Have active nodes and search result nodes
In the search div: 
- (DONE) Control-clicking a node adds the node to the search bar
- (DONE) Clicking a node makes that the current node
- (DONE) Clicking an edge should bring up all nodes targeted by that erge name, but not modify the search terms
- (DONE) Control-clicking an edge should add the dual of the edge to the search bar
- (DONE) Alt-clicking an edge should edit it
- (DONE) Alt-clicking the node name should edit it
- (DONE) Clicking the activate button should add to the active node list
In the active nodes div: 
- (DONE) Clicking a node adds to the active-node list
- (DONE) Ctrl-clicking a node or edge adds it to the search in the search div as before
- (DONE) Clicking "deactivate" removes from the active list
- (DONE) Alt-clicking anything should cause an edit

BUGS:
- (FIXED) Say you delete a node in the Search area, but it is still around in the active area. What happens? And vice versa?
- (FIXED) If you have a node in the active area, and the search area at the same time. You seem to be saving things twice? It's a bit confusing.
- (FIXED) The last thing happens even when it is not in the Search area??? so weird.
- (FIXED) When you get a node from the search area, the behavior is fine. However, when you add a new node. This seems to happen.
- (FIXED) deleting an edge doesn't seem to do anything

WISHES: 

Be able to change databases (maybe?)
Be able to hyperlink to another node from text of a given node--maybe like [[node name]]
Be able to change colour of a node
Import export nodes/whole databases
Make newlines work in editor
Make timestamps actually ISO-compliant

*/
