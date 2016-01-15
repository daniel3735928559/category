## Category

TODOs (provisional assignments):

* daniel3735928559:
  * Give order to active nodes (newest on top)
  * Kit AV plugin
  * Kit file plugin (and file upload)
  * Kit query plugin
  * [DONE checklist] Fix checklist, arg, code plugins to conform to new architecture 
  * [DONE guppy] Fix kit guppy, draw plugins (make them store data in text)
  * Make ctrl-enter work in edge editing fields
  * XPath searching  
  * Deal with edges made to non-existent nodes (possibly disallow)
  * Fix undo with widgets (at minimum: clear undo history after deserializing plugin data)

* lalitkumarj:
  * Add/delete node
  * Rename node
  * Autocomplete on searches
  * Autocomplete on edge targets
  * Autocomplete on edge names
  * Save nodes to disk
  * Save edges to disk

Other tasks:

* Fix CSS

### Kit plugin structure

Each plugin requires properties (found in this.properties in the plugin class):
* `key`: The keystroke used to insert an instance
* `name`: The string displayed on the button that can be used to insert an instance
* `tag`: The name of the XML tag corresponding to an instance of the plugin
* `text`: A boolean stating whether the plugin's content is defined as plain-text or not

Each plugin object needs functions:
* `insert(cm)`: Insert a new instance of itself into a codemirror instance at the current selection point
* `render(node)`: Render an XML node corresponding to an instance of that plugin

In addition, plugins that are not plain text need:
* `cleanup(id)`: Clean up any widgets associated with the instanced of given id (called when instance is removed)
* `deserialize(cm, doc)`: Create an instance in the given editor using the given serialization
* `serialize(doc)`: Serialise the content from the given instance
* `edit(cm, change, id, start, end)`: Define what to do with an intercepted edit action (change) on the tag