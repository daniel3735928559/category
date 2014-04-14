var currentNode = null;
var tagBoxID = 0;
var has1 = new Node(1, "has1", 0,[],[]);
var root = new Node(0, "root", 0, {'foo':[has1]}, []);

var nodes = {}

$.couch.urlPrefix = "http://localhost:11111/db";

function couchError(status){
    console.log('error',status);
}

function populateView(data){
    console.log('pop',JSON.stringify(data));
    currentNode = nodeFromDict(data);
    drawTree(currentNode);
}

function nodeFromDict(dict){
    return new Node(dict["name"],dict["timestamp"],dict["hasList"],dict["isOfList"],dict["content"]);
}

function drawTree(root){
    root.div.appendTo($("#nodes"));
    new AddConn();
}

window.onload = function(){
    var mapFunction = function(doc) {
	emit();
    };
    
    $.couch.db("test").query(mapFunction, "_count", "javascript", {
	success: function(data) {
            console.log('data',data["rows"][0]["id"]);
	    $.couch.db("test").openDoc(data["rows"][0]["id"],{success:populateView, error:couchError});
	},
	error: couchError,
	reduce: false
    });
    console.log("cn",JSON.stringify(currentNode));
    $("<div />",{id:'tagBoxPlus',class:'tagBoxPlus',text:'+',click:function(e){new TagBox('');}}).appendTo("#search");
    new TagBox("Mickey's");
}

function AddConn(){
    this.div = $("<div />",{id:this.id,class:'tagBox'});
    this.hasState = "has";
    this.escape = function(){ this.div.remove(); }
    this.toggleHas = function(state){
	this.hasState = state;
	this.hasToggle.detach();
	if(state == "has") this.hasInput.text("").append(this.hasToggle).append("has ").append(this.wordInput);
	else if(state == "isof") this.hasInput.text("").append(this.hasToggle).append("is ").append(this.wordInput).append(" of");
    };
    this.confirm = function(){
	alert("done");
    };
    var __construct = function (that) {
	//Construct Input Element	
	that.hasInput = $("<div />",{text:"has ","class":"tagBox"}).appendTo(that.div);
	that.hasToggle = $("<div />",{text:"(s)","class":"tagBox"}).prependTo(that.hasInput);
	that.wordInput = $("<input />",{"type":"text","value":"","class":"tagBoxInput"}).appendTo(that.hasInput);
	that.nodeInput = $("<input />",{"type":"text","value":"","class":"tagBoxInput"}).appendTo(that.div);
	that.hasToggle.click(function(e){ 
	    that.toggleHas(that.hasState == "has" ? "isof" : "has");
	});
	that.wordInput.keyup(function(e){ 
	    if(e.keyCode == 13){ that.nodeInput.focus(); console.log("ha"); }
	    that.wordInput.autocomplete({source:['hello','goodbye','banana','apple', 'strawberry']});
	});
	that.nodeInput.keyup(function(e){ 
	    if(e.keyCode == 13) that.confirm(); 
	    that.nodeInput.autocomplete({source:['hello','goodbye','banana','apple', 'strawberry']});
	});
	$("<div />",{class:'tagBoxMinus',text:'X',click:that.escape}).appendTo(that.div);
	that.div.appendTo($("#edges"))
    }(this);
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
	} else if(state == 'tag'){
	    this.inputElement.detach();
	    this.tagElement.text(this.inputElement.val());
	    this.tagElement.prependTo(this.div);
	}

    }
    
    var __construct = function (that) {
	//Construct Input Element	
	that.inputElement =  $("<input />",{"type":"text","value":that.text,"class":"tagBoxInput"});
	that.inputElement.keyup(function(e){ console.log("hi"); if(e.keyCode == 13) that.toggleState('tag'); })
	that.inputElement.autocomplete({source:['hello','goodbye','banana','apple', 'strawberry']});
	that.inputElement.appendTo(that.div);
	that.tagElement = $("<div />",{class:'tagBoxTag'});
	that.tagElement.click(function(e){ that.toggleState('input'); });
	$("<div />",{class:'tagBoxMinus',text:'X',click:function(e){console.log('removing','#'+that.id);$('#'+that.id).remove();}}).appendTo(that.div);
	that.div.insertBefore($("#tagBoxPlus"))
    }(this)
    
}

// The point is that now searching will add a bunch of nodes' divs to
// the #nodes div and as more terms are added this will be narrowed
// down.  If you want to add an edge "has colour ???" to node "foo"
// but need to search for the target, type "?" and the search bar will
// be preceeded with "foo has colour ..." and ultimately selecting a
// node will not root the tree at that node, but will fill in the
// edge-to-be with that node

function Node(name, timestamp, hasList, isOfList, content){
    this.name  = name;
    this.timestamp = timestamp;
    this.hasList = hasList;
    this.isOfList = isOfList;
    var __construct = function (that) {
	that.div = $("<div />",{id:that.name, class:"node"});
	that.nameDiv = $("<div />",{id:that.name+"_name", class:"name"}).appendTo(that.div);
	that.edgesDiv = $("<div />",{id:that.name+"_edges", class:"edges"}).appendTo(that.div);
	that.contentDiv = $("<div />",{id:that.name+"_content", class:"content",text:content}).appendTo(that.div);
	// Name div stuff: 
	that.nameLabel = $("<div />",{id:that.name+"_name_label", class:"nodeBox", text:that.name, click: function(e){ drawTree(that); }}).appendTo(that.nameDiv);
	// Edges div stuff: 
	that.edgeSources = [];
	that.edgeDivs = [];
	that.edgeEditDivs = [];
	var buildEdgeDiv = function(that,s,edgeList){
	    var edgeSource = [];
	    var edgeDiv = $("<div />",{class:"edgeBox"}).appendTo(that.edgesDiv);
	    var edgeDisplayDiv = $("<div />",{class:"edgeBox"}).appendTo(edgeDiv);
	    $("<div />",{class:"edgeTitle",text:s}).appendTo(edgeDisplayDiv);
	    console.log('AA',JSON.stringify(edgeList));
	    for(var node in edgeList[n]){
		$("<div />",{id:edgeList[n][node], class:"nodeBox", text:edgeList[n][node]}).appendTo(edgeDisplayDiv);
		edgeSource.push(s+": "+edgeList[n][node]);
	    }
	    var editEdge = $("<div />",{class:"edgeEdit",text:"[edit]"}).appendTo(edgeDisplayDiv);
	    that.edgeDivs.push(edgeDiv);

	    var src = edgeSource.join(", ");
	    that.edgeSources.push(src);
	    var edgeEditDiv = $("<div />",{class:"edgeBox"});
	    var edgeEditInput = $("<input />",{"type":"text","value":src,"class":"tagBoxInput"}).appendTo(edgeEditDiv);
	    edgeEditInput.keyup(function(e){
		if(e.keyCode == 13){
		    edgeEditDiv.detach();
		    edgeDisplayDiv.prependTo(edgeDiv);
		}
		else if(e.keyCode == "up"){
		    
		}
	    });
	    editEdge.click(function(e){
		edgeDisplayDiv.detach();
		edgeEditDiv.prependTo(edgeDiv);
		edgeEditInput.focus();
	    });
	    that.edgeEditDivs.push(edgeEditDiv);
	    // Add in + button at end of edges list and edit button
	    // for each edge, which replaces that edge with a textbox
	    // allowing the editing of edgeSource, which is then
	    // parsed to recreate the edge
	}
	for(var n in that.hasList) buildEdgeDiv(that,'has ' + n,that.hasList);
	for(var n in that.isOfList) buildEdgeDiv(that,'is ' + n + ' of',that.isOfList);
	$("<div />",{class:"edgeAdd",text:"[+]"}).appendTo(that.edgesDiv);
    }(this)
}

// expects: {'ID':nodeID, 'content':content, 'timestamp':timestamp, 'has':hasList, 'isof':isOfList, 'content':content}
