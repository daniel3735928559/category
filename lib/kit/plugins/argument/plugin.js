KitArgumentPlugin = function(){
    var self = this;
    var req = new XMLHttpRequest();
    req.onload = function(){
	var xsltProcessor = new XSLTProcessor();
	xsltProcessor.importStylesheet((new window.DOMParser()).parseFromString(this.responseText, "text/xml"));
	self.xslt = xsltProcessor;
    };
    req.open("get", "/lib/kit/plugins/argument/transform.xsl", true);
    req.send();
    this.functions = [
	{'key':'Shift-Alt-S',
	 'name':"Statement",
	 'tag':"statement",
	 'text':true,
	 'func':function(cm) {
	     var to_insert = self.insert("statement", cm.kit_instance.gen_id());
	     cm.replaceSelection(to_insert.data);
	     var cur = cm.getCursor();
	     cm.setCursor({'line':cur.line,'ch':cur.ch - to_insert.data.length + to_insert.cursor});
	 }},
	{'key':'Shift-Alt-P',
	 'name':"Proof",
	 'tag':"proof",
	 'text':false,
	 'func': function(cm) {
	     var to_insert = self.insert("proof", cm.kit_instance.gen_id());
	     cm.replaceSelection(to_insert.data);
	     var cur = cm.getCursor();
	     cm.setCursor({'line':cur.line,'ch':cur.ch - to_insert.data.length + to_insert.cursor});
	 }},
	{'key':'Shift-Alt-D',
	 'name':"Definition",
	 'tag':"definition",
	 'text':true,
	 'func': function(cm) {
	     var to_insert = self.insert("definition", cm.kit_instance.gen_id());
	     console.log(self.kit);
	     cm.replaceSelection(to_insert.data);
	     var cur = cm.getCursor();
	     cm.setCursor({'line':cur.line,'ch':cur.ch - to_insert.data.length + to_insert.cursor});
	 }}
    ];
}

KitArgumentPlugin.prototype.edit = function(cm, start, end){
    console.log(cm.getRange(start, end));
    return ["hello"];
}

KitArgumentPlugin.prototype.render = function(node, doc){
    if(!this.xslt) return;
    var node_doc = document.implementation.createDocument("", "", null);
    node_doc.appendChild(node);
    console.log("BD",node_doc);
    return this.xslt.transformToFragment(node_doc, doc);
}

KitArgumentPlugin.prototype.insert = function(type, id){
    var start = "<"+type+" id=\""+id+"\">";
    var end = "</"+type+">";
    return {"data":start+end,"cursor":start.length};
}
