var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var filesystem = require('fs');
var cat = require('./category').category;
var args = process.argv.slice(2);

var app = express();

app.use(express.static(__dirname + '/'));
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.redirect('/page/cat.html');
});

app.post('/search', function(req, res){
    result = cat.search_string(req.body.query);
    res.send(result);
});

app.post('/get_node', function(req, res){
    console.log("NR",req.body.id);
    result = cat.nodes[req.body.id];
    result.edges = cat.get_edges(req.body.id);
    console.log("result",result);
    res.send(result);
});

app.post('/save_node', function(req, res){
    console.log("NR",req.body.id);
    cat.nodes[req.body.id] = {"data":req.body.data};
    console.log("RB",req.body);
    var result = cat.set_edges(req.body.id, req.body.edges);
    res.send(result);
    //filesystem.write_file()
});

app.post('/get_all_node_names', function(req, res){
    var names = [];
    for(var node in cat.nodes){
	names.push(node);
    }
    console.log("names", names, cat.nodes);
    res.send(names);
});

var get_ip = function(req){
    return req.header('x-forwarded-for') || req.connection.remoteAddress;
}

server = http.createServer(app).listen(3797);

console.log("Server running!");
