var theDB = "test";
var currentNode = null;
var tagBoxID = 0;
var has1 = new Node(1, "has1", 0,[],[]);
var root = new Node(0, "root", 0, {'foo':[has1]}, []);

var nodes = {}
var tagBoxList = [];
$.couch.urlPrefix = "http://localhost:11111/db";

function couchError(status){
    console.log('error',status);
}

function populateView(data){
    console.log('pop',JSON.stringify(data));
    currentNode = nodeFromDict(data);
    drawTree(currentNode);
}

function appendToView(data){
    console.log('app',JSON.stringify(data));
    nodeFromDict(data).div.appendTo($("#nodes"));
}

function nodeFromDict(dict){
    return new Node(dict);
}

function drawTree(root){
    root.div.appendTo($("#nodes"));
    //new AddConn();
}

window.onload = function(){
    var mapFunction = function(doc) {
	emit(doc.name,doc);
    };
    
    $.couch.db("test").query(mapFunction, null, "javascript", {
	success: function(data) {
            console.log('data',JSON.stringify(data),data["rows"][1]["id"]);
	    $.couch.db("test").openDoc(data["rows"][1]["id"],{success:populateView, error:couchError});
	},
	error: couchError,
	reduce: false
    });
    //sendQueryHelper([{"dir":"has","edge":"city","node":"Madison"}],0,null,function(data){ console.log("GOT",JSON.stringify(data)); });

    console.log("cn",JSON.stringify(currentNode));
    $("<div />",{id:'tagBoxPlus',class:'tagBoxPlus',text:'[+]',click:function(e){new TagBox('');}}).appendTo("#search");
    $("<div />",{id:'tagBoxPlus',style:"display:inline-block",text:'[search]',click:function(e){sendQuery();}}).appendTo("#search");
    new TagBox("Mickey's");
}

function recvQueryData(data){
    console.log("res",JSON.stringify(data));
    uniqIDs = []
    for(var d in data){
	if(uniqIDs.indexOf(data[d]["id"]) < 0) uniqIDs.push(data[d]["id"])
    }
    for(var i in uniqIDs)
	$.couch.db("test").openDoc(uniqIDs[i],{success:appendToView, error:couchError});
}

function sendQuery(){
    $("#nodes").children().remove();
    sendQueryHelper(TagManager.getQueryList(),0,null,recvQueryData);
}

function sendQueryHelper(queries,index,result,success){
    console.log("QS",JSON.stringify(queries));
    if(index == 0){
	var view = (queries[index]["dir"] == null ? "connB" : "relB");
	var nextKeys = (queries[index]["dir"] == null ? [queries[index]["node"]] : [queries[index]["dir"] + " " + queries[index]["edge"]+": "+queries[index]["node"]]);
    }
    else{
	var view = (queries[index]["dir"] == null ? "AconnB" : "ArelB");
	var nextKeys = []
	if(queries[index]["dir"] == null)
	    for(var r in result)
		nextKeys.push(result[r]["value"] + " " + queries[index]["node"]);
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
	    this.div.css("background-color","#9af");
	    this.tagElement.text(this.inputElement.val());
	    this.tagElement.prependTo(this.div);
	}
    }

    var __construct = function (that) {
	//Construct Input Element	
	that.inputElement =  $("<input />",{"type":"text","value":that.text,"class":"tagBoxInput"});
	that.inputElement.keyup(function(e){ console.log("hi"); if(e.keyCode == 13) that.toggleState('tag'); that.text = that.inputElement.val(); })
	that.inputElement.autocomplete({source:['hello','goodbye','banana','apple', 'strawberry']});
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
    if(s.indexOf('has') == 0){
	return s.replace(/has ([a-zA-Z0-9]+): ([a-zA-Z0-9]+)/, 'is $1 of:' );
    }
    
    else if(s.indexOf('is') == 0){
	return s.replace(/is ([a-zA-Z0-9]+) of: ([a-zA-Z0-9]+)/, 'has $1:' );
    }
    
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
}

/*	
*/

function Node(dict){
    var _self = this;
    this.name  = dict["name"];
    this.timestamp = dict["timestamp"];
    this.has = dict["has"];
    this.isof = dict["isof"];
    this.dict = dict;
    this.json = {};

    this.frontends = [];

    //Synchronize the JSON object with the UI
    this.synchronize = function (){
	this.json = {"has":{},"isof":{},"content":"","name":""};
	this.json["_id"] = dict["_id"]; this.json["_rev"] = dict["_rev"];
	//console.log("FFFFFFFFFFFFF",JSON.stringify(this.frontends));
	for(var f in this.frontends){
	    //console.log("Fi",_self.frontends[f]);
	    _self.frontends[f][1](_self.frontends[f][0].content());
	    //console.log("json", JSON.stringify(_self.json));
	}
	
	$.couch.db("test").saveDoc(_self.json, { 
	    success:function(data) {
		console.log(data);
		this.dict = this.json;
	    },
	    error: couchError
	});
    }

    this.div = $("<div />",{id:this.name, class:"node"});
    this.nameDiv = $("<div />",{id:this.name+"_name", class:"name"}).appendTo(this.div);
    this.edgesDiv = $("<div />",{id:this.name+"_edges", class:"edges"}).appendTo(this.div);
    this.contentDiv = $("<div />",{id:this.name+"_content", class:"content"}).appendTo(this.div);

    // Name div stuff: 
    
    //Add edges button
    $("<div />",{class:"edgeAdd",text:"[+]"}).appendTo(this.edgesDiv).click(function(e) {
	this.frontends.push([new EdgeDiv(node,this.edgesDiv,"",""),this.addEdge]);
	$('div.edgeEdit',this.edgesDiv.children('div.edgeBox').last()).click();
	$('div.edgeInput',this.edgesDiv.children('div.edgeBox').last()).focus();
    });

    this.addEdge = function(queries){
	for(var q in queries){
	    //console.log("json", JSON.stringify(_self.json));
	    q = queries[q];
	    //console.log("Q",JSON.stringify(q),queries,_self);	    
	    if(q["edge"] in _self.json[q["dir"]])
		_self.json[q["dir"]][q["edge"]].push(q["node"]);
	    else
		_self.json[q["dir"]][q["edge"]] = [q["node"]];
	}
    };

    for(var n in this.has)
	this.frontends.push([new EdgeDiv(this,this.edgesDiv,'has ' + n,this.has[n]),this.addEdge]);
    console.log("TTTTT",this.frontends);
    for(var n in this.isof)
	this.frontends.push([new EdgeDiv(this,this.edgesDiv,'is ' + n + ' of',this.isof[n]),this.addEdge]);

    this.frontends.push([new ContentDiv(this,this.contentDiv,dict["content"]),function(s){ _self.json["content"] = s; }]);
    this.frontends.push([new NameDiv(this,this.nameDiv,dict["name"]),function(s){ _self.json["name"] = s; }]);

    
    this.editDone = function (){
	return true;
    }

}

function ContentDiv(node,parentDiv,content){
    this.div = $("<div />",{class:"contentBox",contenteditable:"true", text:content}).appendTo(parentDiv);
    this.content =  function() {
	console.log("CONTENT",this.div.text());
	return this.div.text();
    }
}

function NameDiv(node,parentDiv,content){
    this.div = $("<div />",{id:node.name+"_name_label", class:"nodeBox", text:node.dict["name"], click: function(e){ alert("U FOWND THA SEKRIT"); }}).appendTo(parentDiv);
    this.content =  function() {
	return this.div.text();    
    }
}

function EdgeDiv(node,parentDiv,edgeName,nodeList){
    this.div = $("<div />",{class:"edgeBox"}).insertBefore($('div.edgeAdd',parentDiv));
    var state = "display";

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

	var text = this.node.nameDiv.text();
	$("<div />",{class:"edgeTitle",text:s}).appendTo(this.div).click(function(e){
	    //What happens when you click on the title
	    var dualizedText = TagManager.dualize(s+ ": "+text+ " "+text);
	    TagManager.add(dualizedText);
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
		$('div.edgeAdd',parentDiv).click();
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

When double-click on content area, put editor into lightbox.  Otherwise, all nodes currently displayed are editable

*/
