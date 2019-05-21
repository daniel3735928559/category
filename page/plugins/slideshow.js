class SlideshowPlugin {
    constructor(){
	Vue.component('slideshow-plugin', {
	    template: `<div class="category-slideshow">
<span :class="current_index == index && !all ? 'category-slideshow-button category-slideshow-button-current' : 'category-slideshow-button category-slideshow-button-other'" v-for="(s,index) in slides" v-on:mouseover="tmp_set_index(index)" v-on:mouseout="reset_index()" v-on:click="set_index(index)">
    {{index}}
  </span>
  <span :class="all ? 'category-slideshow-button category-slideshow-button-current' : 'category-slideshow-button category-slideshow-button-other'" v-on:click="all=!all">
    all
  </span>
  <div class="category-slideshow-slide" v-html="slides[current_index]" v-if="!all">
  </div>
  <div class="category-slideshow-slide" v-for="(s,index) in slides" v-if="all" v-html="s">
  </div>

</div>`,
//    <span class="category-slideshow-caption">{{slides[current_index].caption}}</span><br />
//    <img style="max-width:100%;" :src="slides[current_index].img"></img>

	    props: ["slides","lock_index","current_index","node", "all"],
	    methods: {
		tmp_set_index: function(idx){
		    this.current_index = idx;
		},
		reset_index: function(){
		    this.current_index = this.lock_index;
		},
		set_index: function(idx){
		    this.all = false;
		    this.lock_index = idx;
		    this.current_index = idx;
		}
	    }
	});
    }
    run(comp, node, root){
	if(!root) return;
	
	// Extract the slides
	var doc = new DOMParser().parseFromString(root.innerHTML, "text/xml");
	console.log(root);
	var elements = [];
	for(var n = doc.documentElement.firstChild; n != null; n = n.nextSibling){
	    if(n.nodeName == "li") elements.push(n.innerHTML);
	}
	console.log(elements);
	
	// Insert the container
        var container = document.createElement("div");
        root.parentNode.insertBefore(container, root);

	// Create the component
	new comp.$options.components['slideshow-plugin']({
	    el: container,
	    parent: comp,
	    propsData:{
		slides:elements,
		lock_index:0,
		current_index:0,
		node:node,
		all:false
	    }
	});
    }
}
