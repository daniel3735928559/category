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
    'cat-slideshow': Vue.component('catSlideshow', require('./plugins/slideshow.vue').default),
    'cat-video': Vue.component('catVideo', require('./plugins/video.vue').default),
    'cat-query': Vue.component('catQuery', require('./plugins/query.vue').default),
    'cat-link': Vue.component('catLink', require('./plugins/link.vue').default),
    'cat-math': Vue.component('catMath', require('./plugins/math.vue').default)
};

Vue.category_parse = require('./components/search/module/query.js').parse;
Vue.category_search = require('./components/search/module/search.js');

Vue.run_plugins = function(comp){
    for(var p in Vue.category_plugins) {
	var plugin = Vue.category_plugins[p];
	var l = comp.$el.getElementsByTagName(p);
	while(l.length > 0) {
	    var node = l[0];
	    new plugin({
		el: node,
		propsData: {'root': node},
		parent: comp
	    });
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
