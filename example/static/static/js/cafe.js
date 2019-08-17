(function (Vue, Router, Vuex) {
  'use strict';

  Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue;
  Router = Router && Router.hasOwnProperty('default') ? Router['default'] : Router;
  var Vuex__default = 'default' in Vuex ? Vuex['default'] : Vuex;

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
  /* server only */
  , shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
      createInjectorSSR = createInjector;
      createInjector = shadowMode;
      shadowMode = false;
    } // Vue.extend constructor export interop.


    var options = typeof script === 'function' ? script.options : script; // render functions

    if (template && template.render) {
      options.render = template.render;
      options.staticRenderFns = template.staticRenderFns;
      options._compiled = true; // functional template

      if (isFunctionalTemplate) {
        options.functional = true;
      }
    } // scopedId


    if (scopeId) {
      options._scopeId = scopeId;
    }

    var hook;

    if (moduleIdentifier) {
      // server build
      hook = function hook(context) {
        // 2.3 injection
        context = context || // cached call
        this.$vnode && this.$vnode.ssrContext || // stateful
        this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
        // 2.2 with runInNewContext: true

        if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
          context = __VUE_SSR_CONTEXT__;
        } // inject component styles


        if (style) {
          style.call(this, createInjectorSSR(context));
        } // register component module identifier for async chunk inference


        if (context && context._registeredComponents) {
          context._registeredComponents.add(moduleIdentifier);
        }
      }; // used by ssr in case component is cached and beforeCreate
      // never gets called


      options._ssrRegister = hook;
    } else if (style) {
      hook = shadowMode ? function () {
        style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
      } : function (context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook) {
      if (options.functional) {
        // register for functional component in vue file
        var originalRender = options.render;

        options.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = options.beforeCreate;
        options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }

    return script;
  }

  var normalizeComponent_1 = normalizeComponent;

  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  function createInjector(context) {
    return function (id, style) {
      return addStyle(id, style);
    };
  }
  var HEAD;
  var styles = {};

  function addStyle(id, css) {
    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = {
      ids: new Set(),
      styles: []
    });

    if (!style.ids.has(id)) {
      style.ids.add(id);
      var code = css.source;

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }

      if (!style.element) {
        style.element = document.createElement('style');
        style.element.type = 'text/css';
        if (css.media) style.element.setAttribute('media', css.media);

        if (HEAD === undefined) {
          HEAD = document.head || document.getElementsByTagName('head')[0];
        }

        HEAD.appendChild(style.element);
      }

      if ('styleSheet' in style.element) {
        style.styles.push(code);
        style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
      } else {
        var index = style.ids.size - 1;
        var textNode = document.createTextNode(code);
        var nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
      }
    }
  }

  var browser = createInjector;

  /* script */

  /* template */
  var __vue_render__ = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { staticClass: "container-full-width", attrs: { id: "cafeapp" } },
      [
        _c("div", { staticClass: "row", attrs: { id: "main" } }, [
          _c("div", { staticClass: "col-md-6 offset-md-1" }, [
            _c("div", { attrs: { id: "main_col" } }, [_c("router-view")], 1)
          ]),
          _c(
            "div",
            { staticClass: "col-md-4" },
            [_c("search"), _c("history-display")],
            1
          )
        ])
      ]
    )
  };
  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;

    /* style */
    const __vue_inject_styles__ = function (inject) {
      if (!inject) return
      inject("data-v-2db1169a_0", { source: "\n#cafeapp {\n    font-family: 'Avenir', Helvetica, Arial, sans-serif;\n    -webkit-font-smoothing: antialiased;\n    -moz-osx-font-smoothing: grayscale;\n    color: #2c3e50;\n    margin-top: 5px;\n}\n#sidebar{\n   padding:5px;\n}\n#main{\n    height:100%;\n}\n#graph{\n    width: 100%;\n    height:100vh;\n    border: 1px solid black;\n}\n#query_input{\n    width:100%;\n}\n#main_col{\n}\n\n", map: {"version":3,"sources":["/home/zoom/suit/category/page/src/App.vue"],"names":[],"mappings":";AAkBA;IACA,mDAAA;IACA,mCAAA;IACA,kCAAA;IACA,cAAA;IACA,eAAA;AACA;AAEA;GACA,WAAA;AACA;AACA;IACA,WAAA;AACA;AAEA;IACA,WAAA;IACA,YAAA;IACA,uBAAA;AACA;AAEA;IACA,UAAA;AACA;AAEA;AACA","file":"App.vue","sourcesContent":["<template>\n    <div id=\"cafeapp\" class=\"container-full-width\">\n\t<div id=\"main\" class=\"row\">\n\t    <div class=\"col-md-6 offset-md-1\">\n\t\t<div id=\"main_col\">\n\t\t    <router-view></router-view>\n\t\t</div>\n\t    </div>\n\t    \n\t    <div class=\"col-md-4\">\n\t\t<search />\n\t\t<history-display />\n\t    </div>\n\t</div>\n    </div>\n</template>\n\n<style>\n #cafeapp {\n     font-family: 'Avenir', Helvetica, Arial, sans-serif;\n     -webkit-font-smoothing: antialiased;\n     -moz-osx-font-smoothing: grayscale;\n     color: #2c3e50;\n     margin-top: 5px;\n }\n\n #sidebar{\n    padding:5px;\n }\n #main{\n     height:100%;\n }\n\n #graph{\n     width: 100%;\n     height:100vh;\n     border: 1px solid black;\n }\n\n #query_input{\n     width:100%;\n }\n\n #main_col{\n }\n\n</style>\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__ = undefined;
    /* module identifier */
    const __vue_module_identifier__ = undefined;
    /* functional template */
    const __vue_is_functional_template__ = false;
    /* style inject SSR */
    

    
    var App = normalizeComponent_1(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      {},
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      browser,
      undefined
    );

  //
   
   var script = {
       name: 'home',
       computed: Vuex.mapState([
  	 'nodes'
       ])
   };

  /* script */
  const __vue_script__ = script;

  /* template */
  var __vue_render__$1 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { staticClass: "home" },
      [_vm._m(0), _c("node-index", { attrs: { nodeset: _vm.nodes } })],
      1
    )
  };
  var __vue_staticRenderFns__$1 = [
    function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", { staticClass: "snippet_header" }, [
        _c("span", { staticClass: "snippet_title" }, [_vm._v("Category")])
      ])
    }
  ];
  __vue_render__$1._withStripped = true;

    /* style */
    const __vue_inject_styles__$1 = function (inject) {
      if (!inject) return
      inject("data-v-46d68b24_0", { source: "\n.snippet_header[data-v-46d68b24]{\n    border-radius: 10px;\n    padding: 5px;\n    width: 100%;\n    margin-bottom: 10px;\n}\n.snippet_title[data-v-46d68b24]{\n    font-size: 20pt;\n}\n", map: {"version":3,"sources":["/home/zoom/suit/category/page/src/views/Home.vue"],"names":[],"mappings":";AAwBA;IACA,mBAAA;IACA,YAAA;IACA,WAAA;IACA,mBAAA;AACA;AAEA;IACA,eAAA;AACA","file":"Home.vue","sourcesContent":["<template>\n  <div class=\"home\">\n      <div class=\"snippet_header\">\n\t  <span class=\"snippet_title\">Category</span>\n\t</div>\n\n    <node-index :nodeset=\"nodes\" />\n  </div>\n</template>\n\n<script>\n// @ is an alias to /src\n import { mapState } from 'vuex'\n \n export default {\n     name: 'home',\n     computed: mapState([\n\t 'nodes'\n     ])\n }\n</script>\n\n<!-- Add \"scoped\" attribute to limit CSS to this component only -->\n<style scoped>\n .snippet_header{\n     border-radius: 10px;\n     padding: 5px;\n     width: 100%;\n     margin-bottom: 10px;\n }\n\n .snippet_title{\n     font-size: 20pt;\n }\n</style>\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$1 = "data-v-46d68b24";
    /* module identifier */
    const __vue_module_identifier__$1 = undefined;
    /* functional template */
    const __vue_is_functional_template__$1 = false;
    /* style inject SSR */
    

    
    var Home = normalizeComponent_1(
      { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
      __vue_inject_styles__$1,
      __vue_script__,
      __vue_scope_id__$1,
      __vue_is_functional_template__$1,
      __vue_module_identifier__$1,
      browser,
      undefined
    );

  //

   var script$1 = {
       name: 'Node',
       data() {
  	 return {
  	     'node': this.$route.params.id,
  	     'data': 'loading...'
  	 }
       },
       created: function() {
  	 this.getNode(this.node, function(){});
  	 this.$store.dispatch('go',this.node);
       },
       beforeRouteUpdate: function(to, fro, next) {
  	 let node_id = to.params.id;
  	 this.$store.dispatch('go',node_id);
  	 var self = this;
  	 console.log("N",node_id);
  	 if (!this.nodes[node_id]) {
  	     console.log("problem:",node_id,"does not exist");
  	 }
  	 else if (node_id in this.node_data) {
  	     console.log("cached");
  	     this.data = this.node_data[node_id];
  	     this.node = node_id;
  	     next();
  	 }
  	 else if(this.nodes[node_id].auto == "yes") {
  	     console.log("auto");
  	     this.node = node_id;
  	     this.$store.dispatch('go',this.node);
  	     next();
  	 }
  	 else {
  	     console.log("not cached");
  	     this.getNode(node_id, data => {
  		 self.$store.dispatch('cache',node_id,data);
  		 self.node = node_id;
  		 next();
  	     });
  	 }
       },
       computed: {
  	 ...Vuex.mapState(['nodes', 'node_data']),
  	 ...Vuex.mapGetters([
  	     'neighbours',
  	 ])
       },
       methods: {
  	 getNode: function(node_id, next) {
  	     var self = this;
  	     console.log("fetching",node_id);
  	     var fetch_headers = new Headers();
  	     fetch_headers.append('pragma', 'no-cache');
  	     fetch_headers.append('cache-control', 'no-cache');
  	     
  	     var fetch_params = {
  		 method: 'GET',
  		 headers: fetch_headers,
  	     };
  	     fetch('/out/'+node_id+'.html', fetch_params).then(function(response){
  		 response.text().then(function(data){
  		     console.log("GOT",data);
  		     self.data = data;
  		     next(data);
  		     console.log("SN",self.nodes);
  		     self.$nextTick(function(){Vue.run_plugins(self);});
  		 });
  	     });

  	 }
       }
   };

  /* script */
  const __vue_script__$1 = script$1;

  /* template */
  var __vue_render__$2 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", [
      _c(
        "div",
        { staticClass: "snippet_header" },
        [
          _c("span", { staticClass: "snippet_title" }, [
            _vm._v(
              _vm._s(
                _vm.nodes && _vm.nodes[_vm.node]
                  ? _vm.nodes[_vm.node].name
                  : "loading..."
              )
            )
          ]),
          _c(
            "span",
            {
              staticClass: "close_x",
              on: {
                click: function($event) {
                  return _vm.edit_node(_vm.node)
                }
              }
            },
            [_c("span", { staticClass: "fas fa-edit" })]
          ),
          _c(
            "span",
            {
              staticClass: "close_x",
              on: {
                click: function($event) {
                  return _vm.reload_node(_vm.node)
                }
              }
            },
            [_c("span", { staticClass: "fas fa-sync" })]
          ),
          _c("router-link", { staticClass: "close_x", attrs: { to: "/" } }, [
            _c("span", { staticClass: "fas fa-home" })
          ])
        ],
        1
      ),
      _c("div", [
        _vm.nodes && _vm.nodes[_vm.node] && _vm.nodes[_vm.node].auto != "yes"
          ? _c(
              "div",
              [
                _c("div", {
                  staticClass: "expanded_content",
                  domProps: { innerHTML: _vm._s(_vm.data) }
                }),
                _c("edge-display", { attrs: { node: _vm.node } })
              ],
              1
            )
          : _vm._e(),
        _vm.nodes && _vm.nodes[_vm.node] && _vm.nodes[_vm.node].auto == "yes"
          ? _c(
              "div",
              [
                _c("node-index", { attrs: { nodeset: _vm.neighbours(_vm.node) } })
              ],
              1
            )
          : _vm._e(),
        !_vm.nodes || !_vm.nodes[_vm.node]
          ? _c("div", [_vm._v("\n\t\tLoading...\n\t    ")])
          : _vm._e()
      ])
    ])
  };
  var __vue_staticRenderFns__$2 = [];
  __vue_render__$2._withStripped = true;

    /* style */
    const __vue_inject_styles__$2 = function (inject) {
      if (!inject) return
      inject("data-v-fc772644_0", { source: "\n.snippet_content img[data-v-fc772644] {\n    max-width: 100%;\n}\n.expanded_content img[data-v-fc772644] {\n    max-width: 100%;\n}\n.snippet[data-v-fc772644]{\n    border-radius: 3px;\n    border: 1px solid #ccc;\n    margin-bottom: 10px;\n}\n.snippet_content[data-v-fc772644]{\n    padding:5px;\n}\n.snippet_header[data-v-fc772644]{\n    border-radius: 10px;\n    padding: 5px;\n    width: 100%;\n    margin-bottom: 10px;\n}\n.snippet_title[data-v-fc772644]{\n    font-size: 20pt;\n}\n.snippet_content[data-v-fc772644]{\n    max-height: 400px;\n    overflow-y:scroll;\n    overflow-x:scroll;\n    margin-bottom:10px;\n}\n", map: {"version":3,"sources":["/home/zoom/suit/category/page/src/views/Node.vue"],"names":[],"mappings":";AAwGA;IACA,eAAA;AACA;AAEA;IACA,eAAA;AACA;AAEA;IACA,kBAAA;IACA,sBAAA;IACA,mBAAA;AACA;AAEA;IACA,WAAA;AACA;AAEA;IACA,mBAAA;IACA,YAAA;IACA,WAAA;IACA,mBAAA;AACA;AAEA;IACA,eAAA;AACA;AAEA;IACA,iBAAA;IACA,iBAAA;IACA,iBAAA;IACA,kBAAA;AACA","file":"Node.vue","sourcesContent":["<template>\n    <div>\n\t<div class=\"snippet_header\">\n\t    <span class=\"snippet_title\">{{nodes && nodes[node] ? nodes[node].name : 'loading...'}}</span>\n\t    <span v-on:click=\"edit_node(node)\" class=\"close_x\"><span class=\"fas fa-edit\"></span></span>\n\t    <span v-on:click=\"reload_node(node)\" class=\"close_x\"><span class=\"fas fa-sync\"></span></span>\n\t    <router-link to=\"/\" class=\"close_x\"><span class=\"fas fa-home\"></span></router-link>\n\t</div>\n\t<div>\n\t    <div v-if=\"nodes && nodes[node] && nodes[node].auto != 'yes'\">\n\t\t<div v-html=\"data\" class=\"expanded_content\"></div>\n\t\t<edge-display :node=\"node\"></edge-display>\n\t    </div>\n\t    <div v-if=\"nodes && nodes[node] && nodes[node].auto == 'yes'\">\n\t\t<node-index :nodeset=\"neighbours(node)\" />\n\t    </div>\n\t    <div v-if=\"!nodes || !nodes[node]\">\n\t\tLoading...\n\t    </div>\n\t</div>\n    </div>\n</template>\n\n<script>\n import Vue from 'vue'\n \n import { mapState } from 'vuex'\n import { mapGetters } from 'vuex'\n\n export default {\n     name: 'Node',\n     data() {\n\t return {\n\t     'node': this.$route.params.id,\n\t     'data': 'loading...'\n\t }\n     },\n     created: function() {\n\t this.getNode(this.node, function(){});\n\t this.$store.dispatch('go',this.node);\n     },\n     beforeRouteUpdate: function(to, fro, next) {\n\t let node_id = to.params.id;\n\t this.$store.dispatch('go',node_id);\n\t var self = this;\n\t console.log(\"N\",node_id);\n\t if (!this.nodes[node_id]) {\n\t     console.log(\"problem:\",node_id,\"does not exist\");\n\t }\n\t else if (node_id in this.node_data) {\n\t     console.log(\"cached\");\n\t     this.data = this.node_data[node_id];\n\t     this.node = node_id;\n\t     next();\n\t }\n\t else if(this.nodes[node_id].auto == \"yes\") {\n\t     console.log(\"auto\");\n\t     this.node = node_id;\n\t     this.$store.dispatch('go',this.node);\n\t     next();\n\t }\n\t else {\n\t     console.log(\"not cached\");\n\t     this.getNode(node_id, data => {\n\t\t self.$store.dispatch('cache',node_id,data);\n\t\t self.node = node_id;\n\t\t next();\n\t     });\n\t }\n     },\n     computed: {\n\t ...mapState(['nodes', 'node_data']),\n\t ...mapGetters([\n\t     'neighbours',\n\t ])\n     },\n     methods: {\n\t getNode: function(node_id, next) {\n\t     var self = this;\n\t     console.log(\"fetching\",node_id);\n\t     var fetch_headers = new Headers();\n\t     fetch_headers.append('pragma', 'no-cache');\n\t     fetch_headers.append('cache-control', 'no-cache');\n\t     \n\t     var fetch_params = {\n\t\t method: 'GET',\n\t\t headers: fetch_headers,\n\t     };\n\t     fetch('/out/'+node_id+'.html', fetch_params).then(function(response){\n\t\t response.text().then(function(data){\n\t\t     console.log(\"GOT\",data);\n\t\t     self.data = data;\n\t\t     next(data);\n\t\t     console.log(\"SN\",self.nodes);\n\t\t     self.$nextTick(function(){Vue.run_plugins(self);});\n\t\t });\n\t     });\n\n\t }\n     }\n }\n</script>\n\n<style scoped>\n .snippet_content img {\n     max-width: 100%;\n }\n\n .expanded_content img {\n     max-width: 100%;\n }\n\n .snippet{\n     border-radius: 3px;\n     border: 1px solid #ccc;\n     margin-bottom: 10px;\n }\n\n .snippet_content{\n     padding:5px;\n }\n\n .snippet_header{\n     border-radius: 10px;\n     padding: 5px;\n     width: 100%;\n     margin-bottom: 10px;\n }\n\n .snippet_title{\n     font-size: 20pt;\n }\n\n .snippet_content{\n     max-height: 400px;\n     overflow-y:scroll;\n     overflow-x:scroll;\n     margin-bottom:10px;\n }\n</style>\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$2 = "data-v-fc772644";
    /* module identifier */
    const __vue_module_identifier__$2 = undefined;
    /* functional template */
    const __vue_is_functional_template__$2 = false;
    /* style inject SSR */
    

    
    var Node = normalizeComponent_1(
      { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
      __vue_inject_styles__$2,
      __vue_script__$1,
      __vue_scope_id__$2,
      __vue_is_functional_template__$2,
      __vue_module_identifier__$2,
      browser,
      undefined
    );

  Vue.use(Router);

  var router = new Router({
      mode: 'history',
      base: '/',
      routes: [
  	{
  	    path: '/',
  	    name: 'home',
  	    component: Home
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
  	}
      ]
  });

  Vue.use(Vuex__default);

  var store = new Vuex__default.Store({
      state: {
  	query: 'is category',
  	current: '',
  	nodes: {},
  	recent: [],
  	node_data: {}
      },
      getters: {
  	neighbours: state => node_id => {
  	    let node = state.nodes[node_id];
  	    var ans = {};
  	    for(var d in node.edges) {
  		for(var l in node.edges[d]) {
  		    for(var nbr_id of node.edges[d][l]) {
  			ans[nbr_id] = state.nodes[nbr_id];
  		    }
  		}
  	    }
  	    return ans;
  	}	
      }, 
      mutations: {
  	CACHE: (state, node_id, node_data) => {
  	    //node_data = plugin_process(state, node_id, node_data);
  	    state.node_data[node_id] = node_data;
  	},
  	CLEAR_HISTORY: state => {
  	    state.recent = [];
  	},
  	REMOVE_FROM_HISTORY: (state, node_id) => {
  	    console.log(state.recent,node_id);
  	    var idx = state.recent.indexOf(node_id);
  	    console.log(idx);
  	    if(idx >= 0) state.recent.splice(idx,1);
  	},
  	GO: (state, node_id) => {
  	    state.current = node_id;
  	    var idx = state.recent.indexOf(node_id);
  	    if(idx >= 0) {
  		state.recent.splice(idx, 1);
  	    }
  	    state.recent.unshift(node_id);
  	},
  	METADATA: (state, nodes) => {
  	    console.log("NN");
  	    state.nodes = nodes;
  	    state.recent = [];
  	    state.query = "is category";
  	}
      },
      actions: {
  	cache: (context, node_id, data) => {
  	    context.commit('CACHE',node_id, data);
  	},
  	clear_history: (context) => {
  	    context.commit('CLEAR_HISTORY');
  	},
  	remove_from_history: (context, node_id) => {
  	    context.commit('REMOVE_FROM_HISTORY', node_id);
  	},
  	go: (context, node_id) => {
  	    context.commit('GO', node_id);
  	},
  	refresh_metadata: (context) => {
  	    var fetch_headers = new Headers();
  	    fetch_headers.append('pragma', 'no-cache');
  	    fetch_headers.append('cache-control', 'no-cache');
  	    
  	    var fetch_params = {
  		method: 'GET',
  		headers: fetch_headers,
  	    };
  	    return new Promise((resolve, reject) => {
  		fetch('/out/metadata.json', fetch_params).then(function(response){
  	    	    console.log("R",response);
  	    	    response.json().then(function(data){
  	    		context.commit('METADATA', data);
  			resolve();
  	    	    });
  		});
  	    });
  	    // fetch('/out/metadata.json', fetch_params).then(function(response){
  	    // 	console.log("R",response);
  	    // 	response.json().then(function(data){
  	    // 	    context.commit('METADATA', data);
  	    // 	});
  	    // });

  	}
      }
  });

  //
   
   var script$2 = {
       name: 'node-index',
       props: ['nodeset','node'],
       data() {
  	 return {
  	     'current_label': 'blah',
  	     'modes': {}
  	 }
       },
       computed: {
  	 num_nodes: function() {
  	     var ans = 0;
  	     for(var n in this.nodeset) ans++;
  	     return ans;
  	 },
  	 labeldata: function() {
  	     // The result is:
  	     // {
  	     //   disconnected: [],
  	     //   labels: {},
  	     // }

  	     var disconnected_nodes = [];
  	     var modes = {};
  	     var best_label = '';
  	     
  	     // We build the data structure needed to prepare the index.
  	     // For each label, we create an entry like:
  	     // {
  	     //   count: how many nodes does this label cover
  	     //   covered: the set of nodes hit by the eddge
  	     //   has: the list of nodes that "have" this edge
  	     //   is: the list of nodes that "is" this edge
  	     // }
  	     var all_labels = {}; 
  	     for(var n in this.nodeset) {
  		 for(var e in this.nodeset[n].edges.has) {
  		     if(!(e in all_labels)) all_labels[e] = {'count':0, 'covered':{},'has':[],'is':[], 'mode':''};
  		     for(var t in this.nodeset[n].edges.has[e]){
  			 t = this.nodeset[n].edges.has[e][t];
  			 if(!(t in this.nodeset)) continue;
  			 if(!all_labels[e].covered[t]){
  			     // We haven't seen this node before
  			     all_labels[e].covered[t] = true;
  			     all_labels[e].count++;
  			 }
  			 if(all_labels[e].has.indexOf(n) == -1)
  			     all_labels[e].has.push(n);
  		     }
  		 }
  		 for(var e in this.nodeset[n].edges.is){
  		     if(!(e in all_labels)) all_labels[e] = {'count':0, 'covered':{},'has':[],'is':[], 'mode':''};
  		     for(var t in this.nodeset[n].edges.is[e]){
  			 t = this.nodeset[n].edges.is[e][t];
  			 if(!(t in this.nodeset)) continue;
  			 if(!all_labels[e].covered[t]){
  			     // We haven't seen this node before
  			     all_labels[e].covered[t] = true;
  			     all_labels[e].count++;
  			 }
  			 if(all_labels[e].is.indexOf(n) == -1)
  			     all_labels[e].is.push(n);
  		     }
  		 }
  	     }
  	     // Place the labels into a sorted list in order of
  	     // most edges to fewest edges (also, take this
  	     // opportunity to select the mode)
  	     var sorted_labels = [];
  	     for(var l in all_labels){
  		 if(all_labels[l].count == 0) continue;
  		 modes[l] = all_labels[l].is.length < all_labels[l].has.length ? 'by' : 'menu';
  		 sorted_labels.push(l);
  	     }
  	     var discriminitivity = function(l){
  		 return (all_labels[l].has.length-1)*(all_labels[l].is.length-1);
  	     };
  	     sorted_labels.sort(function(a, b){
  		 var da = discriminitivity(a);
  		 var db = discriminitivity(b);
  		 if(da < db) return 1; // TODO: -1 or 1 for descending order?
  		 if(da > db) return -1;
  		 return 0;
  	     });
  	     // Prep a set of all nodes so we can mark which ones we've finished
  	     var finished_nodes = {};
  	     var nodes_count = 0;
  	     var finished_count = 0;
  	     for(var n in this.nodeset) {
  		 // Only count nodes with actual edges; we'll deal
  		 // with disconnected ones separately
  		 var disconnected = true;
  		 for(var e in this.nodeset[n].edges.has){
  		     for(var i = 0; i < this.nodeset[n].edges.has[e].length; i++){
  			 t = this.nodeset[n].edges.has[e][i];
  			 if(this.nodeset[t]) disconnected = false;
  		     }
  		 }
  		 for(var e in this.nodeset[n].edges.is){
  		     for(var i = 0; i < this.nodeset[n].edges.is[e].length; i++){
  			 t = this.nodeset[n].edges.is[e][i];
  			 if(this.nodeset[t]) disconnected = false;
  		     }
  		 }
  		 if(disconnected){
  		     disconnected_nodes.push(n);
  		 }
  		 else {
  		     finished_nodes[n] = false;
  		     nodes_count++;
  		 }
  	     }

  	     // Now we want to collect the labels we will use for
  	     // indexing as well as figure out what modes to
  	     // display them in
  	     var best_labels = [];
  	     
  	     // Run through the labels
  	     for(var i = 0; i < sorted_labels.length; i++) {
  		 best_labels.push(sorted_labels[i]);
  		 // Mark all nodes covered as finished:
  		 for(var n in sorted_labels[i].covered){
  		     if(!finished_nodes[n]){
  			 finished_count++;
  			 finished_nodes[n] = true;
  		     }
  		 }
  		 // We cut short the use of labels, but only if we have
  		 // exhausted all the connected nodes, each under at
  		 // least one label already _and_ only if we already
  		 // have a lot of labels (> 20)
  		 if(finished_count == nodes_count && best_labels.length > 20) {
  		     break;
  		 }
  	     }

  	     // Now we are done!
  	     if(best_labels.length == 1) best_label = best_labels[0];
  	     else best_label = 'all';
  	     this.current_label = best_label;
  	     this.modes = modes;
  	     return {
  		 'disconnected': disconnected_nodes,
  		 'labels': best_labels
  	     };
  	 },
  	 ...Vuex.mapState(['nodes'])
       },
       methods: {
  	 toggle_display: function(l) {
   	     this.current_label = l;
  	 },
  	 swap_mode: function(l) {
   	     this.modes[l] = (this.modes[l] == 'by' ? 'menu' : 'by');
   	     //this.$forceUpdate();
  	 },

       }
   };

  /* script */
  const __vue_script__$2 = script$2;

  /* template */
  var __vue_render__$3 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "node-index-container" }, [
      _c(
        "div",
        { staticClass: "node-index-menu" },
        [
          _vm.num_nodes > 0
            ? _c(
                "div",
                {
                  class:
                    "node-index-menu-item " +
                    (_vm.current_label == "all"
                      ? "node-index-menu-selected"
                      : ""),
                  on: {
                    click: function($event) {
                      return _vm.toggle_display("all")
                    }
                  }
                },
                [_vm._v("\n\t\t(all)\n            ")]
              )
            : _vm._e(),
          _vm._l(_vm.labeldata.labels, function(l) {
            return _c(
              "div",
              {
                class:
                  "node-index-menu-item " +
                  (_vm.current_label == l ? "node-index-menu-selected" : ""),
                on: {
                  click: function($event) {
                    return _vm.toggle_display(l)
                  }
                }
              },
              [_vm._v("\n\t\t" + _vm._s(l) + "\n            ")]
            )
          }),
          _vm.labeldata.disconnected &&
          _vm.labeldata.disconnected.length > 0 &&
          _vm.labeldata.disconnected.length < _vm.num_nodes
            ? _c(
                "div",
                {
                  class:
                    "node-index-menu-item " +
                    (_vm.current_label == "unlinked"
                      ? "node-index-menu-selected"
                      : ""),
                  on: {
                    click: function($event) {
                      return _vm.toggle_display("unlinked")
                    }
                  }
                },
                [_vm._v("\n\t\t(unlinked)\n            ")]
              )
            : _vm._e()
        ],
        2
      ),
      _vm.current_label != "all" && _vm.current_label != "unlinked"
        ? _c(
            "div",
            { staticClass: "node-index-list" },
            [
              _c("h3", [
                _vm._v(
                  _vm._s(
                    _vm.modes[_vm.current_label] == "by"
                      ? "By " + _vm.current_label
                      : "Has " + _vm.current_label
                  ) + " "
                ),
                _c(
                  "span",
                  {
                    staticStyle: { cursor: "pointer", "font-size": ".5em" },
                    on: {
                      click: function($event) {
                        return _vm.swap_mode(_vm.current_label)
                      }
                    }
                  },
                  [_c("span", { staticClass: "fas fa-random" })]
                )
              ]),
              _c("label-index", {
                attrs: {
                  label: _vm.current_label,
                  mode: _vm.modes[_vm.current_label],
                  nodeset: _vm.nodeset
                }
              })
            ],
            1
          )
        : _vm._e(),
      _vm.current_label == "all" && _vm.num_nodes > 0
        ? _c("div", { staticClass: "node-index-list" }, [
            _vm.node
              ? _c(
                  "div",
                  [
                    _c("h3", [_vm._v("All edges")]),
                    _c("edge-display", { attrs: { node: _vm.node } })
                  ],
                  1
                )
              : _vm._e(),
            !_vm.node
              ? _c("div", [
                  _c("h3", [_vm._v("All nodes")]),
                  _c(
                    "ul",
                    _vm._l(_vm.nodeset, function(node, n) {
                      return _c(
                        "li",
                        [
                          _c("router-link", { attrs: { to: "/node/" + n } }, [
                            _vm._v(_vm._s(node.name))
                          ])
                        ],
                        1
                      )
                    }),
                    0
                  )
                ])
              : _vm._e()
          ])
        : _vm._e(),
      _vm.current_label == "unlinked"
        ? _c("div", { staticClass: "node-index-list" }, [
            _c("h3", [_vm._v("Unlinked")]),
            _c(
              "ul",
              _vm._l(_vm.labeldata.disconnected, function(n) {
                return _c(
                  "li",
                  [
                    _c("router-link", { attrs: { to: "/node/" + n } }, [
                      _vm._v(_vm._s(_vm.nodes[n].name))
                    ])
                  ],
                  1
                )
              }),
              0
            )
          ])
        : _vm._e(),
      _c("div", { staticClass: "spacer", staticStyle: { clear: "both" } })
    ])
  };
  var __vue_staticRenderFns__$3 = [];
  __vue_render__$3._withStripped = true;

    /* style */
    const __vue_inject_styles__$3 = function (inject) {
      if (!inject) return
      inject("data-v-2da31eb8_0", { source: "\n.node-index-menu[data-v-2da31eb8] {\n    width: 24%;\n    float:left;\n}\n.node-index-menu-item[data-v-2da31eb8] {\n    width: 90%;\n    border-radius:8px;\n    padding:5px;\n    margin:2px;\n    cursor:pointer;\n    background-color: #ccf !important;\n}\n.node-index-menu-selected[data-v-2da31eb8] {\n    background-color: #99c !important;\n}\n.node-index-list[data-v-2da31eb8] {\n    width: 72%;\n    float:left;\n}\n", map: {"version":3,"sources":["/home/zoom/suit/category/page/src/components/nodes.vue"],"names":[],"mappings":";AA0NA;IACA,UAAA;IACA,UAAA;AACA;AAEA;IACA,UAAA;IACA,iBAAA;IACA,WAAA;IACA,UAAA;IACA,cAAA;IACA,iCAAA;AACA;AAGA;IACA,iCAAA;AACA;AAEA;IACA,UAAA;IACA,UAAA;AACA","file":"nodes.vue","sourcesContent":["<template>\n    <div class=\"node-index-container\">\n\t<div class=\"node-index-menu\">\n            <div v-on:click=\"toggle_display('all')\" v-bind:class=\"'node-index-menu-item ' + (current_label == 'all' ? 'node-index-menu-selected' : '')\" v-if=\"num_nodes > 0\">\n\t\t(all)\n            </div>\n            <div v-on:click=\"toggle_display(l)\" v-bind:class=\"'node-index-menu-item ' + (current_label == l ? 'node-index-menu-selected' : '')\" v-for=\"l in labeldata.labels\">\n\t\t{{l}}\n            </div>\n            <div v-on:click=\"toggle_display('unlinked')\" v-bind:class=\"'node-index-menu-item ' + (current_label == 'unlinked' ? 'node-index-menu-selected' : '')\" v-if=\"labeldata.disconnected && labeldata.disconnected.length > 0 && labeldata.disconnected.length < num_nodes\">\n\t\t(unlinked)\n            </div>\n\t</div>\n\t\n\t<!-- List of edges associated with current_label -->\n\t<div class=\"node-index-list\" v-if=\"current_label != 'all' && current_label != 'unlinked'\">\n            <h3>{{modes[current_label] == 'by' ? 'By ' + current_label : 'Has ' + current_label}} <span style=\"cursor:pointer;font-size:.5em;\" v-on:click=\"swap_mode(current_label)\"><span class=\"fas fa-random\"></span></span></h3>\n            <label-index :label=\"current_label\" :mode=\"modes[current_label]\" :nodeset=\"nodeset\" />\n\t</div>\n\t\n\t<!-- List of all edges -->\n\t<div class=\"node-index-list\" v-if=\"current_label == 'all' && num_nodes > 0\">\n            <div v-if=\"node\">\n\t\t<h3>All edges</h3>\n    \t\t<edge-display :node=\"node\"></edge-display>\n            </div>\n            <div v-if=\"!node\">\n\t\t<h3>All nodes</h3>\n    \t\t<ul>\n\t\t    <li v-for=\"(node,n) in nodeset\">\n\t\t\t<router-link :to=\"'/node/'+n\">{{node.name}}</router-link>\n\t\t    </li>\n    \t\t</ul>\n            </div>\n\t</div>\n\t\n\t<!-- List of unlinked nodes -->\n\t<div class=\"node-index-list\" v-if=\"current_label == 'unlinked'\">\n            <h3>Unlinked</h3>\n            <ul>\n    \t\t<li v-for=\"n in labeldata.disconnected\">\n    \t\t    <router-link :to=\"'/node/'+n\">{{nodes[n].name}}</router-link>\n    \t\t</li>\n            </ul>\n\t</div>\n\t\n\t<div class=\"spacer\" style=\"clear: both;\"></div>\n    </div>\n</template>\n\n<script>\n import { mapState } from 'vuex'\n \n export default {\n     name: 'node-index',\n     props: ['nodeset','node'],\n     data() {\n\t return {\n\t     'current_label': 'blah',\n\t     'modes': {}\n\t }\n     },\n     computed: {\n\t num_nodes: function() {\n\t     var ans = 0;\n\t     for(var n in this.nodeset) ans++;\n\t     return ans;\n\t },\n\t labeldata: function() {\n\t     // The result is:\n\t     // {\n\t     //   disconnected: [],\n\t     //   labels: {},\n\t     // }\n\n\t     var disconnected_nodes = [];\n\t     var modes = {};\n\t     var best_label = ''\n\t     \n\t     // We build the data structure needed to prepare the index.\n\t     // For each label, we create an entry like:\n\t     // {\n\t     //   count: how many nodes does this label cover\n\t     //   covered: the set of nodes hit by the eddge\n\t     //   has: the list of nodes that \"have\" this edge\n\t     //   is: the list of nodes that \"is\" this edge\n\t     // }\n\t     var all_labels = {}; \n\t     for(var n in this.nodeset) {\n\t\t for(var e in this.nodeset[n].edges.has) {\n\t\t     if(!(e in all_labels)) all_labels[e] = {'count':0, 'covered':{},'has':[],'is':[], 'mode':''};\n\t\t     for(var t in this.nodeset[n].edges.has[e]){\n\t\t\t t = this.nodeset[n].edges.has[e][t];\n\t\t\t if(!(t in this.nodeset)) continue;\n\t\t\t if(!all_labels[e].covered[t]){\n\t\t\t     // We haven't seen this node before\n\t\t\t     all_labels[e].covered[t] = true;\n\t\t\t     all_labels[e].count++;\n\t\t\t }\n\t\t\t if(all_labels[e].has.indexOf(n) == -1)\n\t\t\t     all_labels[e].has.push(n);\n\t\t     }\n\t\t }\n\t\t for(var e in this.nodeset[n].edges.is){\n\t\t     if(!(e in all_labels)) all_labels[e] = {'count':0, 'covered':{},'has':[],'is':[], 'mode':''};\n\t\t     for(var t in this.nodeset[n].edges.is[e]){\n\t\t\t t = this.nodeset[n].edges.is[e][t];\n\t\t\t if(!(t in this.nodeset)) continue;\n\t\t\t if(!all_labels[e].covered[t]){\n\t\t\t     // We haven't seen this node before\n\t\t\t     all_labels[e].covered[t] = true;\n\t\t\t     all_labels[e].count++;\n\t\t\t }\n\t\t\t if(all_labels[e].is.indexOf(n) == -1)\n\t\t\t     all_labels[e].is.push(n);\n\t\t     }\n\t\t }\n\t     }\n\t     // Place the labels into a sorted list in order of\n\t     // most edges to fewest edges (also, take this\n\t     // opportunity to select the mode)\n\t     var sorted_labels = [];\n\t     for(var l in all_labels){\n\t\t if(all_labels[l].count == 0) continue;\n\t\t modes[l] = all_labels[l].is.length < all_labels[l].has.length ? 'by' : 'menu';\n\t\t sorted_labels.push(l);\n\t     }\n\t     var discriminitivity = function(l){\n\t\t return (all_labels[l].has.length-1)*(all_labels[l].is.length-1);\n\t     }\n\t     sorted_labels.sort(function(a, b){\n\t\t var da = discriminitivity(a);\n\t\t var db = discriminitivity(b);\n\t\t if(da < db) return 1; // TODO: -1 or 1 for descending order?\n\t\t if(da > db) return -1;\n\t\t return 0;\n\t     });\n\t     // Prep a set of all nodes so we can mark which ones we've finished\n\t     var finished_nodes = {};\n\t     var nodes_count = 0;\n\t     var finished_count = 0;\n\t     for(var n in this.nodeset) {\n\t\t // Only count nodes with actual edges; we'll deal\n\t\t // with disconnected ones separately\n\t\t var disconnected = true;\n\t\t for(var e in this.nodeset[n].edges.has){\n\t\t     for(var i = 0; i < this.nodeset[n].edges.has[e].length; i++){\n\t\t\t t = this.nodeset[n].edges.has[e][i];\n\t\t\t if(this.nodeset[t]) disconnected = false;\n\t\t     }\n\t\t }\n\t\t for(var e in this.nodeset[n].edges.is){\n\t\t     for(var i = 0; i < this.nodeset[n].edges.is[e].length; i++){\n\t\t\t t = this.nodeset[n].edges.is[e][i];\n\t\t\t if(this.nodeset[t]) disconnected = false;\n\t\t     }\n\t\t }\n\t\t if(disconnected){\n\t\t     disconnected_nodes.push(n);\n\t\t }\n\t\t else {\n\t\t     finished_nodes[n] = false;\n\t\t     nodes_count++;\n\t\t }\n\t     }\n\n\t     // Now we want to collect the labels we will use for\n\t     // indexing as well as figure out what modes to\n\t     // display them in\n\t     var best_labels = [];\n\t     \n\t     // Run through the labels\n\t     for(var i = 0; i < sorted_labels.length; i++) {\n\t\t best_labels.push(sorted_labels[i]);\n\t\t // Mark all nodes covered as finished:\n\t\t for(var n in sorted_labels[i].covered){\n\t\t     if(!finished_nodes[n]){\n\t\t\t finished_count++;\n\t\t\t finished_nodes[n] = true;\n\t\t     }\n\t\t }\n\t\t // We cut short the use of labels, but only if we have\n\t\t // exhausted all the connected nodes, each under at\n\t\t // least one label already _and_ only if we already\n\t\t // have a lot of labels (> 20)\n\t\t if(finished_count == nodes_count && best_labels.length > 20) {\n\t\t     break;\n\t\t }\n\t     }\n\n\t     // Now we are done!\n\t     if(best_labels.length == 1) best_label = best_labels[0];\n\t     else best_label = 'all';\n\t     this.current_label = best_label;\n\t     this.modes = modes;\n\t     return {\n\t\t 'disconnected': disconnected_nodes,\n\t\t 'labels': best_labels\n\t     };\n\t },\n\t ...mapState(['nodes'])\n     },\n     methods: {\n\t toggle_display: function(l) {\n \t     this.current_label = l;\n\t },\n\t swap_mode: function(l) {\n \t     this.modes[l] = (this.modes[l] == 'by' ? 'menu' : 'by');\n \t     //this.$forceUpdate();\n\t },\n\n     }\n }\n</script>\n\n<!-- Add \"scoped\" attribute to limit CSS to this component only -->\n<style scoped>\n\n .node-index-menu {\n     width: 24%;\n     float:left;\n }\n\n .node-index-menu-item {\n     width: 90%;\n     border-radius:8px;\n     padding:5px;\n     margin:2px;\n     cursor:pointer;\n     background-color: #ccf !important;\n }\n\n\n .node-index-menu-selected {\n     background-color: #99c !important;\n }\n\n .node-index-list {\n     width: 72%;\n     float:left;\n }\n</style>\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$3 = "data-v-2da31eb8";
    /* module identifier */
    const __vue_module_identifier__$3 = undefined;
    /* functional template */
    const __vue_is_functional_template__$3 = false;
    /* style inject SSR */
    

    
    var NodeIndex = normalizeComponent_1(
      { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
      __vue_inject_styles__$3,
      __vue_script__$2,
      __vue_scope_id__$3,
      __vue_is_functional_template__$3,
      __vue_module_identifier__$3,
      browser,
      undefined
    );

  //
   
   var script$3 = {
       name: 'label-index',
       props: ['mode','label','nodeset'],
       computed: {
  	 headers: function() {
  	     if(this.mode == 'menu'){
  		 var ans = [];
  		 for(var n in this.nodeset) {
  		     if(this.nodes[n].edges['has'][this.label]){
  			 ans.push(n);
  		     }
  		 }
  		 return ans;
  	     }
  	     else if(this.mode == 'by') {
  		 var ans = [];
  		 for(var n in this.nodeset) {
  		     if(this.nodes[n].edges['is'][this.label]){
  			 ans.push(n);
  		     }
  		 }
  		 return ans;
  	     }
  	 },
  	 ...Vuex.mapState([
  	     'nodes'
  	 ])
       }
   };

  /* script */
  const __vue_script__$3 = script$3;

  /* template */
  var __vue_render__$4 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "label_index" }, [
      _vm.mode == "by" || _vm.mode == "menu"
        ? _c(
            "ul",
            _vm._l(_vm.headers, function(n) {
              return _c(
                "li",
                [
                  _c(
                    "router-link",
                    { attrs: { to: { name: "node", params: { id: n } } } },
                    [_vm._v(_vm._s(_vm.nodes[n].name))]
                  ),
                  _c(
                    "ul",
                    _vm._l(
                      _vm.nodes[n].edges[_vm.mode == "menu" ? "has" : "is"][
                        _vm.label
                      ],
                      function(m) {
                        return m in _vm.nodeset
                          ? _c(
                              "li",
                              [
                                _c(
                                  "router-link",
                                  {
                                    attrs: {
                                      to: { name: "node", params: { id: m } }
                                    }
                                  },
                                  [_vm._v(_vm._s(_vm.nodes[m].name))]
                                )
                              ],
                              1
                            )
                          : _vm._e()
                      }
                    ),
                    0
                  )
                ],
                1
              )
            }),
            0
          )
        : _vm._e()
    ])
  };
  var __vue_staticRenderFns__$4 = [];
  __vue_render__$4._withStripped = true;

    /* style */
    const __vue_inject_styles__$4 = function (inject) {
      if (!inject) return
      inject("data-v-1934062d_0", { source: "\nh3[data-v-1934062d] {\n  margin: 40px 0 0;\n}\n", map: {"version":3,"sources":["/home/zoom/suit/category/page/src/components/labels.vue"],"names":[],"mappings":";AAmDA;EACA,gBAAA;AACA","file":"labels.vue","sourcesContent":["<template>\n  <div class=\"label_index\">\n      <ul v-if=\"mode == 'by' || mode == 'menu'\">\n\t  <li v-for=\"n in headers\">\n\t      <router-link :to=\"{name:'node', params: {id: n}}\">{{nodes[n].name}}</router-link>\n\t      <ul>\n\t\t  <li v-for=\"m in nodes[n].edges[mode == 'menu' ? 'has' : 'is'][label]\" v-if=\"m in nodeset\">\n\t\t      <router-link :to=\"{name:'node', params: {id: m}}\">{{nodes[m].name}}</router-link>\n\t\t  </li>\n\t      </ul>\n\t  </li>\n      </ul>\n  </div>\n</template>\n\n<script>\n import { mapState } from 'vuex'\n \n export default {\n     name: 'label-index',\n     props: ['mode','label','nodeset'],\n     computed: {\n\t headers: function() {\n\t     if(this.mode == 'menu'){\n\t\t var ans = []\n\t\t for(var n in this.nodeset) {\n\t\t     if(this.nodes[n].edges['has'][this.label]){\n\t\t\t ans.push(n);\n\t\t     }\n\t\t }\n\t\t return ans;\n\t     }\n\t     else if(this.mode == 'by') {\n\t\t var ans = []\n\t\t for(var n in this.nodeset) {\n\t\t     if(this.nodes[n].edges['is'][this.label]){\n\t\t\t ans.push(n);\n\t\t     }\n\t\t }\n\t\t return ans;\n\t     }\n\t },\n\t ...mapState([\n\t     'nodes'\n\t ])\n     }\n }\n</script>\n\n<!-- Add \"scoped\" attribute to limit CSS to this component only -->\n<style scoped>\nh3 {\n  margin: 40px 0 0;\n}\n</style>\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$4 = "data-v-1934062d";
    /* module identifier */
    const __vue_module_identifier__$4 = undefined;
    /* functional template */
    const __vue_is_functional_template__$4 = false;
    /* style inject SSR */
    

    
    var LabelIndex = normalizeComponent_1(
      { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
      __vue_inject_styles__$4,
      __vue_script__$3,
      __vue_scope_id__$4,
      __vue_is_functional_template__$4,
      __vue_module_identifier__$4,
      browser,
      undefined
    );

  //
   
   var script$4 = {
       name: 'history-display',
       computed: Vuex.mapState([
  	 'recent', 'nodes'
       ]),
       methods: {
  	 remove_from_history: function(node_id) {
  	     this.$store.dispatch('remove_from_history',node_id);
  	 },
  	 clear_history: function() {
  	     this.$store.dispatch('clear_history');
  	 }
       }
   };

  /* script */
  const __vue_script__$4 = script$4;

  /* template */
  var __vue_render__$5 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { attrs: { id: "working_set" } }, [
      _vm.recent.length != 0
        ? _c("h4", [
            _c(
              "span",
              {
                staticStyle: { cursor: "pointer", "margin-right": "5px" },
                on: {
                  click: function($event) {
                    return _vm.clear_history()
                  }
                }
              },
              [_vm._v("[x]")]
            ),
            _vm._v("Recent nodes\n")
          ])
        : _vm._e(),
      _c(
        "ul",
        _vm._l(_vm.recent, function(node) {
          return _c(
            "li",
            [
              _c(
                "span",
                {
                  staticStyle: { cursor: "pointer", "margin-right": "5px" },
                  on: {
                    click: function($event) {
                      return _vm.remove_from_history(node)
                    }
                  }
                },
                [_vm._v("[x]")]
              ),
              _c(
                "router-link",
                { attrs: { to: { name: "node", params: { id: node } } } },
                [
                  _vm._v(
                    _vm._s(
                      _vm.nodes && _vm.nodes[node]
                        ? _vm.nodes[node].name
                        : "loading..."
                    )
                  )
                ]
              )
            ],
            1
          )
        }),
        0
      )
    ])
  };
  var __vue_staticRenderFns__$5 = [];
  __vue_render__$5._withStripped = true;

    /* style */
    const __vue_inject_styles__$5 = function (inject) {
      if (!inject) return
      inject("data-v-d4dcb7a4_0", { source: "\n#working_set[data-v-d4dcb7a4]{\n    padding-top:5px;\n    padding-left:5px;\n}\n\n", map: {"version":3,"sources":["/home/zoom/suit/category/page/src/components/history.vue"],"names":[],"mappings":";AAuCA;IACA,eAAA;IACA,gBAAA;AACA","file":"history.vue","sourcesContent":["<template>\n    <div id=\"working_set\">\n\t<h4 v-if=\"recent.length != 0\"><span v-on:click=\"clear_history()\" style=\"cursor:pointer;margin-right:5px;\">[x]</span>Recent nodes\n</h4>\n\t<ul>\n\t    <li v-for=\"node in recent\">\n\t\t<span v-on:click=\"remove_from_history(node)\" style=\"cursor:pointer;margin-right:5px;\">[x]</span> <router-link :to=\"{name:'node', params: {id: node}}\">{{nodes && nodes[node] ? nodes[node].name : \"loading...\"}}</router-link>\n\t    </li>\n\t    <!-- <draggable v-model=\"recent\">\n\t\t <li v-for=\"node in recent\">\n\t\t <router-link :to=\"{name:'doc', params: {id: node}}\">{{nodes[node].name}}</router-link>\n\t\t </li>\n\t\t </draggable> -->\n\t</ul>\n    </div>\n</template>\n\n<script>\n import { mapState } from 'vuex'\n \n export default {\n     name: 'history-display',\n     computed: mapState([\n\t 'recent', 'nodes'\n     ]),\n     methods: {\n\t remove_from_history: function(node_id) {\n\t     this.$store.dispatch('remove_from_history',node_id);\n\t },\n\t clear_history: function() {\n\t     this.$store.dispatch('clear_history');\n\t }\n     }\n }\n</script>\n\n<!-- Add \"scoped\" attribute to limit CSS to this component only -->\n<style scoped>\n\n #working_set{\n     padding-top:5px;\n     padding-left:5px;\n }\n\n</style>\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$5 = "data-v-d4dcb7a4";
    /* module identifier */
    const __vue_module_identifier__$5 = undefined;
    /* functional template */
    const __vue_is_functional_template__$5 = false;
    /* style inject SSR */
    

    
    var HistoryDisplay = normalizeComponent_1(
      { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
      __vue_inject_styles__$5,
      __vue_script__$4,
      __vue_scope_id__$5,
      __vue_is_functional_template__$5,
      __vue_module_identifier__$5,
      browser,
      undefined
    );

  //

  var script$5 = {
       name: 'edge-display',
       props: ['node'],
       computed: Vuex.mapState([
  	 'nodes'
       ])
  };

  /* script */
  const __vue_script__$5 = script$5;

  /* template */
  var __vue_render__$6 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { staticClass: "edge_display" },
      [
        _vm._l(_vm.nodes[_vm.node].edges.has, function(targets, edge) {
          return _c(
            "div",
            _vm._l(targets, function(target) {
              return _vm.nodes[target].auto != "yes"
                ? _c(
                    "div",
                    [
                      _vm._v("\n\t\thas " + _vm._s(edge) + ": \n\t\t"),
                      _c("router-link", { attrs: { to: "./" + target } }, [
                        _vm._v(_vm._s(_vm.nodes[target].name))
                      ])
                    ],
                    1
                  )
                : _vm._e()
            }),
            0
          )
        }),
        _vm._l(_vm.nodes[_vm.node].edges.is, function(targets, edge) {
          return _c(
            "div",
            _vm._l(targets, function(target) {
              return _vm.nodes[target].auto != "yes"
                ? _c(
                    "div",
                    [
                      _vm._v("\n\t\tis " + _vm._s(edge) + " of: \n\t\t"),
                      _c("router-link", { attrs: { to: "./" + target } }, [
                        _vm._v(_vm._s(_vm.nodes[target].name))
                      ])
                    ],
                    1
                  )
                : _vm._e()
            }),
            0
          )
        }),
        _c("b", [_vm._v("Auto-generated:")]),
        _vm._l(_vm.nodes[_vm.node].edges.has, function(targets, edge) {
          return _c(
            "div",
            _vm._l(targets, function(target) {
              return _vm.nodes[target].auto == "yes"
                ? _c(
                    "div",
                    [
                      _vm._v("\n\t\thas " + _vm._s(edge) + ": \n\t\t"),
                      _c("router-link", { attrs: { to: "./" + target } }, [
                        _vm._v(_vm._s(_vm.nodes[target].name))
                      ])
                    ],
                    1
                  )
                : _vm._e()
            }),
            0
          )
        }),
        _vm._l(_vm.nodes[_vm.node].edges.is, function(targets, edge) {
          return _c(
            "div",
            _vm._l(targets, function(target) {
              return _vm.nodes[target].auto == "yes"
                ? _c(
                    "div",
                    [
                      _vm._v("\n\t\tis " + _vm._s(edge) + " of: \n\t\t"),
                      _c("router-link", { attrs: { to: "./" + target } }, [
                        _vm._v(_vm._s(_vm.nodes[target].name))
                      ])
                    ],
                    1
                  )
                : _vm._e()
            }),
            0
          )
        })
      ],
      2
    )
  };
  var __vue_staticRenderFns__$6 = [];
  __vue_render__$6._withStripped = true;

    /* style */
    const __vue_inject_styles__$6 = function (inject) {
      if (!inject) return
      inject("data-v-80d62b3c_0", { source: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", map: {"version":3,"sources":[],"names":[],"mappings":"","file":"edges.vue"}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$6 = "data-v-80d62b3c";
    /* module identifier */
    const __vue_module_identifier__$6 = undefined;
    /* functional template */
    const __vue_is_functional_template__$6 = false;
    /* style inject SSR */
    

    
    var EdgeDisplay = normalizeComponent_1(
      { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
      __vue_inject_styles__$6,
      __vue_script__$5,
      __vue_scope_id__$6,
      __vue_is_functional_template__$6,
      __vue_module_identifier__$6,
      browser,
      undefined
    );

  //

   var script$6 = {
       name: 'search',
       computed: { 
  	 ...Vuex.mapState(['nodes']),
  	 resultset: function() {
  	     var ans = {};
  	     for(var r of this.result) {
  		 ans[r] = this.nodes[r];
  	     }
  	     return ans;
  	 }
       },
       data() {
  	 return {
  	     entered_query: '',
  	     query: '',
  	     errormsg: '',
  	     result: []
  	 }
       },
       methods: {
  	 search: function() {
  	     this.entered_query = this.query;
  	     this.errormsg = "";
  	     if(this.query.trim().length == 0) {
  		 this.result = [];
  		 return;
  	     }
  	     try {
  		 var q = Vue.category_query.parse(this.query);
  	     }
  	     catch(e){
  		 this.errormsg = e.toString();
  		 this.result = [];
  		 return;
  	     }
  	     var query_result = Vue.category_search(q, this.nodes);
  	     this.result = query_result;
  	 }
       },
       mounted: function() {
  	 this.query ='';
  	 this.search();
       }
   };

  /* script */
  const __vue_script__$6 = script$6;

  /* template */
  var __vue_render__$7 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "searchbar" }, [
      _c("input", {
        directives: [
          {
            name: "model",
            rawName: "v-model",
            value: _vm.query,
            expression: "query"
          }
        ],
        attrs: { type: "text", id: "query_input" },
        domProps: { value: _vm.query },
        on: {
          keyup: function($event) {
            if (
              !$event.type.indexOf("key") &&
              _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")
            ) {
              return null
            }
            return _vm.search($event)
          },
          input: function($event) {
            if ($event.target.composing) {
              return
            }
            _vm.query = $event.target.value;
          }
        }
      }),
      _c(
        "ul",
        { staticClass: "category-search-result" },
        [
          _vm.errormsg.length > 0
            ? _c("span", { staticClass: "search-error" }, [
                _vm._v(_vm._s(_vm.errormsg))
              ])
            : _vm._e(),
          _vm.result.length == 0 &&
          _vm.entered_query.trim().length > 0 &&
          _vm.errormsg.length == 0
            ? _c("span", [_vm._v("No results")])
            : _vm._e(),
          _vm.result.length > 0
            ? _c("node-index", { attrs: { nodeset: _vm.resultset } })
            : _vm._e()
        ],
        1
      )
    ])
  };
  var __vue_staticRenderFns__$7 = [];
  __vue_render__$7._withStripped = true;

    /* style */
    const __vue_inject_styles__$7 = function (inject) {
      if (!inject) return
      inject("data-v-2473e64e_0", { source: "\n.search-error[data-v-2473e64e] {\n    color: #e33;\n}\n", map: {"version":3,"sources":["/home/zoom/suit/category/page/src/components/search/search.vue"],"names":[],"mappings":";AAoEA;IACA,WAAA;AACA","file":"search.vue","sourcesContent":["<template>\n  <div class=\"searchbar\"> \n      <input type=\"text\" id=\"query_input\" v-model=\"query\" v-on:keyup.enter=\"search\" />\n      <ul class=\"category-search-result\">\n\t  <span class=\"search-error\" v-if=\"errormsg.length > 0\">{{errormsg}}</span>\n\t  <span v-if=\"result.length == 0 && entered_query.trim().length > 0 && errormsg.length == 0\">No results</span>\n\t  <node-index :nodeset=\"resultset\" v-if=\"result.length > 0\"></node-index>\n\t  <!-- <li v-for=\"node in result\">\n\t       <router-link :to=\"'./'+node\">{{nodes[node].name}}</router-link>\n\t       </li> -->\n      </ul>\n  </div>\n</template>\n\n<script>\n import Vue from 'vue'\n import { mapState } from 'vuex'\n\n export default {\n     name: 'search',\n     computed: { \n\t ...mapState(['nodes']),\n\t resultset: function() {\n\t     var ans = {};\n\t     for(var r of this.result) {\n\t\t ans[r] = this.nodes[r];\n\t     }\n\t     return ans;\n\t }\n     },\n     data() {\n\t return {\n\t     entered_query: '',\n\t     query: '',\n\t     errormsg: '',\n\t     result: []\n\t }\n     },\n     methods: {\n\t search: function() {\n\t     this.entered_query = this.query;\n\t     this.errormsg = \"\";\n\t     if(this.query.trim().length == 0) {\n\t\t this.result = [];\n\t\t return;\n\t     }\n\t     try {\n\t\t var q = Vue.category_query.parse(this.query);\n\t     }\n\t     catch(e){\n\t\t this.errormsg = e.toString();\n\t\t this.result = [];\n\t\t return;\n\t     }\n\t     var query_result = Vue.category_search(q, this.nodes);\n\t     this.result = query_result;\n\t }\n     },\n     mounted: function() {\n\t this.query ='';\n\t this.search();\n     }\n }\n</script>\n\n<!-- Add \"scoped\" attribute to limit CSS to this component only -->\n<style scoped>\n\n .search-error {\n     color: #e33;\n }\n</style>\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$7 = "data-v-2473e64e";
    /* module identifier */
    const __vue_module_identifier__$7 = undefined;
    /* functional template */
    const __vue_is_functional_template__$7 = false;
    /* style inject SSR */
    

    
    var SearchDisplay = normalizeComponent_1(
      { render: __vue_render__$7, staticRenderFns: __vue_staticRenderFns__$7 },
      __vue_inject_styles__$7,
      __vue_script__$6,
      __vue_scope_id__$7,
      __vue_is_functional_template__$7,
      __vue_module_identifier__$7,
      browser,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //
  //

   var script$7 = {
       name: 'cat-video',
       props: ['root'],
       data () {
  	 return {
  	     player: null
  	 };
       },
       methods: {
  	 goto: function(t){
  	     this.player.currentTime = t;
  	 }
       },
       mounted: function(){
  	 console.log("LINK",this.root);
  	 // Parse the link info
  	 var lines = root.innerHTML.split("\n");
  	 var url = lines[0].trim();
  	 console.log("U",url);
  	 var index = [];
  	 for (var i = 1; i < lines.length; i++) {
  	     var time = lines[i].split(" ")[0];
  	     var caption = lines[i].substring(lines[i].indexOf(" ")+1);
  	     var secs = 60*parseInt(time.split(":")[0])+parseInt(time.split(":")[1]);
  	     console.log("S",secs,time);
  	     index.push({'secs':secs, 'caption':caption});
  	 }
  	 var ending = 'video/'+url.substring(url.lastIndexOf(".")+1);
  	 this.index = index;
  	 this.url = url;
  	 this.type = ending;
       }
   };

  /* script */
  const __vue_script__$7 = script$7;

  /* template */
  var __vue_render__$8 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", [
      _c("video", { attrs: { id: _vm.id, controls: "" } }, [
        _c("source", { attrs: { src: _vm.url, type: _vm.type } }),
        _vm._v(
          "\n\tIf you are seing this text, your browser does not support the video tag.\n    "
        )
      ]),
      _vm.index.length > 0
        ? _c(
            "ul",
            _vm._l(_vm.index, function(i) {
              return _c("li", [
                _c(
                  "a",
                  {
                    attrs: { href: "#" },
                    on: {
                      click: function($event) {
                        return _vm.goto(i.secs)
                      }
                    }
                  },
                  [
                    _vm._v(
                      _vm._s(Math.floor(i.secs / 60)) +
                        ":" +
                        _vm._s(new String(i.secs % 60).padStart(2, "0")) +
                        " " +
                        _vm._s(i.caption)
                    )
                  ]
                )
              ])
            }),
            0
          )
        : _vm._e()
    ])
  };
  var __vue_staticRenderFns__$8 = [];
  __vue_render__$8._withStripped = true;

    /* style */
    const __vue_inject_styles__$8 = undefined;
    /* scoped */
    const __vue_scope_id__$8 = undefined;
    /* module identifier */
    const __vue_module_identifier__$8 = undefined;
    /* functional template */
    const __vue_is_functional_template__$8 = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var VideoPlugin = normalizeComponent_1(
      { render: __vue_render__$8, staticRenderFns: __vue_staticRenderFns__$8 },
      __vue_inject_styles__$8,
      __vue_script__$7,
      __vue_scope_id__$8,
      __vue_is_functional_template__$8,
      __vue_module_identifier__$8,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

   var script$8 = {
       name: 'cat-math',
       props: ['root'],
       data () {
  	 return {
  	     player: null
  	 };
       },
       methods: {
  	 get_pos: function(id) {
  	     var el = document.getElementById("category-math-plugin-expr-"+id);
  	     var top = el.getBoundingClientRect().y;
  	     return {'position':'absolute','left':'-25%','top':top+'px','width':'25%'};
  	 }
       },
       created: function(){
  	 Guppy.init({"path":"/node_modules/guppy-js","symbols":"/node_modules/guppy-js/sym/symbols.json"});
       }, 
       mounted: function(){
  	 var doc_id = node+"-"+index;
  	 if(index == 0) this.docs[node] = {};
  	 var content = root.innerHTML.trim();
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

  	 var snippet = "";
  	 if(root.previousSibling){
  	     snippet += root.previousSibling.textContent.split(" ").slice(-4).join(" ");
  	 }
  	 snippet += " [formula] ";

  	 if(root.nextSibling) {
  	     snippet += root.nextSibling.textContent.split(" ").slice(0,4).join(" ");
  	 }
  	 snippet = "..." + snippet + "...";
  	 console.log("parprev",root.parentNode.previousSibling);
  	 console.log("parnext",root.parentNode.nextSibling);

  	 this.snippets[doc_id] = snippet;
  	 
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
   };

  /* script */
  const __vue_script__$8 = script$8;

  /* template */
  var __vue_render__$9 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("span", { staticClass: "category-math-plugin" }, [
      _c("a", { attrs: { name: "category-math-plugin-link-" + _vm.id } }),
      _c("div", {
        staticClass: "category-math-plugin-math",
        attrs: { id: "category-math-plugin-expr-" + _vm.id },
        domProps: { innerHTML: _vm._s(_vm.rendered) },
        on: {
          click: function($event) {
            _vm.display_syms = !_vm.display_syms;
          }
        }
      }),
      _vm.display_syms
        ? _c(
            "div",
            {
              staticClass: "category-math-plugin-vars",
              style: _vm.get_pos(_vm.id)
            },
            [
              _c(
                "a",
                {
                  attrs: { href: "#" },
                  on: {
                    click: function($event) {
                      _vm.display_syms = false;
                      _vm.query = "";
                    }
                  }
                },
                [_vm._v("[x]")]
              ),
              _vm._v("\n\t    Vars:\n\t    "),
              _c(
                "ul",
                _vm._l(_vm.syms, function(e) {
                  return _c("li", [
                    _c(
                      "a",
                      {
                        attrs: { href: "#" },
                        on: {
                          click: function($event) {
                            _vm.query = e;
                          }
                        }
                      },
                      [_vm._v(_vm._s(e))]
                    )
                  ])
                }),
                0
              ),
              _vm.display_syms && _vm.query != ""
                ? _c("div", { staticClass: "category-math-plugin-refs" }, [
                    _vm._v("\n\t\tUses:\n\t\t"),
                    _c(
                      "ul",
                      _vm._l(_vm.master.index[_vm.query], function(x) {
                        return _c("li", [
                          _c(
                            "a",
                            {
                              attrs: { href: "#category-math-plugin-link-" + x }
                            },
                            [_vm._v(_vm._s(_vm.master.snippets[x]))]
                          )
                        ])
                      }),
                      0
                    )
                  ])
                : _vm._e()
            ]
          )
        : _vm._e()
    ])
  };
  var __vue_staticRenderFns__$9 = [];
  __vue_render__$9._withStripped = true;

    /* style */
    const __vue_inject_styles__$9 = function (inject) {
      if (!inject) return
      inject("data-v-ae718248_0", { source: "\n.category-math-plugin-math[data-v-ae718248] {\n    cursor:pointer;\n    display:inline-block;\n}\n.category-math-plugin-vars[data-v-ae718248] {\n    background-color: #dd5;\n    padding:1ex;\n    border: 1px solid black;\n    z-index:1;\n}\n.category-math-plugin-refs[data-v-ae718248] {\n    background-color: #ff5;\n    padding:2ex 1ex;\n}\n", map: {"version":3,"sources":["/home/zoom/suit/category/page/src/plugins/math.vue"],"names":[],"mappings":";AAgGA;IACA,cAAA;IACA,oBAAA;AACA;AAEA;IACA,sBAAA;IACA,WAAA;IACA,uBAAA;IACA,SAAA;AACA;AAEA;IACA,sBAAA;IACA,eAAA;AACA","file":"math.vue","sourcesContent":["<template>\n    <span class=\"category-math-plugin\">\n\t<a v-bind:name=\"'category-math-plugin-link-'+id\"></a>\n\t<div v-bind:id=\"'category-math-plugin-expr-'+id\" class=\"category-math-plugin-math\" v-on:click=\"display_syms = !display_syms\" v-html=\"rendered\"></div>\n\t<div class=\"category-math-plugin-vars\" v-bind:style=\"get_pos(id)\" v-if=\"display_syms\">\n\t    <a href=\"#\" v-on:click=\"display_syms = false; query = ''\">[x]</a>\n\t    Vars:\n\t    <ul>\n\t\t<li v-for=\"e in syms\">\n\t\t    <a href=\"#\" v-on:click=\"query = e\">{{e}}</a>\n\t\t</li>\n\t    </ul>\n\t    <div class=\"category-math-plugin-refs\" v-if=\"display_syms && query != ''\">\n\t\tUses:\n\t\t<ul>\n\t\t    <li v-for=\"x in master.index[query]\">\n\t\t\t<a v-bind:href=\"'#category-math-plugin-link-'+x\">{{master.snippets[x]}}</a>\n\t\t    </li>\n\t\t</ul>\n\t    </div>\n\t</div>\n    </span>\n</template>\n<script>\n export default {\n     name: 'cat-math',\n     props: ['root'],\n     data () {\n\t return {\n\t     player: null\n\t };\n     },\n     methods: {\n\t get_pos: function(id) {\n\t     var el = document.getElementById(\"category-math-plugin-expr-\"+id);\n\t     var top = el.getBoundingClientRect().y;\n\t     return {'position':'absolute','left':'-25%','top':top+'px','width':'25%'};\n\t }\n     },\n     created: function(){\n\t Guppy.init({\"path\":\"/node_modules/guppy-js\",\"symbols\":\"/node_modules/guppy-js/sym/symbols.json\"});\n     }, \n     mounted: function(){\n\t var doc_id = node+\"-\"+index;\n\t if(index == 0) this.docs[node] = {};\n\t var content = root.innerHTML.trim()\n\t console.log(\"R\",root,content);\n\t var res = Guppy.Doc.render(content, \"text\");\n\t res.container.setAttribute(\"id\",\"category-math-container-\"+doc_id);\n\t this.docs[node][index] = res.doc.get_vars().concat(res.doc.get_symbols());\n\t var rendered_content = (new XMLSerializer()).serializeToString(res.container);\n\t var container = document.createElement(\"span\");\n\n\n\t \n\t // Put this doc ID in the index for each var and symbol in the document\n\t for(var i = 0; i < this.docs[node][index].length; i++) {\n\t     var v = this.docs[node][index][i];\n\t     if (!this.index[v]) this.index[v] = [];\n\t     if (this.index[v].indexOf(doc_id) < 0) this.index[v].push(doc_id);\n\t }\n\n\t var snippet = \"\";\n\t if(root.previousSibling){\n\t     snippet += root.previousSibling.textContent.split(\" \").slice(-4).join(\" \");\n\t }\n\t snippet += \" [formula] \"\n\n\t if(root.nextSibling) {\n\t     snippet += root.nextSibling.textContent.split(\" \").slice(0,4).join(\" \");\n\t }\n\t snippet = \"...\" + snippet + \"...\";\n\t console.log(\"parprev\",root.parentNode.previousSibling);\n\t console.log(\"parnext\",root.parentNode.nextSibling);\n\n\t this.snippets[doc_id] = snippet;\n\t \n         root.parentNode.insertBefore(container, root);\n\n\t new comp.$options.components['math-plugin']({\n\t     el: container,\n\t     parent: comp,\n\t     propsData:{\n\t\t syms:this.docs[node][index],\n\t\t rendered:rendered_content,\n\t\t display_syms:false,\n\t\t id:doc_id,\n\t\t master:this,\n\t\t query:\"\",\n\t\t node:node\n\t     }\n\t });\n     }\n }\n</script>\n<style scoped>\n .category-math-plugin-math {\n     cursor:pointer;\n     display:inline-block;\n }\n\n .category-math-plugin-vars {\n     background-color: #dd5;\n     padding:1ex;\n     border: 1px solid black;\n     z-index:1;\n }\n\n .category-math-plugin-refs {\n     background-color: #ff5;\n     padding:2ex 1ex;\n }\n</style>\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$9 = "data-v-ae718248";
    /* module identifier */
    const __vue_module_identifier__$9 = undefined;
    /* functional template */
    const __vue_is_functional_template__$9 = false;
    /* style inject SSR */
    

    
    normalizeComponent_1(
      { render: __vue_render__$9, staticRenderFns: __vue_staticRenderFns__$9 },
      __vue_inject_styles__$9,
      __vue_script__$8,
      __vue_scope_id__$9,
      __vue_is_functional_template__$9,
      __vue_module_identifier__$9,
      browser,
      undefined
    );

  //
  //
  //

   var script$9 = {
       name: 'cat-link',
       props: ['root'],
       data () {
  	 return {
  	     target: '',
  	     name: ''
  	 };
       },
       mounted: function(){
  	 var doc = this.root.innerHTML.trim();
  	 var idx = doc.indexOf(":");
  	 this.target = doc.substring(0,idx);
  	 this.name = doc.substring(idx+1);
       }
   };

  /* script */
  const __vue_script__$9 = script$9;

  /* template */
  var __vue_render__$a = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("router-link", { attrs: { to: "./" + _vm.target } }, [
      _vm._v(_vm._s(_vm.name))
    ])
  };
  var __vue_staticRenderFns__$a = [];
  __vue_render__$a._withStripped = true;

    /* style */
    const __vue_inject_styles__$a = undefined;
    /* scoped */
    const __vue_scope_id__$a = undefined;
    /* module identifier */
    const __vue_module_identifier__$a = undefined;
    /* functional template */
    const __vue_is_functional_template__$a = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var LinkPlugin = normalizeComponent_1(
      { render: __vue_render__$a, staticRenderFns: __vue_staticRenderFns__$a },
      __vue_inject_styles__$a,
      __vue_script__$9,
      __vue_scope_id__$a,
      __vue_is_functional_template__$a,
      __vue_module_identifier__$a,
      undefined,
      undefined
    );

  //
   
   var script$a = {
       name: 'cat-query',
       props: ['root'],
       
       // Need to have access to all the nodes in order to search them
       computed: {
  	 ...Vuex.mapState(['nodes'])
       },
       data () {
  	 return {
  	     result: []
  	 };
       },
       mounted: function(){
  	 var query_text = this.root.innerHTML.trim();
  	 var q = Vue.category_query.parse(query_text);
  	 var query_result = Vue.category_search(q, this.nodes);
  	 this.result = query_result;
       }
   };

  /* script */
  const __vue_script__$a = script$a;

  /* template */
  var __vue_render__$b = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "ul",
      { staticClass: "category-query-plugin-result" },
      _vm._l(_vm.result, function(node) {
        return _c(
          "li",
          [
            _c("router-link", { attrs: { to: "./" + node } }, [
              _vm._v(_vm._s(_vm.nodes[node].name))
            ])
          ],
          1
        )
      }),
      0
    )
  };
  var __vue_staticRenderFns__$b = [];
  __vue_render__$b._withStripped = true;

    /* style */
    const __vue_inject_styles__$b = undefined;
    /* scoped */
    const __vue_scope_id__$b = undefined;
    /* module identifier */
    const __vue_module_identifier__$b = undefined;
    /* functional template */
    const __vue_is_functional_template__$b = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var QueryPlugin = normalizeComponent_1(
      { render: __vue_render__$b, staticRenderFns: __vue_staticRenderFns__$b },
      __vue_inject_styles__$b,
      __vue_script__$a,
      __vue_scope_id__$b,
      __vue_is_functional_template__$b,
      __vue_module_identifier__$b,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

   var script$b = {
       name: 'cat-slideshow',
       props: ['root'],
       data() {
  	 return {
  	     current_index: 0,
  	     lock_index: 0,
  	     init_index: 0,
  	     all: false,
  	     slides: [],
  	 };
       },
       mounted: function() {
  	 var doc = this.root;
  	 var elements = [];

  	 // Iterate through li nodes and extract these as the slides
  	 for(var n = doc.firstChild.firstChild; n != null; n = n.nextSibling){
  	     if(n.nodeName.toLowerCase() == "li") elements.push(n.innerHTML);
  	 }
  	 
  	 this.slides = elements;
       },
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
   };

  /* script */
  const __vue_script__$b = script$b;

  /* template */
  var __vue_render__$c = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { staticClass: "category-slideshow" },
      [
        _vm._l(_vm.slides, function(s, index) {
          return _c(
            "span",
            {
              class:
                _vm.current_index == index && !_vm.all
                  ? "category-slideshow-button category-slideshow-button-current"
                  : "category-slideshow-button category-slideshow-button-other",
              on: {
                mouseover: function($event) {
                  return _vm.tmp_set_index(index)
                },
                mouseout: function($event) {
                  return _vm.reset_index()
                },
                click: function($event) {
                  return _vm.set_index(index)
                }
              }
            },
            [_vm._v("\n\t    " + _vm._s(index) + "\n\t")]
          )
        }),
        _c(
          "span",
          {
            class: _vm.all
              ? "category-slideshow-button category-slideshow-button-current"
              : "category-slideshow-button category-slideshow-button-other",
            on: {
              click: function($event) {
                _vm.all = !_vm.all;
              }
            }
          },
          [_vm._v("\n\t    all\n\t")]
        ),
        !_vm.all
          ? _c("div", {
              staticClass: "category-slideshow-slide",
              domProps: { innerHTML: _vm._s(_vm.slides[_vm.current_index]) }
            })
          : _vm._e(),
        _vm._l(_vm.slides, function(s, index) {
          return _vm.all
            ? _c("div", {
                staticClass: "category-slideshow-slide",
                domProps: { innerHTML: _vm._s(s) }
              })
            : _vm._e()
        })
      ],
      2
    )
  };
  var __vue_staticRenderFns__$c = [];
  __vue_render__$c._withStripped = true;

    /* style */
    const __vue_inject_styles__$c = function (inject) {
      if (!inject) return
      inject("data-v-4a2e9466_0", { source: "\n.category-slideshow[data-v-4a2e9466] {\n    text-align:center;\n    width:100%;\n    overflow-x:scroll;\n}\n.category-slideshow-slide[data-v-4a2e9466] {\n    text-align:center;\n}\n.category-slideshow-caption[data-v-4a2e9466] {\n    text-align:center;\n    margin:auto;\n    width:80%;\n}\n.category-slideshow-button[data-v-4a2e9466] {\n    width:2em;\n    display:inline-block;\n    height:2em;\n    border:2px solid black;\n    text-align:center;\n    cursor:pointer;\n    margin:.5ex 0;\n}\n.category-slideshow-button-other[data-v-4a2e9466] {\n    background-color:#ccc;\n}\n.category-slideshow-button-current[data-v-4a2e9466] {\n    background-color:#8cf;\n}\n", map: {"version":3,"sources":["/home/zoom/suit/category/page/src/plugins/slideshow.vue"],"names":[],"mappings":";AAuDA;IACA,iBAAA;IACA,UAAA;IACA,iBAAA;AACA;AAEA;IACA,iBAAA;AACA;AAEA;IACA,iBAAA;IACA,WAAA;IACA,SAAA;AACA;AAEA;IACA,SAAA;IACA,oBAAA;IACA,UAAA;IACA,sBAAA;IACA,iBAAA;IACA,cAAA;IACA,aAAA;AACA;AAEA;IACA,qBAAA;AACA;AAEA;IACA,qBAAA;AACA","file":"slideshow.vue","sourcesContent":["<template>\n    <div class=\"category-slideshow\">\n\t<span :class=\"current_index == index && !all ? 'category-slideshow-button category-slideshow-button-current' : 'category-slideshow-button category-slideshow-button-other'\" v-for=\"(s,index) in slides\" v-on:mouseover=\"tmp_set_index(index)\" v-on:mouseout=\"reset_index()\" v-on:click=\"set_index(index)\">\n\t    {{index}}\n\t</span>\n\t<span :class=\"all ? 'category-slideshow-button category-slideshow-button-current' : 'category-slideshow-button category-slideshow-button-other'\" v-on:click=\"all=!all\">\n\t    all\n\t</span>\n\t<div class=\"category-slideshow-slide\" v-html=\"slides[current_index]\" v-if=\"!all\">\n\t</div>\n\t<div class=\"category-slideshow-slide\" v-for=\"(s,index) in slides\" v-if=\"all\" v-html=\"s\">\n\t</div>\n    </div>\n</template>\n<script>\n export default {\n     name: 'cat-slideshow',\n     props: ['root'],\n     data() {\n\t return {\n\t     current_index: 0,\n\t     lock_index: 0,\n\t     init_index: 0,\n\t     all: false,\n\t     slides: [],\n\t };\n     },\n     mounted: function() {\n\t var doc = this.root;\n\t var elements = [];\n\n\t // Iterate through li nodes and extract these as the slides\n\t for(var n = doc.firstChild.firstChild; n != null; n = n.nextSibling){\n\t     if(n.nodeName.toLowerCase() == \"li\") elements.push(n.innerHTML);\n\t }\n\t \n\t this.slides = elements;\n     },\n     methods: {\n\t tmp_set_index: function(idx){\n\t     this.current_index = idx;\n\t },\n\t reset_index: function(){\n\t     this.current_index = this.lock_index;\n\t },\n\t set_index: function(idx){\n\t     this.all = false;\n\t     this.lock_index = idx;\n\t     this.current_index = idx;\n\t }\n     }\n }\n</script>\n\n<style scoped>\n .category-slideshow {\n     text-align:center;\n     width:100%;\n     overflow-x:scroll;\n }\n\n .category-slideshow-slide {\n     text-align:center;\n }\n\n .category-slideshow-caption {\n     text-align:center;\n     margin:auto;\n     width:80%;\n }\n\n .category-slideshow-button {\n     width:2em;\n     display:inline-block;\n     height:2em;\n     border:2px solid black;\n     text-align:center;\n     cursor:pointer;\n     margin:.5ex 0;\n }\n\n .category-slideshow-button-other {\n     background-color:#ccc;\n }\n\n .category-slideshow-button-current {\n     background-color:#8cf;\n }\n</style>\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$c = "data-v-4a2e9466";
    /* module identifier */
    const __vue_module_identifier__$c = undefined;
    /* functional template */
    const __vue_is_functional_template__$c = false;
    /* style inject SSR */
    

    
    var SlideshowPlugin = normalizeComponent_1(
      { render: __vue_render__$c, staticRenderFns: __vue_staticRenderFns__$c },
      __vue_inject_styles__$c,
      __vue_script__$b,
      __vue_scope_id__$c,
      __vue_is_functional_template__$c,
      __vue_module_identifier__$c,
      browser,
      undefined
    );

  /* parser generated by jison 0.4.18 */
  /*
    Returns a Parser object of the following structure:

    Parser: {
      yy: {}
    }

    Parser.prototype: {
      yy: {},
      trace: function(),
      symbols_: {associative list: name ==> number},
      terminals_: {associative list: number ==> name},
      productions_: [...],
      performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
      table: [...],
      defaultActions: {...},
      parseError: function(str, hash),
      parse: function(input),

      lexer: {
          EOF: 1,
          parseError: function(str, hash),
          setInput: function(input),
          input: function(),
          unput: function(str),
          more: function(),
          less: function(n),
          pastInput: function(),
          upcomingInput: function(),
          showPosition: function(),
          test_match: function(regex_match_array, rule_index),
          next: function(),
          lex: function(),
          begin: function(condition),
          popState: function(),
          _currentRules: function(),
          topState: function(),
          pushState: function(condition),

          options: {
              ranges: boolean           (optional: true ==> token location info will include a .range[] member)
              flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
              backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
          },

          performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
          rules: [...],
          conditions: {associative list: name ==> set},
      }
    }


    token location info (@$, _$, etc.): {
      first_line: n,
      last_line: n,
      first_column: n,
      last_column: n,
      range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
    }


    the parseError function receives a 'hash' object with these members for lexer and parser errors: {
      text:        (matched text)
      token:       (the produced terminal token, if any)
      line:        (yylineno)
    }
    while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
      loc:         (yylloc)
      expected:    (string describing the set of expected tokens)
      recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
    }
  */
  var query = (function(){
  var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,4],$V1=[1,5],$V2=[1,7],$V3=[1,6],$V4=[1,9],$V5=[1,10],$V6=[1,12],$V7=[1,13],$V8=[5,12,14,15],$V9=[5,9,10,12,14,15],$Va=[5,9,10,12,14,15,18];
  var parser = {trace: function trace () { },
  yy: {},
  symbols_: {"error":2,"query":3,"q":4,"EOF":5,"name":6,"HAS":7,"IS":8,":":9,"OF":10,"(":11,")":12,"!":13,",":14,"/":15,"words":16,"*":17,"STR":18,"$accept":0,"$end":1},
  terminals_: {2:"error",5:"EOF",7:"HAS",8:"IS",9:":",10:"OF",11:"(",12:")",13:"!",14:",",15:"/",17:"*",18:"STR"},
  productions_: [0,[3,2],[4,1],[4,2],[4,2],[4,4],[4,4],[4,6],[4,6],[4,2],[4,4],[4,3],[4,3],[4,3],[6,1],[6,1],[16,2],[16,1]],
  performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
  /* this == yyval */

  var $0 = $$.length - 1;
  switch (yystate) {
  case 1:
   return $$[$0-1]; 
  break;
  case 2:
  this.$ = ["name",$$[$0]];
  break;
  case 3:
  this.$ = ["edge",{"name":$$[$0],"dir":"has"}];
  break;
  case 4:
  this.$ = ["edge",{"name":$$[$0],"dir":"is"}];
  break;
  case 5:
  this.$ = ["edge",{"name":$$[$0-2],"dir":"has","query":["name",$$[$0]]}];
  break;
  case 6:
  this.$ = ["edge",{"name":$$[$0-3],"dir":"is","query":["name",$$[$0]]}];
  break;
  case 7:
  this.$ = ["edge",{"name":$$[$0-4],"dir":"has","query":$$[$0-1]}];
  break;
  case 8:
  this.$ = ["edge",{"name":$$[$0-5],"dir":"is","query":$$[$0-1]}];
  break;
  case 9:
  this.$ = ["not",[["name",$$[$0]]]];
  break;
  case 10:
  this.$ = ["not",[$$[$0-1]]];
  break;
  case 11:
  this.$ = $$[$0-1];
  break;
  case 12:
  this.$ = ["and",[$$[$0-2], $$[$0]]];
  break;
  case 13:
  this.$ = ["or",[$$[$0-2], $$[$0]]];
  break;
  case 14:
  this.$ = $$[$0];
  break;
  case 15:
  this.$ = "*";
  break;
  case 16:
  this.$ = $$[$0-1] +" "+ $$[$0];
  break;
  case 17:
  this.$ = $$[$0];
  break;
  }
  },
  table: [{3:1,4:2,6:3,7:$V0,8:$V1,11:$V2,13:$V3,16:8,17:$V4,18:$V5},{1:[3]},{5:[1,11],14:$V6,15:$V7},o($V8,[2,2],{10:[1,14]}),{6:15,16:8,17:$V4,18:$V5},{6:16,16:8,17:$V4,18:$V5},{6:17,11:[1,18],16:8,17:$V4,18:$V5},{4:19,6:3,7:$V0,8:$V1,11:$V2,13:$V3,16:8,17:$V4,18:$V5},o($V9,[2,14],{18:[1,20]}),o($V9,[2,15]),o($Va,[2,17]),{1:[2,1]},{4:21,6:3,7:$V0,8:$V1,11:$V2,13:$V3,16:8,17:$V4,18:$V5},{4:22,6:3,7:$V0,8:$V1,11:$V2,13:$V3,16:8,17:$V4,18:$V5},{9:[1,23]},o($V8,[2,3],{9:[1,24]}),o($V8,[2,4]),o($V8,[2,9]),{4:25,6:3,7:$V0,8:$V1,11:$V2,13:$V3,16:8,17:$V4,18:$V5},{12:[1,26],14:$V6,15:$V7},o($Va,[2,16]),o($V8,[2,12]),o([5,12,15],[2,13],{14:$V6}),{6:27,11:[1,28],16:8,17:$V4,18:$V5},{6:29,11:[1,30],16:8,17:$V4,18:$V5},{12:[1,31],14:$V6,15:$V7},o($V8,[2,11]),o($V8,[2,6]),{4:32,6:3,7:$V0,8:$V1,11:$V2,13:$V3,16:8,17:$V4,18:$V5},o($V8,[2,5]),{4:33,6:3,7:$V0,8:$V1,11:$V2,13:$V3,16:8,17:$V4,18:$V5},o($V8,[2,10]),{12:[1,34],14:$V6,15:$V7},{12:[1,35],14:$V6,15:$V7},o($V8,[2,8]),o($V8,[2,7])],
  defaultActions: {11:[2,1]},
  parseError: function parseError (str, hash) {
      if (hash.recoverable) {
          this.trace(str);
      } else {
          var error = new Error(str);
          error.hash = hash;
          throw error;
      }
  },
  parse: function parse(input) {
      var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, TERROR = 2, EOF = 1;
      var args = lstack.slice.call(arguments, 1);
      var lexer = Object.create(this.lexer);
      var sharedState = { yy: {} };
      for (var k in this.yy) {
          if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
              sharedState.yy[k] = this.yy[k];
          }
      }
      lexer.setInput(input, sharedState.yy);
      sharedState.yy.lexer = lexer;
      sharedState.yy.parser = this;
      if (typeof lexer.yylloc == 'undefined') {
          lexer.yylloc = {};
      }
      var yyloc = lexer.yylloc;
      lstack.push(yyloc);
      var ranges = lexer.options && lexer.options.ranges;
      if (typeof sharedState.yy.parseError === 'function') {
          this.parseError = sharedState.yy.parseError;
      } else {
          this.parseError = Object.getPrototypeOf(this).parseError;
      }
      _token_stack:
          var lex = function () {
              var token;
              token = lexer.lex() || EOF;
              if (typeof token !== 'number') {
                  token = self.symbols_[token] || token;
              }
              return token;
          };
      var symbol, preErrorSymbol, state, action, r, yyval = {}, p, len, newState, expected;
      while (true) {
          state = stack[stack.length - 1];
          if (this.defaultActions[state]) {
              action = this.defaultActions[state];
          } else {
              if (symbol === null || typeof symbol == 'undefined') {
                  symbol = lex();
              }
              action = table[state] && table[state][symbol];
          }
                      if (typeof action === 'undefined' || !action.length || !action[0]) {
                  var errStr = '';
                  expected = [];
                  for (p in table[state]) {
                      if (this.terminals_[p] && p > TERROR) {
                          expected.push('\'' + this.terminals_[p] + '\'');
                      }
                  }
                  if (lexer.showPosition) {
                      errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                  } else {
                      errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                  }
                  this.parseError(errStr, {
                      text: lexer.match,
                      token: this.terminals_[symbol] || symbol,
                      line: lexer.yylineno,
                      loc: yyloc,
                      expected: expected
                  });
              }
          if (action[0] instanceof Array && action.length > 1) {
              throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
          }
          switch (action[0]) {
          case 1:
              stack.push(symbol);
              vstack.push(lexer.yytext);
              lstack.push(lexer.yylloc);
              stack.push(action[1]);
              symbol = null;
              if (!preErrorSymbol) {
                  yyleng = lexer.yyleng;
                  yytext = lexer.yytext;
                  yylineno = lexer.yylineno;
                  yyloc = lexer.yylloc;
              } else {
                  symbol = preErrorSymbol;
                  preErrorSymbol = null;
              }
              break;
          case 2:
              len = this.productions_[action[1]][1];
              yyval.$ = vstack[vstack.length - len];
              yyval._$ = {
                  first_line: lstack[lstack.length - (len || 1)].first_line,
                  last_line: lstack[lstack.length - 1].last_line,
                  first_column: lstack[lstack.length - (len || 1)].first_column,
                  last_column: lstack[lstack.length - 1].last_column
              };
              if (ranges) {
                  yyval._$.range = [
                      lstack[lstack.length - (len || 1)].range[0],
                      lstack[lstack.length - 1].range[1]
                  ];
              }
              r = this.performAction.apply(yyval, [
                  yytext,
                  yyleng,
                  yylineno,
                  sharedState.yy,
                  action[1],
                  vstack,
                  lstack
              ].concat(args));
              if (typeof r !== 'undefined') {
                  return r;
              }
              if (len) {
                  stack = stack.slice(0, -1 * len * 2);
                  vstack = vstack.slice(0, -1 * len);
                  lstack = lstack.slice(0, -1 * len);
              }
              stack.push(this.productions_[action[1]][0]);
              vstack.push(yyval.$);
              lstack.push(yyval._$);
              newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
              stack.push(newState);
              break;
          case 3:
              return true;
          }
      }
      return true;
  }};
  /* generated by jison-lex 0.3.4 */
  var lexer = (function(){
  var lexer = ({

  EOF:1,

  parseError:function parseError(str, hash) {
          if (this.yy.parser) {
              this.yy.parser.parseError(str, hash);
          } else {
              throw new Error(str);
          }
      },

  // resets the lexer, sets new input
  setInput:function (input, yy) {
          this.yy = yy || this.yy || {};
          this._input = input;
          this._more = this._backtrack = this.done = false;
          this.yylineno = this.yyleng = 0;
          this.yytext = this.matched = this.match = '';
          this.conditionStack = ['INITIAL'];
          this.yylloc = {
              first_line: 1,
              first_column: 0,
              last_line: 1,
              last_column: 0
          };
          if (this.options.ranges) {
              this.yylloc.range = [0,0];
          }
          this.offset = 0;
          return this;
      },

  // consumes and returns one char from the input
  input:function () {
          var ch = this._input[0];
          this.yytext += ch;
          this.yyleng++;
          this.offset++;
          this.match += ch;
          this.matched += ch;
          var lines = ch.match(/(?:\r\n?|\n).*/g);
          if (lines) {
              this.yylineno++;
              this.yylloc.last_line++;
          } else {
              this.yylloc.last_column++;
          }
          if (this.options.ranges) {
              this.yylloc.range[1]++;
          }

          this._input = this._input.slice(1);
          return ch;
      },

  // unshifts one char (or a string) into the input
  unput:function (ch) {
          var len = ch.length;
          var lines = ch.split(/(?:\r\n?|\n)/g);

          this._input = ch + this._input;
          this.yytext = this.yytext.substr(0, this.yytext.length - len);
          //this.yyleng -= len;
          this.offset -= len;
          var oldLines = this.match.split(/(?:\r\n?|\n)/g);
          this.match = this.match.substr(0, this.match.length - 1);
          this.matched = this.matched.substr(0, this.matched.length - 1);

          if (lines.length - 1) {
              this.yylineno -= lines.length - 1;
          }
          var r = this.yylloc.range;

          this.yylloc = {
              first_line: this.yylloc.first_line,
              last_line: this.yylineno + 1,
              first_column: this.yylloc.first_column,
              last_column: lines ?
                  (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                   + oldLines[oldLines.length - lines.length].length - lines[0].length :
                this.yylloc.first_column - len
          };

          if (this.options.ranges) {
              this.yylloc.range = [r[0], r[0] + this.yyleng - len];
          }
          this.yyleng = this.yytext.length;
          return this;
      },

  // When called from action, caches matched text and appends it on next action
  more:function () {
          this._more = true;
          return this;
      },

  // When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
  reject:function () {
          if (this.options.backtrack_lexer) {
              this._backtrack = true;
          } else {
              return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                  text: "",
                  token: null,
                  line: this.yylineno
              });

          }
          return this;
      },

  // retain first n characters of the match
  less:function (n) {
          this.unput(this.match.slice(n));
      },

  // displays already matched input, i.e. for error messages
  pastInput:function () {
          var past = this.matched.substr(0, this.matched.length - this.match.length);
          return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
      },

  // displays upcoming input, i.e. for error messages
  upcomingInput:function () {
          var next = this.match;
          if (next.length < 20) {
              next += this._input.substr(0, 20-next.length);
          }
          return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
      },

  // displays the character position where the lexing error occurred, i.e. for error messages
  showPosition:function () {
          var pre = this.pastInput();
          var c = new Array(pre.length + 1).join("-");
          return pre + this.upcomingInput() + "\n" + c + "^";
      },

  // test the lexed token: return FALSE when not a match, otherwise return token
  test_match:function(match, indexed_rule) {
          var token,
              lines,
              backup;

          if (this.options.backtrack_lexer) {
              // save context
              backup = {
                  yylineno: this.yylineno,
                  yylloc: {
                      first_line: this.yylloc.first_line,
                      last_line: this.last_line,
                      first_column: this.yylloc.first_column,
                      last_column: this.yylloc.last_column
                  },
                  yytext: this.yytext,
                  match: this.match,
                  matches: this.matches,
                  matched: this.matched,
                  yyleng: this.yyleng,
                  offset: this.offset,
                  _more: this._more,
                  _input: this._input,
                  yy: this.yy,
                  conditionStack: this.conditionStack.slice(0),
                  done: this.done
              };
              if (this.options.ranges) {
                  backup.yylloc.range = this.yylloc.range.slice(0);
              }
          }

          lines = match[0].match(/(?:\r\n?|\n).*/g);
          if (lines) {
              this.yylineno += lines.length;
          }
          this.yylloc = {
              first_line: this.yylloc.last_line,
              last_line: this.yylineno + 1,
              first_column: this.yylloc.last_column,
              last_column: lines ?
                           lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                           this.yylloc.last_column + match[0].length
          };
          this.yytext += match[0];
          this.match += match[0];
          this.matches = match;
          this.yyleng = this.yytext.length;
          if (this.options.ranges) {
              this.yylloc.range = [this.offset, this.offset += this.yyleng];
          }
          this._more = false;
          this._backtrack = false;
          this._input = this._input.slice(match[0].length);
          this.matched += match[0];
          token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
          if (this.done && this._input) {
              this.done = false;
          }
          if (token) {
              return token;
          } else if (this._backtrack) {
              // recover context
              for (var k in backup) {
                  this[k] = backup[k];
              }
              return false; // rule action called reject() implying the next rule should be tested instead.
          }
          return false;
      },

  // return next match in input
  next:function () {
          if (this.done) {
              return this.EOF;
          }
          if (!this._input) {
              this.done = true;
          }

          var token,
              match,
              tempMatch,
              index;
          if (!this._more) {
              this.yytext = '';
              this.match = '';
          }
          var rules = this._currentRules();
          for (var i = 0; i < rules.length; i++) {
              tempMatch = this._input.match(this.rules[rules[i]]);
              if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                  match = tempMatch;
                  index = i;
                  if (this.options.backtrack_lexer) {
                      token = this.test_match(tempMatch, rules[i]);
                      if (token !== false) {
                          return token;
                      } else if (this._backtrack) {
                          match = false;
                          continue; // rule action called reject() implying a rule MISmatch.
                      } else {
                          // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                          return false;
                      }
                  } else if (!this.options.flex) {
                      break;
                  }
              }
          }
          if (match) {
              token = this.test_match(match, rules[index]);
              if (token !== false) {
                  return token;
              }
              // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
              return false;
          }
          if (this._input === "") {
              return this.EOF;
          } else {
              return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                  text: "",
                  token: null,
                  line: this.yylineno
              });
          }
      },

  // return next match that has a token
  lex:function lex () {
          var r = this.next();
          if (r) {
              return r;
          } else {
              return this.lex();
          }
      },

  // activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
  begin:function begin (condition) {
          this.conditionStack.push(condition);
      },

  // pop the previously active lexer condition state off the condition stack
  popState:function popState () {
          var n = this.conditionStack.length - 1;
          if (n > 0) {
              return this.conditionStack.pop();
          } else {
              return this.conditionStack[0];
          }
      },

  // produce the lexer rule set which is active for the currently active lexer condition state
  _currentRules:function _currentRules () {
          if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
              return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
          } else {
              return this.conditions["INITIAL"].rules;
          }
      },

  // return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
  topState:function topState (n) {
          n = this.conditionStack.length - 1 - Math.abs(n || 0);
          if (n >= 0) {
              return this.conditionStack[n];
          } else {
              return "INITIAL";
          }
      },

  // alias for begin(condition)
  pushState:function pushState (condition) {
          this.begin(condition);
      },

  // return the number of states currently on the stack
  stateStackSize:function stateStackSize() {
          return this.conditionStack.length;
      },
  options: {},
  performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
  switch($avoiding_name_collisions) {
  case 0:/* skip whitespace */
  break;
  case 1:return 13
  break;
  case 2:return 17
  break;
  case 3:return 15
  break;
  case 4:return ';'
  break;
  case 5:return 9
  break;
  case 6:return 14
  break;
  case 7:return 11
  break;
  case 8:return 12
  break;
  case 9:return 7
  break;
  case 10:return 8
  break;
  case 11:return 10
  break;
  case 12:return 'C'
  break;
  case 13:return 18
  break;
  case 14:return 5
  break;
  case 15:return 'INVALID'
  break;
  }
  },
  rules: [/^(?:\s+)/,/^(?:!)/,/^(?:\*)/,/^(?:\/)/,/^(?:;)/,/^(?::)/,/^(?:,)/,/^(?:\()/,/^(?:\))/,/^(?:has\b)/,/^(?:is\b)/,/^(?:of\b)/,/^(?:c\b)/,/^(?:(?!has)(?!of)[^*;\/,:()! ]+)/,/^(?:$)/,/^(?:.)/],
  conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"inclusive":true}}
  });
  return lexer;
  })();
  parser.lexer = lexer;
  function Parser () {
    this.yy = {};
  }
  Parser.prototype = parser;parser.Parser = Parser;
  return new Parser;
  })();var query_1 = query;

  var intersect_lists = function(l1,l2){
      var result = [];
      for(var i = 0; i < l1.length; i++){
  	for(var j = 0; j < l2.length; j++){
  	    if(l1[i] == l2[j]) result.push(l1[i]);
  	}
      }
      return result;
  };

  var union_lists = function(l1,l2){
      var result = [].concat(l1);
      for(var i = 0; i < l2.length; i++){
  	var found = false;
  	for(var j = 0; j < l1.length; j++){
  	    if(l2[i] == l1[j]){
  		found = true;
  		break;
  	    }
  	}
  	if(!found) result.push(l2[i]);
      }
      return result;
  };

  // removes everything in l2 from l1
  var remove_all = function(l1,l2){
      var result = [];
      for(var i = 0; i < l1.length; i++){
  	var found = false;
  	for(var j = 0; j < l2.length; j++){
  	    if(l1[i] == l2[j]){
  		found = true;
  		break;
  	    }
  	}
  	if(!found) result.push(l1[i]);
      }
      return result;
  };

  var search = function(q, nodes){
      var result = [];
      if(!q || q.length == 0){
  	for(var n in nodes){
  	    result.push(n);
  	}
      }
      else if(q[0] == "and"){
  	result = search(q[1][0],nodes);
  	for(var i = 1; i < q[1].length; i++){
  	    var res = search(q[1][i],nodes);
  	    result = intersect_lists(result,res);
  	}
      }
      else if(q[0] == "or"){
  	for(var i = 0; i < q[1].length; i++){
  	    var res = search(q[1][i],nodes);
  	    result = union_lists(result,res);
  	}
      }
      else if(q[0] == "not"){
  	result = Object.keys(nodes);
  	for(var i = 0; i < q[1].length; i++){
  	    var res = search(q[1][i],nodes);
  	    result = remove_all(result,res);
  	}
      }
      else if(q[0] == "edge"){
  	var edge = q[1];
  	var res = search(edge.query,nodes);
  	for(var i = 0; i < res.length; i++){
  	    var node_id = res[i];
  	    for(var n in nodes){
  		if(edge.name == "*"){
  		    for(var e in nodes[n].edges[edge.dir]){
  			if(nodes[n].edges[edge.dir][e].indexOf(node_id) >= 0){
  			    result = union_lists(result,[n]);
  			    break;
  			}
  		    }
  		}
  		else if(edge.name in nodes[n].edges[edge.dir] && nodes[n].edges[edge.dir][edge.name].indexOf(node_id) >= 0){
  		    result = union_lists(result,[n]);
  		}
  	    }
  	}
      }
      else if(q[0] == "name"){
  	var name = q[1].toLowerCase();
  	for(var n in nodes){
  	    if(name == "*" || nodes[n].name.toLowerCase().indexOf(name) >= 0){
  		result.push(n);
  	    }
  	}
      }
      else {
  	console.log("Unrecognised query type:",q[0]);
      }
      return result;
  };
  var search_1 = search;

  Vue.config.productionTip = true;

  Vue.component('nodeIndex', NodeIndex);
  Vue.component('labelIndex', LabelIndex);
  Vue.component('historyDisplay', HistoryDisplay);
  Vue.component('edgeDisplay', EdgeDisplay);

  Vue.category_plugins = {
      'cat-slideshow': Vue.component('catSlideshow', SlideshowPlugin),
      'cat-video': Vue.component('catVideo', VideoPlugin),
      'cat-query': Vue.component('catQuery', QueryPlugin),
      'cat-link': Vue.component('catLink', LinkPlugin),
  //    'cat-math': Vue.component('catMath', MathPlugin)
  };

  Vue.category_search_plugin = Vue.component('search', SearchDisplay);

  Vue.category_query = new query_1.Parser();
  Vue.category_search = search_1;

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
  };
  window.onload = function() {
   
  new Vue({
      router,
      store,
      created: function() {
  	this.$store.dispatch('refresh_metadata');
      },
      render: function (h) { return h(App) }
  }).$mount('#cafeapp');

  };

}(Vue, VueRouter, Vuex));
