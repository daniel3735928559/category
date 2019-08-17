parse = require('./query.js').parse
search = require('./search.js');
fs = require('fs');
mdfile = process.argv[2];
query = process.argv[3];

fs.readFile(mdfile, function(err,data){
    if (!err) {
	var metadata = JSON.parse(data);
	console.log(JSON.stringify(search(parse(query), metadata)));
    }
});
