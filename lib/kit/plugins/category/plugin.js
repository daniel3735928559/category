KitCategoryPlugin = function(kit){
    this.kit = kit;
    var self = this;
    this.keys = {
	'Shift-Alt-I': function(cm) {
	    var to_insert = self.insert_link("is");
	    cm.replaceSelection(to_insert.data);
	    var cur = cm.getCursor();
	    cm.setCursor({'line':cur.line,'ch':cur.ch - to_insert.data.length + to_insert.cursor});
	},
	'Shift-Alt-H': function(cm) {
	    var to_insert = self.insert_link("has");
	    cm.replaceSelection(to_insert.data);
	    var cur = cm.getCursor();
	    cm.setCursor({'line':cur.line,'ch':cur.ch - to_insert.data.length + to_insert.cursor});
	},
	'Shift-Alt-Q': function(cm) {
	    var to_insert = self.insert_query();
	    cm.replaceSelection(to_insert.data);
	    var cur = cm.getCursor();
	    cm.setCursor({'line':cur.line,'ch':cur.ch - to_insert.data.length + to_insert.cursor});
	},
	'Shift-Alt-L': function(cm) {
	    var to_insert = self.insert_include();
	    cm.replaceSelection(to_insert.data);
	    var cur = cm.getCursor();
	    cm.setCursor({'line':cur.line,'ch':cur.ch - to_insert.data.length + to_insert.cursor});
	}
    }
}

KitCategoryPlugin.prototype.insert_link = function(type){
    var start = "<"+type+" type=\"\" target=\"\">";
    var end = "</"+type+">";
    return {"data":start+end,"cursor":start.length};
}

KitCategoryPlugin.prototype.insert_query = function(type){
    var start = "<query>";
    var end = "</query>";
    return {"data":start+end,"cursor":start.length};
}

KitCategoryPlugin.prototype.insert_include = function(type){
    var start = "<include node_id=\"\">";
    var end = "</include>";
    return {"data":start+end,"cursor":start.length};
}
