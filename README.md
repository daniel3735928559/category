# Category

A system for taking some markdown documents, each annotated with its
relationships to the others (when applicable), and displaying them in
a way that lets you navigate among the documents using those
relationships.

## Example

To view the example category, go to https://daniel3735928559.github.io/category

### Building

To incrementally build the example, do: 

```
./category build test
```

To rebuild the example as though from scratch, do: 

```
./category rebuild test
```

### Serving

To serve the example locally on port 1234: 

```
./category serve test -p 1234
```

### Subcategory construction

To build and serve the "roads" subcategory

```
rm -rf test_roads/*
./category subcat test test_roads roads "has category: roads"
./category serve test_roads -p 2345
```
