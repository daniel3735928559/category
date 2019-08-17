class LinkPlugin {
    constructor(){
	Vue.component('link-plugin', {
	    template: `<a href="#" v-on:click="$parent.open_snippet(node)">{{name}}</a>`,
	    props: ['node','name'],
	});

    }
    run(comp, node, root){
	if(!root) return;
	console.log("LINK",node);
        var container = document.createElement("span");

	// Parse the link info
	var doc = root.innerHTML.trim();
	var idx = doc.indexOf(":");
	var target = doc.substring(0,idx);
	var name = doc.substring(idx+1);

	// Insert the container
        root.parentNode.insertBefore(container, root);
	
	// Insert the component
	new comp.$options.components['link-plugin']({
	    el: container,
	    parent: comp,
	    propsData:{
		name:name,
		node:target
	    }
	});
    }
}
