class MathPlugin {
    constructor(){
	var self = this;
	this.current_id = 0;
	this.docs = {};
	this.index = {}; // Will store {node_id:{element_name:[formula tags containing element]}}
	Guppy.init({"path":"/node_modules/guppy-js","symbols":"/node_modules/guppy-js/sym/symbols.json"});
	Vue.component('math-plugin', {
	    template: `
<span class="category-math-plugin">
<a v-bind:name="'category-math-plugin-link-'+id"></a>
  <span class="category-math-plugin-math" v-on:click="display_syms = !display_syms" v-html="rendered"></span>
  <div class="category-math-plugin-vars" v-if="display_syms">
  Vars:
  <ul>
    <li v-for="e in syms">
      <a href="#" v-on:click="query = e">{{e}}</a>
    </li>
  </ul>
  </div>
  <div class="category-math-plugin-vars" v-if="query != ''">
  <a href="#" v-on:click="query = ''">[x]</a>
  Uses:
  <ul>
    <li v-for="x in master.index[query]">
      <a v-bind:href="'#category-math-plugin-link-'+x">{{x}}</a>
    </li>
  </ul>
  </div>
</span>`,
	    props: ["query","syms","id","display_syms","rendered","master"],
	});
    }
    run(comp, node, root, index){
	var doc_id = node+"-"+index;
	if(index == 0) this.docs[node] = {};
	var content = root.innerHTML.trim()
	console.log("R",root,content);
	var res = Guppy.Doc.render(content, "text");
	res.container.setAttribute("id","category-math-container-"+doc_id);
	this.docs[node][index] = res.doc.get_vars().concat(res.doc.get_symbols());
	var rendered_content = (new XMLSerializer()).serializeToString(res.container);
	var container = document.createElement("span");
	
	// Put this doc ID in the index for each var and symbol in the document
	for(var i = 0; i < this.docs[node][index].length; i++) {
	    var v = this.docs[node][index][i];
	    if (!this.index[v]) this.index[v] = [];
	    if (this.index[v].indexOf(doc_id) < 0) this.index[v].push(doc_id);
	}
        root.parentNode.insertBefore(container, root);

	new comp.$options.components['math-plugin']({
	    el: container,
	    parent: comp,
	    propsData:{
		syms:this.docs[node][index],
		rendered:rendered_content,
		display_syms:false,
		id:doc_id,
		master:this,
		query:"",
		node:node
	    }
	});
    }
}
