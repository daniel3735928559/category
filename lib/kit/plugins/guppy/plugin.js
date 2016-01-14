KitGuppyPlugin = function(kit){
    var self = this;
    
    // Begin required attributes
    this.kit = kit; 

    this.properties = {
	'key':'Shift-Alt-M',
	'name':'Math',
	'tag':'guppy',
	'text':false
    };
    // End required attributes

    // Begin custom stuff for plugin
    
    var req = new XMLHttpRequest();
    req.onload = function(){
	var xsltProcessor = new XSLTProcessor();
	xsltProcessor.importStylesheet((new window.DOMParser()).parseFromString(this.responseText, "text/xml"));
	self.xslt = xsltProcessor;
    };
    req.open("get", "/lib/guppy/transform.xsl", true);
    req.send();

    this.widgets = {};
    this.cm_widgets = {};
    this.guppies = {};
}

KitGuppyPlugin.prototype.make_widget = function(id){
    var widget = document.createElement("div");
    // var self = this;
    // var width = 300;
    // var height = 300;
    // widget.style.position = "absolute";
    widget.style.height = "50px";
    widget.style.width = "500pxpx";
    // widget.style.border = "1px solid black";
    // widget.style.cursor = "pointer";
    widget.setAttribute('id', 'guppy'+id);
    this.widgets[id] = widget;
    this.guppies[id] = new Guppy(widget);
}

KitGuppyPlugin.prototype.create_from_doc = function(cm, id){
    this.make_widget(id);
    var cur = cm.getCursor();
    this.cm_widgets[id] = cm.addLineWidget(cur.line-1, this.widgets[id], {coverGutter: false, noHScroll: true});
}

// Required plugin functions: 

KitGuppyPlugin.prototype.render = function(node){
    console.log("ND",node);
    var expr = document.createElement("div");
    var id = node.getAttribute("id");
    var latex = this.guppies[id].get_content('latex')
    console.log("LLLL",id,latex);
    katex.render(latex,expr);
    return expr;
}

KitGuppyPlugin.prototype.insert = function(cm){
    var id = cm.kit_instance.gen_id();
    cm.replaceSelection("<guppy id=\""+id+"\">\n</guppy>");
    console.log("T",this);
    this.create_from_doc(cm, id);
}

// Required non-text plugin functions: 

KitGuppyPlugin.prototype.deserialize = function(cm, doc){
    var id = doc.getAttribute("id");
    this.create_from_doc(cm, id);
}

KitGuppyPlugin.prototype.serialize = function(doc){
    var id = doc.getAttribute("id");
    return this.guppies[id].get_content('xml');
}

KitGuppyPlugin.prototype.cleanup = function(id){
    console.log("CLEANING",id,this.widgets);
    if(id in this.cm_widgets){
	this.cm_widgets[id].clear();
    }
}

KitGuppyPlugin.prototype.edit = function(cm, change, start, end){ return ["",""] }
