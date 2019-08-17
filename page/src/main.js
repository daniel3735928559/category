import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

Vue.component('search', require('./components/search/search.vue').default);
Vue.component('nodeIndex', require('./components/nodes.vue').default);
Vue.component('labelIndex', require('./components/labels.vue').default);
Vue.component('historyDisplay', require('./components/history.vue').default);
Vue.component('edgeDisplay', require('./components/edges.vue').default);

Vue.category_plugins = {
    'cat-slideshow': Vue.component('catSlideshow', require('./plugins/slideshow.vue').default)
};

Vue.run_plugins = function(comp){
    for(var p in Vue.category_plugins) {
	var plugin = Vue.category_plugins[p];
	console.log("plugin",p,plugin);
	var l = comp.$el.getElementsByTagName(p);
	for(var node of l) {
	    console.log('hi', node);
	    console.log('ct',node.innerHTML);
	    // var container = document.createElement("div");
	    // node.parentNode.insertBefore(container, node);
	    new plugin({
		el: node,
		propsData: {'content': node},
		parent: comp
	    });
	}
	while(l.length > 0){
	    l[0].parentNode.removeChild(l[0]);
	}
    }
}

new Vue({
    router,
    store,
    created: function() {
	this.$store.dispatch('refresh_metadata');
    },
    render: function (h) { return h(App) }
}).$mount('#cafeapp')
