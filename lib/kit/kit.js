var Kit = function(args){
    console.log("AA",args);
    var self = this;
    this.cur_id = 0;
    this.name = "";
    this.id = "";
    
    this.editor = CodeMirror.fromTextArea(args.input, {
	lineNumbers: true,
	mode: "text/xml",
	styleActiveLine: true,
	readOnly: false, 
	foldGutter: true,
	gutters: ["CodeMirror-linenumbers"]
    });
    this.editor.setOption("theme", "default");
    this.editor.kit_instance = this;
    this.editor.setSize(null, "75%");

    this.editor.on("cursorActivity", function(cm) {
	if (cm.widgetEnter) {
	    // check to see if movement is purely navigational, or if it
	    // doing something like extending selection
	    var cursorHead = cm.getCursor('head');
	    var cursorAnchor = cm.getCursor('anchor');
	    if (cursorHead.line == cursorAnchor.line && cursorHead.ch == cursorAnchor.ch) {
		cm.widgetEnter();
	    }
	    cm.widgetEnter = undefined;
	}
    });

    //this.editor.setSize(null, (this.raw.split("\n").length + 2)*(this.editor.defaultTextHeight()) + 10);
    
    this.plugin_info = Kit.setup_plugins({
	"guppy":new KitGuppyPlugin(this),
	//"checklist":new KitChecklistPlugin(this)
    });
    // = Kit.test_plugins;
    
    this.output = args.output;
    this.container = args.container;

    this.set_doc(args.data);
    this.editor.setSize(null, "auto");

    for(var b in this.plugin_info.buttons){
	var ac = document.createElement("div");
	ac.innerHTML = b;
	ac.setAttribute("class","kit_button");
	var f = function(x){
	    ac.onclick = function(){ self.plugin_info.buttons[x](self.editor); };
	}(b);
	this.container.insertBefore(ac, this.container.firstChild);
    }
    
    // Set up keys from plugins and defaults: 
    
    var key_dict = this.plugin_info.keys;
    // key_dict['Enter'] = function(cm) {
    // 	var tag = CodeMirror.findMatchingTag(cm, cm.getCursor()) || CodeMirror.findEnclosingTag(cm, cm.getCursor());
    // 	if(tag && tag.open.tag in self.plugin_info.tags && !self.plugin_info.tags[tag.open.tag].text){
    // 	    console.log("T",tag.open.tag,tag);
    // 	    var p = self.plugin_info.tags[tag.open.tag];
    // 	    self.plugin_info.plugins[p.plugin].edit(cm, tag.open.to, tag.close.from);
    // 	    return;
    // 	}
    // 	return CodeMirror.Pass;
    // };
    key_dict['Ctrl-Enter'] = function(cm) {
	console.log("going");
	self.output(self.render(),true);
    };
    
    this.output(self.render(),false);
    this.editor.setOption("extraKeys", key_dict);
}

Kit.setup_plugins = function(plugins){
    var keys = {};
    var buttons = {};
    var tags = {};
    for(var p in plugins){
	var plugin = plugins[p];
	console.log(plugin);
	var props = plugin.properties;
	var f = function(plugin){
	    if(!(props.key in keys)) keys[props.key] = function(cm){ plugin.insert.call(plugin,cm) };
	    if(!(props.name in buttons)) buttons[props.name] = function(cm){ plugin.insert.call(plugin,cm) };
	    if(!(props.tag in tags)) tags[props.tag] = {"plugin_name":p,"text":props.text};
	}(plugin);
    }
    console.log(buttons);
    return {"plugins":plugins,
	    "keys":keys,
	    "buttons":buttons,
	    "tags":tags}
}

Kit.test_plugins = Kit.setup_plugins({//"argument":new KitArgumentPlugin(),
				      //"av":new KitAVPlugin(),
				      "guppy":new KitGuppyPlugin(),
				      //"checklist":new KitChecklistPlugin(),
				      //"code":new KitCodePlugin(),
				      //"draw":new KitDrawPlugin(),
				      //"category":new KitCategoryPlugin()
				     });

Kit.prototype.gen_id = function(){
    return ++this.cur_id;
}

Kit.prototype.get_links = function(){

}

Kit.prototype.get_text = function(){
    for(var p in this.plugin_info.plugins){
	var plugin = this.plugin_info.plugins[p];
	console.log("PCPC",p,plugin.cm_marks);
	plugin.serializeAll(this.editor);
    }
    var doc = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><node name=\"\">"+this.editor.getValue()+"</node>";
    var base = (new window.DOMParser()).parseFromString(doc, "text/xml");
    return (new XMLSerializer()).serializeToString(base.documentElement);
}

Kit.prototype.get_ids = function(){

}

Kit.prototype.set_doc = function(doc){
    var root = (new window.DOMParser()).parseFromString(doc, "text/xml");
    var base = root.documentElement;
    this.name = base.getAttribute("name");
    this.id = base.getAttribute("id");

    docs = {};
    idx = 0
    prefix = "WIDGET#"
    
    for(var t in this.plugin_info.tags){
	var plugin = this.plugin_info.plugins[this.plugin_info.tags[t].plugin_name];
	if(!plugin.properties.text){
	    var nodes = base.getElementsByTagName(t);
	    for(var i = 0; i < nodes.length; i++){
		docs[prefix+idx] = {"plugin":plugin,"doc":nodes[i].cloneNode(true),"id":nodes[i].getAttribute("id")}
		nodes[i].parentNode.replaceChild(root.createTextNode(prefix+idx), nodes[i]);
		idx++;
	    }
	}
    }
    console.log(docs);

    var text = "";
    for(var n = base.firstChild; n != null; n = n.nextSibling){
	text += (new XMLSerializer()).serializeToString(n);
    }
    this.editor.setValue(text);
    for(var d in docs){
	cur = this.editor.getSearchCursor(d);
	cur.findNext()
	console.log("CUR",cur);
	docs[d].plugin.deserialize(this.editor, docs[d].doc, {"from":cur.from(), "to":cur.to()});
	//cur.replace("");
    }
}

Kit.prototype.render = function(){
    var doc = this.get_text();
    var base = (new window.DOMParser()).parseFromString(doc, "text/xml");
    console.log(doc,base);
    for(var t in this.plugin_info.tags){
	var plugin = this.plugin_info.plugins[this.plugin_info.tags[t].plugin_name];
	var nodes = base.getElementsByTagName(t);
	console.log("AAA",t,this.plugin_info.tags[t],nodes.length);
	while(nodes.length > 0){
	    var r = plugin.render(nodes[0].cloneNode(true), base);
	    var par = document.createElement("span");
	    par.appendChild(r);
	    console.log(nodes,nodes.length,"A");
	    nodes[0].parentNode.replaceChild(par, nodes[0]);
	    console.log(nodes,nodes.length,"B");
	}
	console.log(base);
    }
    var output = document.createElement("span");
    var content = "";
    var node = base.documentElement.firstChild;
    while(node != null){
	content += (new XMLSerializer()).serializeToString(node);
	node = node.nextSibling;
    }
    console.log("CONTENT",content);
    output.innerHTML = marked(content);
    return output;
}
