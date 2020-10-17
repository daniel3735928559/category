import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import NodeIndex from './components/nodes.vue'
import LabelIndex from './components/labels.vue'
import NodeFilter from './components/filter.vue'
import HistoryDisplay from './components/history.vue'
import EdgeDisplay from './components/edges.vue'
import SearchDisplay from './components/search/search.vue'
import GraphIndex from './components/graph.vue'
import Read from './components/read.vue'

import LocPlugin from './plugins/loc.vue'
import VideoPlugin from './plugins/video.vue'
import MathPlugin from './plugins/math.vue'
import LinkPlugin from './plugins/link.vue'
import QueryPlugin from './plugins/query.vue'
import SlideshowPlugin from './plugins/slideshow.vue'
import JSAVRPlugin from './plugins/jsavr.vue'

// import {UndirectedGraph} from 'graphology';
// import FA2Layout from 'graphology-layout-forceatlas2/worker';
// import WebGLRenderer from 'sigma/renderers/webgl';
 
import Query from './graph/query.mjs'
import Graph from './graph/graph.mjs'

// import Query from './components/search/module/query.js'
// import Search from './components/search/module/search.js'

Vue.config.productionTip = true;

Vue.component('read', Read);
Vue.component('graphIndex', GraphIndex);
Vue.component('nodeIndex', NodeIndex);
Vue.component('labelIndex', LabelIndex);
Vue.component('nodeFilter', NodeFilter);
Vue.component('historyDisplay', HistoryDisplay);
Vue.component('edgeDisplay', EdgeDisplay);

Vue.category_plugins = {
    'cat-slideshow': Vue.component('catSlideshow', SlideshowPlugin),
    'cat-loc': Vue.component('catLoc', LocPlugin),
    'cat-video': Vue.component('catVideo', VideoPlugin),
    'cat-query': Vue.component('catQuery', QueryPlugin),
    'cat-link': Vue.component('catLink', LinkPlugin),
    'cat-jsavr': Vue.component('catJsavr', JSAVRPlugin),
//    'cat-math': Vue.component('catMath', MathPlugin)
};

Vue.category_search_plugin = Vue.component('search', SearchDisplay);

Vue.category_query = new Query.Parser();

Vue.run_plugins = function(comp){
    for(var p in Vue.category_plugins) {
	var plugin = Vue.category_plugins[p];
	var l = comp.$el.getElementsByTagName(p);
	while(l.length > 0) {
	    var node = l[0];
	    console.log("PL",p,node);
	    new plugin({
		el: node,
		propsData: {'root': node},
		parent: comp
	    });
	}
    }
}
window.onload = function() {
 
new Vue({
    router,
    store,
    created: function() {
	this.$store.dispatch('refresh_metadata');
    },
    render: function (h) { return h(App) }
}).$mount('#cafeapp')

}
