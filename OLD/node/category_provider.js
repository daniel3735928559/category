var mongo = require('mongojs')
var crypto = require('crypto');

CategoryProvider = function(host, port) {
    this.db = mongo.connect("categorydb", ["nodes","edges","users","tokens","tickertape"]);
    this.expiration_delay = 1000*60*60*24;
    this.reap();
};

CategoryProvider.prototype.reap = function(){
    var now = (new Date()).getTime();
    console.log(now);
    var self = this;
    this.db.tokens.find(function(error, results) {
	if(error) console.log(error);
	else {
	    for(var t in results){
		console.log(results[t].expiry_time);
		if(results[t].expiry_time < now){
		    self.db.tokens.remove(results[t],1);
		}
	    }
	}
    });
    
    this.token_reaper = setTimeout(this.reap, this.expiration_delay);
}
   
CategoryProvider.prototype.get_nodes = function(callback) {
    this.db.nodes.find(function(error, results) {
	if(error) callback(error)
	else {
	    if(error) callback(error.toString())
	    else callback(null, results)
	}
    });
};

CategoryProvider.prototype.get_edges = function(callback) {
    this.db.edges.find(function(error, results) {
	if(error) callback(error)
	else {
	    if(error) callback(error.toString())
	    else callback(null, results)
	}
    });
};

CategoryProvider.prototype.verify_user = function(user_data, callback) {
    var now = (new Date()).getTime();
    var self = this;
    this.db.tokens.findOne({"index":user_data.index,"username":user_data.username}, function(error, result) {
	if(error) callback(1)
	else if(!result) callback(2);
	else if(result['expiry_time'] < now){
	    console.log("removing",JSON.stringify(result));
	    self.db.tokens.remove(result,1);
	    callback(3);
	}
	else if(result['username'] != user_data.username) callback(4);
	else if(result['ip'] != user_data.ip) callback(5);
	else callback(0)
    });
}

CategoryProvider.prototype.login = function(username, password, ip, callback) {
    var self = this;
    self.db.users.findOne({"username":username}, function(error, results){
	if(error){
	    console.log("error ",error);
	    callback(error, null)
	    return;
	}
	if(results != null && 'password' in results && 'salt' in results && results['password'] == crypto.createHash('sha256').update(results.salt + password,'ascii').digest('hex')){
	    console.log("SUCCESS!");
	    var new_token = gen_token(username);
	    var index = gen_index(username);
	    self.db.tokens.save({"username":username,"expiry_time":(new Date()).getTime()+self.expiration_delay,"token":new_token,"index":index,"ip":ip});
	    callback(null, {"success":1,"token":new_token,"index":index});
	}
	else{
	    console.log("FAIL!");
	    callback(null, {"success":0});
	}
    });
};

CategoryProvider.prototype.logout = function(user_data, callback) {
    var self = this;
    self.verify_user(user_data, function(authorised) {
    	if(authorised != 0) callback("Unauthorised: " + authorised.toString())
    	else {
	    self.db.tokens.remove({"index":user_data.index,"username":user_data.username},1);
	    callback(null, {"success":1});
	}
    });
};

var gen_index = function(username) {
    return username+(new Buffer(crypto.randomBytes(10)).toString('base64'));
}

var gen_token = function(username) {
    return new Buffer(crypto.randomBytes(64)).toString('base64');
}

CategoryProvider.prototype.add_node = function(user_data, par_id, text, callback) {
    var self = this;
    self.verify_user(user_data, function(authorised) {
    	if(authorised != 0) callback("Unauthorised: " + authorised.toString())
    	else {
	    var node_obj = {"timestamp":(new Date()).getTime()};
	    self.db.tickertape.save(node_obj);
	    self.db.nodes.save(commennode_obj);
    	    callback(null, comment_obj);
    	}
    });
};

CategoryProvider.prototype.add_edge = function(user_data, par_id, text, callback) {
    var self = this;
    self.verify_user(user_data, function(authorised) {
    	if(authorised != 0) callback("Unauthorised: " + authorised.toString())
    	else {
	    var edge_obj = {};
	    self.db.tickertape.save(edge_obj);
	    self.db.edges.save(edge_obj);
    	    callback(null, edge_obj);
    	}
    });
};

CategoryProvider.prototype.del_node = function(user_data, cid, callback) {
    console.log(user_data.token, cid);
    var query_obj = {"_id":this.db.ObjectId(cid)};
    console.log(JSON.stringify(query_obj));
    var self = this;
    self.verify_user(user_data, function(authorised) {
    	if(authorised != 0) callback("Unauthorised: " + authorised.toString())
    	else {
	    var un = user_data.username;
	    console.log("un",un);
	    self.db.nodes.findOne(query_obj, function(error, result){
		if(result) console.log(result['author'], JSON.stringify(query_obj));
		if(!result) callback(error);
		else if(result['author'] != un) callback("Not your comment");
		else{
		    self.db.comments.remove(query_obj, 1);
		    callback(null, query_obj);
		}
	    });
    	}
    });
};

CategoryProvider.prototype.del_edge = function(user_data, cid, callback) {
    console.log(user_data.token, cid);
    var query_obj = {"_id":this.db.ObjectId(cid)};
    console.log(JSON.stringify(query_obj));
    var self = this;
    self.verify_user(user_data, function(authorised) {
    	if(authorised != 0) callback("Unauthorised: " + authorised.toString())
    	else {
	    var un = user_data.username;
	    console.log("un",un);
	    self.db.edges.findOne(query_obj, function(error, result){
		if(result) console.log(result['author'], JSON.stringify(query_obj));
		if(!result) callback(error);
		else if(result['author'] != un) callback("Not your comment");
		else{
		    self.db.comments.remove(query_obj, 1);
		    callback(null, query_obj);
		}
	    });
    	}
    });
};

exports.CategoryProvider = CategoryProvider;
