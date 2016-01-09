KitCodePlugin = function(kit){
    this.kit = kit;
    var self = this;
    var req = new XMLHttpRequest();
    req.onload = function(){
	var xsltProcessor = new XSLTProcessor();
	xsltProcessor.importStylesheet((new window.DOMParser()).parseFromString(this.responseText, "text/xml"));
	self.xslt = xsltProcessor;
    };
    req.open("get", "/lib/kit/plugins/code/transform.xsl", true);
    req.send();

    this.functions = [
	{'key':'Shift-Alt-K',
	 'name':'Code',
	 'tag':"code",
	 'text':true,
	 'func': function(cm) {
	    var to_insert = self.insert();
	    cm.replaceSelection(to_insert.data);
	    var cur = cm.getCursor();
	    cm.setCursor({'line':cur.line,'ch':cur.ch - to_insert.data.length + to_insert.cursor});
	 }}
    ];
}

KitCodePlugin.prototype.render = function(node, doc){
    if(!this.xslt) return;
    var node_doc = document.implementation.createDocument("", "", null);
    node_doc.appendChild(node);
    console.log("BD",node_doc);
    return this.xslt.transformToFragment(node_doc, doc);
}

KitCodePlugin.prototype.insert = function(){
    var start = "<code>";
    var end = "</code>";
    return {"data":start+end,"cursor":start.length};
}
