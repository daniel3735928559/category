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


    this.make_widget = function(id){
	var widget = document.createElement("div");
	widget.style.minHeight = "10px";
	widget.style.minWidth = "10px";
	widget.style.textAlign = "center";
	widget.style.display = "inline-block";
	widget.style.padding = "5px 5px";
	widget.setAttribute('id', 'guppy'+id);
	self.widgets[id] = widget;
	self.guppies[id] = new Guppy(widget,{
	    'right_callback':function(){ self.exit(id, 'right'); },
	    'left_callback':function(){ self.exit(id, 'left'); }
	});
    }

    this.create_from_doc = function(cm, id, doc){
	console.log("CFD",id, doc);
	self.make_widget(id);
	if(doc){
	    self.guppies[id].set_content(doc);
	}
    }

    
    this.widgets = {};
    this.cm_marks = {};
    this.guppies = {};
}

// Required plugin functions: 

KitGuppyPlugin.prototype.render = function(node){
    console.log("ND",node);
    var expr = document.createElement("span");
    var id = node.getAttribute("id");
    var latex = this.guppies[id].get_content('latex')
    console.log("LLLL",id,latex);
    katex.render(latex,expr);
    return expr;
}

KitGuppyPlugin.prototype.insert = function(cm, id, loc, doc){
    var self = this;
    if(!id) id = cm.kit_instance.gen_id();
    if(loc) cm.setSelection(loc.from, loc.to);
    console.log("T",this);
    this.create_from_doc(cm, id, doc);
    cm.replaceSelection("\u2af7"+cm.getSelection()+"\u2af8", "around");
    var from = cm.getCursor("from");
    var to = cm.getCursor("to");
    console.log("WWW",this.widgets[id])
    var mark = cm.markText(from, to, {replacedWith: this.widgets[id], clearWhenEmpty: false});
    this.cm_marks[id] = mark;
    CodeMirror.on(mark, "beforeCursorEnter", function(e) {
	// register the enter function
	// the actual movement happens if the cursor movement was a plain navigation
	// but not if it was a backspace or selection extension, etc.
	var direction = (cm.getCursor().line == mark.find().from.line &&
			 cm.getCursor().ch == mark.find().from.ch) ?
	    'left' : 'right';
	cm.widgetEnter = function(){
	    self.enter(cm, id, direction);
	}
    });

    cm.setCursor(to);
    cm.refresh();
}

KitGuppyPlugin.prototype.enter = function(cm, id, direction){
    if(id in this.guppies){
	console.log("activating",id,direction);
	this.guppies[id].activate();
    }
    else {
	console.log("not activating",id,direction);
	cm.refresh();
    }
}

KitGuppyPlugin.prototype.exit = function(id, direction){
    var cm = this.kit.editor;
    if(id in this.cm_marks){
	var range = this.cm_marks[id].find();
	cm.focus();
	if (direction === 'left') {
            cm.setCursor(range.from);
	}
	else {
            cm.setCursor(range.to);
	}
	this.guppies[id].deactivate();
	cm.refresh();
    }
}

// Required non-text plugin functions: 

KitGuppyPlugin.prototype.deserialize = function(cm, doc, loc){
    console.log("DSZ",doc,loc);
    this.insert(cm, doc.getAttribute("id"), loc, doc.innerHTML);
}

KitGuppyPlugin.prototype.serialize = function(id){
    return this.guppies[id].get_content('xml');
}

KitGuppyPlugin.prototype.serializeAll = function(cm){
    for(var id in this.cm_marks){
	console.log(id);
	var mark = this.cm_marks[id];
	if(mark.find()){
	    var range = mark.find();
	    var tag = this.properties.tag;
	    var text = "<" + tag + " id=\"" + id + "\">" + this.serialize(id) + "</" + tag + ">";
	    console.log(text,range.from, range.to);
	    cm.replaceRange(text, range.from, range.to);
	}
	// delete this.cm_marks[id];
	// delete this.guppies[id];
	// delete this.widgets[id];
    }
}

KitGuppyPlugin.prototype.cleanup = function(id){
    console.log("CLEANING",id,this.widgets);
    if(id in this.cm_widgets){
	this.cm_widgets[id].clear();
    }
}

KitGuppyPlugin.prototype.edit = function(cm, change, start, end){ return ["",""] }
