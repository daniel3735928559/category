var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var filesystem = require('fs');
var cat = require('./category').category;

var args = process.argv.slice(2);

var accessLogStream = filesystem.createWriteStream(__dirname + '/logs/access.log', {flags: 'a'})

var app = express();

morgan.token('remote-addr',function(req,res){ return get_ip(req); });
morgan.token('remote-user',function(req,res){ return req.headers['proxy-user']; });
app.use(morgan('combined', {stream: accessLogStream}));
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
    res.send(result);
});


var get_ip = function(req){
    return req.header('x-forwarded-for') || req.connection.remoteAddress;
}

server = http.createServer(app).listen(3797);

console.log("Server running!");
