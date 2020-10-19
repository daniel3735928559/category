import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Node from './views/Node.vue'
import Browse from './views/Browse.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: '/',
    routes: [
	{
	    path: '/',
	    redirect: '/browse/'
	},
	{
	    path: '/node/:id',
	    name: 'node',
	    component: Node,
	    props: true
	    // route level code-splitting
	    // this generates a separate chunk (about.[hash].js) for this route
	    // which is lazy-loaded when the route is visited.
	    // component: function () { 
	    //   return import(/* webpackChunkName: "about" */ './views/Node.vue')
	    // }
	},
	{
	    path: '/browse/:query?',
	    name: 'browse',
	    component: Browse,
	    props:true
	},
	{
	    path: '/browse/preview/:id',
	    name: 'preview',
	    component: Browse,
	    props:true
	}
    ]
})
