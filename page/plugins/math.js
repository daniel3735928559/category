class MathPlugin {
    constructor(){
	this.index = {}; // Will store {node_id:{element_name:[formula tags containing element]}}
	Guppy.init({"path":"/node_modules/guppy-js","symbols":"/node_modules/guppy-js/sym/symbols.json"});
	Vue.component('math-info', {
	    template: `<div class="category-math-plugin-info">
  <li v-for="e in elements">
    <a href="#" v-on:click="math_query(e)">{{e}}</a>
  </li>
</div>`,
	    props: ["elements"],
	    methods: {
		math_query: this.math_query
	    }
	});
    }
    query(q){
	console.log(q);
    }
    run(){
	Guppy.Doc.render_all("text","$");
    }
}
