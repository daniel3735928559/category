class QueryPlugin {
    constructor(){
	Vue.component('query-plugin-result', {
	    template: `<ul class="category-query-plugin-result">
  <li v-for="node in $parent.sorted_nodes(nodes)">
    <node-link v-on:click="$parent.open_snippet" :name="$parent.nodes[node].name" :node="node"></node-link>
  </li>
</ul>`,
	    props: ["nodes"],
	    methods: {
		sorted_nodes: sorted_nodes
	    }
	});

    }
    run(comp, node, root){
	if(!root) return;
        var container = document.createElement("span");

	// Parse the link info
	var query_text = root.innerHTML.trim();
	var q = query.parse(query_text);
	var query_result = search(q, comp.nodes);

	// Insert the container
        root.parentNode.insertBefore(container, root);
	
	// Insert the component
	new comp.$options.components['query-plugin-result']({
	    el: container,
	    parent: comp,
	    propsData:{
		nodes:query_result
	    }
	});
    }
}
