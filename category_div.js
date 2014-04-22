var theDB = "test";
var currentNode = null;
var tagBoxID = 0;
var has1 = new Node(1, "has1", 0,[],[]);
var root = new Node(0, "root", 0, {'foo':[has1]}, []);

var nodes = {}
var tagBoxList = [];
$.couch.urlPrefix = "http://localhost:11111/db";

function timestamp(){
    var currentdate = new Date(); 
    return currentdate.getFullYear() + "-" 
        + (currentdate.getMonth()+1)  + "-" 
	+ currentdate.getDate() + " "
        + currentdate.getHours() + ":"  
        + currentdate.getMinutes() + ":" 
        + currentdate.getSeconds();
    
}

function clone(o) {
    var newObj = (o instanceof Array) ? [] : {};
    for (var i in o) {
	//if (i == 'clone') continue;
	if (o[i] && typeof o[i] == "object") newObj[i] = clone(o[i]);
	else newObj[i] = o[i]
    }
    return newObj;
};

function couchError(status){
    console.log('error',status);
}

function appendToView(data){
    console.log('app',JSON.stringify(data));
    (new Node(data)).div.appendTo($("#nodes"));
}

window.onload = function(){
    var mapFunction = function(doc) {
	emit(doc.name,doc);
    };
    
    $.couch.db(theDB).query(mapFunction, null, "javascript", {
	success: function(data) {
            console.log('data',JSON.stringify(data),data["rows"][1]["id"]);
	    $.couch.db(theDB).openDoc(data["rows"][1]["id"],{success:appendToView, error:couchError});
	},
	error: couchError,
	reduce: false
    });
    //sendQueryHelper([{"dir":"has","edge":"city","node":"Madison"}],0,null,function(data){ console.log("GOT",JSON.stringify(data)); });

    console.log("cn",JSON.stringify(currentNode));
    $("<div />",{id:'tagBoxPlus',class:'tagBoxPlus',text:'[+]',click:function(e){new TagBox('');}}).appendTo("#search");
    $("<div />",{id:'tagBoxPlus',style:"display:inline-block",text:'[search]',click:function(e){sendQuery();}}).appendTo("#search");
    new TagBox("Mickies");
    
    $("#addNode").click(function(e){
	appendToView({"name":"", "content":"", "type":"node", "timestamp":timestamp()});
    });
}

function recvQueryData(data){
    console.log("res",JSON.stringify(data));
    var uniqNames = []
    for(var d in data) if(uniqNames.indexOf(data[d]["value"]) < 0) uniqNames.push(data[d]["value"]);
    console.log(JSON.stringify(uniqNames));
    $.couch.db(theDB).view("cat/NodeNames", {
	success: function(data) {
	    console.log("FINAL DATA",JSON.stringify(data));
	    for(var i in data["rows"]) $.couch.db(theDB).openDoc(data["rows"][i]["id"],{success:appendToView, error:couchError});
	},
	keys: uniqNames,
	error: couchError,
	reduce: false
    });
}

function sendQuery(){
    $("#nodes").children().remove();
    sendQueryHelper(TagManager.getQueryList(),0,null,recvQueryData);
}

function sendQueryHelper(queries,index,result,success){
    console.log("QS",JSON.stringify(queries));
    if(index == 0){
	var view = (queries[index]["dir"] == null ? "connB" : "relB");
	var nextKeys = (queries[index]["dir"] == null ? 
			[queries[index]["node"]] : 
			[queries[index]["dir"] + " " + queries[index]["edge"]+": "+queries[index]["node"]]);
    }
    else{
	var view = (queries[index]["dir"] == null ? "AconnB" : "ArelB");
	var nextKeys = []
	if(queries[index]["dir"] == null)
	    for(var r in result)
		nextKeys.push(result[r]["value"] + ";" + queries[index]["node"]);
	else
	    for(var r in result)
		nextKeys.push(result[r]["value"] + " " + queries[index]["dir"] + " " + queries[index]["edge"]+": "+queries[index]["node"]);

    }
    console.log("SQ",JSON.stringify(queries),index,view,JSON.stringify(nextKeys));
    $.couch.db(theDB).view("cat/"+view, {
	success: function(data) {
	    console.log("SQS");
            console.log('data',JSON.stringify(data));
	    var res = [];
	    for(var d in data["rows"])
		res.push(data["rows"][d])
	    if(index+1 < queries.length) sendQueryHelper(queries,index+1,res,success);
	    else success(res)
	},
	keys: nextKeys,
	error: couchError,
	reduce: false
    });
}


function autocomplete(req,add){
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
			   
    

function TagBox(text){
    this.state = 'input';
    this.id = 'tagbox'+tagBoxID;
    tagBoxID++;
    this.text = text;    
    this.div = $("<div />",{id:this.id,class:'tagBox'});
    
    this.toggleState = function(state) {
	console.log(state);
	if(state == 'input'){
	    this.tagElement.detach();
	    this.inputElement.prependTo(this.div);
	    this.div.css("background-color","#fff");
	} else if(state == 'tag'){
	    this.inputElement.detach();
	    this.inputElement.autocomplete("close");
	    this.div.css("background-color","#9af");
	    this.tagElement.text(this.inputElement.val());
	    this.tagElement.prependTo(this.div);
	    //sendQuery();
	}
    }

    var __construct = function (that) {
	//Construct Input Element	
	that.inputElement =  $("<input />",{"type":"text","value":that.text,"class":"tagBoxInput"});
	that.inputElement.keyup(function(e){ console.log("hi"); if(e.keyCode == 13) that.toggleState('tag'); that.text = that.inputElement.val(); })
	that.inputElement.autocomplete({source:
					function(req, add){
					    autocomplete(req,add);
					}
				       });
	that.inputElement.appendTo(that.div);
	that.tagElement = $("<div />",{class:'tagBoxTag'});
	that.tagElement.click(function(e){ that.toggleState('input'); });
	$("<div />",{class:'tagBoxMinus',text:'[x]',click:function(e){console.log('removing','#'+that.id);$('#'+that.id).remove(); var i = tagBoxList.indexOf(that); tagBoxList.splice(i,1);}}).appendTo(that.div);
	//Add before the plus
	that.div.insertBefore($("#tagBoxPlus"))
	tagBoxList.push(that);
    }(this);
}

// The point is that now searching will add a bunch of nodes' divs to
// the #nodes div and as more terms are added this will be narrowed
// down.  If you want to add an edge "has colour ???" to node "foo"
// but need to search for the target, type "?" and the search bar will
// be preceeded with "foo has colour ..." and ultimately selecting a
// node will not root the tree at that node, but will fill in the
// edge-to-be with that node

//Bizarre use of static functions
function TagManager(){}

TagManager.dualize  = function(s){
    if(s.indexOf('has') == 0)
	return s.replace(/has ([a-zA-Z0-9]+): ([a-zA-Z0-9]+)/, 'is $1 of:' );
    else if(s.indexOf('is') == 0)
	return s.replace(/is ([a-zA-Z0-9]+) of: ([a-zA-Z0-9]+)/, 'has $1:' );
    else
	return s;
}

TagManager.getQuery = function(s){
    //Returns target of the text
    var match = null;
    var dir = null;
    if(s.indexOf("has ") == 0){
	dir = "has";
	match = s.match(/has ([.,-a-zA-Z0-9_ ]+): *([.,-a-zA-Z0-9_ ]+)/i);
    }
    else{
	dir = "isof";
	match = s.match(/is ([.,-a-zA-Z0-9_ ]+) of: *([.,-a-zA-Z0-9_ ]+)/i);
    }
    if(match == null){
	var dir = null;
	var edge = null;
	var node = s;
    }
    else{
	var edge = match[1];
	var node = match[2];
    }
    var ans = []
    var nodes = node.split(",");
    for(var n in nodes){
	ans.push({"dir":dir,"edge":edge,"node":nodes[n]});
    }
    return ans;
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

TagManager.add = function(s){
    var q_s = TagManager.getQuery(s)[0];
    for(var i=tagBoxList.length-1; i>=0; i--){
	var t = tagBoxList[i]; 
	
	var q_t = TagManager.getQuery(t.text);
	//If this is a "pure" node rather than an edge, remove it 
	console.log(t.text);
	console.log("q_t " + q_t['node']);
	console.log("q_s "+ q_s['node']);
	if(s == t.text){
	    return;
	} else if(q_t['node'] == q_s['node'] && q_t['dir'] == null && q_t['edge']==null){
	    console.log("q_t "+q_t['node']+ " q_s "+q_s['node']);
	    t.div.remove()
	    tagBoxList.splice( i, 1 );
	}	
	//If we find this node already here, get out of dodge
    }
    var tagBox = new TagBox(s);
    tagBox.toggleState('tag');
    sendQuery();
}

/*	
*/

function Node(dict,active){
    var _self = this;
    this.active = active;
    if(active) this.active = true
    this.name  = dict["name"];
    this.timestamp = dict["timestamp"];
    this.content = dict["content"]
    this.dict = dict;

    this.dict["has"] = {};
    this.dict["isof"] = {};

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
    
    //Synchronize the JSON object with the UI
    this.synchronize = function (){
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

	var addEdges = function(){	    
	    _self.dict["content"] = _self.json["content"];
	    _self.dict["name"] = _self.json["name"];
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
			    sendQuery();
			}
		    });
		    
		},
		keys: targets,
		error: couchError,
		reduce: false
	    });
	    console.log("ED",JSON.stringify(edgeDocs),JSON.stringify(_self.json));
	    $.couch.db(theDB).bulkSave({"docs":edgeDocs}, {
		success:function(data){
		    console.log("SAVED",JSON.stringify(data));
		    sendQuery();
		}
	    });
	}
	
	$.couch.db(theDB).view("cat/SourceOrTarget", {
	    success: function(data) {
		sourceOrTargetCB(data,addEdges);
	    },
	    key: this.name,
	    error: couchError,
	    reduce: false
	});
    }


    this.activate = function(){
	_self.div.detach();
	_self.activateDiv.detach();
	_self.deactivateDiv.prependTo(_self.nameDiv);
	_self.div.appendTo("#activeNodes");
    }
    
    this.deactivate = function(){
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

    if(active)
	this.deactivateDiv.prependTo(this.nameDiv);
    else
	this.activateDiv.prependTo(this.nameDiv);

    // Name div stuff: 
    
    //Add edges button
    $("<div />",{class:"edgeAdd",text:"[+]"}).appendTo(_self.edgesDiv).click(function(e) {
	_self.frontends.push([new EdgeDiv(_self,_self.edgesDiv,"",[]),_self.addEdge]);
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
    this.div.blur(function(e){ _self.LaTeXRender(); });
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

function NameDiv(node,parentDiv,name){

    this.div = $("<div />",{class:"nodeNameContainer"}).appendTo(parentDiv);
    
    this.content =  function() {
	return nameEditDiv.content();    
    }

    var state = "display";
    var nameDisplayDiv = new NameDisplayDiv(node, this);
    var nameEditDiv = new NameEditDiv(node, this);
    
    this.update  = function(name){
	nameDisplayDiv.update(name);
	nameEditDiv.update(name);
    }

    this.swap = function(){
	if(state == "display"){
	    state = "input";
	    nameDisplayDiv.div.detach();
	    nameEditDiv.div.prependTo(this.div);
	    nameEditDiv.nameEditInput.focus();
	}
	else if(state=="input"){
	    state = "display";
	    nameEditDiv.div.detach();
	    var name = nameEditDiv.content();
	    nameDisplayDiv.update(name);
	    nameDisplayDiv.div.prependTo(this.div);
	}
    }

    console.log("making name div", name);
    this.update(name);
}

function NameDisplayDiv(node, nameDiv){
    this.nameDiv = nameDiv;
    this.node = node;
    this.div = $("<div />",{class:"nodeBox"}).appendTo(nameDiv.div).click(function(e) {nameDiv.swap()});
    
    this.update = function(name){
	$(this.div).text(name);
    }
    
}

function NameEditDiv(node, nameDiv){
    this.nameDiv = nameDiv;
    this.node = node;
    this.div = $("<div />");
    this.nameEditInput = $("<input />",{"type":"text","class":"edgeInput"}).appendTo(this.div).keyup(function(e){
	if(e.keyCode == 13){	    
	    nameDiv.swap();
	    node.synchronize();
	}
    });
    
    this.update = function(name){
	this.nameEditInput.val(name);
    }

    this.content = function() {
	console.log("Say my name, say my name", this.nameEditInput.val());
	return this.nameEditInput.val();
    }
												     
}



function EdgeDiv(node,parentDiv,edgeName,nodeList){
    this.div = $("<div />",{class:"edgeBox"}).insertBefore($('div.edgeAdd',parentDiv));
    var state = "display";
    this.parentDiv = parentDiv;
    var edgeDisplayDiv =  new EdgeDisplayDiv(node,this);
    var edgeEditDiv = new EdgeEditDiv(node, this);

    //Updates from a given edgeList
    this.update = function(s, edgeList){
	edgeDisplayDiv.update(s,edgeList);
	edgeEditDiv.update(s,edgeList);
    }
    
    this.content = function(){
	return edgeEditDiv.content()
    }

    this.swap = function(){
	if(state == "display"){
	    state = "input";
	    edgeDisplayDiv.div.detach();
	    edgeEditDiv.div.prependTo(this.div);
	    edgeEditDiv.edgeEditInput.focus();
	}
	else if(state=="input"){
	    state = "display";
	    edgeEditDiv.div.detach();
	    var edges = edgeEditDiv.content();
	    var s = (edges[0]["dir"] == "has") ? "has "+edges[0]["edge"]+":": "is "+edges[0]["edge"]+" of:";
	    console.log("CONTENTEEEEE",JSON.stringify(edges),s);
	    var edgeList = []
	    for(var edge in edges)
		edgeList.push(edges[edge]["node"])
	    edgeDisplayDiv.update(s, edgeList);
	    edgeDisplayDiv.div.prependTo(this.div);
	    
	}
    }
    //console.log("ENODELIST",JSON.stringify(nodeList));
    this.update(edgeName,nodeList);
}

function EdgeDisplayDiv(node,edgeDiv){
    
    this.edgeDiv = edgeDiv;
    this.node = node;
    this.div = $("<div />",{class:"edgeBox"}).appendTo(edgeDiv.div);

    this.update = function(s,edgeList){
	$(this.div).empty();

	var text = this.node.name;
	$("<div />",{class:"edgeTitle",text:s}).appendTo(this.div).click(function(e){
	    //What happens when you click on the title
	    TagManager.add(TagManager.dualize(s+ ": "+text+ " "+text));
	});
	
	for(var node in edgeList){
	    console.log("node: "+s);
	    $("<div />",{id:edgeList[node], class:"nodeBox", text:edgeList[node]}).appendTo(this.div).click(function(e) {
		TagManager.add($(this).text());
	    });
	}

	var editEdge = $("<div />",{class:"edgeEdit",text:"[edit]"}).appendTo(this.div).click(function(e){
	    edgeDiv.swap();
	});
    }

}

function EdgeEditDiv(node, edgeDiv) {
    var _self = this;
    this.edgeDiv = edgeDiv;
    this.div = $("<div />",{class:"edgeBox"});  
    this.edgeEditInput = $("<input />",{"type":"text","class":"edgeInput"}).appendTo(this.div).keyup(function(e){
	if(e.keyCode == 13){	    
	    edgeDiv.swap();
	    node.synchronize();
	}
	//Up
	else if(e.keyCode == 38){
	    if(edgeDiv.div.prev('div.edgeBox').size() > 0 && node.editDone()){
		$('div.edgeEdit',edgeDiv.div.prev()).click();
		$('input',edgeDiv.div.prev()).focus();
		edgeDiv.swap()
		// Also start editing previous edge, if any
	    }
	}
	//Down
	else if(e.keyCode == 40){
	    if(edgeDiv.div.next('div.edgeBox').size() > 0 && node.editDone()){
		$('div.edgeEdit',edgeDiv.div.next()).click();
		$('input',edgeDiv.div.next()).focus();
		edgeDiv.swap();
		// Also start editing next edge, if any, or add new edge if not
	    }
	    else if(edgeDiv.div.next('div.edgeBox').size() == 0 && node.editDone()){
		//console.log("at end",$('div.edgeAdd',that.edgesDiv).size());
		edgeDiv.swap();
		$('div.edgeAdd',_self.edgeDiv.parentDiv).click();
	    }
	}
	else if(e.keyCode == 8 && e.ctrlKey && e.shiftKey){
	    if($('input',edgeDiv.div).val() == "") edgeDiv.div.remove();
	}
	else if(e.keyCode == "?"){
	    // Initiate a search for the target node or edge word, depending on where we are
	}
	else{
	    // autogenerate suggestions
	}
    });

    this.update = function(s, edgeList){
	console.log("EL",edgeList);
	var src = s+ ": "+edgeList.join(","); 
	var edgeEditInput = this.edgeEditInput;
	$(edgeEditInput).val(src);
    }

    this.content = function(){
	return TagManager.getQuery(this.edgeEditInput.val());
    }

}

	    
	

// expects: {'ID':nodeID, 'content':content, 'timestamp':timestamp, 'has':hasList, 'isof':isOfList, 'content':content}
// function AddConn(){
//     this.div = $("<div />",{id:this.id,class:'addBox'});
//     this.hasState = "has";
//     this.escape = function(){ this.div.remove(); }
//     this.toggleHas = function(state){
// 	this.hasState = state;
// 	this.hasToggle.detach();
// 	if(state == "has") this.hasInput.text("").append(this.hasToggle).append("has ").append(this.wordInput);
// 	else if(state == "isof") this.hasInput.text("").append(this.hasToggle).append("is ").append(this.wordInput).append(" of");
//     };
//     this.confirm = function(){
// 	alert("done");
//     };
//     var __construct = function (that) {
// 	//Construct Input Element	
// 	that.hasInput = $("<div />",{text:"has ","class":"addBox"}).appendTo(that.div);
// 	that.hasToggle = $("<div />",{text:"(s)","class":"addBox"}).prependTo(that.hasInput);
// 	that.wordInput = $("<input />",{"type":"text","value":"","class":"tagBoxInput"}).appendTo(that.hasInput);
// 	that.nodeInput = $("<input />",{"type":"text","value":"","class":"tagBoxInput"}).appendTo(that.div);
// 	that.hasToggle.click(function(e){ 
// 	    that.toggleHas(that.hasState == "has" ? "isof" : "has");
// 	});
// 	that.wordInput.keyup(function(e){ 
// 	    if(e.keyCode == 13){ that.nodeInput.focus(); console.log("ha"); }
// 	    that.wordInput.autocomplete({source:['hello','goodbye','banana','apple', 'strawberry']});
// 	});
// 	that.nodeInput.keyup(function(e){ 
// 	    if(e.keyCode == 13) that.confirm(); 
// 	    that.nodeInput.autocomplete({source:['hello','goodbye','banana','apple', 'strawberry']});
// 	});
// 	$("<div />",{class:'tagBoxMinus',text:'X',click:that.escape}).appendTo(that.div);
// 	that.div.appendTo($("#nodes"))
//     }(this);
// }

/*

Searching: 

1. Actions for clicking on an edge
2. Actions for clicking on a target of an edge
3. Action when enter is hit on TagBox
4. Create a sendQuery function - default behavior, 

sendQuery inputs: hasList, isOfList, target
emit: list of documents 

Search Results Shown:

-Search Query is single node: show the node

-Search Query is multiple nodes: show all nodes connected to all query nodes, plus the query nodes themselves

-Search Query has edge (has *, A, is * of A)+ Nodes B's: show all nodes satisfying  edge conditions and connected to all B's


Click behaviour at all times: 

-When node is clicked: Put node (without edge specifier) into query

-When edge "A has * B" is clicked: If A is in search query without edge specifier, replace in query with "is * of A".  Otherwise, add "is * of A" to query

-When enter is pressed in search box: 


Editing (frontend done): 

1. Editing an edge
2. Deleting an edge
3. Adding an edge
4. Very basic content editing
5. ??????????
6. Profit! 

Content editing: 

DONE: When double-click on content area, put editor into lightbox.  Otherwise, all nodes currently displayed are editable

TODO 2014-04-21:
- (DONE) Add node
- Autocomplete on edges
- (DONE) MathJax it
- has *:A should replace A in search
- (DONE) Down on last edge should create a new edge
- search by content
- search by timestamp
- (DONE) display timestamp of last edit
- (DONE) save timestamp of last edit
- Delete nodes
- (DONE) Make adding an edge to a non-existent node create that node
- (DONE) Have active nodes and search result nodes
In the search div: 
- Control-clicking a node adds the node to the search bar
- Clicking a node makes that the current node
- Clicking an edge should bring up all nodes targeted by that erge name, but not modify the search terms
- Control-clicking an edge should add the dual of the edge to the search bar
- Double-clicking an edge should edit it
- Double-clicking the node name should edit it
- (DONE) Clicking the activate button should add to the active node list
In the active nodes div: 
- Clicking a node adds to the active-node list
- Ctrl-clicking a node or edge adds it to the search in the search div as before
- (DONE) Clicking "deactivate" removes from the active list
- Double-clicking anything should cause an edit

*/
