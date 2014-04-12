var currentNode = null;
var tagBoxID = 0;
var has1 = new Node(1, "has1", 0,[],[]);
var root = new Node(0, "root", 0, {'foo':[has1]}, []);

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
    return new Node(dict["name"],dict["timestamp"],dict["hasList"],dict["isOfList"]);
}


function drawTree(root){
    root.display.appendTo($("#node"));
    for(var d in root.edgeDisplays)
	root.edgeDisplays[d].appendTo($("#edges"));
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

function Node(name, timestamp, hasList, isOfList){
    this.name  = name;
    this.timestamp = timestamp;
    this.hasList = hasList;
    this.isOfList = isOfList;
    var __construct = function (that) {
	that.display = $("<div />",{id:that.name, class:"nodeBox", text:that.name});
	that.edgeDisplays = []
	var buildEdgeDiv = function(that,s,edgeList){
	    var ediv = $("<div />",{class:"edgeBox"});
	    $("<div />",{class:"edgeTitle",text:s}).appendTo(ediv);
	    console.log('AA',JSON.stringify(edgeList));
	    for(var node in edgeList[n]) $("<div />",{id:edgeList[n][node], class:"nodeBox", text:edgeList[n][node]}).appendTo(ediv);
	    that.edgeDisplays.push(ediv);
	}
	for(var n in that.hasList) buildEdgeDiv(that,'has ' + n,that.hasList)
	for(var n in that.isOfList) buildEdgeDiv(that,'is ' + n + ' of',that.isOfList)
    }(this)
}

// expects: {'ID':nodeID, 'content':content, 'timestamp':timestamp, 'has':hasList, 'isof':isOfList}
