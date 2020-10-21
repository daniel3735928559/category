import query from './query.mjs'
import CatGraph from './graph.mjs';

import fs from 'fs';
var mdfile = process.argv[2];
var query_str = process.argv[3];

fs.readFile(mdfile, function(err,data){
    if (!err) {
	var metadata = JSON.parse(data);
	var g = new CatGraph(metadata.nodes, metadata.edges);
	var q = query.parse(query_str);
	var ans = g.search(g.nodes, q);
	var ans_list = [];
	for(var x in ans) {
		ans_list.push(x);
	}
	console.log(JSON.stringify(ans_list));
	process.exit(0);
    }
    else{
	console.log(err);
	process.exit(1);
    }
});
