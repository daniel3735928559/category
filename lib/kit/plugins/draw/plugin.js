KitDrawPlugin = function(kit){
    this.kit = kit;
    var self = this;

    this.widgets = {};
    this.painting = {};
    this.mouse = {};
    
    this.functions = [
	{'key':'Shift-Alt-W',
	 'name':'Drawing',
	 'tag':"draw",
	 'text':false,
	 'func': function(cm) {
	     var id = cm.kit_instance.gen_id();
	     cm.replaceSelection("<draw id=\""+id+"\">\n</draw>");
	     self.make_widget(id);
	     var cur = cm.getCursor();
	     cm.addLineWidget(cur.line-1, self.widgets[id], {coverGutter: false, noHScroll: true})
	     
	 }}
    ];
}

KitDrawPlugin.prototype.make_widget = function(id){
    var widget = document.createElement("div");
    var self = this;
    var width = 300;
    var height = 300;
    //widget.style.position = "absolute";
    widget.style.height = height+"px";
    widget.style.width = width+"px";
    widget.style.border = "1px solid black";
    widget.style.cursor = "pointer";
    canvas = document.createElement('canvas');
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    canvas.setAttribute('id', 'canvas'+id);
    widget.appendChild(canvas);
    context = canvas.getContext("2d");
    context.fillStyle = "black";;
    context.strokeStyle = "black";
    context.lineWidth = 1;
    var rad = 1;
    var evt_down = function(e){
	context.beginPath();
	var rect = canvas.getBoundingClientRect();
	var X = 0;
	var Y = 0;
	if(e.touches && e.touches.length == 1){
	    console.log("hi");
	    X = touch.pageX-touch.target.offsetLeft;
	    Y = touch.pageY-touch.target.offsetLeft;
	    e.preventDefault();
	}
	else{   
	    X = e.clientX - rect.left;
	    Y = e.clientY - rect.top;
	}
	context.arc(X, Y, rad, 0, 2 * Math.PI, false);
	context.fill();
	self.painting[id] = true;
	self.mouse[id] = {"x":X,"y":Y};
    }
    var evt_move = function(e){
	if(!self.painting[id]) return;
	var rect = canvas.getBoundingClientRect();
	var X = 0, Y = 0;
	if(e.touches && e.touches.length == 1){
	    X = touch.pageX-touch.target.offsetLeft;
	    Y = touch.pageY-touch.target.offsetLeft;
	    e.preventDefault();
	}
	else{   
	    X = e.clientX - rect.left;
	    Y = e.clientY - rect.top;
	}
	context.beginPath();
	context.moveTo(self.mouse[id].x, self.mouse[id].y);
	context.lineTo(X,Y);
	context.stroke();
	self.mouse[id] = {"x":X,"y":Y};
    }
    var evt_up = function(e){
	self.painting[id] = false;
    }
    canvas.addEventListener("mousedown",evt_down);
    canvas.addEventListener("mousemove",evt_move);
    canvas.addEventListener("mouseup",evt_up);
    canvas.addEventListener("mouseleave",evt_up);
    canvas.addEventListener("touchmove",evt_move, false);
    canvas.addEventListener("touchstart",evt_down, false);
    this.widgets[id] = widget;
    this.painting[id] = false;
    this.mouse[id] = {};
}

KitDrawPlugin.prototype.cleanup = function(id){
    if(id in this.widgets){
	var widget = this.widgets[id];
	widget.parentNode.removeChild(widget);
    }
}

KitDrawPlugin.prototype.render = function(node, doc){
    var id = node.getAttribute("id");
    var canvas = this.widgets[id].getElementsByTagName("canvas")[0];
    var data = canvas.toDataURL();
    console.log("DATA",id,data)
    var img = document.createElement("img");
    img.setAttribute("src",data);
    img.setAttribute("border","1px");
    return img;
}

KitDrawPlugin.prototype.edit = function(){ return ["",""] }

KitDrawPlugin.prototype.insert = function(){
    var start = "<draw>";
    var end = "</draw>";
    return {"data":start+end,"cursor":start.length};
}
