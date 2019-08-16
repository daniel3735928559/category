./node_modules/.bin/jison query.jison -m js -o js/query.js
./node_modules/.bin/jison query.jison -m commonjs -o module/query.js
cat js/search.js > module/search.js
echo "module.exports = search" >> module/search.js
