class MathPlugin {
    constructor(){
	this.current_id = 0;
	this.docs = {};
	this.index = {}; // Will store {node_id:{element_name:[formula tags containing element]}}
	Guppy.init({"path":"/node_modules/guppy-js","symbols":"/node_modules/guppy-js/sym/symbols.json"});
	Vue.component('math-plugin', {
	    template: `
<span class="category-math-plugin">
  <span class="category-math-plugin-math" v-on:click="display_syms = !display_syms" v-html="rendered"></span>
  <div class="category-math-plugin-vars" v-if="display_syms">
  Vars:
  <ul>
    <li v-for="e in syms">
      <a href="#" v-on:click="math_query(e)">{{e}}</a>
    </li>
  </ul>
  </div>
</span>`,
	    props: ["syms","id","display_syms","rendered","master"],
	    methods: {
		math_query: this.query
	    }
	});
    }
    query(q){
	console.log(q);
    }
    run(comp, node, root){
	var doc_id = this.current_id++;
	var content = root.innerHTML.trim()
	console.log("R",root,content);
	var res = Guppy.Doc.render(content, "text");
	res.container.setAttribute("id","category-math-container-"+doc_id.toString());
	this.docs[doc_id] = res.doc.get_vars().concat(res.doc.get_symbols());
	var rendered_content = (new XMLSerializer()).serializeToString(res.container);
	var container = document.createElement("span");
	
	// Put this doc_id in the index for each var and symbol in the document
	for(var i = 0; i < this.docs[doc_id].length; i++) {
	    var v = this.docs[doc_id][i];
	    if (!this.index[v]) this.index[v] = [];
	    this.index[v].push(doc_id);
	}
        root.parentNode.insertBefore(container, root);

	new comp.$options.components['math-plugin']({
	    el: container,
	    parent: comp,
	    propsData:{
		syms:this.docs[doc_id],
		rendered:rendered_content,
		display_syms:false,
		id:doc_id,
		master:this
	    }
	});
    }
}
