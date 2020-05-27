query = require('./query.js').query;
search = require('./search.js').search;
fs = require('fs');
mdfile = process.argv[2];
q = process.argv[3];

fs.readFile(mdfile, function(err,data){
    if (!err) {
	var metadata = JSON.parse(data);
	console.log(JSON.stringify(search(query.parse(q), metadata)));
    }
    else {
	console.log("could not read file",mdfile);
    }
});
