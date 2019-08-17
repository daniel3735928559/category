../../../node_modules/.bin/jison query.jison -m js -o js/query.js
#../../../node_modules/.bin/jison query.jison -m commonjs -o module/query.js
cat js/search.js > module/search.js
cat js/query.js > module/query.js
echo "module.exports = search" >> module/search.js
echo "module.exports = query" >> module/query.js
