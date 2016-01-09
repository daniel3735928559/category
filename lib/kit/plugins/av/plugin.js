KitAVPlugin = function(kit){
    this.kit = kit;
    var self = this;
    this.functions = [
	{'key':'Shift-Alt-V',
	'name':"video",
	'func': function(cm) {
	    var to_insert = self.insert_video(cm.kit_instance.gen_id());
	    cm.replaceSelection(to_insert.data);
	    var cur = cm.getCursor();
	    cm.setCursor({'line':cur.line,'ch':cur.ch - to_insert.data.length + to_insert.cursor});
	}},
	{'key':'Shift-Alt-A',
	 'name':'audio',
	 'func': function(cm) {
	    var to_insert = self.insert_audio(cm.kit_instance.gen_id());
	    cm.replaceSelection(to_insert.data);
	    var cur = cm.getCursor();
	    cm.setCursor({'line':cur.line,'ch':cur.ch - to_insert.data.length + to_insert.cursor});
	 }},
	{'key':'Shift-Alt-G',
	 'name':'image',
	 'func': function(cm) {
	    var to_insert = self.insert_image(cm.kit_instance.gen_id());
	    cm.replaceSelection(to_insert.data);
	    var cur = cm.getCursor();
	    cm.setCursor({'line':cur.line,'ch':cur.ch - to_insert.data.length + to_insert.cursor});
	 }}
    ];
}

KitAVPlugin.prototype.insert_audio = function(id){
    var start = "<audio id=\""+id+"\" name=\"\">";
    var end = "</audio>";
    return {"data":start+end,"cursor":start.length};
}

KitAVPlugin.prototype.insert_video = function(id){
    var start = "<video id=\""+id+"\" name=\"\">";
    var end = "</video>";
    return {"data":start+end,"cursor":start.length};
}

KitAVPlugin.prototype.insert_image = function(id){
    var start = "<image id=\""+id+"\" name=\"\">";
    var end = "</image>";
    return {"data":start+end,"cursor":start.length};
}
