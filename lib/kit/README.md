## Synopsis

Kit is a text editor that supports plugins for defining types of
structured data that can be interted into the text with their own
custom editors.  Kit was designed for use in
[category](github.com/daniel3735928559/category).

## Demo

## Usage

The content of the editor is converted into HTML according to the following rules:

### Basic syntax:

Two consecutive newlines represent a paragraph break.

### Extensions: 

Syntax supported:

[[<i>type</i>:<i>element id</i>|<i>[optional plaintext indicator of what it is]</i>]]

Inside one of these, the enter key will open the appropriate editor
for the specified type and will update the result accordingly.

**Examples:**

* For a mathematics expression: `[[math:1|x+sin(x)]]`

* For a sketch: `[[sketch:sk2|A sketch of my favourite vase]]`

## License

Kit is licensed under the [MIT License](http://opensource.org/licenses/MIT)
