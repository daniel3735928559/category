# Cafe

Cafe (**Ca**tegory **f**ront**e**nd) is the web frontend to
category.

## Source tour

Because cafe uses Vue.js, the source code is all over the place in
this directory, so for my own sake, this is an index of where to find
things:

* `dist/`: The built files
* `build.sh`: The script to build cafe and populate `dist/`
* `webfonts`: Icon fonts
* `src/`: The actual application source code
  * `main.js`: The entry point for the build process and contains:
    * All imports of components or other JS code
    * The code to actually run plugins over the current node
  * `router.js`: Defines the mapping of routes to Vue components
  * `store.js`: Defines the set of things in the global state that we can
    store/retrieve and the actions available to update them
  * `components/`: All the Vue components of the application
    (including templates, behavioural definitions, and styles)
    * `edges.vue`: The display of edges associated with a particular
      node
	* `graph.vue`: Unused currently; formerly a visual display of the
      nodes
	* `history.vue`: The history panel on the sidebar
	* `labels.vue`: The display of all neighbours of a node according
      to a specific edge label
	* `nodes.vue`: The display of a single node:
	  * For nodes that contain content, the rendering of that content
	  * For nodes that do not, the menu allowing one to browse the
        nodes's edges, prioritising those with the most distinguishing
        power. (For example, restaurants may be well-distinguished by
        foods they offer, since there will be lots of overlap--many
        restaurants serve Indian food--but not so much to make it
        meaningless. They will not be well-distinguished by city if
        all your restaurants are from the same city. They will not be
        well distinguished by chef since they will all have different
        chefs (or no chef at all).)
