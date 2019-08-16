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

new Vue({
    router,
    store,
    created: function() {
	this.$store.dispatch('refresh_metadata');
    },
    render: function (h) { return h(App) }
}).$mount('#cafeapp')
