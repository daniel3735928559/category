KitChecklistPlugin = function(){
    var self = this;
    var req = new XMLHttpRequest();
    req.onload = function(){
	var xsltProcessor = new XSLTProcessor();
	xsltProcessor.importStylesheet((new window.DOMParser()).parseFromString(this.responseText, "text/xml"));
	self.xslt = xsltProcessor;
    };
    req.open("get", "/lib/kit/plugins/checklist/transform.xsl", true);
    req.send();
    this.properties = 
	{'key':'Shift-Alt-C',
	 'name':'Checklist',
	 'tag':"checklist",
	 'text':true
	};
}

KitChecklistPlugin.prototype.render = function(node, doc){
    if(!this.xslt) return;
    var node_doc = document.implementation.createDocument("", "", null);
    node_doc.appendChild(node);
    console.log("BD",node_doc);
    return this.xslt.transformToFragment(node_doc, doc);
}

KitChecklistPlugin.prototype.insert = function(cm){
    var start = "<checklist id=\""+cm.kit_instance.gen_id()+"\">\n  <item>"
    var end = "</item>\n</checklist>";
    cm.replaceSelection(start+end);
    var cur = cm.getCursor();
    cm.setCursor({'line':cur.line-1,'ch':8});
}
