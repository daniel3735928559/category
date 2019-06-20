# Category

## Goals

Easily create and store rich snippets of information in a way that makes
them discoverable, shareable,

Specifically: 

* *Snippets*: We want to be able to make these documents in whatever
  form is most convenient. Currently, this means markdown (since it is
  easily written) and XML (since it is easily manipulated).

* *Rich*: We want the documents to be able to easily express content
  in a way that it will be easy to consume. For example, it should be
  easy to incorporate into documents such elements as: 
  
  * Annotated mathematical formulas
  
  * Slideshows for images
  
  * Video with captions at specified timestamps
  
* *Discoverable*: Content needs to be tagged in some way to make it
  findable. We make it easy to tag documents by their relationships to
  other documents, and to search based on these relationships using a
  graph-based query language.

* *Shareable*: We want to be able to take a sub-collection of
  documents (say, specified by a search query) and pull out exactly
  that content so it can be separately published. 
  
  This way, no complex per-document access-control mechanism is
  required; simply use a query to airlift out exactly the files
  relevant for publication.

## Example

To view the static example category: 

[http://daniel3735928559.github.io/category/example/static/](http://daniel3735928559.github.io/category/example/static/)

## Quick Start

To test-drive the example category locally:

```
git clone https://github.com/daniel3735928559/category.git
cd category
pip install -r requirements.txt
python3 category serve example/cat -p 1234
```

Then navigate in a browser to [http://localhost:1234](http://localhost:1234)

## Building

To incrementally build the example (only updating changed files), do: 

```
python3 category build example/cat
```

To rebuild the example as though from scratch, do: 

```
python3 category rebuild example/cat
```

## Serving

To serve the example locally on port 1234, binding to loopback only
(which is the default anyways): 

```
python3 category serve example/cat -p 1234 -a 127.0.0.1
```

## Building a subcategory

To build and serve a subcategory of the example category in
`example/cat`, except with only things with category "roads", do:

```
mkdir roads_subcat
python3 category subcat example/cat roads_subcat roads "has category: roads / roads"
python3 category serve roads_subcat -p 1234
```

## Building a statically servable subcategory

To build and serve a static version of the above subcategory

```
mkdir static_subcat
python3 category subcat --static example/cat static_subcat roads "has category: roads / roads"

# Now statically serve the subcategory
cd static_subcat
python3 -m http.server 1234
```

## Building a statically servable version of your entire category

To build and serve a static version of your entire category, simply do:

```
mkdir static_cat
python3 category subcat --static example/cat static_cat everything "*"

# Now statically serve the subcategory
cd static_cat
python3 -m http.server 1234
```

## Documentation

```
Category

Usage: 
  category init <path> <name>
  category build <path>
  category rebuild <path>
  category subcat [--static] <path> <subcat_path> <subcat_name> <query>
  category serve <path> [(-p <port>)] [(-a <bind_addr>)]

Options:
  -p port (default: 7688)
  -a address to bind (default: 127.0.0.1)
```
