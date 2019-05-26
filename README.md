# Category

A system for taking some markdown documents, each annotated with its
relationships to the others (when applicable), and displaying them in
a way that lets you navigate among the documents using those
relationships.

## Example

To view the static example category: 

[http://daniel3735928559.github.io/cateogry/example/static/](http://localhost:1234)

## Quick Start

To test the example category:

```
git clone https://github.com/daniel3735928559/category.git
cd category
pip install -r requirements.txt
python3 category serve test -p 1234
```

Then navigate in a browser to [http://localhost:1234](http://localhost:1234)

## Building

To incrementally build the example (only updating changed files), do: 

```
python3 category build test
```

To rebuild the example as though from scratch, do: 

```
python3 category rebuild test
```

## Serving

To serve the example locally on port 1234: 

```
python3 category serve test -p 1234
```

## Building a subcategory

To build and serve a subcategory of just the things with category
"roads", do:

```
mkdir my_subcat
python3 category subcat test my_subcat roads "has category: roads"
python3 category serve my_subcat -p 1234
```
