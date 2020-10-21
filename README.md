# Category

## Goals

Easily create and store **rich** **snippets** of information in a way that makes
them **discoverable** and **shareable**.

Specifically: 

* *Rich*: We want the documents to be able to easily express content
  in a way that it will be easy to consume. For example, it should be
  easy to incorporate into documents such elements as: 
  
  * Annotated mathematical formulas
  
  * Slideshows of images
  
  * Video with captions at specified timestamps

* *Snippets*: We want it to be easy to take a couple sentences, a
  single file, a quick thught, and ingest that into the system without
  too much more work than scribbling a post-it.

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

### Setting up

Make sure you've installed `pandoc` using your favourite package manager. Then run:

```
git clone https://github.com/daniel3735928559/category.git
cd category
# Here, set up any python3 virtualenv if desired
source install.sh
```

### Start your own category

Pick a path for your category. Ideally, this should be an empty or
non-existent directory, else things may be overwritten. We'll use
`~/cat`

```
./category init ~/cat
```

Answer the questions. Unless you are planning to immediately import
thousands of nodes, there is no need to use arangodb. 

To view your blank category in a browser, run: 

```
./category serve ~/cat -p 5000 -a 127.0.0.1
```

and navigate to [http://localhost:5000](http://localhost:5000).

### Adding nodes from the web interface

From the web interface, click the "+" button at the top. This will
open an instance of the editor you configured earlier. This file must
start with an info block, and then may be followed by arbitrary
content, such as:

~~~
```info
name: My new node
```

Some content goes here
~~~

Save this as a `.md` file anywhere within `~/cat/src` and when you
close the editor, the category should be automatically rebuilt and you
can refresh the page to see the results.

### Adding nodes by hand

All your nodes are stored in `~/cat/src`. All markdown (`.md`) files
in any subdirectory of this folder that contain a valid `info` block
at the start will be treated as nodes. The simplest node, then, looks
like this:

~~~
``` info
name: This is an example node
```

This is the body of the node
~~~

If you save this in `~/cat/src/test.md` and then run the below command
to include the node in your category.

```
./category rebuild ~/cat
```

Now refresh the web interface and you should see your new node appear!

## Building a subcategory

To build and serve a subcategory of the example category in
`example/cat`, except with only things with category "roads", say in
te folder `/home/user/onlyroads` do:

```
python3 category subcat example/cat "has category: roads / roads" /home/user/onlyroads
python3 category serve /home/user/onlyroads -p 1234
```

## Building a statically servable subcategory

To build and serve a static version of the above subcategory, say from
the folder `/home/user/public_html/cat` simply do:

```
python3 category subcat --static example/cat "has category: roads / roads" /home/user/public_html/cat

# Now statically serve the subcategory
cd /home/user/public_html/cat
python3 -m http.server 1234
```

## Building a statically servable version of your entire category

To build and serve a static version of your entire category, say from
the folder `/home/user/public_html/cat` simply do:

```
python3 category subcat --static example/cat "*" /home/user/public_html/cat

# Now statically serve the subcategory
cd /home/user/public_html/cat
python3 -m http.server 1234
```

## Documentation

```
Category

Usage: 
  category init <path>
  category rebuild <path>
  category subcat [--static] <path> <query> <subcat_path>
  category query <path> <query> [--json | --name | --src | --edit | (--pdf <pdf_path>)]
  category serve <path> [(-p <port>)] [(-a <bind_addr>)]
```
