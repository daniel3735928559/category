rm -rf example/static/*
./category subcat --static example/cat example/static all '*'
rm -rf example/subcat/*
./category subcat --static example/cat example/subcat roads 'has category: roads / roads'
