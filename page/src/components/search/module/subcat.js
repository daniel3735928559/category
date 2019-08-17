Query = require('./query.js');
search = require('./search.js');
fs = require('fs');
mdfile = process.argv[2];
query = process.argv[3];

var parser = new Query.Parser();

fs.readFile(mdfile, function(err,data){
    if (!err) {
	var metadata = JSON.parse(data);
	console.log(JSON.stringify(search(parser.parse(query), metadata)));
	process.exit(0);
    }
    else{
	console.log(err);
	process.exit(1);
    }
});
