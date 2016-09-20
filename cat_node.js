var Category = require('./category');
var MNode = require(process.env['LIBMANGOJS']+'/libmango');
var cat = new Category();

function CategoryNode(){
    var self = this;
    //process.env['MANGO_ID'] = 'cat';
    //process.env['MC_ADDR'] = 'tcp://localhost:61453';
    this.node = new MNode();
    this.node.iface.add_interface('/home/zoom/suit/mango/nodes/category/category.yaml',
				  {'search':self.excite,
				   'get_node':self.get_node,
				   'set_node':self.set_node,
				   'del_node':self.del_node,});
    this.node.ready();
}

CategoryNode.prototype.search = function(header,args){
    var result = cat.search_string(args.query);
    return result;
}

CategoryNode.prototype.get_node = function(header,args){
    var result = cat.nodes[args.id];
    result.edges = cat.get_edges(args.id);
    return result;
}

CategoryNode.prototype.set_node = function(header,args){
    cat.nodes[args.id] = {"data":args.data};
    var result = cat.set_edges(args.id, args.edges);
    return result;
}

CategoryNode.prototype.del_node = function(header,args){
    var result = cat.node_del(args.id);
    return result;
}

var c = new CategoryNode();
