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
    return new Node(dict["name"],dict["timestamp"],dict["hasList"],dict["isOfList"],dict["content"]);
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
	match = s.match(/has ([a-zA-Z0-9_ ]+): *([a-zA-Z0-9_ ]+)/i);
    }
    else{
	dir = "isof";
	match = s.match(/is ([a-zA-Z0-9_ ]+) of: *([a-zA-Z0-9_ ]+)/i);
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
    return {"dir":dir,"edge":edge,"node":node};
}

TagManager.getQueryList = function(){
    var ans = [];
    for(var i in tagBoxList)
	ans.push(TagManager.getQuery(tagBoxList[i].text));
    return ans;
}

TagManager.add = function(s){
    var q_s = TagManager.getQuery(s);
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

function Node(name, timestamp, hasList, isOfList, content){
    this.name  = name;
    this.timestamp = timestamp;
    this.hasList = hasList;
    this.isOfList = isOfList;
    var __construct = function (that) {
	that.div = $("<div />",{id:that.name, class:"node"});
	that.nameDiv = $("<div />",{id:that.name+"_name", class:"name"}).appendTo(that.div);
	that.edgesDiv = $("<div />",{id:that.name+"_edges", class:"edges"}).appendTo(that.div);
	that.contentDiv = $("<div />",{id:that.name+"_content", class:"content",contenteditable:"true",text:content}).appendTo(that.div);
	// Name div stuff: 
	that.nameLabel = $("<div />",{id:that.name+"_name_label", class:"nodeBox", text:that.name, click: function(e){ drawTree(that); }}).appendTo(that.nameDiv);
	// Edges div stuff: 
	that.edgeSources = [];
	var buildEdgeDiv = function(that,s,edgeList){
	    var edgeSource = [];
	    var edgeDiv = $("<div />",{class:"edgeBox"}).insertBefore($('div.edgeAdd',that.edgesDiv));
	    // edgeDisplayDiv stuff: 
	    var edgeDisplayDiv = $("<div />",{class:"edgeBox"}).appendTo(edgeDiv);
	    $("<div />",{class:"edgeTitle",text:s}).appendTo(edgeDisplayDiv).click(function(e){		
		var dualizedText = TagManager.dualize(s+ ": "+that.nameDiv.text())+ " "+that.nameDiv.text();
		TagManager.add(dualizedText);
		//sendQuery();
	    });

	    console.log('AA',JSON.stringify(edgeList));
	    for(var node in edgeList[n]){
		$("<div />",{id:edgeList[n][node], class:"nodeBox", text:edgeList[n][node]}).appendTo(edgeDisplayDiv).click(function(e) {
		    TagManager.add($(this).text());
		    //sendQuery();		  
		});
		edgeSource.push(s+": "+edgeList[n][node]);
	    }
	    // Add edit button for each edge, which replaces that edge
	    // with a textbox allowing the editing of edgeSource,
	    // which is then parsed to recreate the edge
	    var editEdge = $("<div />",{class:"edgeEdit",text:"[edit]"}).appendTo(edgeDisplayDiv);
	
	    // edgeEditDiv stuff: 
	    var src = edgeSource.join(", ");
	    that.edgeSources.push(src);
	    var edgeEditDiv = $("<div />",{class:"edgeBox"});
	    var edgeEditInput = $("<input />",{"type":"text","value":src,"class":"edgeInput"}).appendTo(edgeEditDiv);
	    var parseEdge = function(text){
		
		// parse the edge, send the appropriate update to the
		// db if it was valid, or return an error message to
		// display if it wasn't
		return {"success":true};
	    }
	    var editDone = function(){
		var result = parseEdge(edgeEditInput.text())
		if(result["success"]){
		    //also refresh edgeDisplayDiv with the content from the result div
		    edgeEditDiv.detach();
		    edgeDisplayDiv.prependTo(edgeDiv);
		    return true;
		}
		else{
		    alert(result);
		    return false;
		}
	    }
	    edgeEditInput.keyup(function(e){
		console.log(e.keyCode,'sz',edgeDiv.prev('div.edgeBox').size())
		if(e.keyCode == 13){
		    editDone();
		}
		//Up
		else if(e.keyCode == 38){
		    if(edgeDiv.prev('div.edgeBox').size() > 0 && editDone()){
			$('div.edgeEdit',edgeDiv.prev()).click();
			$('input',edgeDiv.prev()).focus();
			// Also start editing previous edge, if any
		    }
		}
		//Down
		else if(e.keyCode == 40){
		    if(edgeDiv.next('div.edgeBox').size() > 0 && editDone()){
			$('div.edgeEdit',edgeDiv.next()).click();
			$('input',edgeDiv.next()).focus();
			// Also start editing next edge, if any, or add new edge if not
		    }
		    else if(edgeDiv.next('div.edgeBox').size() == 0 && editDone()){
			console.log("at end",$('div.edgeAdd',that.edgesDiv).size());
			$('div.edgeAdd',that.edgesDiv).click();
		    }
		}
		else if(e.keyCode == 8 && e.ctrlKey && e.shiftKey){
		    if($('input',edgeDiv).val() == "") edgeDiv.remove();
		}
		else if(e.keyCode == "?"){
		    // Initiate a search for the target node or edge word, depending on where we are
		}
		else{
		    // autogenerate suggestions
		}
	    });

	    editEdge.click(function(e){
		edgeDisplayDiv.detach();
		edgeEditDiv.prependTo(edgeDiv);
		console.log(edgeEditInput);
		edgeEditInput.focus();
	    });
	    //that.edgeEditDivs.push(edgeEditDiv);
	}//End of buildEdgeDiv

	$("<div />",{class:"edgeAdd",text:"[+]"}).appendTo(that.edgesDiv).click(function(e) {
	    buildEdgeDiv(that,"",[]);
	    $('div.edgeEdit',that.edgesDiv.children('div.edgeBox').last()).click();
	    $('div.edgeInput',that.edgesDiv.children('div.edgeBox').last()).focus();
	});

	for(var n in that.hasList) buildEdgeDiv(that,'has ' + n,that.hasList);
	for(var n in that.isOfList) buildEdgeDiv(that,'is ' + n + ' of',that.isOfList);
	// Add in + button at end of edges list
    }(this)
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
