var query = require('./query').query;
var search = require('./search').search;
fs = require('fs');
mdfile = process.argv[2];
q = process.argv[3];

fs.readFile(mdfile, function(err,data){
    if (!err) {
	var metadata = JSON.parse(data);
	console.log(JSON.stringify(search(query.parse(q), metadata)));
	process.exit(0);
    }
    else{
	console.log(err);
	process.exit(1);
    }
});
