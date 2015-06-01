var currentNode = null;
var can = document.getElementById("cat_can");
var c = can.getContext("2d");

var nodeBoxList = []

window.onload = function(){
    can = document.getElementById("cat_can");
    c = can.getContext("2d");
    
    //Draw the main tree
    drawTree(root);

    //Create the SearchBar
    nodeBoxList.push(new NodeBox(0,"Mickey's"));
    var searchBar = document.getElementById('search_bar');

    for(i=0;i<nodeBoxList.length;i++){
	searchBar.appendChild(nodeBoxList[i].div);
    }
}

// Search Box for a node. Has two states, either 'search' or 'display'. In the search state, a search box is presented to the user
// in the 
function NodeBox(id,text){
    this.state = 'search';
    this.id = id;
    this.text = text;    
    this.div = document.createElement('div');
    
    var __construct = function (that) {
	that.div.id = id;
	that.element = document.createElement('input');
	that.element.setAttribute('type','text');
	that.element.innerHtml = this.text;
	that.div.appendChild(that.element);
	nodeBoxList.push(that);
    }(this)
    
}




function NodeDisplay(x, y, w, h, node){
    this.node = node;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.draw = function(c){
	c.fillStyle = "#99FF99";
	c.fillRect(this.x,this.y,this.w,this.h);
	c.strokeStyle = "black";
	c.strokeRect(this.x,this.y,this.w,this.h);
	c.fillStyle = "black";
	c.fillText(node.name, this.x+5, this.y+h/2);
    }
}

function Node(ID, name, timestamp, hasList, isOfList){
    this.ID = ID;
    this.name  = name;
    this.timestamp = timestamp;
    this.hasList = hasList;
    this.isOfList = isOfList;
    
}

function nodeFromDict(dict){
    
}

// expects: {'ID':nodeID, 'content':content, 'timestamp':timestamp, 'has':hasList, 'isof':isOfList}

function selectNode(node){
    currentNode = node;
    currentNode.draw(c);
    for(var n in node.hasList){
	
    }
}

function string_to_lines(s,w){
    var ws = s.split(" ");
    var ls= [];
    var current_line = "";
    for(i in ws){	
	if(c.measureText(current_line+ws[i]+" ").width > w){
	    ls.push(current_line);
	    current_line = ws[i] + " ";
	}
	else current_line += ws[i]+" ";
    }
    ls.push(current_line);
    return ls;
}

function drawNode(node, x, y, w, h){
    c.fillStyle = "#99FF99";
    c.fillRect(this.x,this.y,this.w,this.h);
    c.strokeStyle = "black";
    c.strokeRect(this.x,this.y,this.w,this.h);
    
}

function drawTree(root){
    var rootDisplay = new NodeDisplay(20, can.height/2, 100, 50, root);
    var displays = [];
    var hasLen = Object.keys(root.hasList).length
    var isOfLen = Object.keys(root.isOfList).length
    var edgeCount = hasLen+isOfLen;
    var lineHeight = can.height/(edgeCount+2);
    var xBuffer = 15;
    var currentY = lineHeight;
    for(var i = 0; i < hasLen + isOfLen; i++){
	var currentEdge  = i < hasLen ? Object.keys(root.hasList)[i] : Object.keys(root.isOfList)[i - hasLen];
	var currentEdgeList = i < hasLen ? root.hasList[Object.keys(root.hasList)[i]] : root.isOfList[Object.keys(root.isOfList)[i - hasLen]];
	var currentX = rootDisplay.x + rootDisplay.w + 3*xBuffer;
	c.strokeStyle = "#000000";
	c.moveTo(currentX, currentY-20);
	c.fillText(i < hasLen ? "has "+currentEdge : "is " + currentEdge+ " of", currentX, currentY);
	c.moveTo(currentX, currentY);
	currentX += 250;
	c.lineTo(currentX, currentY);
	c.stroke();
	currentX += xBuffer;
	for(var j = 0; j < currentEdgeList.length; j++){
	    var currentNode = currentEdgeList[j];
	    var nodeWidth = c.measureText(currentNode.name).width+xBuffer;
	    displays.push(new NodeDisplay(currentX, currentY, nodeWidth, 50, currentNode));
	    currentX += nodeWidth;
	}
	currentY += lineHeight;
    }
    rootDisplay.draw(c);
    for(i in displays){
	displays[i].draw(c);
    }
}

var has1 = new Node(1, "has1", 0,[],[]);
var root = new Node(0, "root", 0, {'foo':[has1]}, []);


